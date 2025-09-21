import { UnifiedEmailService } from './unifiedEmailService';

/**
 * خدمة الإشعارات البريدية المباشرة
 * تتعامل مع إرسال الإيميلات للإشعارات المختلفة
 */
export class DirectNotificationEmailService {
  /**
   * إرسال إيميل إشعار حالة التوثيق
   */
  static async sendVerificationStatusNotificationEmail(
    userId: string,
    status: 'approved' | 'rejected',
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 إرسال إيميل إشعار حالة التوثيق...');
      console.log(`👤 المستخدم: ${userId}`);
      console.log(`📊 الحالة: ${status}`);

      // تحديد نوع القالب والبيانات حسب الحالة
      let templateType: 'verification_approved' | 'verification_rejected';
      let emailData: any;

      if (status === 'approved') {
        templateType = 'verification_approved';
        emailData = {
          firstName: 'المستخدم',
          notes: notes || 'تم قبول طلب التوثيق بنجاح'
        };
      } else {
        templateType = 'verification_rejected';
        emailData = {
          firstName: 'المستخدم',
          rejectionReason: notes || 'لم يتم قبول طلب التوثيق'
        };
      }

      // إرسال الإيميل باستخدام النظام الموحد
      const result = await UnifiedEmailService.sendEmail({
        to: 'user@example.com', // سيتم تحديثه لاحقاً بجلب إيميل المستخدم
        subject: status === 'approved' 
          ? 'تم قبول طلب التوثيق - رزقي'
          : 'تم رفض طلب التوثيق - رزقي',
        html: '',
        text: '',
        type: templateType
      }, templateType, 'ar');

      if (result.success) {
        console.log('✅ تم إرسال إيميل إشعار حالة التوثيق بنجاح');
        return { success: true };
      } else {
        console.error('❌ فشل في إرسال إيميل إشعار حالة التوثيق:', result.error);
        return { success: false, error: result.error };
      }

    } catch (error) {
      console.error('❌ خطأ في إرسال إيميل إشعار حالة التوثيق:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير متوقع في إرسال الإيميل'
      };
    }
  }

  /**
   * إرسال إيميل إشعار إعجاب
   */
  static async sendLikeNotificationEmail(
    userId: string,
    likedByUserId: string,
    likedByName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 إرسال إيميل إشعار إعجاب...');
      console.log(`👤 المستخدم: ${userId}`);
      console.log(`❤️ أعجب به: ${likedByName}`);

      const emailData = {
        firstName: 'المستخدم',
        likedByName: likedByName,
        profileUrl: `${typeof window !== 'undefined' ? window.location.origin : 'https://rezge.vercel.app'}/profile/${likedByUserId}`
      };

      // إرسال الإيميل باستخدام النظام الموحد
      const result = await UnifiedEmailService.sendEmail({
        to: 'user@example.com', // سيتم تحديثه لاحقاً بجلب إيميل المستخدم
        subject: `لديك إعجاب جديد من ${likedByName} - رزقي`,
        html: '',
        text: '',
        type: 'like_notification'
      }, 'like_notification', 'ar');

      if (result.success) {
        console.log('✅ تم إرسال إيميل إشعار الإعجاب بنجاح');
        return { success: true };
      } else {
        console.error('❌ فشل في إرسال إيميل إشعار الإعجاب:', result.error);
        return { success: false, error: result.error };
      }

    } catch (error) {
      console.error('❌ خطأ في إرسال إيميل إشعار الإعجاب:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير متوقع في إرسال الإيميل'
      };
    }
  }

  /**
   * إرسال إيميل إشعار رسالة جديدة
   */
  static async sendMessageNotificationEmail(
    userId: string,
    senderUserId: string,
    senderName: string,
    messagePreview: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 إرسال إيميل إشعار رسالة جديدة...');
      console.log(`👤 المستخدم: ${userId}`);
      console.log(`💬 من: ${senderName}`);

      const emailData = {
        firstName: 'المستخدم',
        senderName: senderName,
        messagePreview: messagePreview,
        chatUrl: `${typeof window !== 'undefined' ? window.location.origin : 'https://rezge.vercel.app'}/chat/${senderUserId}`
      };

      // إرسال الإيميل باستخدام النظام الموحد
      const result = await UnifiedEmailService.sendEmail({
        to: 'user@example.com', // سيتم تحديثه لاحقاً بجلب إيميل المستخدم
        subject: `رسالة جديدة من ${senderName} - رزقي`,
        html: '',
        text: '',
        type: 'message_notification'
      }, 'message_notification', 'ar');

      if (result.success) {
        console.log('✅ تم إرسال إيميل إشعار الرسالة بنجاح');
        return { success: true };
      } else {
        console.error('❌ فشل في إرسال إيميل إشعار الرسالة:', result.error);
        return { success: false, error: result.error };
      }

    } catch (error) {
      console.error('❌ خطأ في إرسال إيميل إشعار الرسالة:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير متوقع في إرسال الإيميل'
      };
    }
  }

  /**
   * إرسال إيميل إشعار تطابق جديد
   */
  static async sendMatchNotificationEmail(
    userId: string,
    matchedUserId: string,
    matchedUserName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 إرسال إيميل إشعار تطابق جديد...');
      console.log(`👤 المستخدم: ${userId}`);
      console.log(`💕 تطابق مع: ${matchedUserName}`);

      const emailData = {
        firstName: 'المستخدم',
        matchedUserName: matchedUserName,
        profileUrl: `${typeof window !== 'undefined' ? window.location.origin : 'https://rezge.vercel.app'}/profile/${matchedUserId}`
      };

      // إرسال الإيميل باستخدام النظام الموحد
      const result = await UnifiedEmailService.sendEmail({
        to: 'user@example.com', // سيتم تحديثه لاحقاً بجلب إيميل المستخدم
        subject: `تطابق جديد مع ${matchedUserName} - رزقي`,
        html: '',
        text: '',
        type: 'match_notification'
      }, 'match_notification', 'ar');

      if (result.success) {
        console.log('✅ تم إرسال إيميل إشعار التطابق بنجاح');
        return { success: true };
      } else {
        console.error('❌ فشل في إرسال إيميل إشعار التطابق:', result.error);
        return { success: false, error: result.error };
      }

    } catch (error) {
      console.error('❌ خطأ في إرسال إيميل إشعار التطابق:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير متوقع في إرسال الإيميل'
      };
    }
  }
}