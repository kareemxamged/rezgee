-- قوالب متخصصة إضافية للإيميلات
-- Specialized Additional Email Templates

-- إدراج القوالب المتخصصة
INSERT INTO email_templates (name, name_ar, name_en, subject_ar, subject_en, content_ar, content_en, html_template_ar, html_template_en, is_active) VALUES

-- 9. قالب تفعيل المصادقة الثنائية (Two-Factor Authentication Enable)
(
    'two_factor_enable',
    'تفعيل المصادقة الثنائية',
    'Two-Factor Authentication Enable',
    '✅ تم تفعيل المصادقة الثنائية - رزقي',
    '✅ Two-Factor Authentication Enabled - Rezge',
    'مرحباً {{userName}}، تم تفعيل المصادقة الثنائية لحسابك بنجاح. هذا سيزيد من أمان حسابك ويحميك من الوصول غير المصرح به. يمكنك إدارة إعدادات الأمان من لوحة التحكم.',
    'Hello {{userName}}, Two-factor authentication has been successfully enabled for your account. This will increase your account security and protect you from unauthorized access. You can manage security settings from your dashboard.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تم تفعيل المصادقة الثنائية</title><style>body{font-family:"Amiri",serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.success-box{background:#ecfdf5;border:2px solid #a7f3d0;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>🔐 تم تفعيل المصادقة الثنائية</h1><p>رزقي - موقع الزواج الإسلامي الشرعي</p></div><div class="content"><p>مرحباً <strong>{{userName}}</strong>،</p><div class="success-box"><h3 style="color:#047857">✅ تم تفعيل المصادقة الثنائية بنجاح</h3><p style="color:#065f46">تم تفعيل المصادقة الثنائية لحسابك. هذا سيزيد من أمان حسابك ويحميك من الوصول غير المصرح به.</p></div><p>يمكنك إدارة إعدادات الأمان من لوحة التحكم الخاصة بك.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Two-Factor Authentication Enabled</title><style>body{font-family:"Inter",sans-serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.success-box{background:#ecfdf5;border:2px solid #a7f3d0;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>🔐 Two-Factor Authentication Enabled</h1><p>Rezge - Islamic Marriage Platform</p></div><div class="content"><p>Hello <strong>{{userName}}</strong>,</p><div class="success-box"><h3 style="color:#047857">✅ Two-factor authentication has been successfully enabled</h3><p style="color:#065f46">Two-factor authentication has been enabled for your account. This will increase your account security and protect you from unauthorized access.</p></div><p>You can manage security settings from your dashboard.</p></div></div></body></html>',
    true
),

-- 10. قالب إلغاء المصادقة الثنائية (Two-Factor Authentication Disable)
(
    'two_factor_disable',
    'إلغاء المصادقة الثنائية',
    'Two-Factor Authentication Disable',
    '❌ تم إلغاء تفعيل المصادقة الثنائية - رزقي',
    '❌ Two-Factor Authentication Disabled - Rezge',
    'مرحباً {{userName}}، تم إلغاء تفعيل المصادقة الثنائية لحسابك. لم تعد تحتاج إلى إدخال رمز التحقق عند تسجيل الدخول. ننصح بإعادة تفعيل المصادقة الثنائية لزيادة أمان حسابك.',
    'Hello {{userName}}, Two-factor authentication has been disabled for your account. You no longer need to enter a verification code when logging in. We recommend re-enabling two-factor authentication to increase your account security.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تم إلغاء تفعيل المصادقة الثنائية</title><style>body{font-family:"Amiri",serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.warning-box{background:#fef3c7;border:2px solid #fcd34d;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>🔓 تم إلغاء تفعيل المصادقة الثنائية</h1><p>رزقي - موقع الزواج الإسلامي الشرعي</p></div><div class="content"><p>مرحباً <strong>{{userName}}</strong>،</p><div class="warning-box"><h3 style="color:#92400e">⚠️ تم إلغاء تفعيل المصادقة الثنائية</h3><p style="color:#78350f">تم إلغاء تفعيل المصادقة الثنائية لحسابك. لم تعد تحتاج إلى إدخال رمز التحقق عند تسجيل الدخول.</p></div><p><strong>ننصح بإعادة تفعيل المصادقة الثنائية لزيادة أمان حسابك.</strong></p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Two-Factor Authentication Disabled</title><style>body{font-family:"Inter",sans-serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.warning-box{background:#fef3c7;border:2px solid #fcd34d;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>🔓 Two-Factor Authentication Disabled</h1><p>Rezge - Islamic Marriage Platform</p></div><div class="content"><p>Hello <strong>{{userName}}</strong>,</p><div class="warning-box"><h3 style="color:#92400e">⚠️ Two-factor authentication has been disabled</h3><p style="color:#78350f">Two-factor authentication has been disabled for your account. You no longer need to enter a verification code when logging in.</p></div><p><strong>We recommend re-enabling two-factor authentication to increase your account security.</strong></p></div></div></body></html>',
    true
),

