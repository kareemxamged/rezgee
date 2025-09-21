import { DatabaseEmailService } from './databaseEmailService';
import { AdvancedEmailService } from './finalEmailService';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
  type: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
  method?: string;
}

/**
 * خدمة الإيميلات المدمجة - تربط النظام الحالي بقاعدة البيانات
 * Integrated Email Service - Connects Current System to Database
 */
export class IntegratedEmailService {
  
  /**
   * إرسال إيميل مع دعم القوالب من قاعدة البيانات
   */
  static async sendEmail(
    emailData: EmailData,
    templateData?: any,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    try {
      console.log(`📧 IntegratedEmailService: إرسال إيميل من النوع: ${emailData.type}`);

      // محاولة استخدام القوالب من قاعدة البيانات أولاً
      const databaseResult = await this.tryDatabaseTemplate(emailData, templateData, language);
      if (databaseResult.success) {
        console.log('✅ تم إرسال الإيميل بنجاح عبر قاعدة البيانات');
        return databaseResult;
      }

      console.log('⚠️ فشل الإرسال عبر قاعدة البيانات، استخدام النظام الحالي...');
      
      // استخدام النظام الحالي كبديل
      const fallbackResult = await AdvancedEmailService.sendEmail(emailData, templateData, language);
      
      if (fallbackResult.success) {
        console.log('✅ تم إرسال الإيميل بنجاح عبر النظام الحالي');
        return fallbackResult;
      }

      console.error('❌ فشل الإرسال عبر جميع الطرق');
      return fallbackResult;

    } catch (error) {
      console.error('❌ خطأ في إرسال الإيميل:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }
  }

  /**
   * محاولة استخدام القوالب من قاعدة البيانات
   */
  private static async tryDatabaseTemplate(
    emailData: EmailData,
    templateData?: any,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    try {
      // تحديد اسم القالب حسب نوع الإيميل
      const templateName = this.getTemplateName(emailData.type);
      if (!templateName) {
        console.log(`⚠️ لا يوجد قالب في قاعدة البيانات للنوع: ${emailData.type}`);
        return { success: false, error: 'لا يوجد قالب متاح' };
      }

      console.log(`📧 محاولة استخدام القالب: ${templateName}`);

      // إرسال الإيميل باستخدام القالب من قاعدة البيانات
      const result = await DatabaseEmailService.sendEmailWithTemplate(
        templateName,
        emailData.to,
        templateData || {},
        language
      );

      // تسجيل النتيجة في السجل
      await DatabaseEmailService.logEmail(
        templateName,
        emailData.to,
        emailData.subject,
        result.success ? 'sent' : 'failed',
        result.error
      );

      return result;

    } catch (error) {
      console.error('❌ خطأ في استخدام قالب قاعدة البيانات:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }
  }

  /**
   * تحديد اسم القالب حسب نوع الإيميل
   */
  private static getTemplateName(emailType: string): string | null {
    const templateMapping: Record<string, string> = {
      'verification': 'account_verification',
      'temporary_password': 'temporary_password',
      '2fa_code': 'two_factor_code',
      'welcome': 'welcome_email',
      'like': 'like_notification',
      'profile_view': 'profile_view_notification',
      'message': 'message_notification',
      'match': 'match_notification',
      'report_received': 'report_received_notification',
      'report_accepted': 'report_accepted_notification',
      'report_rejected': 'report_rejected_notification',
      'verification_approved': 'verification_approved_notification',
      'verification_rejected': 'verification_rejected_notification',
      'user_ban': 'user_ban_notification',
      'login_success': 'login_success_notification',
      'login_failed': 'login_failed_notification',
      'two_factor_failure': 'two_factor_failure_notification',
      'two_factor_disable': 'two_factor_disable_notification'
    };

    return templateMapping[emailType] || null;
  }

  /**
   * إرسال إيميل تحقق الحساب
   */
  static async sendVerificationEmail(
    email: string,
    verificationUrl: string,
    firstName: string,
    lastName: string,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    const emailData: EmailData = {
      to: email,
      subject: '', // سيتم تحديده من القالب
      html: '', // سيتم تحديده من القالب
      text: '', // سيتم تحديده من القالب
      type: 'verification'
    };

    const templateData = {
      firstName,
      lastName,
      verificationUrl
    };

    return await this.sendEmail(emailData, templateData, language);
  }

  /**
   * إرسال إيميل كلمة المرور المؤقتة
   */
  static async sendTemporaryPasswordEmail(
    email: string,
    temporaryPassword: string,
    expiresAt: string,
    recipientName: string,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    const emailData: EmailData = {
      to: email,
      subject: '',
      html: '',
      text: '',
      type: 'temporary_password'
    };

    const templateData = {
      recipientName,
      temporaryPassword,
      expiresAt
    };

    return await this.sendEmail(emailData, templateData, language);
  }

  /**
   * إرسال إيميل رمز التحقق الثنائي
   */
  static async send2FACodeEmail(
    email: string,
    code: string,
    expiresInMinutes: string,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    const emailData: EmailData = {
      to: email,
      subject: '',
      html: '',
      text: '',
      type: '2fa_code'
    };

    const templateData = {
      code,
      expiresInMinutes
    };

    return await this.sendEmail(emailData, templateData, language);
  }

  /**
   * إرسال إيميل ترحيب
   */
  static async sendWelcomeEmail(
    email: string,
    userName: string,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    const emailData: EmailData = {
      to: email,
      subject: '',
      html: '',
      text: '',
      type: 'welcome'
    };

    const templateData = {
      userName
    };

    return await this.sendEmail(emailData, templateData, language);
  }

  /**
   * إرسال إشعار إعجاب
   */
  static async sendLikeNotification(
    email: string,
    userName: string,
    likerName: string,
    likerCity: string,
    likerAge: number,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    const emailData: EmailData = {
      to: email,
      subject: '',
      html: '',
      text: '',
      type: 'like'
    };

    const templateData = {
      userName,
      likerName,
      likerCity,
      likerAge
    };

    return await this.sendEmail(emailData, templateData, language);
  }

  /**
   * إرسال إشعار زيارة الملف الشخصي
   */
  static async sendProfileViewNotification(
    email: string,
    userName: string,
    viewerName: string,
    viewerCity: string,
    viewerAge: number,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    const emailData: EmailData = {
      to: email,
      subject: '',
      html: '',
      text: '',
      type: 'profile_view'
    };

    const templateData = {
      userName,
      viewerName,
      viewerCity,
      viewerAge
    };

    return await this.sendEmail(emailData, templateData, language);
  }

  /**
   * إرسال إشعار رسالة جديدة
   */
  static async sendMessageNotification(
    email: string,
    userName: string,
    senderName: string,
    senderCity: string,
    senderAge: number,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    const emailData: EmailData = {
      to: email,
      subject: '',
      html: '',
      text: '',
      type: 'message'
    };

    const templateData = {
      userName,
      senderName,
      senderCity,
      senderAge
    };

    return await this.sendEmail(emailData, templateData, language);
  }

  /**
   * إرسال إشعار مطابقة
   */
  static async sendMatchNotification(
    email: string,
    userName: string,
    matchName: string,
    matchCity: string,
    matchAge: number,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    const emailData: EmailData = {
      to: email,
      subject: '',
      html: '',
      text: '',
      type: 'match'
    };

    const templateData = {
      userName,
      matchName,
      matchCity,
      matchAge
    };

    return await this.sendEmail(emailData, templateData, language);
  }

  /**
   * اختبار النظام المدمج
   */
  static async testIntegratedSystem(
    testEmail: string = 'kemooamegoo@gmail.com',
    language: 'ar' | 'en' = 'ar'
  ): Promise<{ success: boolean; results: any[] }> {
    try {
      console.log('🧪 اختبار النظام المدمج...');

      const testResults = [];

      // اختبار القوالب الأساسية
      const basicTemplates = [
        'account_verification',
        'temporary_password',
        'two_factor_code',
        'welcome_email'
      ];

      for (const templateName of basicTemplates) {
        console.log(`🧪 اختبار القالب: ${templateName}`);
        const result = await DatabaseEmailService.testEmailTemplate(templateName, testEmail, language);
        testResults.push({ template: templateName, result });
      }

      // اختبار القوالب الاجتماعية
      const socialTemplates = [
        'like_notification',
        'profile_view_notification',
        'message_notification',
        'match_notification'
      ];

      for (const templateName of socialTemplates) {
        console.log(`🧪 اختبار القالب: ${templateName}`);
        const result = await DatabaseEmailService.testEmailTemplate(templateName, testEmail, language);
        testResults.push({ template: templateName, result });
      }

      const successCount = testResults.filter(r => r.result.success).length;
      const totalCount = testResults.length;
      const successRate = (successCount / totalCount) * 100;

      console.log(`✅ انتهى اختبار النظام المدمج: ${successCount}/${totalCount} نجح (${successRate.toFixed(1)}%)`);

      return {
        success: successRate > 80, // نجاح إذا كان معدل النجاح أكثر من 80%
        results: testResults
      };

    } catch (error) {
      console.error('❌ خطأ في اختبار النظام المدمج:', error);
      return {
        success: false,
        results: []
      };
    }
  }

  /**
   * جلب إحصائيات النظام المدمج
   */
  static async getSystemStats(): Promise<{
    databaseStats: any;
    templatesCount: number;
    notificationTypesCount: number;
  }> {
    try {
      console.log('📊 جلب إحصائيات النظام المدمج...');

      // إحصائيات قاعدة البيانات
      const databaseStats = await DatabaseEmailService.getEmailStats();

      // عدد القوالب
      const { data: templates } = await DatabaseEmailService.getEmailTemplate('account_verification');
      const templatesCount = templates ? 18 : 0; // عدد القوالب المضافة

      // عدد أنواع الإشعارات
      const { data: notificationTypes } = await DatabaseEmailService.getNotificationType('account_verification');
      const notificationTypesCount = notificationTypes ? 18 : 0; // عدد أنواع الإشعارات المضافة

      console.log('✅ تم جلب إحصائيات النظام المدمج بنجاح');

      return {
        databaseStats,
        templatesCount,
        notificationTypesCount
      };

    } catch (error) {
      console.error('❌ خطأ في جلب إحصائيات النظام المدمج:', error);
      return {
        databaseStats: { totalSent: 0, totalFailed: 0, successRate: 0, dailySends: 0 },
        templatesCount: 0,
        notificationTypesCount: 0
      };
    }
  }
}
