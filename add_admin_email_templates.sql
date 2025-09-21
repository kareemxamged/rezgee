-- إضافة القوالب الإدارية المفقودة
-- تم إنشاؤها بناءً على ملف admin_email_templates.sql

-- إضافة قوالب الإيميلات الإدارية
INSERT INTO email_templates (
    name, name_ar, name_en, subject_ar, subject_en, 
    content_ar, content_en, html_template_ar, html_template_en, is_active
) VALUES 
-- قالب استلام البلاغ
(
    'report_received_notification',
    'إشعار استلام البلاغ',
    'Report Received Notification',
    '📋 تم استلام بلاغك - رزقي',
    '📋 Your report has been received - Rezge',
    'مرحباً {{userName}}! 📋

تم استلام بلاغك في موقع رزقي وسيتم مراجعته من قبل فريق الإدارة.

تفاصيل البلاغ:
• نوع البلاغ: {{reportType}}
• تاريخ الإرسال: {{reportDate}}
• حالة المراجعة: قيد المراجعة

سيتم التواصل معك قريباً بشأن نتيجة المراجعة.

شكراً لك على مساهمتك في الحفاظ على مجتمع رزقي آمن ونظيف! 🛡️',
    'Hello {{userName}}! 📋

Your report has been received on Rezge and will be reviewed by the management team.

Report details:
• Report type: {{reportType}}
• Submission date: {{reportDate}}
• Review status: Under review

We will contact you soon regarding the review results.

Thank you for contributing to keeping the Rezge community safe and clean! 🛡️',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>إشعار استلام البلاغ</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">📋 تم استلام بلاغك</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">رزقي - موقع الزواج الإسلامي</p></div><div style="padding: 40px 30px;"><h2 style="color: #6c5ce7; font-size: 24px; margin: 0 0 20px 0; text-align: center;">📋 تم استلام بلاغك بنجاح</h2><p>مرحباً <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #6c5ce7; margin: 0 0 15px 0">📋 تفاصيل البلاغ</h3><p style="color: #2d3436; margin: 5px 0"><strong>نوع البلاغ:</strong> {{reportType}}</p><p style="color: #2d3436; margin: 5px 0"><strong>تاريخ الإرسال:</strong> {{reportDate}}</p><p style="color: #2d3436; margin: 5px 0"><strong>الحالة:</strong> قيد المراجعة</p></div><p>شكراً لك على مساهمتك في الحفاظ على مجتمع رزقي آمن ونظيف! 🛡️</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Report Received Notification</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">📋 Report Received</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Rezge - Islamic Marriage Platform</p></div><div style="padding: 40px 30px;"><h2 style="color: #6c5ce7; font-size: 24px; margin: 0 0 20px 0; text-align: center;">📋 Your report has been received</h2><p>Hello <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #6c5ce7; margin: 0 0 15px 0">📋 Report Details</h3><p style="color: #2d3436; margin: 5px 0"><strong>Report type:</strong> {{reportType}}</p><p style="color: #2d3436; margin: 5px 0"><strong>Submission date:</strong> {{reportDate}}</p><p style="color: #2d3436; margin: 5px 0"><strong>Status:</strong> Under review</p></div><p>Thank you for contributing to keeping the Rezge community safe and clean! 🛡️</p></div></div></body></html>',
    true
),
-- قالب قبول البلاغ
(
    'report_accepted_notification',
    'إشعار قبول البلاغ',
    'Report Accepted Notification',
    '✅ تم قبول بلاغك - رزقي',
    '✅ Your report has been accepted - Rezge',
    'مرحباً {{userName}}! ✅

تم قبول بلاغك في موقع رزقي وتم اتخاذ الإجراءات المناسبة.

تفاصيل القرار:
• نوع البلاغ: {{reportType}}
• تاريخ القبول: {{acceptanceDate}}
• الإجراء المتخذ: {{actionTaken}}

نشكرك على مساهمتك في الحفاظ على مجتمع رزقي آمن ونظيف! 🛡️',
    'Hello {{userName}}! ✅

Your report on Rezge has been accepted and appropriate actions have been taken.

Decision details:
• Report type: {{reportType}}
• Acceptance date: {{acceptanceDate}}
• Action taken: {{actionTaken}}

Thank you for contributing to keeping the Rezge community safe and clean! 🛡️',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>إشعار قبول البلاغ</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">✅ تم قبول بلاغك</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">رزقي - موقع الزواج الإسلامي</p></div><div style="padding: 40px 30px;"><h2 style="color: #00b894; font-size: 24px; margin: 0 0 20px 0; text-align: center;">✅ تم قبول بلاغك بنجاح</h2><p>مرحباً <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #a8e6cf 0%, #88d8c0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #00b894; margin: 0 0 15px 0">✅ تفاصيل القرار</h3><p style="color: #2d3436; margin: 5px 0"><strong>نوع البلاغ:</strong> {{reportType}}</p><p style="color: #2d3436; margin: 5px 0"><strong>تاريخ القبول:</strong> {{acceptanceDate}}</p><p style="color: #2d3436; margin: 5px 0"><strong>الإجراء المتخذ:</strong> {{actionTaken}}</p></div><p>نشكرك على مساهمتك في الحفاظ على مجتمع رزقي آمن ونظيف! 🛡️</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Report Accepted Notification</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">✅ Report Accepted</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Rezge - Islamic Marriage Platform</p></div><div style="padding: 40px 30px;"><h2 style="color: #00b894; font-size: 24px; margin: 0 0 20px 0; text-align: center;">✅ Your report has been accepted</h2><p>Hello <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #a8e6cf 0%, #88d8c0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #00b894; margin: 0 0 15px 0">✅ Decision Details</h3><p style="color: #2d3436; margin: 5px 0"><strong>Report type:</strong> {{reportType}}</p><p style="color: #2d3436; margin: 5px 0"><strong>Acceptance date:</strong> {{acceptanceDate}}</p><p style="color: #2d3436; margin: 5px 0"><strong>Action taken:</strong> {{actionTaken}}</p></div><p>Thank you for contributing to keeping the Rezge community safe and clean! 🛡️</p></div></div></body></html>',
    true
),
-- قالب رفض البلاغ
(
    'report_rejected_notification',
    'إشعار رفض البلاغ',
    'Report Rejected Notification',
    '❌ تم رفض بلاغك - رزقي',
    '❌ Your report has been rejected - Rezge',
    'مرحباً {{userName}}! ❌

تم رفض بلاغك في موقع رزقي بعد المراجعة الدقيقة.

تفاصيل القرار:
• نوع البلاغ: {{reportType}}
• تاريخ الرفض: {{rejectionDate}}
• سبب الرفض: {{rejectionReason}}

يمكنك تقديم بلاغ جديد إذا كان لديك معلومات إضافية أو أدلة جديدة.

نشكرك على تفهمك! 🤝',
    'Hello {{userName}}! ❌

Your report on Rezge has been rejected after careful review.

Decision details:
• Report type: {{reportType}}
• Rejection date: {{rejectionDate}}
• Rejection reason: {{rejectionReason}}

You can submit a new report if you have additional information or new evidence.

Thank you for your understanding! 🤝',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>إشعار رفض البلاغ</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #e17055 0%, #d63031 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">❌ تم رفض بلاغك</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">رزقي - موقع الزواج الإسلامي</p></div><div style="padding: 40px 30px;"><h2 style="color: #e17055; font-size: 24px; margin: 0 0 20px 0; text-align: center;">❌ تم رفض بلاغك</h2><p>مرحباً <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #fab1a0 0%, #e17055 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #d63031; margin: 0 0 15px 0">❌ تفاصيل القرار</h3><p style="color: #2d3436; margin: 5px 0"><strong>نوع البلاغ:</strong> {{reportType}}</p><p style="color: #2d3436; margin: 5px 0"><strong>تاريخ الرفض:</strong> {{rejectionDate}}</p><p style="color: #2d3436; margin: 5px 0"><strong>سبب الرفض:</strong> {{rejectionReason}}</p></div><p>يمكنك تقديم بلاغ جديد إذا كان لديك معلومات إضافية أو أدلة جديدة.</p><p>نشكرك على تفهمك! 🤝</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Report Rejected Notification</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #e17055 0%, #d63031 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">❌ Report Rejected</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Rezge - Islamic Marriage Platform</p></div><div style="padding: 40px 30px;"><h2 style="color: #e17055; font-size: 24px; margin: 0 0 20px 0; text-align: center;">❌ Your report has been rejected</h2><p>Hello <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #fab1a0 0%, #e17055 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #d63031; margin: 0 0 15px 0">❌ Decision Details</h3><p style="color: #2d3436; margin: 5px 0"><strong>Report type:</strong> {{reportType}}</p><p style="color: #2d3436; margin: 5px 0"><strong>Rejection date:</strong> {{rejectionDate}}</p><p style="color: #2d3436; margin: 5px 0"><strong>Rejection reason:</strong> {{rejectionReason}}</p></div><p>You can submit a new report if you have additional information or new evidence.</p><p>Thank you for your understanding! 🤝</p></div></div></body></html>',
    true
),
-- قالب حظر المستخدم
(
    'user_ban_notification',
    'إشعار حظر المستخدم',
    'User Ban Notification',
    '🚫 تم حظر حسابك - رزقي',
    '🚫 Your account has been banned - Rezge',
    'مرحباً {{userName}}! 🚫

تم حظر حسابك في موقع رزقي بسبب مخالفة شروط الاستخدام.

تفاصيل الحظر:
• نوع المخالفة: {{violationType}}
• تاريخ الحظر: {{banDate}}
• مدة الحظر: {{banDuration}}
• سبب الحظر: {{banReason}}

يمكنك التواصل مع فريق الدعم إذا كنت تعتقد أن هذا خطأ.

نتمنى أن تلتزم بشروط الاستخدام في المستقبل! 📋',
    'Hello {{userName}}! 🚫

Your account on Rezge has been banned due to violation of terms of service.

Ban details:
• Violation type: {{violationType}}
• Ban date: {{banDate}}
• Ban duration: {{banDuration}}
• Ban reason: {{banReason}}

You can contact the support team if you believe this is an error.

We hope you will comply with the terms of service in the future! 📋',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>إشعار حظر المستخدم</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #d63031 0%, #e17055 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">🚫 تم حظر حسابك</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">رزقي - موقع الزواج الإسلامي</p></div><div style="padding: 40px 30px;"><h2 style="color: #d63031; font-size: 24px; margin: 0 0 20px 0; text-align: center;">🚫 تم حظر حسابك</h2><p>مرحباً <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #fab1a0 0%, #e17055 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #d63031; margin: 0 0 15px 0">🚫 تفاصيل الحظر</h3><p style="color: #2d3436; margin: 5px 0"><strong>نوع المخالفة:</strong> {{violationType}}</p><p style="color: #2d3436; margin: 5px 0"><strong>تاريخ الحظر:</strong> {{banDate}}</p><p style="color: #2d3436; margin: 5px 0"><strong>مدة الحظر:</strong> {{banDuration}}</p><p style="color: #2d3436; margin: 5px 0"><strong>سبب الحظر:</strong> {{banReason}}</p></div><p>يمكنك التواصل مع فريق الدعم إذا كنت تعتقد أن هذا خطأ.</p><p>نتمنى أن تلتزم بشروط الاستخدام في المستقبل! 📋</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>User Ban Notification</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #d63031 0%, #e17055 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">🚫 Account Banned</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Rezge - Islamic Marriage Platform</p></div><div style="padding: 40px 30px;"><h2 style="color: #d63031; font-size: 24px; margin: 0 0 20px 0; text-align: center;">🚫 Your account has been banned</h2><p>Hello <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #fab1a0 0%, #e17055 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #d63031; margin: 0 0 15px 0">🚫 Ban Details</h3><p style="color: #2d3436; margin: 5px 0"><strong>Violation type:</strong> {{violationType}}</p><p style="color: #2d3436; margin: 5px 0"><strong>Ban date:</strong> {{banDate}}</p><p style="color: #2d3436; margin: 5px 0"><strong>Ban duration:</strong> {{banDuration}}</p><p style="color: #2d3436; margin: 5px 0"><strong>Ban reason:</strong> {{banReason}}</p></div><p>You can contact the support team if you believe this is an error.</p><p>We hope you will comply with the terms of service in the future! 📋</p></div></div></body></html>',
    true
);

