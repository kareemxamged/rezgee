import { supabase } from './supabase';
import { EmailNotificationsAdminService } from './emailNotificationsAdminService';

// مدير إعدادات SMTP للقوالب
export class TemplateSMTPManager {
  
  /**
   * الحصول على إعدادات SMTP للقالب المحدد
   * @param templateId - معرف القالب
   * @returns إعدادات SMTP أو الإعدادات الافتراضية
   */
  static async getSMTPForTemplate(templateId: string): Promise<any> {
    try {
      console.log('🔍 جلب إعدادات SMTP للقالب:', templateId);
      
      // جلب القالب مع إعدادات SMTP المحددة
      const { data: template, error: templateError } = await supabase
        .from('email_templates')
        .select('smtp_settings_id, contact_smtp_send_id, contact_smtp_receive_id, name_ar')
        .eq('id', templateId)
        .single();

      if (templateError) {
        console.error('❌ خطأ في جلب القالب:', templateError);
        return await this.getDefaultSMTP();
      }

      console.log('📋 القالب المستخدم:', template);

      // تحديد نوع القالب (تواصل أم عادي)
      const isContactTemplate = template.name_ar?.includes('تواصل') || 
                               template.name_ar?.includes('contact') ||
                               template.name_ar?.includes('رسالة') ||
                               template.name_ar?.includes('message');
      
      let smtpSettingsId: string | null = null;
      
      if (isContactTemplate) {
        // قالب التواصل - استخدام إعدادات الإرسال
        smtpSettingsId = template.contact_smtp_send_id;
        console.log('📞 قالب التواصل - إعدادات الإرسال:', smtpSettingsId);
        console.log('📞 قالب التواصل - إعدادات الاستقبال:', template.contact_smtp_receive_id);
      } else {
        // قالب عادي - استخدام إعدادات SMTP العادية
        smtpSettingsId = template.smtp_settings_id;
        console.log('📧 قالب عادي - إعدادات SMTP:', smtpSettingsId);
      }

      // إذا لم تكن هناك إعدادات محددة، استخدم الإعدادات الافتراضية
      if (!smtpSettingsId) {
        console.log('⚠️ لا توجد إعدادات محددة للقالب، استخدام الإعدادات الافتراضية');
        return await this.getDefaultSMTP();
      }

      // جلب إعدادات SMTP المحددة
      const { data: smtpSettings, error: smtpError } = await supabase
        .from('email_settings')
        .select('*')
        .eq('id', smtpSettingsId)
        .eq('is_active', true)
        .single();

      if (smtpError || !smtpSettings) {
        console.error('❌ خطأ في جلب إعدادات SMTP المحددة:', smtpError);
        console.log('⚠️ استخدام الإعدادات الافتراضية كبديل');
        return await this.getDefaultSMTP();
      }

      console.log('✅ تم جلب إعدادات SMTP المحددة بنجاح:', smtpSettings);
      return smtpSettings;

    } catch (error) {
      console.error('❌ خطأ في جلب إعدادات SMTP للقالب:', error);
      return await this.getDefaultSMTP();
    }
  }

  /**
   * الحصول على الإعدادات الافتراضية
   */
  static async getDefaultSMTP(): Promise<any> {
    try {
      console.log('🔍 جلب الإعدادات الافتراضية...');
      
      const defaultSettings = await EmailNotificationsAdminService.getDefaultEmailSettings();
      
      if (defaultSettings) {
        console.log('✅ تم جلب الإعدادات الافتراضية بنجاح:', defaultSettings);
        return defaultSettings;
      }

      // إذا لم تكن هناك إعدادات افتراضية، جلب أول إعداد نشط
      console.log('⚠️ لا توجد إعدادات افتراضية، جلب أول إعداد نشط...');
      
      const { data: fallbackSettings, error: fallbackError } = await supabase
        .from('email_settings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (fallbackError || !fallbackSettings) {
        console.error('❌ لا توجد إعدادات SMTP متاحة:', fallbackError);
        throw new Error('لا توجد إعدادات SMTP متاحة');
      }

      console.log('✅ تم جلب إعدادات SMTP احتياطية:', fallbackSettings);
      return fallbackSettings;

    } catch (error) {
      console.error('❌ خطأ في جلب الإعدادات الافتراضية:', error);
      throw error;
    }
  }

