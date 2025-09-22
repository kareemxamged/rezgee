import { supabase } from './supabase';
import { TemplateSMTPManager } from './templateSMTPManager';

// خدمة إرسال الإيميلات بناءً على إعدادات SMTP المحددة في القوالب
export class TemplateBasedEmailService {
  
  /**
   * إرسال إيميل مباشر باستخدام بيانات محددة وإعدادات SMTP من القالب
   */
  static async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
    text: string;
    templateId: string;
  }): Promise<{ success: boolean; error?: string; method?: string; messageId?: string }> {
    try {
      console.log('📧 TemplateBasedEmailService: بدء إرسال الإيميل بناءً على القالب...');
      console.log(`📬 إلى: ${emailData.to}`);
      console.log(`📝 الموضوع: ${emailData.subject}`);
      console.log(`📄 معرف القالب: ${emailData.templateId}`);

      // جلب إعدادات SMTP للقالب المحدد (أو الافتراضي)
      const smtpSettings = await TemplateSMTPManager.getSMTPForTemplate(emailData.templateId);

      if (!smtpSettings) {
        console.error('❌ فشل في جلب إعدادات SMTP للقالب أو الافتراضية.');
        return { success: false, error: 'No SMTP settings found for template or default' };
      }

      console.log(`✅ تم جلب إعدادات SMTP: ${smtpSettings.smtp_host} (افتراضي: ${smtpSettings.is_default})`);

      // إرسال عبر Supabase Edge Function مع إعدادات SMTP المحددة
      const smtpConfig = TemplateSMTPManager.formatSMTPConfig(smtpSettings);
      
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
          text: emailData.text,
          smtpConfig: smtpConfig
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ تم إرسال الإيميل بنجاح:', result.messageId);
        return {
          success: true,
          method: `Supabase Custom SMTP via ${smtpSettings.smtp_host}`,
          messageId: result.messageId
        };
      } else {
        console.error('❌ فشل في إرسال الإيميل:', result.error);
        return {
          success: false,
          error: result.error || 'Unknown error',
          method: 'Supabase Custom SMTP'
        };
      }
      
    } catch (error) {
      console.error('❌ خطأ في إرسال الإيميل عبر TemplateBasedEmailService:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير معروف في إرسال الإيميل',
        method: 'TemplateBasedEmailService'
      };
    }
  }
  
  /**
   * إرسال إيميل باستخدام قالب من قاعدة البيانات مع إعدادات SMTP المحددة
   */
  static async sendEmailWithTemplate(
    templateName: string,
    recipientEmail: string,
    templateData: any,
    language: 'ar' | 'en' = 'ar'
  ): Promise<{ success: boolean; error?: string; method?: string }> {
    try {
      console.log(`📧 TemplateBasedEmailService: إرسال إيميل ${templateName} إلى ${recipientEmail}`);
      console.log(`🔧 استخدام إعدادات SMTP المحددة في القالب`);
      
      // جلب القالب من قاعدة البيانات
      const { data: template, error: templateError } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', templateName)
        .eq('is_active', true)
        .single();

      if (templateError || !template) {
        console.error('❌ خطأ في جلب القالب:', templateError);
        return { 
          success: false, 
          error: `Template '${templateName}' not found`,
          method: 'Template Lookup'
        };
      }
      
      console.log(`✅ تم جلب القالب بنجاح: ${template.name_ar}`);
      
      // جلب إعدادات SMTP المحددة في القالب
      const smtpSettings = await TemplateSMTPManager.getSMTPForTemplate(template.id);
      
      if (!smtpSettings) {
        console.error('❌ لم يتم العثور على إعدادات SMTP للقالب أو الافتراضية');
        return { 
          success: false, 
          error: 'No SMTP settings found for template or default',
          method: 'Template SMTP Lookup'
        };
      }
      
      console.log(`✅ تم جلب إعدادات SMTP للقالب: ${smtpSettings.smtp_host}:${smtpSettings.smtp_port}`);
      console.log(`🔧 إعدادات SMTP المستخدمة:`, {
        id: smtpSettings.id,
        host: smtpSettings.smtp_host,
        port: smtpSettings.smtp_port,
        from_email: smtpSettings.from_email,
        from_name_ar: smtpSettings.from_name_ar,
        is_default: smtpSettings.is_default
      });
      
      // معالجة القالب واستبدال المتغيرات
      const processedTemplate = await this.processTemplate(template, templateData, language);
      
      // إرسال الإيميل باستخدام إعدادات SMTP المحددة
      const result = await this.sendProcessedEmail(processedTemplate, recipientEmail, smtpSettings);
      
      // تسجيل الإيميل في قاعدة البيانات
      await this.logEmail({
        template_name: templateName,
        recipient_email: recipientEmail,
        subject: processedTemplate.subject,
        template_id: template.id,
        smtp_settings_id: smtpSettings.id,
        status: result.success ? 'sent' : 'failed',
        error_message: result.error || null,
        sent_at: result.success ? new Date().toISOString() : null
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في TemplateBasedEmailService:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'TemplateBasedEmailService'
      };
    }
  }

  /**
   * معالجة القالب واستبدال المتغيرات
   */
  private static async processTemplate(
    template: any,
    templateData: any,
    language: 'ar' | 'en'
  ): Promise<any> {
    console.log('🔧 معالجة القالب واستبدال المتغيرات...');
    
    // تحديد المحتوى حسب اللغة
    const subject = language === 'ar' ? template.subject_ar : template.subject_en;
    const content = language === 'ar' ? template.content_ar : template.content_en;
    const htmlContent = language === 'ar' ? template.html_template_ar : template.html_template_en;
    
    // البيانات الافتراضية
    const defaultData = {
      currentYear: new Date().getFullYear(),
      platformName: language === 'ar' ? 'رزقي' : 'Rezge',
      supportEmail: 'support@rezge.com',
      contactEmail: 'contact@rezge.com',
      baseUrl: typeof window !== 'undefined' ? window.location.origin : 'https://rezge.vercel.app',
      ...templateData
    };
    
    // استبدال المتغيرات في الموضوع
    const processedSubject = this.replaceVariables(subject, defaultData);
    
    // استبدال المتغيرات في المحتوى النصي
    const processedContent = this.replaceVariables(content, defaultData);
    
    // استبدال المتغيرات في المحتوى HTML
    const processedHtmlContent = this.replaceVariables(htmlContent, defaultData);
    
    return {
      subject: processedSubject,
      content: processedContent,
      htmlContent: processedHtmlContent
    };
  }

  /**
   * استبدال المتغيرات في النص
   */
  private static replaceVariables(text: string, data: any): string {
    if (!text) return '';
    
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
  }

  /**
   * إرسال الإيميل المعالج باستخدام إعدادات SMTP المحددة
   */
  private static async sendProcessedEmail(
    processedTemplate: any,
    recipientEmail: string,
    smtpSettings: any
  ): Promise<{ success: boolean; error?: string; method?: string }> {
    try {
      console.log('📧 إرسال الإيميل باستخدام إعدادات SMTP المحددة...');
      
      // تحويل إعدادات SMTP إلى تنسيق قابل للاستخدام
      const smtpConfig = TemplateSMTPManager.formatSMTPConfig(smtpSettings);
      
      console.log('🔧 إعدادات SMTP المحولة:', smtpConfig);
      
      // إرسال عبر Supabase Edge Function مع إعدادات SMTP المحددة
      const response = await fetch('/api/send-template-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: processedTemplate.subject,
          html: processedTemplate.htmlContent,
          text: processedTemplate.content,
          smtpConfig: smtpConfig
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ تم إرسال الإيميل بنجاح باستخدام إعدادات SMTP المحددة');
        return {
          success: true,
          method: `Template SMTP (${smtpConfig.host}:${smtpConfig.port})`
        };
      } else {
        console.error('❌ فشل في إرسال الإيميل:', result.error);
        return {
          success: false,
          error: result.error || 'Unknown error',
          method: 'Template SMTP'
        };
      }
      
    } catch (error) {
      console.error('❌ خطأ في إرسال الإيميل:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'Template SMTP'
      };
    }
  }

  /**
   * تسجيل الإيميل في قاعدة البيانات
   */
  private static async logEmail(logData: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('email_logs')
        .insert([{
          ...logData,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('❌ خطأ في تسجيل الإيميل:', error);
      } else {
        console.log('✅ تم تسجيل الإيميل في قاعدة البيانات');
      }
    } catch (error) {
      console.error('❌ خطأ في تسجيل الإيميل:', error);
    }
  }

  /**
   * اختبار إرسال إيميل باستخدام قالب معين
   */
  static async testTemplateEmail(
    templateName: string,
    testEmail: string,
    testData: any = {}
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🧪 اختبار إرسال إيميل باستخدام قالب: ${templateName}`);
      
      const result = await this.sendEmailWithTemplate(
        templateName,
        testEmail,
        {
          ...testData,
          testMode: true,
          timestamp: new Date().toLocaleString('ar-SA')
        },
        'ar'
      );
      
      if (result.success) {
        return {
          success: true,
          message: `تم إرسال إيميل الاختبار بنجاح باستخدام قالب ${templateName}`
        };
      } else {
        return {
          success: false,
          message: `فشل في إرسال إيميل الاختبار: ${result.error}`
        };
      }
      
    } catch (error) {
      console.error('❌ خطأ في اختبار الإيميل:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }
  }
}
