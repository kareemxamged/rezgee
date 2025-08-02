import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sbtzngewizgeqzfbhfjy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidHpuZ2V3aXpnZXF6ZmJoZmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzc5MTMsImV4cCI6MjA2NjcxMzkxM30.T8iv9C4OeKAb-e4Oz6uw3tFnMrgFK3SKN6fVCrBEUGo';

// Create Supabase client with optimized auth settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // تحسين إعدادات تجديد الرمز لتجنب التجديد المفرط
    flowType: 'pkce',
    // تخصيص storage للتحكم بشكل أفضل في الجلسة
    storage: typeof window !== 'undefined' ? {
      getItem: (key: string) => {
        try {
          return window.localStorage.getItem(key);
        } catch {
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          window.localStorage.setItem(key, value);
        } catch {
          // تجاهل الأخطاء في حالة امتلاء التخزين
        }
      },
      removeItem: (key: string) => {
        try {
          window.localStorage.removeItem(key);
        } catch {
          // تجاهل الأخطاء
        }
      },
    } : undefined,
  },
  // إعدادات إضافية للشبكة
  global: {
    headers: {
      'X-Client-Info': 'rezge-app',
    },
    // تقليل timeout للكشف السريع عن مشاكل الاتصال
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(15000), // 15 seconds timeout
      });
    },
  },
  // إعدادات realtime محسنة
  realtime: {
    params: {
      eventsPerSecond: 5, // تقليل الأحداث لتوفير الموارد
    },
  },
});

// Database types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female';
  city?: string;
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | 'unmarried' | 'divorced_female' | 'widowed_female';
  education?: string;
  profession?: string;
  religious_commitment?: 'high' | 'medium' | 'practicing';
  bio?: string;
  looking_for?: string;
  profile_visibility?: 'public' | 'members' | 'verified';
  show_phone?: boolean;
  show_email?: boolean;
  allow_messages?: boolean;
  family_can_view?: boolean;
  two_factor_enabled?: boolean;
  login_notifications?: boolean;
  message_notifications?: boolean;
  verified?: boolean;
  status?: 'active' | 'suspended' | 'inactive';
  last_login?: string;
  created_at?: string;
  updated_at?: string;

  // رقم العضوية
  membership_number?: string;

  // الحالة الاجتماعية المطورة
  marriage_type?: 'first_wife' | 'second_wife' | 'only_wife' | 'no_objection_polygamy';
  children_count?: number;

  // الجنسية والإقامة
  residence_location?: string;
  nationality?: string;

  // المواصفات الجسدية
  weight?: number;
  height?: number;
  skin_color?: 'very_fair' | 'fair' | 'medium' | 'olive' | 'dark';
  body_type?: 'slim' | 'average' | 'athletic' | 'heavy';

  // الالتزام الديني المطور
  religiosity_level?: 'not_religious' | 'slightly_religious' | 'religious' | 'very_religious' | 'prefer_not_say';
  prayer_commitment?: 'dont_pray' | 'pray_all' | 'pray_sometimes' | 'prefer_not_say';
  smoking?: 'yes' | 'no';
  beard?: 'yes' | 'no'; // للذكور فقط
  hijab?: 'no_hijab' | 'hijab' | 'niqab' | 'prefer_not_say'; // للإناث فقط

  // الدراسة والعمل المطور
  education_level?: 'primary' | 'secondary' | 'diploma' | 'bachelor' | 'master' | 'phd';
  financial_status?: 'poor' | 'below_average' | 'average' | 'above_average' | 'wealthy';
  work_field?: string;
  job_title?: string;

  // الدخل والصحة
  monthly_income?: 'less_3000' | '3000_5000' | '5000_8000' | '8000_12000' | '12000_20000' | 'more_20000' | 'prefer_not_say';
  health_status?: 'excellent' | 'very_good' | 'good' | 'fair' | 'poor' | 'prefer_not_say';
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  status?: 'active' | 'blocked' | 'archived';
  family_involved?: boolean;
  family_email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type?: 'text' | 'image' | 'file';
  moderation_status?: 'pending' | 'approved' | 'rejected';
  moderation_reason?: string;
  flagged_words?: string[];
  severity?: 'low' | 'medium' | 'high';
  read_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  compatibility_score: number;
  match_type: 'suggested' | 'mutual_like' | 'conversation_started';
  status: 'active' | 'inactive' | 'blocked';
  created_at?: string;
  updated_at?: string;
}

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

