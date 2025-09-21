/**
 * إعدادات أسماء المرسلين للإيميلات
 * Email Sender Configuration
 * رزقي - منصة الزواج الإسلامي الشرعي
 */

export interface EmailSenderConfig {
  name: string;
  email: string;
  replyTo?: string;
}

export class EmailSenderManager {
  private static readonly platformName = {
    ar: 'رزقي',
    en: 'Rezge'
  };

  private static readonly platformTagline = {
    ar: 'منصة الزواج الإسلامي الشرعي',
    en: 'Islamic Marriage Platform'
  };

  /**
   * الحصول على اسم المرسل حسب اللغة ونوع الإيميل
   */
  static getSenderName(emailType: string, language: 'ar' | 'en' = 'ar'): string {
    const senderNames = {
      // إيميلات التحقق والتأكيد
      verification: {
        ar: `${this.platformName.ar} | فريق التحقق`,
        en: `${this.platformName.en} | Verification Team`
      },
      
      // إيميلات الأمان والتحقق الثنائي
      security: {
        ar: `${this.platformName.ar} | فريق الأمان`,
        en: `${this.platformName.en} | Security Team`
      },
      
      // إيميلات الترحيب والاستقبال
      welcome: {
        ar: `${this.platformName.ar} | فريق الترحيب`,
        en: `${this.platformName.en} | Welcome Team`
      },
      
      // إيميلات إشعارات تسجيل الدخول
      login_notification: {
        ar: `${this.platformName.ar} | إشعارات الأمان`,
        en: `${this.platformName.en} | Security Alerts`
      },
      
      // إيميلات التواصل والدعم
      support: {
        ar: `${this.platformName.ar} | فريق الدعم`,
        en: `${this.platformName.en} | Support Team`
      },
      
      // إيميلات النظام العامة
      system: {
        ar: `${this.platformName.ar} | النظام`,
        en: `${this.platformName.en} | System`
      },
      
      // إيميلات الإدارة
      admin: {
        ar: `${this.platformName.ar} | الإدارة`,
        en: `${this.platformName.en} | Administration`
      },
      
      // إيميلات الإشعارات الجديدة
      like_notification: {
        ar: `${this.platformName.ar} | إشعارات الإعجاب`,
        en: `${this.platformName.en} | Like Notifications`
      },
      
      profile_view_notification: {
        ar: `${this.platformName.ar} | إشعارات الزيارات`,
        en: `${this.platformName.en} | Profile View Notifications`
      },
      
      new_message_notification: {
        ar: `${this.platformName.ar} | إشعارات الرسائل`,
        en: `${this.platformName.en} | Message Notifications`
      },
      
      report_notification: {
        ar: `${this.platformName.ar} | إشعارات البلاغات`,
        en: `${this.platformName.en} | Report Notifications`
      },
      
      report_status_notification: {
        ar: `${this.platformName.ar} | تحديث البلاغات`,
        en: `${this.platformName.en} | Report Updates`
      },
      
      verification_status_notification: {
        ar: `${this.platformName.ar} | تحديث التوثيق`,
        en: `${this.platformName.en} | Verification Updates`
      },
      
      ban_status_notification: {
        ar: `${this.platformName.ar} | تحديث الحساب`,
        en: `${this.platformName.en} | Account Updates`
      },
      
      admin_alert_notification: {
        ar: `${this.platformName.ar} | التنبيهات الإدارية`,
        en: `${this.platformName.en} | Admin Alerts`
      }
    };

    return senderNames[emailType]?.[language] || this.getDefaultSenderName(language);
  }

  /**
   * الحصول على اسم المرسل الافتراضي
   */
  static getDefaultSenderName(language: 'ar' | 'en' = 'ar'): string {
    return language === 'ar' 
      ? `${this.platformName.ar} | ${this.platformTagline.ar}`
      : `${this.platformName.en} | ${this.platformTagline.en}`;
  }

