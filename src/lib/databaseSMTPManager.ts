import { supabase } from './supabase';

export interface DatabaseSMTPConfig {
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
  is_default: boolean;
  secure: boolean;
  require_tls: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * مدير إعدادات SMTP من قاعدة البيانات
 * Database SMTP Manager - Centralized SMTP Settings Management
 */
export class DatabaseSMTPManager {
  private static cachedSettings: DatabaseSMTPConfig | null = null;
  private static cacheExpiry: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

  /**
   * جلب إعدادات SMTP الافتراضية من قاعدة البيانات
   */
  static async getDefaultSMTPSettings(): Promise<DatabaseSMTPConfig | null> {
    try {
      console.log('🔍 جلب إعدادات SMTP الافتراضية من قاعدة البيانات...');
      
      // التحقق من الكاش أولاً
      if (this.cachedSettings && Date.now() < this.cacheExpiry) {
        console.log('✅ استخدام إعدادات SMTP من الكاش');
        return this.cachedSettings;
      }

      // جلب الإعدادات الافتراضية أولاً
      const { data: defaultSettings, error: defaultError } = await supabase
        .from('email_settings')
        .select('*')
        .eq('is_default', true)
        .eq('is_active', true)
        .single();

      if (!defaultError && defaultSettings) {
        console.log('✅ تم جلب الإعدادات الافتراضية:', defaultSettings.smtp_host);
        this.cachedSettings = defaultSettings;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
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
        return null;
      }

      console.log('✅ تم جلب إعدادات SMTP احتياطية:', fallbackSettings.smtp_host);
      this.cachedSettings = fallbackSettings;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      return fallbackSettings;

    } catch (error) {
      console.error('❌ خطأ في جلب إعدادات SMTP:', error);
      return null;
    }
  }

  /**
   * جلب إعدادات SMTP محددة بالـ ID
   */
  static async getSMTPSettingsById(id: string): Promise<DatabaseSMTPConfig | null> {
    try {
      console.log(`🔍 جلب إعدادات SMTP بالـ ID: ${id}`);
      
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        console.error('❌ خطأ في جلب إعدادات SMTP:', error);
        return null;
      }

      console.log('✅ تم جلب إعدادات SMTP:', data.smtp_host);
      return data;

    } catch (error) {
      console.error('❌ خطأ في جلب إعدادات SMTP:', error);
      return null;
    }
  }

  /**
   * جلب جميع إعدادات SMTP النشطة
   */
  static async getAllActiveSMTPSettings(): Promise<DatabaseSMTPConfig[]> {
    try {
      console.log('🔍 جلب جميع إعدادات SMTP النشطة...');
      
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ خطأ في جلب إعدادات SMTP:', error);
        return [];
      }

      console.log(`✅ تم جلب ${data?.length || 0} إعدادات SMTP`);
      return data || [];

    } catch (error) {
      console.error('❌ خطأ في جلب إعدادات SMTP:', error);
      return [];
    }
  }

  /**
   * تحويل إعدادات SMTP إلى تنسيق قابل للاستخدام
   */
  static formatSMTPConfig(settings: DatabaseSMTPConfig): any {
    if (!settings) {
      throw new Error('إعدادات SMTP غير متاحة');
    }

    return {
      host: settings.smtp_host,
      port: settings.smtp_port,
      secure: settings.secure || settings.smtp_port === 465,
      requireTLS: settings.require_tls,
      auth: {
        user: settings.smtp_username,
        pass: settings.smtp_password
      },
      from: {
        name: settings.from_name_ar,
        email: settings.from_email
      },
      replyTo: settings.reply_to || settings.from_email,
      isDefault: settings.is_default || false
    };
  }

  /**
   * مسح الكاش (للاستخدام عند تحديث الإعدادات)
   */
  static clearCache(): void {
    console.log('🗑️ مسح كاش إعدادات SMTP...');
    this.cachedSettings = null;
    this.cacheExpiry = 0;
  }

  /**
   * اختبار إعدادات SMTP
   */
  static async testSMTPSettings(settings: DatabaseSMTPConfig): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🧪 اختبار إعدادات SMTP:', settings.smtp_host);
      
      // تحويل الإعدادات إلى تنسيق قابل للاستخدام
      const smtpConfig = this.formatSMTPConfig(settings);
      
      // إرسال إيميل اختبار عبر Supabase Edge Function
      const response = await fetch('https://sbtzngewizgeqzfbhfjy.supabase.co/functions/v1/send-custom-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          to: settings.from_email, // إرسال إلى نفس البريد الإلكتروني
          subject: 'اختبار إعدادات SMTP - رزقي',
          html: '<h1>اختبار إعدادات SMTP</h1><p>هذا إيميل اختبار للتأكد من عمل إعدادات SMTP بشكل صحيح.</p>',
          text: 'اختبار إعدادات SMTP - هذا إيميل اختبار للتأكد من عمل إعدادات SMTP بشكل صحيح.',
          smtpConfig: smtpConfig
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ نجح اختبار إعدادات SMTP');
        return { success: true };
      } else {
        console.error('❌ فشل اختبار إعدادات SMTP:', result.error);
        return { success: false, error: result.error };
      }
      
    } catch (error) {
      console.error('❌ خطأ في اختبار إعدادات SMTP:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف في اختبار إعدادات SMTP'
      };
    }
  }

  /**
   * الحصول على إعدادات SMTP للاستخدام في الخدمات الأخرى
   */
  static async getSMTPConfigForServices(): Promise<any> {
    try {
      const settings = await this.getDefaultSMTPSettings();
      
      if (!settings) {
        console.warn('⚠️ لا توجد إعدادات SMTP متاحة، استخدام الإعدادات الافتراضية');
        return {
          host: 'smtp.hostinger.com',
          port: 465,
          secure: true,
          auth: {
            user: 'manage@kareemamged.com',
            pass: 'f2d000cefdb8a35a1c976298cf8ad5cb886b42ce22a399d7e5d5e96cacfcea05'
          },
          from: {
            name: 'رزقي - منصة الزواج الإسلامي الشرعي',
            email: 'manage@kareemamged.com'
          },
          replyTo: 'manage@kareemamged.com'
        };
      }

      return this.formatSMTPConfig(settings);
      
    } catch (error) {
      console.error('❌ خطأ في جلب إعدادات SMTP للخدمات:', error);
      return null;
    }
  }
}






