-- قوالب الإشعارات الإدارية - رزقي
-- Admin Email Templates - Rezge

-- إدراج القوالب الإدارية
INSERT INTO email_templates (name, name_ar, name_en, subject_ar, subject_en, content_ar, content_en, html_template_ar, html_template_en, is_active) VALUES

-- إشعار استلام البلاغ
(
    'report_received_notification',
    'إشعار استلام البلاغ',
    'Report Received Notification',
    '📋 تم استلام بلاغك - رزقي',
    '📋 Your Report Has Been Received - Rezge',
    'مرحباً {{reporterName}}، تم استلام بلاغك ضد {{reportedName}}. نحن نراجع البلاغ وسنخبرك بالنتيجة قريباً.',
    'Hello {{reporterName}}, We have received your report against {{reportedName}}. We are reviewing the report and will inform you of the result soon.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تم استلام بلاغك</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#3b82f6;font-size:24px;margin:0 0 20px 0;text-align:center}.report-box{background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>📋 تم استلام بلاغك</h2><p>مرحباً <strong>{{reporterName}}</strong>،</p><div class="report-box"><h3 style="color:#1d4ed8;margin:0 0 15px 0">✅ تم استلام بلاغك بنجاح</h3><p style="color:#1e40af;margin:0">ضد {{reportedName}}</p></div><p>نحن نراجع البلاغ بعناية وسنخبرك بالنتيجة في أقرب وقت ممكن. نشكرك على مساعدتنا في الحفاظ على سلامة المجتمع.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Your Report Has Been Received</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#3b82f6;font-size:24px;margin:0 0 20px 0;text-align:center}.report-box{background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>📋 Your Report Has Been Received</h2><p>Hello <strong>{{reporterName}}</strong>,</p><div class="report-box"><h3 style="color:#1d4ed8;margin:0 0 15px 0">✅ Your report has been successfully received</h3><p style="color:#1e40af;margin:0">against {{reportedName}}</p></div><p>We are carefully reviewing the report and will inform you of the result as soon as possible. Thank you for helping us maintain community safety.</p></div></div></body></html>',
    true
),

-- إشعار قبول البلاغ
(
    'report_accepted_notification',
    'إشعار قبول البلاغ',
    'Report Accepted Notification',
    '✅ تم قبول بلاغك - رزقي',
    '✅ Your Report Has Been Accepted - Rezge',
    'مرحباً {{reporterName}}، تم قبول بلاغك ضد {{reportedName}}. سنتخذ الإجراء المناسب ضد المستخدم المبلغ عنه.',
    'Hello {{reporterName}}, Your report against {{reportedName}} has been accepted. We will take appropriate action against the reported user.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تم قبول بلاغك</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#10b981;font-size:24px;margin:0 0 20px 0;text-align:center}.accepted-box{background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>✅ تم قبول بلاغك</h2><p>مرحباً <strong>{{reporterName}}</strong>،</p><div class="accepted-box"><h3 style="color:#059669;margin:0 0 15px 0">🎉 تم قبول بلاغك بنجاح</h3><p style="color:#047857;margin:0">ضد {{reportedName}}</p></div><p>سنقوم باتخاذ الإجراء المناسب ضد المستخدم المبلغ عنه. نشكرك على مساعدتنا في الحفاظ على سلامة المجتمع.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Your Report Has Been Accepted</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#10b981;font-size:24px;margin:0 0 20px 0;text-align:center}.accepted-box{background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>✅ Your Report Has Been Accepted</h2><p>Hello <strong>{{reporterName}}</strong>,</p><div class="accepted-box"><h3 style="color:#059669;margin:0 0 15px 0">🎉 Your report has been successfully accepted</h3><p style="color:#047857;margin:0">against {{reportedName}}</p></div><p>We will take appropriate action against the reported user. Thank you for helping us maintain community safety.</p></div></div></body></html>',
    true
),

