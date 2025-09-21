/**
 * نظام التيمبليت الموحد للإيميلات - رزقي
 * يوفر تيمبليت موحد لجميع أنواع الإيميلات مع إمكانية التخصيص
 * مبني على أساس تصميم صفحة "نسيت كلمة المرور"
 */

export interface UnifiedEmailData {
  // البيانات الأساسية
  title: string;
  heading: string;
  icon?: string; // الأيقونة (emoji أو HTML)
  greeting?: string;
  description: string;
  
  // المحتوى الرئيسي
  mainContent: string;
  mainContentType: 'code' | 'password' | 'button' | 'text' | 'html';
  mainContentLabel?: string;
  
  // محتوى إضافي
  additionalInfo?: string;
  instructions?: string[];
  
  // رسائل الأمان
  securityNote?: string;
  warningMessage?: string;
  
  // معلومات إضافية
  validityInfo?: string;
  actionUrl?: string;
  actionButtonText?: string;
  
  // إعدادات التصميم
  primaryColor?: string;
  gradientColors?: [string, string];
  language?: 'ar' | 'en';
}

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

/**
 * إنشاء التيمبليت الأساسي الموحد
 */
export class UnifiedEmailTemplateSystem {
  private static readonly DEFAULT_PRIMARY_COLOR = '#1e40af';
  private static readonly DEFAULT_GRADIENT = ['#1e40af', '#059669'] as [string, string];
  
