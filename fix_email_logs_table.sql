-- إصلاح جدول email_logs
-- Fix email_logs table

-- إضافة عمود template_name إذا لم يكن موجوداً
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS template_name VARCHAR(255);

-- إضافة عمود template_id إذا لم يكن موجوداً
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES email_templates(id);

-- إضافة عمود recipient_email إذا لم يكن موجوداً
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS recipient_email VARCHAR(255);

-- إضافة عمود subject إذا لم يكن موجوداً
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS subject TEXT;

-- إضافة عمود status إذا لم يكن موجوداً
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- إضافة عمود error_message إذا لم يكن موجوداً
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- إضافة عمود sent_at إذا لم يكن موجوداً
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE;

-- إضافة عمود created_at إذا لم يكن موجوداً
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- إضافة عمود updated_at إذا لم يكن موجوداً
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_email_logs_template_name ON email_logs(template_name);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at);

-- عرض هيكل الجدول
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'email_logs' 
ORDER BY ordinal_position;

-- عرض رسالة النجاح
SELECT 'تم إصلاح جدول email_logs بنجاح! 🎉' as message;
