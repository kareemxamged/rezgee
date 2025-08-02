import { supabase } from './supabase';

/**
 * خدمة إحصائيات لوحة التحكم - جلب البيانات الحقيقية من قاعدة البيانات
 */

export interface DashboardStats {
  profileViews: number;
  likes: number;
  matches: number;
  messages: number;
  profileCompletion: number;
  lastActive: string;
  responseRate: number;
  newMatches: number;
  unreadMessages: number;
}

export interface RecentActivity {
  id: string;
  type: 'view' | 'like' | 'message' | 'match' | 'profile_update';
  description: string;
  timestamp: string;
  user?: {
    id: string;
    name: string;
    city: string;
    age?: number;
  };
}

export interface UserEngagement {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  verifiedUsers: number;
  maleUsers: number;
  femaleUsers: number;
}

export interface MessageStats {
  totalMessages: number;
  messagesThisWeek: number;
  averageResponseTime: number;
  conversationsCount: number;
  activeConversations: number;
}

export interface MatchingStats {
  totalMatches: number;
  matchesThisWeek: number;
  successfulMatches: number;
  averageMatchScore: number;
}

export interface SecurityStats {
  totalDevices: number;
  blockedDevices: number;
  securityEvents: number;
  failedLogins: number;
  suspiciousActivities: number;
}

export interface CityDistribution {
  city: string;
  userCount: number;
  percentage: number;
}

export interface AgeDistribution {
  ageRange: string;
  count: number;
  percentage: number;
}

