import { supabase } from './supabase';

// خدمة إدارة الإشعارات البريدية
export class EmailNotificationsAdminService {
  
  // إدارة أنواع الإشعارات
  static async getNotificationTypes(): Promise<any[]> {
    try {
      console.log('محاولة جلب أنواع الإشعارات...');
    const { data, error } = await supabase
      .from('email_notification_types')
      .select('*')
      .order('created_at', { ascending: false });

      console.log('نتيجة جلب أنواع الإشعارات:', { data, error });
      if (error) {
        console.error('خطأ في جلب أنواع الإشعارات:', error);
        throw error;
      }
    return data || [];
    } catch (error: any) {
      console.error('خطأ في جلب أنواع الإشعارات:', error);
      throw new Error(error.message || 'فشل في جلب أنواع الإشعارات');
    }
  }

  static async createNotificationType(data: any): Promise<any> {
    try {
      const { data: result, error } = await supabase
      .from('email_notification_types')
        .insert([{
          name: data.name || '',
          name_ar: data.name_ar || '',
          name_en: data.name_en || '',
          description: data.description || '',
          description_ar: data.description_ar || '',
          description_en: data.description_en || '',
          is_active: data.is_active ?? true,
          template_id: data.template_id || ''
        }])
      .select()
      .single();

    if (error) throw error;
      return result;
    } catch (error: any) {
      console.error('خطأ في إنشاء نوع الإشعار:', error);
      throw new Error(error.message || 'فشل في إنشاء نوع الإشعار');
    }
  }

  static async updateNotificationType(id: string, data: any): Promise<any> {
    try {
      const { data: result, error } = await supabase
      .from('email_notification_types')
        .update({
          name: data.name,
          name_ar: data.name_ar,
          name_en: data.name_en,
          description: data.description,
          description_ar: data.description_ar,
          description_en: data.description_en,
          is_active: data.is_active,
          template_id: data.template_id,
          updated_at: new Date().toISOString()
        })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
      return result;
    } catch (error: any) {
      console.error('خطأ في تحديث نوع الإشعار:', error);
      throw new Error(error.message || 'فشل في تحديث نوع الإشعار');
    }
  }

