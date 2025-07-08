import { supabase } from './supabase';

// أنواع البيانات للإعجابات وطلبات التواصل
export interface Like {
  id: string;
  liker_id: string;
  liked_user_id: string;
  like_type: 'like' | 'super_like' | 'interest';
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  updated_at?: string;
  expires_at?: string;
}

export interface ContactRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  request_type: 'direct' | 'through_family' | 'formal';
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  family_email?: string;
  family_phone?: string;
  created_at: string;
  updated_at?: string;
  expires_at: string;
}

// خدمة الإعجابات وطلبات التواصل
export class LikesService {
  
  // إرسال إعجاب
  static async sendLike(
    likerId: string,
    likedUserId: string,
    likeType: 'like' | 'super_like' | 'interest' = 'like',
    message?: string
  ): Promise<{ success: boolean; error?: any; data?: Like }> {
    try {
      // التحقق من عدم وجود إعجاب سابق
      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('liker_id', likerId)
        .eq('liked_user_id', likedUserId)
        .single();

      if (existingLike) {
        return { success: false, error: 'لقد أرسلت إعجاباً لهذا المستخدم من قبل' };
      }

      // إنشاء إعجاب جديد
      const newLike = {
        liker_id: likerId,
        liked_user_id: likedUserId,
        like_type: likeType,
        message: message,
        status: 'pending' as const,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // ينتهي خلال أسبوع
      };

      const { data, error } = await supabase
        .from('likes')
        .insert(newLike)
        .select()
        .single();

      if (error) {
        return { success: false, error };
      }

      // التحقق من وجود إعجاب متبادل
      const { data: mutualLike } = await supabase
        .from('likes')
        .select('*')
        .eq('liker_id', likedUserId)
        .eq('liked_user_id', likerId)
        .eq('status', 'pending')
        .single();

      if (mutualLike) {
        // إعجاب متبادل - إنشاء مطابقة
        await this.createMutualMatch(likerId, likedUserId);
        
        // تحديث حالة الإعجابات إلى مقبولة
        await supabase
          .from('likes')
          .update({ status: 'accepted' })
          .in('id', [data.id, mutualLike.id]);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }

  // الرد على إعجاب
  static async respondToLike(
    likeId: string,
    response: 'accepted' | 'rejected'
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const { data: like, error: fetchError } = await supabase
        .from('likes')
        .select('*')
        .eq('id', likeId)
        .single();

      if (fetchError || !like) {
        return { success: false, error: 'الإعجاب غير موجود' };
      }

      // تحديث حالة الإعجاب
      const { error: updateError } = await supabase
        .from('likes')
        .update({ 
          status: response,
          updated_at: new Date().toISOString()
        })
        .eq('id', likeId);

      if (updateError) {
        return { success: false, error: updateError };
      }

      // إذا تم القبول، إنشاء مطابقة
      if (response === 'accepted') {
        await this.createMutualMatch(like.liker_id, like.liked_user_id);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  // إنشاء مطابقة متبادلة
  private static async createMutualMatch(user1Id: string, user2Id: string) {
    try {
      // التحقق من عدم وجود مطابقة سابقة
      const { data: existingMatch } = await supabase
        .from('matches')
        .select('*')
        .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
        .single();

      if (!existingMatch) {
        await supabase
          .from('matches')
          .insert({
            user1_id: user1Id,
            user2_id: user2Id,
            compatibility_score: 85, // نقاط افتراضية للمطابقة المتبادلة
            match_type: 'mutual_like',
            status: 'active'
          });
      }
    } catch (error) {
      console.error('Error creating mutual match:', error);
    }
  }

  // الحصول على الإعجابات المستلمة
  static async getReceivedLikes(userId: string): Promise<{ data: any[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select(`
          *,
          liker:users!likes_liker_id_fkey(
            id, first_name, last_name, age, city, education, 
            profession, religious_commitment, verified
          )
        `)
        .eq('liked_user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error };
    }
  }

  // الحصول على الإعجابات المرسلة
  static async getSentLikes(userId: string): Promise<{ data: any[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select(`
          *,
          liked_user:users!likes_liked_user_id_fkey(
            id, first_name, last_name, age, city, education, 
            profession, religious_commitment, verified
          )
        `)
        .eq('liker_id', userId)
        .order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error };
    }
  }

  // إرسال طلب تواصل رسمي
  static async sendContactRequest(
    senderId: string,
    receiverId: string,
    message: string,
    requestType: 'direct' | 'through_family' | 'formal' = 'direct',
    familyEmail?: string,
    familyPhone?: string
  ): Promise<{ success: boolean; error?: any; data?: ContactRequest }> {
    try {
      // التحقق من عدم وجود طلب سابق نشط
      const { data: existingRequest } = await supabase
        .from('contact_requests')
        .select('*')
        .eq('sender_id', senderId)
        .eq('receiver_id', receiverId)
        .in('status', ['pending', 'accepted'])
        .single();

      if (existingRequest) {
        return { success: false, error: 'يوجد طلب تواصل نشط مع هذا المستخدم' };
      }

      // إنشاء طلب تواصل جديد
      const newRequest = {
        sender_id: senderId,
        receiver_id: receiverId,
        message: message,
        request_type: requestType,
        status: 'pending' as const,
        family_email: familyEmail,
        family_phone: familyPhone,
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // ينتهي خلال أسبوعين
      };

      const { data, error } = await supabase
        .from('contact_requests')
        .insert(newRequest)
        .select()
        .single();

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }

  // الرد على طلب تواصل
  static async respondToContactRequest(
    requestId: string,
    response: 'accepted' | 'rejected'
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const { data: request, error: fetchError } = await supabase
        .from('contact_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError || !request) {
        return { success: false, error: 'طلب التواصل غير موجود' };
      }

      // تحديث حالة الطلب
      const { error: updateError } = await supabase
        .from('contact_requests')
        .update({ 
          status: response,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) {
        return { success: false, error: updateError };
      }

      // إذا تم القبول، إنشاء محادثة
      if (response === 'accepted') {
        await this.createConversation(request.sender_id, request.receiver_id);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  // إنشاء محادثة جديدة
  private static async createConversation(user1Id: string, user2Id: string) {
    try {
      // التحقق من عدم وجود محادثة سابقة
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
        .single();

      if (!existingConversation) {
        await supabase
          .from('conversations')
          .insert({
            user1_id: user1Id,
            user2_id: user2Id,
            status: 'active'
          });
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  }

  // الحصول على طلبات التواصل المستلمة
  static async getReceivedContactRequests(userId: string): Promise<{ data: any[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select(`
          *,
          sender:users!contact_requests_sender_id_fkey(
            id, first_name, last_name, age, city, education, 
            profession, religious_commitment, verified
          )
        `)
        .eq('receiver_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error };
    }
  }

  // الحصول على طلبات التواصل المرسلة
  static async getSentContactRequests(userId: string): Promise<{ data: any[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select(`
          *,
          receiver:users!contact_requests_receiver_id_fkey(
            id, first_name, last_name, age, city, education, 
            profession, religious_commitment, verified
          )
        `)
        .eq('sender_id', userId)
        .order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error };
    }
  }

  // حذف إعجاب
  static async deleteLike(likeId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', likeId);

      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  }

  // سحب طلب تواصل
  static async withdrawContactRequest(requestId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: 'withdrawn' })
        .eq('id', requestId);

      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export default LikesService;