  /**
   * الحصول على اسم مرسل مختصر ومودرن
   */
  static getModernSenderName(emailType: string, language: 'ar' | 'en' = 'ar'): string {
    const modernNames = {
      verification: {
        ar: `${this.platformName.ar} | التحقق`,
        en: `${this.platformName.en} | Verification`
      },
      security: {
        ar: `${this.platformName.ar} | الأمان`,
        en: `${this.platformName.en} | Security`
      },
      welcome: {
        ar: `${this.platformName.ar} | الترحيب`,
        en: `${this.platformName.en} | Welcome`
      },
      login_notification: {
        ar: `${this.platformName.ar} | الأمان`,
        en: `${this.platformName.en} | Security`
      },
      support: {
        ar: `${this.platformName.ar} | الدعم`,
        en: `${this.platformName.en} | Support`
      },
      system: {
        ar: `${this.platformName.ar} | النظام`,
        en: `${this.platformName.en} | System`
      },
      admin: {
        ar: `${this.platformName.ar} | الإدارة`,
        en: `${this.platformName.en} | Admin`
      },
      
      // إيميلات الإشعارات الجديدة
      like_notification: {
        ar: `${this.platformName.ar} | الإعجاب`,
        en: `${this.platformName.en} | Likes`
      },
      
      profile_view_notification: {
        ar: `${this.platformName.ar} | الزيارات`,
        en: `${this.platformName.en} | Views`
      },
      
      new_message_notification: {
        ar: `${this.platformName.ar} | الرسائل`,
        en: `${this.platformName.en} | Messages`
      },
      
      report_notification: {
        ar: `${this.platformName.ar} | البلاغات`,
        en: `${this.platformName.en} | Reports`
      },
      
      report_status_notification: {
        ar: `${this.platformName.ar} | تحديث البلاغات`,
        en: `${this.platformName.en} | Report Updates`
      },
      
      verification_status_notification: {
        ar: `${this.platformName.ar} | التوثيق`,
        en: `${this.platformName.en} | Verification`
      },
      
      ban_status_notification: {
        ar: `${this.platformName.ar} | الحساب`,
        en: `${this.platformName.en} | Account`
      },
      
      admin_alert_notification: {
        ar: `${this.platformName.ar} | التنبيهات`,
        en: `${this.platformName.en} | Alerts`
      }
    };

    return modernNames[emailType]?.[language] || this.getDefaultModernSenderName(language);
  }

  /**
   * الحصول على اسم مرسل افتراضي مختصر
   */
  static getDefaultModernSenderName(language: 'ar' | 'en' = 'ar'): string {
    return language === 'ar' 
      ? `${this.platformName.ar} | ${this.platformTagline.ar}`
      : `${this.platformName.en} | ${this.platformTagline.en}`;
  }

  /**
   * الحصول على اسم مرسل احترافي
   */
  static getProfessionalSenderName(emailType: string, language: 'ar' | 'en' = 'ar'): string {
    const professionalNames = {
      verification: {
        ar: `فريق التحقق | ${this.platformName.ar}`,
        en: `Verification Team | ${this.platformName.en}`
      },
      security: {
        ar: `فريق الأمان | ${this.platformName.ar}`,
        en: `Security Team | ${this.platformName.en}`
      },
      welcome: {
        ar: `فريق الترحيب | ${this.platformName.ar}`,
        en: `Welcome Team | ${this.platformName.en}`
      },
      login_notification: {
        ar: `إشعارات الأمان | ${this.platformName.ar}`,
        en: `Security Alerts | ${this.platformName.en}`
      },
      support: {
        ar: `فريق الدعم الفني | ${this.platformName.ar}`,
        en: `Technical Support | ${this.platformName.en}`
      },
      system: {
        ar: `نظام الإشعارات | ${this.platformName.ar}`,
        en: `Notification System | ${this.platformName.en}`
      },
      admin: {
        ar: `إدارة المنصة | ${this.platformName.ar}`,
        en: `Platform Administration | ${this.platformName.en}`
      },
      
      // إيميلات الإشعارات الجديدة
      like_notification: {
        ar: `إشعارات الإعجاب | ${this.platformName.ar}`,
        en: `Like Notifications | ${this.platformName.en}`
      },
      
      profile_view_notification: {
        ar: `إشعارات الزيارات | ${this.platformName.ar}`,
        en: `Profile View Notifications | ${this.platformName.en}`
      },
      
      new_message_notification: {
        ar: `إشعارات الرسائل | ${this.platformName.ar}`,
        en: `Message Notifications | ${this.platformName.en}`
      },
      
      report_notification: {
        ar: `إشعارات البلاغات | ${this.platformName.ar}`,
        en: `Report Notifications | ${this.platformName.en}`
      },
      
      report_status_notification: {
        ar: `تحديث البلاغات | ${this.platformName.ar}`,
        en: `Report Updates | ${this.platformName.en}`
      },
      
      verification_status_notification: {
        ar: `تحديث التوثيق | ${this.platformName.ar}`,
        en: `Verification Updates | ${this.platformName.en}`
      },
      
      ban_status_notification: {
        ar: `تحديث الحساب | ${this.platformName.ar}`,
        en: `Account Updates | ${this.platformName.en}`
      },
      
      admin_alert_notification: {
        ar: `التنبيهات الإدارية | ${this.platformName.ar}`,
        en: `Admin Alerts | ${this.platformName.en}`
      }
    };

    return professionalNames[emailType]?.[language] || this.getDefaultProfessionalSenderName(language);
  }

