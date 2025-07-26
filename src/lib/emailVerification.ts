import { supabase } from './supabase';
import { emailService } from './emailService';
import { CURRENT_CONFIG, VERIFICATION_MESSAGES } from '../config/verificationLimits';

// أنواع البيانات
export interface EmailVerification {
  id: string;
  email: string;
  verification_token: string;
  user_data: any;
  status: 'pending' | 'verified' | 'expired';
  expires_at: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRegistrationData {
  first_name: string;
  last_name: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
  marital_status: 'single' | 'divorced' | 'widowed';
  // حقول إضافية اختيارية
  education?: string;
  profession?: string;
  religious_commitment?: string;
  bio?: string;
  looking_for?: string;
  // حقول متقدمة
  marriage_type?: string;
  children_count?: number;
  residence_location?: string;
  nationality?: string;
  weight?: number;
  height?: number;
  skin_color?: string;
  body_type?: string;
  religiosity_level?: string;
  prayer_commitment?: string;
  smoking?: string;
  beard?: string;
  hijab?: string;
  education_level?: string;
  financial_status?: string;
  work_field?: string;
  job_title?: string;
  monthly_income?: string;
  health_status?: string;
}

export interface VerificationAttempt {
  id: string;
  email: string;
  ip_address?: string;
  user_agent?: string;
  attempt_type: string;
  success: boolean;
  error_message?: string;
  created_at: string;
}

export interface VerificationLimits {
  canSend: boolean;
  waitTime?: number;
  consecutiveAttempts: number;
  dailyAttempts: number;
  nextAllowedTime?: Date;
  reason?: string;
}

// خدمات إدارة التحقق من البريد الإلكتروني
export const emailVerificationService = {
  // إنشاء رمز تحقق فريد
  generateVerificationToken(): string {
    // إنشاء رمز عشوائي آمن باستخدام Web Crypto API
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const randomHex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    const timestamp = Date.now().toString();

    // دمج الرمز العشوائي مع الوقت
    return randomHex + timestamp;
  },

  // تسجيل محاولة إرسال رابط التحقق
  async logVerificationAttempt(
    email: string,
    success: boolean,
    errorMessage?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await supabase
        .from('verification_attempts')
        .insert({
          email,
          ip_address: ipAddress,
          user_agent: userAgent,
          attempt_type: 'email_verification',
          success,
          error_message: errorMessage
        });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error logging verification attempt:', error);
      }
      // لا نريد أن يفشل الطلب بسبب خطأ في التسجيل
    }
  },

  // التحقق من القيود المطبقة على إرسال روابط التحقق
  async checkVerificationLimits(email: string, _ipAddress?: string): Promise<VerificationLimits> {
    try {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000); // ساعتين مضت
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 ساعة مضت

      // التحقق من المحاولات المتتالية (حسب الإعدادات)
      const { data: recentAttempts, error: recentError } = await supabase
        .from('verification_attempts')
        .select('created_at, success')
        .eq('email', email)
        .gte('created_at', twoHoursAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(CURRENT_CONFIG.maxConsecutiveAttempts);

      if (recentError) {
        console.error('Error checking recent attempts:', recentError);
        return { canSend: true, consecutiveAttempts: 0, dailyAttempts: 0 };
      }

      // عد المحاولات المتتالية الفاشلة
      let consecutiveFailures = 0;

      if (recentAttempts && recentAttempts.length > 0) {
        for (const attempt of recentAttempts) {
          if (attempt.success) {
            // إذا وجدنا محاولة ناجحة، نتوقف عن العد
            break;
          } else {
            consecutiveFailures++;
          }
        }
      }

      // التحقق من المحاولات اليومية
      const { data: dailyAttempts, error: dailyError } = await supabase
        .from('verification_attempts')
        .select('id')
        .eq('email', email)
        .gte('created_at', oneDayAgo.toISOString());

      if (dailyError) {
        console.error('Error checking daily attempts:', dailyError);
        return { canSend: true, consecutiveAttempts: 0, dailyAttempts: 0 };
      }

      const dailyCount = dailyAttempts?.length || 0;

      // تطبيق القيود
      // القيد الأول: حد أقصى للمحاولات المتتالية (حسب الإعدادات)
      if (consecutiveFailures >= CURRENT_CONFIG.maxConsecutiveAttempts) {
        const lastAttempt = new Date(recentAttempts[0].created_at);
        const nextAllowedTime = new Date(lastAttempt.getTime() + CURRENT_CONFIG.consecutiveFailureWaitTime * 60 * 1000);

        if (now < nextAllowedTime) {
          const waitTimeMinutes = Math.ceil((nextAllowedTime.getTime() - now.getTime()) / (1000 * 60));
          return {
            canSend: false,
            waitTime: waitTimeMinutes,
            consecutiveAttempts: consecutiveFailures,
            dailyAttempts: dailyCount,
            nextAllowedTime,
            reason: VERIFICATION_MESSAGES.CONSECUTIVE_LIMIT_REACHED(CURRENT_CONFIG.maxConsecutiveAttempts, waitTimeMinutes)
          };
        }
      }

      // القيد الثاني: حد أقصى للمحاولات اليومية (حسب الإعدادات)
      if (dailyCount >= CURRENT_CONFIG.maxDailyAttempts) {
        const nextDay = new Date(oneDayAgo.getTime() + CURRENT_CONFIG.dailyLimitResetTime * 60 * 60 * 1000);
        const waitTimeMinutes = Math.ceil((nextDay.getTime() - now.getTime()) / (1000 * 60));
        return {
          canSend: false,
          waitTime: waitTimeMinutes,
          consecutiveAttempts: consecutiveFailures,
          dailyAttempts: dailyCount,
          nextAllowedTime: nextDay,
          reason: VERIFICATION_MESSAGES.DAILY_LIMIT_REACHED(CURRENT_CONFIG.maxDailyAttempts)
        };
      }

      return {
        canSend: true,
        consecutiveAttempts: consecutiveFailures,
        dailyAttempts: dailyCount
      };

    } catch (error) {
      console.error('Error in checkVerificationLimits:', error);
      // في حالة الخطأ، نسمح بالإرسال لتجنب منع المستخدمين بسبب أخطاء تقنية
      return { canSend: true, consecutiveAttempts: 0, dailyAttempts: 0 };
    }
  },

  // التحقق من وجود طلب تحقق حديث للبريد الإلكتروني (محدث للنظام الجديد)
  async checkRecentVerification(email: string): Promise<{ canSend: boolean; waitTime?: number; reason?: string }> {
    try {
      // استخدام النظام الجديد للقيود
      const limits = await this.checkVerificationLimits(email);

      if (!limits.canSend) {
        return {
          canSend: false,
          waitTime: limits.waitTime,
          reason: limits.reason
        };
      }

      // التحقق الإضافي من وجود طلب معلق حديث (الحد الأدنى 5 دقائق)
      const { data, error } = await supabase
        .from('email_verifications')
        .select('created_at, status')
        .eq('email', email)
        .eq('status', 'pending')
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error checking recent verification:', error);
        }
        return { canSend: true };
      }

      if (data && data.length > 0) {
        const lastRequest = new Date(data[0].created_at);
        const now = new Date();
        const timeDiff = now.getTime() - lastRequest.getTime();
        const waitTimeMinutes = CURRENT_CONFIG.minTimeBetweenAttempts;
        const waitTimeMs = waitTimeMinutes * 60 * 1000;

        if (timeDiff < waitTimeMs) {
          const remainingTime = Math.ceil((waitTimeMs - timeDiff) / 1000 / 60);
          return {
            canSend: false,
            waitTime: remainingTime,
            reason: VERIFICATION_MESSAGES.MIN_TIME_NOT_PASSED(remainingTime)
          };
        }
      }

      return { canSend: true };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in checkRecentVerification:', error);
      }
      return { canSend: true };
    }
  },

  // إنشاء طلب تحقق جديد (محدث مع النظام الجديد)
  async createVerificationRequest(
    email: string,
    userData: UserRegistrationData,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; token?: string; error?: string; waitTime?: number; limits?: VerificationLimits }> {
    let errorMessage: string | undefined;

    try {
      // التحقق من القيود الجديدة
      const limits = await this.checkVerificationLimits(email, ipAddress);

      if (!limits.canSend) {
        // تسجيل المحاولة الفاشلة
        await this.logVerificationAttempt(email, false, limits.reason, ipAddress, userAgent);

        return {
          success: false,
          error: limits.reason || `يرجى الانتظار ${limits.waitTime} دقيقة قبل طلب رابط تحقق جديد`,
          waitTime: limits.waitTime,
          limits
        };
      }

      // التحقق الإضافي من الطلبات الحديثة (5 دقائق)
      const recentCheck = await this.checkRecentVerification(email);
      if (!recentCheck.canSend) {
        // تسجيل المحاولة الفاشلة
        await this.logVerificationAttempt(email, false, recentCheck.reason, ipAddress, userAgent);

        return {
          success: false,
          error: recentCheck.reason || `يرجى الانتظار ${recentCheck.waitTime} دقيقة قبل طلب رابط تحقق جديد`,
          waitTime: recentCheck.waitTime,
          limits
        };
      }

      // إنشاء رمز تحقق فريد
      const token = this.generateVerificationToken();

      // تحديد تاريخ انتهاء الصلاحية (24 ساعة)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // إلغاء الطلبات السابقة المعلقة لنفس البريد الإلكتروني
      await supabase
        .from('email_verifications')
        .update({ status: 'expired' })
        .eq('email', email)
        .eq('status', 'pending');

      // إنشاء طلب تحقق جديد
      const { error } = await supabase
        .from('email_verifications')
        .insert({
          email,
          verification_token: token,
          user_data: userData,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error creating verification request:', error);
        }
        errorMessage = 'حدث خطأ في إنشاء طلب التحقق';

        // تسجيل المحاولة الفاشلة
        await this.logVerificationAttempt(email, false, errorMessage, ipAddress, userAgent);

        return { success: false, error: errorMessage, limits };
      }

      // إرسال إيميل التحقق
      const emailResult = await emailService.sendVerificationEmail(email, token, userData);
      if (!emailResult.success) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error sending verification email:', emailResult.error);
        }
        errorMessage = 'تم إنشاء رابط التحقق لكن فشل إرسال الإيميل';

        // تسجيل المحاولة كنجاح جزئي (تم إنشاء الرابط لكن فشل الإرسال)
        await this.logVerificationAttempt(email, true, errorMessage, ipAddress, userAgent);

        return { success: true, token, limits };
      }

      // تسجيل المحاولة الناجحة
      await this.logVerificationAttempt(email, true, undefined, ipAddress, userAgent);

      return { success: true, token, limits };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in createVerificationRequest:', error);
      }
      errorMessage = 'حدث خطأ غير متوقع';

      // تسجيل المحاولة الفاشلة
      await this.logVerificationAttempt(email, false, errorMessage, ipAddress, userAgent);

      return { success: false, error: errorMessage };
    }
  },

  // التحقق من صحة رمز التحقق
  async verifyToken(token: string): Promise<{ 
    success: boolean; 
    verification?: EmailVerification; 
    error?: string 
  }> {
    try {
      const { data, error } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('verification_token', token)
        .eq('status', 'pending')
        .single();

      if (error || !data) {
        return { success: false, error: 'رابط التحقق غير صحيح أو منتهي الصلاحية' };
      }

      // التحقق من انتهاء الصلاحية
      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      if (now > expiresAt) {
        // تحديث الحالة إلى منتهي الصلاحية
        await supabase
          .from('email_verifications')
          .update({ status: 'expired' })
          .eq('id', data.id);

        return { success: false, error: 'رابط التحقق منتهي الصلاحية' };
      }

      return { success: true, verification: data };
    } catch (error) {
      console.error('Error in verifyToken:', error);
      return { success: false, error: 'حدث خطأ في التحقق من الرابط' };
    }
  },

  // دالة للتحقق من تطابق IDs بين auth.users و users وإصلاحها
  async fixUserIdMismatch(email: string): Promise<{ success: boolean; fixed?: boolean; error?: string }> {
    try {
      // الحصول على ID من auth.users
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) {
        return { success: false, error: 'لم يتم العثور على المستخدم في نظام المصادقة' };
      }

      // الحصول على ID من جدول users
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError) {
        return { success: false, error: 'لم يتم العثور على الملف الشخصي' };
      }

      // التحقق من تطابق IDs
      if (authUser.user.id === userProfile.id) {
        return { success: true, fixed: false }; // IDs متطابقة بالفعل
      }

      // إصلاح عدم التطابق
      const { error: updateError } = await supabase
        .from('users')
        .update({ id: authUser.user.id })
        .eq('email', email);

      if (updateError) {
        return { success: false, error: 'فشل في إصلاح عدم تطابق المعرفات' };
      }

      return { success: true, fixed: true };
    } catch (error) {
      console.error('Error in fixUserIdMismatch:', error);
      return { success: false, error: 'حدث خطأ أثناء إصلاح المعرفات' };
    }
  },

  // تأكيد التحقق وإنشاء المستخدم - نسخة مبسطة
  async confirmVerification(
    token: string,
    password: string
  ): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      // التحقق من صحة الرمز
      const verificationResult = await this.verifyToken(token);
      if (!verificationResult.success || !verificationResult.verification) {
        return { success: false, error: verificationResult.error };
      }

      const verification = verificationResult.verification;

      // التحقق من وجود المستخدم في جدول users أولاً
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', verification.email)
        .single();

      if (existingUser) {
        // المستخدم موجود في جدول users، نحتاج لإنشاؤه في auth.users
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: verification.email,
            password: password,
          });

          if (authError && !authError.message.includes('already registered')) {
            console.error('Auth error for existing user:', authError);
            return { success: false, error: 'حدث خطأ في إنشاء المصادقة: ' + authError.message };
          }

          // تحديث ID المستخدم في جدول users إذا تم إنشاء مستخدم جديد في auth
          // هذا مهم جداً لضمان تطابق IDs بين الجدولين
          if (authData?.user && authData.user.id !== existingUser.id) {
            console.log(`Updating user ID from ${existingUser.id} to ${authData.user.id} for email ${verification.email}`);

            const { error: updateError } = await supabase
              .from('users')
              .update({ id: authData.user.id })
              .eq('email', verification.email);

            if (updateError) {
              console.error('Error updating user ID:', updateError);
              return { success: false, error: 'حدث خطأ في تحديث معرف المستخدم' };
            }
          }

          // تأكيد البريد الإلكتروني في auth.users
          if (authData?.user) {
            await this.confirmEmailInAuth(authData.user.id);
          }

          // تحديث حالة التحقق
          await supabase
            .from('email_verifications')
            .update({
              status: 'verified',
              verified_at: new Date().toISOString()
            })
            .eq('id', verification.id);

          return {
            success: true,
            user: authData?.user || { id: existingUser.id, email: verification.email }
          };
        } catch (authError) {
          console.error('Error creating auth user:', authError);
          return { success: false, error: 'حدث خطأ في إنشاء المصادقة: ' + (authError as any).message };
        }
      } else {
        // المستخدم غير موجود، ننشئه من الصفر
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: verification.email,
            password: password,
          });

          if (authError) {
            console.error('Auth error for new user:', authError);
            return { success: false, error: 'حدث خطأ في إنشاء الحساب: ' + authError.message };
          }

          if (!authData.user) {
            return { success: false, error: 'حدث خطأ في إنشاء الحساب' };
          }

          // إنشاء ملف المستخدم في جدول users مع نفس ID من auth.users
          console.log(`Creating new user profile with ID ${authData.user.id} for email ${verification.email}`);

          // توليد رقم عضوية فريد
          const membershipNumber = await emailVerificationService.generateMembershipNumber();
          console.log(`🎫 Generated membership number: ${membershipNumber}`);

          // إعداد البيانات الأساسية مع رقم العضوية
          const userData = {
            id: authData.user.id, // استخدام نفس ID من auth.users
            email: verification.email,
            password_hash: 'handled_by_supabase_auth',
            first_name: verification.user_data.first_name,
            last_name: verification.user_data.last_name,
            phone: verification.user_data.phone,
            age: verification.user_data.age,
            gender: verification.user_data.gender,
            city: verification.user_data.city,
            marital_status: verification.user_data.marital_status,
            membership_number: membershipNumber, // إضافة رقم العضوية
            verified: false,
            status: 'active',
            profile_visibility: 'public',
            show_phone: false,
            show_email: false,
            allow_messages: true,
            family_can_view: false,
            two_factor_enabled: false,
            login_notifications: true,
            message_notifications: true,
            // إضافة الحقول الاختيارية إذا كانت موجودة
            ...(verification.user_data.education && { education: verification.user_data.education }),
            ...(verification.user_data.profession && { profession: verification.user_data.profession }),
            ...(verification.user_data.religious_commitment && { religious_commitment: verification.user_data.religious_commitment }),
            ...(verification.user_data.bio && { bio: verification.user_data.bio }),
            ...(verification.user_data.looking_for && { looking_for: verification.user_data.looking_for }),
            ...(verification.user_data.marriage_type && { marriage_type: verification.user_data.marriage_type }),
            ...(verification.user_data.children_count !== undefined && { children_count: verification.user_data.children_count }),
            ...(verification.user_data.residence_location && { residence_location: verification.user_data.residence_location }),
            ...(verification.user_data.nationality && { nationality: verification.user_data.nationality }),
            ...(verification.user_data.weight && { weight: verification.user_data.weight }),
            ...(verification.user_data.height && { height: verification.user_data.height }),
            ...(verification.user_data.skin_color && { skin_color: verification.user_data.skin_color }),
            ...(verification.user_data.body_type && { body_type: verification.user_data.body_type }),
            ...(verification.user_data.religiosity_level && { religiosity_level: verification.user_data.religiosity_level }),
            ...(verification.user_data.prayer_commitment && { prayer_commitment: verification.user_data.prayer_commitment }),
            ...(verification.user_data.smoking && { smoking: verification.user_data.smoking }),
            ...(verification.user_data.beard && { beard: verification.user_data.beard }),
            ...(verification.user_data.hijab && { hijab: verification.user_data.hijab }),
            ...(verification.user_data.education_level && { education_level: verification.user_data.education_level }),
            ...(verification.user_data.financial_status && { financial_status: verification.user_data.financial_status }),
            ...(verification.user_data.work_field && { work_field: verification.user_data.work_field }),
            ...(verification.user_data.job_title && { job_title: verification.user_data.job_title }),
            ...(verification.user_data.monthly_income && { monthly_income: verification.user_data.monthly_income }),
            ...(verification.user_data.health_status && { health_status: verification.user_data.health_status })
          };

          console.log('📝 User data to be inserted:', {
            id: userData.id,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            membership_number: userData.membership_number,
            gender: userData.gender,
            age: userData.age,
            city: userData.city,
            phone: userData.phone,
            education: userData.education,
            profession: userData.profession,
            religious_commitment: userData.religious_commitment,
            bio: userData.bio,
            looking_for: userData.looking_for
          });

          const { error: profileError } = await supabase
            .from('users')
            .insert(userData);

          if (profileError) {
            console.error('Profile creation error:', profileError);
            return { success: false, error: 'حدث خطأ في إنشاء الملف الشخصي' };
          }

          // تأكيد البريد الإلكتروني في auth.users
          await this.confirmEmailInAuth(authData.user.id);

          // تحديث حالة التحقق
          await supabase
            .from('email_verifications')
            .update({
              status: 'verified',
              verified_at: new Date().toISOString()
            })
            .eq('id', verification.id);

          // تحديث حالة المستخدم في جدول users لتأكيد التحقق
          await supabase
            .from('users')
            .update({
              verified: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', authData.user.id);

          return { success: true, user: authData.user };
        } catch (error) {
          console.error('Error creating new user:', error);
          return { success: false, error: 'حدث خطأ في إنشاء المستخدم الجديد' };
        }
      }
    } catch (error) {
      console.error('Error in confirmVerification:', error);
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }
  },

  // تأكيد البريد الإلكتروني في auth.users
  async confirmEmailInAuth(userId: string): Promise<void> {
    try {
      await supabase
        .from('auth.users')
        .update({
          email_confirmed_at: new Date().toISOString(),
          confirmation_token: null
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Error confirming email in auth:', error);
      // لا نرمي خطأ هنا لأن هذا ليس حرجاً
    }
  },

  // تنظيف الطلبات المنتهية الصلاحية
  async cleanupExpiredVerifications(): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      await supabase
        .from('email_verifications')
        .update({ status: 'expired' })
        .eq('status', 'pending')
        .lt('expires_at', now);
    } catch (error) {
      console.error('Error cleaning up expired verifications:', error);
    }
  },

  // إنشاء رابط التحقق
  generateVerificationUrl(token: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/verify-email?token=${token}`;
  },

  // الحصول على إحصائيات المحاولات لبريد إلكتروني معين
  async getVerificationStats(email: string): Promise<{
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    todayAttempts: number;
    lastAttempt?: Date;
    canSendNext?: Date;
  }> {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // إجمالي المحاولات
      const { data: allAttempts, error: allError } = await supabase
        .from('verification_attempts')
        .select('success, created_at')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (allError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error getting verification stats:', allError);
        }
        return { totalAttempts: 0, successfulAttempts: 0, failedAttempts: 0, todayAttempts: 0 };
      }

      const totalAttempts = allAttempts?.length || 0;
      const successfulAttempts = allAttempts?.filter(a => a.success).length || 0;
      const failedAttempts = totalAttempts - successfulAttempts;

      // محاولات اليوم
      const todayAttempts = allAttempts?.filter(a =>
        new Date(a.created_at) >= oneDayAgo
      ).length || 0;

      // آخر محاولة
      const lastAttempt = allAttempts && allAttempts.length > 0
        ? new Date(allAttempts[0].created_at)
        : undefined;

      // التحقق من متى يمكن الإرسال التالي
      const limits = await this.checkVerificationLimits(email);
      const canSendNext = limits.nextAllowedTime;

      return {
        totalAttempts,
        successfulAttempts,
        failedAttempts,
        todayAttempts,
        lastAttempt,
        canSendNext
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in getVerificationStats:', error);
      }
      return { totalAttempts: 0, successfulAttempts: 0, failedAttempts: 0, todayAttempts: 0 };
    }
  },

  // تنظيف محاولات التحقق القديمة (حسب الإعدادات)
  async cleanupOldAttempts(): Promise<void> {
    try {
      const cleanupDate = new Date(Date.now() - CURRENT_CONFIG.cleanupOldDataAfterDays * 24 * 60 * 60 * 1000);

      const { count } = await supabase
        .from('verification_attempts')
        .delete()
        .lt('created_at', cleanupDate.toISOString());

      if (process.env.NODE_ENV === 'development') {
        console.log(`Cleaned up ${count || 0} old verification attempts (older than ${CURRENT_CONFIG.cleanupOldDataAfterDays} days)`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error cleaning up old attempts:', error);
      }
    }
  },

  // إعادة تعيين محاولات مستخدم معين (للإدارة)
  async resetUserAttempts(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await supabase
        .from('verification_attempts')
        .delete()
        .eq('email', email);

      return { success: true };
    } catch (error) {
      console.error('Error resetting user attempts:', error);
      return { success: false, error: 'حدث خطأ في إعادة تعيين المحاولات' };
    }
  },

  // دالة لتوليد رقم عضوية فريد
  async generateMembershipNumber(): Promise<string> {
    try {
      // الحصول على آخر رقم عضوية من قاعدة البيانات
      const { data: lastUser } = await supabase
        .from('users')
        .select('membership_number')
        .not('membership_number', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      let nextNumber = 1;

      if (lastUser && lastUser.membership_number) {
        // استخراج الرقم من آخر رقم عضوية (مثل RZ000123 -> 123)
        const match = lastUser.membership_number.match(/RZ(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      // تنسيق الرقم بـ 6 أرقام مع أصفار في البداية
      const formattedNumber = nextNumber.toString().padStart(6, '0');
      return `RZ${formattedNumber}`;
    } catch (error) {
      console.error('Error generating membership number:', error);
      // في حالة الخطأ، نولد رقم عشوائي
      const randomNumber = Math.floor(Math.random() * 999999) + 1;
      return `RZ${randomNumber.toString().padStart(6, '0')}`;
    }
  },

  // دالة لتحديث المستخدمين الحاليين بأرقام عضوية
  async updateExistingUsersWithMembershipNumbers(): Promise<{ success: boolean; updated: number; error?: string }> {
    try {
      console.log('🔄 Starting to update existing users with membership numbers...');

      // الحصول على المستخدمين الذين لا يملكون رقم عضوية
      const { data: usersWithoutMembership, error: fetchError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, created_at')
        .is('membership_number', null)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching users without membership:', fetchError);
        return { success: false, updated: 0, error: fetchError.message };
      }

      if (!usersWithoutMembership || usersWithoutMembership.length === 0) {
        console.log('✅ No users found without membership numbers');
        return { success: true, updated: 0 };
      }

      console.log(`📊 Found ${usersWithoutMembership.length} users without membership numbers`);

      let updatedCount = 0;

      // تحديث كل مستخدم بشكل منفصل لضمان أرقام عضوية فريدة
      for (const user of usersWithoutMembership) {
        try {
          const membershipNumber = await this.generateMembershipNumber();

          const { error: updateError } = await supabase
            .from('users')
            .update({ membership_number: membershipNumber })
            .eq('id', user.id);

          if (updateError) {
            console.error(`❌ Error updating user ${user.email}:`, updateError);
          } else {
            console.log(`✅ Updated user ${user.email} with membership number: ${membershipNumber}`);
            updatedCount++;
          }
        } catch (userError) {
          console.error(`❌ Error processing user ${user.email}:`, userError);
        }
      }

      console.log(`🎉 Successfully updated ${updatedCount} users with membership numbers`);
      return { success: true, updated: updatedCount };
    } catch (error) {
      console.error('❌ Error in updateExistingUsersWithMembershipNumbers:', error);
      return { success: false, updated: 0, error: (error as Error).message };
    }
  }

};

export default emailVerificationService;
