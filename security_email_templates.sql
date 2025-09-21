-- قوالب الإشعارات الأمنية الإضافية - رزقي
-- Security Email Templates - Rezge

-- إدراج القوالب الأمنية الإضافية
INSERT INTO email_templates (name, name_ar, name_en, subject_ar, subject_en, content_ar, content_en, html_template_ar, html_template_en, is_active) VALUES

-- إشعار تسجيل الدخول الناجح
(
    'login_success_notification',
    'إشعار تسجيل الدخول الناجح',
    'Login Success Notification',
    '✅ تم تسجيل الدخول بنجاح - رزقي',
    '✅ Successful Login - Rezge',
    'مرحباً {{userName}}، تم تسجيل الدخول إلى حسابك بنجاح. الوقت: {{loginTime}}، الموقع: {{location}}، الجهاز: {{device}}.',
    'Hello {{userName}}, You have successfully logged into your account. Time: {{loginTime}}, Location: {{location}}, Device: {{device}}.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تم تسجيل الدخول بنجاح</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#10b981;font-size:24px;margin:0 0 20px 0;text-align:center}.login-box{background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>✅ تم تسجيل الدخول بنجاح</h2><p>مرحباً <strong>{{userName}}</strong>،</p><div class="login-box"><h3 style="color:#059669;margin:0 0 15px 0">🔐 تم تسجيل الدخول بنجاح</h3><p style="color:#047857;margin:5px 0"><strong>الوقت:</strong> {{loginTime}}</p><p style="color:#047857;margin:5px 0"><strong>الموقع:</strong> {{location}}</p><p style="color:#047857;margin:5px 0"><strong>الجهاز:</strong> {{device}}</p></div><p>إذا لم تكن أنت من سجل الدخول، يرجى تغيير كلمة المرور فوراً.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Successful Login</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#10b981;font-size:24px;margin:0 0 20px 0;text-align:center}.login-box{background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>✅ Successful Login</h2><p>Hello <strong>{{userName}}</strong>,</p><div class="login-box"><h3 style="color:#059669;margin:0 0 15px 0">🔐 Login successful</h3><p style="color:#047857;margin:5px 0"><strong>Time:</strong> {{loginTime}}</p><p style="color:#047857;margin:5px 0"><strong>Location:</strong> {{location}}</p><p style="color:#047857;margin:5px 0"><strong>Device:</strong> {{device}}</p></div><p>If this was not you, please change your password immediately.</p></div></div></body></html>',
    true
),

-- إشعار محاولة تسجيل دخول فاشلة
(
    'login_failed_notification',
    'إشعار محاولة تسجيل دخول فاشلة',
    'Login Failed Notification',
    '⚠️ محاولة تسجيل دخول فاشلة - رزقي',
    '⚠️ Failed Login Attempt - Rezge',
    'مرحباً {{userName}}، تم رصد محاولة تسجيل دخول فاشلة لحسابك. الوقت: {{attemptTime}}، الموقع: {{location}}، السبب: {{reason}}.',
    'Hello {{userName}}, A failed login attempt to your account has been detected. Time: {{attemptTime}}, Location: {{location}}, Reason: {{reason}}.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>محاولة تسجيل دخول فاشلة</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#f59e0b;font-size:24px;margin:0 0 20px 0;text-align:center}.failed-box{background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>⚠️ محاولة تسجيل دخول فاشلة</h2><p>مرحباً <strong>{{userName}}</strong>،</p><div class="failed-box"><h3 style="color:#d97706;margin:0 0 15px 0">🚨 تم رصد محاولة دخول فاشلة</h3><p style="color:#92400e;margin:5px 0"><strong>الوقت:</strong> {{attemptTime}}</p><p style="color:#92400e;margin:5px 0"><strong>الموقع:</strong> {{location}}</p><p style="color:#92400e;margin:5px 0"><strong>السبب:</strong> {{reason}}</p></div><p>إذا لم تكن أنت، يرجى تغيير كلمة المرور فوراً وتفعيل المصادقة الثنائية.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Failed Login Attempt</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#f59e0b;font-size:24px;margin:0 0 20px 0;text-align:center}.failed-box{background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>⚠️ Failed Login Attempt</h2><p>Hello <strong>{{userName}}</strong>,</p><div class="failed-box"><h3 style="color:#d97706;margin:0 0 15px 0">🚨 Failed login attempt detected</h3><p style="color:#92400e;margin:5px 0"><strong>Time:</strong> {{attemptTime}}</p><p style="color:#92400e;margin:5px 0"><strong>Location:</strong> {{location}}</p><p style="color:#92400e;margin:5px 0"><strong>Reason:</strong> {{reason}}</p></div><p>If this was not you, please change your password immediately and enable two-factor authentication.</p></div></div></body></html>',
    true
),

