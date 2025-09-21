-- قوالب إضافية للإيميلات المستخدمة في النظام
-- Additional Email Templates Used in the System

-- إدراج قوالب الإيميلات الإضافية
INSERT INTO email_templates (name, name_ar, name_en, subject_ar, subject_en, content_ar, content_en, html_template_ar, html_template_en, is_active) VALUES

-- 5. قالب إشعار تسجيل الدخول (Login Notification)
(
    'login_notification',
    'إشعار تسجيل الدخول',
    'Login Notification',
    '✅ تسجيل دخول ناجح - رزقي',
    '✅ Successful Login - Rezge',
    'مرحباً {{userName}}، تم تسجيل الدخول إلى حسابك بنجاح. الوقت: {{timestamp}} الموقع: {{location}} الجهاز: {{deviceType}} المتصفح: {{browser}} إذا لم تكن أنت، يرجى تغيير كلمة المرور فوراً.',
    'Hello {{userName}}, Your account has been successfully logged in. Time: {{timestamp}} Location: {{location}} Device: {{deviceType}} Browser: {{browser}} If this was not you, please change your password immediately.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تسجيل دخول ناجح</title><style>body{font-family:"Amiri",serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.info-box{background:#f3f4f6;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>✅ تسجيل دخول ناجح</h1><p>رزقي - موقع الزواج الإسلامي الشرعي</p></div><div class="content"><p>مرحباً <strong>{{userName}}</strong>،</p><p>تم تسجيل الدخول إلى حسابك بنجاح.</p><div class="info-box"><h3>📋 تفاصيل تسجيل الدخول:</h3><ul><li><strong>الوقت:</strong> {{timestamp}}</li><li><strong>الموقع:</strong> {{location}}</li><li><strong>الجهاز:</strong> {{deviceType}}</li><li><strong>المتصفح:</strong> {{browser}}</li></ul></div><p style="color:#dc2626"><strong>⚠️ إذا لم تكن أنت، يرجى تغيير كلمة المرور فوراً.</strong></p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Successful Login</title><style>body{font-family:"Inter",sans-serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.info-box{background:#f3f4f6;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>✅ Successful Login</h1><p>Rezge - Islamic Marriage Platform</p></div><div class="content"><p>Hello <strong>{{userName}}</strong>,</p><p>Your account has been successfully logged in.</p><div class="info-box"><h3>📋 Login Details:</h3><ul><li><strong>Time:</strong> {{timestamp}}</li><li><strong>Location:</strong> {{location}}</li><li><strong>Device:</strong> {{deviceType}}</li><li><strong>Browser:</strong> {{browser}}</li></ul></div><p style="color:#dc2626"><strong>⚠️ If this was not you, please change your password immediately.</strong></p></div></div></body></html>',
    true
),

