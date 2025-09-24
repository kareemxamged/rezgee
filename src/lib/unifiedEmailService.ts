// خدمة الإيميل الموحدة - رزقي
// تستخدم التيمبليت الموحد مع طرق إرسال متعددة

import { createUnifiedEmailTemplate, EmailTemplates } from './unifiedEmailTemplate';
import { dynamicLinkManager } from './dynamicLinkManager';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
  type?: string;
  from?: string;
  replyTo?: string;
  fromName?: string;
  templateId?: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
  method?: string;
  messageId?: string;
}

export class UnifiedEmailService {
  // إزالة الإعدادات الثابتة - سيتم جلبها من قاعدة البيانات

  /**
   * الحصول على اسم المرسل حسب اللغة من قاعدة البيانات
   */
  private static async getSenderName(language: 'ar' | 'en' = 'ar'): Promise<string> {
    try {
      const { DatabaseSMTPManager } = await import('./databaseSMTPManager');
      const settings = await DatabaseSMTPManager.getDefaultSMTPSettings();
      
      if (settings) {
        return language === 'ar' ? settings.from_name_ar : settings.from_name_en;
      }
      
      // إعدادات افتراضية في حالة عدم وجود إعدادات في قاعدة البيانات
      return language === 'ar' ? 'رزقي - منصة الزواج الإسلامي الشرعي' : 'Rezge - Islamic Marriage Platform';
    } catch (error) {
      console.error('❌ خطأ في جلب اسم المرسل:', error);
      return language === 'ar' ? 'رزقي - منصة الزواج الإسلامي الشرعي' : 'Rezge - Islamic Marriage Platform';
    }
  }

  /**
   * إرسال إيميل عام باستخدام التيمبليت الموحد
   */
  static async sendEmail(emailData: EmailData, _emailType: string = 'system', language: 'ar' | 'en' = 'ar'): Promise<EmailResult> {
    console.log('📧 UnifiedEmailService: بدء إرسال الإيميل...');
    console.log(`📬 إلى: ${emailData.to}`);
    console.log(`📝 الموضوع: ${emailData.subject}`);

    // إذا كان هناك templateId، جلب إعدادات SMTP المحددة في القالب
    if (emailData.templateId) {
      console.log(`🔧 جلب إعدادات SMTP للقالب: ${emailData.templateId}`);
      try {
        const { TemplateSMTPManager } = await import('./templateSMTPManager');
        const smtpSettings = await TemplateSMTPManager.getSMTPForTemplate(emailData.templateId);
        
        if (smtpSettings) {
          console.log(`✅ تم جلب إعدادات SMTP للقالب: ${smtpSettings.smtp_host}:${smtpSettings.smtp_port}`);
          console.log(`🔧 إعدادات SMTP المستخدمة:`, {
            id: smtpSettings.id,
            host: smtpSettings.smtp_host,
            port: smtpSettings.smtp_port,
            from_email: smtpSettings.from_email,
            from_name_ar: smtpSettings.from_name_ar,
            is_default: smtpSettings.is_default
          });
          
          // استخدام إعدادات SMTP المحددة في القالب
    const enhancedEmailData = {
      ...emailData,
            from: smtpSettings.from_email,
            fromName: smtpSettings.from_name_ar,
            replyTo: smtpSettings.reply_to || smtpSettings.from_email
          };

          console.log(`👤 من: ${enhancedEmailData.fromName} <${enhancedEmailData.from}>`);

          // إرسال باستخدام الخادم المحلي مع إعدادات SMTP المحددة
          const result = await this.sendViaLocalSMTP(enhancedEmailData, smtpSettings);
          if (result.success) {
            console.log(`✅ تم إرسال الإيميل بنجاح باستخدام إعدادات SMTP المحددة في القالب`);
            return result;
          }
        }
      } catch (error) {
        console.error('❌ خطأ في جلب إعدادات SMTP للقالب:', error);
      }
    }

    // جلب إعدادات SMTP من قاعدة البيانات
    const { DatabaseSMTPManager } = await import('./databaseSMTPManager');
    const smtpSettings = await DatabaseSMTPManager.getDefaultSMTPSettings();
    
    let enhancedEmailData;
    
    if (smtpSettings) {
      console.log('✅ تم جلب إعدادات SMTP من قاعدة البيانات:', smtpSettings.smtp_host);
      const senderName = await this.getSenderName(language);
      enhancedEmailData = {
        ...emailData,
        from: emailData.from || smtpSettings.from_email,
        fromName: emailData.fromName || senderName,
        replyTo: emailData.replyTo || smtpSettings.reply_to || smtpSettings.from_email
      };
    } else {
      console.warn('⚠️ لم يتم العثور على إعدادات SMTP في قاعدة البيانات، استخدام الإعدادات الافتراضية');
      const senderName = await this.getSenderName(language);
      enhancedEmailData = {
        ...emailData,
        from: emailData.from || 'manage@kareemamged.com',
        fromName: emailData.fromName || senderName,
        replyTo: emailData.replyTo || 'support@rezge.com'
      };
    }

    console.log(`👤 من: ${enhancedEmailData.from}`);

    // ترتيب الأولويات: خادم محلي (3001) أولاً → Resend → FormSubmit (تجنب Supabase بسبب CORS)
    const methods = [
      () => this.sendViaLocalSMTP(enhancedEmailData),
      () => this.sendViaResend(enhancedEmailData),
      () => this.sendViaFormSubmit(enhancedEmailData)
    ];

    for (const method of methods) {
      try {
        const result = await method();
          if (result.success) {
          console.log(`✅ تم إرسال الإيميل بنجاح عبر ${result.method}`);
          return result;
        }
        console.log(`⚠️ فشل ${result.method}: ${result.error}`);
      } catch (error) {
        console.log(`❌ خطأ في ${method.name}:`, error);
      }
    }

      return { 
        success: false, 
      error: 'فشل إرسال الإيميل عبر جميع الطرق المتاحة'
    };
  }