-- 11. قالب تحديث البيانات الشخصية (Profile Update Notification)
(
    'profile_update_notification',
    'إشعار تحديث البيانات الشخصية',
    'Profile Update Notification',
    '📝 تم تحديث بياناتك الشخصية - رزقي',
    '📝 Your Profile Has Been Updated - Rezge',
    'مرحباً {{userName}}، تم تحديث بياناتك الشخصية بنجاح. التحديثات المطبقة: {{updatedFields}} الوقت: {{timestamp}} إذا لم تقم بهذا التحديث، يرجى الاتصال بنا فوراً.',
    'Hello {{userName}}, Your personal information has been successfully updated. Applied Updates: {{updatedFields}} Time: {{timestamp}} If you did not make this update, please contact us immediately.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تم تحديث بياناتك الشخصية</title><style>body{font-family:"Amiri",serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.update-box{background:#eff6ff;border:2px solid #bfdbfe;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>📝 تم تحديث بياناتك الشخصية</h1><p>رزقي - موقع الزواج الإسلامي الشرعي</p></div><div class="content"><p>مرحباً <strong>{{userName}}</strong>،</p><div class="update-box"><h3 style="color:#1d4ed8">✅ تم تحديث بياناتك الشخصية بنجاح</h3><p style="color:#1e40af"><strong>التحديثات المطبقة:</strong> {{updatedFields}}</p><p style="color:#1e40af"><strong>الوقت:</strong> {{timestamp}}</p></div><p style="color:#dc2626"><strong>إذا لم تقم بهذا التحديث، يرجى الاتصال بنا فوراً.</strong></p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Your Profile Has Been Updated</title><style>body{font-family:"Inter",sans-serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.update-box{background:#eff6ff;border:2px solid #bfdbfe;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>📝 Your Profile Has Been Updated</h1><p>Rezge - Islamic Marriage Platform</p></div><div class="content"><p>Hello <strong>{{userName}}</strong>,</p><div class="update-box"><h3 style="color:#1d4ed8">✅ Your personal information has been successfully updated</h3><p style="color:#1e40af"><strong>Applied Updates:</strong> {{updatedFields}}</p><p style="color:#1e40af"><strong>Time:</strong> {{timestamp}}</p></div><p style="color:#dc2626"><strong>If you did not make this update, please contact us immediately.</strong></p></div></div></body></html>',
    true
),

-- 12. قالب رسالة جديدة (New Message Notification)
(
    'new_message_notification',
    'إشعار رسالة جديدة',
    'New Message Notification',
    '💬 رسالة جديدة من {{senderName}} - رزقي',
    '💬 New Message from {{senderName}} - Rezge',
    'مرحباً {{userName}}، وصلتك رسالة جديدة من {{senderName}}. معاينة الرسالة: {{messagePreview}} يمكنك قراءة الرسالة كاملة من خلال تسجيل الدخول إلى حسابك.',
    'Hello {{userName}}, You have received a new message from {{senderName}}. Message Preview: {{messagePreview}} You can read the full message by logging into your account.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>رسالة جديدة</title><style>body{font-family:"Amiri",serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#8b5cf6 0%,#7c3aed 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.message-box{background:#f5f3ff;border:2px solid #d8b4fe;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>💬 رسالة جديدة</h1><p>رزقي - موقع الزواج الإسلامي الشرعي</p></div><div class="content"><p>مرحباً <strong>{{userName}}</strong>،</p><p>وصلتك رسالة جديدة من <strong>{{senderName}}</strong>.</p><div class="message-box"><h3 style="color:#7c3aed">📨 معاينة الرسالة:</h3><p style="color:#6b46c1;font-style:italic">"{{messagePreview}}"</p></div><p>يمكنك قراءة الرسالة كاملة من خلال تسجيل الدخول إلى حسابك.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>New Message</title><style>body{font-family:"Inter",sans-serif;background:#f0f9ff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#8b5cf6 0%,#7c3aed 100%);padding:30px;text-align:center;color:white}.content{padding:30px}.message-box{background:#f5f3ff;border:2px solid #d8b4fe;padding:20px;border-radius:10px;margin:20px 0}</style></head><body><div class="container"><div class="header"><h1>💬 New Message</h1><p>Rezge - Islamic Marriage Platform</p></div><div class="content"><p>Hello <strong>{{userName}}</strong>,</p><p>You have received a new message from <strong>{{senderName}}</strong>.</p><div class="message-box"><h3 style="color:#7c3aed">📨 Message Preview:</h3><p style="color:#6b46c1;font-style:italic">"{{messagePreview}}"</p></div><p>You can read the full message by logging into your account.</p></div></div></body></html>',
    true
);

-- إدراج أنواع الإشعارات المتخصصة
INSERT INTO email_notification_types (name, name_ar, name_en, description_ar, description_en, template_id, is_active) VALUES
(
    'two_factor_enable',
    'تفعيل المصادقة الثنائية',
    'Two-Factor Enable',
    'إشعار تفعيل المصادقة الثنائية',
    'Two-factor authentication enable notification',
    (SELECT id FROM email_templates WHERE name = 'two_factor_enable' LIMIT 1),
    true
),
(
    'two_factor_disable',
    'إلغاء المصادقة الثنائية',
    'Two-Factor Disable',
    'إشعار إلغاء المصادقة الثنائية',
    'Two-factor authentication disable notification',
    (SELECT id FROM email_templates WHERE name = 'two_factor_disable' LIMIT 1),
    true
),
(
    'profile_update_notification',
    'إشعار تحديث البيانات',
    'Profile Update Notification',
    'إشعار تحديث البيانات الشخصية',
    'Personal information update notification',
    (SELECT id FROM email_templates WHERE name = 'profile_update_notification' LIMIT 1),
    true
),
(
    'new_message_notification',
    'إشعار رسالة جديدة',
    'New Message Notification',
    'إشعار وصول رسالة جديدة',
    'New message arrival notification',
    (SELECT id FROM email_templates WHERE name = 'new_message_notification' LIMIT 1),
    true
);

SELECT 'تم رفع القوالب المتخصصة بنجاح!' as message;