class DashboardService {
  /**
   * جلب إحصائيات المستخدم الشخصية
   */
  async getUserStats(userId: string): Promise<DashboardStats> {
    try {
      // جلب بيانات المستخدم
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // حساب اكتمال الملف الشخصي
      const profileCompletion = this.calculateProfileCompletion(userProfile);

      // جلب عدد المطابقات
      const { data: matches } = await supabase
        .from('matches')
        .select('id')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      // جلب عدد الرسائل المرسلة
      const { data: sentMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('sender_id', userId);

      // جلب المحادثات التي يشارك فيها المستخدم
      const { data: userConversations } = await supabase
        .from('conversations')
        .select('id')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      // جلب الرسائل غير المقروءة (الرسائل التي لم يقرأها المستخدم)
      let unreadCount = 0;
      if (userConversations && userConversations.length > 0) {
        const conversationIds = userConversations.map(conv => conv.id);
        const { data: unreadMessages } = await supabase
          .from('messages')
          .select('id, sender_id, read_at')
          .in('conversation_id', conversationIds)
          .neq('sender_id', userId)
          .is('read_at', null);

        unreadCount = unreadMessages?.length || 0;
      }

      // جلب المحادثات النشطة (للاستخدام المستقبلي)
      // const { data: conversations } = await supabase
      //   .from('conversations')
      //   .select('id, updated_at')
      //   .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      //   .order('updated_at', { ascending: false });

      // حساب معدل الاستجابة (مؤقت - سيتم تطويره لاحقاً)
      const responseRate = Math.floor(Math.random() * 30) + 70; // 70-100%

      // حساب مشاهدات الملف الشخصي (مؤقت - سيتم إضافة جدول للمشاهدات لاحقاً)
      const profileViews = Math.floor(Math.random() * 50) + 10;

      // حساب الإعجابات (مؤقت - سيتم إضافة جدول للإعجابات لاحقاً)
      const likes = Math.floor(Math.random() * 20) + 5;

      return {
        profileViews,
        likes,
        matches: matches?.length || 0,
        messages: sentMessages?.length || 0,
        profileCompletion,
        lastActive: new Date().toISOString(),
        responseRate,
        newMatches: Math.floor(Math.random() * 3), // مؤقت
        unreadMessages: unreadCount
      };

    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  /**
   * جلب الأنشطة الحديثة للمستخدم
   */
  async getRecentActivity(userId: string, limit: number = 10): Promise<RecentActivity[]> {
    try {
      const activities: RecentActivity[] = [];

      // جلب المحادثات التي يشارك فيها المستخدم
      const { data: userConversations } = await supabase
        .from('conversations')
        .select('id')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      // جلب الرسائل الحديثة من المحادثات التي يشارك فيها المستخدم
      if (userConversations && userConversations.length > 0) {
        const conversationIds = userConversations.map(conv => conv.id);

        const { data: recentMessages } = await supabase
          .from('messages')
          .select('id, content, created_at, sender_id, conversation_id')
          .in('conversation_id', conversationIds)
          .neq('sender_id', userId) // الرسائل المرسلة للمستخدم وليس منه
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentMessages) {
          // جلب بيانات المرسلين
          for (const message of recentMessages) {
            if (message.sender_id) {
              const { data: sender } = await supabase
                .from('users')
                .select('id, first_name, last_name, city, age')
                .eq('id', message.sender_id)
                .single();

              if (sender) {
                activities.push({
                  id: `message_${message.id}`,
                  type: 'message',
                  description: `رسالة جديدة من ${sender.first_name} ${sender.last_name}`,
                  timestamp: message.created_at,
                  user: {
                    id: sender.id,
                    name: `${sender.first_name} ${sender.last_name}`,
                    city: sender.city || '',
                    age: sender.age
                  }
                });
              }
            }
          }
        }
      }

      // جلب المطابقات الحديثة - استعلام مبسط
      const { data: recentMatches } = await supabase
        .from('matches')
        .select('id, created_at, user1_id, user2_id')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentMatches) {
        // جلب بيانات المستخدمين في المطابقات
        for (const match of recentMatches) {
          const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id;

          const { data: otherUser } = await supabase
            .from('users')
            .select('id, first_name, last_name, city, age')
            .eq('id', otherUserId)
            .single();

          if (otherUser) {
            activities.push({
              id: `match_${match.id}`,
              type: 'match',
              description: `مطابقة جديدة مع ${otherUser.first_name} ${otherUser.last_name}`,
              timestamp: match.created_at,
              user: {
                id: otherUser.id,
                name: `${otherUser.first_name} ${otherUser.last_name}`,
                city: otherUser.city || '',
                age: otherUser.age
              }
            });
          }
        }
      }

      // إضافة أنشطة وهمية للمشاهدات والإعجابات (سيتم استبدالها بالبيانات الحقيقية لاحقاً)
      const mockActivities: RecentActivity[] = [
        {
          id: 'view_1',
          type: 'view',
          description: 'شاهد أحمد محمد ملفك الشخصي',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'mock_user_1',
            name: 'أحمد محمد',
            city: 'الرياض'
          }
        },
        {
          id: 'like_1',
          type: 'like',
          description: 'أعجبت فاطمة أحمد بملفك الشخصي',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'mock_user_2',
            name: 'فاطمة أحمد',
            city: 'جدة'
          }
        }
      ];

      activities.push(...mockActivities);

      // ترتيب الأنشطة حسب التاريخ وإرجاع العدد المطلوب
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);

    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  /**
   * حساب اكتمال الملف الشخصي
   */
  calculateProfileCompletion(userProfile: any): number {
    if (!userProfile) return 0;

    const requiredFields = [
      'first_name', 'last_name', 'age', 'city', 'education',
      'profession', 'religious_commitment', 'bio', 'phone'
    ];

    const optionalFields = [
      'nationality', 'weight', 'height', 'prayer_commitment',
      'smoking', 'beard', 'hijab', 'financial_status'
    ];

    // حساب الحقول المطلوبة (وزن 70%)
    const completedRequired = requiredFields.filter(field =>
      userProfile[field] && userProfile[field].toString().trim() !== ''
    ).length;
    const requiredScore = (completedRequired / requiredFields.length) * 70;

    // حساب الحقول الاختيارية (وزن 30%)
    const completedOptional = optionalFields.filter(field =>
      userProfile[field] && userProfile[field].toString().trim() !== ''
    ).length;
    const optionalScore = (completedOptional / optionalFields.length) * 30;

    return Math.round(requiredScore + optionalScore);
  }

