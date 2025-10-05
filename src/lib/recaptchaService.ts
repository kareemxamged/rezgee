/**
 * خدمة التحقق من Google reCAPTCHA
 * تاريخ الإنشاء: 09-08-2025
 */

// مفاتيح reCAPTCHA مع نظام متدرج
const PRIMARY_SECRET_KEY = '6LewINIrAAAAAFycWJU_h2A-8iIdMpa-axh17_O3'; // المفتاح الحقيقي الجديد المقدم من المستخدم
const FALLBACK_SECRET_KEY = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; // المفتاح التجريبي البديل

// استخدام المفتاح الحقيقي كافتراضي
const RECAPTCHA_SECRET_KEY = PRIMARY_SECRET_KEY;

export interface RecaptchaVerificationResult {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  error_codes?: string[];
  message?: string;
}

export interface RecaptchaVerificationRequest {
  token: string;
  action: string;
  remoteip?: string;
}

/**
 * خدمة التحقق من Google reCAPTCHA
 */
class RecaptchaService {
  private readonly RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
  private currentSecretKey = PRIMARY_SECRET_KEY;
  private keyErrors = 0;

  /**
   * التحقق من صحة token الخاص بـ reCAPTCHA
   */
  async verifyToken(
    token: string, 
    action: string, 
    remoteip?: string
  ): Promise<RecaptchaVerificationResult> {
    try {
      console.log('🔍 التحقق من reCAPTCHA token...');
      console.log('🔑 المفتاح المستخدم:', this.currentSecretKey === PRIMARY_SECRET_KEY ? 'Primary' : 'Fallback');

      // إعداد البيانات للطلب
      const formData = new FormData();
      formData.append('secret', this.currentSecretKey);
      formData.append('response', token);
      formData.append('action', action);
      
      if (remoteip) {
        formData.append('remoteip', remoteip);
      }

      // إرسال الطلب إلى Google
      const response = await fetch(this.RECAPTCHA_VERIFY_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('📊 نتيجة التحقق من reCAPTCHA:', {
        success: result.success,
        score: result.score,
        action: result.action,
        error_codes: result['error-codes']
      });

      // التحقق من صحة النتيجة
      if (result.success) {
        // التحقق من أن النتيجة تطابق العملية المطلوبة
        if (result.action !== action) {
          return {
            success: false,
            message: 'العملية المطلوبة لا تطابق النتيجة',
            error_codes: ['action-mismatch']
          };
        }

        // التحقق من النتيجة (عادة يجب أن تكون >= 0.5)
        const score = result.score || 0;
        if (score < 0.5) {
          return {
            success: false,
            score,
            message: 'النتيجة منخفضة جداً',
            error_codes: ['low-score']
          };
        }

        return {
          success: true,
          score,
          action: result.action,
          challenge_ts: result.challenge_ts,
          hostname: result.hostname,
          message: 'تم التحقق بنجاح'
        };
      } else {
        // معالجة أخطاء التحقق
        const errorCodes = result['error-codes'] || [];
        let errorMessage = 'فشل في التحقق من reCAPTCHA';
        
        // التحقق من أخطاء المفتاح
        const isKeyError = errorCodes.includes('invalid-input-secret') || 
                          errorCodes.includes('missing-input-secret') ||
                          errorCodes.includes('bad-request');
        
        if (isKeyError) {
          this.keyErrors++;
          console.warn(`⚠️ خطأ في المفتاح (${this.keyErrors}):`, errorCodes);
          
          // إذا كان المفتاح الأساسي فاشل، انتقل للمفتاح التجريبي
          if (this.currentSecretKey === PRIMARY_SECRET_KEY && this.keyErrors === 1) {
            console.log('🔄 التبديل إلى المفتاح التجريبي...');
            this.currentSecretKey = FALLBACK_SECRET_KEY;
            this.keyErrors = 0; // إعادة تعيين العداد
            return this.verifyToken(token, action, remoteip); // إعادة المحاولة
          }
          
          // إذا فشل المفتاح التجريبي أيضاً
          if (this.currentSecretKey === FALLBACK_SECRET_KEY && this.keyErrors >= 1) {
            errorMessage = 'فشل جميع مفاتيح reCAPTCHA';
            console.error('❌ فشل جميع مفاتيح reCAPTCHA');
          } else {
            errorMessage = 'مفتاح السر غير صحيح';
          }
        } else if (errorCodes.includes('missing-input-response')) {
          errorMessage = 'استجابة التحقق مفقودة';
        } else if (errorCodes.includes('invalid-input-response')) {
          errorMessage = 'استجابة التحقق غير صحيحة';
        } else if (errorCodes.includes('timeout-or-duplicate')) {
          errorMessage = 'انتهت مهلة التحقق أو تم استخدامه مسبقاً';
        }

        return {
          success: false,
          error_codes: errorCodes,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('❌ خطأ في التحقق من reCAPTCHA:', error);
      return {
        success: false,
        message: 'حدث خطأ في التحقق من reCAPTCHA',
        error_codes: ['network-error']
      };
    }
  }

  /**
   * إعادة تعيين المفاتيح إلى الحالة الافتراضية
   */
  resetKeys(): void {
    console.log('🔄 إعادة تعيين مفاتيح reCAPTCHA إلى الحالة الافتراضية');
    this.currentSecretKey = PRIMARY_SECRET_KEY;
    this.keyErrors = 0;
  }

  /**
   * الحصول على المفتاح الحالي المستخدم
   */
  getCurrentKey(): string {
    return this.currentSecretKey;
  }

  /**
   * التحقق من استخدام المفتاح التجريبي
   */
  isUsingFallbackKey(): boolean {
    return this.currentSecretKey === FALLBACK_SECRET_KEY;
  }

  /**
   * التحقق من صحة token مع معلومات إضافية
   */
  async verifyWithDetails(
    token: string,
    action: string,
    userAgent?: string,
    remoteip?: string
  ): Promise<RecaptchaVerificationResult> {
    try {
      // الحصول على معلومات إضافية للتحقق
      const verificationResult = await this.verifyToken(token, action, remoteip);
      
      if (verificationResult.success) {
        // إضافة معلومات إضافية للنتيجة
        console.log('✅ تم التحقق من reCAPTCHA بنجاح:', {
          score: verificationResult.score,
          action: verificationResult.action,
          hostname: verificationResult.hostname,
          userAgent: userAgent?.substring(0, 100) + '...'
        });
      }

      return verificationResult;
    } catch (error) {
      console.error('❌ خطأ في التحقق التفصيلي من reCAPTCHA:', error);
      return {
        success: false,
        message: 'حدث خطأ في التحقق التفصيلي',
        error_codes: ['verification-error']
      };
    }
  }

  /**
   * التحقق من صحة token للعملية المحددة
   */
  async verifyForAction(
    token: string,
    action: 'login' | 'register' | 'forgot_password' | 'contact',
    remoteip?: string
  ): Promise<RecaptchaVerificationResult> {
    const result = await this.verifyToken(token, action, remoteip);
    
    if (result.success) {
      console.log(`✅ تم التحقق من reCAPTCHA للعملية: ${action}`);
    } else {
      console.log(`❌ فشل التحقق من reCAPTCHA للعملية: ${action}`, result.error_codes);
    }

    return result;
  }

  /**
   * التحقق من صحة token مع تسجيل النشاط
   */
  async verifyWithLogging(
    token: string,
    action: string,
    userId?: string,
    remoteip?: string
  ): Promise<RecaptchaVerificationResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.verifyToken(token, action, remoteip);
      const duration = Date.now() - startTime;

      // تسجيل النشاط
      console.log('📝 تسجيل نشاط reCAPTCHA:', {
        action,
        success: result.success,
        score: result.score,
        duration: `${duration}ms`,
        userId: userId || 'anonymous',
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ خطأ في التحقق مع التسجيل:', {
        action,
        duration: `${duration}ms`,
        error: error.message
      });

      return {
        success: false,
        message: 'حدث خطأ في التحقق مع التسجيل',
        error_codes: ['logging-error']
      };
    }
  }
}

// إنشاء instance من الخدمة
const recaptchaService = new RecaptchaService();

export default recaptchaService;
