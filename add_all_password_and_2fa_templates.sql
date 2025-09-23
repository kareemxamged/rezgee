-- إدراج جميع قوالب كلمة المرور والتحقق الثنائي في قاعدة البيانات (موحد)
-- يشمل: قالب كلمة المرور المؤقتة + قالب إشعار إعادة تعيين كلمة المرور + قالب رمز التحقق الثنائي

BEGIN;

-- إدراج أنواع الإشعارات
INSERT INTO email_notification_types (name, name_ar, name_en, description_ar, description_en, is_active, created_at, updated_at)
VALUES 
(
    'temporary_password',
    'كلمة المرور المؤقتة',
    'Temporary Password',
    'إشعار إرسال كلمة مرور مؤقتة لإعادة تعيين كلمة المرور',
    'Notification for sending temporary password for password reset',
    true,
    NOW(),
    NOW()
),
(
    'password_reset_success',
    'إشعار إعادة تعيين كلمة المرور',
    'Password Reset Success Notification',
    'إشعار إرسال عند إعادة تعيين كلمة المرور بنجاح',
    'Notification sent when password is successfully reset',
    true,
    NOW(),
    NOW()
),
(
    'two_factor_verification',
    'رمز التحقق الثنائي',
    'Two-Factor Authentication Code',
    'إشعار إرسال رمز التحقق الثنائي للمصادقة',
    'Notification for sending two-factor authentication code',
    true,
    NOW(),
    NOW()
);