export interface Report {
  id: string;
  reported_user_id: string;
  reporter_id: string;
  reason: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'approved' | 'rejected' | 'resolved';
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}



export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export interface SiteText {
  id: string;
  text_key: string;
  category: string;
  language: string;
  text_value: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface TextChangeLog {
  id: string;
  text_id: string;
  old_value?: string;
  new_value?: string;
  change_type: 'create' | 'update' | 'delete';
  changed_by?: string;
  changed_at?: string;
  change_reason?: string;
}

// Authentication functions
export const authService = {
  // Sign up new user
  async signUp(email: string, password: string, userData: Partial<User>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Insert user profile data
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            password_hash: 'handled_by_supabase_auth',
            ...userData
          });

        if (profileError) throw profileError;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign in user
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update last login
      if (data.user) {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  }
};

// User service functions
export const userService = {
  // Get all users with filters
  async getUsers(filters: {
    ageMin?: number;
    ageMax?: number;
    city?: string;
    gender?: string;
    maritalStatus?: string;
    religiousCommitment?: string;
    limit?: number;
    offset?: number;
    excludeUserId?: string; // لاستبعاد المستخدم الحالي
    oppositeGenderOnly?: boolean; // لإظهار الجنس المقابل فقط
  } = {}) {
    let query = supabase
      .from('users')
      .select('*')
      .eq('status', 'active')
      .eq('verified', true);

    // استبعاد المستخدم الحالي من النتائج
    if (filters.excludeUserId) {
      query = query.neq('id', filters.excludeUserId);
    }

    if (filters.ageMin) {
      query = query.gte('age', filters.ageMin);
    }
    if (filters.ageMax) {
      query = query.lte('age', filters.ageMax);
    }
    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters.gender) {
      query = query.eq('gender', filters.gender);
    }
    if (filters.maritalStatus && filters.maritalStatus !== 'any') {
      query = query.eq('marital_status', filters.maritalStatus);
    }
    if (filters.religiousCommitment && filters.religiousCommitment !== 'any') {
      query = query.eq('religious_commitment', filters.religiousCommitment);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // البحث عن المستخدمين مع فلترة الجنس المقابل (للتعارف الشرعي)
  async searchUsersForMatching(currentUserId: string, currentUserGender: 'male' | 'female', filters: {
    ageMin?: number;
    ageMax?: number;
    city?: string;
    maritalStatus?: string;
    religiousCommitment?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      // تحديد الجنس المطلوب (عكس جنس المستخدم الحالي)
      const targetGender = currentUserGender === 'male' ? 'female' : 'male';

      console.log(`🔍 البحث للمستخدم ${currentUserId} (${currentUserGender}) - البحث عن ${targetGender}`);
      console.log('🔧 فلاتر البحث:', filters);

      let query = supabase
        .from('users')
        .select(`
          *,
          blocked_by:user_blocks!user_blocks_blocked_user_id_fkey(blocker_id),
          blocking:user_blocks!user_blocks_blocker_id_fkey(blocked_user_id)
        `)
        .eq('status', 'active')
        .eq('verified', true)
        .eq('gender', targetGender) // إظهار الجنس المقابل فقط
        .neq('id', currentUserId); // استبعاد المستخدم الحالي

      console.log(`📋 الشروط الأساسية: status=active, verified=true, gender=${targetGender}, id!=${currentUserId}`);

      if (filters.ageMin) {
        query = query.gte('age', filters.ageMin);
        console.log(`📅 فلتر العمر الأدنى: ${filters.ageMin}`);
      }
      if (filters.ageMax) {
        query = query.lte('age', filters.ageMax);
        console.log(`📅 فلتر العمر الأقصى: ${filters.ageMax}`);
      }
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
        console.log(`🏙️ فلتر المدينة: ${filters.city}`);
      }
      if (filters.maritalStatus && filters.maritalStatus !== 'any') {
        query = query.eq('marital_status', filters.maritalStatus);
        console.log(`💍 فلتر الحالة الاجتماعية: ${filters.maritalStatus}`);
      }
      if (filters.religiousCommitment && filters.religiousCommitment !== 'any') {
        query = query.eq('religious_commitment', filters.religiousCommitment);
        console.log(`🕌 فلتر الالتزام الديني: ${filters.religiousCommitment}`);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
        console.log(`📊 حد النتائج: ${filters.limit}`);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        console.log(`📄 الإزاحة: ${filters.offset}`);
      }

      console.log('🚀 تنفيذ الاستعلام...');
      const { data, error } = await query;

      if (error) {
        console.error('❌ خطأ في الاستعلام:', error);
        console.error('❌ تفاصيل الخطأ:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });

        // فحص خاص لأخطاء RLS
        if (error.message?.includes('RLS') || error.message?.includes('policy')) {
          console.error('🔒 خطأ في Row Level Security - تحقق من سياسات الأمان');
        }

        return { data: null, error };
      }

      if (data) {
        console.log(`✅ تم العثور على ${data.length} نتيجة قبل فلترة المحظورين`);

        // Filter out blocked users
        const filteredData = data.filter(user => {
          // Check if current user is blocked by this user
          const isBlockedByUser = user.blocking?.some((block: any) =>
            block.blocked_user_id === currentUserId
          );

          // Check if current user has blocked this user
          const hasBlockedUser = user.blocked_by?.some((block: any) =>
            block.blocker_id === currentUserId
          );

          // Exclude if either user has blocked the other
          return !isBlockedByUser && !hasBlockedUser;
        });

        console.log(`🔒 تم استبعاد ${data.length - filteredData.length} مستخدم محظور`);
        console.log(`✅ النتائج النهائية: ${filteredData.length} مستخدم`);

        if (filteredData.length > 0) {
          console.log('📋 أول نتيجة:', {
            id: filteredData[0].id,
            name: `${filteredData[0].first_name} ${filteredData[0].last_name}`,
            age: filteredData[0].age,
            city: filteredData[0].city,
            gender: filteredData[0].gender
          });
        }

        // Clean up the data by removing the block information before returning
        const cleanData = filteredData.map(user => {
          const { blocked_by, blocking, ...cleanUser } = user;
          return cleanUser;
        });

        return { data: cleanData, error };
      } else {
        console.log('⚠️ لا توجد بيانات في النتيجة');
        return { data: [], error };
      }
    } catch (error) {
      console.error('💥 خطأ غير متوقع في searchUsersForMatching:', error);
      return { data: null, error };
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  },

  // Get user statistics
  async getUserStats() {
    const { data: totalUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact' });

    const { data: activeUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .eq('status', 'active');

    const { data: verifiedUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .eq('verified', true);

    return {
      total: totalUsers?.length || 0,
      active: activeUsers?.length || 0,
      verified: verifiedUsers?.length || 0
    };
  },

  // Get public user profile by ID (for viewing other users' profiles)
  async getPublicUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          first_name,
          last_name,
          age,
          gender,
          city,
          marital_status,
          education,
          profession,
          religious_commitment,
          bio,
          looking_for,
          verified,
          status,
          created_at,
          marriage_type,
          children_count,
          residence_location,
          nationality,
          weight,
          height,
          skin_color,
          body_type,
          religiosity_level,
          prayer_commitment,
          smoking,
          beard,
          hijab,
          education_level,
          financial_status,
          work_field,
          job_title,
          monthly_income,
          health_status
        `)
        .eq('id', userId)
        .eq('status', 'active')
        .eq('verified', true)
        .single();

      return { data, error };
    } catch (err) {
      console.error('Error fetching public user profile:', err);
      return { data: null, error: err };
    }
  }
};

// Message service functions
export const messageService = {
  // Get conversations for a user
  async getConversations(userId: string) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          user1_id,
          user2_id,
          status,
          family_involved,
          family_email,
          created_at,
          updated_at,
          user1:users!conversations_user1_id_fkey(id, first_name, last_name, verified),
          user2:users!conversations_user2_id_fkey(id, first_name, last_name, verified)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return { data: [], error };
      }

      // Get last message for each conversation
      const conversationsWithLastMessage = await Promise.all(
        (data || []).map(async (conversation) => {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conversation.id)
            .eq('moderation_status', 'approved')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conversation,
            last_message: lastMessage?.content || null,
            last_message_at: lastMessage?.created_at || conversation.created_at,
            last_message_sender_id: lastMessage?.sender_id || null,
            last_message_read: false // We'll implement read status later
          };
        })
      );

      // Sort by last message time
      conversationsWithLastMessage.sort((a, b) =>
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );

      return { data: conversationsWithLastMessage, error: null };
    } catch (err) {
      console.error('Unexpected error in getConversations:', err);
      return { data: [], error: err };
    }
  },

  // Get messages for a conversation
  async getMessages(conversationId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          content,
          moderation_status,
          created_at,
          sender:users(id, first_name, last_name)
        `)
        .eq('conversation_id', conversationId)
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error('Unexpected error in getMessages:', err);
      return { data: [], error: err };
    }
  },

  // Send a message
  async sendMessage(conversationId: string, senderId: string, content: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
          moderation_status: 'approved' // Auto-approve for now, can add moderation later
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting message:', error);
        return { data: null, error };
      }

      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error in sendMessage:', err);
      return { data: null, error: err };
    }
  },

  // Create or get conversation
  async createConversation(user1Id: string, user2Id: string) {
    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
      .single();

    if (existing) {
      return { data: existing, error: null };
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id
      })
      .select()
      .single();

    return { data, error };
  },

  // Update conversation
  async updateConversation(conversationId: string, updates: Partial<Conversation>) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', conversationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating conversation:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error in updateConversation:', err);
      return { data: null, error: err };
    }
  },

  // Delete Chat
  async deleteConversation(conversationId: string) {
    try {
      // First delete all messages in the conversation
      await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      // Then delete the conversation
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) {
        console.error('Error deleting conversation:', error);
        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected error in deleteConversation:', err);
      return { error: err };
    }
  }
};