  /**
   * الحصول على اسم مرسل افتراضي احترافي
   */
  static getDefaultProfessionalSenderName(language: 'ar' | 'en' = 'ar'): string {
    return language === 'ar' 
      ? `فريق ${this.platformName.ar} | ${this.platformTagline.ar}`
      : `${this.platformName.en} Team | ${this.platformTagline.en}`;
  }

  /**
   * الحصول على اسم مرسل بسيط ونظيف
   */
  static getCleanSenderName(emailType: string, language: 'ar' | 'en' = 'ar'): string {
    const cleanNames = {
      verification: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      security: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      welcome: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      login_notification: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      support: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      system: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      admin: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      
      // إيميلات الإشعارات الجديدة
      like_notification: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      
      profile_view_notification: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      
      new_message_notification: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      
      report_notification: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      
      report_status_notification: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      
      verification_status_notification: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      
      ban_status_notification: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      },
      
      admin_alert_notification: {
        ar: `${this.platformName.ar}`,
        en: `${this.platformName.en}`
      }
    };

    return cleanNames[emailType]?.[language] || this.platformName[language];
  }

  /**
   * الحصول على إعدادات المرسل الكاملة
   */
  static getSenderConfig(emailType: string, language: 'ar' | 'en' = 'ar', style: 'default' | 'modern' | 'professional' | 'clean' = 'modern'): EmailSenderConfig {
    let senderName: string;
    
    switch (style) {
      case 'modern':
        senderName = this.getModernSenderName(emailType, language);
        break;
      case 'professional':
        senderName = this.getProfessionalSenderName(emailType, language);
        break;
      case 'clean':
        senderName = this.getCleanSenderName(emailType, language);
        break;
      default:
        senderName = this.getSenderName(emailType, language);
    }

    return {
      name: senderName,
      email: 'noreply@rezge.com',
      replyTo: 'support@rezge.com'
    };
  }

  /**
   * الحصول على اسم المرسل مع إيموجي (للإصدارات المزخرفة)
   */
  static getEmojiSenderName(emailType: string, language: 'ar' | 'en' = 'ar'): string {
    const emojiNames = {
      verification: {
        ar: `🔐 ${this.platformName.ar}`,
        en: `🔐 ${this.platformName.en}`
      },
      security: {
        ar: `🛡️ ${this.platformName.ar}`,
        en: `🛡️ ${this.platformName.en}`
      },
      welcome: {
        ar: `🎉 ${this.platformName.ar}`,
        en: `🎉 ${this.platformName.en}`
      },
      login_notification: {
        ar: `✅ ${this.platformName.ar}`,
        en: `✅ ${this.platformName.en}`
      },
      support: {
        ar: `💬 ${this.platformName.ar}`,
        en: `💬 ${this.platformName.en}`
      },
      system: {
        ar: `🔔 ${this.platformName.ar}`,
        en: `🔔 ${this.platformName.en}`
      },
      admin: {
        ar: `👨‍💼 ${this.platformName.ar}`,
        en: `👨‍💼 ${this.platformName.en}`
      },
      
      // إيميلات الإشعارات الجديدة
      like_notification: {
        ar: `💖 ${this.platformName.ar}`,
        en: `💖 ${this.platformName.en}`
      },
      
      profile_view_notification: {
        ar: `👀 ${this.platformName.ar}`,
        en: `👀 ${this.platformName.en}`
      },
      
      new_message_notification: {
        ar: `💬 ${this.platformName.ar}`,
        en: `💬 ${this.platformName.en}`
      },
      
      report_notification: {
        ar: `⚠️ ${this.platformName.ar}`,
        en: `⚠️ ${this.platformName.en}`
      },
      
      report_status_notification: {
        ar: `📋 ${this.platformName.ar}`,
        en: `📋 ${this.platformName.en}`
      },
      
      verification_status_notification: {
        ar: `✅ ${this.platformName.ar}`,
        en: `✅ ${this.platformName.en}`
      },
      
      ban_status_notification: {
        ar: `🚫 ${this.platformName.ar}`,
        en: `🚫 ${this.platformName.en}`
      },
      
      admin_alert_notification: {
        ar: `📢 ${this.platformName.ar}`,
        en: `📢 ${this.platformName.en}`
      }
    };

    return emojiNames[emailType]?.[language] || this.platformName[language];
  }
}

export default EmailSenderManager;






