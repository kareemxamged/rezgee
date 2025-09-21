// نظام التيمبليت الموحد للإيميلات - رزقي
// تيمبليت بسيط وموحد لجميع أنواع الإيميلات

export interface EmailTemplateData {
  title: string;
  greeting: string;
  mainContent: string;
  actionButton?: {
    text: string;
    url: string;
  };
  code?: string;
  password?: string;
  warning?: string;
  footer: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * إنشاء تيمبليت موحد بسيط لجميع الإيميلات
 */
export function createUnifiedEmailTemplate(data: EmailTemplateData): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Tahoma', Arial, sans-serif;
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                padding: 40px 20px;
                min-height: 100vh;
                line-height: 1.6;
                direction: rtl;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
                border: 1px solid rgba(0,0,0,0.05);
            }
            .header {
                background: linear-gradient(135deg, #1e40af 0%, #059669 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                font-size: 28px;
                margin: 0;
                font-weight: bold;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #1e40af;
            }
            .main-content {
                background: #f8fafc;
                padding: 25px;
                border-radius: 8px;
                margin: 25px 0;
                border-right: 4px solid #1e40af;
            }
            .arabic-content {
                direction: rtl;
                text-align: right;
                font-family: 'Tahoma', Arial, sans-serif;
                unicode-bidi: bidi-override;
            }
            .arabic-content p {
                direction: rtl;
                text-align: right;
                margin-bottom: 15px;
            }
            .arabic-content h1, .arabic-content h2, .arabic-content h3, .arabic-content h4, .arabic-content h5, .arabic-content h6 {
                direction: rtl;
                text-align: right;
            }
            .english-content {
                direction: ltr;
                text-align: left;
                font-family: 'Arial', sans-serif;
                unicode-bidi: bidi-override;
            }
            .english-content p {
                direction: ltr;
                text-align: left;
                margin-bottom: 15px;
            }
            .english-content h1, .english-content h2, .english-content h3, .english-content h4, .english-content h5, .english-content h6 {
                direction: ltr;
                text-align: left;
            }
            .code-display {
                background: #1e40af;
                color: white;
                padding: 20px;
                border-radius: 8px;
                font-size: 32px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                font-family: 'Courier New', monospace;
                letter-spacing: 5px;
            }
            .password-display {
                background: #059669;
                color: white;
                padding: 20px;
                border-radius: 8px;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                font-family: 'Courier New', monospace;
                letter-spacing: 3px;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                color: white;
                padding: 18px 35px;
                text-decoration: none;
                border-radius: 12px;
                font-weight: bold;
                font-size: 18px;
                margin: 20px 0;
                text-align: center;
                box-shadow: 0 6px 20px rgba(5, 150, 105, 0.3);
            }
            .button-container {
                text-align: center;
                margin: 30px 0;
            }
            .warning {
                background: #fef3c7;
                border: 1px solid #fbbf24;
                color: #92400e;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
            }
            .footer {
                background: #f8fafc;
                padding: 30px;
                text-align: center;
                color: #6c757d;
                border-top: 1px solid #dee2e6;
            }
            .footer-small {
                font-size: 12px;
                margin-top: 15px;
            }
            @media (max-width: 600px) {
                .container { margin: 10px; border-radius: 15px; }
                .content { padding: 20px; }
                .header h1 { font-size: 24px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>رزقي</h1>
                <p>منصة الزواج الإسلامي الشرعي</p>
        </div>
            <div class="content">
                <div class="greeting">${data.greeting}</div>
                <div class="main-content">
                    ${data.mainContent}
                    ${data.code ? `<div class="code-display">${data.code}</div>` : ''}
                    ${data.password ? `<div class="password-display">${data.password}</div>` : ''}
        </div>
                ${data.actionButton ? `
                    <div class="button-container">
                        <a href="${data.actionButton.url}" class="button">${data.actionButton.text}</a>
        </div>
        ` : ''}
                ${data.warning ? `<div class="warning">${data.warning}</div>` : ''}
        </div>
            <div class="footer">
                <p>${data.footer}</p>
                <div class="footer-small">هذا إيميل تلقائي، يرجى عدم الرد عليه مباشرة</div>
      </div>
    </div>
    </body>
    </html>
  `;

  const text = `
${data.greeting}

${data.mainContent}

${data.code ? `رمز التحقق: ${data.code}` : ''}
${data.password ? `كلمة المرور المؤقتة: ${data.password}` : ''}

${data.actionButton ? `${data.actionButton.text}: ${data.actionButton.url}` : ''}

${data.warning || ''}

---
${data.footer}
رزقي - منصة الزواج الإسلامي الشرعي
https://rezgee.vercel.app
  `;

  return {
    subject: data.title,
    html,
    text
  };
}

/**
 * تيمبليتات محددة مسبقاً لأنواع الإيميلات المختلفة
 */
export const EmailTemplates = {
  // إيميل التحقق من الحساب
  verification: (verificationUrl: string, firstName: string, lastName: string) => ({
    title: 'تأكيد إنشاء حسابك في رزقي',
    greeting: `أهلاً وسهلاً ${firstName} ${lastName}،`,
    mainContent: 'نشكرك على انضمامك إلى موقع رزقي للزواج الإسلامي الشرعي. اضغط على الزر أدناه لتأكيد حسابك وتعيين كلمة المرور:',
    actionButton: {
      text: 'تأكيد الحساب',
      url: verificationUrl
    },
    warning: 'هذا الرابط صالح لمدة 24 ساعة فقط. إذا لم تطلب إنشاء حساب، يرجى تجاهل هذا الإيميل.',
    footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
  }),

  // كلمة المرور المؤقتة
  temporaryPassword: (password: string, expiresAt: string, recipientName?: string) => {
    const expiryDate = new Date(expiresAt);
    const expiryTime = expiryDate.toLocaleString('ar-EG', {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      title: 'كلمة المرور المؤقتة - رزقي',
      greeting: `السلام عليكم ${recipientName || 'عزيزي المستخدم'}،`,
      mainContent: 'تم إنشاء كلمة مرور مؤقتة لحسابك في موقع رزقي للزواج الإسلامي. استخدم كلمة المرور أدناه لتسجيل الدخول وتعيين كلمة مرور جديدة:',
      password: password,
      warning: `كلمة المرور صالحة حتى: ${expiryTime}. لا تشارك كلمة المرور هذه مع أي شخص.`,
      footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
    };
  },

  // رمز التحقق الثنائي
  twoFactor: (code: string, codeType: string = 'login', expiresInMinutes: number = 15) => {
    const operationType = codeType === 'login' ? 'تسجيل الدخول' : 
                         codeType === 'enable_2fa' ? 'تفعيل المصادقة الثنائية' : 
                         'إلغاء المصادقة الثنائية';

    return {
      title: 'رمز التحقق الثنائي - رزقي',
      greeting: 'السلام عليكم،',
      mainContent: `تم طلب رمز تحقق ثنائي لـ ${operationType} في موقع رزقي للزواج الإسلامي. استخدم الرمز أدناه لإكمال العملية:`,
      code: code,
      warning: `الرمز صالح لمدة ${expiresInMinutes} دقيقة فقط. لا تشارك هذا الرمز مع أي شخص.`,
      footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
    };
  },

  // رمز التحقق الإداري
  adminTwoFactor: (code: string, adminEmail: string, expiresInMinutes: number = 10, language: 'ar' | 'en' = 'ar') => {
    if (language === 'en') {
      return {
        title: 'Admin Verification Code - Rezge',
        greeting: 'Hello Admin,',
        mainContent: `A verification code has been requested to access the admin dashboard in Rezge. Use the following code to complete the secure login process:`,
        code: code,
        warning: `This code is valid for ${expiresInMinutes} minutes only. This is a sensitive admin code, do not share it with anyone else.`,
        footer: 'Rezge Team - Islamic Marriage Platform'
      };
    }
    
    return {
      title: 'رمز التحقق الإداري - رزقي',
      greeting: 'مرحباً أيها المشرف،',
      mainContent: `تم طلب رمز تحقق لتسجيل الدخول إلى لوحة الإدارة في موقع رزقي. استخدم الرمز التالي لإكمال عملية تسجيل الدخول الآمن:`,
      code: code,
      warning: `هذا الرمز صالح لمدة ${expiresInMinutes} دقائق فقط. هذا رمز إداري حساس، لا تشاركه مع أي شخص آخر.`,
      footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي'
    };
  },

  // تأكيد تغيير بيانات التواصل
  emailChange: (confirmationUrl: string, newEmail: string, currentEmail: string) => ({
    title: 'تأكيد تغيير البريد الإلكتروني - رزقي',
    greeting: 'السلام عليكم،',
    mainContent: `تم طلب تغيير البريد الإلكتروني لحسابك في موقع رزقي للزواج الإسلامي من ${currentEmail} إلى ${newEmail}. اضغط على الزر أدناه لتأكيد التغيير:`,
    actionButton: {
      text: 'تأكيد التغيير',
      url: confirmationUrl
    },
    warning: 'هذا الرابط صالح لمدة 4 ساعات فقط. إذا لم تطلب هذا التغيير، يرجى تجاهل هذا الإيميل وتغيير كلمة المرور فوراً.',
    footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
  }),

  // رمز أمان الإعدادات
  securityTwoFactor: (code: string, action: string, expiresInMinutes: number = 15) => ({
    title: 'رمز تحقق إعدادات الأمان - رزقي',
    greeting: 'مرحباً بك،',
    mainContent: `تم طلب رمز تحقق لتعديل إعدادات الأمان في حسابك (${action}). استخدم الرمز التالي لإكمال العملية:`,
    code: code,
    warning: `هذا الرمز صالح لمدة ${expiresInMinutes} دقيقة فقط. لا تشارك هذا الرمز مع أي شخص آخر.`,
    footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
  }),

  // إشعار تسجيل الدخول الناجح
  loginNotification: (loginData: any) => ({
    title: 'إشعار تسجيل دخول ناجح - رزقي',
    greeting: 'السلام عليكم،',
    mainContent: `تم تسجيل الدخول بنجاح إلى حسابك في موقع رزقي في ${loginData.timestamp}. إذا لم تكن أنت من قام بتسجيل الدخول، يرجى تغيير كلمة المرور فوراً.`,
    warning: 'لحماية حسابك، تأكد من تسجيل الخروج من جميع الأجهزة غير الموثوقة.',
    footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
  }),

  // رسالة ترحيب للمستخدمين الجدد
  welcome: (firstName: string, lastName: string) => ({
    title: 'مرحباً بك في رزقي - منصة الزواج الإسلامي',
    greeting: `أهلاً وسهلاً ${firstName} ${lastName}،`,
    mainContent: 'نشكرك على انضمامك إلى منصة رزقي للزواج الإسلامي الشرعي. نحن ملتزمون بتوفير بيئة آمنة ومحترمة للتعارف والزواج وفقاً للشريعة الإسلامية.',
    actionButton: {
      text: 'ابدأ رحلتك',
      url: 'https://rezgee.vercel.app/dashboard'
    },
    footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
  }),

  // إيميل ترحيب النشرة الإخبارية (محتوى ثنائي اللغة)
  newsletterWelcome: (email: string, name: string, language: 'ar' | 'en' = 'ar') => {
    return {
      title: 'مرحباً بك في النشرة الإخبارية لرزقي | Welcome to Rezge Newsletter',
      greeting: `
        <div class="arabic-content" style="margin-bottom: 15px; direction: rtl; text-align: right; font-family: 'Tahoma', Arial, sans-serif;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e40af;">أهلاً وسهلاً ${name}،</p>
        </div>
        <div class="english-content" style="direction: ltr; text-align: left; font-family: 'Arial', sans-serif;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e40af;">Hello ${name},</p>
        </div>
      `,
      mainContent: `
        <div class="arabic-content" style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; margin-bottom: 15px; font-size: 18px;">🇸🇦 العربية</h3>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-right: 4px solid #1e40af;">
            <p style="margin-bottom: 15px;">نشكرك على الاشتراك في النشرة الإخبارية لرزقي! ستتلقى الآن آخر التحديثات ونصائح الزواج الإسلامي وقصص النجاح وأخبار المنصة مباشرة في بريدك الإلكتروني.</p>
            <p style="margin-bottom: 15px;">في النشرة الإخبارية ستجد:</p>
            <ul style="margin-right: 20px; margin-bottom: 15px;">
              <li>📖 نصائح الزواج الإسلامي الشرعي</li>
              <li>💑 قصص نجاح من أعضاء المنصة</li>
              <li>🆕 آخر التحديثات والمميزات الجديدة</li>
              <li>📅 فعاليات وندوات الزواج الإسلامي</li>
              <li>💡 نصائح للتعارف الآمن والمحترم</li>
            </ul>
          </div>
        </div>
        
        <div class="english-content" style="border-top: 2px solid #e5e7eb; padding-top: 30px;">
          <h3 style="color: #1e40af; margin-bottom: 15px; font-size: 18px;">🇺🇸 English</h3>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #1e40af;">
            <p style="margin-bottom: 15px;">Thank you for subscribing to the Rezge newsletter! You will now receive the latest updates, Islamic marriage tips, success stories, and platform news directly to your inbox.</p>
            <p style="margin-bottom: 15px;">In our newsletter you will find:</p>
            <ul style="margin-left: 20px; margin-bottom: 15px;">
              <li>📖 Islamic marriage guidance and tips</li>
              <li>💑 Success stories from platform members</li>
              <li>🆕 Latest updates and new features</li>
              <li>📅 Islamic marriage events and seminars</li>
              <li>💡 Tips for safe and respectful relationships</li>
            </ul>
          </div>
        </div>
      `,
      warning: 'يمكنك إلغاء الاشتراك في أي وقت من خلال النقر على رابط إلغاء الاشتراك في أي إيميل من النشرة الإخبارية. | You can unsubscribe at any time by clicking the unsubscribe link in any newsletter email.',
      footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي | Rezge Team - Islamic Marriage Platform'
    };
  },

  // إيميل إلغاء الاشتراك من النشرة الإخبارية (محتوى ثنائي اللغة)
  newsletterUnsubscribe: (email: string, name: string, language: 'ar' | 'en' = 'ar') => {
    return {
      title: 'تم إلغاء الاشتراك من النشرة الإخبارية لرزقي | Unsubscribed from Rezge Newsletter',
      greeting: `
        <div class="arabic-content" style="margin-bottom: 15px; direction: rtl; text-align: right; font-family: 'Tahoma', Arial, sans-serif;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e40af;">أهلاً وسهلاً ${name}،</p>
        </div>
        <div class="english-content" style="direction: ltr; text-align: left; font-family: 'Arial', sans-serif;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e40af;">Hello ${name},</p>
        </div>
      `,
      mainContent: `
        <div class="arabic-content" style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; margin-bottom: 15px; font-size: 18px;">🇸🇦 العربية</h3>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-right: 4px solid #1e40af;">
            <p style="margin-bottom: 15px;">تم إلغاء اشتراكك في النشرة الإخبارية لرزقي بنجاح. نأسف لرحيلك!</p>
            <p style="margin-bottom: 15px;">إذا غيرت رأيك، يمكنك دائماً الاشتراك مرة أخرى من موقعنا أو من خلال النقر على الرابط أدناه.</p>
            <p style="margin-bottom: 15px;">نشكرك على وقتك معنا ونتمنى لك التوفيق في رحلتك نحو الزواج الإسلامي الشرعي.</p>
          </div>
        </div>
        
        <div class="english-content" style="border-top: 2px solid #e5e7eb; padding-top: 30px;">
          <h3 style="color: #1e40af; margin-bottom: 15px; font-size: 18px;">🇺🇸 English</h3>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #1e40af;">
            <p style="margin-bottom: 15px;">You have successfully unsubscribed from the Rezge newsletter. We are sorry to see you go!</p>
            <p style="margin-bottom: 15px;">If you change your mind, you can always subscribe again from our website or by clicking the link below.</p>
            <p style="margin-bottom: 15px;">Thank you for your time with us and we wish you success in your journey towards Islamic marriage.</p>
          </div>
        </div>
      `,
      warning: 'تم حذف بريدك الإلكتروني من قائمة المراسلة ولن تتلقى بعد الآن إيميلات النشرة الإخبارية. | Your email has been removed from our mailing list and you will no longer receive newsletter emails.',
      footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي | Rezge Team - Islamic Marriage Platform'
    };
  },

  // قالب النشرة الإخبارية العامة (محتوى ثنائي اللغة)
  newsletterTemplate: (title: string, content: string, unsubscribeUrl: string, language: 'ar' | 'en' | 'bilingual' = 'ar') => {
    return {
      title: `النشرة الإخبارية لرزقي - ${title} | Rezge Newsletter - ${title}`,
      greeting: `
        <div class="arabic-content" style="margin-bottom: 15px; direction: rtl; text-align: right; font-family: 'Tahoma', Arial, sans-serif;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e40af;">أهلاً وسهلاً مشترك النشرة الإخبارية،</p>
        </div>
        <div class="english-content" style="direction: ltr; text-align: left; font-family: 'Arial', sans-serif;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e40af;">Hello Newsletter Subscriber,</p>
        </div>
      `,
      mainContent: content, // استخدام المحتوى المُعالج مسبقاً من NewsletterManagement
      warning: `
        <div style="margin-top: 40px; padding: 20px; background: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center;">
          <div class="arabic-content" style="margin-bottom: 10px; direction: rtl; text-align: right; font-family: 'Tahoma', Arial, sans-serif;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              إذا كنت لا ترغب في تلقي النشرة الإخبارية بعد الآن، يمكنك 
              <a href="${unsubscribeUrl}" style="color: #1e40af; text-decoration: underline;">إلغاء الاشتراك هنا</a>
            </p>
          </div>
          <div class="english-content" style="direction: ltr; text-align: left; font-family: 'Arial', sans-serif;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              If you no longer wish to receive our newsletter, you can 
              <a href="${unsubscribeUrl}" style="color: #1e40af; text-decoration: underline;">unsubscribe here</a>
            </p>
          </div>
        </div>
      `,
      footer: 'فريق رزقي - منصة الزواج الإسلامي الشرعي | Rezge Team - Islamic Marriage Platform'
    };
  }
};

export default {
  createUnifiedEmailTemplate,
  EmailTemplates
};