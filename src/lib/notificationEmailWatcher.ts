/**
 * مراقب الإشعارات البريدية التلقائية
 * Automatic Notification Email Watcher
 * رزقي - منصة الزواج الإسلامي الشرعي
 */

import { supabase } from './supabase';
import { notificationEmailService } from './notificationEmailService';
import { alertsService } from './alertsService';

export interface NotificationEmailData {
  id: string;
  user_id: string;
  from_user_id?: string;
  type: 'profile_view' | 'like' | 'message' | 'match' | 'system' | 'alert' | 'verification' | 'warning' | 'report_received' | 'report_accepted' | 'report_rejected' | 'verification_approved' | 'verification_rejected';
  title: string;
  message: string;
  action_url?: string;
  action_text?: string;
  created_at: string;
  from_user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    city?: string;
    age?: number;
  };
}

export interface AlertEmailData {
  id: string;
  title: string;
  content: string;
  alert_type: 'info' | 'warning' | 'error' | 'success' | 'announcement';
  priority: number;
  created_by_name: string;
  target_user_ids: string[];
  created_at: string;
}

class NotificationEmailWatcher {
  private static instance: NotificationEmailWatcher;
  private isWatching: boolean = false;
  private watchInterval: NodeJS.Timeout | null = null;
  private lastNotificationCheck: string = new Date().toISOString();
  private lastAlertCheck: string = new Date().toISOString();
  private processedNotifications: Set<string> = new Set();
  private processedAlerts: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): NotificationEmailWatcher {
    if (!NotificationEmailWatcher.instance) {
      NotificationEmailWatcher.instance = new NotificationEmailWatcher();
    }
    return NotificationEmailWatcher.instance;
  }

  /**
   * بدء مراقبة الإشعارات البريدية
   */
  public startWatching(): void {
    if (this.isWatching) {
      console.log('📧 مراقب الإشعارات البريدية يعمل بالفعل');
      return;
    }

    this.isWatching = true;
    console.log('📧 بدء مراقبة الإشعارات البريدية...');

    // مراقبة الإشعارات العادية كل 30 ثانية
    this.watchInterval = setInterval(async () => {
      try {
        await this.checkNewNotifications();
        await this.checkNewAlerts();
      } catch (error) {
        console.error('❌ خطأ في مراقبة الإشعارات:', error);
      }
    }, 30000); // 30 ثانية

    // فحص فوري عند البدء
    setTimeout(async () => {
      try {
        await this.checkNewNotifications();
        await this.checkNewAlerts();
      } catch (error) {
        console.error('❌ خطأ في الفحص الأولي:', error);
      }
    }, 5000); // 5 ثوان
  }

  /**
   * إيقاف مراقبة الإشعارات البريدية
   */
  public stopWatching(): void {
    if (!this.isWatching) {
      return;
    }

    this.isWatching = false;
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
      this.watchInterval = null;
    }
    console.log('📧 تم إيقاف مراقبة الإشعارات البريدية');
  }

  /**
   * فحص الإشعارات الجديدة
   */
  private async checkNewNotifications(): Promise<void> {
    try {
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
        .gt('created_at', this.lastNotificationCheck)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ خطأ في جلب الإشعارات:', error);
        return;
      }

      if (!notifications || notifications.length === 0) {
        return;
      }

      console.log(`📧 تم العثور على ${notifications.length} إشعار جديد`);

      for (const notification of notifications) {
        if (this.processedNotifications.has(notification.id)) {
          continue;
        }

        await this.processNotificationEmail(notification);
        this.processedNotifications.add(notification.id);
      }

      // تحديث وقت آخر فحص
      if (notifications.length > 0) {
        this.lastNotificationCheck = notifications[notifications.length - 1].created_at;
      }

    } catch (error) {
      console.error('❌ خطأ في فحص الإشعارات:', error);
    }
  }

  /**
   * فحص التنبيهات الجديدة
   */
  private async checkNewAlerts(): Promise<void> {
    try {
      const { data: alerts, error } = await supabase
        .from('global_alerts')
        .select(`
          id,
          title,
          content,
          alert_type,
          priority,
          created_by_name,
          target_user_ids,
          created_at
        `)
        .gt('created_at', this.lastAlertCheck)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ خطأ في جلب التنبيهات:', error);
        return;
      }

      if (!alerts || alerts.length === 0) {
        return;
      }

      console.log(`📧 تم العثور على ${alerts.length} تنبيه جديد`);

      for (const alert of alerts) {
        if (this.processedAlerts.has(alert.id)) {
          continue;
        }

        await this.processAlertEmail(alert);
        this.processedAlerts.add(alert.id);
      }

      // تحديث وقت آخر فحص
      if (alerts.length > 0) {
        this.lastAlertCheck = alerts[alerts.length - 1].created_at;
      }

    } catch (error) {
      console.error('❌ خطأ في فحص التنبيهات:', error);
    }
  }

  /**
   * معالجة إشعار بريدي
   */
  private async processNotificationEmail(notification: NotificationEmailData): Promise<void> {
    try {
      // الحصول على معلومات المستخدم المستهدف
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email, first_name, last_name')
        .eq('id', notification.user_id)
        .single();

      if (userError || !userData) {
        console.error('❌ خطأ في جلب بيانات المستخدم:', userError);
        return;
      }

      const userName = `${userData.first_name} ${userData.last_name}`.trim();
      const userEmail = userData.email;

      console.log(`📧 معالجة إشعار بريدي للمستخدم: ${userName} (${userEmail})`);

      // إرسال الإشعار البريدي حسب النوع
      switch (notification.type) {
        case 'profile_view':
          await this.sendProfileViewNotification(userEmail, userName, notification);
          break;

        case 'like':
          await this.sendLikeNotification(userEmail, userName, notification);
          break;

        case 'message':
          await this.sendMessageNotification(userEmail, userName, notification);
          break;

        case 'match':
          await this.sendMatchNotification(userEmail, userName, notification);
          break;

        case 'report_received':
          await this.sendReportReceivedNotification(userEmail, userName, notification);
          break;

        case 'report_accepted':
        case 'report_rejected':
          await this.sendReportStatusNotification(userEmail, userName, notification);
          break;

        case 'verification_approved':
        case 'verification_rejected':
          await this.sendVerificationStatusNotification(userEmail, userName, notification);
          break;

        case 'system':
        case 'alert':
        case 'verification':
        case 'warning':
          await this.sendSystemNotification(userEmail, userName, notification);
          break;

        default:
          console.log(`📧 نوع إشعار غير مدعوم: ${notification.type}`);
      }

    } catch (error) {
      console.error('❌ خطأ في معالجة الإشعار البريدي:', error);
    }
  }

  /**
   * معالجة تنبيه بريدي
   */
  private async processAlertEmail(alert: AlertEmailData): Promise<void> {
    try {
      // إذا كان التنبيه موجه لجميع المستخدمين
      if (alert.target_user_ids.length === 0) {
        console.log('📧 تنبيه موجه لجميع المستخدمين - سيتم إرساله للمستخدمين النشطين');
        // يمكن إضافة منطق لإرسال التنبيه للمستخدمين النشطين
        return;
      }

      // إرسال التنبيه للمستخدمين المحددين
      for (const userId of alert.target_user_ids) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email, first_name, last_name')
          .eq('id', userId)
          .single();

        if (userError || !userData) {
          console.error('❌ خطأ في جلب بيانات المستخدم للتنبيه:', userError);
          continue;
        }

        const userName = `${userData.first_name} ${userData.last_name}`.trim();
        const userEmail = userData.email;

        console.log(`📧 إرسال تنبيه بريدي للمستخدم: ${userName} (${userEmail})`);

        await this.sendAlertNotification(userEmail, userName, alert);
      }

    } catch (error) {
      console.error('❌ خطأ في معالجة التنبيه البريدي:', error);
    }
  }

  /**
   * إرسال إشعار مشاهدة الملف الشخصي
   */
  private async sendProfileViewNotification(userEmail: string, userName: string, notification: NotificationEmailData): Promise<void> {
    const fromUser = notification.from_user;
    if (!fromUser) return;

    const fromUserName = `${fromUser.first_name} ${fromUser.last_name}`.trim();
    
    await notificationEmailService.sendProfileViewNotification(
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
  private async sendLikeNotification(userEmail: string, userName: string, notification: NotificationEmailData): Promise<void> {
    const fromUser = notification.from_user;
    if (!fromUser) return;

    const fromUserName = `${fromUser.first_name} ${fromUser.last_name}`.trim();
    
    await notificationEmailService.sendLikeNotification(
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
  private async sendMessageNotification(userEmail: string, userName: string, notification: NotificationEmailData): Promise<void> {
    const fromUser = notification.from_user;
    if (!fromUser) return;

    const fromUserName = `${fromUser.first_name} ${fromUser.last_name}`.trim();
    
    await notificationEmailService.sendNewMessageNotification(
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
  private async sendMatchNotification(userEmail: string, userName: string, notification: NotificationEmailData): Promise<void> {
    const fromUser = notification.from_user;
    if (!fromUser) return;

    const fromUserName = `${fromUser.first_name} ${fromUser.last_name}`.trim();
    
    await notificationEmailService.sendMatchNotification(
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
  private async sendReportReceivedNotification(userEmail: string, userName: string, notification: NotificationEmailData): Promise<void> {
    await notificationEmailService.sendReportReceivedNotification(
      userEmail,
      userName,
      {
        reportType: 'غير محدد', // سيتم تحديد نوع البلاغ من عنوان الإشعار أو رسالته
        timestamp: notification.created_at
      }
    );
  }

  /**
   * إرسال إشعار حالة البلاغ
   */
  private async sendReportStatusNotification(userEmail: string, userName: string, notification: NotificationEmailData): Promise<void> {
    const status = notification.type === 'report_accepted' ? 'accepted' : 'rejected';
    
    await notificationEmailService.sendReportStatusNotification(
      userEmail,
      userName,
      {
        status,
        reportType: 'غير محدد', // سيتم تحديد نوع البلاغ من عنوان الإشعار أو رسالته
        timestamp: notification.created_at
      }
    );
  }

  /**
   * إرسال إشعار حالة التوثيق
   */
  private async sendVerificationStatusNotification(userEmail: string, userName: string, notification: NotificationEmailData): Promise<void> {
    const status = notification.type === 'verification_approved' ? 'approved' : 'rejected';
    
    await notificationEmailService.sendVerificationStatusNotification(
      userEmail,
      userName,
      {
        status,
        documentType: 'غير محدد', // سيتم تحديد نوع الوثيقة من عنوان الإشعار أو رسالته
        timestamp: notification.created_at
      }
    );
  }

  /**
   * إرسال إشعار نظامي
   */
  private async sendSystemNotification(userEmail: string, userName: string, notification: NotificationEmailData): Promise<void> {
    await notificationEmailService.sendSystemNotification(
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
   * إرسال تنبيه إداري
   */
  private async sendAlertNotification(userEmail: string, userName: string, alert: AlertEmailData): Promise<void> {
    await notificationEmailService.sendAlertNotification(
      userEmail,
      userName,
      {
        title: alert.title,
        content: alert.content,
        alertType: alert.alert_type,
        priority: alert.priority,
        createdByName: alert.created_by_name,
        timestamp: alert.created_at
      }
    );
  }

  /**
   * إعادة تعيين المراقب
   */
  public reset(): void {
    this.processedNotifications.clear();
    this.processedAlerts.clear();
    this.lastNotificationCheck = new Date().toISOString();
    this.lastAlertCheck = new Date().toISOString();
    console.log('📧 تم إعادة تعيين مراقب الإشعارات البريدية');
  }

  /**
   * الحصول على حالة المراقب
   */
  public getStatus(): {
    isWatching: boolean;
    processedNotifications: number;
    processedAlerts: number;
    lastNotificationCheck: string;
    lastAlertCheck: string;
  } {
    return {
      isWatching: this.isWatching,
      processedNotifications: this.processedNotifications.size,
      processedAlerts: this.processedAlerts.size,
      lastNotificationCheck: this.lastNotificationCheck,
      lastAlertCheck: this.lastAlertCheck
    };
  }
}

// تصدير مثيل واحد
export const notificationEmailWatcher = NotificationEmailWatcher.getInstance();
export default notificationEmailWatcher;