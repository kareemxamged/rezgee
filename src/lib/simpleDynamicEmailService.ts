// خدمة الإيميل المبسطة مع كشف اللغة التلقائي
// Simple Dynamic Email Service with Automatic Language Detection

import { UnifiedEmailService } from './unifiedEmailService';

// تيمبليت موحد محسن للإيميلات - رزقي
interface EmailTemplateData {
  title: string;
  greeting: string;
  mainContent: string;
  code?: string;
  warning?: string;
  securityNote?: string;
  footer?: string;
  language: 'ar' | 'en';
  isRTL: boolean;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

function createEmailTemplate(data: EmailTemplateData): EmailTemplate {
  const isArabic = data.language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const textAlign = isArabic ? 'right' : 'left';
  const fontFamily = isArabic ? "'Tahoma', Arial, sans-serif" : "'Arial', sans-serif";
  const brandName = isArabic ? 'رزقي' : 'Rezge';
  const platformName = isArabic ? 'منصة الزواج الإسلامية' : 'Islamic Marriage Platform';
  
  const html = `
    <!DOCTYPE html>
    <html dir="${direction}" lang="${data.language}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: ${fontFamily};
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                padding: 40px 20px;
                min-height: 100vh;
                line-height: 1.6;
                direction: ${direction};
                color: #1f2937;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
                border: 1px solid rgba(0,0,0,0.05);
            }
            .header {
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            .brand-name {
                font-size: 36px;
                font-weight: bold;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                direction: ${direction};
                text-align: ${textAlign};
            }
            .platform-name {
                font-size: 16px;
                opacity: 0.9;
                font-weight: 300;
                direction: ${direction};
                text-align: ${textAlign};
            }
            .content {
                padding: 40px 30px;
                direction: ${direction};
                text-align: ${textAlign};
            }
            .greeting {
                font-size: 20px;
                font-weight: 600;
                color: #1e40af;
                margin-bottom: 25px;
                direction: ${direction};
                text-align: ${textAlign};
            }
            .title {
                font-size: 24px;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 25px;
                direction: ${direction};
                text-align: ${textAlign};
            }
            .main-content {
                background: #f8fafc;
                padding: 25px;
                border-radius: 12px;
                margin: 25px 0;
                border: 1px solid #e2e8f0;
                direction: ${direction};
                text-align: ${textAlign};
                font-size: 16px;
                line-height: 1.7;
            }
            .code-container {
                background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                border-radius: 15px;
                padding: 30px;
                text-align: center;
                margin: 30px 0;
                border: 2px solid #d1d5db;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .code-label {
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 15px;
                font-weight: 500;
                direction: ${direction};
                text-align: ${textAlign};
            }
            .code {
                font-size: 36px;
                font-weight: bold;
                color: #1e40af;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
                direction: ltr;
                text-align: center;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .warning {
                background: #fef3cd;
                border: 1px solid #fbbf24;
                border-radius: 10px;
                padding: 20px;
                margin: 25px 0;
                direction: ${direction};
                text-align: ${textAlign};
            }
            .warning p {
                color: #92400e;
                font-size: 14px;
                margin: 0;
                font-weight: 500;
                direction: ${direction};
                text-align: ${textAlign};
            }
            .security-note {
                background: #f0f9ff;
                border: 1px solid #0ea5e9;
                border-radius: 10px;
                padding: 20px;
                margin: 25px 0;
                direction: ${direction};
                text-align: ${textAlign};
            }
            .security-note p {
                color: #0c4a6e;
                font-size: 14px;
                margin: 0;
                font-weight: 500;
                direction: ${direction};
                text-align: ${textAlign};
            }
            .footer {
                background: #f9fafb;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
                direction: ${direction};
                text-align: ${textAlign};
            }
            .footer p {
                color: #6b7280;
                font-size: 12px;
                margin: 0;
                direction: ${direction};
                text-align: ${textAlign};
            }
            .footer-brand {
                font-weight: 600;
                color: #1e40af;
                margin-bottom: 5px;
            }
            @media (max-width: 600px) {
                body { padding: 20px 10px; }
                .email-container { border-radius: 15px; }
                .header { padding: 30px 20px; }
                .brand-name { font-size: 28px; }
                .content { padding: 30px 20px; }
                .code { font-size: 28px; letter-spacing: 6px; }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="brand-name">${brandName}</div>
                <div class="platform-name">${platformName}</div>
            </div>
            
            <div class="content">
                <div class="greeting">${data.greeting}</div>
                <div class="title">${data.title}</div>
                <div class="main-content">${data.mainContent}</div>
                
                ${data.code ? `
                <div class="code-container">
                    <div class="code-label">${isArabic ? 'كود التحقق' : 'Verification Code'}</div>
                    <div class="code">${data.code}</div>
                </div>
                ` : ''}
                
                ${data.warning ? `
                <div class="warning">
                    <p><strong>${isArabic ? 'تنبيه:' : 'Notice:'}</strong> ${data.warning}</p>
                </div>
                ` : ''}
                
                ${data.securityNote ? `
                <div class="security-note">
                    <p><strong>${isArabic ? 'تنبيه أمني:' : 'Security Notice:'}</strong> ${data.securityNote}</p>
                </div>
                ` : ''}
            </div>
            
            <div class="footer">
                <div class="footer-brand">${brandName}</div>
                <p>${data.footer || (isArabic ? '© 2025 رزقي - منصة الزواج الإسلامية' : '© 2025 Rezge - Islamic Marriage Platform')}</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
${data.title}

${data.greeting}

${data.mainContent.replace(/<[^>]*>/g, '')}

${data.code ? `${isArabic ? 'كود التحقق' : 'Verification Code'}: ${data.code}` : ''}

${data.warning ? `${isArabic ? 'تنبيه:' : 'Notice:'} ${data.warning}` : ''}

${data.securityNote ? `${isArabic ? 'تنبيه أمني:' : 'Security Notice:'} ${data.securityNote}` : ''}

${data.footer || (isArabic ? '© 2025 رزقي - منصة الزواج الإسلامية' : '© 2025 Rezge - Islamic Marriage Platform')}
  `.trim();

  return {
    subject: data.title,
    html,
    text
  };
}

export interface SimpleEmailData {
  to: string;
  subject?: string;
  templateType: 'two_factor_login' | 'password_reset' | 'verification' | 'welcome' | 'two_factor_enable' | 'two_factor_disable' | 'login_notification' | 'profile_update' | 'security_alert' | 'newsletter_welcome' | 'newsletter_campaign' | 'contact_form' | 'admin_notification';
  data: {
    code?: string;
    firstName?: string;
    [key: string]: any;
  };
}

export class SimpleDynamicEmailService {
  /**
   * كشف اللغة الحالية للموقع
   */
  private static detectCurrentLanguage(): 'ar' | 'en' {
    try {
      // محاولة كشف اللغة من localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedLang = window.localStorage.getItem('i18nextLng');
        if (storedLang && (storedLang === 'ar' || storedLang === 'en')) {
          return storedLang;
        }
      }

      // محاولة كشف اللغة من i18next
      if (typeof window !== 'undefined' && (window as any).i18next) {
        const i18nLang = (window as any).i18next.language;
        if (i18nLang && (i18nLang === 'ar' || i18nLang === 'en')) {
          return i18nLang;
        }
      }

      // محاولة كشف اللغة من document
      if (typeof document !== 'undefined' && document.documentElement) {
        const docLang = document.documentElement.lang;
        if (docLang && (docLang === 'ar' || docLang === 'en')) {
          return docLang;
        }
      }

      // افتراضي: العربية
      return 'ar';
    } catch (error) {
      console.warn('⚠️ خطأ في كشف اللغة، استخدام العربية:', error);
      return 'ar';
    }
  }

