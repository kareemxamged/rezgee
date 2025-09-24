-- إضافة أعمدة الأمان لجدول email_settings
-- Add Security Columns to email_settings Table

-- إضافة عمود secure (استخدام SSL/TLS)
ALTER TABLE email_settings 
ADD COLUMN IF NOT EXISTS secure BOOLEAN DEFAULT false;

-- إضافة عمود require_tls (طلب TLS)
ALTER TABLE email_settings 
ADD COLUMN IF NOT EXISTS require_tls BOOLEAN DEFAULT false;

-- إضافة عمود is_default (الإعدادات الافتراضية)
ALTER TABLE email_settings 
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- تحديث الإعدادات الموجودة لتكون آمنة افتراضياً
UPDATE email_settings 
SET 
    secure = CASE 
        WHEN smtp_port = 465 THEN true 
        ELSE false 
    END,
    require_tls = CASE 
        WHEN smtp_port = 587 THEN true 
        ELSE false 
    END
WHERE secure IS NULL OR require_tls IS NULL;

-- إضافة تعليقات للأعمدة الجديدة
COMMENT ON COLUMN email_settings.secure IS 'استخدام SSL/TLS للتشفير';
COMMENT ON COLUMN email_settings.require_tls IS 'طلب TLS للاتصال الآمن';
COMMENT ON COLUMN email_settings.is_default IS 'الإعدادات الافتراضية للنظام';

-- عرض النتيجة
SELECT 
    id,
    smtp_host,
    smtp_port,
    secure,
    require_tls,
    is_default,
    is_active,
    created_at
FROM email_settings 
ORDER BY created_at DESC;