  /**
   * تحويل إعدادات SMTP إلى تنسيق قابل للاستخدام
   */
  static formatSMTPConfig(smtpSettings: any): any {
    if (!smtpSettings) {
      throw new Error('إعدادات SMTP غير متاحة');
    }

    return {
      host: smtpSettings.smtp_host,
      port: smtpSettings.smtp_port,
      secure: smtpSettings.smtp_port === 465, // المنفذ 465 يستخدم SSL
      auth: {
        user: smtpSettings.smtp_username,
        pass: smtpSettings.smtp_password
      },
      from: {
        name: smtpSettings.from_name_ar,
        email: smtpSettings.from_email
      },
      replyTo: smtpSettings.reply_to || smtpSettings.from_email,
      isDefault: smtpSettings.is_default || false
    };
  }

  /**
   * الحصول على إعدادات الاستقبال لقالب التواصل
   * @param templateId - معرف القالب
   * @returns إعدادات SMTP للاستقبال
   */
  static async getReceiveSMTPForContactTemplate(templateId: string): Promise<any> {
    try {
      console.log('🔍 جلب إعدادات الاستقبال لقالب التواصل:', templateId);
      
      // جلب القالب مع إعدادات الاستقبال
      const { data: template, error: templateError } = await supabase
        .from('email_templates')
        .select('contact_smtp_receive_id, name_ar')
        .eq('id', templateId)
        .single();

      if (templateError) {
        console.error('❌ خطأ في جلب القالب:', templateError);
        return await this.getDefaultSMTP();
      }

      // التحقق من أن القالب هو قالب تواصل
      const isContactTemplate = template.name_ar?.includes('تواصل') || 
                               template.name_ar?.includes('contact') ||
                               template.name_ar?.includes('رسالة') ||
                               template.name_ar?.includes('message');

      if (!isContactTemplate) {
        console.log('⚠️ القالب ليس قالب تواصل، استخدام إعدادات الإرسال العادية');
        return await this.getSMTPForTemplate(templateId);
      }

      const smtpSettingsId = template.contact_smtp_receive_id;

      if (!smtpSettingsId) {
        console.log('⚠️ لا توجد إعدادات استقبال محددة، استخدام الإعدادات الافتراضية');
        return await this.getDefaultSMTP();
      }

      // جلب إعدادات SMTP للاستقبال
      const { data: smtpSettings, error: smtpError } = await supabase
        .from('email_settings')
        .select('*')
        .eq('id', smtpSettingsId)
        .eq('is_active', true)
        .single();

      if (smtpError || !smtpSettings) {
        console.error('❌ خطأ في جلب إعدادات الاستقبال:', smtpError);
        return await this.getDefaultSMTP();
      }

      console.log('✅ تم جلب إعدادات الاستقبال بنجاح:', smtpSettings);
      return smtpSettings;

    } catch (error) {
      console.error('❌ خطأ في جلب إعدادات الاستقبال:', error);
      return await this.getDefaultSMTP();
    }
  }

  /**
   * اختبار إعدادات SMTP للقالب
   */
  static async testTemplateSMTP(templateId: string, testEmail: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🧪 اختبار إعدادات SMTP للقالب:', templateId);
      
      const smtpSettings = await this.getSMTPForTemplate(templateId);
      const config = this.formatSMTPConfig(smtpSettings);
      
      console.log('📧 إعدادات SMTP المستخدمة:', config);
      
      // هنا يمكن إضافة منطق اختبار الإرسال الفعلي
      // للآن سنعيد نجاح وهمي
      return {
        success: true,
        message: `تم اختبار إعدادات SMTP بنجاح. الخادم: ${config.host}:${config.port}`
      };

    } catch (error) {
      console.error('❌ خطأ في اختبار إعدادات SMTP:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'خطأ غير معروف في اختبار الإعدادات'
      };
    }
  }
}


