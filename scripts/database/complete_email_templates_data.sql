-- رفع جميع قوالب ومحتوى الإيميلات المستخدمة فعلياً في نظام رزقي
-- Complete Email Templates and Content Used in Rezge System
-- تاريخ الإنشاء: 21 سبتمبر 2025

-- حذف البيانات القديمة
DELETE FROM email_logs;
DELETE FROM email_notification_types;
DELETE FROM email_templates;
DELETE FROM email_settings;

-- إدراج إعدادات SMTP المستخدمة فعلياً
INSERT INTO email_settings (smtp_host, smtp_port, smtp_username, smtp_password, from_name_ar, from_name_en, from_email, reply_to, is_active) VALUES
(
    'smtp.hostinger.com',
    465,
    'manage@kareemamged.com',
    'Kk170404#',
    'رزقي - منصة الزواج الإسلامي الشرعي',
    'Rezge - Islamic Marriage Platform',
    'manage@kareemamged.com',
    'support@kareemamged.com',
    true
);

-- إدراج قوالب الإيميلات المستخدمة فعلياً
INSERT INTO email_templates (name, name_ar, name_en, subject_ar, subject_en, content_ar, content_en, html_template_ar, html_template_en, is_active) VALUES

-- 1. قالب تحقق الحساب (Account Verification)
(
    'account_verification',
    'تحقق الحساب',
    'Account Verification',
    '🔐 تأكيد حسابك في رزقي',
    '🔐 Confirm Your Rezge Account',
    'مرحباً {{firstName}} {{lastName}}، شكراً لك على التسجيل في موقع رزقي للزواج الإسلامي الشرعي. اضغط على الزر أدناه لتأكيد حسابك وتعيين كلمة المرور: {{verificationUrl}} هذا الرابط صالح لمدة 24 ساعة فقط. لا تشارك هذا الرابط مع أحد.',
    'Hello {{firstName}} {{lastName}}, Thank you for joining Rezge Islamic Marriage Platform. Click the button below to confirm your account and set your password: {{verificationUrl}} This link is valid for 24 hours only. Do not share this link with anyone.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>تأكيد حسابك في رزقي</title><style>@import url("https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap");body{margin:0;padding:0;font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);padding:40px 20px;min-height:100vh}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#1e40af 0%,#059669 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.tagline{color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px}.content{padding:40px 30px}.content h2{color:#1e40af;font-size:24px;margin:0 0 20px 0;text-align:center}.content p{color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px 0}.button{display:inline-block;background:linear-gradient(135deg,#1e40af 0%,#059669 100%);color:white!important;padding:15px 30px;text-decoration:none;border-radius:10px;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(30,64,175,0.3)}.button-container{text-align:center;margin:30px 0}.warning{background:#fef3c7;border-radius:8px;padding:15px;margin:20px 0;border-right:4px solid #f59e0b}.footer{background:#f8fafc;padding:30px;text-align:center;border-top:1px solid #e5e7eb;color:#6b7280;font-size:14px}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p class="tagline">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>مرحباً بك في رزقي!</h2><p>أهلاً وسهلاً {{firstName}} {{lastName}}،</p><p>نشكرك على انضمامك إلى موقع رزقي للزواج الإسلامي الشرعي. لإكمال إنشاء حسابك، يرجى النقر على الرابط أدناه لتعيين كلمة المرور:</p><div class="button-container"><a href="{{verificationUrl}}" class="button">تأكيد الحساب</a></div><div class="warning"><strong>مهم:</strong> هذا الرابط صالح لمدة 24 ساعة فقط من وقت إرسال هذا الإيميل.</div><div class="warning"><strong>أمان:</strong> لا تشارك هذا الرابط مع أي شخص. إذا لم تطلب إنشاء حساب، يرجى تجاهل هذا الإيميل.</div></div><div class="footer"><p>فريق رزقي - موقع الزواج الإسلامي الشرعي</p><div style="font-size:12px;color:#9ca3af">هذا إيميل تلقائي، يرجى عدم الرد عليه مباشرة</div></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Confirm Your Rezge Account</title><style>@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");body{margin:0;padding:0;font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);padding:40px 20px;min-height:100vh}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#1e40af 0%,#059669 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.tagline{color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px}.content{padding:40px 30px}.content h2{color:#1e40af;font-size:24px;margin:0 0 20px 0;text-align:center}.content p{color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px 0}.button{display:inline-block;background:linear-gradient(135deg,#1e40af 0%,#059669 100%);color:white!important;padding:15px 30px;text-decoration:none;border-radius:10px;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(30,64,175,0.3)}.button-container{text-align:center;margin:30px 0}.warning{background:#fef3c7;border-radius:8px;padding:15px;margin:20px 0;border-left:4px solid #f59e0b}.footer{background:#f8fafc;padding:30px;text-align:center;border-top:1px solid #e5e7eb;color:#6b7280;font-size:14px}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p class="tagline">Islamic Marriage Platform</p></div><div class="content"><h2>Welcome to Rezge!</h2><p>Hello {{firstName}} {{lastName}},</p><p>Thank you for joining Rezge Islamic Marriage Platform. To complete your registration and activate your account, please click the link below to set your password:</p><div class="button-container"><a href="{{verificationUrl}}" class="button">Confirm Account</a></div><div class="warning"><strong>Important:</strong> This link is valid for 24 hours only from the time this email was sent.</div><div class="warning"><strong>Security:</strong> Do not share this link with anyone. If you did not create this account, please ignore this email.</div></div><div class="footer"><p>Rezge Team - Islamic Marriage Platform</p><div style="font-size:12px;color:#9ca3af">This is an automated email, please do not reply directly</div></div></div></body></html>',
    true
),

