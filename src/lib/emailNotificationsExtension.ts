// إضافات نظام الإشعارات البريدية - رزقي
// إيميلات إضافية للعمليات المفقودة

import { UnifiedEmailService } from './unifiedEmailService';
import { createUnifiedEmailTemplate, EmailTemplates } from './unifiedEmailTemplate';

export interface EmailResult {
  success: boolean;
  error?: string;
  method?: string;
  messageId?: string;
}

export class EmailNotificationsExtension {
  private static readonly fromEmail = 'manage@kareemamged.com';
  private static readonly fromName = 'رزقي - موقع الزواج الإسلامي';

  /**
   * إرسال إيميل ترحيب للمستخدمين الجدد بعد إنشاء الحساب
   */
  static async sendWelcomeEmailAfterRegistration(
    email: string,
    userData: { first_name: string; last_name: string }
  ): Promise<EmailResult> {
    console.log('📧 إرسال إيميل ترحيب للمستخدم الجديد...');

    const templateData = EmailTemplates.welcome(userData.first_name, userData.last_name);
    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await UnifiedEmailService.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'welcome_after_registration'
    });
  }

  /**
   * إرسال إيميل تأكيد تغيير كلمة المرور
   */
  static async sendPasswordChangeConfirmation(
    email: string,
    userData: { first_name: string; last_name: string },
    changeDetails: {
      timestamp: string;
      ipAddress?: string;
      deviceType?: string;
      browser?: string;
    }
  ): Promise<EmailResult> {
    console.log('📧 إرسال تأكيد تغيير كلمة المرور...');

    const templateData = {
      title: 'تأكيد تغيير كلمة المرور - رزقي',
      greeting: `السلام عليكم ${userData.first_name}،`,
      mainContent: `تم تغيير كلمة المرور الخاصة بحسابك في موقع رزقي بنجاح في ${changeDetails.timestamp}. إذا لم تكن أنت من قام بتغيير كلمة المرور، يرجى التواصل معنا فوراً.`,
      warning: 'لحماية حسابك، تأكد من تسجيل الخروج من جميع الأجهزة غير الموثوقة وتغيير كلمة المرور مرة أخرى.',
      footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
    };

    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await UnifiedEmailService.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'password_change_confirmation'
    });
  }

  /**
   * إرسال إيميل تأكيد تحديث الملف الشخصي
   */
  static async sendProfileUpdateConfirmation(
    email: string,
    userData: { first_name: string; last_name: string },
    updatedFields: string[]
  ): Promise<EmailResult> {
    console.log('📧 إرسال تأكيد تحديث الملف الشخصي...');

    const fieldsText = updatedFields.join('، ');

    const templateData = {
      title: 'تأكيد تحديث الملف الشخصي - رزقي',
      greeting: `السلام عليكم ${userData.first_name}،`,
      mainContent: `تم تحديث الملف الشخصي الخاص بك في موقع رزقي بنجاح. الحقول المحدثة: ${fieldsText}.`,
      actionButton: {
        text: 'عرض الملف الشخصي',
        url: 'https://rezgee.vercel.app/profile'
      },
      warning: 'إذا لم تكن أنت من قام بتحديث الملف الشخصي، يرجى التواصل معنا فوراً.',
      footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
    };

    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await UnifiedEmailService.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'profile_update_confirmation'
    });
  }

  /**
   * إرسال إيميل إشعار رسالة جديدة
   */
  static async sendNewMessageNotification(
    email: string,
    userData: { first_name: string; last_name: string },
    messageData: {
      senderName: string;
      messagePreview: string;
      timestamp: string;
    }
  ): Promise<EmailResult> {
    console.log('📧 إرسال إشعار رسالة جديدة...');

    const templateData = {
      title: 'رسالة جديدة - رزقي',
      greeting: `السلام عليكم ${userData.first_name}،`,
      mainContent: `لديك رسالة جديدة من ${messageData.senderName} في موقع رزقي. معاينة الرسالة: "${messageData.messagePreview}"`,
      actionButton: {
        text: 'قراءة الرسالة',
        url: 'https://rezgee.vercel.app/messages'
      },
      warning: 'هذا إشعار تلقائي للرسائل الجديدة. يمكنك إيقاف هذه الإشعارات من إعدادات الحساب.',
      footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
    };

    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await UnifiedEmailService.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'new_message_notification'
    });
  }

  /**
   * إرسال إيميل إشعار إعجاب جديد
   */
  static async sendLikeNotification(
    email: string,
    userData: { first_name: string; last_name: string },
    likeData: {
      likerName: string;
      timestamp: string;
    }
  ): Promise<EmailResult> {
    console.log('📧 إرسال إشعار إعجاب جديد...');

    const templateData = {
      title: 'إعجاب جديد - رزقي',
      greeting: `السلام عليكم ${userData.first_name}،`,
      mainContent: `أعجب بك ${likeData.likerName} في موقع رزقي! هذا يعني أن هناك شخصاً مهتماً بالتعرف عليك.`,
      actionButton: {
        text: 'عرض الملف الشخصي',
        url: 'https://rezgee.vercel.app/profile'
      },
      warning: 'يمكنك إيقاف هذه الإشعارات من إعدادات الخصوصية في حسابك.',
      footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
    };

    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await UnifiedEmailService.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'like_notification'
    });
  }

  /**
   * إرسال إيميل إشعار مطابقة جديدة
   */
  static async sendMatchNotification(
    email: string,
    userData: { first_name: string; last_name: string },
    matchData: {
      matchName: string;
      timestamp: string;
    }
  ): Promise<EmailResult> {
    console.log('📧 إرسال إشعار مطابقة جديدة...');

    const templateData = {
      title: 'مطابقة جديدة - رزقي',
      greeting: `السلام عليكم ${userData.first_name}،`,
      mainContent: `تهانينا! لديك مطابقة جديدة مع ${matchData.matchName} في موقع رزقي. هذا يعني أن كلاكما أعجب ببعضكما البعض.`,
      actionButton: {
        text: 'بدء المحادثة',
        url: 'https://rezgee.vercel.app/messages'
      },
      warning: 'تذكر أن تلتزم بالقيم الإسلامية في المحادثة والتفاعل.',
      footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
    };

    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await UnifiedEmailService.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'match_notification'
    });
  }

  /**
   * إرسال إيميل تأكيد حذف الحساب
   */
  static async sendAccountDeletionConfirmation(
    email: string,
    userData: { first_name: string; last_name: string },
    deletionDetails: {
      timestamp: string;
      reason?: string;
    }
  ): Promise<EmailResult> {
    console.log('📧 إرسال تأكيد حذف الحساب...');

    const templateData = {
      title: 'تأكيد حذف الحساب - رزقي',
      greeting: `السلام عليكم ${userData.first_name}،`,
      mainContent: `تم حذف حسابك من موقع رزقي بنجاح في ${deletionDetails.timestamp}. جميع بياناتك الشخصية تم حذفها نهائياً من نظامنا.`,
      warning: 'إذا لم تكن أنت من قام بحذف الحساب، يرجى التواصل معنا فوراً على contact@kareemamged.com',
      footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
    };

    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await UnifiedEmailService.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'account_deletion_confirmation'
    });
  }

  /**
   * إرسال إيميل إشعار تعطيل المصادقة الثنائية
   */
  static async send2FADisabledNotification(
    email: string,
    userData: { first_name: string; last_name: string },
    disableDetails: {
      timestamp: string;
      ipAddress?: string;
    }
  ): Promise<EmailResult> {
    console.log('📧 إرسال إشعار تعطيل المصادقة الثنائية...');

    const templateData = {
      title: 'تعطيل المصادقة الثنائية - رزقي',
      greeting: `السلام عليكم ${userData.first_name}،`,
      mainContent: `تم تعطيل المصادقة الثنائية لحسابك في موقع رزقي في ${disableDetails.timestamp}. حسابك الآن أقل حماية من ذي قبل.`,
      actionButton: {
        text: 'إعادة تفعيل المصادقة الثنائية',
        url: 'https://rezgee.vercel.app/security-settings'
      },
      warning: 'إذا لم تكن أنت من قام بتعطيل المصادقة الثنائية، يرجى تغيير كلمة المرور فوراً وإعادة تفعيلها.',
      footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
    };

    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await UnifiedEmailService.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: '2fa_disabled_notification'
    });
  }

  /**
   * إرسال إيميل إشعار فشل تسجيل الدخول
   */
  static async sendFailedLoginNotification(
    email: string,
    userData: { first_name: string; last_name: string },
    loginDetails: {
      timestamp: string;
      ipAddress?: string;
      attemptsCount: number;
    }
  ): Promise<EmailResult> {
    console.log('📧 إرسال إشعار فشل تسجيل الدخول...');

    const templateData = {
      title: 'محاولة تسجيل دخول فاشلة - رزقي',
      greeting: `السلام عليكم ${userData.first_name}،`,
      mainContent: `تم رصد محاولة تسجيل دخول فاشلة لحسابك في موقع رزقي في ${loginDetails.timestamp}. عدد المحاولات الفاشلة: ${loginDetails.attemptsCount}`,
      actionButton: {
        text: 'تغيير كلمة المرور',
        url: 'https://rezgee.vercel.app/security-settings'
      },
      warning: 'إذا لم تكن أنت من حاول تسجيل الدخول، يرجى تغيير كلمة المرور فوراً وتفعيل المصادقة الثنائية.',
      footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
    };

    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await UnifiedEmailService.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'failed_login_notification'
    });
  }

  /**
   * إرسال إيميل إشعار إداري (حظر/إلغاء حظر/تحذير)
   */
  static async sendAdminActionNotification(
    email: string,
    userData: { first_name: string; last_name: string },
    adminAction: {
      actionType: 'ban' | 'unban' | 'warning' | 'suspension';
      reason: string;
      duration?: string;
      timestamp: string;
    }
  ): Promise<EmailResult> {
    console.log('📧 إرسال إشعار إجراء إداري...');

    const actionTexts = {
      ban: 'حظر',
      unban: 'إلغاء حظر',
      warning: 'تحذير',
      suspension: 'تعليق مؤقت'
    };

    const templateData = {
      title: `إشعار إداري - ${actionTexts[adminAction.actionType]} - رزقي`,
      greeting: `السلام عليكم ${userData.first_name}،`,
      mainContent: `تم اتخاذ إجراء إداري على حسابك في موقع رزقي: ${actionTexts[adminAction.actionType]}. السبب: ${adminAction.reason}`,
      warning: adminAction.duration ? `مدة الإجراء: ${adminAction.duration}` : 'يرجى مراجعة شروط الاستخدام والتزامك بها.',
      footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
    };

    const { html, text, subject } = createUnifiedEmailTemplate(templateData);

    return await UnifiedEmailService.sendEmail({
      to: email,
      subject,
      html,
      text,
      type: 'admin_action_notification'
    });
  }

  /**
   * اختبار جميع الإيميلات الجديدة
   */
  static async testAllNewEmails(email: string = 'kemooamegoo@gmail.com'): Promise<EmailResult[]> {
    console.log('🧪 اختبار جميع الإيميلات الجديدة...');

    const testUserData = { first_name: 'مستخدم', last_name: 'الاختبار' };
    const testResults: EmailResult[] = [];

    // اختبار إيميل الترحيب
    testResults.push(await this.sendWelcomeEmailAfterRegistration(email, testUserData));

    // اختبار تأكيد تغيير كلمة المرور
    testResults.push(await this.sendPasswordChangeConfirmation(email, testUserData, {
      timestamp: new Date().toLocaleString('ar-SA'),
      ipAddress: '192.168.1.1',
      deviceType: 'Desktop',
      browser: 'Chrome'
    }));

    // اختبار تأكيد تحديث الملف الشخصي
    testResults.push(await this.sendProfileUpdateConfirmation(email, testUserData, ['الاسم', 'العمر', 'المدينة']));

    // اختبار إشعار رسالة جديدة
    testResults.push(await this.sendNewMessageNotification(email, testUserData, {
      senderName: 'مستخدم آخر',
      messagePreview: 'مرحباً، كيف حالك؟',
      timestamp: new Date().toLocaleString('ar-SA')
    }));

    // اختبار إشعار إعجاب جديد
    testResults.push(await this.sendLikeNotification(email, testUserData, {
      likerName: 'مستخدم آخر',
      timestamp: new Date().toLocaleString('ar-SA')
    }));

    // اختبار إشعار مطابقة جديدة
    testResults.push(await this.sendMatchNotification(email, testUserData, {
      matchName: 'مستخدم آخر',
      timestamp: new Date().toLocaleString('ar-SA')
    }));

    console.log('✅ انتهى اختبار جميع الإيميلات الجديدة');
    return testResults;
  }
}

export default EmailNotificationsExtension;
