-- إصلاح سريع لجداول الإشعارات البريدية
-- Quick fix for email notifications tables

-- إضافة العمود template_id إذا لم يكن موجوداً
ALTER TABLE email_notification_types ADD COLUMN IF NOT EXISTS template_id UUID;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS template_id UUID;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS notification_type VARCHAR(100) DEFAULT 'general';
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE;

-- إنشاء الجداول المفقودة
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    subject_ar VARCHAR(500) NOT NULL,
    subject_en VARCHAR(500) NOT NULL,
    content_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    html_template_ar TEXT NOT NULL,
    html_template_en TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    smtp_host VARCHAR(255) NOT NULL,
    smtp_port INTEGER NOT NULL DEFAULT 587,
    smtp_username VARCHAR(255) NOT NULL,
    smtp_password VARCHAR(255) NOT NULL,
    from_name_ar VARCHAR(255) NOT NULL,
    from_name_en VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    reply_to VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدراج بيانات افتراضية
INSERT INTO email_templates (name, name_ar, name_en, subject_ar, subject_en, content_ar, content_en, html_template_ar, html_template_en) VALUES
(
    'welcome_email',
    'إيميل ترحيب',
    'Welcome Email',
    'مرحباً بك في رزقي',
    'Welcome to Rezge',
    'مرحباً بك في منصة رزقي للزواج الإسلامي الشرعي.',
    'Welcome to Rezge Islamic Marriage Platform.',
    '<html><body><h1>مرحباً بك في رزقي</h1></body></html>',
    '<html><body><h1>Welcome to Rezge</h1></body></html>'
) ON CONFLICT (name) DO NOTHING;

INSERT INTO email_settings (smtp_host, smtp_port, smtp_username, smtp_password, from_name_ar, from_name_en, from_email, reply_to) VALUES
(
    'smtp.hostinger.com',
    465,
    'manage@kareemamged.com',
    'Kk170404#',
    'رزقي - منصة الزواج الإسلامي الشرعي',
    'Rezge - Islamic Marriage Platform',
    'manage@kareemamged.com',
    'support@kareemamged.com'
) ON CONFLICT DO NOTHING;

-- تفعيل RLS
ALTER TABLE email_notification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- سياسات RLS
CREATE POLICY "Admin can manage email notification types" ON email_notification_types
    FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Admin can manage email templates" ON email_templates
    FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Admin can manage email settings" ON email_settings
    FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Admin can view email logs" ON email_logs
    FOR SELECT USING (auth.role() = 'admin');

CREATE POLICY "System can insert email logs" ON email_logs
    FOR INSERT WITH CHECK (true);