  /**
   * إرسال إيميل التحقق من الحساب (صفحة إنشاء الحساب)
   * يستخدم تيمبليت التحقق من finalEmailService.ts مع دعم النسختين
   */
  static async sendVerificationEmail(
    email: string, 
    verificationUrl: string, 
    userData: { first_name: string; last_name: string },
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    try {
      // استيراد finalEmailService
      const { AdvancedEmailService } = await import('./finalEmailService');
      
      // استخدام تيمبليت التحقق من finalEmailService
      const template = AdvancedEmailService.generateEmailTemplate('verification', {
        verificationUrl,
        firstName: userData.first_name,
        lastName: userData.last_name
      }, language);

      return await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent,
        type: 'verification'
      }, 'verification', language);
    } catch (error) {
      console.error('❌ خطأ في إرسال إيميل التحقق:', error);
      return {
        success: false,
        error: `فشل في إرسال إيميل التحقق: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      };
    }
  }

  /**
   * إرسال كلمة المرور المؤقتة (صفحة نسيت كلمة المرور)
   * يستخدم تيمبليت كلمة المرور المؤقتة من finalEmailService.ts مع دعم النسختين
   */
  static async sendTemporaryPasswordEmail(
    email: string,
    temporaryPassword: string,
    expiresAt: string,
    recipientName?: string,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    try {
      // استيراد finalEmailService
      const { AdvancedEmailService } = await import('./finalEmailService');
      
      // استخدام تيمبليت كلمة المرور المؤقتة من finalEmailService
      const template = AdvancedEmailService.generateEmailTemplate('temporary_password', {
        temporaryPassword,
        expiresAt,
        recipientName
      }, language);

      return await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent,
        type: 'temporary_password'
      }, 'security', language);
    } catch (error) {
      console.error('❌ خطأ في إرسال كلمة المرور المؤقتة:', error);
      return {
        success: false,
        error: `فشل في إرسال كلمة المرور المؤقتة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      };
    }
  }

  /**
   * إرسال رمز التحقق الثنائي (صفحة التحقق الثنائي)
   * يستخدم تيمبليت رمز التحقق الثنائي من finalEmailService.ts مع دعم النسختين
   */
  static async send2FACodeEmail(
    email: string,
    code: string,
    codeType: string = 'login',
    expiresInMinutes: number = 15,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    try {
      // استيراد finalEmailService
      const { AdvancedEmailService } = await import('./finalEmailService');
      
      // استخدام تيمبليت رمز التحقق الثنائي من finalEmailService
      const template = AdvancedEmailService.generateEmailTemplate('2fa_code', {
        code,
        codeType,
        expiresInMinutes
      }, language);

      return await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent,
        type: '2fa_code'
      }, 'security', language);
    } catch (error) {
      console.error('❌ خطأ في إرسال رمز التحقق الثنائي:', error);
      return {
        success: false,
        error: `فشل في إرسال رمز التحقق الثنائي: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      };
    }
  }

  /**
   * إرسال رمز التحقق الإداري
   */
  static async sendAdmin2FACodeEmail(
    email: string,
    code: string,
    adminEmail: string,
    expiresInMinutes: number = 10,
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    console.log(`📧 إرسال رمز التحقق الإداري للمشرف: ${email} (${language})`);
    
    const templateData = EmailTemplates.adminTwoFactor(code, adminEmail, expiresInMinutes, language);
    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await this.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'admin_2fa'
    }, 'admin', language);
  }

  /**
   * إرسال تأكيد تغيير البريد الإلكتروني
   */
  static async sendEmailChangeConfirmation(
    email: string,
    confirmationUrl: string,
    newEmail: string,
    currentEmail: string
  ): Promise<EmailResult> {
    const templateData = EmailTemplates.emailChange(confirmationUrl, newEmail, currentEmail);
    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await this.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'email_change_confirmation'
    }, 'security', 'ar');
  }

  /**
   * إرسال رمز أمان الإعدادات
   */
  static async sendSecurity2FACodeEmail(
    email: string,
    code: string,
    action: string,
    expiresInMinutes: number = 15
  ): Promise<EmailResult> {
    const templateData = EmailTemplates.securityTwoFactor(code, action, expiresInMinutes);
    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await this.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'security_2fa'
    }, 'security', 'ar');
  }

  /**
   * إرسال إشعار تسجيل الدخول الناجح
   */
  static async sendLoginNotificationEmail(
    email: string,
    loginData: any
  ): Promise<EmailResult> {
    const templateData = EmailTemplates.loginNotification(loginData);
    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await this.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'login_notification'
    }, 'login_notification', 'ar');
  }

  /**
   * إرسال رسالة ترحيب للمستخدمين الجدد (بعد إنشاء الحساب وتعيين كلمة المرور)
   * يستخدم تيمبليت ترحيبي مخصص من finalEmailService.ts مع دعم النسختين
   */
  static async sendWelcomeEmail(
    email: string,
    userData: { first_name: string; last_name: string },
    language: 'ar' | 'en' = 'ar'
  ): Promise<EmailResult> {
    try {
      // استيراد finalEmailService
      const { AdvancedEmailService } = await import('./finalEmailService');
      
      // إنشاء تيمبليت ترحيبي مخصص باستخدام تيمبليت التحقق كأساس
      const template = AdvancedEmailService.generateEmailTemplate('verification', {
        verificationUrl: dynamicLinkManager.createLink('dashboard'),
        firstName: userData.first_name,
        lastName: userData.last_name
      }, language);

      // إنشاء المحتوى الترحيبي حسب اللغة
      const welcomeContent = language === 'ar' ? {
        title: 'مرحباً بك في رزقي - منصة الزواج الإسلامي',
        greeting: '🎉 مرحباً بك في رزقي!',
        mainText: 'نشكرك على انضمامك إلى منصة رزقي للزواج الإسلامي الشرعي. تم إنشاء حسابك بنجاح وتعيين كلمة المرور. اضغط على الزر أدناه لبدء رحلتك:',
        buttonText: 'ابدأ رحلتك',
        additionalInfo: 'يمكنك الآن الاستمتاع بجميع ميزات المنصة',
        footer: 'نحن ملتزمون بتوفير بيئة آمنة ومحترمة للتعارف والزواج وفقاً للشريعة الإسلامية.',
        subject: 'مرحباً بك في رزقي - منصة الزواج الإسلامي',
        textContent: `مرحباً ${userData.first_name} ${userData.last_name}،\n\nنشكرك على انضمامك إلى منصة رزقي للزواج الإسلامي الشرعي. تم إنشاء حسابك بنجاح وتعيين كلمة المرور.\n\nابدأ رحلتك: ${dynamicLinkManager.createLink('dashboard')}\n\nنحن ملتزمون بتوفير بيئة آمنة ومحترمة للتعارف والزواج وفقاً للشريعة الإسلامية.\n\nفريق رزقي - موقع الزواج الإسلامي الشرعي`
      } : {
        title: 'Welcome to Rezge - Islamic Marriage Platform',
        greeting: '🎉 Welcome to Rezge!',
        mainText: 'Thank you for joining Rezge Islamic Marriage Platform. Your account has been successfully created and password set. Click the button below to start your journey:',
        buttonText: 'Start Your Journey',
        additionalInfo: 'You can now enjoy all platform features',
        footer: 'We are committed to providing a safe and respectful environment for Islamic marriage and relationships.',
        subject: 'Welcome to Rezge - Islamic Marriage Platform',
        textContent: `Hello ${userData.first_name} ${userData.last_name},\n\nThank you for joining Rezge Islamic Marriage Platform. Your account has been successfully created and password set.\n\nStart your journey: ${dynamicLinkManager.createLink('dashboard')}\n\nWe are committed to providing a safe and respectful environment for Islamic marriage and relationships.\n\nRezge Team - Islamic Marriage Platform`
      };

      // تعديل التيمبليت ليكون ترحيبياً
      const welcomeHtml = template.htmlContent
        .replace('تأكيد إنشاء حسابك في رزقي', welcomeContent.title)
        .replace('مرحباً بك في رزقي!', welcomeContent.greeting)
        .replace('نشكرك على انضمامك إلى موقع رزقي للزواج الإسلامي الشرعي. اضغط على الزر أدناه لتأكيد حسابك وتعيين كلمة المرور:', welcomeContent.mainText)
        .replace('تأكيد الحساب', welcomeContent.buttonText)
        .replace('صالح لمدة 24 ساعة فقط', welcomeContent.additionalInfo)
        .replace('إذا لم تطلب إنشاء حساب، يرجى تجاهل هذا الإيميل.', welcomeContent.footer);

      const welcomeSubject = welcomeContent.subject;
      const welcomeText = welcomeContent.textContent;

      return await this.sendEmail({
        to: email,
        subject: welcomeSubject,
        html: welcomeHtml,
        text: welcomeText,
        type: 'welcome'
      }, 'welcome', language);
    } catch (error) {
      console.error('❌ خطأ في إرسال إيميل الترحيب:', error);
      return {
        success: false,
        error: `فشل في إرسال إيميل الترحيب: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      };
    }
  }

  // ===== طرق الإرسال =====

  /**
   * إرسال عبر Supabase Custom SMTP (الأولوية الأولى)
   */
  private static async sendViaSupabaseCustomSMTP(emailData: EmailData, smtpSettings?: any): Promise<EmailResult> {
    try {
      console.log('🚀 محاولة الإرسال عبر Supabase Custom SMTP...');

      const requestBody: any = {
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      };

      // إذا كانت هناك إعدادات SMTP محددة، أضفها للطلب
      if (smtpSettings) {
        console.log('🔧 استخدام إعدادات SMTP المحددة في القالب');
        const { TemplateSMTPManager } = await import('./templateSMTPManager');
        requestBody.smtpConfig = TemplateSMTPManager.formatSMTPConfig(smtpSettings);
      } else {
        // استخدام إعدادات SMTP الافتراضية من قاعدة البيانات
        console.log('🔧 استخدام إعدادات SMTP الافتراضية من قاعدة البيانات');
        const { DatabaseSMTPManager } = await import('./databaseSMTPManager');
        const defaultSettings = await DatabaseSMTPManager.getDefaultSMTPSettings();
        
        if (defaultSettings) {
          requestBody.smtpConfig = DatabaseSMTPManager.formatSMTPConfig(defaultSettings);
        }
      }

      const response = await fetch('https://sbtzngewizgeqzfbhfjy.supabase.co/functions/v1/send-custom-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          method: 'Supabase Custom SMTP',
          messageId: result.messageId
        };
      }

      return {
        success: false,
        error: `Supabase SMTP error: ${response.status}`,
        method: 'Supabase Custom SMTP'
      };
    } catch (error) {
      return {
        success: false,
        error: `Supabase SMTP connection error: ${error}`,
        method: 'Supabase Custom SMTP'
      };
    }
  }

  /**
   * إرسال عبر خادم SMTP محلي (للتطوير)
   */
  private static async sendViaLocalSMTP(emailData: EmailData, smtpSettings?: any): Promise<EmailResult> {
    try {
      // السماح باستخدام خادم SMTP المحلي في جميع البيئات
      // if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('148.230.112.17') && !window.location.hostname.includes('rezgee.com')) {
      //   throw new Error('Local SMTP not available in production');
      // }

      console.log('🏠 محاولة الإرسال عبر خادم SMTP محلي...');

      // استخدام العنوان الصحيح حسب البيئة
      const smtpUrl = (window.location.hostname.includes('148.230.112.17') || window.location.hostname.includes('rezgee.com'))
        ? 'https://148.230.112.17:3001/send-email'
        : 'https://localhost:3001/send-email';
      
      const response = await fetch(smtpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
          from: emailData.from || smtpSettings?.from_email || 'noreply@rezgee.com',
          fromEmail: emailData.from || smtpSettings?.from_email || 'noreply@rezgee.com',
          fromName: emailData.fromName || smtpSettings?.from_name_ar || 'رزقي - منصة الزواج الإسلامي الشرعي',
          smtpConfig: smtpSettings ? {
            host: smtpSettings.smtp_host,
            port: smtpSettings.smtp_port,
            secure: smtpSettings.secure || smtpSettings.smtp_port === 465,
            auth: {
              user: smtpSettings.smtp_username,
              pass: smtpSettings.smtp_password
            },
            from: {
              name: smtpSettings.from_name_ar,
              email: smtpSettings.from_email
            }
          } : undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          method: 'Local SMTP Server',
          messageId: result.messageId
        };
      }

      return {
        success: false,
        error: `Local SMTP error: ${response.status}`,
        method: 'Local SMTP Server'
      };
    } catch (error) {
      return {
        success: false,
        error: `Local SMTP connection error: ${error}`,
        method: 'Local SMTP Server'
      };
    }
  }

  /**
   * إرسال عبر Resend API
   */
  private static async sendViaResend(emailData: EmailData): Promise<EmailResult> {
    try {
      console.log('📮 محاولة الإرسال عبر Resend API...');

      const apiKey = 're_Eeyyz27p_A9UUaYMYoj5Q2xKqRygMJCQU';

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${emailData.fromName || 'رزقي'} <${emailData.from || 'manage@kareemamged.com'}>`,
          to: [emailData.to],
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
        })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          method: 'Resend API',
          messageId: result.id
        };
      }

      return {
        success: false,
        error: `Resend API error: ${response.status}`,
        method: 'Resend API'
      };
    } catch (error) {
      return {
        success: false,
        error: `Resend API connection error: ${error}`,
        method: 'Resend API'
      };
    }
  }

  /**
   * إرسال عبر FormSubmit (احتياطي)
   */
  private static async sendViaFormSubmit(emailData: EmailData): Promise<EmailResult> {
    try {
      console.log('📧 محاولة الإرسال عبر FormSubmit...');

      const formData = new FormData();
      formData.append('name', emailData.from || 'رزقي');
      formData.append('email', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('message', `إيميل من موقع رزقي:\n\nالموضوع: ${emailData.subject}\n\nالمحتوى:\n${emailData.text}`);
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');

      await fetch('https://formsubmit.co/370148090fd7ab641a5d000f67b21afe', {
        method: 'POST',
        body: formData
      });

      // FormSubmit يعيد redirect عادة، لذا نعتبر أي استجابة نجاح
      return {
        success: true,
        method: 'FormSubmit',
        messageId: `formsubmit_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        error: `FormSubmit error: ${error}`,
        method: 'FormSubmit'
      };
    }
  }

  /**
   * إرسال إشعار تسجيل الدخول الناجح
   */
  static async sendSuccessfulLoginNotification(
    userEmail: string,
    loginData: {
      timestamp: string;
      ipAddress?: string;
      location?: string;
      deviceType?: string;
      browser?: string;
      userAgent?: string;
      loginMethod?: 'normal' | 'trusted_device' | 'two_factor';
    }
  ): Promise<EmailResult> {
    try {
      console.log('📧 UnifiedEmailService: إرسال إشعار تسجيل الدخول الناجح...');
      
      // محاولة 1: استخدام النظام الجديد المتصل بقاعدة البيانات
      try {
        const { AuthEmailServiceDatabase } = await import('./authEmailServiceDatabase');
        
        const result = await AuthEmailServiceDatabase.sendSuccessfulLoginNotification(
          userEmail,
          'مستخدم', // سيتم تحديثه لاحقاً
          {
            timestamp: loginData.timestamp,
            ipAddress: loginData.ipAddress || 'غير محدد',
            location: loginData.location || 'غير محدد',
            device: loginData.deviceType || 'غير محدد',
            browser: loginData.browser || 'غير محدد'
          }
        );
        
        if (result.success) {
          console.log('✅ تم إرسال إشعار تسجيل الدخول بنجاح عبر قاعدة البيانات');
          return {
            success: true,
            method: 'Database Email Service',
            messageId: 'db_' + Date.now()
          };
        } else {
          console.warn('⚠️ فشل النظام المتصل بقاعدة البيانات:', result.error);
        }
      } catch (dbError) {
        console.warn('⚠️ خطأ في النظام المتصل بقاعدة البيانات:', dbError);
      }
      
      // محاولة 2: استخدام قالب قاعدة البيانات مباشرة
      console.log('🔄 محاولة استخدام قالب قاعدة البيانات مباشرة...');
      
      try {
        const { DatabaseEmailService } = await import('./databaseEmailService');
        
        // جلب قالب login_success من قاعدة البيانات
        const template = await DatabaseEmailService.getEmailTemplate('login_success', 'ar');
        
        if (template) {
          console.log('✅ تم جلب قالب login_success من قاعدة البيانات');
          console.log('📧 موضوع القالب:', template.subject_ar);
          
          // استبدال المتغيرات في القالب
          let processedSubject = template.subject_ar;
          let processedHtml = template.html_template_ar;
          let processedText = template.content_ar;
          
          // استبدال المتغيرات الأساسية
          const replacements = {
            '{{userName}}': 'مستخدم',
            '{{timestamp}}': loginData.timestamp,
            '{{loginDate}}': new Date(loginData.timestamp).toLocaleDateString('en-GB'),
            '{{loginTime}}': new Date(loginData.timestamp).toLocaleTimeString('en-GB', { hour12: false }),
            '{{ipAddress}}': loginData.ipAddress || 'غير محدد',
            '{{location}}': loginData.location || 'غير محدد',
            '{{deviceType}}': loginData.deviceType || 'غير محدد',
            '{{browser}}': loginData.browser || 'غير محدد',
            '{{loginMethod}}': 'تسجيل دخول عادي'
          };
          
          // تطبيق الاستبدالات
          for (const [key, value] of Object.entries(replacements)) {
            processedSubject = processedSubject.replace(new RegExp(key, 'g'), value);
            processedHtml = processedHtml.replace(new RegExp(key, 'g'), value);
            processedText = processedText.replace(new RegExp(key, 'g'), value);
          }
          
          console.log('📧 موضوع الإيميل المعالج:', processedSubject);
          
          // إرسال مباشر عبر الخادم المحلي
          const response = await fetch('http://localhost:3001/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: userEmail,
              subject: processedSubject,
              html: processedHtml,
              text: processedText,
              from: 'manage@kareemamged.com',
              fromName: 'رزقي - موقع الزواج الإسلامي'
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              console.log('✅ تم إرسال إشعار تسجيل الدخول بنجاح باستخدام قالب قاعدة البيانات');
              return {
                success: true,
                method: 'Database Template + Local SMTP',
                messageId: result.messageId
              };
            } else {
              console.error('❌ فشل في إرسال الإيميل عبر الخادم المحلي:', result.error);
            }
          } else {
            console.error('❌ خطأ في الاتصال بالخادم المحلي:', response.status);
          }
        } else {
          console.warn('⚠️ لم يتم العثور على قالب login_success في قاعدة البيانات');
        }
      } catch (dbError) {
        console.error('❌ خطأ في استخدام قالب قاعدة البيانات:', dbError);
      }
      
      // محاولة 3: استخدام القالب المدمج كـ fallback أخير
      console.log('🔄 استخدام القالب المدمج كـ fallback أخير...');
      
      const { EmailTemplates, createUnifiedEmailTemplate } = await import('./unifiedEmailTemplate');
      
      const templateData = EmailTemplates.loginNotification({
        timestamp: loginData.timestamp,
        loginMethod: loginData.loginMethod || 'normal',
        userName: 'مستخدم',
        ipAddress: loginData.ipAddress,
        location: loginData.location,
        deviceType: loginData.deviceType,
        browser: loginData.browser
      });
      
      const { html, text, subject } = createUnifiedEmailTemplate(templateData);
      
      const emailData = {
        to: userEmail,
        subject,
        html,
        text,
        type: 'login_success'
      };
      
      // إرسال باستخدام النظام الموحد
      const result = await this.sendEmail(emailData, 'login_success');
      
      if (result.success) {
        console.log('✅ تم إرسال إشعار تسجيل الدخول بنجاح عبر القالب المدمج');
        return result;
      } else {
        console.error('❌ فشل في إرسال إشعار تسجيل الدخول عبر القالب المدمج:', result.error);
        return result;
      }
      
    } catch (error) {
      console.error('❌ خطأ في UnifiedEmailService.sendSuccessfulLoginNotification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير معروف',
        method: 'Error'
      };
    }
  }

  /**
   * اختبار النظام
   */
  static async testSystem(email: string = 'kemooamegoo@gmail.com'): Promise<EmailResult> {
    console.log('🧪 اختبار نظام الإيميل الموحد...');

    const testData = EmailTemplates.welcome('مستخدم', 'الاختبار');
    const { html, text, subject } = createUnifiedEmailTemplate(testData);

    return await this.sendEmail({
      to: email,
      subject: `[اختبار] ${subject}`,
      html,
      text,
      type: 'test'
    }, 'system', 'ar');
  }
}

export default UnifiedEmailService;