-- 2. قالب كلمة المرور المؤقتة (Temporary Password)
(
    'temporary_password',
    'كلمة المرور المؤقتة',
    'Temporary Password',
    '🔑 كلمة مرور مؤقتة - رزقي',
    '🔑 Temporary Password - Rezge',
    'مرحباً {{recipientName}}، تم إنشاء كلمة مرور مؤقتة لحسابك في رزقي. كلمة المرور المؤقتة: {{temporaryPassword}} صالحة حتى: {{expiresAt}} يرجى تسجيل الدخول وتغيير كلمة المرور فوراً لأسباب أمنية.',
    'Hello {{recipientName}}, A temporary password has been created for your Rezge account. Temporary Password: {{temporaryPassword}} Valid until: {{expiresAt}} Please login and change your password immediately for security reasons.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>كلمة مرور مؤقتة - رزقي</title><style>@import url("https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap");body{margin:0;padding:0;font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);padding:40px 20px;min-height:100vh}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#dc2626;font-size:24px;margin:0 0 20px 0;text-align:center}.password-box{background:#fef2f2;border:2px solid #fecaca;border-radius:12px;padding:20px;margin:25px 0;text-align:center}.password{font-size:24px;font-weight:bold;color:#dc2626;font-family:monospace;letter-spacing:2px}.warning{background:#fef3c7;border-radius:8px;padding:15px;margin:20px 0;border-right:4px solid #f59e0b}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>🔑 كلمة مرور مؤقتة</h2><p>مرحباً {{recipientName}}،</p><p>تم إنشاء كلمة مرور مؤقتة لحسابك في رزقي:</p><div class="password-box"><div style="color:#6b7280;font-size:14px;margin-bottom:10px">كلمة المرور المؤقتة</div><div class="password">{{temporaryPassword}}</div><div style="color:#6b7280;font-size:12px;margin-top:10px">صالحة حتى: {{expiresAt}}</div></div><div class="warning"><strong>مهم جداً:</strong> يرجى تسجيل الدخول وتغيير كلمة المرور فوراً لأسباب أمنية.</div></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Temporary Password - Rezge</title><style>@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");body{margin:0;padding:0;font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);padding:40px 20px;min-height:100vh}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#dc2626;font-size:24px;margin:0 0 20px 0;text-align:center}.password-box{background:#fef2f2;border:2px solid #fecaca;border-radius:12px;padding:20px;margin:25px 0;text-align:center}.password{font-size:24px;font-weight:bold;color:#dc2626;font-family:monospace;letter-spacing:2px}.warning{background:#fef3c7;border-radius:8px;padding:15px;margin:20px 0;border-left:4px solid #f59e0b}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>🔑 Temporary Password</h2><p>Hello {{recipientName}},</p><p>A temporary password has been created for your Rezge account:</p><div class="password-box"><div style="color:#6b7280;font-size:14px;margin-bottom:10px">Temporary Password</div><div class="password">{{temporaryPassword}}</div><div style="color:#6b7280;font-size:12px;margin-top:10px">Valid until: {{expiresAt}}</div></div><div class="warning"><strong>Very Important:</strong> Please login and change your password immediately for security reasons.</div></div></div></body></html>',
    true
),

