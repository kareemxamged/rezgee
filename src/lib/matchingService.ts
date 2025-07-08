import { supabase, User } from './supabase';

// نوع بيانات المطابقة
export interface MatchResult {
  user: User;
  compatibilityScore: number;
  compatibilityFactors: {
    age: number;
    location: number;
    education: number;
    religiousCommitment: number;
    maritalStatus: number;
  };
  matchReason: string[];
}

// إعدادات المطابقة
export interface MatchingPreferences {
  ageRange: { min: number; max: number };
  maxDistance?: number; // بالكيلومتر
  educationImportance: 'low' | 'medium' | 'high';
  religiousImportance: 'low' | 'medium' | 'high';
  locationImportance: 'low' | 'medium' | 'high';
}

// خدمة المطابقة الذكية
export class MatchingService {
  
  // حساب نقاط التوافق بين مستخدمين
  static calculateCompatibility(user1: User, user2: User, preferences?: MatchingPreferences): MatchResult {
    const factors = {
      age: this.calculateAgeCompatibility(user1.age || 0, user2.age || 0),
      location: this.calculateLocationCompatibility(user1.city || '', user2.city || ''),
      education: this.calculateEducationCompatibility(user1.education || '', user2.education || ''),
      religiousCommitment: this.calculateReligiousCompatibility(
        user1.religious_commitment || 'medium', 
        user2.religious_commitment || 'medium'
      ),
      maritalStatus: this.calculateMaritalStatusCompatibility(
        user1.marital_status || 'single', 
        user2.marital_status || 'single'
      )
    };

    // حساب النقاط الإجمالية مع الأوزان
    const weights = {
      age: 0.25,
      location: 0.20,
      education: 0.20,
      religiousCommitment: 0.25,
      maritalStatus: 0.10
    };

    const totalScore = Object.entries(factors).reduce((sum, [key, value]) => {
      return sum + (value * weights[key as keyof typeof weights]);
    }, 0);

    // تحديد أسباب التوافق
    const matchReasons = this.generateMatchReasons(factors, user1, user2);

    return {
      user: user2,
      compatibilityScore: Math.round(totalScore * 100),
      compatibilityFactors: factors,
      matchReason: matchReasons
    };
  }

  // حساب توافق العمر
  private static calculateAgeCompatibility(age1: number, age2: number): number {
    if (!age1 || !age2) return 0.5;
    
    const ageDiff = Math.abs(age1 - age2);
    
    if (ageDiff <= 2) return 1.0;      // فرق سنتين أو أقل - توافق ممتاز
    if (ageDiff <= 5) return 0.8;      // فرق 3-5 سنوات - توافق جيد
    if (ageDiff <= 8) return 0.6;      // فرق 6-8 سنوات - توافق متوسط
    if (ageDiff <= 12) return 0.4;     // فرق 9-12 سنة - توافق ضعيف
    return 0.2;                        // فرق أكبر من 12 سنة - توافق ضعيف جداً
  }

  // حساب توافق الموقع
  private static calculateLocationCompatibility(city1: string, city2: string): number {
    if (!city1 || !city2) return 0.5;
    
    // نفس المدينة
    if (city1.toLowerCase() === city2.toLowerCase()) return 1.0;
    
    // مدن متقاربة (يمكن تطوير هذا لاحقاً بقاعدة بيانات المدن)
    const sameRegionCities = this.getSameRegionCities();
    const city1Region = this.getCityRegion(city1, sameRegionCities);
    const city2Region = this.getCityRegion(city2, sameRegionCities);
    
    if (city1Region && city1Region === city2Region) return 0.7;
    
    return 0.3; // مدن مختلفة
  }

  // حساب توافق التعليم
  private static calculateEducationCompatibility(edu1: string, edu2: string): number {
    if (!edu1 || !edu2) return 0.5;
    
    const educationLevels = {
      'ثانوية عامة': 1,
      'دبلوم': 2,
      'بكالوريوس': 3,
      'ماجستير': 4,
      'دكتوراه': 5
    };
    
    const level1 = educationLevels[edu1 as keyof typeof educationLevels] || 3;
    const level2 = educationLevels[edu2 as keyof typeof educationLevels] || 3;
    
    const diff = Math.abs(level1 - level2);
    
    if (diff === 0) return 1.0;        // نفس المستوى
    if (diff === 1) return 0.8;        // فرق مستوى واحد
    if (diff === 2) return 0.6;        // فرق مستويين
    return 0.4;                        // فرق أكبر
  }

  // حساب توافق الالتزام الديني
  private static calculateReligiousCompatibility(
    commitment1: 'high' | 'medium' | 'practicing',
    commitment2: 'high' | 'medium' | 'practicing'
  ): number {
    const commitmentLevels = {
      'practicing': 1,
      'medium': 2,
      'high': 3
    };
    
    const level1 = commitmentLevels[commitment1];
    const level2 = commitmentLevels[commitment2];
    
    const diff = Math.abs(level1 - level2);
    
    if (diff === 0) return 1.0;        // نفس المستوى
    if (diff === 1) return 0.7;        // فرق مستوى واحد
    return 0.4;                        // فرق كبير
  }

