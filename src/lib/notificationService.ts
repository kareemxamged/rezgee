import { supabase } from './supabase';

export interface Notification {
  id: string;
  type: 'profile_view' | 'like' | 'message' | 'match' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  fromUser?: {
    id: string;
    name: string;
    city?: string;
    age?: number;
  };
}

class NotificationService {
  /**
   * جلب الإشعارات للمستخدم من قاعدة البيانات
   */
  async getUserNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    try {
      // جلب الإشعارات من قاعدة البيانات
      const { data: dbNotifications, error } = await supabase
        .from('notifications')
        .select(`
          id,
          type,
          title,
          message,
          action_url,
          action_text,
          is_read,
          created_at,
          from_user:from_user_id(
            id,
            first_name,
            last_name,
            city,
            age
          )
        `)
        .eq('user_id', userId)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching notifications from database:', error);
        // في حالة فشل جلب الإشعارات من قاعدة البيانات، نستخدم الطريقة القديمة
        return this.getLegacyNotifications(userId, limit);
      }

      console.log('Fetched notifications from database:', dbNotifications?.length || 0);

      const notifications: Notification[] = [];

      if (dbNotifications) {
        for (const notification of dbNotifications) {
          notifications.push({
            id: notification.id,
            type: notification.type as Notification['type'],
            title: notification.title,
            message: notification.message,
            timestamp: notification.created_at,
            isRead: notification.is_read,
            actionUrl: notification.action_url,
            actionText: notification.action_text,
            fromUser: notification.from_user ? {
              id: (notification.from_user as any).id,
              name: `${(notification.from_user as any).first_name} ${(notification.from_user as any).last_name}`,
              city: (notification.from_user as any).city,
              age: (notification.from_user as any).age
            } : undefined
          });
        }
      }

      return notifications;

    } catch (error) {
      console.error('Error fetching notifications:', error);
      // في حالة حدوث خطأ، نستخدم الطريقة القديمة
      return this.getLegacyNotifications(userId, limit);
    }
  }

  /**
   * جلب الإشعارات بالطريقة القديمة (احتياطي)
   */
  private async getLegacyNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    try {
      const notifications: Notification[] = [];

      // جلب مشاهدات الملف الشخصي الحديثة
      const { data: recentViews } = await supabase
        .from('profile_views')
        .select('id, created_at, viewer_id')
        .eq('viewed_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentViews) {
        for (const view of recentViews) {
          const { data: viewer } = await supabase
            .from('users')
            .select('id, first_name, last_name, city, age')
            .eq('id', view.viewer_id)
            .single();

          if (viewer) {
            notifications.push({
              id: `view_${view.id}`,
              type: 'profile_view',
              title: 'notifications.content.profileView.title',
              message: 'notifications.content.profileView.message',
              timestamp: view.created_at,
              isRead: this.isNotificationRead(`view_${view.id}`),
              actionUrl: `/profile/${viewer.id}`,
              actionText: 'notifications.content.profileView.actionText',
              fromUser: {
                id: viewer.id,
                name: `${viewer.first_name} ${viewer.last_name}`,
                city: viewer.city,
                age: viewer.age
              }
            });
          }
        }
      }

      // جلب الإعجابات الحديثة
      const { data: recentLikes } = await supabase
        .from('user_likes')
        .select('id, created_at, liker_id')
        .eq('liked_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentLikes) {
        for (const like of recentLikes) {
          const { data: liker } = await supabase
            .from('users')
            .select('id, first_name, last_name, city, age')
            .eq('id', like.liker_id)
            .single();

          if (liker) {
            notifications.push({
              id: `like_${like.id}`,
              type: 'like',
              title: 'notifications.content.like.title',
              message: 'notifications.content.like.message',
              timestamp: like.created_at,
              isRead: this.isNotificationRead(`like_${like.id}`),
              actionUrl: `/profile/${liker.id}`,
              actionText: 'notifications.content.like.actionText',
              fromUser: {
                id: liker.id,
                name: `${liker.first_name} ${liker.last_name}`,
                city: liker.city,
                age: liker.age
              }
            });
          }
        }
      }

      // جلب الرسائل الحديثة (مؤقت - يمكن تحسينه لاحقاً)
      try {
        const { data: recentMessages } = await supabase
          .from('messages')
          .select('id, created_at, sender_id, content')
          .eq('receiver_id', userId)
          .order('created_at', { ascending: false })
          .limit(3);

        if (recentMessages) {
          for (const message of recentMessages) {
            const { data: sender } = await supabase
              .from('users')
              .select('id, first_name, last_name, city, age')
              .eq('id', message.sender_id)
              .single();

            if (sender) {
              notifications.push({
                id: `message_${message.id}`,
                type: 'message',
                title: 'notifications.content.message.title',
                message: 'notifications.content.message.message',
                timestamp: message.created_at,
                isRead: this.isNotificationRead(`message_${message.id}`),
                actionUrl: `/messages`,
                actionText: 'notifications.content.message.actionText',
                fromUser: {
                  id: sender.id,
                  name: `${sender.first_name} ${sender.last_name}`,
                  city: sender.city,
                  age: sender.age
                }
              });
            }
          }
        }
      } catch (error) {
        console.warn('Messages table not found or error fetching messages:', error);
      }

      // ترتيب الإشعارات حسب التاريخ
      notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return notifications.slice(0, limit);

    } catch (error) {
      console.error('Error fetching legacy notifications:', error);
      return [];
    }
  }



  /**
   * وضع علامة مقروء على إشعار
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      // محاولة تحديث قاعدة البيانات أولاً
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.warn('Failed to update notification in database, using localStorage:', error);
        // في حالة فشل قاعدة البيانات، نستخدم localStorage
        const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
        if (!readNotifications.includes(notificationId)) {
          readNotifications.push(notificationId);
          localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // استخدام localStorage كبديل
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      if (!readNotifications.includes(notificationId)) {
        readNotifications.push(notificationId);
        localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
      }
    }
  }

  /**
   * التحقق من حالة القراءة (للإشعارات القديمة)
   */
  isNotificationRead(notificationId: string): boolean {
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    return readNotifications.includes(notificationId);
  }

  /**
   * حذف إشعار
   */
  async dismissNotification(notificationId: string): Promise<void> {
    try {
      // محاولة تحديث قاعدة البيانات أولاً
      const { error } = await supabase
        .from('notifications')
        .update({ is_dismissed: true })
        .eq('id', notificationId);

      if (error) {
        console.warn('Failed to dismiss notification in database, using localStorage:', error);
        // في حالة فشل قاعدة البيانات، نستخدم localStorage
        const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
        if (!dismissedNotifications.includes(notificationId)) {
          dismissedNotifications.push(notificationId);
          localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedNotifications));
        }
      }
    } catch (error) {
      console.error('Error dismissing notification:', error);
      // استخدام localStorage كبديل
      const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
      if (!dismissedNotifications.includes(notificationId)) {
        dismissedNotifications.push(notificationId);
        localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedNotifications));
      }
    }
  }

  /**
   * التحقق من حالة الحذف (للإشعارات القديمة)
   */
  isNotificationDismissed(notificationId: string): boolean {
    const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
    return dismissedNotifications.includes(notificationId);
  }

  /**
   * وضع علامة مقروء على جميع الإشعارات
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }
}

export const notificationService = new NotificationService();