  /**
   * إنشاء التيمبليت الموحد (نفس التيمبليت المستخدم في صفحة نسيت كلمة المرور)
   */
  static generateUnifiedTemplate(data: UnifiedEmailData): EmailTemplate {
    const isRTL = true; // دعم العربية افتراضياً
    const direction = isRTL ? 'rtl' : 'ltr';
    const textAlign = isRTL ? 'right' : 'left';
    const fontFamily = isRTL ? 'Tahoma, Arial, sans-serif' : 'Arial, Helvetica, sans-serif';

    // تحديد الألوان حسب نوع الإيميل (نفس الألوان المستخدمة في النظام الحالي)
    const primaryColor = data.primaryColor || '#667eea';
    const gradientColors = data.gradientColors || ['#667eea', '#764ba2'];

    // إنشاء المحتوى الرئيسي
    const mainContent = this.renderMainContent(data);
    const instructionsContent = data.instructions && data.instructions.length > 0 ? this.renderInstructions(data.instructions) : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="${direction}" lang="${isRTL ? 'ar' : 'en'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
          body {
            font-family: ${fontFamily};
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            direction: ${direction};
            text-align: ${textAlign};
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            color: ${primaryColor};
          }
          .main-content {
            background: #f8f9ff;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
            border-${isRTL ? 'right' : 'left'}: 4px solid ${primaryColor};
          }
          .code-display {
            background: ${primaryColor};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 15px 0;
            font-family: monospace;
            letter-spacing: 3px;
          }
          .button {
            display: inline-block;
            background: ${primaryColor};
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
          }
          .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #6c757d;
            border-top: 1px solid #dee2e6;
          }
          .footer-small {
            font-size: 12px;
            margin-top: 15px;
          }
          ul {
            padding-${isRTL ? 'right' : 'left'}: 20px;
          }
          li {
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.heading}</h1>
          </div>
          <div class="content">
            ${data.greeting ? `<div class="greeting">${data.greeting}</div>` : ''}
            ${data.description ? `<p>${data.description}</p>` : ''}
            <div class="main-content">
              ${mainContent}
            </div>
            ${instructionsContent}
            ${data.securityNote ? `<div class="warning"><strong>⚠️ ${data.securityNote}</strong></div>` : ''}
          </div>
          <div class="footer">
            <p>فريق رزقي - موقع الزواج الإسلامي الشرعي</p>
            <div class="footer-small">هذا إيميل تلقائي، يرجى عدم الرد عليه مباشرة</div>
          </div>
        </div>
      </body>
      </html>`;

    const textContent = this.generateTextContent(data);

    return {
      subject: data.title,
      htmlContent,
      textContent
    };
  }

  /**
   * رندر المحتوى الرئيسي حسب النوع (نفس التيمبليت المستخدم في صفحة نسيت كلمة المرور)
   */
  private static renderMainContent(data: UnifiedEmailData): string {
    switch (data.mainContentType) {
      case 'code':
      case 'password':
        return `
          <h3 style="color: #667eea; margin-bottom: 15px;">${data.mainContentLabel || 'كلمة المرور المؤقتة'}</h3>
          <div class="code-display">${data.mainContent}</div>
          ${data.validityInfo ? `<div class="warning"><strong>${data.validityInfo}</strong></div>` : ''}
        `;
      
      case 'button':
        return `<a href="${data.mainContent}" class="button">${data.mainContentLabel || 'انقر هنا'}</a>`;
      
      case 'html':
        return data.mainContent;
      
      case 'text':
      default:
        return `<p style="font-size: 18px; font-weight: bold; margin: 0;">${data.mainContent}</p>`;
    }
  }

  /**
   * رندر التعليمات
   */
  private static renderInstructions(instructions: string[]): string {
    if (!instructions || instructions.length === 0) return '';
    
    return `
      <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #1e40af; margin-top: 0;">تعليمات الاستخدام:</h4>
        <ul style="margin: 10px 0;">
          ${instructions.map(instruction => `<li>${instruction}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  /**
   * رندر زر العمل
   */
  private static renderActionButton(url: string, text: string): string {
    return `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" class="button">${text}</a>
      </div>
    `;
  }

  /**
   * رندر معلومات الصلاحية
   */
  private static renderValidityInfo(info: string): string {
    return `
      <div class="warning-box">
        <p>⏰ ${info}</p>
      </div>
    `;
  }

  /**
   * رندر ملاحظة الأمان
   */
  private static renderSecurityNote(note: string): string {
    return `
      <div class="warning-box">
        <p>🔒 تنبيه أمني: ${note}</p>
      </div>
    `;
  }

  /**
   * رندر رسالة التحذير
   */
  private static renderWarningMessage(message: string): string {
    return `
      <div class="security-box">
        <p>🚨 تحذير مهم: ${message}</p>
      </div>
    `;
  }

  /**
   * إنشاء المحتوى النصي
   */
  private static generateTextContent(data: UnifiedEmailData): string {
    let content = `${data.heading}\n\n`;
    
    if (data.greeting) {
      content += `${data.greeting}\n\n`;
    }
    
    content += `${data.description}\n\n`;
    
    content += `${data.mainContentLabel || 'المحتوى'}: ${data.mainContent}\n\n`;
    
    if (data.instructions) {
      content += `خطوات الاستخدام:\n`;
      data.instructions.forEach((instruction, index) => {
        content += `${index + 1}. ${instruction}\n`;
      });
      content += '\n';
    }
    
    if (data.additionalInfo) {
      content += `${data.additionalInfo}\n\n`;
    }
    
    if (data.validityInfo) {
      content += `⏰ ${data.validityInfo}\n\n`;
    }
    
    if (data.securityNote) {
      content += `🔒 تنبيه أمني: ${data.securityNote}\n\n`;
    }
    
    if (data.warningMessage) {
      content += `🚨 تحذير مهم: ${data.warningMessage}\n\n`;
    }
    
    content += `---\nفريق رزقي - موقع الزواج الإسلامي الشرعي\nhttps://rezge.com`;
    
    return content;
  }
}

/**
 * قوالب جاهزة للاستخدام
 */
export const UnifiedEmailTemplates = {
  /**
   * تيمبليت كلمة المرور المؤقتة (نفس التيمبليت المستخدم في صفحة نسيت كلمة المرور)
   */
  temporaryPassword(
    password: string,
    expiresAt: string,
    recipientName: string = 'عزيزي المستخدم'
  ): UnifiedEmailData {
    const expiryDate = new Date(expiresAt);
    const expiryTime = expiryDate.toLocaleString('ar-EG', {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      calendar: 'gregory'
    });

    return {
      title: 'كلمة المرور المؤقتة - رزقي',
      heading: 'كلمة المرور المؤقتة',
      greeting: `السلام عليكم ${recipientName}،`,
      description: 'تم إنشاء كلمة مرور مؤقتة لحسابك في موقع رزقي للزواج الإسلامي. استخدم كلمة المرور أدناه لتسجيل الدخول وتعيين كلمة مرور جديدة:',
      mainContentType: 'password',
      mainContent: password,
      mainContentLabel: 'كلمة المرور المؤقتة',
      instructions: [
        '1. اذهب إلى صفحة تسجيل الدخول في موقع رزقي',
        '2. أدخل بريدك الإلكتروني وكلمة المرور المؤقتة أعلاه',
        '3. ستتم مطالبتك بتعيين كلمة مرور جديدة وآمنة'
      ],
      validityInfo: `صالحة حتى: ${expiryTime}`,
      securityNote: 'لا تشارك كلمة المرور هذه مع أي شخص. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا الإيميل.',
      primaryColor: '#667eea',
      gradientColors: ['#667eea', '#764ba2']
    };
  },

  /**
   * رمز التحقق الثنائي
   */
  twoFactorCode: (code: string, codeType: string = 'login', expiresInMinutes: number = 15): UnifiedEmailData => {
    const operations = {
      login: 'تسجيل الدخول',
      enable_2fa: 'تفعيل المصادقة الثنائية',
      disable_2fa: 'إلغاء المصادقة الثنائية'
    };
    
    const operationType = operations[codeType as keyof typeof operations] || operations.login;

    return {
      title: 'رمز التحقق الثنائي - رزقي',
      heading: 'رمز التحقق الثنائي',
      icon: '🛡️',
      greeting: 'السلام عليكم،',
      description: `تم طلب رمز تحقق ثنائي لـ ${operationType} في موقع رزقي للزواج الإسلامي. استخدم الرمز أدناه لإكمال العملية:`,
      mainContent: code,
      mainContentType: 'code',
      mainContentLabel: 'رمز التحقق',
      validityInfo: `صالح لمدة ${expiresInMinutes} دقيقة فقط`,
      securityNote: 'لا تشارك هذا الرمز مع أي شخص. إذا لم تطلب هذه العملية، يرجى تجاهل هذا الإيميل.',
      gradientColors: ['#2563eb', '#1d4ed8']
    };
  },

  /**
   * تأكيد تغيير بيانات التواصل
   */
  contactChangeConfirmation: (
    confirmationUrl: string,
    changeType: 'email' | 'phone' | 'both',
    oldValue?: string,
    newValue?: string
  ): UnifiedEmailData => {
    const titles = {
      email: 'تأكيد تغيير البريد الإلكتروني - رزقي',
      phone: 'تأكيد تغيير رقم الهاتف - رزقي',
      both: 'تأكيد تغيير بيانات التواصل - رزقي'
    };

    const headings = {
      email: 'تأكيد تغيير البريد الإلكتروني',
      phone: 'تأكيد تغيير رقم الهاتف',
      both: 'تأكيد تغيير بيانات التواصل'
    };

    const descriptions = {
      email: 'تم طلب تغيير البريد الإلكتروني لحسابك في موقع رزقي للزواج الإسلامي. اضغط على الزر أدناه لتأكيد التغيير:',
      phone: 'تم طلب تغيير رقم الهاتف لحسابك في موقع رزقي للزواج الإسلامي. اضغط على الزر أدناه لتأكيد التغيير:',
      both: 'تم طلب تغيير البريد الإلكتروني ورقم الهاتف لحسابك في موقع رزقي للزواج الإسلامي. اضغط على الزر أدناه لتأكيد التغيير:'
    };

    const icons = {
      email: '📧',
      phone: '📱',
      both: '📧📱'
    };

    return {
      title: titles[changeType],
      heading: headings[changeType],
      icon: icons[changeType],
      greeting: 'السلام عليكم،',
      description: descriptions[changeType],
      mainContent: confirmationUrl,
      mainContentType: 'button',
      mainContentLabel: 'تأكيد التغيير',
      validityInfo: 'صالح لمدة 4 ساعات فقط',
      securityNote: 'إذا لم تطلب هذا التغيير، يرجى تجاهل هذا الإيميل وتغيير كلمة المرور فوراً.',
      gradientColors: ['#059669', '#047857']
    };
  },

  /**
   * إشعار تسجيل دخول ناجح
   */
  successfulLogin: (loginData: {
    timestamp: string;
    ipAddress?: string;
    location?: string;
    deviceType?: string;
    browser?: string;
  }): UnifiedEmailData => {
    const loginTime = new Date(loginData.timestamp).toLocaleString('ar-EG', {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let deviceInfo = '';
    if (loginData.browser || loginData.deviceType) {
      deviceInfo = `الجهاز: ${loginData.deviceType || 'غير محدد'} - المتصفح: ${loginData.browser || 'غير محدد'}`;
    }

    let locationInfo = '';
    if (loginData.location || loginData.ipAddress) {
      locationInfo = `الموقع: ${loginData.location || 'غير محدد'} - IP: ${loginData.ipAddress || 'غير محدد'}`;
    }

    return {
      title: 'تسجيل دخول ناجح - رزقي',
      heading: 'تسجيل دخول ناجح',
      icon: '✅',
      greeting: 'السلام عليكم ورحمة الله وبركاته،',
      description: 'تم تسجيل دخول ناجح إلى حسابك في موقع رزقي للزواج الإسلامي. إليك تفاصيل عملية تسجيل الدخول:',
      mainContent: `🕐 ${loginTime}`,
      mainContentType: 'text',
      mainContentLabel: 'وقت تسجيل الدخول',
      additionalInfo: [deviceInfo, locationInfo].filter(Boolean).join('\n'),
      securityNote: 'إذا لم تقم بتسجيل الدخول هذا، يرجى تغيير كلمة المرور فوراً والتواصل مع فريق الدعم.',
      gradientColors: ['#059669', '#047857']
    };
  }
};
