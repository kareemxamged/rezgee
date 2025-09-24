// خدمة الإيميل الديناميكية مع دعم اللغة التلقائي
// Dynamic Language Email Service with Automatic Language Support

import { UnifiedEmailService, EmailResult } from './unifiedEmailService';
import { LanguageDetectionService, SupportedLanguage, getCurrentLanguage } from './languageDetectionService';
import { createUnifiedEmailTemplate, EmailTemplateData } from './unifiedEmailTemplate';

export interface DynamicEmailData {
  to: string;
  subject?: string;
  templateType: EmailTemplateType;
  data: any;
  language?: SupportedLanguage; // اختياري - إذا لم يتم تحديده، سيتم كشفه تلقائياً
  forceLanguage?: boolean; // إجبار استخدام لغة معينة
}

export type EmailTemplateType = 
  | 'verification'
  | 'welcome'
  | 'password_reset'
  | 'two_factor_login'
  | 'two_factor_enable'
  | 'two_factor_disable'
  | 'login_notification'
  | 'profile_update'
  | 'security_alert'
  | 'newsletter_welcome'
  | 'newsletter_campaign'
  | 'contact_form'
  | 'admin_notification';

export class DynamicLanguageEmailService {
  /**
   * إرسال إيميل مع كشف اللغة التلقائي
   */
  static async sendEmail(emailData: DynamicEmailData): Promise<EmailResult> {
    try {
      console.log('📧 DynamicLanguageEmailService: بدء إرسال الإيميل...');
      console.log(`📬 إلى: ${emailData.to}`);
      console.log(`📝 نوع القالب: ${emailData.templateType}`);

      // كشف اللغة الحالية مع معالجة الأخطاء
      let detectedLanguage: SupportedLanguage;
      let languageInfo;
      
      try {
        detectedLanguage = emailData.language || getCurrentLanguage();
        languageInfo = LanguageDetectionService.getCurrentLanguage();
        
        console.log(`🌐 اللغة المكتشفة: ${detectedLanguage} (${LanguageDetectionService.getLanguageName(detectedLanguage)})`);
        console.log(`📊 مصدر اللغة: ${languageInfo.source} (ثقة: ${languageInfo.confidence})`);
      } catch (langError) {
        console.warn('⚠️ خطأ في كشف اللغة، استخدام العربية كافتراضي:', langError);
        detectedLanguage = 'ar';
        languageInfo = { source: 'default', confidence: 'low' };
      }

      // إنشاء القالب حسب اللغة مع معالجة الأخطاء
      let templateData;
      try {
        templateData = this.createTemplateData(emailData.templateType, emailData.data, detectedLanguage);
        console.log(`📄 تم إنشاء القالب بنجاح للغة: ${detectedLanguage}`);
      } catch (templateError) {
        console.error('❌ خطأ في إنشاء القالب:', templateError);
        throw new Error('فشل في إنشاء قالب الإيميل');
      }
      
      // إنشاء الإيميل مع معالجة الأخطاء
      let html, text, subject;
      try {
        const templateResult = createUnifiedEmailTemplate(templateData);
        html = templateResult.html;
        text = templateResult.text;
        subject = templateResult.subject;
        console.log(`📧 تم إنشاء الإيميل بنجاح`);
      } catch (templateError) {
        console.error('❌ خطأ في إنشاء الإيميل:', templateError);
        throw new Error('فشل في إنشاء الإيميل');
      }

      // إرسال الإيميل باستخدام الخدمة الموحدة مع معالجة الأخطاء
      let result;
      try {
        result = await UnifiedEmailService.sendEmail({
          to: emailData.to,
          subject: emailData.subject || subject,
          html,
          text,
          type: emailData.templateType
        }, emailData.templateType, detectedLanguage);

        if (result.success) {
          console.log(`✅ تم إرسال الإيميل بنجاح (${detectedLanguage})`);
        } else {
          console.error('❌ فشل في إرسال الإيميل:', result.error);
        }
        
        return result;

      } catch (sendError) {
        console.error('❌ خطأ في إرسال الإيميل:', sendError);
        throw new Error('فشل في إرسال الإيميل');
      }

    } catch (error) {
      console.error('❌ خطأ في إرسال الإيميل الديناميكي:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير متوقع في إرسال الإيميل'
      };
    }
  }

