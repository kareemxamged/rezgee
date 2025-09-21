-- قوالب الإشعارات الاجتماعية - رزقي
-- Social Email Templates - Rezge

-- إدراج القوالب الاجتماعية
INSERT INTO email_templates (name, name_ar, name_en, subject_ar, subject_en, content_ar, content_en, html_template_ar, html_template_en, is_active) VALUES

-- إشعار الإعجاب
(
    'like_notification',
    'إشعار الإعجاب',
    'Like Notification',
    '💖 شخص أعجب بك في رزقي',
    '💖 Someone Liked You on Rezge',
    'مرحباً {{userName}}، {{likerName}} من {{likerCity}} ({{likerAge}} سنة) أعجب بك! يمكنك مراجعة ملفه الشخصي والرد على إعجابه.',
    'Hello {{userName}}, {{likerName}} from {{likerCity}} ({{likerAge}} years old) liked you! You can check their profile and respond to their like.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>شخص أعجب بك</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#ec4899 0%,#be185d 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#ec4899;font-size:24px;margin:0 0 20px 0;text-align:center}.like-box{background:linear-gradient(135deg,#fdf2f8 0%,#fce7f3 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>💖 شخص أعجب بك!</h2><p>مرحباً <strong>{{userName}}</strong>،</p><div class="like-box"><h3 style="color:#be185d;margin:0 0 15px 0">🎉 {{likerName}} أعجب بك!</h3><p style="color:#831843;margin:0">من {{likerCity}}: {{likerAge}} سنة</p></div><p>يمكنك مراجعة ملفه الشخصي والرد على إعجابه لبدء رحلة التعارف الحلال.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Someone Liked You</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#ec4899 0%,#be185d 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#ec4899;font-size:24px;margin:0 0 20px 0;text-align:center}.like-box{background:linear-gradient(135deg,#fdf2f8 0%,#fce7f3 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>💖 Someone Liked You!</h2><p>Hello <strong>{{userName}}</strong>,</p><div class="like-box"><h3 style="color:#be185d;margin:0 0 15px 0">🎉 {{likerName}} liked you!</h3><p style="color:#831843;margin:0">From {{likerCity}}: {{likerAge}} years old</p></div><p>You can check their profile and respond to their like to start your halal relationship journey.</p></div></div></body></html>',
    true
),

-- إشعار زيارة الملف الشخصي
(
    'profile_view_notification',
    'إشعار زيارة الملف الشخصي',
    'Profile View Notification',
    '👁️ شخص زار ملفك الشخصي',
    '👁️ Someone Viewed Your Profile',
    'مرحباً {{userName}}، {{viewerName}} من {{viewerCity}} ({{viewerAge}} سنة) زار ملفك الشخصي. ربما يهتم بالتعرف عليك!',
    'Hello {{userName}}, {{viewerName}} from {{viewerCity}} ({{viewerAge}} years old) viewed your profile. Maybe they are interested in getting to know you!',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>شخص زار ملفك الشخصي</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#3b82f6;font-size:24px;margin:0 0 20px 0;text-align:center}.view-box{background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>👁️ شخص زار ملفك الشخصي</h2><p>مرحباً <strong>{{userName}}</strong>،</p><div class="view-box"><h3 style="color:#1d4ed8;margin:0 0 15px 0">👀 {{viewerName}} زار ملفك الشخصي</h3><p style="color:#1e40af;margin:0">من {{viewerCity}}: {{viewerAge}} سنة</p></div><p>ربما يهتم بالتعرف عليك! تأكد من إكمال ملفك الشخصي للمساعدة في جذب شريك مناسب.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Someone Viewed Your Profile</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#3b82f6;font-size:24px;margin:0 0 20px 0;text-align:center}.view-box{background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>👁️ Someone Viewed Your Profile</h2><p>Hello <strong>{{userName}}</strong>,</p><div class="view-box"><h3 style="color:#1d4ed8;margin:0 0 15px 0">👀 {{viewerName}} viewed your profile</h3><p style="color:#1e40af;margin:0">From {{viewerCity}}: {{viewerAge}} years old</p></div><p>Maybe they are interested in getting to know you! Make sure your profile is complete to help attract the right partner.</p></div></div></body></html>',
    true
),

