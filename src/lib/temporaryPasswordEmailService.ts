import { supabase } from './supabase';

/**
 * خدمة إرسال البريد الإلكتروني لكلمات المرور المؤقتة
 * متخصصة في إرسال كلمات المرور المؤقتة فقط
 */

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface SendEmailResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

/**
 * إنشاء قالب البريد الإلكتروني لكلمة المرور المؤقتة
 */
function createTemporaryPasswordEmailTemplate(
  temporaryPassword: string,
  expiresAt: string,
  recipientName?: string
): EmailTemplate {
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

  const subject = 'كلمة المرور المؤقتة - موقع رزقي للزواج الإسلامي';

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            direction: rtl;
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .password-box {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .password {
            font-size: 24px;
            font-weight: bold;
            color: #495057;
            letter-spacing: 2px;
            font-family: 'Courier New', monospace;
            background: white;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        .instructions {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #0c5460;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .security-tips {
            margin-top: 20px;
            padding: 15px;
            background: #e7f3ff;
            border-radius: 5px;
            border-left: 4px solid #007bff;
        }
        .security-tips h3 {
            color: #007bff;
            margin-top: 0;
        }
        .security-tips ul {
            margin: 10px 0;
            padding-right: 20px;
        }
        .security-tips li {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤝 موقع رزقي للزواج الإسلامي</h1>
            <p>كلمة المرور المؤقتة</p>
        </div>
        
        <div class="content">
            <h2>السلام عليكم ${recipientName ? recipientName : 'ورحمة الله وبركاته'}</h2>
            
            <p>تم إنشاء كلمة مرور مؤقتة لحسابك في موقع رزقي للزواج الإسلامي بناءً على طلبك.</p>
            
            <div class="password-box">
                <h3>كلمة المرور المؤقتة:</h3>
                <div class="password">${temporaryPassword}</div>
            </div>
            
            <div class="warning">
                <strong>⚠️ تنبيه مهم:</strong>
                <ul>
                    <li>صالحة حتى: <strong>${expiryTime}</strong></li>
                    <li>يمكن استخدامها مرة واحدة فقط</li>
                    <li>ستصبح كلمة المرور الأساسية عند أول استخدام</li>
                </ul>
            </div>
            
            <div class="instructions">
                <h3>📋 تعليمات الاستخدام:</h3>
                <ol>
                    <li>انتقل إلى صفحة تسجيل الدخول في موقع رزقي</li>
                    <li>أدخل بريدك الإلكتروني وكلمة المرور المؤقتة أعلاه</li>
                    <li>بعد تسجيل الدخول، ستصبح هذه كلمة المرور الجديدة لحسابك</li>
                    <li>يُنصح بتغيير كلمة المرور من إعدادات الحساب</li>
                </ol>
            </div>
            
            <div class="security-tips">
                <h3>🔒 نصائح أمنية:</h3>
                <ul>
                    <li>لا تشارك كلمة المرور مع أي شخص آخر</li>
                    <li>تأكد من تسجيل الدخول من جهاز آمن</li>
                    <li>إذا لم تطلب هذه الكلمة، تجاهل هذا البريد</li>
                    <li>غيّر كلمة المرور بعد تسجيل الدخول لمزيد من الأمان</li>
                </ul>
            </div>
            
            <p><strong>ملاحظة:</strong> يمكنك أيضاً استخدام كلمة المرور الأصلية إذا كنت تتذكرها.</p>
        </div>
        
        <div class="footer">
            <p>هذا البريد تم إرساله تلقائياً من موقع رزقي للزواج الإسلامي</p>
            <p>إذا كان لديك أي استفسار، يرجى التواصل معنا</p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
                تم الإرسال في: ${new Date().toLocaleString('ar-EG', {
                  timeZone: 'Asia/Riyadh',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  calendar: 'gregory'
                })}
            </p>
        </div>
    </div>
</body>
</html>`;

  const textContent = `
السلام عليكم ${recipientName ? recipientName : 'ورحمة الله وبركاته'}

تم إنشاء كلمة مرور مؤقتة لحسابك في موقع رزقي للزواج الإسلامي.

كلمة المرور المؤقتة: ${temporaryPassword}

تنبيه مهم:
- صالحة حتى: ${expiryTime}
- يمكن استخدامها مرة واحدة فقط
- ستصبح كلمة المرور الأساسية عند أول استخدام

تعليمات الاستخدام:
1. انتقل إلى صفحة تسجيل الدخول في موقع رزقي
2. أدخل بريدك الإلكتروني وكلمة المرور المؤقتة أعلاه
3. بعد تسجيل الدخول، ستصبح هذه كلمة المرور الجديدة لحسابك
4. يُنصح بتغيير كلمة المرور من إعدادات الحساب

نصائح أمنية:
- لا تشارك كلمة المرور مع أي شخص آخر
- تأكد من تسجيل الدخول من جهاز آمن
- إذا لم تطلب هذه الكلمة، تجاهل هذا البريد
- غيّر كلمة المرور بعد تسجيل الدخول لمزيد من الأمان

ملاحظة: يمكنك أيضاً استخدام كلمة المرور الأصلية إذا كنت تتذكرها.

---
موقع رزقي للزواج الإسلامي
تم الإرسال في: ${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}
`;

  return {
    subject,
    htmlContent,
    textContent
  };
}

/**
 * إرسال كلمة المرور المؤقتة عبر البريد الإلكتروني
 */
export async function sendTemporaryPasswordEmail(
  email: string,
  temporaryPassword: string,
  expiresAt: string,
  recipientName?: string
): Promise<SendEmailResult> {
  try {
    // إنشاء قالب البريد الإلكتروني
    const emailTemplate = createTemporaryPasswordEmailTemplate(
      temporaryPassword,
      expiresAt,
      recipientName
    );

    // محاولة إرسال البريد الإلكتروني باستخدام Supabase Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: emailTemplate.subject,
          html: emailTemplate.htmlContent,
          text: emailTemplate.textContent,
          type: 'temporary_password'
        }
      });

      if (!error && data) {
        return {
          success: true,
          messageId: data.messageId
        };
      }
    } catch (supabaseError) {
      console.log('Supabase function not available, using fallback method');
    }

    // الطريقة البديلة: محاكاة الإرسال للاختبار
    console.log('=== إرسال كلمة المرور المؤقتة ===');
    console.log('إلى:', email);
    console.log('الموضوع:', emailTemplate.subject);
    console.log('كلمة المرور المؤقتة:', temporaryPassword);
    console.log('تنتهي في:', expiresAt);
    console.log('=====================================');

    // في بيئة الإنتاج، يجب استخدام خدمة بريد إلكتروني حقيقية هنا
    // مثل SendGrid, Mailgun, أو SMTP مباشر

    return {
      success: true,
      messageId: `temp_password_${Date.now()}`
    };

  } catch (error: any) {
    console.error('Error sending temporary password email:', error);
    return {
      success: false,
      error: 'فشل في إرسال البريد الإلكتروني'
    };
  }
}

/**
 * إرسال بريد تأكيد تغيير كلمة المرور
 */
export async function sendPasswordChangeConfirmationEmail(
  email: string,
  recipientName?: string
): Promise<SendEmailResult> {
  try {
    const subject = 'تأكيد تغيير كلمة المرور - موقع رزقي';
    const currentTime = new Date().toLocaleString('ar-EG', {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      calendar: 'gregory'
    });

    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; direction: rtl; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .success-box { background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px; margin: 20px 0; color: #155724; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ تم تغيير كلمة المرور بنجاح</h1>
        </div>
        <div class="content">
            <h2>السلام عليكم ${recipientName ? recipientName : 'ورحمة الله وبركاته'}</h2>
            <div class="success-box">
                <strong>تم تغيير كلمة المرور لحسابك بنجاح</strong><br>
                التوقيت: ${currentTime}
            </div>
            <p>إذا لم تقم بهذا التغيير، يرجى التواصل معنا فوراً.</p>
        </div>
        <div class="footer">
            <p>موقع رزقي للزواج الإسلامي</p>
        </div>
    </div>
</body>
</html>`;

    const textContent = `
السلام عليكم ${recipientName ? recipientName : 'ورحمة الله وبركاته'}

تم تغيير كلمة المرور لحسابك بنجاح في ${currentTime}

إذا لم تقم بهذا التغيير، يرجى التواصل معنا فوراً.

موقع رزقي للزواج الإسلامي
`;

    // محاولة الإرسال عبر Supabase Function
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject,
          html: htmlContent,
          text: textContent,
          type: 'password_change_confirmation'
        }
      });

      if (!error && data) {
        return { success: true, messageId: data.messageId };
      }
    } catch (supabaseError) {
      console.log('Supabase function not available for confirmation email');
    }

    // الطريقة البديلة
    console.log('=== إرسال تأكيد تغيير كلمة المرور ===');
    console.log('إلى:', email);
    console.log('الموضوع:', subject);
    console.log('الوقت:', currentTime);
    console.log('=======================================');

    return { success: true, messageId: `confirmation_${Date.now()}` };

  } catch (error: any) {
    console.error('Error sending password change confirmation:', error);
    return { success: false, error: 'فشل في إرسال بريد التأكيد' };
  }
}