  // حساب توافق الحالة الاجتماعية
  private static calculateMaritalStatusCompatibility(
    status1: 'single' | 'divorced' | 'widowed',
    status2: 'single' | 'divorced' | 'widowed'
  ): number {
    // نفس الحالة
    if (status1 === status2) return 1.0;
    
    // حالات متوافقة
    if ((status1 === 'divorced' && status2 === 'widowed') ||
        (status1 === 'widowed' && status2 === 'divorced')) {
      return 0.8;
    }
    
    // أعزب مع مطلق/أرمل
    if ((status1 === 'single' && (status2 === 'divorced' || status2 === 'widowed')) ||
        (status2 === 'single' && (status1 === 'divorced' || status1 === 'widowed'))) {
      return 0.6;
    }
    
    return 0.5;
  }

  // توليد أسباب التوافق
  private static generateMatchReasons(
    factors: MatchResult['compatibilityFactors'],
    user1: User,
    user2: User
  ): string[] {
    const reasons: string[] = [];
    
    if (factors.age >= 0.8) {
      reasons.push('عمر متقارب ومناسب');
    }
    
    if (factors.location >= 0.7) {
      if (factors.location === 1.0) {
        reasons.push('نفس المدينة');
      } else {
        reasons.push('مدن متقاربة');
      }
    }
    
    if (factors.education >= 0.8) {
      reasons.push('مستوى تعليمي متوافق');
    }
    
    if (factors.religiousCommitment >= 0.7) {
      reasons.push('مستوى التزام ديني متوافق');
    }
    
    if (factors.maritalStatus >= 0.8) {
      reasons.push('حالة اجتماعية متوافقة');
    }
    
    if (reasons.length === 0) {
      reasons.push('توافق عام في الملف الشخصي');
    }
    
    return reasons;
  }

  // الحصول على مدن نفس المنطقة
  private static getSameRegionCities(): Record<string, string[]> {
    return {
      'الرياض': ['الرياض', 'الخرج', 'الدرعية', 'الزلفي'],
      'مكة': ['مكة المكرمة', 'جدة', 'الطائف', 'رابغ'],
      'المدينة': ['المدينة المنورة', 'ينبع', 'العلا'],
      'الشرقية': ['الدمام', 'الخبر', 'الظهران', 'الأحساء', 'الجبيل'],
      'عسير': ['أبها', 'خميس مشيط', 'بيشة', 'النماص'],
      'تبوك': ['تبوك', 'الوجه', 'ضباء', 'تيماء'],
      'حائل': ['حائل', 'بقعاء'],
      'الحدود الشمالية': ['عرعر', 'رفحاء', 'طريف'],
      'جازان': ['جازان', 'صبيا', 'أبو عريش'],
      'نجران': ['نجران', 'شرورة'],
      'الباحة': ['الباحة', 'بلجرشي'],
      'الجوف': ['سكاكا', 'دومة الجندل', 'القريات']
    };
  }

  // تحديد منطقة المدينة
  private static getCityRegion(city: string, regions: Record<string, string[]>): string | null {
    for (const [region, cities] of Object.entries(regions)) {
      if (cities.some(c => c.toLowerCase().includes(city.toLowerCase()) || 
                          city.toLowerCase().includes(c.toLowerCase()))) {
        return region;
      }
    }
    return null;
  }

  // البحث عن مطابقات للمستخدم
  static async findMatches(
    userId: string, 
    limit: number = 10,
    preferences?: MatchingPreferences
  ): Promise<{ data: MatchResult[]; error: any }> {
    try {
      // الحصول على بيانات المستخدم الحالي
      const { data: currentUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError || !currentUser) {
        return { data: [], error: userError };
      }

      // تحديد الجنس المطلوب (عكس جنس المستخدم الحالي)
      const targetGender = currentUser.gender === 'male' ? 'female' : 'male';

      // البحث عن المستخدمين المحتملين
      let query = supabase
        .from('users')
        .select('*')
        .eq('gender', targetGender)
        .eq('status', 'active')
        .eq('verified', true)
        .neq('id', userId);

      // تطبيق فلاتر العمر إذا كانت متوفرة
      if (preferences?.ageRange) {
        query = query
          .gte('age', preferences.ageRange.min)
          .lte('age', preferences.ageRange.max);
      }

      const { data: potentialMatches, error: matchError } = await query.limit(50);

      if (matchError) {
        return { data: [], error: matchError };
      }

      // حساب التوافق لكل مستخدم
      const matches = potentialMatches
        .map(user => this.calculateCompatibility(currentUser, user, preferences))
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
        .slice(0, limit);

      return { data: matches, error: null };
    } catch (error) {
      return { data: [], error };
    }
  }

  // حفظ مطابقة في قاعدة البيانات
  static async saveMatch(
    userId: string,
    matchedUserId: string,
    compatibilityScore: number,
    matchType: 'suggested' | 'mutual_like' | 'conversation_started' = 'suggested'
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('matches')
        .insert({
          user1_id: userId,
          user2_id: matchedUserId,
          compatibility_score: compatibilityScore,
          match_type: matchType,
          status: 'active',
          created_at: new Date().toISOString()
        });

      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  }

  // الحصول على المطابقات المحفوظة
  static async getSavedMatches(userId: string): Promise<{ data: any[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          matched_user:users!matches_user2_id_fkey(*)
        `)
        .eq('user1_id', userId)
        .eq('status', 'active')
        .order('compatibility_score', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error };
    }
  }
}

export default MatchingService;
