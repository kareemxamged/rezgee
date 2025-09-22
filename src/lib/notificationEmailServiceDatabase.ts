import { UnifiedDatabaseEmailService } from './unifiedDatabaseEmailService';

/**
 * خدمة الإشعارات البريدية المتصلة بقاعدة البيانات
 * Notification Email Service - Database Connected
 */
export class NotificationEmailServiceDatabase {
  
  /**
   * إرسال إشعار الإعجاب
   */
  static async sendLikeNotification(
    userEmail: string,
    userName: string,
    likerName: string,
    likerCity?: string,
    likerAge?: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`💖 إرسال إشعار الإعجاب إلى ${userEmail}`);
      
      const templateData = {
        userName,
        likerName,
        likerCity: likerCity || 'غير محدد',
        likerAge: likerAge || 'غير محدد',
        timestamp: new Date().toLocaleString('ar-SA'),
        profileUrl: `https://rezge.com/profile/${likerName.replace(/\s+/g, '-').toLowerCase()}`
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'like_notification',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال إشعار الإعجاب بنجاح');
      } else {
        console.error('❌ فشل في إرسال إشعار الإعجاب:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال إشعار الإعجاب:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * إرسال إشعار الرسالة الجديدة
   */
  static async sendNewMessageNotification(
    userEmail: string,
    userName: string,
    senderName: string,
    senderCity?: string,
    senderAge?: number,
    messagePreview?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`💬 إرسال إشعار الرسالة الجديدة إلى ${userEmail}`);
      
      const templateData = {
        userName,
        senderName,
        senderCity: senderCity || 'غير محدد',
        senderAge: senderAge || 'غير محدد',
        timestamp: new Date().toLocaleString('ar-SA'),
        messagePreview: messagePreview ? 
          (messagePreview.length > 100 ? messagePreview.substring(0, 100) + '...' : messagePreview) : 
          undefined,
        messagesUrl: 'https://rezge.com/messages'
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'new_message_notification',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال إشعار الرسالة الجديدة بنجاح');
      } else {
        console.error('❌ فشل في إرسال إشعار الرسالة الجديدة:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال إشعار الرسالة الجديدة:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * إرسال إشعار المطابقة الجديدة
   */
  static async sendMatchNotification(
    userEmail: string,
    userName: string,
    matchName: string,
    matchCity?: string,
    matchAge?: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`✨ إرسال إشعار المطابقة الجديدة إلى ${userEmail}`);
      
      const templateData = {
        userName,
        matchName,
        matchCity: matchCity || 'غير محدد',
        matchAge: matchAge || 'غير محدد',
        timestamp: new Date().toLocaleString('ar-SA'),
        profileUrl: `https://rezge.com/profile/${matchName.replace(/\s+/g, '-').toLowerCase()}`
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'match_notification',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال إشعار المطابقة الجديدة بنجاح');
      } else {
        console.error('❌ فشل في إرسال إشعار المطابقة الجديدة:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال إشعار المطابقة الجديدة:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * إرسال إشعار استلام البلاغ
   */
  static async sendReportReceivedNotification(
    userEmail: string,
    userName: string,
    reportType: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`⚠️ إرسال إشعار استلام البلاغ إلى ${userEmail}`);
      
      const templateData = {
        userName,
        reportType,
        timestamp: new Date().toLocaleString('ar-SA'),
        supportUrl: 'https://rezge.com/support'
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'report_received',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال إشعار استلام البلاغ بنجاح');
      } else {
        console.error('❌ فشل في إرسال إشعار استلام البلاغ:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال إشعار استلام البلاغ:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * إرسال إشعار تحديث حالة البلاغ
   */
  static async sendReportStatusNotification(
    userEmail: string,
    userName: string,
    reportType: string,
    status: 'accepted' | 'rejected'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`📊 إرسال إشعار تحديث حالة البلاغ إلى ${userEmail}`);
      
      const templateData = {
        userName,
        reportType,
        status: status === 'accepted' ? 'تم قبول البلاغ' : 'تم رفض البلاغ',
        isAccepted: status === 'accepted',
        timestamp: new Date().toLocaleString('ar-SA'),
        contactEmail: 'support@rezge.com'
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'report_status_update',
        userEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال إشعار تحديث حالة البلاغ بنجاح');
      } else {
        console.error('❌ فشل في إرسال إشعار تحديث حالة البلاغ:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال إشعار تحديث حالة البلاغ:', error);
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
   * إرسال إشعار رسالة التواصل
   */
  static async sendContactMessage(
    adminEmail: string,
    senderData: {
      name: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`📧 إرسال رسالة التواصل إلى ${adminEmail}`);
      
      const templateData = {
        senderName: senderData.name,
        senderEmail: senderData.email,
        senderPhone: senderData.phone || 'غير محدد',
        subject: senderData.subject,
        message: senderData.message,
        timestamp: new Date().toLocaleString('ar-SA'),
        contactEmail: 'support@rezge.com'
      };
      
      const result = await UnifiedDatabaseEmailService.sendEmail(
        'contact_form_message',
        adminEmail,
        templateData,
        'ar'
      );
      
      if (result.success) {
        console.log('✅ تم إرسال رسالة التواصل بنجاح');
      } else {
        console.error('❌ فشل في إرسال رسالة التواصل:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في إرسال رسالة التواصل:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// تصدير للاستخدام في الملفات الأخرى
export default NotificationEmailServiceDatabase;





