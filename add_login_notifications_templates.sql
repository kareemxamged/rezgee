-- إدراج قوالب إشعارات تسجيل الدخول في قاعدة البيانات
-- يشمل: قالب تسجيل الدخول الناجح + قالب محاولة تسجيل الدخول الفاشلة

BEGIN;

-- إدراج أنواع الإشعارات
INSERT INTO email_notification_types (name, name_ar, name_en, description_ar, description_en, is_active, created_at, updated_at)
VALUES 
(
    'login_success',
    'تسجيل الدخول الناجح',
    'Successful Login',
    'إشعار إرسال عند تسجيل الدخول بنجاح',
    'Notification sent when login is successful',
    true,
    NOW(),
    NOW()
),
(
    'login_failed',
    'محاولة تسجيل دخول فاشلة',
    'Failed Login Attempt',
    'إشعار إرسال عند محاولة تسجيل دخول فاشلة',
    'Notification sent when login attempt fails',
    true,
    NOW(),
    NOW()
);

-- إدراج قالب تسجيل الدخول الناجح
INSERT INTO email_templates (
    name, name_ar, name_en, subject_ar, subject_en, content_ar, content_en,
    html_template_ar, html_template_en, is_active, created_at, updated_at
) VALUES (
    'login_success',
    'تسجيل الدخول الناجح',
    'Successful Login',
    'تسجيل دخول ناجح - رزقي',
    'Successful Login - Rezge',
    'تسجيل دخول ناجح - رزقي

مرحباً {{userName}}،

تم تسجيل دخولك بنجاح إلى حسابك في موقع رزقي للزواج الإسلامي.

تفاصيل الجلسة:
- التاريخ والوقت : {{timestamp}}
- طريقة تسجيل الدخول: {{loginMethod}}
- عنوان IP: {{ipAddress}}
- الموقع الجغرافي: {{location}}
- نوع الجهاز: {{deviceType}}
- المتصفح: {{browser}}

حسابك آمن ومحمي. إذا لم تكن أنت من سجل الدخول، يرجى التواصل معنا فوراً.

---
فريق رزقي - موقع الزواج الإسلامي الشرعي',
    'Successful Login - Rezge

Hello {{userName}},

You have successfully logged into your Rezge Islamic marriage account.

Session Details:
- Date and Time : {{timestamp}}
- Login Method: {{loginMethod}}
- IP Address: {{ipAddress}}
- Geographic Location: {{location}}
- Device Type: {{deviceType}}
- Browser: {{browser}}

Your account is secure and protected. If you did not log in, please contact us immediately.

---
Rezge Team - Islamic Marriage Platform',
    '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل دخول ناجح - رزقي</title>
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
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 40px 30px; text-align: center; color: white;
        }
        .logo { font-size: 32px; font-weight: bold; margin: 0; }
        .tagline { font-size: 16px; margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #10b981; font-size: 24px; margin: 0 0 20px 0; text-align: center; }
        .content p { color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; }
        .success-box {
            background: #dcfce7; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-right: 4px solid #16a34a;
        }
        .success-box h3 { color: #166534; font-size: 18px; margin: 0 0 15px 0; }
        .success-box p { color: #166534; line-height: 1.8; font-size: 15px; margin: 8px 0; }
        .session-details {
            background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;
        }
        .session-details h3 { color: #374151; font-size: 18px; margin: 0 0 15px 0; }
        .session-details ul { color: #6b7280; line-height: 1.8; }
        .session-details li { margin-bottom: 8px; }
        .security-note {
            background: #fef3c7; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-right: 4px solid #f59e0b;
        }
        .security-note p { color: #92400e; margin: 0; line-height: 1.6; font-size: 14px; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer .small { font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 15px; }
            .header, .content, .footer { padding: 20px; }
            .content h2 { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">✅ رزقي</h1>
            <p class="tagline">تسجيل دخول ناجح</p>
        </div>
        <div class="content">
            <h2>✅ تسجيل دخول ناجح</h2>
            <p>مرحباً <strong>{{userName}}</strong>،</p>
            <div class="success-box">
                <h3>🎉 تم تسجيل دخولك بنجاح!</h3>
                <p>مرحباً بك في موقع رزقي للزواج الإسلامي الشرعي</p>
            </div>
            <div class="session-details">
                <h3>📋 تفاصيل الجلسة:</h3>
                <ul>
                    <li><strong>📅 التاريخ والوقت :</strong> {{timestamp}}</li>
                    <li><strong>🔐 طريقة تسجيل الدخول:</strong> {{loginMethod}}</li>
                    <li><strong>🌐 عنوان IP:</strong> {{ipAddress}}</li>
                    <li><strong>📍 الموقع الجغرافي:</strong> {{location}}</li>
                    <li><strong>📱 نوع الجهاز:</strong> {{deviceType}}</li>
                    <li><strong>🌐 المتصفح:</strong> {{browser}}</li>
                </ul>
            </div>
            <div class="security-note">
                <p>🔒 حسابك آمن ومحمي. إذا لم تكن أنت من سجل الدخول، يرجى التواصل معنا فوراً على {{contactEmail}}</p>
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
    <title>Successful Login - Rezge</title>
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
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 40px 30px; text-align: center; color: white;
        }
        .logo { font-size: 32px; font-weight: bold; margin: 0; }
        .tagline { font-size: 16px; margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #10b981; font-size: 24px; margin: 0 0 20px 0; text-align: center; }
        .content p { color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; }
        .success-box {
            background: #dcfce7; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-left: 4px solid #16a34a;
        }
        .success-box h3 { color: #166534; font-size: 18px; margin: 0 0 15px 0; }
        .success-box p { color: #166534; line-height: 1.8; font-size: 15px; margin: 8px 0; }
        .session-details {
            background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;
        }
        .session-details h3 { color: #374151; font-size: 18px; margin: 0 0 15px 0; }
        .session-details ul { color: #6b7280; line-height: 1.8; }
        .session-details li { margin-bottom: 8px; }
        .security-note {
            background: #fef3c7; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-left: 4px solid #f59e0b;
        }
        .security-note p { color: #92400e; margin: 0; line-height: 1.6; font-size: 14px; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer .small { font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 15px; }
            .header, .content, .footer { padding: 20px; }
            .content h2 { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">✅ Rezge</h1>
            <p class="tagline">Successful Login</p>
        </div>
        <div class="content">
            <h2>✅ Successful Login</h2>
            <p>Hello <strong>{{userName}}</strong>,</p>
            <div class="success-box">
                <h3>🎉 Login Successful!</h3>
                <p>Welcome to Rezge Islamic Marriage Platform</p>
            </div>
            <div class="session-details">
                <h3>📋 Session Details:</h3>
                <ul>
                    <li><strong>📅 Date and Time :</strong> {{timestamp}}</li>
                    <li><strong>🔐 Login Method:</strong> {{loginMethod}}</li>
                    <li><strong>🌐 IP Address:</strong> {{ipAddress}}</li>
                    <li><strong>📍 Geographic Location:</strong> {{location}}</li>
                    <li><strong>📱 Device Type:</strong> {{deviceType}}</li>
                    <li><strong>🌐 Browser:</strong> {{browser}}</li>
                </ul>
            </div>
            <div class="security-note">
                <p>🔒 Your account is secure and protected. If you did not log in, please contact us immediately at {{contactEmail}}</p>
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

-- إدراج قالب محاولة تسجيل الدخول الفاشلة
INSERT INTO email_templates (
    name, name_ar, name_en, subject_ar, subject_en, content_ar, content_en,
    html_template_ar, html_template_en, is_active, created_at, updated_at
) VALUES (
    'login_failed',
    'محاولة تسجيل دخول فاشلة',
    'Failed Login Attempt',
    'محاولة تسجيل دخول فاشلة - رزقي',
    'Failed Login Attempt - Rezge',
    'محاولة تسجيل دخول فاشلة - رزقي

مرحباً {{userName}}،

تم رصد محاولة تسجيل دخول فاشلة إلى حسابك في موقع رزقي للزواج الإسلامي.

تفاصيل المحاولة:
- التاريخ والوقت : {{timestamp}}
- سبب الفشل: {{failureReason}}
- عنوان IP: {{ipAddress}}
- الموقع الجغرافي: {{location}}
- نوع الجهاز: {{deviceType}}
- المتصفح: {{browser}}
- عدد المحاولات: {{attemptsCount}}

مستوى الخطر: {{riskLevel}}

إجراءات الأمان المطلوبة:
إذا لم تكن أنت من حاول تسجيل الدخول، يرجى:
- تغيير كلمة المرور فوراً
- تفعيل المصادقة الثنائية إذا لم تكن مفعلة
- مراجعة الأجهزة الموثقة
- التواصل معنا على {{contactEmail}}

---
فريق رزقي - موقع الزواج الإسلامي الشرعي',
    'Failed Login Attempt - Rezge

Hello {{userName}},

A failed login attempt to your Rezge Islamic marriage account has been detected.

Attempt Details:
- Date and Time : {{timestamp}}
- Failure Reason: {{failureReason}}
- IP Address: {{ipAddress}}
- Geographic Location: {{location}}
- Device Type: {{deviceType}}
- Browser: {{browser}}
- Attempt Count: {{attemptsCount}}

Risk Level: {{riskLevel}}

Required Security Actions:
If you did not attempt to log in, please:
- Change your password immediately
- Enable two-factor authentication if not already enabled
- Review trusted devices
- Contact us at {{contactEmail}}

---
Rezge Team - Islamic Marriage Platform',
    '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>محاولة تسجيل دخول فاشلة - رزقي</title>
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
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            padding: 40px 30px; text-align: center; color: white;
        }
        .logo { font-size: 32px; font-weight: bold; margin: 0; }
        .tagline { font-size: 16px; margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #dc2626; font-size: 24px; margin: 0 0 20px 0; text-align: center; }
        .content p { color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; }
        .alert-danger {
            background: #fef2f2; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-right: 4px solid #dc2626;
        }
        .alert-danger h3 { color: #dc2626; font-size: 18px; margin: 0 0 15px 0; }
        .alert-danger p { color: #dc2626; line-height: 1.8; font-size: 15px; margin: 8px 0; }
        .attempt-details {
            background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;
        }
        .attempt-details h3 { color: #374151; font-size: 18px; margin: 0 0 15px 0; }
        .attempt-details ul { color: #6b7280; line-height: 1.8; }
        .attempt-details li { margin-bottom: 8px; }
        .risk-level {
            background: #fef3c7; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-right: 4px solid #f59e0b;
        }
        .risk-level h3 { color: #92400e; font-size: 18px; margin: 0 0 15px 0; }
        .risk-level p { color: #92400e; line-height: 1.8; font-size: 15px; margin: 8px 0; }
        .security-actions {
            background: #fef2f2; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-right: 4px solid #dc2626;
        }
        .security-actions h3 { color: #dc2626; font-size: 18px; margin: 0 0 15px 0; }
        .security-actions ul { color: #dc2626; line-height: 1.8; }
        .security-actions li { margin-bottom: 8px; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer .small { font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 15px; }
            .header, .content, .footer { padding: 20px; }
            .content h2 { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">🚨 رزقي</h1>
            <p class="tagline">تحذير أمني</p>
        </div>
        <div class="content">
            <h2>🚨 محاولة تسجيل دخول فاشلة</h2>
            <p>مرحباً <strong>{{userName}}</strong>،</p>
            <div class="alert-danger">
                <h3>⚠️ تم رصد محاولة تسجيل دخول فاشلة!</h3>
                <p>تم رصد محاولة تسجيل دخول فاشلة إلى حسابك في موقع رزقي للزواج الإسلامي</p>
                <p><strong>سبب الفشل:</strong> {{failureReason}}</p>
            </div>
            <div class="attempt-details">
                <h3>📋 تفاصيل المحاولة:</h3>
                <ul>
                    <li><strong>📅 التاريخ والوقت :</strong> {{timestamp}}</li>
                    <li><strong>❌ سبب الفشل:</strong> {{failureReason}}</li>
                    <li><strong>🌐 عنوان IP:</strong> {{ipAddress}}</li>
                    <li><strong>📍 الموقع الجغرافي:</strong> {{location}}</li>
                    <li><strong>📱 نوع الجهاز:</strong> {{deviceType}}</li>
                    <li><strong>🌐 المتصفح:</strong> {{browser}}</li>
                    <li><strong>🔢 عدد المحاولات:</strong> {{attemptsCount}}</li>
                </ul>
            </div>
            <div class="risk-level">
                <h3>⚠️ مستوى الخطر: {{riskLevel}}</h3>
                <p>إذا لم تكن أنت من حاول تسجيل الدخول، يرجى اتخاذ الإجراءات التالية فوراً</p>
            </div>
            <div class="security-actions">
                <h3>🔒 إجراءات الأمان المطلوبة:</h3>
                <ul>
                    <li>تغيير كلمة المرور فوراً</li>
                    <li>تفعيل المصادقة الثنائية إذا لم تكن مفعلة</li>
                    <li>مراجعة الأجهزة الموثقة</li>
                    <li>التواصل معنا على {{contactEmail}}</li>
                </ul>
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
    <title>Failed Login Attempt - Rezge</title>
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
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            padding: 40px 30px; text-align: center; color: white;
        }
        .logo { font-size: 32px; font-weight: bold; margin: 0; }
        .tagline { font-size: 16px; margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #dc2626; font-size: 24px; margin: 0 0 20px 0; text-align: center; }
        .content p { color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; }
        .alert-danger {
            background: #fef2f2; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-left: 4px solid #dc2626;
        }
        .alert-danger h3 { color: #dc2626; font-size: 18px; margin: 0 0 15px 0; }
        .alert-danger p { color: #dc2626; line-height: 1.8; font-size: 15px; margin: 8px 0; }
        .attempt-details {
            background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;
        }
        .attempt-details h3 { color: #374151; font-size: 18px; margin: 0 0 15px 0; }
        .attempt-details ul { color: #6b7280; line-height: 1.8; }
        .attempt-details li { margin-bottom: 8px; }
        .risk-level {
            background: #fef3c7; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-left: 4px solid #f59e0b;
        }
        .risk-level h3 { color: #92400e; font-size: 18px; margin: 0 0 15px 0; }
        .risk-level p { color: #92400e; line-height: 1.8; font-size: 15px; margin: 8px 0; }
        .security-actions {
            background: #fef2f2; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-left: 4px solid #dc2626;
        }
        .security-actions h3 { color: #dc2626; font-size: 18px; margin: 0 0 15px 0; }
        .security-actions ul { color: #dc2626; line-height: 1.8; }
        .security-actions li { margin-bottom: 8px; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer .small { font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 15px; }
            .header, .content, .footer { padding: 20px; }
            .content h2 { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">🚨 Rezge</h1>
            <p class="tagline">Security Alert</p>
        </div>
        <div class="content">
            <h2>🚨 Failed Login Attempt</h2>
            <p>Hello <strong>{{userName}}</strong>,</p>
            <div class="alert-danger">
                <h3>⚠️ Failed Login Attempt Detected!</h3>
                <p>A failed login attempt to your Rezge Islamic marriage account has been detected</p>
                <p><strong>Failure Reason:</strong> {{failureReason}}</p>
            </div>
            <div class="attempt-details">
                <h3>📋 Attempt Details:</h3>
                <ul>
                    <li><strong>📅 Date and Time :</strong> {{timestamp}}</li>
                    <li><strong>❌ Failure Reason:</strong> {{failureReason}}</li>
                    <li><strong>🌐 IP Address:</strong> {{ipAddress}}</li>
                    <li><strong>📍 Geographic Location:</strong> {{location}}</li>
                    <li><strong>📱 Device Type:</strong> {{deviceType}}</li>
                    <li><strong>🌐 Browser:</strong> {{browser}}</li>
                    <li><strong>🔢 Attempt Count:</strong> {{attemptsCount}}</li>
                </ul>
            </div>
            <div class="risk-level">
                <h3>⚠️ Risk Level: {{riskLevel}}</h3>
                <p>If you did not attempt to log in, please take the following actions immediately</p>
            </div>
            <div class="security-actions">
                <h3>🔒 Required Security Actions:</h3>
                <ul>
                    <li>Change your password immediately</li>
                    <li>Enable two-factor authentication if not already enabled</li>
                    <li>Review trusted devices</li>
                    <li>Contact us at {{contactEmail}}</li>
                </ul>
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
SELECT 'تم إدراج قوالب إشعارات تسجيل الدخول بنجاح' as status;

SELECT 'أنواع الإشعارات المضافة:' as info;
SELECT name, name_ar, name_en, description_ar, description_en, is_active, created_at
FROM email_notification_types 
WHERE name IN ('login_success', 'login_failed');

SELECT 'القوالب المضافة:' as info;
SELECT name, name_ar, name_en, subject_ar, subject_en, is_active, created_at
FROM email_templates 
WHERE name IN ('login_success', 'login_failed');

COMMIT;





