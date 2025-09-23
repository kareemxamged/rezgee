-- إضافة أعمدة إعدادات SMTP إلى جدول email_templates
-- تاريخ الإنشاء: 9 يناير 2025

-- إضافة الأعمدة المطلوبة إلى جدول email_templates
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS smtp_settings_id UUID;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS contact_smtp_send_id UUID;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS contact_smtp_receive_id UUID;

-- إضافة فهارس للأعمدة الجديدة لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_email_templates_smtp_settings_id ON email_templates(smtp_settings_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_contact_smtp_send_id ON email_templates(contact_smtp_send_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_contact_smtp_receive_id ON email_templates(contact_smtp_receive_id);

-- إضافة قيود المفاتيح الخارجية (اختياري - يمكن إزالتها إذا لم تكن مطلوبة)
-- ALTER TABLE email_templates ADD CONSTRAINT fk_email_templates_smtp_settings 
--     FOREIGN KEY (smtp_settings_id) REFERENCES email_settings(id) ON DELETE SET NULL;

-- ALTER TABLE email_templates ADD CONSTRAINT fk_email_templates_contact_smtp_send 
--     FOREIGN KEY (contact_smtp_send_id) REFERENCES email_settings(id) ON DELETE SET NULL;

-- ALTER TABLE email_templates ADD CONSTRAINT fk_email_templates_contact_smtp_receive 
--     FOREIGN KEY (contact_smtp_receive_id) REFERENCES email_settings(id) ON DELETE SET NULL;

-- عرض النتيجة
SELECT 
    'تم إضافة أعمدة إعدادات SMTP إلى جدول email_templates بنجاح' as message,
    COUNT(*) as total_templates,
    COUNT(CASE WHEN smtp_settings_id IS NOT NULL THEN 1 END) as templates_with_smtp,
    COUNT(CASE WHEN contact_smtp_send_id IS NOT NULL THEN 1 END) as templates_with_contact_send,
    COUNT(CASE WHEN contact_smtp_receive_id IS NOT NULL THEN 1 END) as templates_with_contact_receive
FROM email_templates;

-- عرض هيكل الجدول المحدث
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'email_templates' 
ORDER BY ordinal_position;