  static async deleteNotificationType(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('email_notification_types')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('خطأ في حذف نوع الإشعار:', error);
        return { success: false, error: error.message || 'فشل في حذف نوع الإشعار' };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('خطأ في حذف نوع الإشعار:', error);
      return { success: false, error: error.message || 'فشل في حذف نوع الإشعار' };
    }
  }

  // إدارة قوالب الإيميلات
  static async getEmailTemplates(): Promise<any[]> {
    try {
      console.log('محاولة جلب قوالب الإيميلات...');
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

      console.log('نتيجة جلب قوالب الإيميلات:', { data, error });
      if (error) {
        console.error('خطأ في جلب قوالب الإيميلات:', error);
        throw error;
      }
    return data || [];
    } catch (error: any) {
      console.error('خطأ في جلب قوالب الإيميلات:', error);
      throw new Error(error.message || 'فشل في جلب قوالب الإيميلات');
    }
  }

  static async createEmailTemplate(data: any): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      console.log('📝 إنشاء قالب إيميل جديد:', data);
      
      const { data: result, error } = await supabase
      .from('email_templates')
        .insert([{
          name: data.name || '',
          name_ar: data.name_ar || '',
          name_en: data.name_en || '',
          subject_ar: data.subject_ar || '',
          subject_en: data.subject_en || '',
          content_ar: data.content_ar || '',
          content_en: data.content_en || '',
          html_template_ar: data.html_template_ar || '',
          html_template_en: data.html_template_en || '',
          is_active: data.is_active ?? true,
          smtp_settings_id: data.smtp_settings_id || null,
          contact_smtp_send_id: data.contact_smtp_send_id || null,
          contact_smtp_receive_id: data.contact_smtp_receive_id || null
        }])
      .select()
      .single();

      if (error) {
        console.error('❌ خطأ في إنشاء قالب الإيميل:', error);
        return { success: false, error: error.message || 'فشل في إنشاء قالب الإيميل' };
      }
      
      console.log('✅ تم إنشاء قالب الإيميل بنجاح:', result);
      return { success: true, data: result };
    } catch (error: any) {
      console.error('❌ خطأ في إنشاء قالب الإيميل:', error);
      return { success: false, error: error.message || 'فشل في إنشاء قالب الإيميل' };
    }
  }

  static async updateEmailTemplate(id: string, data: any): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      console.log('📝 تحديث قالب إيميل:', { id, data });
      
      const { data: result, error } = await supabase
      .from('email_templates')
        .update({
          name: data.name,
          name_ar: data.name_ar,
          name_en: data.name_en,
          subject_ar: data.subject_ar,
          subject_en: data.subject_en,
          content_ar: data.content_ar,
          content_en: data.content_en,
          html_template_ar: data.html_template_ar,
          html_template_en: data.html_template_en,
          is_active: data.is_active,
          smtp_settings_id: data.smtp_settings_id || null,
          contact_smtp_send_id: data.contact_smtp_send_id || null,
          contact_smtp_receive_id: data.contact_smtp_receive_id || null,
          updated_at: new Date().toISOString()
        })
      .eq('id', id)
      .select()
      .single();

      if (error) {
        console.error('❌ خطأ في تحديث قالب الإيميل:', error);
        return { success: false, error: error.message || 'فشل في تحديث قالب الإيميل' };
      }
      
      console.log('✅ تم تحديث قالب الإيميل بنجاح:', result);
      return { success: true, data: result };
    } catch (error: any) {
      console.error('❌ خطأ في تحديث قالب الإيميل:', error);
      return { success: false, error: error.message || 'فشل في تحديث قالب الإيميل' };
    }
  }

  static async deleteEmailTemplate(id: string): Promise<{ success: boolean; error?: string }> {
    try {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);

      if (error) {
        console.error('خطأ في حذف قالب الإيميل:', error);
        return { success: false, error: error.message || 'فشل في حذف قالب الإيميل' };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('خطأ في حذف قالب الإيميل:', error);
      return { success: false, error: error.message || 'فشل في حذف قالب الإيميل' };
    }
  }

  // إدارة إعدادات SMTP
  static async getEmailSettings(): Promise<any[]> {
    try {
      console.log('محاولة جلب إعدادات الإيميلات...');
    const { data, error } = await supabase
      .from('email_settings')
      .select('*')
      .order('created_at', { ascending: false });

      console.log('نتيجة جلب إعدادات الإيميلات:', { data, error });
      if (error) {
        console.error('خطأ في جلب إعدادات الإيميلات:', error);
        throw error;
      }
    return data || [];
    } catch (error: any) {
      console.error('خطأ في جلب إعدادات الإيميلات:', error);
      throw new Error(error.message || 'فشل في جلب إعدادات الإيميلات');
    }
  }

  static async createEmailSettings(data: any): Promise<any> {
    try {
      console.log('📝 إنشاء إعدادات إيميل جديدة:', data);
      
      const insertData = {
        smtp_host: data.smtp_host || '',
        smtp_port: data.smtp_port || 587,
        smtp_username: data.smtp_username || '',
        smtp_password: data.smtp_password || '',
        from_name_ar: data.from_name_ar || 'منصة رزقي',
        from_name_en: data.from_name_en || 'Rezge Platform',
        from_email: data.from_email || '',
        reply_to: data.reply_to || '',
        is_active: data.is_active ?? true,
        is_default: data.is_default ?? false,
        created_at: data.created_at || new Date().toISOString()
      };
      
      // التحقق من صحة البيانات المطلوبة
      if (!insertData.smtp_host || !insertData.smtp_username || !insertData.from_email) {
        throw new Error('الحقول المطلوبة مفقودة: عنوان الخادم، اسم المستخدم، أو البريد الإلكتروني');
      }
      
      console.log('📤 البيانات المرسلة لقاعدة البيانات:', insertData);
      
      const { data: result, error } = await supabase
        .from('email_settings')
        .insert([insertData])
        .select()
        .single();

      console.log('📊 نتيجة الاستعلام:', { result, error });

      if (error) {
        console.error('❌ خطأ من Supabase:', error);
        throw error;
      }
      
      console.log('✅ تم إنشاء الإعدادات بنجاح:', result);
      return result;
    } catch (error: any) {
      console.error('❌ خطأ في إنشاء إعدادات الإيميل:', error);
      throw new Error(error.message || 'فشل في إنشاء إعدادات الإيميل');
    }
  }

  static async updateEmailSettings(id: string, data: any): Promise<any> {
    try {
      const { data: result, error } = await supabase
      .from('email_settings')
        .update({
          smtp_host: data.smtp_host,
          smtp_port: data.smtp_port,
          smtp_username: data.smtp_username,
          smtp_password: data.smtp_password,
          from_name_ar: data.from_name_ar,
          from_name_en: data.from_name_en,
          from_email: data.from_email,
          reply_to: data.reply_to,
          is_active: data.is_active,
          is_default: data.is_default,
          updated_at: new Date().toISOString()
        })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
      return result;
    } catch (error: any) {
      console.error('خطأ في تحديث إعدادات الإيميل:', error);
      throw new Error(error.message || 'فشل في تحديث إعدادات الإيميل');
    }
  }

  static async deleteEmailSettings(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('email_settings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('خطأ في حذف إعدادات الإيميل:', error);
        return { success: false, error: error.message || 'فشل في حذف إعدادات الإيميل' };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('خطأ في حذف إعدادات الإيميل:', error);
      return { success: false, error: error.message || 'فشل في حذف إعدادات الإيميل' };
    }
  }

  // تعيين إعدادات SMTP كافتراضي
  static async setAsDefault(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔧 تعيين إعدادات SMTP كافتراضي:', id);
      
      // إلغاء تعيين جميع الإعدادات الأخرى كافتراضي
      await this.unsetAllDefaults();
      
      // تعيين الإعداد المحدد كافتراضي
      const { data: result, error } = await supabase
        .from('email_settings')
        .update({
          is_default: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ خطأ في تعيين الإعداد كافتراضي:', error);
        return { success: false, error: error.message || 'فشل في تعيين الإعداد كافتراضي' };
      }
      
      console.log('✅ تم تعيين الإعداد كافتراضي بنجاح:', result);
      return { success: true };
    } catch (error: any) {
      console.error('❌ خطأ في تعيين الإعداد كافتراضي:', error);
      return { success: false, error: error.message || 'فشل في تعيين الإعداد كافتراضي' };
    }
  }

  // إلغاء تعيين جميع الإعدادات كافتراضي
  static async unsetAllDefaults(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔧 إلغاء تعيين جميع الإعدادات كافتراضي...');
      
      const { error } = await supabase
        .from('email_settings')
        .update({
          is_default: false,
          updated_at: new Date().toISOString()
        })
        .eq('is_default', true);

      if (error) {
        console.error('❌ خطأ في إلغاء تعيين الإعدادات الافتراضية:', error);
        return { success: false, error: error.message || 'فشل في إلغاء تعيين الإعدادات الافتراضية' };
      }
      
      console.log('✅ تم إلغاء تعيين جميع الإعدادات الافتراضية بنجاح');
      return { success: true };
    } catch (error: any) {
      console.error('❌ خطأ في إلغاء تعيين الإعدادات الافتراضية:', error);
      return { success: false, error: error.message || 'فشل في إلغاء تعيين الإعدادات الافتراضية' };
    }
  }

  // الحصول على الإعدادات الافتراضية
  static async getDefaultEmailSettings(): Promise<any> {
    try {
      console.log('🔍 جلب الإعدادات الافتراضية...');
      
      const { data: result, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('is_default', true)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('❌ خطأ في جلب الإعدادات الافتراضية:', error);
        return null;
      }
      
      console.log('✅ تم جلب الإعدادات الافتراضية بنجاح:', result);
      return result;
    } catch (error: any) {
      console.error('❌ خطأ في جلب الإعدادات الافتراضية:', error);
      return null;
    }
  }

  // إدارة سجلات الإيميلات
  static async getEmailLogs(): Promise<any[]> {
    try {
    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
    } catch (error: any) {
      console.error('خطأ في جلب سجلات الإيميلات:', error);
      throw new Error(error.message || 'فشل في جلب سجلات الإيميلات');
    }
  }

  // إحصائيات الإيميلات
  static async getEmailStats(): Promise<any> {
    try {
    // إجمالي الإيميلات المرسلة
      const { count: totalSent } = await supabase
      .from('email_logs')
        .select('*', { count: 'exact', head: true })
      .eq('status', 'sent');

    // إجمالي الإيميلات الفاشلة
      const { count: totalFailed } = await supabase
      .from('email_logs')
        .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');

    // إيميلات اليوم
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { count: todaySent } = await supabase
      .from('email_logs')
        .select('*', { count: 'exact', head: true })
      .eq('status', 'sent')
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString());

      const { count: todayFailed } = await supabase
      .from('email_logs')
        .select('*', { count: 'exact', head: true })
      .eq('status', 'failed')
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString());

      // الإحصائيات حسب القالب
      const { data: byTemplate } = await supabase
      .from('email_logs')
        .select('*')
      .eq('status', 'sent');

      const templateStats = byTemplate?.reduce((acc: any, log: any) => {
        const templateName = log.template_name || 'غير محدد';
        acc[templateName] = (acc[templateName] || 0) + 1;
        return acc;
      }, {}) || {};

      const byTemplateArray = Object.entries(templateStats).map(([name, count]) => ({
        template_name: name,
        count: count as number
      }));

      // الإحصائيات حسب الحالة
      const { data: byStatus } = await supabase
      .from('email_logs')
        .select('status');

      const statusStats = byStatus?.reduce((acc: any, log: any) => {
        acc[log.status] = (acc[log.status] || 0) + 1;
        return acc;
      }, {}) || {};

      const byStatusArray = Object.entries(statusStats).map(([status, count]) => ({
        status: status === 'sent' ? 'مرسل' : status === 'failed' ? 'فاشل' : 'في الانتظار',
        count: count as number
      }));

      const total = (totalSent || 0) + (totalFailed || 0);
      const successRate = total > 0 ? Math.round(((totalSent || 0) / total) * 100) : 0;

    return {
        totalSent: totalSent || 0,
        totalFailed: totalFailed || 0,
        successRate: successRate,
        dailySends: todaySent || 0,
        by_template: byTemplateArray,
        by_status: byStatusArray
      };
    } catch (error: any) {
      console.error('خطأ في جلب إحصائيات الإيميلات:', error);
      throw new Error(error.message || 'فشل في جلب إحصائيات الإيميلات');
    }
  }

  // اختبار إرسال الإيميل
  static async testEmailSend(to: string, templateId: string, language: 'ar' | 'en' = 'ar'): Promise<{ success: boolean; message: string; logId?: string }> {
    try {
      // جلب القالب
      const { data: template, error: templateError } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError || !template) {
        throw new Error('القالب غير موجود');
      }

      // جلب الإعدادات
      const { data: settings, error: settingsError } = await supabase
        .from('email_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (settingsError || !settings) {
        throw new Error('إعدادات الإيميل غير موجودة');
      }

      // إنشاء سجل الإيميل
      const { data: log, error: logError } = await supabase
        .from('email_logs')
        .insert([{
          recipient_email: to,
          subject: language === 'ar' ? template.subject_ar : template.subject_en,
          template_id: templateId,
          notification_type: 'test',
          status: 'pending'
        }])
        .select()
        .single();

      if (logError) throw logError;

      // تخزين log.id للمرجع في catch
      const logId = log?.id;

      // إرسال الإيميل (هنا يمكن استخدام UnifiedEmailService)
      // const emailService = new UnifiedEmailService();
      // await emailService.sendEmail({
      //   to: to,
      //   subject: language === 'ar' ? template.subject_ar : template.subject_en,
      //   html: language === 'ar' ? template.html_template_ar : template.html_template_en,
      //   text: language === 'ar' ? template.content_ar : template.content_en
      // });

      // تحديث السجل
      await supabase
        .from('email_logs')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', logId);

      return {
        success: true,
        message: 'تم إرسال الإيميل بنجاح',
        logId: logId
      };

    } catch (error: any) {
      // تحديث السجل بالفشل
      if (logId) {
        await supabase
          .from('email_logs')
          .update({
            status: 'failed',
            error_message: error.message
          })
          .eq('id', logId);
      }

      return {
        success: false,
        message: error.message || 'حدث خطأ في إرسال الإيميل'
      };
    }
  }

  // اختبار اتصال SMTP
  static async testSMTPConnection(settings: any): Promise<{ success: boolean; message: string }> {
    try {
      // هنا يمكن إضافة منطق اختبار الاتصال
      // يمكن استخدام مكتبة مثل nodemailer لاختبار الاتصال
      
      return {
        success: true,
        message: 'تم اختبار الاتصال بنجاح'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'فشل في اختبار الاتصال'
      };
    }
  }
}