-- 6. قالب رسالة التواصل (Contact Message)
(
    'contact_message',
    'رسالة تواصل',
    'Contact Message',
    '📬 رسالة تواصل جديدة - رزقي',
    '📬 New Contact Message - Rezge',
    'رسالة جديدة من {{senderName}} الإيميل: {{senderEmail}} الهاتف: {{phone}} الموضوع: {{subject}} الرسالة: {{message}}',
    'New message from {{senderName}} Email: {{senderEmail}} Phone: {{phone}} Subject: {{subject}} Message: {{message}}',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>رسالة تواصل جديدة</title><style>body{font-family:"Amiri",serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.sender-info{background:#f8fafc;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>📬 رسالة تواصل جديدة</h1><p>رزقي - موقع الزواج الإسلامي الشرعي</p></div><div class="content"><div class="sender-info"><h3>📋 معلومات المرسل:</h3><ul><li><strong>الاسم:</strong> {{senderName}}</li><li><strong>الإيميل:</strong> {{senderEmail}}</li><li><strong>الهاتف:</strong> {{phone}}</li><li><strong>الموضوع:</strong> {{subject}}</li></ul></div><div style="background:#f1f5f9;padding:20px;border-radius:10px;margin:20px 0"><h3>📨 الرسالة:</h3><p>{{message}}</p></div></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>New Contact Message</title><style>body{font-family:"Inter",sans-serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.sender-info{background:#f8fafc;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>📬 New Contact Message</h1><p>Rezge - Islamic Marriage Platform</p></div><div class="content"><div class="sender-info"><h3>📋 Sender Information:</h3><ul><li><strong>Name:</strong> {{senderName}}</li><li><strong>Email:</strong> {{senderEmail}}</li><li><strong>Phone:</strong> {{phone}}</li><li><strong>Subject:</strong> {{subject}}</li></ul></div><div style="background:#f1f5f9;padding:20px;border-radius:10px;margin:20px 0"><h3>📨 Message:</h3><p>{{message}}</p></div></div></div></body></html>',
    true
),

-- 7. قالب إشعار الأمان (Security Notification)
(
    'security_notification',
    'إشعار أمني',
    'Security Notification',
    '🛡️ إشعار أمني - رزقي',
    '🛡️ Security Notification - Rezge',
    'مرحباً {{userName}}، تم رصد نشاط أمني في حسابك. نوع النشاط: {{activityType}} الوقت: {{timestamp}} الموقع: {{location}} يرجى مراجعة حسابك والتأكد من الأمان.',
    'Hello {{userName}}, Security activity has been detected in your account. Activity Type: {{activityType}} Time: {{timestamp}} Location: {{location}} Please review your account and ensure security.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>إشعار أمني</title><style>body{font-family:"Amiri",serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.alert-box{background:#fef2f2;border:2px solid #fecaca;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>🛡️ إشعار أمني</h1><p>رزقي - موقع الزواج الإسلامي الشرعي</p></div><div class="content"><p>مرحباً <strong>{{userName}}</strong>،</p><div class="alert-box"><h3 style="color:#dc2626">⚠️ تم رصد نشاط أمني في حسابك</h3><ul><li><strong>نوع النشاط:</strong> {{activityType}}</li><li><strong>الوقت:</strong> {{timestamp}}</li><li><strong>الموقع:</strong> {{location}}</li></ul></div><p><strong>يرجى مراجعة حسابك والتأكد من الأمان فوراً.</strong></p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Security Notification</title><style>body{font-family:"Inter",sans-serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.alert-box{background:#fef2f2;border:2px solid #fecaca;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>🛡️ Security Notification</h1><p>Rezge - Islamic Marriage Platform</p></div><div class="content"><p>Hello <strong>{{userName}}</strong>,</p><div class="alert-box"><h3 style="color:#dc2626">⚠️ Security activity has been detected in your account</h3><ul><li><strong>Activity Type:</strong> {{activityType}}</li><li><strong>Time:</strong> {{timestamp}}</li><li><strong>Location:</strong> {{location}}</li></ul></div><p><strong>Please review your account and ensure security immediately.</strong></p></div></div></body></html>',
    true
),

-- 8. قالب تغيير كلمة المرور (Password Change Notification)
(
    'password_change_notification',
    'إشعار تغيير كلمة المرور',
    'Password Change Notification',
    '🔐 تم تغيير كلمة المرور - رزقي',
    '🔐 Password Changed - Rezge',
    'مرحباً {{userName}}، تم تغيير كلمة المرور لحسابك بنجاح. الوقت: {{timestamp}} الموقع: {{location}} إذا لم تقم بهذا التغيير، يرجى الاتصال بنا فوراً.',
    'Hello {{userName}}, Your account password has been successfully changed. Time: {{timestamp}} Location: {{location}} If you did not make this change, please contact us immediately.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تم تغيير كلمة المرور</title><style>body{font-family:"Amiri",serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:30px;text-align:center;color:white}.content{padding:30px}</style></head><body><div class="container"><div class="header"><h1>🔐 تم تغيير كلمة المرور</h1><p>رزقي - موقع الزواج الإسلامي الشرعي</p></div><div class="content"><p>مرحباً <strong>{{userName}}</strong>،</p><p>تم تغيير كلمة المرور لحسابك بنجاح.</p><div style="background:#ecfdf5;padding:20px;border-radius:10px;margin:20px 0"><h3>📋 تفاصيل التغيير:</h3><ul><li><strong>الوقت:</strong> {{timestamp}}</li><li><strong>الموقع:</strong> {{location}}</li></ul></div><p style="color:#dc2626"><strong>إذا لم تقم بهذا التغيير، يرجى الاتصال بنا فوراً.</strong></p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Password Changed</title><style>body{font-family:"Inter",sans-serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:30px;text-align:center;color:white}.content{padding:30px}</style></head><body><div class="container"><div class="header"><h1>🔐 Password Changed</h1><p>Rezge - Islamic Marriage Platform</p></div><div class="content"><p>Hello <strong>{{userName}}</strong>,</p><p>Your account password has been successfully changed.</p><div style="background:#ecfdf5;padding:20px;border-radius:10px;margin:20px 0"><h3>📋 Change Details:</h3><ul><li><strong>Time:</strong> {{timestamp}}</li><li><strong>Location:</strong> {{location}}</li></ul></div><p style="color:#dc2626"><strong>If you did not make this change, please contact us immediately.</strong></p></div></div></body></html>',
    true
);

-- إدراج أنواع الإشعارات الإضافية
INSERT INTO email_notification_types (name, name_ar, name_en, description_ar, description_en, template_id, is_active) VALUES
(
    'login_notification',
    'إشعار تسجيل الدخول',
    'Login Notification',
    'إشعار تسجيل الدخول الناجح للمستخدمين',
    'Successful login notification for users',
    (SELECT id FROM email_templates WHERE name = 'login_notification' LIMIT 1),
    true
),
(
    'contact_message',
    'رسالة تواصل',
    'Contact Message',
    'رسائل التواصل من المستخدمين',
    'Contact messages from users',
    (SELECT id FROM email_templates WHERE name = 'contact_message' LIMIT 1),
    true
),
(
    'security_notification',
    'إشعار أمني',
    'Security Notification',
    'إشعارات الأمان والنشاطات المشبوهة',
    'Security notifications and suspicious activities',
    (SELECT id FROM email_templates WHERE name = 'security_notification' LIMIT 1),
    true
),
(
    'password_change_notification',
    'إشعار تغيير كلمة المرور',
    'Password Change Notification',
    'إشعار تغيير كلمة المرور للمستخدمين',
    'Password change notification for users',
    (SELECT id FROM email_templates WHERE name = 'password_change_notification' LIMIT 1),
    true
);

SELECT 'تم رفع القوالب الإضافية بنجاح!' as message;