-- إشعار رفض البلاغ
(
    'report_rejected_notification',
    'إشعار رفض البلاغ',
    'Report Rejected Notification',
    '❌ تم رفض بلاغك - رزقي',
    '❌ Your Report Has Been Rejected - Rezge',
    'مرحباً {{reporterName}}، تم رفض بلاغك ضد {{reportedName}}. السبب: {{reason}}. إذا كان لديك معلومات إضافية، يمكنك تقديم بلاغ جديد.',
    'Hello {{reporterName}}, Your report against {{reportedName}} has been rejected. Reason: {{reason}}. If you have additional information, you can submit a new report.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تم رفض بلاغك</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#f59e0b;font-size:24px;margin:0 0 20px 0;text-align:center}.rejected-box{background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>❌ تم رفض بلاغك</h2><p>مرحباً <strong>{{reporterName}}</strong>،</p><div class="rejected-box"><h3 style="color:#d97706;margin:0 0 15px 0">⚠️ تم رفض بلاغك</h3><p style="color:#92400e;margin:0">ضد {{reportedName}}</p><p style="color:#92400e;margin:10px 0 0 0"><strong>السبب:</strong> {{reason}}</p></div><p>إذا كان لديك معلومات إضافية أو أدلة جديدة، يمكنك تقديم بلاغ جديد. نشكرك على اهتمامك بسلامة المجتمع.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Your Report Has Been Rejected</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#f59e0b;font-size:24px;margin:0 0 20px 0;text-align:center}.rejected-box{background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>❌ Your Report Has Been Rejected</h2><p>Hello <strong>{{reporterName}}</strong>,</p><div class="rejected-box"><h3 style="color:#d97706;margin:0 0 15px 0">⚠️ Your report has been rejected</h3><p style="color:#92400e;margin:0">against {{reportedName}}</p><p style="color:#92400e;margin:10px 0 0 0"><strong>Reason:</strong> {{reason}}</p></div><p>If you have additional information or new evidence, you can submit a new report. Thank you for your concern about community safety.</p></div></div></body></html>',
    true
),

-- إشعار قبول التوثيق
(
    'verification_approved_notification',
    'إشعار قبول التوثيق',
    'Verification Approved Notification',
    '✅ تم قبول طلب التوثيق - رزقي',
    '✅ Verification Request Approved - Rezge',
    'مرحباً {{userName}}، تم قبول طلب توثيق حسابك بنجاح! يمكنك الآن الاستمتاع بجميع ميزات المنصة.',
    'Hello {{userName}}, Your account verification request has been approved! You can now enjoy all platform features.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تم قبول طلب التوثيق</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#10b981;font-size:24px;margin:0 0 20px 0;text-align:center}.approved-box{background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>✅ تم قبول طلب التوثيق</h2><p>مرحباً <strong>{{userName}}</strong>،</p><div class="approved-box"><h3 style="color:#059669;margin:0 0 15px 0">🎉 تهانينا! تم قبول طلب التوثيق</h3><p style="color:#047857;margin:0">حسابك موثق الآن</p></div><p>يمكنك الآن الاستمتاع بجميع ميزات المنصة والبدء في رحلتك للعثور على شريك الحياة المناسب.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Verification Request Approved</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#10b981;font-size:24px;margin:0 0 20px 0;text-align:center}.approved-box{background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>✅ Verification Request Approved</h2><p>Hello <strong>{{userName}}</strong>,</p><div class="approved-box"><h3 style="color:#059669;margin:0 0 15px 0">🎉 Congratulations! Verification request approved</h3><p style="color:#047857;margin:0">Your account is now verified</p></div><p>You can now enjoy all platform features and start your journey to find the right life partner.</p></div></div></body></html>',
    true
),

-- إشعار رفض التوثيق
(
    'verification_rejected_notification',
    'إشعار رفض التوثيق',
    'Verification Rejected Notification',
    '❌ تم رفض طلب التوثيق - رزقي',
    '❌ Verification Request Rejected - Rezge',
    'مرحباً {{userName}}، تم رفض طلب توثيق حسابك. السبب: {{reason}}. يمكنك تقديم طلب جديد بعد تصحيح المشاكل.',
    'Hello {{userName}}, Your account verification request has been rejected. Reason: {{reason}}. You can submit a new request after fixing the issues.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تم رفض طلب التوثيق</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#f59e0b;font-size:24px;margin:0 0 20px 0;text-align:center}.rejected-box{background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>❌ تم رفض طلب التوثيق</h2><p>مرحباً <strong>{{userName}}</strong>،</p><div class="rejected-box"><h3 style="color:#d97706;margin:0 0 15px 0">⚠️ تم رفض طلب التوثيق</h3><p style="color:#92400e;margin:10px 0 0 0"><strong>السبب:</strong> {{reason}}</p></div><p>يمكنك تقديم طلب توثيق جديد بعد تصحيح المشاكل المذكورة. نحن هنا لمساعدتك في إكمال عملية التوثيق.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Verification Request Rejected</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#f59e0b;font-size:24px;margin:0 0 20px 0;text-align:center}.rejected-box{background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>❌ Verification Request Rejected</h2><p>Hello <strong>{{userName}}</strong>,</p><div class="rejected-box"><h3 style="color:#d97706;margin:0 0 15px 0">⚠️ Verification request rejected</h3><p style="color:#92400e;margin:10px 0 0 0"><strong>Reason:</strong> {{reason}}</p></div><p>You can submit a new verification request after fixing the mentioned issues. We are here to help you complete the verification process.</p></div></div></body></html>',
    true
),