-- إدراج قالب كلمة المرور المؤقتة
INSERT INTO email_templates (
    name, name_ar, name_en, subject_ar, subject_en, content_ar, content_en,
    html_template_ar, html_template_en, is_active, created_at, updated_at
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
            margin: 0; padding: 0; font-family: ''Amiri'', serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 40px 20px; min-height: 100vh; line-height: 1.6;
        }
        .container {
            max-width: 600px; margin: 0 auto; background: white;
            border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden; border: 1px solid rgba(0,0,0,0.05);
        }
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            padding: 40px 30px; text-align: center; color: white;
        }
        .logo { font-size: 32px; font-weight: bold; margin: 0; }
        .tagline { font-size: 16px; margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #1e40af; font-size: 24px; margin: 0 0 20px 0; text-align: center; }
        .content p { color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; }
        .password-display {
            background-color: #f3f4f6; padding: 20px; border-radius: 8px;
            text-align: center; margin: 20px 0;
        }
        .password-display h1 {
            color: #2563eb; font-size: 32px; letter-spacing: 5px;
            margin: 0; font-family: monospace;
        }
        .instructions {
            background: #dcfce7; border-radius: 10px; padding: 20px;
            margin: 30px 0; border-right: 4px solid #16a34a;
        }
        .instructions h3 { color: #166534; font-size: 18px; margin: 0 0 15px 0; }
        .instructions p { color: #166534; line-height: 1.8; font-size: 15px; margin: 8px 0; }
        .warning {
            background: #fef3c7; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-right: 4px solid #f59e0b;
        }
        .warning p { color: #92400e; margin: 0 0 10px 0; font-weight: bold; }
        .warning .note { color: #92400e; margin: 0; line-height: 1.6; font-size: 14px; font-weight: normal; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer .small { font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 15px; }
            .header, .content, .footer { padding: 20px; }
            .content h2 { font-size: 20px; }
            .password-display h1 { font-size: 24px; letter-spacing: 3px; }
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
            margin: 0; padding: 0; font-family: ''Inter'', sans-serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 40px 20px; min-height: 100vh; line-height: 1.6;
        }
        .container {
            max-width: 600px; margin: 0 auto; background: white;
            border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden; border: 1px solid rgba(0,0,0,0.05);
        }
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            padding: 40px 30px; text-align: center; color: white;
        }
        .logo { font-size: 32px; font-weight: bold; margin: 0; }
        .tagline { font-size: 16px; margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #1e40af; font-size: 24px; margin: 0 0 20px 0; text-align: center; }
        .content p { color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; }
        .password-display {
            background-color: #f3f4f6; padding: 20px; border-radius: 8px;
            text-align: center; margin: 20px 0;
        }
        .password-display h1 {
            color: #2563eb; font-size: 32px; letter-spacing: 5px;
            margin: 0; font-family: monospace;
        }
        .instructions {
            background: #dcfce7; border-radius: 10px; padding: 20px;
            margin: 30px 0; border-left: 4px solid #16a34a;
        }
        .instructions h3 { color: #166534; font-size: 18px; margin: 0 0 15px 0; }
        .instructions p { color: #166534; line-height: 1.8; font-size: 15px; margin: 8px 0; }
        .warning {
            background: #fef3c7; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-left: 4px solid #f59e0b;
        }
        .warning p { color: #92400e; margin: 0 0 10px 0; font-weight: bold; }
        .warning .note { color: #92400e; margin: 0; line-height: 1.6; font-size: 14px; font-weight: normal; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer .small { font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 15px; }
            .header, .content, .footer { padding: 20px; }
            .content h2 { font-size: 20px; }
            .password-display h1 { font-size: 24px; letter-spacing: 3px; }
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
    true, NOW(), NOW()
);

-- إدراج قالب إشعار إعادة تعيين كلمة المرور
INSERT INTO email_templates (
    name, name_ar, name_en, subject_ar, subject_en, content_ar, content_en,
    html_template_ar, html_template_en, is_active, created_at, updated_at
) VALUES (
    'password_reset_success',
    'إشعار إعادة تعيين كلمة المرور',
    'Password Reset Success Notification',
    'تم إعادة تعيين كلمة المرور بنجاح - رزقي',
    'Password Reset Successfully - Rezge',
    'تم إعادة تعيين كلمة المرور بنجاح - رزقي

مرحباً {{userName}}،

تم إعادة تعيين كلمة المرور لحسابك بنجاح {{resetMethod}} باستخدام كلمة المرور المؤقتة.

تفاصيل العملية:
- التاريخ والوقت : {{timestamp}}
- البريد الإلكتروني: {{userEmail}}
- طريقة الإعادة: {{resetMethod}}
{{ipAddress}}
{{location}}
{{deviceType}}
{{browser}}

حسابك الآن محمي بكلمة المرور الجديدة. يمكنك تسجيل الدخول باستخدام كلمة المرور الجديدة.

تنبيه أمني: إذا لم تقم بهذه العملية، يرجى التواصل معنا فوراً على {{contactEmail}}

نصائح للحفاظ على أمان حسابك:
✅ استخدم كلمة مرور قوية ومعقدة
✅ لا تشارك كلمة المرور مع أي شخص
✅ فعّل المصادقة الثنائية لحماية إضافية
✅ سجل خروج من الأجهزة غير المستخدمة
✅ تجنب استخدام نفس كلمة المرور في مواقع أخرى

مع تحيات فريق رزقي',
    'Password Reset Successfully - Rezge

Hello {{userName}},

Your account password has been successfully reset {{resetMethod}} using a temporary password.

Operation Details:
- Date and Time : {{timestamp}}
- Email: {{userEmail}}
- Reset Method: {{resetMethod}}
{{ipAddress}}
{{location}}
{{deviceType}}
{{browser}}

Your account is now protected with the new password. You can log in using the new password.

Security Alert: If you did not perform this action, please contact us immediately at {{contactEmail}}

Tips to keep your account secure:
✅ Use a strong and complex password
✅ Do not share your password with anyone
✅ Enable two-factor authentication for additional protection
✅ Log out from unused devices
✅ Avoid using the same password on other sites

Best regards, Rezge Team',
    '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تم إعادة تعيين كلمة المرور بنجاح - رزقي</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: ''Segoe UI'', ''Tahoma'', ''Arial'', sans-serif;
            line-height: 1.6; color: #333; background-color: #f4f4f4;
            margin: 0; padding: 0; direction: rtl; text-align: right;
        }
        .container {
            max-width: 600px; margin: 0 auto; background-color: #ffffff;
            border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            direction: rtl;
        }
        .content { padding: 30px; text-align: right; direction: rtl; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; direction: rtl; }
        .footer p { margin: 0; color: #6c757d; font-size: 14px; }
        h1, h2, h3, h4, h5, h6 { text-align: right; direction: rtl; }
        p, div, span { text-align: right; direction: rtl; }
        ul, ol { text-align: right; direction: rtl; padding-right: 20px; padding-left: 0; }
        li { text-align: right; direction: rtl; margin-bottom: 5px; }
        .alert { padding: 15px; border-radius: 6px; margin: 20px 0; }
        .alert-success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .alert-warning { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
        .alert-info { background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h2>✅ تم إعادة تعيين كلمة المرور بنجاح</h2>
            <p>مرحباً <strong>{{userName}}</strong>،</p>
            <div class="alert alert-success">
                <strong>🎉 تم إعادة تعيين كلمة المرور بنجاح!</strong>
            </div>
            <p>نود إعلامك بأنه تم إعادة تعيين كلمة المرور لحسابك بنجاح {{resetMethod}} باستخدام كلمة المرور المؤقتة.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3>📋 تفاصيل العملية:</h3>
                <ul>
                    <li><strong>📅 التاريخ والوقت :</strong> {{timestamp}}</li>
                    <li><strong>📧 البريد الإلكتروني:</strong> {{userEmail}}</li>
                    <li><strong>🔄 طريقة الإعادة:</strong> {{resetMethod}}</li>
                    {{ipAddress}}
                    {{location}}
                    {{deviceType}}
                    {{browser}}
                </ul>
            </div>
            <div class="alert alert-info">
                <h3>🔐 حسابك الآن محمي بكلمة المرور الجديدة</h3>
                <p>يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة التي قمت بإنشائها.</p>
            </div>
            <div class="alert alert-warning">
                <h3>⚠️ تنبيه أمني مهم:</h3>
                <p>إذا لم تقم بهذه العملية، يرجى التواصل معنا فوراً على {{contactEmail}}</p>
            </div>
            <div style="margin-top: 30px;">
                <p><strong>نصائح للحفاظ على أمان حسابك:</strong></p>
                <ul>
                    <li>✅ استخدم كلمة مرور قوية ومعقدة</li>
                    <li>✅ لا تشارك كلمة المرور مع أي شخص</li>
                    <li>✅ فعّل المصادقة الثنائية لحماية إضافية</li>
                    <li>✅ سجل خروج من الأجهزة غير المستخدمة</li>
                    <li>✅ تجنب استخدام نفس كلمة المرور في مواقع أخرى</li>
                </ul>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <a href="{{loginLink}}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">🔐 تسجيل الدخول الآن</a>
            </div>
        </div>
        <div class="footer">
            <p>© 2025 رزقي - منصة الزواج الإسلامي الشرعي</p>
            <p>هذه رسالة تلقائية، يرجى عدم الرد عليها</p>
        </div>
    </div>
</body>
</html>',
    '<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successfully - Rezge</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: ''Segoe UI'', ''Tahoma'', ''Arial'', sans-serif;
            line-height: 1.6; color: #333; background-color: #f4f4f4;
            margin: 0; padding: 0; direction: ltr; text-align: left;
        }
        .container {
            max-width: 600px; margin: 0 auto; background-color: #ffffff;
            border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            direction: ltr;
        }
        .content { padding: 30px; text-align: left; direction: ltr; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; direction: ltr; }
        .footer p { margin: 0; color: #6c757d; font-size: 14px; }
        h1, h2, h3, h4, h5, h6 { text-align: left; direction: ltr; }
        p, div, span { text-align: left; direction: ltr; }
        ul, ol { text-align: left; direction: ltr; padding-left: 20px; padding-right: 0; }
        li { text-align: left; direction: ltr; margin-bottom: 5px; }
        .alert { padding: 15px; border-radius: 6px; margin: 20px 0; }
        .alert-success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .alert-warning { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
        .alert-info { background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h2>✅ Password Reset Successfully</h2>
            <p>Hello <strong>{{userName}}</strong>,</p>
            <div class="alert alert-success">
                <strong>🎉 Password reset successfully!</strong>
            </div>
            <p>We would like to inform you that your account password has been successfully reset {{resetMethod}} using a temporary password.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3>📋 Operation Details:</h3>
                <ul>
                    <li><strong>📅 Date and Time :</strong> {{timestamp}}</li>
                    <li><strong>📧 Email:</strong> {{userEmail}}</li>
                    <li><strong>🔄 Reset Method:</strong> {{resetMethod}}</li>
                    {{ipAddress}}
                    {{location}}
                    {{deviceType}}
                    {{browser}}
                </ul>
            </div>
            <div class="alert alert-info">
                <h3>🔐 Your account is now protected with the new password</h3>
                <p>You can now log in using the new password you created.</p>
            </div>
            <div class="alert alert-warning">
                <h3>⚠️ Important Security Alert:</h3>
                <p>If you did not perform this action, please contact us immediately at {{contactEmail}}</p>
            </div>
            <div style="margin-top: 30px;">
                <p><strong>Tips to keep your account secure:</strong></p>
                <ul>
                    <li>✅ Use a strong and complex password</li>
                    <li>✅ Do not share your password with anyone</li>
                    <li>✅ Enable two-factor authentication for additional protection</li>
                    <li>✅ Log out from unused devices</li>
                    <li>✅ Avoid using the same password on other sites</li>
                </ul>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <a href="{{loginLink}}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">🔐 Login Now</a>
            </div>
        </div>
        <div class="footer">
            <p>© 2025 Rezge - Islamic Marriage Platform</p>
            <p>This is an automated message, please do not reply</p>
        </div>
    </div>
</body>
</html>',
    true, NOW(), NOW()
);

-- إدراج قالب رمز التحقق الثنائي
INSERT INTO email_templates (
    name, name_ar, name_en, subject_ar, subject_en, content_ar, content_en,
    html_template_ar, html_template_en, is_active, created_at, updated_at
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
            margin: 0; padding: 0; font-family: ''Amiri'', serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 40px 20px; min-height: 100vh; line-height: 1.6;
        }
        .container {
            max-width: 600px; margin: 0 auto; background: white;
            border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden; border: 1px solid rgba(0,0,0,0.05);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px; text-align: center; color: white;
        }
        .logo { font-size: 32px; font-weight: bold; margin: 0; }
        .tagline { font-size: 16px; margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #667eea; font-size: 24px; margin: 0 0 20px 0; text-align: center; }
        .content p { color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; }
        .code-display {
            background-color: #f3f4f6; padding: 25px; border-radius: 12px;
            text-align: center; margin: 25px 0; border: 2px dashed #667eea;
        }
        .code-display h1 {
            color: #667eea; font-size: 36px; letter-spacing: 8px;
            margin: 0; font-family: monospace; font-weight: bold;
        }
        .instructions {
            background: #e0e7ff; border-radius: 10px; padding: 20px;
            margin: 30px 0; border-right: 4px solid #667eea;
        }
        .instructions h3 { color: #4338ca; font-size: 18px; margin: 0 0 15px 0; }
        .instructions p { color: #4338ca; line-height: 1.8; font-size: 15px; margin: 8px 0; }
        .warning {
            background: #fef3c7; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-right: 4px solid #f59e0b;
        }
        .warning p { color: #92400e; margin: 0 0 10px 0; font-weight: bold; }
        .warning .note { color: #92400e; margin: 0; line-height: 1.6; font-size: 14px; font-weight: normal; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer .small { font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 15px; }
            .header, .content, .footer { padding: 20px; }
            .content h2 { font-size: 20px; }
            .code-display h1 { font-size: 28px; letter-spacing: 5px; }
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
            margin: 0; padding: 0; font-family: ''Inter'', sans-serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 40px 20px; min-height: 100vh; line-height: 1.6;
        }
        .container {
            max-width: 600px; margin: 0 auto; background: white;
            border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden; border: 1px solid rgba(0,0,0,0.05);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px; text-align: center; color: white;
        }
        .logo { font-size: 32px; font-weight: bold; margin: 0; }
        .tagline { font-size: 16px; margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #667eea; font-size: 24px; margin: 0 0 20px 0; text-align: center; }
        .content p { color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; }
        .code-display {
            background-color: #f3f4f6; padding: 25px; border-radius: 12px;
            text-align: center; margin: 25px 0; border: 2px dashed #667eea;
        }
        .code-display h1 {
            color: #667eea; font-size: 36px; letter-spacing: 8px;
            margin: 0; font-family: monospace; font-weight: bold;
        }
        .instructions {
            background: #e0e7ff; border-radius: 10px; padding: 20px;
            margin: 30px 0; border-left: 4px solid #667eea;
        }
        .instructions h3 { color: #4338ca; font-size: 18px; margin: 0 0 15px 0; }
        .instructions p { color: #4338ca; line-height: 1.8; font-size: 15px; margin: 8px 0; }
        .warning {
            background: #fef3c7; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-left: 4px solid #f59e0b;
        }
        .warning p { color: #92400e; margin: 0 0 10px 0; font-weight: bold; }
        .warning .note { color: #92400e; margin: 0; line-height: 1.6; font-size: 14px; font-weight: normal; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer .small { font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 15px; }
            .header, .content, .footer { padding: 20px; }
            .content h2 { font-size: 20px; }
            .code-display h1 { font-size: 28px; letter-spacing: 5px; }
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
    true, NOW(), NOW()
);

-- عرض النتائج
SELECT 'تم إدراج جميع قوالب كلمة المرور والتحقق الثنائي بنجاح' as status;

SELECT 'أنواع الإشعارات المضافة:' as info;
SELECT name, name_ar, name_en, description_ar, description_en, is_active, created_at
FROM email_notification_types 
WHERE name IN ('temporary_password', 'password_reset_success', 'two_factor_verification');

SELECT 'القوالب المضافة:' as info;
SELECT name, name_ar, name_en, subject_ar, subject_en, is_active, created_at
FROM email_templates 
WHERE name IN ('temporary_password', 'password_reset_success', 'two_factor_verification');

COMMIT;







