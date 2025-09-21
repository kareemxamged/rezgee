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
}

export interface EmailResult {
  success: boolean;
  error?: string;
  method?: string;
  messageId?: string;
}

export class UnifiedEmailService {
  private static readonly fromEmail = 'manage@kareemamged.com';
  private static readonly fromName = 'رزقي - منصة الزواج الإسلامي الشرعي';
  private static readonly fromNameEn = 'Rezge - Islamic Marriage Platform';

  /**
   * الحصول على اسم المرسل حسب اللغة
   */
  private static getSenderName(language: 'ar' | 'en' = 'ar'): string {
    return language === 'ar' ? this.fromName : this.fromNameEn;
  }

  /**
   * إرسال إيميل عام باستخدام التيمبليت الموحد
   */
  static async sendEmail(emailData: EmailData, _emailType: string = 'system', language: 'ar' | 'en' = 'ar'): Promise<EmailResult> {
    console.log('📧 UnifiedEmailService: بدء إرسال الإيميل...');
    console.log(`📬 إلى: ${emailData.to}`);
    console.log(`📝 الموضوع: ${emailData.subject}`);

    // إضافة اسم المرسل حسب اللغة مع البريد الإلكتروني
    const senderName = this.getSenderName(language);
    const enhancedEmailData = {
      ...emailData,
      from: emailData.from || senderName, // استخدام اسم المرسل فقط بدون البريد الإلكتروني
      replyTo: 'support@rezge.com'
    };

    console.log(`👤 من: ${enhancedEmailData.from}`);

    // ترتيب الأولويات: خادم محلي (3001) → Supabase Custom SMTP → Resend → FormSubmit
    const methods = [
      () => this.sendViaLocalSMTP(enhancedEmailData),
      () => this.sendViaSupabaseCustomSMTP(enhancedEmailData),
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
  private static async sendViaSupabaseCustomSMTP(emailData: EmailData): Promise<EmailResult> {
    try {
      console.log('🚀 محاولة الإرسال عبر Supabase Custom SMTP...');

      const response = await fetch('https://sbtzngewizgeqzfbhfjy.supabase.co/functions/v1/send-custom-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text
        })
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
  private static async sendViaLocalSMTP(emailData: EmailData): Promise<EmailResult> {
    try {
      // تخطي في بيئة الإنتاج
      if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
        throw new Error('Local SMTP not available in production');
      }

      console.log('🏠 محاولة الإرسال عبر خادم SMTP محلي...');

      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
          from: `${emailData.from} <${this.fromEmail}>`,
          fromEmail: this.fromEmail,
          fromName: emailData.from
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
          from: `${emailData.from} <${this.fromEmail}>`,
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
