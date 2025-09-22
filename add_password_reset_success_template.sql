-- إدراج قالب إشعار إعادة تعيين كلمة المرور في قاعدة البيانات
-- هذا القالب يستخدمه النظام عند إعادة تعيين كلمة المرور بنجاح

BEGIN;

-- إدراج نوع الإشعار أولاً
INSERT INTO email_notification_types (name, name_ar, name_en, description_ar, description_en, is_active, created_at, updated_at)
VALUES (
    'password_reset_success',
    'إشعار إعادة تعيين كلمة المرور',
    'Password Reset Success Notification',
    'إشعار إرسال عند إعادة تعيين كلمة المرور بنجاح',
    'Notification sent when password is successfully reset',
    true,
    NOW(),
    NOW()
);

-- إدراج قالب إعادة تعيين كلمة المرور - النسخة العربية
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
        * {
            box-sizing: border-box;
        }
        body {
            font-family: ''Segoe UI'', ''Tahoma'', ''Arial'', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            direction: rtl;
            text-align: right;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            direction: rtl;
        }
        .content {
            padding: 30px;
            text-align: right;
            direction: rtl;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            direction: rtl;
        }
        .footer p {
            margin: 0;
            color: #6c757d;
            font-size: 14px;
        }
        h1, h2, h3, h4, h5, h6 {
            text-align: right;
            direction: rtl;
        }
        p, div, span {
            text-align: right;
            direction: rtl;
        }
        ul, ol {
            text-align: right;
            direction: rtl;
            padding-right: 20px;
            padding-left: 0;
        }
        li {
            text-align: right;
            direction: rtl;
            margin-bottom: 5px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #10b981);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .alert-success {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        .alert-warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
        }
        .alert-danger {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        .alert-info {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
        }
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
        * {
            box-sizing: border-box;
        }
        body {
            font-family: ''Segoe UI'', ''Tahoma'', ''Arial'', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            direction: ltr;
            text-align: left;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            direction: ltr;
        }
        .content {
            padding: 30px;
            text-align: left;
            direction: ltr;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            direction: ltr;
        }
        .footer p {
            margin: 0;
            color: #6c757d;
            font-size: 14px;
        }
        h1, h2, h3, h4, h5, h6 {
            text-align: left;
            direction: ltr;
        }
        p, div, span {
            text-align: left;
            direction: ltr;
        }
        ul, ol {
            text-align: left;
            direction: ltr;
            padding-left: 20px;
            padding-right: 0;
        }
        li {
            text-align: left;
            direction: ltr;
            margin-bottom: 5px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #10b981);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .alert-success {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        .alert-warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
        }
        .alert-danger {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        .alert-info {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
        }
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
    true,
    NOW(),
    NOW()
);

-- عرض النتائج
SELECT 
    'تم إدراج قالب إشعار إعادة تعيين كلمة المرور بنجاح' as status;

SELECT 
    name,
    name_ar,
    name_en,
    subject_ar,
    subject_en,
    is_active,
    created_at
FROM email_templates 
WHERE name = 'password_reset_success';

SELECT 
    name,
    name_ar,
    name_en,
    description_ar,
    description_en,
    is_active,
    created_at
FROM email_notification_types 
WHERE name = 'password_reset_success';

COMMIT;





