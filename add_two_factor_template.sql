-- إدراج قالب رمز التحقق الثنائي في قاعدة البيانات
-- هذا القالب يستخدمه النظام عند إرسال رمز التحقق الثنائي

BEGIN;

-- إدراج نوع الإشعار أولاً
INSERT INTO email_notification_types (name, name_ar, name_en, description_ar, description_en, is_active, created_at, updated_at)
VALUES (
    'two_factor_verification',
    'رمز التحقق الثنائي',
    'Two-Factor Authentication Code',
    'إشعار إرسال رمز التحقق الثنائي للمصادقة',
    'Notification for sending two-factor authentication code',
    true,
    NOW(),
    NOW()
);

-- إدراج قالب رمز التحقق الثنائي - النسخة العربية
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
    'two_factor_verification',
    'رمز التحقق الثنائي',
    'Two-Factor Authentication Code',
    'رمز التحقق الثنائي - رزقي',
    'Two-Factor Authentication Code - Rezge',
    'رمز التحقق الثنائي - رزقي

مرحباً بك،

تم طلب رمز تحقق ثنائي لحسابك. استخدم الرمز التالي لإكمال العملية:

رمز التحقق: {{code}}

هذا الرمز صالح لمدة {{expiresInMinutes}} دقيقة فقط.

لا تشارك هذا الرمز مع أي شخص آخر. إذا لم تطلب هذا الرمز، يرجى تجاهل هذا الإيميل.

---
فريق رزقي - موقع الزواج الإسلامي الشرعي',
    'Two-Factor Authentication Code - Rezge

Hello,

A two-factor authentication code has been requested for your account. Use the following code to complete the process:

Verification Code: {{code}}

This code is valid for {{expiresInMinutes}} minutes only.

Do not share this code with anyone. If you didn''t request this code, please ignore this email.

---
Rezge Team - Islamic Marriage Platform',
    '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>رمز التحقق الثنائي - رزقي</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            color: #667eea;
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
        .code-display {
            background-color: #f3f4f6;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 25px 0;
            border: 2px dashed #667eea;
        }
        .code-display h1 {
            color: #667eea;
            font-size: 36px;
            letter-spacing: 8px;
            margin: 0;
            font-family: monospace;
            font-weight: bold;
        }
        .instructions {
            background: #e0e7ff;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            border-right: 4px solid #667eea;
        }
        .instructions h3 {
            color: #4338ca;
            font-size: 18px;
            margin: 0 0 15px 0;
        }
        .instructions p {
            color: #4338ca;
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
            .code-display h1 {
                font-size: 28px;
                letter-spacing: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">🔐 رزقي</h1>
            <p class="tagline">رمز التحقق الثنائي</p>
        </div>
        
        <div class="content">
            <h2>🔐 رمز التحقق الثنائي</h2>
            
            <p>مرحباً بك،</p>
            <p>تم طلب رمز تحقق ثنائي لحسابك. استخدم الرمز التالي لإكمال العملية:</p>

            <div class="code-display">
                <h1>{{code}}</h1>
            </div>

            <div class="instructions">
                <h3>⏰ مدة الصلاحية:</h3>
                <p>هذا الرمز صالح لمدة {{expiresInMinutes}} دقيقة فقط</p>
            </div>

            <div class="warning">
                <p>🔒 تنبيه أمني مهم:</p>
                <p class="note">لا تشارك هذا الرمز مع أي شخص آخر. إذا لم تطلب هذا الرمز، يرجى تجاهل هذا الإيميل.</p>
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
    <title>Two-Factor Authentication Code - Rezge</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            color: #667eea;
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
        .code-display {
            background-color: #f3f4f6;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 25px 0;
            border: 2px dashed #667eea;
        }
        .code-display h1 {
            color: #667eea;
            font-size: 36px;
            letter-spacing: 8px;
            margin: 0;
            font-family: monospace;
            font-weight: bold;
        }
        .instructions {
            background: #e0e7ff;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            border-left: 4px solid #667eea;
        }
        .instructions h3 {
            color: #4338ca;
            font-size: 18px;
            margin: 0 0 15px 0;
        }
        .instructions p {
            color: #4338ca;
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
            .code-display h1 {
                font-size: 28px;
                letter-spacing: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">🔐 Rezge</h1>
            <p class="tagline">Two-Factor Authentication</p>
        </div>
        
        <div class="content">
            <h2>🔐 Two-Factor Authentication Code</h2>
            
            <p>Hello,</p>
            <p>A two-factor authentication code has been requested for your account. Use the following code to complete the process:</p>

            <div class="code-display">
                <h1>{{code}}</h1>
            </div>

            <div class="instructions">
                <h3>⏰ Validity Period:</h3>
                <p>This code is valid for {{expiresInMinutes}} minutes only</p>
            </div>

            <div class="warning">
                <p>🔒 Important Security Alert:</p>
                <p class="note">Do not share this code with anyone. If you didn''t request this code, please ignore this email.</p>
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
    'تم إدراج قالب رمز التحقق الثنائي بنجاح' as status;

SELECT 
    name,
    name_ar,
    name_en,
    subject_ar,
    subject_en,
    is_active,
    created_at
FROM email_templates 
WHERE name = 'two_factor_verification';

SELECT 
    name,
    name_ar,
    name_en,
    description_ar,
    description_en,
    is_active,
    created_at
FROM email_notification_types 
WHERE name = 'two_factor_verification';

COMMIT;





