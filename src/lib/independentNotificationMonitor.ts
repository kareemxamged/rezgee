/**
 * نظام مراقبة الإشعارات المستقل - يعمل بدون تسجيل دخول
 * Independent Notification Monitor - Works without user login
 * رزقي - منصة الزواج الإسلامي الشرعي
 */

import { supabase } from './supabase';
import { notificationEmailService } from './notificationEmailService';

export interface NotificationStatus {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  email_sent: boolean;
  email_sent_at?: string;
  email_status: 'pending' | 'sent' | 'failed' | 'retry';
  retry_count: number;
  created_at: string;
  updated_at: string;
}

export interface MonitorConfig {
  checkInterval: number; // بالثواني
  maxRetries: number;
  retryDelay: number; // بالثواني
  batchSize: number; // عدد الإشعارات المعالجة في كل مرة
  enableEmailTracking: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

class IndependentNotificationMonitor {
  private static instance: IndependentNotificationMonitor;
  private isRunning: boolean = false;
  private config: MonitorConfig;
  private checkInterval: NodeJS.Timeout | null = null;
  private startTime: Date = new Date();
  private processedCount: number = 0;
  private sentCount: number = 0;
  private failedCount: number = 0;

  private constructor(config?: Partial<MonitorConfig>) {
    this.config = {
      checkInterval: 15, // كل 15 ثانية
      maxRetries: 3,
      retryDelay: 30, // 30 ثانية
      batchSize: 10, // معالجة 10 إشعارات في كل مرة
      enableEmailTracking: true,
      logLevel: 'debug',
      ...config
    };
  }

  public static getInstance(config?: Partial<MonitorConfig>): IndependentNotificationMonitor {
    if (!IndependentNotificationMonitor.instance) {
      IndependentNotificationMonitor.instance = new IndependentNotificationMonitor(config);
    }
    return IndependentNotificationMonitor.instance;
  }

