import { DatabaseEmailService, DatabaseEmailTemplate, DatabaseEmailSettings } from './databaseEmailService';
import { UnifiedEmailService } from './unifiedEmailService';

export interface EmailTemplateData {
  [key: string]: any;
}

export interface ProcessedEmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
  fromEmail: string;
  fromName: string;
  replyTo: string;
}

/**
 * خدمة الإيميلات الموحدة المتصلة بقاعدة البيانات
 * Unified Database Email Service
 */
export class UnifiedDatabaseEmailService {
  
  /**
   * إرسال إيميل باستخدام قالب من قاعدة البيانات
   */
  static async sendEmail(
    templateName: string,
    recipientEmail: string,
    templateData: EmailTemplateData,
    language: 'ar' | 'en' = 'ar'
  ): Promise<{ success: boolean; error?: string; method?: string }> {
    try {
      console.log(`📧 UnifiedDatabaseEmailService: إرسال إيميل ${templateName} إلى ${recipientEmail}`);
      
      // جلب القالب من قاعدة البيانات
      console.log(`🔍 جلب القالب: ${templateName} باللغة: ${language}`);
      const template = await DatabaseEmailService.getEmailTemplate(templateName, language);
      
      if (!template) {
        console.error(`❌ لم يتم العثور على القالب: ${templateName}`);
        console.log('📋 محاولة جلب جميع القوالب المتاحة...');
        
        try {
          const { supabase } = await import('./supabase');
          const { data: allTemplates } = await supabase
            .from('email_templates')
            .select('name, name_ar, is_active');
          
          console.log('📋 القوالب المتاحة:', allTemplates?.map(t => t.name) || []);
        } catch (e) {
          console.error('خطأ في جلب القوالب المتاحة:', e);
        }
        
        return { 
          success: false, 
          error: `Template not found: ${templateName}`,
          method: 'Database Template Lookup'
        };
      }
      
      console.log(`✅ تم جلب القالب بنجاح: ${template.name_ar}`);
      console.log(`📧 موضوع القالب: ${language === 'ar' ? template.subject_ar : template.subject_en}`);
      
      // معالجة القالب واستبدال المتغيرات
      const processedTemplate = await this.processTemplate(template, templateData, language);
      
      // جلب إعدادات SMTP المحددة في القالب أو الافتراضية
      console.log('🔧 جلب إعدادات SMTP للقالب...');
      const { TemplateSMTPManager } = await import('./templateSMTPManager');
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
        from_name_en: smtpSettings.from_name_en,
        reply_to: smtpSettings.reply_to,
        is_default: smtpSettings.is_default
      });
      console.log(`📧 سيتم الإرسال من: ${smtpSettings.from_email} (${smtpSettings.from_name_ar})`);
      
      // إرسال الإيميل
      const result = await this.sendProcessedEmail(processedTemplate, recipientEmail, smtpSettings);
      