// Report service functions
export const reportService = {
  // Create a new report
  async createReport(reportedUserId: string, reporterId: string, reason: string, description?: string, severity: 'low' | 'medium' | 'high' = 'medium') {
    try {
      console.log('🚩 Starting report creation:', { reportedUserId, reporterId, reason, severity });

      // Validate input parameters
      if (!reportedUserId || !reporterId || !reason) {
        console.error('❌ Invalid parameters: reportedUserId, reporterId, and reason are required');
        return { data: null, error: 'معاملات غير صحيحة: معرف المبلغ عنه والمبلغ والسبب مطلوبان' };
      }

      if (reportedUserId === reporterId) {
        console.error('❌ User cannot report themselves');
        return { data: null, error: 'لا يمكن للمستخدم الإبلاغ عن نفسه' };
      }

      // Validate reason length
      if (reason.trim().length < 10) {
        console.error('❌ Report reason too short');
        return { data: null, error: 'سبب الإبلاغ قصير جداً، يجب أن يكون على الأقل 10 أحرف' };
      }

      // Check if user has already reported this user recently (within 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: existingReport, error: checkError } = await supabase
        .from('reports')
        .select('id, created_at')
        .eq('reporter_id', reporterId)
        .eq('reported_user_id', reportedUserId)
        .gte('created_at', twentyFourHoursAgo)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing reports:', checkError);
        return { data: null, error: 'خطأ في التحقق من التقارير الموجودة' };
      }

      if (existingReport) {
        console.log('⚠️ User has already reported this user recently');
        return { data: null, error: 'لقد قمت بالإبلاغ عن هذا المستخدم مؤخراً. يرجى الانتظار 24 ساعة قبل الإبلاغ مرة أخرى' };
      }

      // Create the report
      const reportData = {
        reported_user_id: reportedUserId,
        reporter_id: reporterId,
        reason: reason.trim(),
        description: description?.trim() || null,
        severity,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('reports')
        .insert(reportData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating report:', error);
        return { data: null, error: 'فشل في إنشاء التقرير' };
      }

      console.log('✅ Report created successfully:', data);
      return { data, error: null };
    } catch (err) {
      console.error('💥 Unexpected error in createReport:', err);
      return { data: null, error: 'خطأ غير متوقع أثناء إنشاء التقرير' };
    }
  },

  // Get reports for admin
  async getReports(status?: string, limit: number = 50) {
    try {
      let query = supabase
        .from('reports')
        .select(`
          id,
          reason,
          description,
          severity,
          status,
          admin_notes,
          created_at,
          updated_at,
          reported_user:users!reports_reported_user_id_fkey(id, first_name, last_name, email),
          reporter:users!reports_reporter_id_fkey(id, first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reports:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error('Unexpected error in getReports:', err);
      return { data: [], error: err };
    }
  },

  // Update report status (for admin)
  async updateReportStatus(reportId: string, status: 'pending' | 'approved' | 'rejected' | 'resolved', adminNotes?: string) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update({
          status,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId)
        .select()
        .single();

      if (error) {
        console.error('Error updating report status:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error in updateReportStatus:', err);
      return { data: null, error: err };
    }
  },

  // Get user's reports (reports made by user)
  async getUserReports(userId: string) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          id,
          reason,
          description,
          severity,
          status,
          created_at,
          reported_user:users!reports_reported_user_id_fkey(id, first_name, last_name)
        `)
        .eq('reporter_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user reports:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error('Unexpected error in getUserReports:', err);
      return { data: [], error: err };
    }
  }
};

// Block service functions
export const blockService = {
  // Block a user completely (global block)
  async blockUserGlobally(blockerId: string, blockedUserId: string, conversationId?: string) {
    try {
      console.log('🚫 Starting global user block:', { blockerId, blockedUserId, conversationId });

      // Validate input parameters
      if (!blockerId || !blockedUserId) {
        console.error('❌ Invalid parameters: blockerId and blockedUserId are required');
        return { success: false, error: 'معاملات غير صحيحة: معرف الحاظر والمحظور مطلوبان' };
      }

      if (blockerId === blockedUserId) {
        console.error('❌ User cannot block themselves');
        return { success: false, error: 'لا يمكن للمستخدم حظر نفسه' };
      }

      // Check if user is already blocked
      const { data: existingBlock, error: checkError } = await supabase
        .from('user_blocks')
        .select('id, status')
        .eq('blocker_id', blockerId)
        .eq('blocked_user_id', blockedUserId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing block:', checkError);
        return { success: false, error: 'خطأ في التحقق من الحظر الموجود' };
      }

      if (existingBlock && existingBlock.status === 'active') {
        console.log('⚠️ User is already blocked');
        return { success: false, error: 'المستخدم محظور بالفعل' };
      }

      // Create or update the global block record
      const blockData = {
        blocker_id: blockerId,
        blocked_user_id: blockedUserId,
        conversation_id: conversationId,
        block_type: 'global',
        status: 'active',
        blocked_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: blockResult, error: globalBlockError } = await supabase
        .from('user_blocks')
        .upsert(blockData, {
          onConflict: 'blocker_id,blocked_user_id'
        })
        .select()
        .single();

      if (globalBlockError) {
        console.error('❌ Error creating global block record:', globalBlockError);
        return { success: false, error: 'فشل في إنشاء سجل الحظر الشامل' };
      }

      console.log('✅ Global block record created:', blockResult);

      // Update conversation status if conversation ID is provided
      if (conversationId) {
        const { error: conversationError } = await supabase
          .from('conversations')
          .update({
            status: 'blocked',
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId);

        if (conversationError) {
          console.error('⚠️ Error updating conversation status:', conversationError);
          // Don't return error here - the global block is more important
        } else {
          console.log('✅ Conversation status updated to blocked');
        }
      }

      console.log('🎉 User blocked globally successfully');
      return { success: true, error: null, data: blockResult };
    } catch (err) {
      console.error('💥 Unexpected error in blockUserGlobally:', err);
      return { success: false, error: 'خطأ غير متوقع أثناء حظر المستخدم' };
    }
  },

  // Block a user in a conversation (legacy method - now calls global block)
  async blockUserInConversation(conversationId: string, blockerId: string, blockedUserId: string) {
    return this.blockUserGlobally(blockerId, blockedUserId, conversationId);
  },

  // Check if user is blocked globally
  async isUserBlockedGlobally(blockerId: string, blockedUserId: string) {
    try {
      const { data, error } = await supabase
        .from('user_blocks')
        .select('*')
        .eq('blocker_id', blockerId)
        .eq('blocked_user_id', blockedUserId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking global block status:', error);
        return { isBlocked: false, error };
      }

      return { isBlocked: !!data, error: null };
    } catch (err) {
      console.error('Unexpected error in isUserBlockedGlobally:', err);
      return { isBlocked: false, error: err };
    }
  },

  // Check if user is blocked in conversation (checks both conversation status and global blocks)
  async isUserBlockedInConversation(conversationId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('status, user1_id, user2_id')
        .eq('id', conversationId)
        .single();

      if (error) {
        console.error('Error checking conversation status:', error);
        return { isBlocked: false, error };
      }

      // If conversation is blocked, check if this user is involved
      if (data?.status === 'blocked') {
        const isInvolved = data.user1_id === userId || data.user2_id === userId;
        return { isBlocked: isInvolved, error: null };
      }

      return { isBlocked: false, error: null };
    } catch (err) {
      console.error('Unexpected error in isUserBlockedInConversation:', err);
      return { isBlocked: false, error: err };
    }
  },

  // Unblock user globally
  async unblockUserGlobally(blockerId: string, blockedUserId: string, conversationId?: string) {
    try {
      console.log('🔓 Starting global user unblock:', { blockerId, blockedUserId, conversationId });

      // Validate input parameters
      if (!blockerId || !blockedUserId) {
        console.error('❌ Invalid parameters: blockerId and blockedUserId are required');
        return { success: false, error: 'معاملات غير صحيحة: معرف الحاظر والمحظور مطلوبان' };
      }

      // Check if user is actually blocked
      const { data: existingBlock, error: checkError } = await supabase
        .from('user_blocks')
        .select('id, status')
        .eq('blocker_id', blockerId)
        .eq('blocked_user_id', blockedUserId)
        .eq('status', 'active')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing block:', checkError);
        return { success: false, error: 'خطأ في التحقق من الحظر الموجود' };
      }

      if (!existingBlock) {
        console.log('⚠️ User is not blocked');
        return { success: false, error: 'المستخدم غير محظور' };
      }

      // Deactivate the global block record
      const { data: unblockResult, error: globalUnblockError } = await supabase
        .from('user_blocks')
        .update({
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('blocker_id', blockerId)
        .eq('blocked_user_id', blockedUserId)
        .eq('status', 'active')
        .select()
        .single();

      if (globalUnblockError) {
        console.error('❌ Error removing global block record:', globalUnblockError);
        return { success: false, error: 'فشل في إلغاء الحظر الشامل' };
      }

      console.log('✅ Global block record deactivated:', unblockResult);

      // Update conversation status if conversation ID is provided
      if (conversationId) {
        const { error: conversationError } = await supabase
          .from('conversations')
          .update({
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId);

        if (conversationError) {
          console.error('⚠️ Error unblocking conversation:', conversationError);
          // Don't return error here - the global unblock is more important
        } else {
          console.log('✅ Conversation status updated to active');
        }
      }

      console.log('🎉 User unblocked globally successfully');
      return { success: true, error: null, data: unblockResult };
    } catch (err) {
      console.error('💥 Unexpected error in unblockUserGlobally:', err);
      return { success: false, error: 'خطأ غير متوقع أثناء إلغاء حظر المستخدم' };
    }
  },

  // Unblock user in conversation (legacy method - now calls global unblock)
  async unblockUserInConversation(conversationId: string) {
    try {
      // Get conversation details to find the users involved
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('user1_id, user2_id')
        .eq('id', conversationId)
        .single();

      if (convError || !conversation) {
        console.error('Error getting conversation details:', convError);
        return { success: false, error: convError };
      }

      // For now, we'll just unblock the conversation without knowing who initiated the block
      // In a real scenario, we'd need to track who blocked whom
      const { error } = await supabase
        .from('conversations')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) {
        console.error('Error unblocking conversation:', error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in unblockUserInConversation:', err);
      return { success: false, error: err };
    }
  },

  // Get all users blocked by a specific user
  async getBlockedUsers(blockerId: string) {
    try {
      const { data, error } = await supabase
        .from('user_blocks')
        .select(`
          *,
          blocked_user:users!user_blocks_blocked_user_id_fkey(
            id, first_name, last_name, email, profile_picture
          )
        `)
        .eq('blocker_id', blockerId)
        .eq('status', 'active')
        .order('blocked_at', { ascending: false });

      if (error) {
        console.error('Error getting blocked users:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error('Unexpected error in getBlockedUsers:', err);
      return { data: [], error: err };
    }
  }
};

// Enhanced delete service functions
export const deleteService = {

  // Delete Chat completely (for both users)
  async deleteConversationCompletely(conversationId: string) {
    try {
      // First delete all messages in the conversation
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
        return { success: false, error: messagesError, type: 'complete' };
      }

      // Then delete the conversation
      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (conversationError) {
        console.error('Error deleting conversation:', conversationError);
        return { success: false, error: conversationError, type: 'complete' };
      }

      console.log('Conversation deleted completely:', conversationId);
      return { success: true, error: null, type: 'complete' };
    } catch (err) {
      console.error('Unexpected error in deleteConversationCompletely:', err);
      return { success: false, error: err, type: 'complete' };
    }
  },

  // Check if user can Delete Chat (admin or participant)
  async canUserDeleteConversation(conversationId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('user1_id, user2_id')
        .eq('id', conversationId)
        .single();

      if (error) {
        console.error('Error checking conversation ownership:', error);
        return { canDelete: false, error };
      }

      const canDelete = data?.user1_id === userId || data?.user2_id === userId;
      return { canDelete, error: null };
    } catch (err) {
      console.error('Unexpected error in canUserDeleteConversation:', err);
      return { canDelete: false, error: err };
    }
  }
};

// Admin service functions
export const adminService = {
  // Get pending messages for moderation
  async getPendingMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users(id, first_name, last_name),
        conversation:conversations(
          user1:users!conversations_user1_id_fkey(id, first_name, last_name),
          user2:users!conversations_user2_id_fkey(id, first_name, last_name)
        )
      `)
      .eq('moderation_status', 'pending')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Moderate message
  async moderateMessage(messageId: string, status: 'approved' | 'rejected', reason?: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({
        moderation_status: status,
        moderation_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select()
      .single();

    return { data, error };
  },

  // Get reports
  async getReports() {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        reported_user:users!reports_reported_user_id_fkey(id, first_name, last_name),
        reporter:users!reports_reporter_id_fkey(id, first_name, last_name)
      `)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Update report status
  async updateReportStatus(reportId: string, status: string, adminNotes?: string) {
    const { data, error } = await supabase
      .from('reports')
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();

    return { data, error };
  }
};

// Site Text Management functions
export const textService = {
  // Get all texts for a specific language
  async getTexts(language: string = 'ar') {
    const { data, error } = await supabase
      .from('site_texts')
      .select('*')
      .eq('language', language)
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('text_key', { ascending: true });

    return { data, error };
  },

  // Get texts by category
  async getTextsByCategory(category: string, language: string = 'ar') {
    const { data, error } = await supabase
      .from('site_texts')
      .select('*')
      .eq('category', category)
      .eq('language', language)
      .eq('is_active', true)
      .order('text_key', { ascending: true });

    return { data, error };
  },

  // Get a specific text by key and language
  async getText(textKey: string, language: string = 'ar') {
    const { data, error } = await supabase
      .from('site_texts')
      .select('*')
      .eq('text_key', textKey)
      .eq('language', language)
      .eq('is_active', true)
      .single();

    return { data, error };
  },

  // Get all texts formatted for i18next
  async getTextsForI18n(language: string = 'ar') {
    const { data, error } = await supabase
      .from('site_texts')
      .select('text_key, text_value')
      .eq('language', language)
      .eq('is_active', true);

    if (error) return { data: null, error };

    // Convert to nested object structure for i18next
    const texts: any = {};
    data?.forEach((item) => {
      const keys = item.text_key.split('.');
      let current = texts;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = item.text_value;
    });

    return { data: texts, error: null };
  },

  // Create or update a text
  async upsertText(textData: Partial<SiteText>) {
    const { data, error } = await supabase
      .from('site_texts')
      .upsert(textData, {
        onConflict: 'text_key,language'
      })
      .select()
      .single();

    return { data, error };
  },

  // Update a text
  async updateText(id: string, updates: Partial<SiteText>) {
    const { data, error } = await supabase
      .from('site_texts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete a text (soft delete by setting is_active to false)
  async deleteText(id: string) {
    const { data, error } = await supabase
      .from('site_texts')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Search texts
  async searchTexts(query: string, language?: string, category?: string) {
    let queryBuilder = supabase
      .from('site_texts')
      .select('*')
      .eq('is_active', true);

    if (language) {
      queryBuilder = queryBuilder.eq('language', language);
    }

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    queryBuilder = queryBuilder.or(`text_key.ilike.%${query}%,text_value.ilike.%${query}%,description.ilike.%${query}%`);

    const { data, error } = await queryBuilder
      .order('category', { ascending: true })
      .order('text_key', { ascending: true });

    return { data, error };
  },

  // Get all categories
  async getCategories() {
    const { data, error } = await supabase
      .from('site_texts')
      .select('category')
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (error) return { data: null, error };

    const categories = [...new Set(data?.map(item => item.category))];
    return { data: categories, error: null };
  },

  // Get text change logs
  async getTextChangeLogs(textId?: string, limit: number = 50) {
    let queryBuilder = supabase
      .from('text_change_logs')
      .select(`
        *,
        site_texts(text_key, category, language)
      `)
      .order('changed_at', { ascending: false })
      .limit(limit);

    if (textId) {
      queryBuilder = queryBuilder.eq('text_id', textId);
    }

    const { data, error } = await queryBuilder;
    return { data, error };
  }
};

// تم نقل مراقب حالة المصادقة إلى AuthContext لتجنب التكرار والتداخل

// دالة للتحقق من صحة الجلسة وتجنب التجديد غير الضروري
export const isSessionValid = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return false;
    }

    // التحقق من انتهاء صلاحية الرمز (مع هامش أمان 5 دقائق)
    const expiresAt = session.expires_at;
    if (!expiresAt) {
      return false; // إذا لم يكن هناك وقت انتهاء، فالجلسة غير صالحة
    }

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expiresAt - now;

    // إذا كان الرمز سينتهي خلال 5 دقائق أو أقل، فهو يحتاج تجديد
    return timeUntilExpiry > 300; // 5 minutes
  } catch (error) {
    console.error('Error checking session validity:', error);
    return false;
  }
};

// دالة لتجديد الجلسة بشكل يدوي عند الحاجة فقط
export const refreshSessionIfNeeded = async (): Promise<boolean> => {
  try {
    const isValid = await isSessionValid();

    if (isValid) {
      console.log('✅ Session is still valid, no refresh needed');
      return true;
    }

    console.log('🔄 Session needs refresh, refreshing...');
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error('❌ Failed to refresh session:', error);
      return false;
    }

    console.log('✅ Session refreshed successfully');
    return !!data.session;
  } catch (error) {
    console.error('❌ Error refreshing session:', error);
    return false;
  }
};

// دالة إعادة المحاولة للطلبات الفاشلة
export const retrySupabaseRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error: any) {
      const isLastAttempt = i === maxRetries - 1;
      const isNetworkError = error.message?.includes('Failed to fetch') ||
                            error.message?.includes('ERR_CONNECTION_CLOSED') ||
                            error.message?.includes('NetworkError') ||
                            error.name === 'AbortError';

      if (isLastAttempt) {
        console.error('❌ فشل في جميع المحاولات:', error);
        throw error;
      }

      if (isNetworkError) {
        const delay = baseDelay * Math.pow(2, i); // Exponential backoff
        console.warn(`🔄 محاولة ${i + 1}/${maxRetries} فشلت، إعادة المحاولة خلال ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // إذا لم يكن خطأ شبكة، ارمي الخطأ فوراً
      throw error;
    }
  }

  throw new Error('فشل في جميع المحاولات');
};

// معالج أخطاء Supabase العام
export const handleSupabaseError = (error: any, context?: string) => {
  const errorMessage = error?.message || 'خطأ غير معروف';
  const errorContext = context ? `[${context}]` : '';

  if (errorMessage.includes('Failed to fetch') ||
      errorMessage.includes('ERR_CONNECTION_CLOSED')) {
    console.warn(`🔄 ${errorContext} مشكلة اتصال مؤقتة مع Supabase:`, errorMessage);

    // إشعار المستخدم بمشكلة الاتصال
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('supabase-connection-error', {
        detail: { error, context }
      });
      window.dispatchEvent(event);
    }

    return;
  }

  if (errorMessage.includes('JWT expired') ||
      errorMessage.includes('Invalid token')) {
    console.warn(`🔑 ${errorContext} انتهت صلاحية الجلسة، يتطلب تسجيل دخول جديد`);

    // تنظيف الجلسة المنتهية الصلاحية
    supabase.auth.signOut();

    return;
  }

  // تسجيل الأخطاء الأخرى
  console.error(`❌ ${errorContext} خطأ Supabase:`, error);
};

export default supabase;
