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
  liker?: any; // بيانات المرسل
  liked_user?: any; // بيانات المستقبل
}

// تم إزالة الواجهات غير المطلوبة لتبسيط الخدمة

// خدمة الإعجابات وطلبات التواصل المحسنة
export class LikesService {

  /**
   * إرسال إعجاب مع حساب التوافق والتحقق من القيود
   */
  static async sendLike(
    likerId: string,
    likedUserId: string,
    likeType: 'like' | 'super_like' | 'interest' = 'like',
    message?: string
  ): Promise<{ success: boolean; error?: any; data?: Like; isMatch?: boolean }> {
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

      let isMatch = false;
      if (mutualLike) {
        // إعجاب متبادل - إنشاء مطابقة
        await this.createMutualMatch(likerId, likedUserId);

        // تحديث حالة الإعجابات إلى مقبولة
        await supabase
          .from('likes')
          .update({ status: 'accepted' })
          .in('id', [data.id, mutualLike.id]);

        isMatch = true;

        // تم إزالة تحديث الإحصائيات لتبسيط الخدمة
      }

      return { success: true, data, isMatch };
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
      // جلب الإعجابات مع بيانات المرسلين في استعلام واحد
      const { data: likes, error } = await supabase
        .from('likes')
        .select(`
          *,
          liker:users!likes_liker_id_fkey(
            id, first_name, last_name, age, city, education,
            profession, religious_commitment, verified
          )
        `)
        .eq('liked_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching received likes:', error);
        // في حالة فشل الاستعلام المدمج، نجرب الطريقة البديلة
        return await this.getReceivedLikesAlternative(userId);
      }

      // معالجة البيانات وإضافة قيم افتراضية للمستخدمين المفقودين
      const processedLikes = (likes || []).map(like => ({
        ...like,
        liker: like.liker || {
          id: like.liker_id,
          first_name: 'مستخدم',
          last_name: 'غير متاح',
          age: null,
          city: 'غير محدد',
          education: 'غير محدد',
          profession: 'غير محدد',
          religious_commitment: 'غير محدد',
          verified: false
        }
      }));

      return { data: processedLikes, error: null };
    } catch (error) {
      console.error('Error in getReceivedLikes:', error);
      return await this.getReceivedLikesAlternative(userId);
    }
  }

  // طريقة بديلة لجلب الإعجابات المستلمة
  private static async getReceivedLikesAlternative(userId: string): Promise<{ data: any[]; error: any }> {
    try {
      const { data: likes, error } = await supabase
        .from('likes')
        .select('*')
        .eq('liked_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error };
      }

      // إضافة بيانات افتراضية لجميع الإعجابات
      const likesWithDefaultUsers = (likes || []).map(like => ({
        ...like,
        liker: {
          id: like.liker_id,
          first_name: 'مستخدم',
          last_name: 'غير متاح',
          age: null,
          city: 'غير محدد',
          education: 'غير محدد',
          profession: 'غير محدد',
          religious_commitment: 'غير محدد',
          verified: false
        }
      }));

      return { data: likesWithDefaultUsers, error: null };
    } catch (error) {
      return { data: [], error };
    }
  }

  // تم إزالة دالة الإعجابات المرسلة لتبسيط الخدمة

  // تم إزالة دوال طلبات التواصل لتبسيط الخدمة

  // تم إزالة دوال الرد على طلبات التواصل لتبسيط الخدمة

  // تم إزالة دوال طلبات التواصل والمحادثات لتبسيط الخدمة

  // تم إزالة دوال حذف الإعجابات وطلبات التواصل لتبسيط الخدمة

  // تم إزالة دوال الإحصائيات والمشاهدات والاقتراحات الذكية لتبسيط الخدمة
}

export default LikesService;