  /**
   * إنشاء بيانات القالب حسب نوع الإيميل واللغة
   */
  private static createTemplateData(
    templateType: EmailTemplateType, 
    data: any, 
    language: SupportedLanguage
  ): EmailTemplateData {
    const isRTL = language === 'ar';
    const direction = isRTL ? 'rtl' : 'ltr';

    switch (templateType) {
      case 'verification':
        return this.createVerificationTemplate(data, language, isRTL);
      
      case 'welcome':
        return this.createWelcomeTemplate(data, language, isRTL);
      
      case 'password_reset':
        return this.createPasswordResetTemplate(data, language, isRTL);
      
      case 'two_factor_login':
        return this.createTwoFactorLoginTemplate(data, language, isRTL);
      
      case 'two_factor_enable':
        return this.createTwoFactorEnableTemplate(data, language, isRTL);
      
      case 'two_factor_disable':
        return this.createTwoFactorDisableTemplate(data, language, isRTL);
      
      case 'login_notification':
        return this.createLoginNotificationTemplate(data, language, isRTL);
      
      case 'profile_update':
        return this.createProfileUpdateTemplate(data, language, isRTL);
      
      case 'security_alert':
        return this.createSecurityAlertTemplate(data, language, isRTL);
      
      case 'newsletter_welcome':
        return this.createNewsletterWelcomeTemplate(data, language, isRTL);
      
      case 'newsletter_campaign':
        return this.createNewsletterCampaignTemplate(data, language, isRTL);
      
      case 'contact_form':
        return this.createContactFormTemplate(data, language, isRTL);
      
      case 'admin_notification':
        return this.createAdminNotificationTemplate(data, language, isRTL);
      
      default:
        return this.createDefaultTemplate(data, language, isRTL);
    }
  }

