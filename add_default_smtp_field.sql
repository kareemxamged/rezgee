-- إضافة حقل is_default إلى جدول email_settings
-- تاريخ الإنشاء: 9 يناير 2025

-- إضافة حقل is_default
ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- إنشاء فهرس فريد لضمان وجود إعداد افتراضي واحد فقط
CREATE UNIQUE INDEX IF NOT EXISTS email_settings_default_unique 
ON email_settings (is_default) 
WHERE is_default = true;

-- تعيين أول إعداد نشط كافتراضي إذا لم يكن هناك إعداد افتراضي
UPDATE email_settings 
SET is_default = true 
WHERE id = (
    SELECT id 
    FROM email_settings 
    WHERE is_active = true 
    ORDER BY created_at ASC 
    LIMIT 1
) 
AND NOT EXISTS (
    SELECT 1 
    FROM email_settings 
    WHERE is_default = true
);

-- عرض النتيجة
SELECT 
    'تم إضافة حقل is_default بنجاح' as message,
    COUNT(*) as total_settings,
    COUNT(CASE WHEN is_default = true THEN 1 END) as default_settings,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_settings
FROM email_settings;