-- 3. قالب رمز التحقق الثنائي (Two-Factor Authentication)
(
    'two_factor_code',
    'رمز التحقق الثنائي',
    'Two-Factor Authentication Code',
    '🔒 رمز التحقق - رزقي',
    '🔒 Verification Code - Rezge',
    'مرحباً، تم طلب تسجيل دخول لحسابك في رزقي. رمز التحقق: {{code}} صالح لمدة {{expiresInMinutes}} دقيقة. إذا لم تطلب هذا الرمز، يرجى تجاهل هذا الإيميل.',
    'Hello, A login has been requested for your Rezge account. Verification Code: {{code}} Valid for {{expiresInMinutes}} minutes. If you did not request this code, please ignore this email.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>رمز التحقق - رزقي</title><style>@import url("https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap");body{margin:0;padding:0;font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);padding:40px 20px;min-height:100vh}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#7c3aed 0%,#5b21b6 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#7c3aed;font-size:24px;margin:0 0 20px 0;text-align:center}.code-box{background:#f3f4f6;border:3px solid #e5e7eb;border-radius:15px;padding:30px;margin:25px 0;text-align:center}.code{font-size:36px;font-weight:bold;color:#1f2937;font-family:monospace;letter-spacing:8px}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>🔒 رمز التحقق</h2><p>السلام عليكم ورحمة الله وبركاته،</p><p>تم طلب تسجيل دخول لحسابك في رزقي. استخدم الرمز التالي:</p><div class="code-box"><div style="color:#6b7280;font-size:14px;margin-bottom:15px">رمز التحقق</div><div class="code">{{code}}</div><div style="color:#6b7280;font-size:12px;margin-top:15px">صالح لمدة {{expiresInMinutes}} دقيقة</div></div><p style="color:#6b7280;font-size:14px">إذا لم تطلب هذا الرمز، يرجى تجاهل هذا الإيميل.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Verification Code - Rezge</title><style>@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");body{margin:0;padding:0;font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);padding:40px 20px;min-height:100vh}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#7c3aed 0%,#5b21b6 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#7c3aed;font-size:24px;margin:0 0 20px 0;text-align:center}.code-box{background:#f3f4f6;border:3px solid #e5e7eb;border-radius:15px;padding:30px;margin:25px 0;text-align:center}.code{font-size:36px;font-weight:bold;color:#1f2937;font-family:monospace;letter-spacing:8px}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>🔒 Verification Code</h2><p>Assalamu Alaikum,</p><p>A login has been requested for your Rezge account. Use the code below:</p><div class="code-box"><div style="color:#6b7280;font-size:14px;margin-bottom:15px">Verification Code</div><div class="code">{{code}}</div><div style="color:#6b7280;font-size:12px;margin-top:15px">Valid for {{expiresInMinutes}} minutes</div></div><p style="color:#6b7280;font-size:14px">If you did not request this code, please ignore this email.</p></div></div></body></html>',
    true
),