-- إشعار رسالة جديدة
(
    'message_notification',
    'إشعار رسالة جديدة',
    'New Message Notification',
    '💬 رسالة جديدة من {{senderName}}',
    '💬 New Message from {{senderName}}',
    'مرحباً {{userName}}، {{senderName}} من {{senderCity}} ({{senderAge}} سنة) أرسل لك رسالة جديدة. يمكنك قراءة الرسالة والرد عليها.',
    'Hello {{userName}}, {{senderName}} from {{senderCity}} ({{senderAge}} years old) sent you a new message. You can read the message and reply.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>رسالة جديدة</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#10b981;font-size:24px;margin:0 0 20px 0;text-align:center}.message-box{background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>💬 رسالة جديدة</h2><p>مرحباً <strong>{{userName}}</strong>،</p><div class="message-box"><h3 style="color:#059669;margin:0 0 15px 0">📨 {{senderName}} أرسل لك رسالة</h3><p style="color:#047857;margin:0">من {{senderCity}}: {{senderAge}} سنة</p></div><p>يمكنك قراءة الرسالة والرد عليها لبدء محادثة حلال ومباركة.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>New Message</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#10b981;font-size:24px;margin:0 0 20px 0;text-align:center}.message-box{background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>💬 New Message</h2><p>Hello <strong>{{userName}}</strong>,</p><div class="message-box"><h3 style="color:#059669;margin:0 0 15px 0">📨 {{senderName}} sent you a message</h3><p style="color:#047857;margin:0">From {{senderCity}}: {{senderAge}} years old</p></div><p>You can read the message and reply to start a halal and blessed conversation.</p></div></div></body></html>',
    true
),

-- إشعار المطابقة
(
    'match_notification',
    'إشعار المطابقة',
    'Match Notification',
    '💕 مطابقة جديدة مع {{matchName}}',
    '💕 New Match with {{matchName}}',
    'مرحباً {{userName}}، تهانينا! لديك مطابقة جديدة مع {{matchName}} من {{matchCity}} ({{matchAge}} سنة). يمكنك الآن البدء في التواصل.',
    'Hello {{userName}}, Congratulations! You have a new match with {{matchName}} from {{matchCity}} ({{matchAge}} years old). You can now start communicating.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>مطابقة جديدة</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#f59e0b;font-size:24px;margin:0 0 20px 0;text-align:center}.match-box{background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>💕 مطابقة جديدة!</h2><p>مرحباً <strong>{{userName}}</strong>،</p><div class="match-box"><h3 style="color:#d97706;margin:0 0 15px 0">🎉 تهانينا! لديك مطابقة جديدة</h3><p style="color:#92400e;margin:0">مع {{matchName}} من {{matchCity}}: {{matchAge}} سنة</p></div><p>يمكنك الآن البدء في التواصل وبناء علاقة حلال ومباركة بإذن الله.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>New Match</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#f59e0b;font-size:24px;margin:0 0 20px 0;text-align:center}.match-box{background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>💕 New Match!</h2><p>Hello <strong>{{userName}}</strong>,</p><div class="match-box"><h3 style="color:#d97706;margin:0 0 15px 0">🎉 Congratulations! You have a new match</h3><p style="color:#92400e;margin:0">with {{matchName}} from {{matchCity}}: {{matchAge}} years old</p></div><p>You can now start communicating and building a halal and blessed relationship, inshaAllah.</p></div></div></body></html>',
    true
);

-- إدراج أنواع الإشعارات الاجتماعية
INSERT INTO email_notification_types (name, name_ar, name_en, description_ar, description_en, template_id, is_active) VALUES
(
    'like_notification',
    'إشعار الإعجاب',
    'Like Notification',
    'إشعار عندما يعجب بك شخص آخر',
    'Notification when someone likes you',
    (SELECT id FROM email_templates WHERE name = 'like_notification' LIMIT 1),
    true
),
(
    'profile_view_notification',
    'إشعار زيارة الملف الشخصي',
    'Profile View Notification',
    'إشعار عندما يزور شخص ملفك الشخصي',
    'Notification when someone views your profile',
    (SELECT id FROM email_templates WHERE name = 'profile_view_notification' LIMIT 1),
    true
),
(
    'message_notification',
    'إشعار رسالة جديدة',
    'Message Notification',
    'إشعار عند وصول رسالة جديدة',
    'Notification when a new message arrives',
    (SELECT id FROM email_templates WHERE name = 'message_notification' LIMIT 1),
    true
),
(
    'match_notification',
    'إشعار المطابقة',
    'Match Notification',
    'إشعار عند حدوث مطابقة جديدة',
    'Notification when a new match occurs',
    (SELECT id FROM email_templates WHERE name = 'match_notification' LIMIT 1),
    true
);

SELECT 'تم إضافة القوالب الاجتماعية بنجاح! 🎉' as message;
