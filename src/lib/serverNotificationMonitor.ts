/**
 * نظام مراقبة الإشعارات البريدية للخادم
 * Server Notification Email Monitor
 * رزقي - منصة الزواج الإسلامي الشرعي
 * 
 * هذا النظام يعمل في الخادم ويراقب إشعارات جميع المستخدمين
 */

import { supabase } from './supabase';
import { notificationEmailService } from './notificationEmailService';

export interface ServerMonitorConfig {
  checkInterval: number; // بالثواني
  maxRetries: number;
  retryDelay: number; // بالثواني
  batchSize: number; // عدد الإشعارات المعالجة في كل مرة
  enableEmailTracking: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface NotificationEmailData {
  id: string;
  user_id: string;
  from_user_id: string | null;
  type: string;
  title: string;
  message: string;
  action_url: string | null;
  action_text: string | null;
  is_read: boolean;
  created_at: string;
  from_user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    city: string;
    age: number;
  } | null;
}

class ServerNotificationMonitor {
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private config: ServerMonitorConfig;
  private stats = {
    startTime: 0,
    processedCount: 0,
    sentCount: 0,
    failedCount: 0,
    lastCheckTime: 0
  };

  constructor() {
    this.config = {
      checkInterval: 15, // كل 15 ثانية
      maxRetries: 3, // أقصى 3 أخطاء متتالية
      retryDelay: 30, // انتظار 30 ثانية
      batchSize: 10, // معالجة 10 إشعارات في كل مرة
      enableEmailTracking: true, // تتبع حالة الإرسال البريدي
      logLevel: 'debug' // مستوى التسجيل
    };
  }

  /**
   * بدء المراقبة المستقلة
   */
  async startServerMonitoring(): Promise<void> {
    if (this.isRunning) {
      this.log('warn', 'النظام يعمل بالفعل!');
      return;
    }

    this.log('info', '🚀 بدء نظام مراقبة الإشعارات البريدية للخادم...');
    this.isRunning = true;
    this.stats.startTime = Date.now();
    this.stats.lastCheckTime = Date.now();

    // بدء المراقبة الدورية
    this.startMainMonitoring();

    this.log('info', '✅ تم بدء النظام بنجاح!');
    this.log('info', `🔄 سيفحص النظام كل ${this.config.checkInterval} ثانية`);
    this.log('info', '🌍 النظام سيراقب إشعارات جميع المستخدمين في المنصة');
  }

  /**
   * إيقاف المراقبة المستقلة
   */
  stopServerMonitoring(): void {
    if (!this.isRunning) {
      this.log('warn', 'النظام متوقف بالفعل!');
      return;
    }

    this.log('info', '🛑 إيقاف نظام مراقبة الإشعارات البريدية...');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.log('info', '✅ تم إيقاف النظام بنجاح!');
  }

  /**
   * بدء المراقبة الرئيسية
   */
  private startMainMonitoring(): void {
    this.intervalId = setInterval(async () => {
      try {
        this.stats.lastCheckTime = Date.now();
        await this.processUnreadNotifications();
      } catch (error) {
        this.log('error', `❌ خطأ في المراقبة الرئيسية: ${error}`);
        this.stats.failedCount++;
      }
    }, this.config.checkInterval * 1000);
  }

  /**
   * معالجة الإشعارات الجديدة لجميع المستخدمين
   */
  private async processUnreadNotifications(): Promise<void> {
    try {
      // فحص مؤقت: جلب جميع الإشعارات لمعرفة ما هو موجود
      const { data: allNotifications, error: allError } = await supabase
        .from('notifications')
        .select('id, type, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!allError && allNotifications) {
        this.log('debug', `📊 آخر 10 إشعارات في قاعدة البيانات: ${allNotifications.map(n => `${n.type}(${n.user_id?.substring(0, 8)}... - ${new Date(n.created_at).toLocaleString()})`).join(', ')}`);
      }

      // جلب الإشعارات الجديدة (آخر 5 دقائق) لجميع المستخدمين
      const timeFilter = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // آخر 5 دقائق
      this.log('debug', `🕐 الوقت الحالي: ${new Date().toLocaleString()}`);
      this.log('debug', `🔍 البحث عن الإشعارات بعد: ${timeFilter}`);
      this.log('debug', '🌍 النظام يفحص إشعارات جميع المستخدمين في المنصة');
      
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select(`
          id,
          user_id,
          from_user_id,
          type,
          title,
          message,
          action_url,
          action_text,
          is_read,
          created_at,
          from_user:from_user_id (
            id,
            first_name,
            last_name,
            email,
            city,
            age
          )
        `)
        .gte('created_at', timeFilter) // آخر 5 دقائق
        .limit(this.config.batchSize)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`خطأ في جلب الإشعارات: ${error.message}`);
      }

