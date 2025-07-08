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
      console.error('Error logging verification attempt:', error);
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
        console.error('Error checking recent verification:', error);
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
      console.error('Error in checkRecentVerification:', error);
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
        console.error('Error creating verification request:', error);
        errorMessage = 'حدث خطأ في إنشاء طلب التحقق';

        // تسجيل المحاولة الفاشلة
        await this.logVerificationAttempt(email, false, errorMessage, ipAddress, userAgent);

        return { success: false, error: errorMessage, limits };
      }

      // إرسال إيميل التحقق
      const emailResult = await emailService.sendVerificationEmail(email, token, userData);
      if (!emailResult.success) {
        console.error('Error sending verification email:', emailResult.error);
        errorMessage = 'تم إنشاء رابط التحقق لكن فشل إرسال الإيميل';

        // تسجيل المحاولة كنجاح جزئي (تم إنشاء الرابط لكن فشل الإرسال)
        await this.logVerificationAttempt(email, true, errorMessage, ipAddress, userAgent);

        return { success: true, token, limits };
      }

      // تسجيل المحاولة الناجحة
      await this.logVerificationAttempt(email, true, undefined, ipAddress, userAgent);

      return { success: true, token, limits };
    } catch (error) {
      console.error('Error in createVerificationRequest:', error);
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

  // تأكيد التحقق وإنشاء المستخدم
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

      // إنشاء المستخدم في Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: verification.email,
        password: password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        return { success: false, error: 'حدث خطأ في إنشاء الحساب' };
      }

      if (authData.user) {
        // إنشاء ملف المستخدم في جدول users
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: verification.email,
            password_hash: 'handled_by_supabase_auth', // مطلوب للجدول
            first_name: verification.user_data.first_name,
            last_name: verification.user_data.last_name,
            phone: verification.user_data.phone,
            age: verification.user_data.age,
            gender: verification.user_data.gender,
            city: verification.user_data.city,
            marital_status: verification.user_data.marital_status,
            verified: false, // سيتم التحقق من قبل الإدارة
            status: 'active',
            profile_visibility: 'public',
            show_phone: false,
            show_email: false,
            allow_messages: true,
            family_can_view: false,
            two_factor_enabled: false,
            login_notifications: true,
            message_notifications: true
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { success: false, error: 'حدث خطأ في إنشاء الملف الشخصي' };
        }

        // تحديث حالة التحقق
        await supabase
          .from('email_verifications')
          .update({ 
            status: 'verified',
            verified_at: new Date().toISOString()
          })
          .eq('id', verification.id);

        return { success: true, user: authData.user };
      }

      return { success: false, error: 'حدث خطأ في إنشاء الحساب' };
    } catch (error) {
      console.error('Error in confirmVerification:', error);
      return { success: false, error: 'حدث خطأ غير متوقع' };
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
        console.error('Error getting verification stats:', allError);
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
      console.error('Error in getVerificationStats:', error);
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

      console.log(`Cleaned up ${count || 0} old verification attempts (older than ${CURRENT_CONFIG.cleanupOldDataAfterDays} days)`);
    } catch (error) {
      console.error('Error cleaning up old attempts:', error);
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

};

export default emailVerificationService;