  /**
   * إنشاء محتوى الإيميل حسب اللغة باستخدام التيمبليت الموحد
   */
  private static createEmailContent(templateType: string, data: any, language: 'ar' | 'en'): {
    subject: string;
    html: string;
    text: string;
  } {
    const isArabic = language === 'ar';

    // المحتوى العربي
    const arabicContent = {
      two_factor_login: {
        subject: 'كود تسجيل الدخول - رزقي',
        title: 'كود تسجيل الدخول',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'مرحباً بك في منصة رزقي للزواج الإسلامي الشرعي. تم طلب تسجيل دخول لحسابك. استخدم الكود التالي لإكمال عملية تسجيل الدخول:',
        codeLabel: 'كود التحقق',
        warning: 'هذا الكود صالح لمدة 10 دقائق فقط. إذا لم تطلب هذا الكود، يرجى تجاهل هذه الرسالة.',
        securityNote: 'تنبيه أمني: لا تشارك هذا الكود مع أي شخص آخر. فريق رزقي لن يطلب منك هذا الكود أبداً.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      },
      password_reset: {
        subject: 'إعادة تعيين كلمة المرور - رزقي',
        title: 'إعادة تعيين كلمة المرور',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'مرحباً بك في منصة رزقي للزواج الإسلامي الشرعي. تم طلب إعادة تعيين كلمة المرور لحسابك. استخدم الكود التالي لإعادة تعيين كلمة المرور:',
        codeLabel: 'كود إعادة التعيين',
        warning: 'هذا الكود صالح لمدة 15 دقيقة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.',
        securityNote: 'تنبيه أمني: لا تشارك هذا الكود مع أي شخص آخر. فريق رزقي لن يطلب منك هذا الكود أبداً.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      },
      verification: {
        subject: 'تأكيد الحساب - رزقي',
        title: 'تأكيد الحساب',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'مرحباً بك في منصة رزقي للزواج الإسلامي الشرعي! استخدم الكود التالي لتأكيد إنشاء حسابك:',
        codeLabel: 'كود التأكيد',
        warning: 'هذا الكود صالح لمدة 30 دقيقة فقط. إذا لم تطلب هذا الكود، يرجى تجاهل هذه الرسالة.',
        securityNote: 'تنبيه أمني: لا تشارك هذا الكود مع أي شخص آخر. فريق رزقي لن يطلب منك هذا الكود أبداً.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      },
      welcome: {
        subject: 'مرحباً بك في رزقي - منصة الزواج الإسلامية',
        title: 'مرحباً بك في رزقي',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'مرحباً بك في منصة رزقي - منصة الزواج الإسلامية الشرعية. نحن سعداء بانضمامك إلينا.',
        codeLabel: '',
        warning: 'نتمنى لك تجربة ممتعة ومباركة في رحلتك للعثور على شريك الحياة المناسب.',
        securityNote: 'إذا كان لديك أي استفسارات، لا تتردد في التواصل معنا.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      },
      two_factor_enable: {
        subject: 'تم تفعيل المصادقة الثنائية - رزقي',
        title: 'تم تفعيل المصادقة الثنائية',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'تم تفعيل المصادقة الثنائية لحسابك في رزقي بنجاح. هذا سيزيد من أمان حسابك ويحميك من الوصول غير المصرح به.',
        codeLabel: '',
        warning: 'من الآن فصاعداً، ستحتاج إلى إدخال كود التحقق في كل مرة تقوم فيها بتسجيل الدخول من جهاز جديد.',
        securityNote: 'إذا لم تقم بتفعيل هذه الميزة، يرجى التواصل معنا فوراً.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      },
      two_factor_disable: {
        subject: 'تم إلغاء تفعيل المصادقة الثنائية - رزقي',
        title: 'تم إلغاء تفعيل المصادقة الثنائية',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'تم إلغاء تفعيل المصادقة الثنائية لحسابك في رزقي. لم تعد تحتاج إلى إدخال كود التحقق عند تسجيل الدخول.',
        codeLabel: '',
        warning: 'ننصح بإعادة تفعيل المصادقة الثنائية لزيادة أمان حسابك.',
        securityNote: 'إذا لم تقم بإلغاء تفعيل هذه الميزة، يرجى التواصل معنا فوراً.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      },
      login_notification: {
        subject: 'تنبيه تسجيل الدخول - رزقي',
        title: 'تنبيه تسجيل الدخول',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'تم تسجيل الدخول إلى حسابك في رزقي من جهاز جديد. إذا كان هذا أنت، فلا حاجة لاتخاذ أي إجراء.',
        codeLabel: '',
        warning: 'إذا لم تقم بتسجيل الدخول، يرجى تغيير كلمة المرور فوراً والاتصال بنا.',
        securityNote: 'نحن نراقب جميع محاولات تسجيل الدخول لحماية حسابك.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      },
      profile_update: {
        subject: 'تم تحديث الملف الشخصي - رزقي',
        title: 'تم تحديث الملف الشخصي',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'تم تحديث ملفك الشخصي في رزقي بنجاح. يمكنك مراجعة التغييرات من خلال الدخول إلى حسابك.',
        codeLabel: '',
        warning: 'تأكد من أن جميع المعلومات المحدثة صحيحة ومكتملة.',
        securityNote: 'إذا لم تقم بتحديث ملفك الشخصي، يرجى التواصل معنا فوراً.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      },
      security_alert: {
        subject: 'تنبيه أمني - رزقي',
        title: 'تنبيه أمني',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'تم اكتشاف نشاط غير عادي على حسابك في رزقي. ننصح بتغيير كلمة المرور فوراً.',
        codeLabel: '',
        warning: 'إذا لم تقم بأي نشاط غير عادي، يرجى التواصل معنا فوراً لحماية حسابك.',
        securityNote: 'نحن نراقب جميع الأنشطة المشبوهة لحماية مستخدمينا.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      },
      newsletter_welcome: {
        subject: 'مرحباً بك في النشرة الإخبارية - رزقي',
        title: 'مرحباً بك في النشرة الإخبارية',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'مرحباً بك في النشرة الإخبارية لرزقي! ستتلقى آخر الأخبار والتحديثات حول المنصة.',
        codeLabel: '',
        warning: 'يمكنك إلغاء الاشتراك في أي وقت من خلال النقر على الرابط الموجود في أسفل الإيميلات.',
        securityNote: 'نحن نحترم خصوصيتك ولن نشارك معلوماتك مع أي طرف ثالث.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      },
      newsletter_campaign: {
        subject: 'النشرة الإخبارية - رزقي',
        title: 'النشرة الإخبارية',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'إليك آخر الأخبار والتحديثات من منصة رزقي للزواج الإسلامي الشرعي.',
        codeLabel: '',
        warning: 'يمكنك إلغاء الاشتراك في أي وقت من خلال النقر على الرابط الموجود في أسفل الإيميلات.',
        securityNote: 'نحن نحترم خصوصيتك ولن نشارك معلوماتك مع أي طرف ثالث.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      },
      contact_form: {
        subject: 'تم استلام رسالتك - رزقي',
        title: 'تم استلام رسالتك',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'تم استلام رسالتك بنجاح وسنقوم بالرد عليك في أقرب وقت ممكن.',
        codeLabel: '',
        warning: 'نقدر تواصلك معنا وسنعمل على مساعدتك بأفضل طريقة ممكنة.',
        securityNote: 'إذا كان لديك أي استفسارات إضافية، لا تتردد في التواصل معنا.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      },
      admin_notification: {
        subject: 'إشعار إداري - رزقي',
        title: 'إشعار إداري',
        greeting: 'السلام عليكم ورحمة الله وبركاته،',
        message: 'هذا إشعار إداري من فريق رزقي. يرجى مراجعة المحتوى أدناه.',
        codeLabel: '',
        warning: 'هذا إشعار مهم يرجى قراءته بعناية.',
        securityNote: 'إذا كان لديك أي استفسارات حول هذا الإشعار، يرجى التواصل معنا.',
        footer: '© 2025 رزقي - منصة الزواج الإسلامية'
      }
    };

    // المحتوى الإنجليزي
    const englishContent = {
      two_factor_login: {
        subject: 'Login Code - Rezge',
        title: 'Login Code',
        greeting: 'Assalamu Alaikum,',
        message: 'Welcome to Rezge Islamic Marriage Platform. A login has been requested for your account. Use the code below to complete the login process:',
        codeLabel: 'Verification Code',
        warning: 'This code is valid for 10 minutes only. If you did not request this code, please ignore this message.',
        securityNote: 'Security Notice: Do not share this code with anyone else. Rezge team will never ask for this code.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      },
      password_reset: {
        subject: 'Password Reset - Rezge',
        title: 'Password Reset',
        greeting: 'Assalamu Alaikum,',
        message: 'Welcome to Rezge Islamic Marriage Platform. A password reset has been requested for your account. Use the code below to reset your password:',
        codeLabel: 'Reset Code',
        warning: 'This code is valid for 15 minutes only. If you did not request this code, please ignore this message.',
        securityNote: 'Security Notice: Do not share this code with anyone else. Rezge team will never ask for this code.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      },
      verification: {
        subject: 'Confirm Your Account - Rezge',
        title: 'Confirm Your Account',
        greeting: 'Assalamu Alaikum,',
        message: 'Welcome to Rezge Islamic Marriage Platform! Use the code below to confirm your account creation:',
        codeLabel: 'Confirmation Code',
        warning: 'This code is valid for 30 minutes only. If you did not request this code, please ignore this message.',
        securityNote: 'Security Notice: Do not share this code with anyone else. Rezge team will never ask for this code.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      },
      welcome: {
        subject: 'Welcome to Rezge - Islamic Marriage Platform',
        title: 'Welcome to Rezge',
        greeting: 'Assalamu Alaikum,',
        message: 'Welcome to Rezge - the Islamic marriage platform. We are happy to have you join us.',
        codeLabel: '',
        warning: 'We wish you a blessed and enjoyable experience in your journey to find the right life partner.',
        securityNote: 'If you have any questions, please do not hesitate to contact us.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      },
      two_factor_enable: {
        subject: 'Two-Factor Authentication Enabled - Rezge',
        title: 'Two-Factor Authentication Enabled',
        greeting: 'Assalamu Alaikum,',
        message: 'Two-factor authentication has been successfully enabled for your Rezge account. This will increase your account security and protect you from unauthorized access.',
        codeLabel: '',
        warning: 'From now on, you will need to enter a verification code every time you log in from a new device.',
        securityNote: 'If you did not enable this feature, please contact us immediately.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      },
      two_factor_disable: {
        subject: 'Two-Factor Authentication Disabled - Rezge',
        title: 'Two-Factor Authentication Disabled',
        greeting: 'Assalamu Alaikum,',
        message: 'Two-factor authentication has been disabled for your Rezge account. You no longer need to enter a verification code when logging in.',
        codeLabel: '',
        warning: 'We recommend re-enabling two-factor authentication to increase your account security.',
        securityNote: 'If you did not disable this feature, please contact us immediately.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      },
      login_notification: {
        subject: 'Login Notification - Rezge',
        title: 'Login Notification',
        greeting: 'Assalamu Alaikum,',
        message: 'Your Rezge account has been accessed from a new device. If this was you, no action is required.',
        codeLabel: '',
        warning: 'If you did not log in, please change your password immediately and contact us.',
        securityNote: 'We monitor all login attempts to protect your account.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      },
      profile_update: {
        subject: 'Profile Updated - Rezge',
        title: 'Profile Updated',
        greeting: 'Assalamu Alaikum,',
        message: 'Your Rezge profile has been successfully updated. You can review the changes by logging into your account.',
        codeLabel: '',
        warning: 'Make sure all updated information is correct and complete.',
        securityNote: 'If you did not update your profile, please contact us immediately.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      },
      security_alert: {
        subject: 'Security Alert - Rezge',
        title: 'Security Alert',
        greeting: 'Assalamu Alaikum,',
        message: 'Unusual activity has been detected on your Rezge account. We recommend changing your password immediately.',
        codeLabel: '',
        warning: 'If you did not perform any unusual activity, please contact us immediately to protect your account.',
        securityNote: 'We monitor all suspicious activities to protect our users.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      },
      newsletter_welcome: {
        subject: 'Welcome to Newsletter - Rezge',
        title: 'Welcome to Newsletter',
        greeting: 'Assalamu Alaikum,',
        message: 'Welcome to Rezge newsletter! You will receive the latest news and updates about the platform.',
        codeLabel: '',
        warning: 'You can unsubscribe at any time by clicking the link at the bottom of emails.',
        securityNote: 'We respect your privacy and will not share your information with any third party.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      },
      newsletter_campaign: {
        subject: 'Newsletter - Rezge',
        title: 'Newsletter',
        greeting: 'Assalamu Alaikum,',
        message: 'Here are the latest news and updates from Rezge Islamic Marriage Platform.',
        codeLabel: '',
        warning: 'You can unsubscribe at any time by clicking the link at the bottom of emails.',
        securityNote: 'We respect your privacy and will not share your information with any third party.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      },
      contact_form: {
        subject: 'Message Received - Rezge',
        title: 'Message Received',
        greeting: 'Assalamu Alaikum,',
        message: 'Your message has been received successfully and we will respond to you as soon as possible.',
        codeLabel: '',
        warning: 'We appreciate your contact with us and will work to help you in the best way possible.',
        securityNote: 'If you have any additional questions, please do not hesitate to contact us.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      },
      admin_notification: {
        subject: 'Admin Notification - Rezge',
        title: 'Admin Notification',
        greeting: 'Assalamu Alaikum,',
        message: 'This is an administrative notification from the Rezge team. Please review the content below.',
        codeLabel: '',
        warning: 'This is an important notification, please read it carefully.',
        securityNote: 'If you have any questions about this notification, please contact us.',
        footer: '© 2025 Rezge - Islamic Marriage Platform'
      }
    };

    const content = isArabic ? arabicContent[templateType as keyof typeof arabicContent] : englishContent[templateType as keyof typeof englishContent];

    // إنشاء بيانات التيمبليت الموحد
    const templateData: EmailTemplateData = {
      title: content.title,
      greeting: content.greeting,
      mainContent: content.message,
      code: data.code,
      warning: content.warning,
      securityNote: content.securityNote,
      footer: content.footer,
      language: language,
      isRTL: isArabic
    };

    // إنشاء التيمبليت الموحد
    const template = createEmailTemplate(templateData);

    return {
      subject: content.subject,
      html: template.html,
      text: template.text
    };
  }

  /**
   * إرسال إيميل ديناميكي مبسط
   */
  static async sendEmail(emailData: SimpleEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 SimpleDynamicEmailService: بدء إرسال الإيميل...');
      console.log(`📬 إلى: ${emailData.to}`);

      const detectedLanguage = this.detectCurrentLanguage();
      console.log(`🌐 اللغة المكتشفة: ${detectedLanguage}`);

      const templateContent = this.createEmailContent(emailData.templateType, emailData.data, detectedLanguage);
      console.log(`📄 تم إنشاء المحتوى للغة: ${detectedLanguage}`);

      const emailResult = await UnifiedEmailService.sendEmail({
        to: emailData.to,
        subject: emailData.subject || templateContent.subject,
        html: templateContent.html,
        text: templateContent.text,
        type: emailData.templateType
      }, emailData.templateType, detectedLanguage);

      if (emailResult.success) {
        console.log(`✅ تم إرسال الإيميل بنجاح (${detectedLanguage})`);
      } else {
        console.error('❌ فشل في إرسال الإيميل:', emailResult.error);
      }
      return emailResult;

    } catch (error) {
      console.error('❌ خطأ في إرسال الإيميل الديناميكي المبسط:', error);
      return { success: false, error: error instanceof Error ? error.message : 'خطأ غير متوقع في إرسال الإيميل' };
    }
  }
}