-- إشعار حظر المستخدم
(
    'user_ban_notification',
    'إشعار حظر المستخدم',
    'User Ban Notification',
    '🚫 تم حظر حسابك - رزقي',
    '🚫 Your Account Has Been Banned - Rezge',
    'مرحباً {{userName}}، تم حظر حسابك بسبب: {{reason}}. مدة الحظر: {{duration}}. يمكنك التواصل معنا للاستئناف.',
    'Hello {{userName}}, Your account has been banned due to: {{reason}}. Ban duration: {{duration}}. You can contact us to appeal.',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>تم حظر حسابك</title><style>body{font-family:"Amiri",serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#dc2626;font-size:24px;margin:0 0 20px 0;text-align:center}.ban-box{background:linear-gradient(135deg,#fef2f2 0%,#fecaca 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">رزقي</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">موقع الزواج الإسلامي الشرعي</p></div><div class="content"><h2>🚫 تم حظر حسابك</h2><p>مرحباً <strong>{{userName}}</strong>،</p><div class="ban-box"><h3 style="color:#b91c1c;margin:0 0 15px 0">⚠️ تم حظر حسابك</h3><p style="color:#991b1b;margin:0"><strong>السبب:</strong> {{reason}}</p><p style="color:#991b1b;margin:10px 0 0 0"><strong>مدة الحظر:</strong> {{duration}}</p></div><p>يمكنك التواصل معنا للاستئناف أو إذا كان لديك أي استفسارات حول هذا القرار.</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Your Account Has Been Banned</title><style>body{font-family:"Inter",sans-serif;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden}.header{background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:40px 30px;text-align:center}.logo{color:white;font-size:32px;margin:0;font-weight:bold}.content{padding:40px 30px}.content h2{color:#dc2626;font-size:24px;margin:0 0 20px 0;text-align:center}.ban-box{background:linear-gradient(135deg,#fef2f2 0%,#fecaca 100%);border-radius:12px;padding:25px;margin:25px 0;text-align:center}</style></head><body><div class="container"><div class="header"><h1 class="logo">Rezge</h1><p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px">Islamic Marriage Platform</p></div><div class="content"><h2>🚫 Your Account Has Been Banned</h2><p>Hello <strong>{{userName}}</strong>,</p><div class="ban-box"><h3 style="color:#b91c1c;margin:0 0 15px 0">⚠️ Your account has been banned</h3><p style="color:#991b1b;margin:0"><strong>Reason:</strong> {{reason}}</p><p style="color:#991b1b;margin:10px 0 0 0"><strong>Ban duration:</strong> {{duration}}</p></div><p>You can contact us to appeal or if you have any questions about this decision.</p></div></div></body></html>',
    true
);

-- إدراج أنواع الإشعارات الإدارية
INSERT INTO email_notification_types (name, name_ar, name_en, description_ar, description_en, template_id, is_active) VALUES
(
    'report_received_notification',
    'إشعار استلام البلاغ',
    'Report Received Notification',
    'إشعار عند استلام البلاغ من المستخدم',
    'Notification when a report is received from user',
    (SELECT id FROM email_templates WHERE name = 'report_received_notification' LIMIT 1),
    true
),
(
    'report_accepted_notification',
    'إشعار قبول البلاغ',
    'Report Accepted Notification',
    'إشعار عند قبول البلاغ من الإدارة',
    'Notification when a report is accepted by admin',
    (SELECT id FROM email_templates WHERE name = 'report_accepted_notification' LIMIT 1),
    true
),
(
    'report_rejected_notification',
    'إشعار رفض البلاغ',
    'Report Rejected Notification',
    'إشعار عند رفض البلاغ من الإدارة',
    'Notification when a report is rejected by admin',
    (SELECT id FROM email_templates WHERE name = 'report_rejected_notification' LIMIT 1),
    true
),
(
    'verification_approved_notification',
    'إشعار قبول التوثيق',
    'Verification Approved Notification',
    'إشعار عند قبول طلب توثيق الحساب',
    'Notification when account verification is approved',
    (SELECT id FROM email_templates WHERE name = 'verification_approved_notification' LIMIT 1),
    true
),
(
    'verification_rejected_notification',
    'إشعار رفض التوثيق',
    'Verification Rejected Notification',
    'إشعار عند رفض طلب توثيق الحساب',
    'Notification when account verification is rejected',
    (SELECT id FROM email_templates WHERE name = 'verification_rejected_notification' LIMIT 1),
    true
),
(
    'user_ban_notification',
    'إشعار حظر المستخدم',
    'User Ban Notification',
    'إشعار عند حظر المستخدم من الإدارة',
    'Notification when user is banned by admin',
    (SELECT id FROM email_templates WHERE name = 'user_ban_notification' LIMIT 1),
    true
);

SELECT 'تم إضافة القوالب الإدارية بنجاح! 🎉' as message;





