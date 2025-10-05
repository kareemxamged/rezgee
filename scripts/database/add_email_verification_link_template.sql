-- إضافة قالب إيميل رابط التحقق بعد إنشاء الحساب
-- Add Email Verification Link Template After Account Creation

-- إدراج نوع الإشعار
INSERT INTO email_notification_types (
    name,
    name_ar,
    name_en,
    description_ar,
    description_en,
    is_active,
    created_at,
    updated_at
) VALUES (
    'email_verification_link',
    'رابط التحقق من الإيميل',
    'Email Verification Link',
    'إشعار يتم إرساله بعد إنشاء حساب جديد يحتوي على رابط التحقق وتعيين كلمة المرور',
    'Notification sent after creating a new account containing verification link and password setup',
    true,
    NOW(),
    NOW()
);

-- إدراج قالب الإيميل العربي
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
    'email_verification_link',
    'رابط التحقق من الإيميل',
    'Email Verification Link',
    'تأكيد إنشاء حسابك في رزقي - {{firstName}}',
    'Confirm Your Account - {{firstName}}',
    'مرحباً {{firstName}}،

نشكرك على انضمامك إلى موقع رزقي للزواج الإسلامي الشرعي.

اضغط على الرابط أدناه لتأكيد حسابك وتعيين كلمة المرور:
{{verificationUrl}}

هذا الرابط صالح لمدة 24 ساعة فقط.

لا تشارك هذا الرابط مع أي شخص. إذا لم تطلب إنشاء حساب، يرجى تجاهل هذا الإيميل.

فريق رزقي - موقع الزواج الإسلامي الشرعي',
    'Hello {{firstName}},

Thank you for joining Rezge Islamic Marriage Platform.

Click the link below to confirm your account and set your password:
{{verificationUrl}}

This link is valid for 24 hours only.

Do not share this link with anyone. If you didn''t request account creation, please ignore this email.

Rezge Team - Islamic Marriage Platform',
    '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد إنشاء حسابك في رزقي</title>
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
            background: linear-gradient(135deg, #1e40af 0%, #059669 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin: 0 0 10px 0;
        }
        .tagline {
            font-size: 16px;
            opacity: 0.9;
            margin: 0;
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
            margin: 0 0 20px 0;
        }
        .button {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: white;
            padding: 18px 35px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: bold;
            font-size: 18px;
            display: inline-block;
            box-shadow: 0 6px 20px rgba(5, 150, 105, 0.3);
            transition: all 0.3s ease;
            text-align: center;
            margin: 20px 0;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4);
        }
        .warning {
            background: #fef3c7;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            border-right: 4px solid #f59e0b;
        }
        .warning p {
            color: #92400e;
            margin: 0 0 10px 0;
            font-weight: bold;
        }
        .warning p:last-child {
            margin: 0;
            font-weight: normal;
            font-size: 14px;
        }
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            color: #6b7280;
            font-size: 14px;
            margin: 0;
        }
        .footer .small {
            font-size: 12px;
            margin-top: 10px;
            opacity: 0.8;
        }
        @media (max-width: 600px) {
            .container {
                margin: 0 10px;
                border-radius: 15px;
            }
            .header, .content, .footer {
                padding: 30px 20px;
            }
            .logo {
                font-size: 28px;
            }
            .content h2 {
                font-size: 20px;
            }
            .button {
                padding: 15px 25px;
                font-size: 16px;
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
            <h2>🎉 مرحباً بك في رزقي!</h2>
            
            <p>أهلاً وسهلاً {{firstName}}،</p>
            
            <p>نشكرك على انضمامك إلى موقع رزقي للزواج الإسلامي الشرعي. اضغط على الزر أدناه لتأكيد حسابك وتعيين كلمة المرور:</p>
            
            <div style="text-align: center;">
                <a href="{{verificationUrl}}" class="button">✅ تأكيد الحساب</a>
            </div>
            
            <div class="warning">
                <p>⏰ صالح لمدة 24 ساعة فقط</p>
                <p>لا تشارك هذا الرابط مع أي شخص. إذا لم تطلب إنشاء حساب، يرجى تجاهل هذا الإيميل.</p>
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
    <title>Confirm Your Account - Rezge</title>
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
            background: linear-gradient(135deg, #1e40af 0%, #059669 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin: 0 0 10px 0;
        }
        .tagline {
            font-size: 16px;
            opacity: 0.9;
            margin: 0;
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
            margin: 0 0 20px 0;
        }
        .button {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: white;
            padding: 18px 35px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: bold;
            font-size: 18px;
            display: inline-block;
            box-shadow: 0 6px 20px rgba(5, 150, 105, 0.3);
            transition: all 0.3s ease;
            text-align: center;
            margin: 20px 0;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4);
        }
        .warning {
            background: #fef3c7;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            border-left: 4px solid #f59e0b;
        }
        .warning p {
            color: #92400e;
            margin: 0 0 10px 0;
            font-weight: bold;
        }
        .warning p:last-child {
            margin: 0;
            font-weight: normal;
            font-size: 14px;
        }
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            color: #6b7280;
            font-size: 14px;
            margin: 0;
        }
        .footer .small {
            font-size: 12px;
            margin-top: 10px;
            opacity: 0.8;
        }
        @media (max-width: 600px) {
            .container {
                margin: 0 10px;
                border-radius: 15px;
            }
            .header, .content, .footer {
                padding: 30px 20px;
            }
            .logo {
                font-size: 28px;
            }
            .content h2 {
                font-size: 20px;
            }
            .button {
                padding: 15px 25px;
                font-size: 16px;
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
            <h2>🎉 Welcome to Rezge!</h2>
            
            <p>Hello {{firstName}},</p>
            
            <p>Thank you for joining Rezge Islamic Marriage Platform. Click the button below to confirm your account and set your password:</p>
            
            <div style="text-align: center;">
                <a href="{{verificationUrl}}" class="button">✅ Confirm Account</a>
            </div>
            
            <div class="warning">
                <p>⏰ Valid for 24 hours only</p>
                <p>Do not share this link with anyone. If you didn''t request account creation, please ignore this email.</p>
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

-- تحديث نوع الإشعار ليربطه بالقالب
UPDATE email_notification_types 
SET template_id = (
    SELECT id FROM email_templates WHERE name = 'email_verification_link' LIMIT 1
)
WHERE name = 'email_verification_link';

-- عرض النتائج
SELECT 
    'تم إدراج نوع الإشعار بنجاح' as message,
    name_ar,
    name_en,
    description_ar
FROM email_notification_types 
WHERE name = 'email_verification_link';

SELECT 
    'تم إدراج قالب الإيميل بنجاح' as message,
    name_ar,
    name_en,
    subject_ar,
    subject_en
FROM email_templates 
WHERE name = 'email_verification_link';