  /**
   * بدء المراقبة المستقلة
   */
  public async startIndependentMonitoring(): Promise<void> {
    if (this.isRunning) {
      this.log('warn', 'نظام المراقبة المستقل يعمل بالفعل');
      return;
    }

    try {
      this.isRunning = true;
      this.startTime = new Date();
      this.processedCount = 0;
      this.sentCount = 0;
      this.failedCount = 0;

      this.log('info', '🚀 بدء نظام المراقبة المستقل للإشعارات...');
      this.log('info', `⚙️ الإعدادات: فحص كل ${this.config.checkInterval} ثانية`);
      this.log('info', `📦 حجم الدفعة: ${this.config.batchSize} إشعار`);
      this.log('info', `📧 تتبع الإيميل: ${this.config.enableEmailTracking ? 'مفعل' : 'معطل'}`);

      // إنشاء جدول تتبع الإشعارات إذا لم يكن موجوداً
      await this.createNotificationTrackingTable();

      // بدء المراقبة الرئيسية
      this.startMainMonitoring();

      this.log('info', '✅ تم بدء المراقبة المستقلة بنجاح!');
      this.log('info', '🔄 النظام سيعمل 24/7 لجميع المستخدمين');

    } catch (error) {
      this.log('error', `❌ خطأ في بدء المراقبة المستقلة: ${error}`);
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * إيقاف المراقبة المستقلة
   */
  public stopIndependentMonitoring(): void {
    if (!this.isRunning) {
      this.log('warn', 'نظام المراقبة المستقل متوقف بالفعل');
      return;
    }

    this.log('info', '🛑 إيقاف المراقبة المستقلة...');

    this.isRunning = false;

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    this.log('info', '✅ تم إيقاف المراقبة المستقلة');
  }

  /**
   * بدء المراقبة الرئيسية
   */
  private startMainMonitoring(): void {
    this.checkInterval = setInterval(async () => {
      try {
        await this.processUnreadNotifications();
        this.log('info', `✅ فحص ناجح - معالجة: ${this.processedCount}, مرسلة: ${this.sentCount}, فاشلة: ${this.failedCount}`);
      } catch (error) {
        this.log('error', `❌ خطأ في المراقبة: ${error}`);
      }
    }, this.config.checkInterval * 1000);

    // فحص فوري عند البدء
    setTimeout(async () => {
      try {
        await this.processUnreadNotifications();
      } catch (error) {
        this.log('error', `❌ خطأ في الفحص الأولي: ${error}`);
      }
    }, 5000); // 5 ثوان
  }

  /**
   * معالجة الإشعارات الجديدة
   */
  private async processUnreadNotifications(): Promise<void> {
    try {
      // فحص مؤقت: جلب جميع الإشعارات لمعرفة ما هو موجود
      const { data: allNotifications, error: allError } = await supabase
        .from('notifications')
        .select('id, type, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (!allError && allNotifications) {
        this.log('debug', `📊 آخر 5 إشعارات في قاعدة البيانات: ${allNotifications.map(n => `${n.type}(${new Date(n.created_at).toLocaleString()})`).join(', ')}`);
      }

      // جلب الإشعارات الجديدة (آخر 5 دقائق) بغض النظر عن كونها مقروءة أم لا
      const timeFilter = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // آخر 5 دقائق
      this.log('debug', `🕐 الوقت الحالي: ${new Date().toLocaleString()}`);
      this.log('debug', `🔍 البحث عن الإشعارات بعد: ${timeFilter}`);
      
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
        this.log('debug', '🔍 هذا يعني أن الإعجاب لم ينشئ إشعاراً جديداً أو أن الإشعارات قديمة جداً');
        return;
      }

      this.log('debug', `📋 تفاصيل الإشعارات: ${notifications.map(n => `${n.type}(${n.id})`).join(', ')}`);

      this.log('info', `📧 تم العثور على ${notifications.length} إشعار جديد`);

      // معالجة كل إشعار
      for (const notification of notifications) {
        try {
          // التحقق من عدم إرسال إيميل لهذا الإشعار من قبل
          if (this.config.enableEmailTracking) {
            const emailStatus = await this.getEmailStatus(notification.id);
            if (emailStatus && emailStatus.email_status === 'sent') {
              this.log('debug', `⏭️ تم تخطي الإشعار ${notification.id} - تم إرسال إيميل من قبل`);
              continue;
            }
          }

          this.log('info', `🔄 معالجة الإشعار ${notification.id} من نوع ${notification.type}`);

          await this.processNotificationEmail(notification);
          this.processedCount++;
        } catch (error) {
          this.log('error', `❌ خطأ في معالجة الإشعار ${notification.id}: ${error}`);
          this.failedCount++;
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
  private async processNotificationEmail(notification: any): Promise<void> {
    try {
      // التحقق من حالة الإرسال السابقة
      const emailStatus = await this.getEmailStatus(notification.id);
      
      if (emailStatus && emailStatus.email_status === 'sent') {
        this.log('debug', `📧 الإشعار ${notification.id} تم إرساله مسبقاً`);
        return;
      }

      // الحصول على معلومات المستخدم المستهدف
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email, first_name, last_name')
        .eq('id', notification.user_id)
        .single();

      if (userError || !userData) {
        throw new Error(`خطأ في جلب بيانات المستخدم: ${userError?.message}`);
      }

      const userName = `${userData.first_name} ${userData.last_name}`.trim();
      const userEmail = userData.email;

      // تحديث حالة الإرسال إلى "جاري المعالجة"
      await this.updateEmailStatus(notification.id, 'pending');

      // إرسال الإشعار البريدي حسب النوع
      let emailSent = false;
      try {
        switch (notification.type) {
          case 'profile_view':
            emailSent = await this.sendProfileViewNotification(userEmail, userName, notification);
            break;
          case 'like':
            emailSent = await this.sendLikeNotification(userEmail, userName, notification);
            break;
          case 'message':
            emailSent = await this.sendMessageNotification(userEmail, userName, notification);
            break;
          case 'match':
            emailSent = await this.sendMatchNotification(userEmail, userName, notification);
            break;
          case 'report_received':
            emailSent = await this.sendReportReceivedNotification(userEmail, userName, notification);
            break;
          case 'report_accepted':
          case 'report_rejected':
            emailSent = await this.sendReportStatusNotification(userEmail, userName, notification);
            break;
          case 'verification_approved':
          case 'verification_rejected':
            emailSent = await this.sendVerificationStatusNotification(userEmail, userName, notification);
            break;
          default:
            emailSent = await this.sendSystemNotification(userEmail, userName, notification);
        }

        if (emailSent) {
          await this.updateEmailStatus(notification.id, 'sent');
          this.sentCount++;
          this.log('info', `✅ تم إرسال إشعار بريدي: ${notification.type} للمستخدم ${notification.user_id}`);
        } else {
          await this.updateEmailStatus(notification.id, 'failed');
          this.failedCount++;
          this.log('error', `❌ فشل في إرسال إشعار بريدي: ${notification.type} للمستخدم ${notification.user_id}`);
        }

      } catch (emailError) {
        await this.updateEmailStatus(notification.id, 'failed');
        this.failedCount++;
        this.log('error', `❌ خطأ في إرسال الإيميل: ${emailError}`);
      }

    } catch (error) {
      this.log('error', `❌ خطأ في معالجة الإشعار ${notification.id}: ${error}`);
      throw error;
    }
  }

  /**
   * إنشاء جدول تتبع الإشعارات
   */
  private async createNotificationTrackingTable(): Promise<void> {
    try {
      // التحقق من وجود الجدول
      const { data, error } = await supabase
        .from('notification_email_tracking')
        .select('id')
        .limit(1);

      if (error && error.code === '42P01') { // Table doesn't exist
        this.log('warn', 'جدول تتبع الإشعارات غير موجود - يرجى تشغيل SQL script');
        this.log('info', 'قم بتشغيل ملف: create_notification_email_tracking_simple.sql');
      } else if (error) {
        this.log('warn', `تحذير في التحقق من جدول التتبع: ${error.message}`);
      } else {
        this.log('info', '✅ تم التحقق من وجود جدول تتبع الإشعارات');
      }
    } catch (error) {
      this.log('warn', `تحذير في التحقق من جدول التتبع: ${error}`);
    }
  }

  /**
   * الحصول على حالة الإرسال البريدي
   */
  private async getEmailStatus(notificationId: string): Promise<any> {
    try {
      // التحقق من وجود الجدول أولاً
      const { data, error } = await supabase
        .from('notification_email_tracking')
        .select('*')
        .eq('notification_id', notificationId)
        .single();

      if (error) {
        if (error.code === '42P01') { // Table doesn't exist
          this.log('warn', 'جدول تتبع الإشعارات غير موجود - سيتم تخطي التتبع');
          return null;
        } else if (error.code === 'PGRST116') { // No rows returned
          return null;
        } else {
          throw new Error(`خطأ في جلب حالة الإرسال: ${error.message}`);
        }
      }

      return data;
    } catch (error) {
      this.log('error', `❌ خطأ في جلب حالة الإرسال: ${error}`);
      return null;
    }
  }

  /**
   * تحديث حالة الإرسال البريدي
   */
  private async updateEmailStatus(notificationId: string, status: 'pending' | 'sent' | 'failed' | 'retry'): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      // محاولة تحديث السجل الموجود أولاً
      const { data: existingRecord, error: selectError } = await supabase
        .from('notification_email_tracking')
        .select('id, retry_count')
        .eq('notification_id', notificationId)
        .single();

      if (selectError) {
        if (selectError.code === '42P01') { // Table doesn't exist
          this.log('warn', 'جدول تتبع الإشعارات غير موجود - سيتم تخطي التتبع');
          return;
        } else if (selectError.code === 'PGRST116') { // No rows returned
          // إنشاء سجل جديد
          const { error: insertError } = await supabase
            .from('notification_email_tracking')
            .insert({
              notification_id: notificationId,
              email_status: status,
              email_sent_at: status === 'sent' ? now : null,
              retry_count: status === 'retry' ? 1 : 0,
              created_at: now,
              updated_at: now
            });

          if (insertError) {
            if (insertError.code === '42P01') { // Table doesn't exist
              this.log('warn', 'جدول تتبع الإشعارات غير موجود - سيتم تخطي التتبع');
              return;
            }
            throw new Error(`خطأ في إنشاء السجل: ${insertError.message}`);
          }
          return;
        } else {
          throw new Error(`خطأ في البحث عن السجل: ${selectError.message}`);
        }
      }

      if (existingRecord) {
        // تحديث السجل الموجود
        const { error: updateError } = await supabase
          .from('notification_email_tracking')
          .update({
            email_status: status,
            email_sent_at: status === 'sent' ? now : null,
            retry_count: status === 'retry' ? existingRecord.retry_count + 1 : existingRecord.retry_count,
            updated_at: now
          })
          .eq('id', existingRecord.id);

        if (updateError) {
          throw new Error(`خطأ في تحديث السجل: ${updateError.message}`);
        }
      }

    } catch (error) {
      this.log('error', `❌ خطأ في تحديث حالة الإرسال: ${error}`);
    }
  }

  /**
   * إرسال إشعار مشاهدة الملف الشخصي
   */
  private async sendProfileViewNotification(userEmail: string, userName: string, notification: any): Promise<boolean> {
    const fromUser = notification.from_user;
    if (!fromUser) return false;

    const fromUserName = `${fromUser.first_name} ${fromUser.last_name}`.trim();
    
    return await notificationEmailService.sendProfileViewNotification(
      userEmail,
      userName,
      {
        viewerName: fromUserName,
        viewerCity: fromUser.city,
        viewerAge: fromUser.age,
        timestamp: notification.created_at
      }
    );
  }

  /**
   * إرسال إشعار الإعجاب
   */
  private async sendLikeNotification(userEmail: string, userName: string, notification: any): Promise<boolean> {
    const fromUser = notification.from_user;
    if (!fromUser) return false;

    const fromUserName = `${fromUser.first_name} ${fromUser.last_name}`.trim();
    
    return await notificationEmailService.sendLikeNotification(
      userEmail,
      userName,
      {
        likerName: fromUserName,
        likerCity: fromUser.city,
        likerAge: fromUser.age,
        timestamp: notification.created_at
      }
    );
  }

  /**
   * إرسال إشعار الرسالة الجديدة
   */
  private async sendMessageNotification(userEmail: string, userName: string, notification: any): Promise<boolean> {
    const fromUser = notification.from_user;
    if (!fromUser) return false;

    const fromUserName = `${fromUser.first_name} ${fromUser.last_name}`.trim();
    
    return await notificationEmailService.sendNewMessageNotification(
      userEmail,
      userName,
      fromUserName,
      fromUser.city,
      fromUser.age
    );
  }

  /**
   * إرسال إشعار المطابقة الجديدة
   */
  private async sendMatchNotification(userEmail: string, userName: string, notification: any): Promise<boolean> {
    const fromUser = notification.from_user;
    if (!fromUser) return false;

    const fromUserName = `${fromUser.first_name} ${fromUser.last_name}`.trim();
    
    return await notificationEmailService.sendMatchNotification(
      userEmail,
      userName,
      {
        matchName: fromUserName,
        matchCity: fromUser.city,
        matchAge: fromUser.age,
        timestamp: notification.created_at
      }
    );
  }

  /**
   * إرسال إشعار استلام بلاغ
   */
  private async sendReportReceivedNotification(userEmail: string, userName: string, notification: any): Promise<boolean> {
    return await notificationEmailService.sendReportReceivedNotification(
      userEmail,
      userName,
      {
        reportType: 'غير محدد',
        timestamp: notification.created_at
      }
    );
  }

  /**
   * إرسال إشعار حالة البلاغ
   */
  private async sendReportStatusNotification(userEmail: string, userName: string, notification: any): Promise<boolean> {
    const status = notification.type === 'report_accepted' ? 'accepted' : 'rejected';
    
    return await notificationEmailService.sendReportStatusNotification(
      userEmail,
      userName,
      {
        status,
        reportType: 'غير محدد',
        timestamp: notification.created_at
      }
    );
  }

  /**
   * إرسال إشعار حالة التوثيق
   */
  private async sendVerificationStatusNotification(userEmail: string, userName: string, notification: any): Promise<boolean> {
    const status = notification.type === 'verification_approved' ? 'approved' : 'rejected';
    
    return await notificationEmailService.sendVerificationStatusNotification(
      userEmail,
      userName,
      {
        status,
        documentType: 'غير محدد',
        timestamp: notification.created_at
      }
    );
  }

  /**
   * إرسال إشعار نظامي
   */
  private async sendSystemNotification(userEmail: string, userName: string, notification: any): Promise<boolean> {
    return await notificationEmailService.sendSystemNotification(
      userEmail,
      userName,
      {
        title: notification.title,
        message: notification.message,
        type: notification.type,
        timestamp: notification.created_at
      }
    );
  }

  /**
   * تسجيل الرسائل
   */
  private log(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [INDEPENDENT-MONITOR] [${level.toUpperCase()}] ${message}`;
    
    if (level === 'error') {
      console.error(logMessage);
    } else if (level === 'warn') {
      console.warn(logMessage);
    } else if (level === 'info') {
      console.log(logMessage);
    } else if (level === 'debug' && this.config.logLevel === 'debug') {
      console.log(logMessage);
    }
  }

  /**
   * الحصول على إحصائيات النظام
   */
  public getStats() {
    const uptime = Math.floor((Date.now() - this.startTime.getTime()) / 1000);
    return {
      isRunning: this.isRunning,
      startTime: this.startTime.toISOString(),
      uptime: uptime,
      processedCount: this.processedCount,
      sentCount: this.sentCount,
      failedCount: this.failedCount,
      successRate: this.processedCount > 0 ? (this.sentCount / this.processedCount * 100).toFixed(2) : '0'
    };
  }

  /**
   * تحديث الإعدادات
   */
  public updateConfig(newConfig: Partial<MonitorConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.log('info', '⚙️ تم تحديث إعدادات المراقب المستقل');
  }

  /**
   * إعادة تعيين الإحصائيات
   */
  public resetStats(): void {
    this.processedCount = 0;
    this.sentCount = 0;
    this.failedCount = 0;
    this.log('info', '🔄 تم إعادة تعيين الإحصائيات');
  }
}

// تصدير مثيل واحد
export const independentNotificationMonitor = IndependentNotificationMonitor.getInstance();
export default independentNotificationMonitor;
