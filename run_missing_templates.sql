-- تشغيل جميع القوالب المفقودة
-- هذا الملف يجمع جميع القوالب الاجتماعية والإدارية المفقودة

-- بدء المعاملة
BEGIN;

-- تشغيل القوالب الاجتماعية
\i add_missing_email_templates.sql

-- تشغيل القوالب الإدارية  
\i add_admin_email_templates.sql

-- التحقق من النتائج
SELECT 'القوالب الاجتماعية والإدارية تم إضافتها بنجاح!' as result;

-- عرض القوالب المضافة
SELECT 
    'email_templates' as table_name,
    COUNT(*) as count
FROM email_templates 
WHERE name IN (
    'like_notification', 'message_notification', 'match_notification',
    'report_received_notification', 'report_accepted_notification', 
    'report_rejected_notification', 'user_ban_notification'
);

-- عرض أنواع الإشعارات المضافة
SELECT 
    'email_notification_types' as table_name,
    COUNT(*) as count
FROM email_notification_types 
WHERE name IN (
    'like_notification', 'message_notification', 'match_notification',
    'report_received_notification', 'report_accepted_notification', 
    'report_rejected_notification', 'user_ban_notification'
);

-- عرض جميع القوالب الموجودة
SELECT 
    et.name,
    et.name_ar,
    et.name_en,
    et.is_active,
    CASE 
        WHEN ent.name IS NOT NULL THEN 'نوع إشعار موجود'
        ELSE 'قالب فقط'
    END as status
FROM email_templates et
LEFT JOIN email_notification_types ent ON et.name = ent.name
ORDER BY et.created_at DESC;

-- إنهاء المعاملة
COMMIT;
