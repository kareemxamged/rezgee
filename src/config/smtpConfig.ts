// إعدادات SMTP المستقلة
// هذا الملف يحتوي على إعدادات البريد الإلكتروني المستقلة

export interface SMTPSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  senderName: string;
  senderEmail: string;
  enabled: boolean;
}

// إعدادات SMTP الافتراضية
export const DEFAULT_SMTP_CONFIG: SMTPSettings = {
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  user: 'manage@kareemamged.com',
  pass: '', // يجب تعيينها من قاعدة البيانات أو متغيرات البيئة
  senderName: 'رزجة - موقع الزواج الإسلامي',
  senderEmail: 'manage@kareemamged.com',
  enabled: true
};

// إعدادات خدمات البريد الإلكتروني البديلة
export const EMAIL_SERVICES = {
  // Web3Forms
  WEB3FORMS: {
    name: 'Web3Forms',
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: '', // يجب تعيينها
    enabled: false
  },

  // EmailJS
  EMAILJS: {
    name: 'EmailJS',
    endpoint: 'https://api.emailjs.com/api/v1.0/email/send',
    serviceId: '', // يجب تعيينها
    templateId: '', // يجب تعيينها
    userId: '', // يجب تعيينها
    enabled: false
  },

  // Formspree
  FORMSPREE: {
    name: 'Formspree',
    endpoint: 'https://formspree.io/f/',
    formId: '', // يجب تعيينها
    enabled: false
  },

  // Resend
  RESEND: {
    name: 'Resend',
    endpoint: 'https://api.resend.com/emails',
    apiKey: '', // يجب تعيينها
    enabled: false
  }
};

// دالة للحصول على إعدادات SMTP من قاعدة البيانات
export async function getSMTPConfigFromDatabase(): Promise<SMTPSettings | null> {
  try {
    // يمكن تطوير هذه الدالة للحصول على الإعدادات من قاعدة البيانات
    // const { data } = await supabase.from('smtp_settings').select('*').single();
    
    // للآن، نستخدم الإعدادات الافتراضية
    return DEFAULT_SMTP_CONFIG;
  } catch (error) {
    console.error('Error fetching SMTP config:', error);
    return null;
  }
}

// دالة للتحقق من صحة إعدادات SMTP
export function validateSMTPConfig(config: SMTPSettings): boolean {
  return !!(
    config.host &&
    config.port &&
    config.user &&
    config.senderEmail &&
    config.senderName
  );
}

// دالة لاختبار اتصال SMTP
export async function testSMTPConnection(config: SMTPSettings): Promise<boolean> {
  try {
    // هذه دالة وهمية - في التطبيق الحقيقي يجب اختبار الاتصال الفعلي
    if (!validateSMTPConfig(config)) {
      return false;
    }

    // محاولة إرسال إيميل اختبار
    console.log('Testing SMTP connection to:', config.host);
    
    // في التطبيق الحقيقي، يجب إجراء اختبار فعلي للاتصال
    return true;
  } catch (error) {
    console.error('SMTP connection test failed:', error);
    return false;
  }
}

// قوالب الإيميل
export const EMAIL_TEMPLATES = {
  VERIFICATION: {
    subject: {
      ar: 'تأكيد إنشاء حسابك في رزجة',
      en: 'Confirm Your Account - Rezge'
    },
    getHTML: (verificationUrl: string, userData: any, language: string = 'ar') => {
      if (language === 'ar') {
        return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد إنشاء حسابك في رزجة</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        body { margin: 0; padding: 0; font-family: 'Amiri', serif; }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Amiri', serif; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 40px 20px; min-height: 100vh;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">رزجة</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">موقع الزواج الإسلامي الشرعي</p>
        </div>
        
        <div style="padding: 40px 30px;">
            <h2 style="color: #1e40af; font-size: 24px; margin: 0 0 20px 0; text-align: center;">مرحباً بك في رزجة!</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                أهلاً وسهلاً ${userData.first_name} ${userData.last_name}،<br><br>
                نشكرك على انضمامك إلى موقع رزجة للزواج الإسلامي الشرعي. لإكمال إنشاء حسابك، يرجى النقر على الرابط أدناه لتعيين كلمة المرور:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);">تأكيد الحساب وتعيين كلمة المرور</a>
            </div>
            
            <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin: 20px 0; border-right: 4px solid #1e40af;">
                <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 10px 0;">معلومات مهمة:</h3>
                <ul style="color: #374151; margin: 0; padding-right: 20px; line-height: 1.6;">
                    <li>هذا الرابط صالح لمدة 24 ساعة فقط</li>
                    <li>لا تشارك هذا الرابط مع أي شخص آخر</li>
                    <li>إذا لم تطلب إنشاء حساب، يرجى تجاهل هذا الإيميل</li>
                </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 10px; padding: 15px; margin: 20px 0; text-align: center;">
                <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: bold;">إذا لم تستطع النقر على الرابط، انسخ والصق الرابط التالي في متصفحك:</p>
                <p style="color: #1e40af; font-size: 12px; word-break: break-all; margin: 10px 0 0 0; background: white; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
            </div>
        </div>
        
        <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">© 2025 رزجة - موقع الزواج الإسلامي الشرعي</p>
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">هذا الإيميل تم إرساله تلقائياً، يرجى عدم الرد عليه</p>
        </div>
    </div>
</body>
</html>
        `;
      } else {
        // English template
        return `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Account - Rezge</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 40px 20px; min-height: 100vh;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">Rezge</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Islamic Marriage Platform</p>
        </div>
        
        <div style="padding: 40px 30px;">
            <h2 style="color: #1e40af; font-size: 24px; margin: 0 0 20px 0; text-align: center;">Welcome to Rezge!</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hello ${userData.first_name} ${userData.last_name},<br><br>
                Thank you for joining Rezge Islamic Marriage Platform. To complete your account creation, please click the link below to set your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);">Confirm Account & Set Password</a>
            </div>
        </div>
        
        <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">© 2025 Rezge - Islamic Marriage Platform</p>
        </div>
    </div>
</body>
</html>
        `;
      }
    }
  }
};

export default {
  DEFAULT_SMTP_CONFIG,
  EMAIL_SERVICES,
  getSMTPConfigFromDatabase,
  validateSMTPConfig,
  testSMTPConnection,
  EMAIL_TEMPLATES
};