-- 4. قالب الترحيب (Welcome Email)
(
    'welcome_email',
    'إيميل ترحيب',
    'Welcome Email',
    '🎉 مرحباً بك في رزقي!',
    '🎉 Welcome to Rezge!',
    'مرحباً {{userName}}، مرحباً بك في منصة رزقي - منصة الزواج الإسلامية الشرعية. نحن سعداء بانضمامك إلينا. تم إنشاء حسابك بنجاح ويمكنك الآن الاستمتاع بجميع ميزات المنصة.',
    'Hello {{userName}}, Welcome to Rezge - the Islamic marriage platform. We are happy to have you join us. Your account has been successfully created and you can now enjoy all the platform features.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>مرحباً بك في رزقي</title><style>@import url("https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap");body{margin:0;padding:0;font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);padding:40px 20px;min-height:100vh}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#059669 0%,#047857 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#059669;font-size:24px;margin:0 0 20px 0;text-align:center}.welcome-box{background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>🎉 مرحباً بك في رزقي</h2><p>مرحباً <strong>{{userName}}</strong>،</p><div class="welcome-box"><h3 style="color:#047857;margin:0 0 15px 0">تم إنشاء حسابك بنجاح!</h3><p style="color:#065f46;margin:0">نرحب بك في منصة رزقي، المنصة الإسلامية الرائدة للتعارف والزواج الحلال المتوافق مع الشريعة الإسلامية.</p></div><p>يمكنك الآن الاستمتاع بجميع ميزات المنصة والبدء في رحلتك للعثور على شريك الحياة المناسب.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Welcome to Rezge</title><style>@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");body{margin:0;padding:0;font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);padding:40px 20px;min-height:100vh}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#059669 0%,#047857 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#059669;font-size:24px;margin:0 0 20px 0;text-align:center}.welcome-box{background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>🎉 Welcome to Rezge</h2><p>Hello <strong>{{userName}}</strong>,</p><div class="welcome-box"><h3 style="color:#047857;margin:0 0 15px 0">Your account has been successfully created!</h3><p style="color:#065f46;margin:0">Welcome to Rezge, the leading Islamic platform for halal marriage and relationships in accordance with Islamic law.</p></div><p>You can now enjoy all the platform features and start your journey to find the right life partner.</p></div></div></body></html>',
    true
);

-- إدراج أنواع الإشعارات البريدية المستخدمة فعلياً
INSERT INTO email_notification_types (name, name_ar, name_en, description_ar, description_en, template_id, is_active) VALUES
(
    'account_verification',
    'تحقق الحساب',
    'Account Verification',
    'إيميل تحقق الحساب للمستخدمين الجدد',
    'Account verification email for new users',
    (SELECT id FROM email_templates WHERE name = 'account_verification' LIMIT 1),
    true
),
(
    'temporary_password',
    'كلمة المرور المؤقتة',
    'Temporary Password',
    'إيميل كلمة المرور المؤقتة لإعادة تعيين كلمة المرور',
    'Temporary password email for password reset',
    (SELECT id FROM email_templates WHERE name = 'temporary_password' LIMIT 1),
    true
),
(
    'two_factor_code',
    'رمز التحقق الثنائي',
    'Two-Factor Code',
    'إيميل رمز التحقق الثنائي لتسجيل الدخول الآمن',
    'Two-factor authentication code email for secure login',
    (SELECT id FROM email_templates WHERE name = 'two_factor_code' LIMIT 1),
    true
),
(
    'welcome_email',
    'إيميل ترحيب',
    'Welcome Email',
    'إيميل ترحيب للمستخدمين الجدد بعد إنشاء الحساب',
    'Welcome email for new users after account creation',
    (SELECT id FROM email_templates WHERE name = 'welcome_email' LIMIT 1),
    true
);

SELECT 'تم رفع جميع قوالب ومحتوى الإيميلات المستخدمة فعلياً بنجاح!' as message;