-- إشعار فشل التحقق الثنائي
(
    'two_factor_failure_notification',
    'إشعار فشل التحقق الثنائي',
    'Two-Factor Failure Notification',
    '🔐 فشل التحقق الثنائي - رزقي',
    '🔐 Two-Factor Authentication Failure - Rezge',
    'مرحباً {{userName}}، تم رصد فشل في التحقق الثنائي لحسابك. عدد المحاولات: {{attemptsCount}}، الوقت: {{failureTime}}.',
    'Hello {{userName}}, A two-factor authentication failure has been detected for your account. Attempts count: {{attemptsCount}}, Time: {{failureTime}}.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>فشل التحقق الثنائي</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#dc2626;font-size:24px;margin:0 0 20px 0;text-align:center}.failure-box{background:linear-gradient(135deg,#fef2f2 0%,#fecaca 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>🔐 فشل التحقق الثنائي</h2><p>مرحباً <strong>{{userName}}</strong>،</p><div class="failure-box"><h3 style="color:#b91c1c;margin:0 0 15px 0">⚠️ تم رصد فشل في التحقق الثنائي</h3><p style="color:#991b1b;margin:5px 0"><strong>عدد المحاولات:</strong> {{attemptsCount}}</p><p style="color:#991b1b;margin:5px 0"><strong>الوقت:</strong> {{failureTime}}</p></div><p>إذا لم تكن أنت، يرجى تغيير كلمة المرور فوراً. تأكد من أن تطبيق المصادقة الثنائية يعمل بشكل صحيح.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Two-Factor Authentication Failure</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#dc2626;font-size:24px;margin:0 0 20px 0;text-align:center}.failure-box{background:linear-gradient(135deg,#fef2f2 0%,#fecaca 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>🔐 Two-Factor Authentication Failure</h2><p>Hello <strong>{{userName}}</strong>,</p><div class="failure-box"><h3 style="color:#b91c1c;margin:0 0 15px 0">⚠️ Two-factor authentication failure detected</h3><p style="color:#991b1b;margin:5px 0"><strong>Attempts count:</strong> {{attemptsCount}}</p><p style="color:#991b1b;margin:5px 0"><strong>Time:</strong> {{failureTime}}</p></div><p>If this was not you, please change your password immediately. Make sure your two-factor authentication app is working correctly.</p></div></div></body></html>',
    true
),

-- إشعار تعطيل المصادقة الثنائية
(
    'two_factor_disable_notification',
    'إشعار تعطيل المصادقة الثنائية',
    'Two-Factor Disable Notification',
    '🔓 تم تعطيل المصادقة الثنائية - رزقي',
    '🔓 Two-Factor Authentication Disabled - Rezge',
    'مرحباً {{userName}}، تم تعطيل المصادقة الثنائية لحسابك. الوقت: {{disableTime}}. إذا لم تكن أنت، يرجى إعادة تفعيلها فوراً.',
    'Hello {{userName}}, Two-factor authentication has been disabled for your account. Time: {{disableTime}}. If this was not you, please re-enable it immediately.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تم تعطيل المصادقة الثنائية</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#f59e0b;font-size:24px;margin:0 0 20px 0;text-align:center}.disable-box{background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>🔓 تم تعطيل المصادقة الثنائية</h2><p>مرحباً <strong>{{userName}}</strong>،</p><div class="disable-box"><h3 style="color:#d97706;margin:0 0 15px 0">⚠️ تم تعطيل المصادقة الثنائية</h3><p style="color:#92400e;margin:5px 0"><strong>الوقت:</strong> {{disableTime}}</p></div><p>إذا لم تكن أنت من عطل المصادقة الثنائية، يرجى إعادة تفعيلها فوراً لتأمين حسابك.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Two-Factor Authentication Disabled</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#f59e0b;font-size:24px;margin:0 0 20px 0;text-align:center}.disable-box{background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>🔓 Two-Factor Authentication Disabled</h2><p>Hello <strong>{{userName}}</strong>,</p><div class="disable-box"><h3 style="color:#d97706;margin:0 0 15px 0">⚠️ Two-factor authentication disabled</h3><p style="color:#92400e;margin:5px 0"><strong>Time:</strong> {{disableTime}}</p></div><p>If you did not disable two-factor authentication, please re-enable it immediately to secure your account.</p></div></div></body></html>',
    true
);

-- إدراج أنواع الإشعارات الأمنية الإضافية
INSERT INTO email_notification_types (name, name_ar, name_en, description_ar, description_en, template_id, is_active) VALUES
(
    'login_success_notification',
    'إشعار تسجيل الدخول الناجح',
    'Login Success Notification',
    'إشعار عند تسجيل الدخول بنجاح',
    'Notification when login is successful',
    (SELECT id FROM email_templates WHERE name = 'login_success_notification' LIMIT 1),
    true
),
(
    'login_failed_notification',
    'إشعار محاولة تسجيل دخول فاشلة',
    'Login Failed Notification',
    'إشعار عند فشل محاولة تسجيل الدخول',
    'Notification when login attempt fails',
    (SELECT id FROM email_templates WHERE name = 'login_failed_notification' LIMIT 1),
    true
),
(
    'two_factor_failure_notification',
    'إشعار فشل التحقق الثنائي',
    'Two-Factor Failure Notification',
    'إشعار عند فشل التحقق الثنائي',
    'Notification when two-factor authentication fails',
    (SELECT id FROM email_templates WHERE name = 'two_factor_failure_notification' LIMIT 1),
    true
),
(
    'two_factor_disable_notification',
    'إشعار تعطيل المصادقة الثنائية',
    'Two-Factor Disable Notification',
    'إشعار عند تعطيل المصادقة الثنائية',
    'Notification when two-factor authentication is disabled',
    (SELECT id FROM email_templates WHERE name = 'two_factor_disable_notification' LIMIT 1),
    true
);

SELECT 'تم إضافة القوالب الأمنية الإضافية بنجاح! 🎉' as message;
