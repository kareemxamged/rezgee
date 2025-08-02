import { supabase } from './supabase';

/**
 * نتيجة فحص حدود طلبات تحديث معلومات التواصل
 */
export interface RateLimitCheckResult {
  allowed: boolean;
  reason: 'allowed' | 'daily_limit_reached';
  daily_requests_used: number;
  daily_requests_limit: number;
  pending_requests_used: number;
  pending_requests_limit: number;
  wait_minutes: number;
  pending_wait_hours: number;
  blocked_until: string | null;
  next_reset: string;
}

/**
 * نتيجة تسجيل طلب جديد
 */
export interface RecordRequestResult {
  success: boolean;
  daily_requests_count: number;
  daily_requests_limit: number;
  next_allowed_at: string | null;
  blocked_until: string | null;
}

/**
 * نتيجة تسجيل طلب معلق
 */
export interface RecordPendingRequestResult {
  success: boolean;
  pending_requests_count: number;
  pending_requests_limit: number;
  blocked_until: string | null;
}

/**
 * خدمة إدارة حدود طلبات تحديث معلومات التواصل
 */
export class ContactUpdateRateLimitService {
  
  /**
   * فحص ما إذا كان المستخدم مسموح له بإرسال طلب تحديث معلومات التواصل
   * @param userId معرف المستخدم
   * @returns نتيجة الفحص
   */
  static async checkRateLimit(userId: string): Promise<RateLimitCheckResult> {
    try {
      console.log('🔍 Checking contact update rate limit for user:', userId);
      
      const { data, error } = await supabase.rpc('check_contact_update_rate_limit', {
        p_user_id: userId
      });

      if (error) {
        console.error('❌ Error checking rate limit:', error);
        throw new Error(`خطأ في فحص حدود الطلبات: ${error.message}`);
      }

      console.log('✅ Rate limit check result:', data);
      return data as RateLimitCheckResult;
    } catch (error) {
      console.error('❌ Error in checkRateLimit:', error);
      throw error;
    }
  }

  /**
   * تسجيل طلب تحديث معلومات التواصل ناجح
   * @param userId معرف المستخدم
   * @returns نتيجة التسجيل
   */
  static async recordSuccessfulRequest(userId: string): Promise<RecordRequestResult> {
    try {
      console.log('📝 Recording successful contact update request for user:', userId);

      const { data, error } = await supabase.rpc('record_successful_contact_update', {
        p_user_id: userId
      });

      if (error) {
        console.error('❌ Error recording successful request:', error);
        throw new Error(`خطأ في تسجيل الطلب الناجح: ${error.message}`);
      }

      console.log('✅ Successful request recorded:', data);
      return data as RecordRequestResult;
    } catch (error) {
      console.error('❌ Error in recordSuccessfulRequest:', error);
      throw error;
    }
  }

  /**
   * تسجيل طلب معلق (غير مكتمل) - تم إلغاء هذه الوظيفة
   * @deprecated لم تعد هناك حاجة لتسجيل الطلبات المعلقة
   */
  static async recordPendingRequest(_userId: string): Promise<RecordPendingRequestResult> {
    // لم تعد هناك حاجة لتسجيل الطلبات المعلقة
    return {
      success: true,
      pending_requests_count: 0,
      pending_requests_limit: 0,
      blocked_until: null
    };
  }

  /**
   * تنسيق وقت الانتظار المتبقي بالدقائق
   * @param waitMinutes عدد الدقائق المتبقية
   * @returns نص منسق للوقت المتبقي
   */
  static formatWaitTime(waitMinutes: number): string {
    if (waitMinutes <= 0) {
      return '';
    }

    if (waitMinutes < 60) {
      const minutes = Math.ceil(waitMinutes);
      return `${minutes} دقيقة`;
    }

    const hours = Math.floor(waitMinutes / 60);
    const remainingMinutes = Math.ceil(waitMinutes % 60);

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;

      if (remainingHours === 0) {
        return `${days} يوم`;
      }
      return `${days} يوم و ${remainingHours} ساعة`;
    }

    if (remainingMinutes === 0) {
      return `${hours} ساعة`;
    }

    return `${hours} ساعة و ${remainingMinutes} دقيقة`;
  }

  /**
   * تنسيق وقت الانتظار المتبقي بالساعات
   * @param waitHours عدد الساعات المتبقية
   * @returns نص منسق للوقت المتبقي
   */
  static formatWaitTimeHours(waitHours: number): string {
    if (waitHours <= 0) {
      return '';
    }

    if (waitHours < 1) {
      const minutes = Math.ceil(waitHours * 60);
      return `${minutes} دقيقة`;
    }

    const hours = Math.floor(waitHours);
    const remainingMinutes = Math.ceil((waitHours % 1) * 60);

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;

      if (remainingHours === 0) {
        return `${days} يوم`;
      }
      return `${days} يوم و ${remainingHours} ساعة`;
    }

    if (remainingMinutes === 0) {
      return `${hours} ساعة`;
    }

    return `${hours} ساعة و ${remainingMinutes} دقيقة`;
  }

  /**
   * الحصول على رسالة توضيحية للمستخدم حول حالة الحدود
   * @param result نتيجة فحص الحدود
   * @returns رسالة توضيحية
   */
  static getStatusMessage(result: RateLimitCheckResult): string {
    if (result.reason === 'daily_limit_reached') {
      return `تم استنفاد الحد اليومي للتحديثات (${result.daily_requests_limit} تحديثات). يمكنك المحاولة مرة أخرى غداً.`;
    }
    return 'حدث خطأ اثناء تحديث البيانات. حاول مجددا في وقت لاحق';
  }

  /**
   * فحص ما إذا كان المستخدم وصل للحد اليومي
   * @param result نتيجة فحص الحدود
   * @returns true إذا وصل للحد اليومي
   */
  static isDailyLimitReached(result: RateLimitCheckResult): boolean {
    return !result.allowed && result.reason === 'daily_limit_reached';
  }

  /**
   * الحصول على معلومات الاستخدام اليومي
   * @param result نتيجة فحص الحدود
   * @returns معلومات الاستخدام اليومي
   */
  static getDailyUsageInfo(result: RateLimitCheckResult): {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  } {
    const used = result.daily_requests_used;
    const limit = result.daily_requests_limit;
    const remaining = Math.max(0, limit - used);
    const percentage = Math.round((used / limit) * 100);

    return {
      used,
      limit,
      remaining,
      percentage
    };
  }

  /**
   * الحصول على معلومات الاستخدام للطلبات المعلقة
   * @param result نتيجة فحص الحدود
   * @returns معلومات الاستخدام للطلبات المعلقة
   */
  static getPendingUsageInfo(result: RateLimitCheckResult): {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  } {
    const used = result.pending_requests_used;
    const limit = result.pending_requests_limit;
    const remaining = Math.max(0, limit - used);
    const percentage = Math.round((used / limit) * 100);

    return {
      used,
      limit,
      remaining,
      percentage
    };
  }
}

export default ContactUpdateRateLimitService;
