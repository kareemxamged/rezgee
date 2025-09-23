-- تحديث شامل لجداول الإشعارات البريدية
-- تاريخ الإنشاء: 9 يناير 2025

-- ========================================
-- 1. إضافة حقل is_default إلى جدول email_settings
-- ========================================

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

-- ========================================
-- 2. إضافة أعمدة إعدادات SMTP إلى جدول email_templates
-- ========================================

-- إضافة الأعمدة المطلوبة إلى جدول email_templates
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS smtp_settings_id UUID;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS contact_smtp_send_id UUID;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS contact_smtp_receive_id UUID;

-- إضافة فهارس للأعمدة الجديدة لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_email_templates_smtp_settings_id ON email_templates(smtp_settings_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_contact_smtp_send_id ON email_templates(contact_smtp_send_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_contact_smtp_receive_id ON email_templates(contact_smtp_receive_id);

-- ========================================
-- 3. إضافة أعمدة مفقودة أخرى إذا لزم الأمر
-- ========================================

-- إضافة أعمدة مفقودة أخرى (إذا لم تكن موجودة)
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS secure BOOLEAN DEFAULT false;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS require_tls BOOLEAN DEFAULT false;

-- ========================================
-- 4. تحديث البيانات الموجودة
-- ========================================

-- تحديث القوالب الموجودة لتحديد إعدادات SMTP افتراضية
UPDATE email_templates 
SET smtp_settings_id = (
    SELECT id 
    FROM email_settings 
    WHERE is_default = true 
    LIMIT 1
)
WHERE smtp_settings_id IS NULL;

-- ========================================
-- 5. عرض النتائج
-- ========================================

-- عرض إحصائيات email_settings
SELECT 
    'إحصائيات email_settings' as table_name,
    COUNT(*) as total_settings,
    COUNT(CASE WHEN is_default = true THEN 1 END) as default_settings,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_settings
FROM email_settings;

-- عرض إحصائيات email_templates
SELECT 
    'إحصائيات email_templates' as table_name,
    COUNT(*) as total_templates,
    COUNT(CASE WHEN smtp_settings_id IS NOT NULL THEN 1 END) as templates_with_smtp,
    COUNT(CASE WHEN contact_smtp_send_id IS NOT NULL THEN 1 END) as templates_with_contact_send,
    COUNT(CASE WHEN contact_smtp_receive_id IS NOT NULL THEN 1 END) as templates_with_contact_receive,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_templates
FROM email_templates;

-- عرض هيكل جدول email_settings المحدث
SELECT 
    'هيكل جدول email_settings' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'email_settings' 
ORDER BY ordinal_position;

-- عرض هيكل جدول email_templates المحدث
SELECT 
    'هيكل جدول email_templates' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'email_templates' 
ORDER BY ordinal_position;

-- رسالة النجاح
SELECT 'تم تحديث جداول الإشعارات البريدية بنجاح! جميع الأعمدة المطلوبة تم إضافتها.' as final_message;






