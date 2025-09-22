import { supabase } from './supabase';

export interface DatabaseEmailTemplate {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  subject_ar: string;
  subject_en: string;
  content_ar: string;
  content_en: string;
  html_template_ar: string;
  html_template_en: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseEmailSettings {
  id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  from_name_ar: string;
  from_name_en: string;
  from_email: string;
  reply_to: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseEmailNotificationType {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  template_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * خدمة الإيميلات المتصلة بقاعدة البيانات
 * Database Email Service - Connected to Database
 */
export class DatabaseEmailService {
  
  /**
   * جلب قالب إيميل من قاعدة البيانات
   */
  static async getEmailTemplate(templateName: string, language: 'ar' | 'en' = 'ar'): Promise<DatabaseEmailTemplate | null> {
    try {
      console.log(`📧 جلب قالب الإيميل: ${templateName} (${language})`);
      
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', templateName)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('❌ خطأ في جلب قالب الإيميل:', error);
        return null;
      }

      if (!data) {
        console.warn(`⚠️ لم يتم العثور على قالب الإيميل: ${templateName}`);
        return null;
      }

      console.log('✅ تم جلب قالب الإيميل بنجاح:', data.name);
      return data;
    } catch (error) {
      console.error('❌ خطأ في جلب قالب الإيميل:', error);
      return null;
    }
  }

  /**
   * جلب إعدادات SMTP من قاعدة البيانات
   */
  static async getEmailSettings(): Promise<DatabaseEmailSettings | null> {
    try {
      console.log('📧 جلب إعدادات SMTP من قاعدة البيانات...');
      
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('❌ خطأ في جلب إعدادات SMTP:', error);
        return null;
      }

      console.log('✅ تم جلب إعدادات SMTP بنجاح');
      return data;
    } catch (error) {
      console.error('❌ خطأ في جلب إعدادات SMTP:', error);
      return null;
    }
  }

  /**
   * جلب نوع الإشعار من قاعدة البيانات
   */
  static async getNotificationType(typeName: string): Promise<DatabaseEmailNotificationType | null> {
    try {
      console.log(`📧 جلب نوع الإشعار: ${typeName}`);
      
      const { data, error } = await supabase
        .from('email_notification_types')
        .select('*')
        .eq('name', typeName)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('❌ خطأ في جلب نوع الإشعار:', error);
        return null;
      }

      console.log('✅ تم جلب نوع الإشعار بنجاح:', data.name);
      return data;
    } catch (error) {
      console.error('❌ خطأ في جلب نوع الإشعار:', error);
      return null;
    }
  }

  /**
   * إنشاء محتوى الإيميل من القالب
   */
  static createEmailContent(
    template: DatabaseEmailTemplate,
    data: Record<string, any>,
    language: 'ar' | 'en' = 'ar'
  ): { subject: string; html: string; text: string } {
    try {
      console.log(`📧 إنشاء محتوى الإيميل من القالب: ${template.name} (${language})`);

      // اختيار المحتوى حسب اللغة
      const subject = language === 'ar' ? template.subject_ar : template.subject_en;
      const textContent = language === 'ar' ? template.content_ar : template.content_en;
      const htmlContent = language === 'ar' ? template.html_template_ar : template.html_template_en;

      // استبدال المتغيرات في المحتوى
      let finalSubject = subject;
      let finalText = textContent;
      let finalHtml = htmlContent;

      // استبدال جميع المتغيرات
      Object.keys(data).forEach(key => {
        const placeholder = `{{${key}}}`;
        const value = data[key] || '';
        
        finalSubject = finalSubject.replace(new RegExp(placeholder, 'g'), value);
        finalText = finalText.replace(new RegExp(placeholder, 'g'), value);
        finalHtml = finalHtml.replace(new RegExp(placeholder, 'g'), value);
      });

      console.log('✅ تم إنشاء محتوى الإيميل بنجاح');
      
      return {
        subject: finalSubject,
        html: finalHtml,
        text: finalText
      };
    } catch (error) {
      console.error('❌ خطأ في إنشاء محتوى الإيميل:', error);
      throw error;
    }
  }