      // تسجيل الإيميل في قاعدة البيانات
      await DatabaseEmailService.logEmail({
        template_name: templateName,
        recipient_email: recipientEmail,
        subject: processedTemplate.subject,
        status: result.success ? 'sent' : 'failed',
        error_message: result.error || null
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ خطأ في UnifiedDatabaseEmailService:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'UnifiedDatabaseEmailService'
      };
    }
  }
  
  /**
   * معالجة القالب واستبدال المتغيرات
   */
  private static async processTemplate(
    template: DatabaseEmailTemplate,
    templateData: EmailTemplateData,
    language: 'ar' | 'en'
  ): Promise<ProcessedEmailTemplate> {
    console.log('🔧 معالجة القالب واستبدال المتغيرات...');
    
    // تحديد المحتوى حسب اللغة
    const subject = language === 'ar' ? template.subject_ar : template.subject_en;
    const htmlContent = language === 'ar' ? template.html_template_ar : template.html_template_en;
    const textContent = language === 'ar' ? template.content_ar : template.content_en;
    
    // إضافة متغيرات افتراضية
    const defaultData = {
      timestamp: new Date().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-GB'),
      currentYear: new Date().getFullYear(),
      platformName: language === 'ar' ? 'رزقي' : 'Rezge',
      supportEmail: 'support@rezge.com',
      contactEmail: 'contact@rezge.com',
      baseUrl: typeof window !== 'undefined' ? window.location.origin : 'https://rezge.vercel.app',
      ...templateData
    };
    
    // استبدال المتغيرات في الموضوع
    const processedSubject = this.replaceVariables(subject, defaultData);
    
    // استبدال المتغيرات في المحتوى HTML
    const processedHtmlContent = this.replaceVariables(htmlContent, defaultData);
    
    // استبدال المتغيرات في المحتوى النصي
    const processedTextContent = this.replaceVariables(textContent, defaultData);
    
    // جلب إعدادات SMTP المحددة في القالب
    const { TemplateSMTPManager } = await import('./templateSMTPManager');
    const templateSMTPSettings = await TemplateSMTPManager.getSMTPForTemplate(template.id);
    
    return {
      subject: processedSubject,
      htmlContent: processedHtmlContent,
      textContent: processedTextContent,
      fromEmail: templateSMTPSettings?.from_email || 'manage@kareemamged.com',
      fromName: language === 'ar' ? (templateSMTPSettings?.from_name_ar || 'رزقي') : (templateSMTPSettings?.from_name_en || 'Rezge'),
      replyTo: templateSMTPSettings?.reply_to || 'support@rezge.com'
    };
  }
  
  /**
   * استبدال المتغيرات في النص
   */
  private static replaceVariables(text: string, data: EmailTemplateData): string {
    let processedText = text;
    
    // استبدال المتغيرات البسيطة {{variable}}
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== null && value !== undefined) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedText = processedText.replace(regex, String(value));
      }
    });
    
    // معالجة الشروط الشرطية {{#if condition}}...{{/if}}
    processedText = this.processConditionalBlocks(processedText, data);
    
    return processedText;
  }
  
  /**
   * معالجة الكتل الشرطية
   */
  private static processConditionalBlocks(text: string, data: EmailTemplateData): string {
    // معالجة {{#if condition}}...{{/if}}
    const ifRegex = /{{#if\s+(\w+)}}(.*?){{\/if}}/gs;
    return text.replace(ifRegex, (match, condition, content) => {
      if (data[condition]) {
        return content;
      }
      return '';
    });
  }
  
  /**
   * إرسال الإيميل المعالج
   */
  private static async sendProcessedEmail(
    template: ProcessedEmailTemplate,
    recipientEmail: string,
    smtpSettings: DatabaseEmailSettings | null
  ): Promise<{ success: boolean; error?: string; method?: string }> {
    console.log('📤 إرسال الإيميل المعالج...');
    console.log('🔧 إعدادات SMTP المستخدمة:', smtpSettings);
    
    try {
      // محاولة 1: إرسال عبر الخادم المحلي مع إعدادات SMTP المحددة
      console.log('🏠 محاولة الإرسال عبر الخادم المحلي مع إعدادات SMTP المحددة...');
      
      // تحويل إعدادات SMTP إلى تنسيق قابل للاستخدام
      const smtpConfig = smtpSettings ? {
        host: smtpSettings.smtp_host,
        port: smtpSettings.smtp_port,
        secure: smtpSettings.smtp_port === 465,
        auth: {
          user: smtpSettings.smtp_username,
          pass: smtpSettings.smtp_password
        },
        from: {
          name: smtpSettings.from_name_ar || template.fromName,
          email: smtpSettings.from_email || template.fromEmail
        },
        replyTo: smtpSettings.reply_to || smtpSettings.from_email || template.replyTo
      } : null;
      
      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: template.subject,
          html: template.htmlContent,
          text: template.textContent,
          from: smtpConfig?.from?.email || template.fromEmail,
          fromName: smtpConfig?.from?.name || template.fromName,
          replyTo: smtpConfig?.replyTo || template.replyTo,
          smtpConfig: smtpConfig // إرسال إعدادات SMTP المحددة
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log('✅ تم إرسال الإيميل بنجاح عبر الخادم المحلي');
          console.log(`📧 تم الإرسال من: ${smtpConfig?.from?.email} (${smtpConfig?.from?.name})`);
          console.log(`🔧 باستخدام خادم SMTP: ${smtpConfig?.host}:${smtpConfig?.port}`);
          return {
            success: true,
            method: 'Local SMTP Server',
            messageId: result.messageId,
            smtpUsed: smtpConfig
          };
        } else {
          console.warn('⚠️ فشل الخادم المحلي:', result.error);
        }
      } else {
        console.warn('⚠️ خطأ في الاتصال بالخادم المحلي:', response.status);
      }
    } catch (localError) {
      console.warn('⚠️ خطأ في الخادم المحلي:', localError);
    }
    
    // محاولة 2: استخدام Supabase Edge Function مع إعدادات SMTP المحددة
    try {
      console.log('🔄 محاولة الإرسال عبر Supabase Edge Function مع إعدادات SMTP المحددة...');
      
      const response = await fetch('https://sbtzngewizgeqzfbhfjy.supabase.co/functions/v1/send-unified-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: template.subject,
          html: template.htmlContent,
          text: template.textContent,
          from: smtpConfig?.from?.email || template.fromEmail,
          fromName: smtpConfig?.from?.name || template.fromName,
          replyTo: smtpConfig?.replyTo || template.replyTo,
          type: 'template_based',
          smtpConfig: smtpConfig // إرسال إعدادات SMTP المحددة
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log('✅ تم إرسال الإيميل بنجاح عبر Supabase Edge Function');
          console.log(`📧 تم الإرسال من: ${smtpConfig?.from?.email} (${smtpConfig?.from?.name})`);
          console.log(`🔧 باستخدام خادم SMTP: ${smtpConfig?.host}:${smtpConfig?.port}`);
          return {
            success: true,
            method: 'Supabase Edge Function',
            smtpUsed: smtpConfig
          };
        }
      }
    } catch (edgeError) {
      console.warn('⚠️ خطأ في Edge Function:', edgeError);
    }
    
    // إذا فشلت جميع الطرق
    return {
      success: false,
      error: 'فشل في إرسال الإيميل عبر جميع الطرق المتاحة',
      method: 'All methods failed'
    };
  }
  
  /**
   * اختبار قالب معين
   */
  static async testTemplate(
    templateName: string,
    testEmail: string,
    testData: EmailTemplateData = {},
    language: 'ar' | 'en' = 'ar'
  ): Promise<{ success: boolean; error?: string }> {
    console.log(`🧪 اختبار القالب: ${templateName} إلى ${testEmail}`);
    
    // إضافة بيانات اختبار افتراضية
    const defaultTestData = {
      userName: language === 'ar' ? 'مستخدم تجريبي' : 'Test User',
      userEmail: testEmail,
      timestamp: new Date().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-GB'),
      ...testData
    };
    
    return await this.sendEmail(templateName, testEmail, defaultTestData, language);
  }
  
  /**
   * جلب جميع القوالب المتاحة
   */
  static async getAvailableTemplates(): Promise<DatabaseEmailTemplate[]> {
    try {
      console.log('📋 جلب جميع القوالب المتاحة...');
      
      const { data, error } = await DatabaseEmailService.supabase
        .from('email_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.error('❌ خطأ في جلب القوالب:', error);
        return [];
      }
      
      console.log(`✅ تم جلب ${data?.length || 0} قالب`);
      return data || [];
      
    } catch (error) {
      console.error('❌ خطأ في جلب القوالب:', error);
      return [];
    }
  }
  
  /**
   * التحقق من وجود قالب
   */
  static async templateExists(templateName: string): Promise<boolean> {
    const template = await DatabaseEmailService.getEmailTemplate(templateName);
    return template !== null;
  }
  
  /**
   * جلب إحصائيات القوالب
   */
  static async getTemplateStats(): Promise<{
    totalTemplates: number;
    activeTemplates: number;
    inactiveTemplates: number;
    recentTemplates: DatabaseEmailTemplate[];
  }> {
    try {
      const { data, error } = await DatabaseEmailService.supabase
        .from('email_templates')
        .select('*');
      
      if (error) {
        console.error('❌ خطأ في جلب إحصائيات القوالب:', error);
        return {
          totalTemplates: 0,
          activeTemplates: 0,
          inactiveTemplates: 0,
          recentTemplates: []
        };
      }
      
      const totalTemplates = data?.length || 0;
      const activeTemplates = data?.filter(t => t.is_active).length || 0;
      const inactiveTemplates = totalTemplates - activeTemplates;
      const recentTemplates = data?.slice(0, 5) || [];
      
      return {
        totalTemplates,
        activeTemplates,
        inactiveTemplates,
        recentTemplates
      };
      
    } catch (error) {
      console.error('❌ خطأ في جلب إحصائيات القوالب:', error);
      return {
        totalTemplates: 0,
        activeTemplates: 0,
        inactiveTemplates: 0,
        recentTemplates: []
      };
    }
  }
}

// تصدير للاستخدام في الملفات الأخرى
export default UnifiedDatabaseEmailService;