  /**
   * جلب إحصائيات عامة للمستخدمين
   */
  async getUserEngagement(): Promise<UserEngagement> {
    try {
      const { data: userStats } = await supabase
        .from('users')
        .select('id, status, verified, gender, created_at');

      if (!userStats) {
        throw new Error('Failed to fetch user stats');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const totalUsers = userStats.length;
      const activeUsers = userStats.filter(user => user.status === 'active').length;
      const verifiedUsers = userStats.filter(user => user.verified === true).length;
      const maleUsers = userStats.filter(user => user.gender === 'male').length;
      const femaleUsers = userStats.filter(user => user.gender === 'female').length;
      const newUsersToday = userStats.filter(user =>
        new Date(user.created_at) >= today
      ).length;

      return {
        totalUsers,
        activeUsers,
        newUsersToday,
        verifiedUsers,
        maleUsers,
        femaleUsers
      };

    } catch (error) {
      console.error('Error fetching user engagement:', error);
      throw error;
    }
  }

  /**
   * جلب إحصائيات الرسائل والمحادثات
   */
  async getMessageStats(): Promise<MessageStats> {
    try {
      // جلب إجمالي الرسائل
      const { data: allMessages } = await supabase
        .from('messages')
        .select('id, created_at');

      // جلب المحادثات
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id, updated_at');

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const totalMessages = allMessages?.length || 0;
      const messagesThisWeek = allMessages?.filter(msg =>
        new Date(msg.created_at) >= oneWeekAgo
      ).length || 0;

      const conversationsCount = conversations?.length || 0;

      // المحادثات النشطة (تم تحديثها في آخر 7 أيام)
      const activeConversations = conversations?.filter(conv =>
        new Date(conv.updated_at) >= oneWeekAgo
      ).length || 0;

      // متوسط وقت الاستجابة (مؤقت - سيتم حسابه بدقة لاحقاً)
      const averageResponseTime = Math.floor(Math.random() * 120) + 30; // 30-150 دقيقة

      return {
        totalMessages,
        messagesThisWeek,
        averageResponseTime,
        conversationsCount,
        activeConversations
      };

    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw error;
    }
  }

  /**
   * جلب إحصائيات المطابقات
   */
  async getMatchingStats(): Promise<MatchingStats> {
    try {
      const { data: matches } = await supabase
        .from('matches')
        .select('id, created_at, status');

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const totalMatches = matches?.length || 0;
      const matchesThisWeek = matches?.filter(match =>
        new Date(match.created_at) >= oneWeekAgo
      ).length || 0;

      const successfulMatches = matches?.filter(match =>
        match.status === 'active' || match.status === 'successful'
      ).length || 0;

      // متوسط نقاط المطابقة (مؤقت - سيتم حسابه بدقة لاحقاً)
      const averageMatchScore = Math.floor(Math.random() * 30) + 70; // 70-100%

      return {
        totalMatches,
        matchesThisWeek,
        successfulMatches,
        averageMatchScore
      };

    } catch (error) {
      console.error('Error fetching matching stats:', error);
      throw error;
    }
  }

  /**
   * جلب إحصائيات الأمان
   */
  async getSecurityStats(): Promise<SecurityStats> {
    try {
      // جلب إحصائيات الأجهزة
      const { data: devices } = await supabase
        .from('device_fingerprints')
        .select('id, is_blocked');

      // جلب الأحداث الأمنية
      const { data: securityEvents } = await supabase
        .from('security_events')
        .select('id');

      // جلب محاولات تسجيل الدخول الفاشلة
      const { data: failedLogins } = await supabase
        .from('login_attempts')
        .select('id')
        .eq('success', false);

      const totalDevices = devices?.length || 0;
      const blockedDevices = devices?.filter(device => device.is_blocked).length || 0;
      const securityEventsCount = securityEvents?.length || 0;
      const failedLoginsCount = failedLogins?.length || 0;

      // الأنشطة المشبوهة (مؤقت - سيتم تطويره لاحقاً)
      const suspiciousActivities = Math.floor(Math.random() * 5);

      return {
        totalDevices,
        blockedDevices,
        securityEvents: securityEventsCount,
        failedLogins: failedLoginsCount,
        suspiciousActivities
      };

    } catch (error) {
      console.error('Error fetching security stats:', error);
      throw error;
    }
  }

  /**
   * جلب توزيع المستخدمين حسب المدن
   */
  async getCityDistribution(): Promise<CityDistribution[]> {
    try {
      const { data: cityData } = await supabase
        .from('users')
        .select('city')
        .not('city', 'is', null);

      if (!cityData) return [];

      // حساب توزيع المدن
      const cityCount: { [key: string]: number } = {};
      cityData.forEach(user => {
        if (user.city) {
          cityCount[user.city] = (cityCount[user.city] || 0) + 1;
        }
      });

      const totalUsers = cityData.length;

      return Object.entries(cityCount)
        .map(([city, count]) => ({
          city,
          userCount: count,
          percentage: Math.round((count / totalUsers) * 100)
        }))
        .sort((a, b) => b.userCount - a.userCount)
        .slice(0, 10); // أفضل 10 مدن

    } catch (error) {
      console.error('Error fetching city distribution:', error);
      return [];
    }
  }

  /**
   * جلب توزيع المستخدمين حسب الأعمار
   */
  async getAgeDistribution(): Promise<AgeDistribution[]> {
    try {
      const { data: ageData } = await supabase
        .from('users')
        .select('age')
        .not('age', 'is', null);

      if (!ageData) return [];

      // تجميع الأعمار في فئات
      const ageGroups = {
        '18-22': 0,
        '23-27': 0,
        '28-32': 0,
        '33-37': 0,
        '38+': 0
      };

      ageData.forEach(user => {
        const age = user.age;
        if (age >= 18 && age <= 22) ageGroups['18-22']++;
        else if (age >= 23 && age <= 27) ageGroups['23-27']++;
        else if (age >= 28 && age <= 32) ageGroups['28-32']++;
        else if (age >= 33 && age <= 37) ageGroups['33-37']++;
        else if (age >= 38) ageGroups['38+']++;
      });

      const totalUsers = ageData.length;

      return Object.entries(ageGroups).map(([ageRange, count]) => ({
        ageRange,
        count,
        percentage: Math.round((count / totalUsers) * 100)
      }));

    } catch (error) {
      console.error('Error fetching age distribution:', error);
      return [];
    }
  }

  /**
   * جلب المطابقات المقترحة للمستخدم
   */
  async getSuggestedMatches(userId: string, limit: number = 5): Promise<any[]> {
    try {
      // جلب بيانات المستخدم الحالي
      const { data: currentUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!currentUser) return [];

      // تحديد الجنس المطلوب
      const targetGender = currentUser.gender === 'male' ? 'female' : 'male';

      // جلب المستخدمين المحتملين
      const { data: potentialMatches } = await supabase
        .from('users')
        .select(`
          id,
          first_name,
          last_name,
          age,
          city,
          education,
          profession,
          religious_commitment,
          bio,
          created_at
        `)
        .eq('gender', targetGender)
        .eq('status', 'active')
        .eq('verified', true)
        .neq('id', userId)
        .limit(limit * 2); // جلب عدد أكبر للفلترة

      if (!potentialMatches) return [];

      // حساب نقاط التوافق وترتيب النتائج
      const scoredMatches = potentialMatches.map(match => {
        let score = 0;

        // التوافق في المدينة (30 نقطة)
        if (match.city === currentUser.city) score += 30;

        // التوافق في التعليم (25 نقطة)
        if (match.education === currentUser.education) score += 25;

        // التوافق في الالتزام الديني (35 نقطة)
        if (match.religious_commitment === currentUser.religious_commitment) score += 35;

        // التوافق في العمر (10 نقاط)
        const ageDiff = Math.abs((match.age || 0) - (currentUser.age || 0));
        if (ageDiff <= 3) score += 10;
        else if (ageDiff <= 5) score += 5;

        return {
          ...match,
          compatibilityScore: score
        };
      });

      // ترتيب حسب نقاط التوافق وإرجاع العدد المطلوب
      return scoredMatches
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
        .slice(0, limit);

    } catch (error) {
      console.error('Error fetching suggested matches:', error);
      return [];
    }
  }

  /**
   * جلب إحصائيات شاملة للوحة التحكم
   */
  async getComprehensiveStats(userId: string): Promise<{
    userStats: DashboardStats;
    userEngagement: UserEngagement;
    messageStats: MessageStats;
    matchingStats: MatchingStats;
    securityStats: SecurityStats;
    recentActivity: RecentActivity[];
    suggestedMatches: any[];
    cityDistribution: CityDistribution[];
    ageDistribution: AgeDistribution[];
  }> {
    try {
      // تشغيل جميع الاستعلامات بشكل متوازي لتحسين الأداء
      const [
        userStats,
        userEngagement,
        messageStats,
        matchingStats,
        securityStats,
        recentActivity,
        suggestedMatches,
        cityDistribution,
        ageDistribution
      ] = await Promise.all([
        this.getUserStats(userId),
        this.getUserEngagement(),
        this.getMessageStats(),
        this.getMatchingStats(),
        this.getSecurityStats(),
        this.getRecentActivity(userId, 10),
        this.getSuggestedMatches(userId, 5),
        this.getCityDistribution(),
        this.getAgeDistribution()
      ]);

      return {
        userStats,
        userEngagement,
        messageStats,
        matchingStats,
        securityStats,
        recentActivity,
        suggestedMatches,
        cityDistribution,
        ageDistribution
      };

    } catch (error) {
      console.error('Error fetching comprehensive stats:', error);
      throw error;
    }
  }

  /**
   * جلب نصائح لتحسين الملف الشخصي
   */
  getProfileImprovementTips(userProfile: any): string[] {
    const tips: string[] = [];

    if (!userProfile) return tips;

    // فحص الحقول المفقودة
    if (!userProfile.bio || userProfile.bio.trim().length < 50) {
      tips.push('أضف نبذة شخصية مفصلة (على الأقل 50 حرف) لتحسين فرص المطابقة');
    }

    if (!userProfile.education) {
      tips.push('أضف معلومات التعليم لمساعدة الآخرين في فهم خلفيتك الأكاديمية');
    }

    if (!userProfile.profession) {
      tips.push('أضف معلومات المهنة لإظهار وضعك المهني');
    }

    if (!userProfile.religious_commitment) {
      tips.push('أضف معلومات الالتزام الديني لمطابقة أفضل مع الأشخاص المتوافقين');
    }

    if (!userProfile.nationality) {
      tips.push('أضف الجنسية لمساعدة الآخرين في التعرف على خلفيتك الثقافية');
    }

    if (!userProfile.financial_status) {
      tips.push('أضف معلومات الوضع المالي (اختياري) لمزيد من الشفافية');
    }

    // نصائح عامة
    if (tips.length === 0) {
      tips.push('ملفك الشخصي مكتمل! حافظ على تحديث معلوماتك بانتظام');
      tips.push('تفاعل مع المطابقات المقترحة لزيادة فرص النجاح');
    }

    return tips;
  }
}

// إنشاء instance واحد من الخدمة
export const dashboardService = new DashboardService();
export default dashboardService;
