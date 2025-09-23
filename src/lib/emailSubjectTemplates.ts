/**
 * قوالب عناوين الإيميلات الثنائية اللغة
 * Email Subject Templates - Bilingual
 * رزقي - منصة الزواج الإسلامي الشرعي
 */

export interface EmailSubjectData {
  firstName?: string;
  lastName?: string;
  code?: string;
  action?: string;
  platform?: string;
  [key: string]: any;
}

export class EmailSubjectTemplates {
  private static readonly platformName = {
    ar: 'رزقي',
    en: 'Rezge'
  };

  private static readonly platformTagline = {
    ar: 'منصة الزواج الإسلامي الشرعي',
    en: 'Islamic Marriage Platform'
  };

  /**
   * إنشاء عنوان إيميل التحقق من الحساب الجديد
   */
  static createVerificationSubject(data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    const templates = {
      ar: `🔐 تأكيد حسابك في ${this.platformName.ar}`,
      en: `🔐 Confirm Your ${this.platformName.en} Account`
    };
    return templates[language];
  }

  /**
   * إنشاء عنوان إيميل كلمة المرور المؤقتة
   */
  static createTemporaryPasswordSubject(data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    const templates = {
      ar: `🔑 كلمة مرور مؤقتة - ${this.platformName.ar}`,
      en: `🔑 Temporary Password - ${this.platformName.en}`
    };
    return templates[language];
  }

  /**
   * إنشاء عنوان إيميل رمز التحقق الثنائي
   */
  static create2FASubject(data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    const action = data.action || 'login';
    const templates = {
      ar: {
        login: `🔒 رمز التحقق - ${this.platformName.ar}`,
        enable: `✅ تفعيل التحقق الثنائي - ${this.platformName.ar}`,
        disable: `❌ إلغاء التحقق الثنائي - ${this.platformName.ar}`,
        admin: `👨‍💼 رمز التحقق للمشرف - ${this.platformName.ar}`,
        security: `🛡️ رمز التحقق للأمان - ${this.platformName.ar}`
      },
      en: {
        login: `🔒 Verification Code - ${this.platformName.en}`,
        enable: `✅ Enable Two-Factor Auth - ${this.platformName.en}`,
        disable: `❌ Disable Two-Factor Auth - ${this.platformName.en}`,
        admin: `👨‍💼 Admin Verification Code - ${this.platformName.en}`,
        security: `🛡️ Security Verification Code - ${this.platformName.en}`
      }
    };
    return templates[language][action] || templates[language].login;
  }

  /**
   * إنشاء عنوان إيميل تأكيد تغيير بيانات التواصل
   */
  static createContactChangeSubject(data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    const templates = {
      ar: `📧 تأكيد تغيير بيانات التواصل - ${this.platformName.ar}`,
      en: `📧 Confirm Contact Information Change - ${this.platformName.en}`
    };
    return templates[language];
  }

  /**
   * إنشاء عنوان إيميل إشعار تسجيل الدخول الناجح
   */
  static createLoginNotificationSubject(data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    const templates = {
      ar: `✅ تسجيل دخول ناجح - ${this.platformName.ar}`,
      en: `✅ Successful Login - ${this.platformName.en}`
    };
    return templates[language];
  }

  /**
   * إنشاء عنوان إيميل الترحيب
   */
  static createWelcomeSubject(data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    const name = data.firstName ? ` ${data.firstName}` : '';
    const templates = {
      ar: `🎉 مرحباً${name} في ${this.platformName.ar}!`,
      en: `🎉 Welcome${name} to ${this.platformName.en}!`
    };
    return templates[language];
  }

  /**
   * إنشاء عنوان إيميل رسالة التواصل
   */
  static createContactMessageSubject(data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    const templates = {
      ar: `📬 رسالة جديدة من ${this.platformName.ar}`,
      en: `📬 New Message from ${this.platformName.en}`
    };
    return templates[language];
  }

  /**
   * إنشاء عنوان إيميل إشعار الأمان
   */
  static createSecurityNotificationSubject(data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    const action = data.action || 'security';
    const templates = {
      ar: {
        security: `🛡️ إشعار أمني - ${this.platformName.ar}`,
        password_change: `🔐 تغيير كلمة المرور - ${this.platformName.ar}`,
        account_locked: `🚫 قفل الحساب - ${this.platformName.ar}`,
        suspicious_activity: `⚠️ نشاط مشبوه - ${this.platformName.ar}`
      },
      en: {
        security: `🛡️ Security Notification - ${this.platformName.en}`,
        password_change: `🔐 Password Changed - ${this.platformName.en}`,
        account_locked: `🚫 Account Locked - ${this.platformName.en}`,
        suspicious_activity: `⚠️ Suspicious Activity - ${this.platformName.en}`
      }
    };
    return templates[language][action] || templates[language].security;
  }

  /**
   * إنشاء عنوان إيميل إشعار النظام
   */
  static createSystemNotificationSubject(data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    const templates = {
      ar: `🔔 إشعار من ${this.platformName.ar}`,
      en: `🔔 Notification from ${this.platformName.en}`
    };
    return templates[language];
  }

