-- إدراج قالب كلمة المرور المؤقتة في قاعدة البيانات (نسخة مبسطة)
-- هذا القالب يستخدمه صفحة "نسيت كلمة المرور"

BEGIN;

-- إدراج نوع الإشعار أولاً (بدون ON CONFLICT)
INSERT INTO email_notification_types (name, name_ar, name_en, description_ar, description_en, is_active, created_at, updated_at)
VALUES (
    'temporary_password',
    'كلمة المرور المؤقتة',
    'Temporary Password',
    'إشعار إرسال كلمة مرور مؤقتة لإعادة تعيين كلمة المرور',
    'Notification for sending temporary password for password reset',
    true,
    NOW(),
    NOW()
);

-- إدراج قالب كلمة المرور المؤقتة - النسخة العربية (بدون ON CONFLICT)
INSERT INTO email_templates (
    name,
    name_ar,
    name_en,
    subject_ar,
    subject_en,
    content_ar,
    content_en,
    html_template_ar,
    html_template_en,
    is_active,
    created_at,
    updated_at
) VALUES (
    'temporary_password',
    'كلمة المرور المؤقتة',
    'Temporary Password',
    'كلمة المرور المؤقتة - رزقي',
    'Temporary Password - Rezge',
    'السلام عليكم {{recipientName}}،

تم إنشاء كلمة مرور مؤقتة لحسابك في موقع رزقي للزواج الإسلامي. استخدم كلمة المرور أدناه لتسجيل الدخول وتعيين كلمة مرور جديدة:

كلمة المرور المؤقتة: {{temporaryPassword}}

تعليمات الاستخدام:
1. اذهب إلى صفحة تسجيل الدخول في موقع رزقي
2. أدخل بريدك الإلكتروني وكلمة المرور المؤقتة أعلاه
3. ستتم مطالبتك بتعيين كلمة مرور جديدة وآمنة

صالحة حتى: {{expiryTime}}

ملاحظة أمنية: لا تشارك كلمة المرور هذه مع أي شخص. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا الإيميل.

---
فريق رزقي - موقع الزواج الإسلامي الشرعي
https://rezge.com',
    'Hello {{recipientName}},

A temporary password has been created for your Rezge Islamic marriage account. Use the password below to log in and set a new password:

Temporary Password: {{temporaryPassword}}

Usage Instructions:
1. Go to the Rezge login page
2. Enter your email and the temporary password above
3. You will be prompted to set a new secure password

Valid until: {{expiryTime}}

Security Note: Do not share this password with anyone. If you didn''t request a password reset, please ignore this email.

---
Rezge Team - Islamic Marriage Platform
https://rezge.com',
    '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>كلمة المرور المؤقتة - رزقي</title>
    <style>
        @import url(''https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap'');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            margin: 0;
            padding: 0;
            font-family: ''Amiri'', serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 40px 20px;
            min-height: 100vh;
            line-height: 1.6;
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
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin: 0;
        }
        .tagline {
            font-size: 16px;
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #1e40af;
            font-size: 24px;
            margin: 0 0 20px 0;
            text-align: center;
        }
        .content p {
            color: #374151;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 15px 0;
        }
        .password-display {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        .password-display h1 {
            color: #2563eb;
            font-size: 32px;
            letter-spacing: 5px;
            margin: 0;
            font-family: monospace;
        }
        .instructions {
            background: #dcfce7;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            border-right: 4px solid #16a34a;
        }
        .instructions h3 {
            color: #166534;
            font-size: 18px;
            margin: 0 0 15px 0;
        }
        .instructions p {
            color: #166534;
            line-height: 1.8;
            font-size: 15px;
            margin: 8px 0;
        }
        .warning {
            background: #fef3c7;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            border-right: 4px solid #f59e0b;
        }
        .warning p {
            color: #92400e;
            margin: 0 0 10px 0;
            font-weight: bold;
        }
        .warning .note {
            color: #92400e;
            margin: 0;
            line-height: 1.6;
            font-size: 14px;
            font-weight: normal;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        .footer .small {
            font-size: 12px;
            margin: 5px 0 0 0;
            opacity: 0.8;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 15px;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .content h2 {
                font-size: 20px;
            }
            .password-display h1 {
                font-size: 24px;
                letter-spacing: 3px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">رزقي</h1>
            <p class="tagline">منصة الزواج الإسلامي الشرعي</p>
        </div>
        
        <div class="content">
            <h2>🔑 كلمة المرور المؤقتة</h2>
            
            <p>السلام عليكم {{recipientName}}،</p>
            <p>تم إنشاء كلمة مرور مؤقتة لحسابك في موقع رزقي للزواج الإسلامي. استخدم كلمة المرور أدناه لتسجيل الدخول وتعيين كلمة مرور جديدة:</p>

            <div class="password-display">
                <h1>{{temporaryPassword}}</h1>
            </div>

            <div class="instructions">
                <h3>📋 تعليمات الاستخدام:</h3>
                <p>1. اذهب إلى صفحة تسجيل الدخول في موقع رزقي</p>
                <p>2. أدخل بريدك الإلكتروني وكلمة المرور المؤقتة أعلاه</p>
                <p>3. ستتم مطالبتك بتعيين كلمة مرور جديدة وآمنة</p>
            </div>

            <div class="warning">
                <p>⏰ صالحة حتى: {{expiryTime}}</p>
                <p class="note">ملاحظة أمنية: لا تشارك كلمة المرور هذه مع أي شخص. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا الإيميل.</p>
            </div>
        </div>

        <div class="footer">
            <p>فريق رزقي - موقع الزواج الإسلامي الشرعي</p>
            <p class="small">هذا إيميل تلقائي، يرجى عدم الرد عليه مباشرة</p>
        </div>
    </div>
</body>
</html>',
    '<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Temporary Password - Rezge</title>
    <style>
        @import url(''https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            margin: 0;
            padding: 0;
            font-family: ''Inter'', sans-serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 40px 20px;
            min-height: 100vh;
            line-height: 1.6;
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
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin: 0;
        }
        .tagline {
            font-size: 16px;
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #1e40af;
            font-size: 24px;
            margin: 0 0 20px 0;
            text-align: center;
        }
        .content p {
            color: #374151;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 15px 0;
        }
        .password-display {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        .password-display h1 {
            color: #2563eb;
            font-size: 32px;
            letter-spacing: 5px;
            margin: 0;
            font-family: monospace;
        }
        .instructions {
            background: #dcfce7;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            border-left: 4px solid #16a34a;
        }
        .instructions h3 {
            color: #166534;
            font-size: 18px;
            margin: 0 0 15px 0;
        }
        .instructions p {
            color: #166534;
            line-height: 1.8;
            font-size: 15px;
            margin: 8px 0;
        }
        .warning {
            background: #fef3c7;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #f59e0b;
        }
        .warning p {
            color: #92400e;
            margin: 0 0 10px 0;
            font-weight: bold;
        }
        .warning .note {
            color: #92400e;
            margin: 0;
            line-height: 1.6;
            font-size: 14px;
            font-weight: normal;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        .footer .small {
            font-size: 12px;
            margin: 5px 0 0 0;
            opacity: 0.8;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 15px;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .content h2 {
                font-size: 20px;
            }
            .password-display h1 {
                font-size: 24px;
                letter-spacing: 3px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">Rezge</h1>
            <p class="tagline">Islamic Marriage Platform</p>
        </div>
        
        <div class="content">
            <h2>🔑 Temporary Password</h2>
            
            <p>Hello {{recipientName}},</p>
            <p>A temporary password has been created for your Rezge Islamic marriage account. Use the password below to log in and set a new password:</p>

            <div class="password-display">
                <h1>{{temporaryPassword}}</h1>
            </div>

            <div class="instructions">
                <h3>📋 Usage Instructions:</h3>
                <p>1. Go to the Rezge login page</p>
                <p>2. Enter your email and the temporary password above</p>
                <p>3. You will be prompted to set a new secure password</p>
            </div>

            <div class="warning">
                <p>⏰ Valid until: {{expiryTime}}</p>
                <p class="note">Security Note: Do not share this password with anyone. If you didn''t request a password reset, please ignore this email.</p>
            </div>
        </div>

        <div class="footer">
            <p>Rezge Team - Islamic Marriage Platform</p>
            <p class="small">This is an automated email, please do not reply directly</p>
        </div>
    </div>
</body>
</html>',
    true,
    NOW(),
    NOW()
);

-- عرض النتائج
SELECT 
    'تم إدراج قالب كلمة المرور المؤقتة بنجاح' as status;

SELECT 
    name,
    name_ar,
    name_en,
    subject_ar,
    subject_en,
    is_active,
    created_at
FROM email_templates 
WHERE name = 'temporary_password';

SELECT 
    name,
    name_ar,
    name_en,
    description_ar,
    description_en,
    is_active,
    created_at
FROM email_notification_types 
WHERE name = 'temporary_password';

COMMIT;