  /**
   * قالب التحقق من الإيميل
   */
  private static createVerificationTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'تأكيد إنشاء حسابك في رزقي',
        greeting: 'مرحباً بك في رزقي!',
        mainContent: `مرحباً ${data.firstName || 'المستخدم'}،<br><br>نشكرك على انضمامك إلى موقع رزقي للزواج الإسلامي الشرعي. اضغط على الزر أدناه لتأكيد حسابك وتعيين كلمة المرور:`,
        actionButton: {
          text: 'تأكيد الحساب',
          url: data.verificationUrl || '#'
        },
        warning: 'صالح لمدة 24 ساعة فقط. إذا لم تطلب إنشاء حساب، يرجى تجاهل هذا الإيميل.',
        footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: 'Confirm Your Rezge Account',
        greeting: 'Welcome to Rezge!',
        mainContent: `Hello ${data.firstName || 'User'},<br><br>Thank you for joining Rezge Islamic Marriage Platform. Click the button below to confirm your account and set your password:`,
        actionButton: {
          text: 'Confirm Account',
          url: data.verificationUrl || '#'
        },
        warning: 'Valid for 24 hours only. If you did not request account creation, please ignore this email.',
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * قالب الترحيب
   */
  private static createWelcomeTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'مرحباً بك في رزقي - منصة الزواج الإسلامي',
        greeting: '🎉 مرحباً بك في رزقي!',
        mainContent: `مرحباً ${data.firstName || 'المستخدم'}،<br><br>نشكرك على انضمامك إلى منصة رزقي للزواج الإسلامي الشرعي. تم إنشاء حسابك بنجاح وتعيين كلمة المرور. اضغط على الزر أدناه لبدء رحلتك:`,
        actionButton: {
          text: 'ابدأ رحلتك',
          url: data.dashboardUrl || '#'
        },
        footer: 'نحن ملتزمون بتوفير بيئة آمنة ومحترمة للتعارف والزواج وفقاً للشريعة الإسلامية.'
      };
    } else {
      return {
        title: 'Welcome to Rezge - Islamic Marriage Platform',
        greeting: '🎉 Welcome to Rezge!',
        mainContent: `Hello ${data.firstName || 'User'},<br><br>Thank you for joining Rezge Islamic Marriage Platform. Your account has been successfully created and password set. Click the button below to start your journey:`,
        actionButton: {
          text: 'Start Your Journey',
          url: data.dashboardUrl || '#'
        },
        footer: 'We are committed to providing a safe and respectful environment for Islamic marriage and relationships.'
      };
    }
  }

  /**
   * قالب إعادة تعيين كلمة المرور
   */
  private static createPasswordResetTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'إعادة تعيين كلمة المرور - رزقي',
        greeting: 'إعادة تعيين كلمة المرور',
        mainContent: `مرحباً ${data.firstName || 'المستخدم'}،<br><br>تم طلب إعادة تعيين كلمة المرور لحسابك في رزقي. اضغط على الزر أدناه لإعادة تعيين كلمة المرور:`,
        actionButton: {
          text: 'إعادة تعيين كلمة المرور',
          url: data.resetUrl || '#'
        },
        warning: 'صالح لمدة ساعة واحدة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا الإيميل.',
        footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: 'Password Reset - Rezge',
        greeting: 'Password Reset Request',
        mainContent: `Hello ${data.firstName || 'User'},<br><br>A password reset has been requested for your Rezge account. Click the button below to reset your password:`,
        actionButton: {
          text: 'Reset Password',
          url: data.resetUrl || '#'
        },
        warning: 'Valid for 1 hour only. If you did not request a password reset, please ignore this email.',
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * قالب التحقق الثنائي لتسجيل الدخول
   */
  private static createTwoFactorLoginTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'كود تسجيل الدخول - رزقي',
        greeting: 'كود تسجيل الدخول',
        mainContent: `مرحباً ${data.firstName || 'المستخدم'}،<br><br>تم طلب تسجيل دخول لحسابك في منصة رزقي. استخدم الكود التالي لإكمال عملية تسجيل الدخول:`,
        code: data.code,
        warning: 'هذا الكود صالح لمدة 10 دقائق فقط. إذا لم تطلب هذا الكود، يرجى تجاهل هذه الرسالة.',
        footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: 'Login Code - Rezge',
        greeting: 'Login Verification Code',
        mainContent: `Hello ${data.firstName || 'User'},<br><br>A login has been requested for your Rezge account. Use the code below to complete the login process:`,
        code: data.code,
        warning: 'This code is valid for 10 minutes only. If you did not request this code, please ignore this message.',
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * قالب تفعيل التحقق الثنائي
   */
  private static createTwoFactorEnableTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'تم تفعيل المصادقة الثنائية - رزقي',
        greeting: 'تم تفعيل المصادقة الثنائية بنجاح!',
        mainContent: `مرحباً ${data.firstName || 'المستخدم'}،<br><br>تم تفعيل المصادقة الثنائية لحسابك في رزقي بنجاح. هذا سيزيد من أمان حسابك ويحميك من الوصول غير المصرح به.`,
        footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: 'Two-Factor Authentication Enabled - Rezge',
        greeting: 'Two-Factor Authentication Successfully Enabled!',
        mainContent: `Hello ${data.firstName || 'User'},<br><br>Two-factor authentication has been successfully enabled for your Rezge account. This will increase your account security and protect you from unauthorized access.`,
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * قالب تعطيل التحقق الثنائي
   */
  private static createTwoFactorDisableTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'تم تعطيل المصادقة الثنائية - رزقي',
        greeting: 'تم تعطيل المصادقة الثنائية',
        mainContent: `مرحباً ${data.firstName || 'المستخدم'}،<br><br>تم تعطيل المصادقة الثنائية لحسابك في رزقي. ننصحك بإعادة تفعيلها لزيادة أمان حسابك.`,
        footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: 'Two-Factor Authentication Disabled - Rezge',
        greeting: 'Two-Factor Authentication Disabled',
        mainContent: `Hello ${data.firstName || 'User'},<br><br>Two-factor authentication has been disabled for your Rezge account. We recommend re-enabling it to increase your account security.`,
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * قالب إشعار تسجيل الدخول
   */
  private static createLoginNotificationTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'إشعار تسجيل دخول ناجح - رزقي',
        greeting: 'تم تسجيل الدخول بنجاح!',
        mainContent: `مرحباً ${data.firstName || 'المستخدم'}،<br><br>تم تسجيل الدخول إلى حسابك في موقع رزقي بنجاح.<br><br><strong>تفاصيل الجلسة:</strong><br>📅 التاريخ والوقت: ${data.dateTime || 'غير محدد'}<br>💻 نوع الجهاز: ${data.deviceType || 'غير محدد'}<br>🌐 المتصفح: ${data.browser || 'غير محدد'}<br>📍 الموقع: ${data.location || 'غير محدد'}`,
        warning: 'إذا لم تقم بتسجيل الدخول في هذا الوقت، يرجى تغيير كلمة المرور فوراً والتواصل معنا على support@rezgee.com',
        footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: 'Successful Login Notification - Rezge',
        greeting: 'Login Successful!',
        mainContent: `Hello ${data.firstName || 'User'},<br><br>You have successfully logged into your Rezge account.<br><br><strong>Session Details:</strong><br>📅 Date & Time: ${data.dateTime || 'Not specified'}<br>💻 Device Type: ${data.deviceType || 'Not specified'}<br>🌐 Browser: ${data.browser || 'Not specified'}<br>📍 Location: ${data.location || 'Not specified'}`,
        warning: 'If you did not log in at this time, please change your password immediately and contact us at support@rezgee.com',
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * قالب تحديث الملف الشخصي
   */
  private static createProfileUpdateTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'تم تحديث ملفك الشخصي - رزقي',
        greeting: 'تم تحديث ملفك الشخصي بنجاح!',
        mainContent: `مرحباً ${data.firstName || 'المستخدم'}،<br><br>تم تحديث ملفك الشخصي في رزقي بنجاح. التغييرات التي تمت:<br><br>${data.changes || 'تم تحديث المعلومات الشخصية'}`,
        footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: 'Profile Updated - Rezge',
        greeting: 'Your Profile Has Been Successfully Updated!',
        mainContent: `Hello ${data.firstName || 'User'},<br><br>Your Rezge profile has been successfully updated. Changes made:<br><br>${data.changes || 'Personal information has been updated'}`,
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * قالب تنبيه أمني
   */
  private static createSecurityAlertTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'تنبيه أمني - رزقي',
        greeting: '⚠️ تنبيه أمني',
        mainContent: `مرحباً ${data.firstName || 'المستخدم'}،<br><br>تم اكتشاف نشاط غير عادي على حسابك في رزقي. ننصحك بمراجعة نشاط حسابك وتغيير كلمة المرور إذا لزم الأمر.<br><br><strong>تفاصيل التنبيه:</strong><br>${data.alertDetails || 'نشاط غير عادي تم اكتشافه'}`,
        warning: 'إذا لم تقم بهذا النشاط، يرجى تغيير كلمة المرور فوراً والتواصل معنا على support@rezgee.com',
        footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: 'Security Alert - Rezge',
        greeting: '⚠️ Security Alert',
        mainContent: `Hello ${data.firstName || 'User'},<br><br>Unusual activity has been detected on your Rezge account. We recommend reviewing your account activity and changing your password if necessary.<br><br><strong>Alert Details:</strong><br>${data.alertDetails || 'Unusual activity detected'}`,
        warning: 'If you did not perform this activity, please change your password immediately and contact us at support@rezgee.com',
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * قالب ترحيب النشرة الإخبارية
   */
  private static createNewsletterWelcomeTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'مرحباً بك في النشرة الإخبارية لرزقي',
        greeting: 'مرحباً بك في النشرة الإخبارية!',
        mainContent: `مرحباً ${data.firstName || 'المشترك'}،<br><br>نشكرك على الاشتراك في النشرة الإخبارية لرزقي. ستتلقى آخر الأخبار والتحديثات حول منصة الزواج الإسلامي الشرعي.`,
        footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: 'Welcome to Rezge Newsletter',
        greeting: 'Welcome to Our Newsletter!',
        mainContent: `Hello ${data.firstName || 'Subscriber'},<br><br>Thank you for subscribing to the Rezge newsletter. You will receive the latest news and updates about the Islamic marriage platform.`,
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * قالب حملة النشرة الإخبارية
   */
  private static createNewsletterCampaignTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: `النشرة الإخبارية لرزقي - ${data.title || 'تحديث جديد'}`,
        greeting: 'أهلاً وسهلاً مشترك النشرة الإخبارية،',
        mainContent: data.content || 'محتوى النشرة الإخبارية',
        footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: `Rezge Newsletter - ${data.title || 'New Update'}`,
        greeting: 'Hello Newsletter Subscriber,',
        mainContent: data.content || 'Newsletter content',
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * قالب نموذج التواصل
   */
  private static createContactFormTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'رسالة تواصل جديدة - رزقي',
        greeting: 'رسالة تواصل جديدة',
        mainContent: `تم استلام رسالة تواصل جديدة من موقع رزقي.<br><br><strong>تفاصيل المرسل:</strong><br>الاسم: ${data.name || 'غير محدد'}<br>البريد الإلكتروني: ${data.email || 'غير محدد'}<br>الموضوع: ${data.subject || 'غير محدد'}<br><br><strong>الرسالة:</strong><br>${data.message || 'لا توجد رسالة'}`,
        footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: 'New Contact Message - Rezge',
        greeting: 'New Contact Message',
        mainContent: `A new contact message has been received from the Rezge website.<br><br><strong>Sender Details:</strong><br>Name: ${data.name || 'Not specified'}<br>Email: ${data.email || 'Not specified'}<br>Subject: ${data.subject || 'Not specified'}<br><br><strong>Message:</strong><br>${data.message || 'No message'}`,
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * قالب إشعار إداري
   */
  private static createAdminNotificationTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'إشعار إداري - رزقي',
        greeting: 'إشعار إداري',
        mainContent: `مرحباً ${data.adminName || 'المدير'}،<br><br>${data.message || 'تم استلام إشعار إداري جديد'}`,
        footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: 'Admin Notification - Rezge',
        greeting: 'Admin Notification',
        mainContent: `Hello ${data.adminName || 'Admin'},<br><br>${data.message || 'A new admin notification has been received'}`,
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * القالب الافتراضي
   */
  private static createDefaultTemplate(data: any, language: SupportedLanguage, isRTL: boolean): EmailTemplateData {
    if (language === 'ar') {
      return {
        title: 'إشعار من رزقي',
        greeting: 'مرحباً',
        mainContent: data.message || 'رسالة من رزقي',
        footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي'
      };
    } else {
      return {
        title: 'Notification from Rezge',
        greeting: 'Hello',
        mainContent: data.message || 'Message from Rezge',
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
  }

  /**
   * تسجيل معلومات الإيميل للتصحيح
   */
  static logEmailInfo(emailData: DynamicEmailData, detectedLanguage: SupportedLanguage): void {
    console.log('📊 معلومات الإيميل الديناميكي:');
    console.log(`   إلى: ${emailData.to}`);
    console.log(`   نوع القالب: ${emailData.templateType}`);
    console.log(`   اللغة المكتشفة: ${detectedLanguage}`);
    console.log(`   اللغة المحددة: ${emailData.language || 'تلقائي'}`);
    console.log(`   إجبار اللغة: ${emailData.forceLanguage || false}`);
  }
}

// تصدير مثيل افتراضي
export const dynamicLanguageEmailService = DynamicLanguageEmailService;

// تصدير دوال مساعدة
export const sendDynamicEmail = (emailData: DynamicEmailData): Promise<EmailResult> => {
  return DynamicLanguageEmailService.sendEmail(emailData);
};

export const sendVerificationEmail = (email: string, data: any): Promise<EmailResult> => {
  return DynamicLanguageEmailService.sendEmail({
    to: email,
    templateType: 'verification',
    data
  });
};

export const sendTwoFactorCodeEmail = (email: string, code: string, firstName?: string): Promise<EmailResult> => {
  return DynamicLanguageEmailService.sendEmail({
    to: email,
    templateType: 'two_factor_login',
    data: { code, firstName }
  });
};

export const sendLoginNotificationEmail = (email: string, data: any): Promise<EmailResult> => {
  return DynamicLanguageEmailService.sendEmail({
    to: email,
    templateType: 'login_notification',
    data
  });
};