  /**
   * إرسال إيميل باستخدام القوالب من قاعدة البيانات
   */
  static async sendEmailWithTemplate(
    templateName: string,
    to: string,
    data: Record<string, any>,
    language: 'ar' | 'en' = 'ar'
  ): Promise<{ success: boolean; error?: string; method?: string }> {
    try {
      console.log(`📧 إرسال إيميل باستخدام القالب: ${templateName} إلى ${to}`);

      // جلب القالب من قاعدة البيانات
      const template = await this.getEmailTemplate(templateName, language);
      if (!template) {
        throw new Error(`لم يتم العثور على القالب النشط: ${templateName}. تأكد من وجود القالب وأنه مفعل في قاعدة البيانات.`);
      }

      // جلب إعدادات SMTP من قاعدة البيانات
      const settings = await this.getEmailSettings();
      if (!settings) {
        throw new Error('لم يتم العثور على إعدادات SMTP');
      }

      // إنشاء محتوى الإيميل
      const emailContent = this.createEmailContent(template, data, language);

      // إعداد بيانات الإيميل
      const emailData = {
        to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        from: settings.from_email,
        fromName: language === 'ar' ? settings.from_name_ar : settings.from_name_en,
        replyTo: settings.reply_to
      };

      console.log('📤 بيانات الإيميل:', {
        to: emailData.to,
        subject: emailData.subject,
        from: emailData.from,
        fromName: emailData.fromName,
        htmlLength: emailData.html.length,
        textLength: emailData.text.length
      });

      // إرسال الإيميل عبر الخادم المحلي
      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        console.log('✅ تم إرسال الإيميل بنجاح عبر قاعدة البيانات');
        return { success: true, method: 'database_template' };
      } else {
        const errorText = await response.text();
        console.error('❌ فشل في إرسال الإيميل:', errorText);
        return { success: false, error: errorText };
      }

    } catch (error) {
      console.error('❌ خطأ في إرسال الإيميل:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }
  }

  /**
   * تسجيل إيميل في سجل الإيميلات
   */
  static async logEmail(
    templateName: string,
    to: string,
    subject: string,
    status: 'sent' | 'failed' | 'pending',
    error?: string
  ): Promise<void> {
    try {
      console.log(`📝 تسجيل الإيميل في السجل: ${templateName} - ${status}`);

      const { error: logError } = await supabase
        .from('email_logs')
        .insert({
          recipient_email: to,
          subject: subject || 'لا يوجد موضوع',
          status: status || 'pending',
          error_message: error || null,
          sent_at: status === 'sent' ? new Date().toISOString() : null
        });

      if (logError) {
        console.error('❌ خطأ في تسجيل الإيميل:', logError);
      } else {
        console.log('✅ تم تسجيل الإيميل في السجل بنجاح');
      }
    } catch (error) {
      console.error('❌ خطأ في تسجيل الإيميل:', error);
    }
  }

  /**
   * جلب إحصائيات الإيميلات
   */
  static async getEmailStats(): Promise<{
    totalSent: number;
    totalFailed: number;
    successRate: number;
    dailySends: number;
  }> {
    try {
      console.log('📊 جلب إحصائيات الإيميلات...');

      const { data: logs, error } = await supabase
        .from('email_logs')
        .select('status, sent_at');

      if (error) {
        console.error('❌ خطأ في جلب إحصائيات الإيميلات:', error);
        return { totalSent: 0, totalFailed: 0, successRate: 0, dailySends: 0 };
      }

      const totalSent = logs.filter(log => log.status === 'sent').length;
      const totalFailed = logs.filter(log => log.status === 'failed').length;
      const total = totalSent + totalFailed;
      const successRate = total > 0 ? (totalSent / total) * 100 : 0;

      // حساب الإرسالات اليومية
      const today = new Date().toISOString().split('T')[0];
      const dailySends = logs.filter(log => 
        log.sent_at && log.sent_at.startsWith(today) && log.status === 'sent'
      ).length;

      console.log('✅ تم جلب إحصائيات الإيميلات بنجاح');
      
      return {
        totalSent,
        totalFailed,
        successRate: Math.round(successRate * 100) / 100,
        dailySends
      };
    } catch (error) {
      console.error('❌ خطأ في جلب إحصائيات الإيميلات:', error);
      return { totalSent: 0, totalFailed: 0, successRate: 0, dailySends: 0 };
    }
  }

  /**
   * جلب عميل Supabase للاستخدام في الخدمات الأخرى
   */
  static get supabase() {
    return supabase;
  }

  /**
   * اختبار إرسال إيميل باستخدام قالب من قاعدة البيانات
   */
  static async testEmailTemplate(
    templateName: string,
    testEmail: string = 'kemooamegoo@gmail.com',
    language: 'ar' | 'en' = 'ar'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🧪 اختبار قالب الإيميل: ${templateName}`);

      // بيانات تجريبية
      const testData = {
        userName: 'مستخدم تجريبي',
        firstName: 'أحمد',
        lastName: 'محمد',
        verificationUrl: 'https://rezge.com/verify/test',
        temporaryPassword: 'Test123!',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('ar-SA'),
        code: '123456',
        expiresInMinutes: '10',
        likerName: 'سارة أحمد',
        likerCity: 'الرياض',
        likerAge: '25',
        viewerName: 'محمد علي',
        viewerCity: 'جدة',
        viewerAge: '30',
        senderName: 'فاطمة حسن',
        senderCity: 'الدمام',
        senderAge: '28',
        matchName: 'عبدالله سالم',
        matchCity: 'مكة',
        matchAge: '32',
        reporterName: 'نور الدين',
        reportedName: 'مستخدم مبلغ عنه',
        reason: 'سلوك غير لائق',
        duration: '7 أيام',
        loginTime: new Date().toLocaleString('ar-SA'),
        location: 'الرياض، السعودية',
        device: 'Chrome على Windows',
        attemptTime: new Date().toLocaleString('ar-SA'),
        attemptsCount: '3',
        failureTime: new Date().toLocaleString('ar-SA'),
        disableTime: new Date().toLocaleString('ar-SA')
      };

      const result = await this.sendEmailWithTemplate(templateName, testEmail, testData, language);
      
      if (result.success) {
        console.log('✅ تم اختبار القالب بنجاح');
        await this.logEmail(templateName, testEmail, 'اختبار قالب', 'sent');
      } else {
        console.error('❌ فشل في اختبار القالب:', result.error);
        await this.logEmail(templateName, testEmail, 'اختبار قالب', 'failed', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ خطأ في اختبار القالب:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }
  }
}
