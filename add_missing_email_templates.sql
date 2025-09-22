-- إضافة القوالب الاجتماعية والإدارية المفقودة
-- تم إنشاؤها بناءً على ملفات social_email_templates.sql و admin_email_templates.sql

-- إضافة قوالب الإيميلات الاجتماعية
INSERT INTO email_templates (
    name, name_ar, name_en, subject_ar, subject_en, 
    content_ar, content_en, html_template_ar, html_template_en, is_active
) VALUES 
-- قالب الإعجاب
(
    'like_notification',
    'إشعار الإعجاب',
    'Like Notification',
    '💖 شخص أعجب بك في رزقي',
    '💖 Someone liked you on Rezge',
    'مرحباً {{userName}}! 🎉

شخص ما أعجب بملفك الشخصي في موقع رزقي. هذا يعني أن شخصاً مهتماً بالتعرف عليك!

يمكنك الآن:
• مراجعة الملف الشخصي لمن أعجب بك
• إرسال رسالة للتواصل
• البدء بخطة التعارف الشرعية

نتمنى لك رحلة مميزة في رزقي! 💕',
    'Hello {{userName}}! 🎉

Someone liked your profile on Rezge. This means someone is interested in getting to know you!

You can now:
• Review the profile of who liked you
• Send a message to start communication
• Begin halal courtship

We wish you an amazing journey on Rezge! 💕',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>إشعار الإعجاب</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">💖 إشعار الإعجاب</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">رزقي - موقع الزواج الإسلامي</p></div><div style="padding: 40px 30px;"><h2 style="color: #ff6b6b; font-size: 24px; margin: 0 0 20px 0; text-align: center;">🎉 شخص أعجب بك!</h2><p>مرحباً <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #e17055; margin: 0 0 15px 0">💖 شخص أعجب بك في رزقي!</h3><p style="color: #2d3436; margin: 5px 0"><strong>هذا يعني أن شخصاً مهتماً بالتعرف عليك!</strong></p></div><p>يمكنك الآن:</p><ul style="text-align: right; color: #2d3436;"><li>مراجعة الملف الشخصي لمن أعجب بك</li><li>إرسال رسالة للتواصل</li><li>البدء بخطة التعارف الشرعية</li></ul><p>نتمنى لك رحلة مميزة في رزقي! 💕</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Like Notification</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">💖 Like Notification</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Rezge - Islamic Marriage Platform</p></div><div style="padding: 40px 30px;"><h2 style="color: #ff6b6b; font-size: 24px; margin: 0 0 20px 0; text-align: center;">🎉 Someone liked you!</h2><p>Hello <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #e17055; margin: 0 0 15px 0">💖 Someone liked you on Rezge!</h3><p style="color: #2d3436; margin: 5px 0"><strong>This means someone is interested in getting to know you!</strong></p></div><p>You can now:</p><ul style="text-align: left; color: #2d3436;"><li>Review the profile of who liked you</li><li>Send a message to start communication</li><li>Begin halal courtship</li></ul><p>We wish you an amazing journey on Rezge! 💕</p></div></div></body></html>',
    true
),
-- قالب الرسائل الجديدة
(
    'message_notification',
    'إشعار رسالة جديدة',
    'New Message Notification',
    '💬 رسالة جديدة من {{senderName}}',
    '💬 New message from {{senderName}}',
    'مرحباً {{userName}}! 💌

لديك رسالة جديدة من {{senderName}} في موقع رزقي.

الرسالة تحتوي على:
• محتوى مهم جداً
• فرصة للتعارف الشرعي
• بداية علاقة طاهرة

سارع بالرد وابدأ الحوار المناسب! 🌹',
    'Hello {{userName}}! 💌

You have a new message from {{senderName}} on Rezge.

The message contains:
• Very important content
• Opportunity for halal courtship
• Beginning of a pure relationship

Hurry to reply and start the appropriate conversation! 🌹',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>إشعار رسالة جديدة</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">💬 رسالة جديدة</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">رزقي - موقع الزواج الإسلامي</p></div><div style="padding: 40px 30px;"><h2 style="color: #00b894; font-size: 24px; margin: 0 0 20px 0; text-align: center;">💌 لديك رسالة جديدة!</h2><p>مرحباً <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #a8e6cf 0%, #88d8c0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #00b894; margin: 0 0 15px 0">💬 رسالة من {{senderName}}</h3><p style="color: #2d3436; margin: 5px 0"><strong>رسالة مهمة تنتظر ردك!</strong></p></div><p>سارع بالرد وابدأ الحوار المناسب! 🌹</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>New Message Notification</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">💬 New Message</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Rezge - Islamic Marriage Platform</p></div><div style="padding: 40px 30px;"><h2 style="color: #00b894; font-size: 24px; margin: 0 0 20px 0; text-align: center;">💌 You have a new message!</h2><p>Hello <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #a8e6cf 0%, #88d8c0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #00b894; margin: 0 0 15px 0">💬 Message from {{senderName}}</h3><p style="color: #2d3436; margin: 5px 0"><strong>Important message awaiting your reply!</strong></p></div><p>Hurry to reply and start the appropriate conversation! 🌹</p></div></div></body></html>',
    true
),
-- قالب المطابقات
(
    'match_notification',
    'إشعار المطابقة',
    'Match Notification',
    '💕 مطابقة جديدة مع {{matchName}}',
    '💕 New match with {{matchName}}',
    'مبروك {{userName}}! 🎊

لديك مطابقة جديدة مع {{matchName}} في موقع رزقي!

هذه فرصة رائعة لـ:
• التعارف الشرعي الطاهر
• بناء علاقة مقترنة بالبركة
• تحقيق الزواج المبارك

ابدأوا التواصل ببركة الله! 🌹',
    'Congratulations {{userName}}! 🎊

You have a new match with {{matchName}} on Rezge!

This is a great opportunity for:
• Halal and pure courtship
• Building a blessed relationship
• Achieving blessed marriage

Start communicating with Allah\'s blessing! 🌹',
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>إشعار المطابقة</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">💕 مطابـقة جديدة</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">رزقي - موقع الزواج الإسلامي</p></div><div style="padding: 40px 30px;"><h2 style="color: #e84393; font-size: 24px; margin: 0 0 20px 0; text-align: center;">🎊 مبروك! لديك مطابقة جديدة</h2><p>مرحباً <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #d63031; margin: 0 0 15px 0">💕 مطابقة مع {{matchName}}</h3><p style="color: #2d3436; margin: 5px 0"><strong>فرصة رائعة للتعارف الشرعي!</strong></p></div><p>ابدأوا التواصل ببركة الله! 🌹</p></div></div></body></html>',
    '<!DOCTYPE html><html dir="ltr" lang="en"><head><meta charset="UTF-8"><title>Match Notification</title></head><body style="font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;"><div style="background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%); padding: 40px 30px; text-align: center;"><h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">💕 New Match</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Rezge - Islamic Marriage Platform</p></div><div style="padding: 40px 30px;"><h2 style="color: #e84393; font-size: 24px; margin: 0 0 20px 0; text-align: center;">🎊 Congratulations! You have a new match</h2><p>Hello <strong>{{userName}}</strong>,</p><div style="background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;"><h3 style="color: #d63031; margin: 0 0 15px 0">💕 Match with {{matchName}}</h3><p style="color: #2d3436; margin: 5px 0"><strong>Great opportunity for halal courtship!</strong></p></div><p>Start communicating with Allah\'s blessing! 🌹</p></div></div></body></html>',
    true
);

-- إضافة أنواع الإشعارات الاجتماعية
INSERT INTO email_notification_types (
    name, name_ar, name_en, description, description_ar, description_en, 
    template_id, is_active
) VALUES 
(
    'like_notification',
    'إشعار الإعجاب',
    'Like Notification',
    'Notification when someone likes your profile',
    'إشعار عندما يعجب بك شخص آخر',
    'Notification when someone likes your profile',
    (SELECT id FROM email_templates WHERE name = 'like_notification' LIMIT 1),
    true
),
(
    'message_notification',
    'إشعار رسالة جديدة',
    'Message Notification',
    'Notification when a new message arrives',
    'إشعار عند وصول رسالة جديدة',
    'Notification when a new message arrives',
    (SELECT id FROM email_templates WHERE name = 'message_notification' LIMIT 1),
    true
),
(
    'match_notification',
    'إشعار المطابقة',
    'Match Notification',
    'Notification when a new match occurs',
    'إشعار عند حدوث مطابقة جديدة',
    'Notification when a new match occurs',
    (SELECT id FROM email_templates WHERE name = 'match_notification' LIMIT 1),
    true
);