-- إضافة أنواع الإشعارات الإدارية
INSERT INTO email_notification_types (
    name, name_ar, name_en, description, description_ar, description_en, 
    template_id, is_active
) VALUES 
(
    'report_received_notification',
    'إشعار استلام البلاغ',
    'Report Received Notification',
    'Notification when a report is received',
    'إشعار عند استلام البلاغ من المستخدم',
    'Notification when a report is received',
    (SELECT id FROM email_templates WHERE name = 'report_received_notification' LIMIT 1),
    true
),
(
    'report_accepted_notification',
    'إشعار قبول البلاغ',
    'Report Accepted Notification',
    'Notification when a report is accepted',
    'إشعار عند قبول البلاغ من الإدارة',
    'Notification when a report is accepted',
    (SELECT id FROM email_templates WHERE name = 'report_accepted_notification' LIMIT 1),
    true
),
(
    'report_rejected_notification',
    'إشعار رفض البلاغ',
    'Report Rejected Notification',
    'Notification when a report is rejected',
    'إشعار عند رفض البلاغ من الإدارة',
    'Notification when a report is rejected',
    (SELECT id FROM email_templates WHERE name = 'report_rejected_notification' LIMIT 1),
    true
),
(
    'user_ban_notification',
    'إشعار حظر المستخدم',
    'User Ban Notification',
    'Notification when a user is banned',
    'إشعار عند حظر المستخدم من الإدارة',
    'Notification when a user is banned',
    (SELECT id FROM email_templates WHERE name = 'user_ban_notification' LIMIT 1),
    true
);