      if (!notifications || notifications.length === 0) {
        this.log('debug', '📭 لا توجد إشعارات جديدة للفحص (آخر 5 دقائق)');
        this.log('debug', '🔍 هذا يعني أن لا أحد قام بأي نشاط في آخر 5 دقائق');
        return;
      }

      this.log('debug', `📋 تفاصيل الإشعارات: ${notifications.map(n => `${n.type}(${n.user_id?.substring(0, 8)}... - ${n.id.substring(0, 8)}...)`).join(', ')}`);
      this.log('info', `📧 تم العثور على ${notifications.length} إشعار جديد لجميع المستخدمين`);

      // معالجة كل إشعار
      for (const notification of notifications) {
        try {
          // التحقق من عدم إرسال إيميل لهذا الإشعار من قبل
          if (this.config.enableEmailTracking) {
            const emailStatus = await this.getEmailStatus(notification.id);
            if (emailStatus && emailStatus.email_status === 'sent') {
              this.log('debug', `⏭️ تم تخطي الإشعار ${notification.id.substring(0, 8)}... - تم إرسال إيميل من قبل`);
              continue;
            }
          }

          this.log('info', `🔄 معالجة الإشعار ${notification.id.substring(0, 8)}... من نوع ${notification.type} للمستخدم ${notification.user_id?.substring(0, 8)}...`);
          await this.processNotificationEmail(notification);
          this.stats.processedCount++;
        } catch (error) {
          this.log('error', `❌ خطأ في معالجة الإشعار ${notification.id.substring(0, 8)}...: ${error}`);
          this.stats.failedCount++;
        }
      }
    } catch (error) {
      this.log('error', `❌ خطأ في معالجة الإشعارات: ${error}`);
      throw error;
    }
  }

  /**
   * معالجة إشعار بريدي واحد
   */
  private async processNotificationEmail(notification: NotificationEmailData): Promise<void> {
    try {
      // الحصول على بيانات المستخدم المستهدف
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, city, age')
        .eq('id', notification.user_id)
        .single();

      if (userError || !user) {
        throw new Error(`خطأ في جلب بيانات المستخدم: ${userError?.message || 'المستخدم غير موجود'}`);
      }

      if (!user.email) {
        this.log('warn', `⚠️ المستخدم ${user.id.substring(0, 8)}... لا يملك إيميل`);
        return;
      }

      this.log('info', `📧 إرسال إشعار بريدي للمستخدم ${user.first_name} ${user.last_name} (${user.email})`);

      // إرسال الإيميل حسب نوع الإشعار
      let emailSent = false;
      switch (notification.type) {
        case 'like':
          emailSent = await notificationEmailService.sendLikeNotification(user, notification.from_user);
          break;
        case 'profile_view':
          emailSent = await notificationEmailService.sendProfileViewNotification(user, notification.from_user);
          break;
        case 'new_message':
          emailSent = await notificationEmailService.sendNewMessageNotification(user, notification.from_user);
          break;
        case 'match':
          emailSent = await notificationEmailService.sendMatchNotification(user, notification.from_user);
          break;
        case 'report_received':
          emailSent = await notificationEmailService.sendReportReceivedNotification(user, notification.from_user);
          break;
        case 'report_status':
          emailSent = await notificationEmailService.sendReportStatusNotification(user, notification.from_user);
          break;
        case 'verify_approved':
        case 'verify_rejected':
          emailSent = await notificationEmailService.sendVerificationStatusNotification(user, notification.type);
          break;
        case 'system':
          emailSent = await notificationEmailService.sendAlertNotification(user, notification.title, notification.message);
          break;
        default:
          this.log('warn', `⚠️ نوع إشعار غير مدعوم: ${notification.type}`);
          return;
      }

      if (emailSent) {
        this.log('info', `✅ تم إرسال إشعار بريدي: ${notification.type} للمستخدم ${user.id.substring(0, 8)}...`);
        this.stats.sentCount++;

        // تحديث حالة الإرسال في قاعدة البيانات
        if (this.config.enableEmailTracking) {
          await this.updateEmailStatus(notification.id, 'sent', 0);
        }
      } else {
        throw new Error('فشل في إرسال الإيميل');
      }
    } catch (error) {
      this.log('error', `❌ خطأ في معالجة الإشعار ${notification.id.substring(0, 8)}...: ${error}`);
      throw error;
    }
  }

  /**
   * الحصول على حالة الإرسال البريدي
   */
  private async getEmailStatus(notificationId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('notification_email_tracking')
        .select('id, retry_count')
        .eq('notification_id', notificationId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        throw new Error(`خطأ في جلب حالة الإرسال: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error.message.includes('42P01')) { // table doesn't exist
        this.log('warn', '⚠️ جدول تتبع الإيميلات غير موجود - سيتم تخطي التتبع');
        return null;
      }
      throw error;
    }
  }

  /**
   * تحديث حالة الإرسال البريدي
   */
  private async updateEmailStatus(notificationId: string, status: string, retryCount: number): Promise<void> {
    try {
      // محاولة تحديث السجل الموجود أولاً
      const { data: existingRecord } = await supabase
        .from('notification_email_tracking')
        .select('id')
        .eq('notification_id', notificationId)
        .single();

      if (existingRecord) {
        // تحديث السجل الموجود
        const { error: updateError } = await supabase
          .from('notification_email_tracking')
          .update({
            email_status: status,
            retry_count: retryCount,
            updated_at: new Date().toISOString()
          })
          .eq('notification_id', notificationId);

        if (updateError) {
          throw new Error(`خطأ في تحديث حالة الإرسال: ${updateError.message}`);
        }
      } else {
        // إنشاء سجل جديد
        const { error: insertError } = await supabase
          .from('notification_email_tracking')
          .insert({
            notification_id: notificationId,
            email_status: status,
            retry_count: retryCount,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          throw new Error(`خطأ في إنشاء السجل: ${insertError.message}`);
        }
      }
    } catch (error) {
      if (error.message.includes('42P01')) { // table doesn't exist
        this.log('warn', '⚠️ جدول تتبع الإيميلات غير موجود - سيتم تخطي التتبع');
        return;
      }
      throw error;
    }
  }

  /**
   * تسجيل الرسائل
   */
  private log(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [SERVER-MONITOR] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'error':
        console.error(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'debug':
        if (this.config.logLevel === 'debug') {
          console.log(logMessage);
        }
        break;
      default:
        if (['debug', 'info'].includes(this.config.logLevel)) {
          console.log(logMessage);
        }
        break;
    }
  }

  /**
   * الحصول على إحصائيات النظام
   */
  getStats() {
    const uptime = this.isRunning ? Date.now() - this.stats.startTime : 0;
    const successRate = this.stats.processedCount > 0 
      ? Math.round((this.stats.sentCount / this.stats.processedCount) * 100) 
      : 0;

    return {
      isRunning: this.isRunning,
      startTime: this.stats.startTime,
      uptime: uptime,
      processedCount: this.stats.processedCount,
      sentCount: this.stats.sentCount,
      failedCount: this.stats.failedCount,
      successRate: successRate,
      lastCheckTime: this.stats.lastCheckTime
    };
  }

  /**
   * إعادة تعيين الإحصائيات
   */
  resetStats(): void {
    this.stats = {
      startTime: this.isRunning ? Date.now() : 0,
      processedCount: 0,
      sentCount: 0,
      failedCount: 0,
      lastCheckTime: 0
    };
  }

  /**
   * تحديث إعدادات النظام
   */
  updateConfig(newConfig: Partial<ServerMonitorConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.log('info', '⚙️ تم تحديث إعدادات النظام');
  }
}

// إنشاء مثيل واحد للنظام
export const serverNotificationMonitor = new ServerNotificationMonitor();

// تصدير الدوال للاستخدام
export {
  ServerNotificationMonitor
};