  /**
   * إنشاء عنوان إيميل مخصص
   */
  static createCustomSubject(template: string, data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    // استبدال المتغيرات في القالب
    let subject = template;
    
    // استبدال المتغيرات الأساسية
    subject = subject.replace(/\{\{firstName\}\}/g, data.firstName || '');
    subject = subject.replace(/\{\{lastName\}\}/g, data.lastName || '');
    subject = subject.replace(/\{\{code\}\}/g, data.code || '');
    subject = subject.replace(/\{\{action\}\}/g, data.action || '');
    subject = subject.replace(/\{\{platform\}\}/g, this.platformName[language]);
    subject = subject.replace(/\{\{tagline\}\}/g, this.platformTagline[language]);
    
    return subject;
  }

  /**
   * إنشاء عنوان إيميل بدون إيموجيز (للإصدارات النظيفة)
   */
  static createCleanSubject(type: string, data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    const cleanTemplates = {
      verification: {
        ar: `تأكيد حسابك في ${this.platformName.ar}`,
        en: `Confirm Your ${this.platformName.en} Account`
      },
      temporary_password: {
        ar: `كلمة مرور مؤقتة - ${this.platformName.ar}`,
        en: `Temporary Password - ${this.platformName.en}`
      },
      two_factor: {
        ar: `رمز التحقق - ${this.platformName.ar}`,
        en: `Verification Code - ${this.platformName.en}`
      },
      contact_change: {
        ar: `تأكيد تغيير بيانات التواصل - ${this.platformName.ar}`,
        en: `Confirm Contact Information Change - ${this.platformName.en}`
      },
      login_notification: {
        ar: `تسجيل دخول ناجح - ${this.platformName.ar}`,
        en: `Successful Login - ${this.platformName.en}`
      },
      welcome: {
        ar: `مرحباً في ${this.platformName.ar}!`,
        en: `Welcome to ${this.platformName.en}!`
      },
      contact_message: {
        ar: `رسالة جديدة من ${this.platformName.ar}`,
        en: `New Message from ${this.platformName.en}`
      },
      security_notification: {
        ar: `إشعار أمني - ${this.platformName.ar}`,
        en: `Security Notification - ${this.platformName.en}`
      }
    };

    return cleanTemplates[type]?.[language] || `${this.platformName[language]} - ${this.platformTagline[language]}`;
  }

  /**
   * إنشاء عنوان إيميل مختصر ومودرن
   */
  static createModernSubject(type: string, data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    const modernTemplates = {
      verification: {
        ar: `${this.platformName.ar} | تأكيد الحساب`,
        en: `${this.platformName.en} | Account Confirmation`
      },
      temporary_password: {
        ar: `${this.platformName.ar} | كلمة مرور مؤقتة`,
        en: `${this.platformName.en} | Temporary Password`
      },
      two_factor: {
        ar: `${this.platformName.ar} | رمز التحقق`,
        en: `${this.platformName.en} | Verification Code`
      },
      contact_change: {
        ar: `${this.platformName.ar} | تأكيد التحديث`,
        en: `${this.platformName.en} | Confirm Update`
      },
      login_notification: {
        ar: `${this.platformName.ar} | تسجيل دخول`,
        en: `${this.platformName.en} | Login Alert`
      },
      welcome: {
        ar: `${this.platformName.ar} | مرحباً بك`,
        en: `${this.platformName.en} | Welcome`
      },
      contact_message: {
        ar: `${this.platformName.ar} | رسالة جديدة`,
        en: `${this.platformName.en} | New Message`
      },
      security_notification: {
        ar: `${this.platformName.ar} | إشعار أمني`,
        en: `${this.platformName.en} | Security Alert`
      }
    };

    return modernTemplates[type]?.[language] || `${this.platformName[language]} | ${this.platformTagline[language]}`;
  }

  /**
   * إنشاء عنوان إيميل احترافي
   */
  static createProfessionalSubject(type: string, data: EmailSubjectData, language: 'ar' | 'en' = 'ar'): string {
    const professionalTemplates = {
      verification: {
        ar: `طلب تأكيد الحساب - ${this.platformName.ar}`,
        en: `Account Verification Request - ${this.platformName.en}`
      },
      temporary_password: {
        ar: `كلمة مرور مؤقتة للحساب - ${this.platformName.ar}`,
        en: `Account Temporary Password - ${this.platformName.en}`
      },
      two_factor: {
        ar: `رمز المصادقة الثنائية - ${this.platformName.ar}`,
        en: `Two-Factor Authentication Code - ${this.platformName.en}`
      },
      contact_change: {
        ar: `طلب تأكيد تحديث البيانات - ${this.platformName.ar}`,
        en: `Contact Information Update Request - ${this.platformName.en}`
      },
      login_notification: {
        ar: `إشعار تسجيل الدخول - ${this.platformName.ar}`,
        en: `Login Activity Notification - ${this.platformName.en}`
      },
      welcome: {
        ar: `مرحباً بك في منصتنا - ${this.platformName.ar}`,
        en: `Welcome to Our Platform - ${this.platformName.en}`
      },
      contact_message: {
        ar: `رسالة من المستخدم - ${this.platformName.ar}`,
        en: `User Message - ${this.platformName.en}`
      },
      security_notification: {
        ar: `تنبيه أمني مهم - ${this.platformName.ar}`,
        en: `Important Security Alert - ${this.platformName.en}`
      }
    };

    return professionalTemplates[type]?.[language] || `${this.platformName[language]} - ${this.platformTagline[language]}`;
  }
}

export default EmailSubjectTemplates;













