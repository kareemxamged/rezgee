import { UnifiedDatabaseEmailService } from './unifiedDatabaseEmailService';

/**
 * خدمة إيميلات المصادقة المتصلة بقاعدة البيانات
 * Authentication Email Service - Database Connected
 */
export class AuthEmailServiceDatabase {
  
  /**
   * إرسال كلمة المرور المؤقتة
   */
  static async sendTemporaryPassword(
    userEmail: string,
    userName: string,
    temporaryPassword: string,
    expiryDate: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔑 إرسال كلمة المرور المؤقتة إلى ${userEmail}`);
      
      const templateData = {
        userName,
        temporaryPassword,
        expiryDate,
        timestamp: new Date().toLocaleString('ar-SA'),
        contactEmail: 'support@rezge.com'
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'temporary_password',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال كلمة المرور المؤقتة بنجاح');
      } else {
        console.error('❌ فشل في إرسال كلمة المرور المؤقتة:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال كلمة المرور المؤقتة:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * إرسال إشعار نجاح إعادة تعيين كلمة المرور
   */
  static async sendPasswordResetSuccess(
    userEmail: string,
    userName: string,
    resetDetails: {
      timestamp: string;
      ipAddress?: string;
      location?: string;
      device?: string;
      browser?: string;
      resetMethod: 'forgot_password' | 'security_settings';
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`✅ إرسال إشعار نجاح إعادة تعيين كلمة المرور إلى ${userEmail}`);
      
      const templateData = {
        userName,
        timestamp: resetDetails.timestamp,
        ipAddress: resetDetails.ipAddress || 'غير محدد',
        location: resetDetails.location || 'غير محدد',
        device: resetDetails.device || 'غير محدد',
        browser: resetDetails.browser || 'غير محدد',
        resetMethod: resetDetails.resetMethod === 'forgot_password' ? 
          'صفحة نسيت كلمة المرور' : 'صفحة إعدادات الأمان والخصوصية',
        contactEmail: 'support@rezge.com'
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'password_reset_success',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال إشعار نجاح إعادة تعيين كلمة المرور بنجاح');
      } else {
        console.error('❌ فشل في إرسال إشعار نجاح إعادة تعيين كلمة المرور:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال إشعار نجاح إعادة تعيين كلمة المرور:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * إرسال رمز التحقق الثنائي
   */
  static async sendTwoFactorCode(
    userEmail: string,
    userName: string,
    code: string,
    codeType: 'login' | 'enable_2fa' | 'disable_2fa' = 'login'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔐 إرسال رمز التحقق الثنائي إلى ${userEmail}`);
      
      const templateData = {
        userName,
        code,
        codeType: codeType === 'login' ? 'تسجيل الدخول' : 
                 codeType === 'enable_2fa' ? 'تفعيل المصادقة الثنائية' : 
                 'تعطيل المصادقة الثنائية',
        validityPeriod: '10 دقائق',
        timestamp: new Date().toLocaleString('ar-SA'),
        contactEmail: 'support@rezge.com'
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'two_factor_login',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال رمز التحقق الثنائي بنجاح');
      } else {
        console.error('❌ فشل في إرسال رمز التحقق الثنائي:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال رمز التحقق الثنائي:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * إرسال إشعار تفعيل المصادقة الثنائية
   */
  static async sendTwoFactorEnabledNotification(
    userEmail: string,
    userName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔒 إرسال إشعار تفعيل المصادقة الثنائية إلى ${userEmail}`);
      
      const templateData = {
        userName,
        userEmail,
        timestamp: new Date().toLocaleString('ar-SA'),
        contactEmail: 'support@rezge.com'
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'two_factor_enable_notification',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال إشعار تفعيل المصادقة الثنائية بنجاح');
      } else {
        console.error('❌ فشل في إرسال إشعار تفعيل المصادقة الثنائية:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال إشعار تفعيل المصادقة الثنائية:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * إرسال إشعار تعطيل المصادقة الثنائية
   */
  static async sendTwoFactorDisabledNotification(
    userEmail: string,
    userName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔓 إرسال إشعار تعطيل المصادقة الثنائية إلى ${userEmail}`);
      
      const templateData = {
        userName,
        userEmail,
        timestamp: new Date().toLocaleString('ar-SA'),
        contactEmail: 'support@rezge.com'
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'two_factor_disable_notification',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال إشعار تعطيل المصادقة الثنائية بنجاح');
      } else {
        console.error('❌ فشل في إرسال إشعار تعطيل المصادقة الثنائية:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال إشعار تعطيل المصادقة الثنائية:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * إرسال إشعار نجاح تسجيل الدخول
   */
  static async sendSuccessfulLoginNotification(
    userEmail: string,
    userName: string,
    loginDetails: {
      timestamp: string;
      ipAddress?: string;
      location?: string;
      device?: string;
      browser?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔐 إرسال إشعار نجاح تسجيل الدخول إلى ${userEmail}`);
      
      const templateData = {
        userName,
        loginTime: loginDetails.timestamp,
        location: loginDetails.location || 'غير محدد',
        device: loginDetails.device || 'غير محدد',
        browser: loginDetails.browser || 'غير محدد',
        ipAddress: loginDetails.ipAddress || 'غير محدد',
        contactEmail: 'support@rezge.com'
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'login_success',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال إشعار نجاح تسجيل الدخول بنجاح');
      } else {
        console.error('❌ فشل في إرسال إشعار نجاح تسجيل الدخول:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال إشعار نجاح تسجيل الدخول:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * إرسال إشعار فشل تسجيل الدخول
   */
  static async sendFailedLoginNotification(
    userEmail: string,
    userName: string,
    loginDetails: {
      timestamp: string;
      ipAddress?: string;
      attemptsCount: number;
      riskLevel: 'low' | 'medium' | 'high';
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🚨 إرسال إشعار فشل تسجيل الدخول إلى ${userEmail}`);
      
      const templateData = {
        userName,
        timestamp: loginDetails.timestamp,
        ipAddress: loginDetails.ipAddress || 'غير محدد',
        attemptsCount: loginDetails.attemptsCount,
        riskLevel: loginDetails.riskLevel === 'high' ? 'عالي' : 
                  loginDetails.riskLevel === 'medium' ? 'متوسط' : 'منخفض',
        contactEmail: 'support@rezge.com'
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'failed_login_notification',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال إشعار فشل تسجيل الدخول بنجاح');
      } else {
        console.error('❌ فشل في إرسال إشعار فشل تسجيل الدخول:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال إشعار فشل تسجيل الدخول:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * إرسال إشعار الترحيب بالمستخدمين الجدد
   */
  static async sendWelcomeNotification(
    userEmail: string,
    userName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🌟 إرسال إشعار الترحيب إلى ${userEmail}`);
      
      const templateData = {
        userName,
        contactEmail: 'support@rezge.com'
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'welcome_new_user',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال إشعار الترحيب بنجاح');
      } else {
        console.error('❌ فشل في إرسال إشعار الترحيب:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال إشعار الترحيب:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// تصدير للاستخدام في الملفات الأخرى
export default AuthEmailServiceDatabase;







