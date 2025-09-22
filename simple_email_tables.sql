-- إنشاء جداول الإشعارات البريدية - نسخة مبسطة
-- Simple Email Notifications Tables

-- حذف الجداول إذا كانت موجودة (احتياطي)
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS email_notification_types CASCADE;
DROP TABLE IF EXISTS email_templates CASCADE;
DROP TABLE IF EXISTS email_settings CASCADE;

-- جدول قوالب الإيميلات
CREATE TABLE email_templates (
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

-- جدول إعدادات الإيميلات
CREATE TABLE email_settings (
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

-- جدول أنواع الإشعارات البريدية
CREATE TABLE email_notification_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description TEXT,
    description_ar TEXT,
    description_en TEXT,
    is_active BOOLEAN DEFAULT true,
    template_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول سجلات الإيميلات
CREATE TABLE email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    template_id UUID,
    notification_type VARCHAR(100) NOT NULL DEFAULT 'general',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
),
(
    'verification_email',
    'إيميل التحقق',
    'Verification Email',
    'كود التحقق من رزقي',
    'Verification Code from Rezge',
    'كود التحقق الخاص بك هو: {{code}}',
    'Your verification code is: {{code}}',
    '<html><body><h1>كود التحقق</h1><p>كود التحقق الخاص بك هو: {{code}}</p></body></html>',
    '<html><body><h1>Verification Code</h1><p>Your verification code is: {{code}}</p></body></html>'
);

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
);

INSERT INTO email_notification_types (name, name_ar, name_en, description, description_ar, description_en, template_id) VALUES
(
    'welcome',
    'ترحيب',
    'Welcome',
    'Welcome email for new users',
    'إيميل ترحيب للمستخدمين الجدد',
    'إيميل ترحيب للمستخدمين الجدد',
    (SELECT id FROM email_templates WHERE name = 'welcome_email' LIMIT 1)
),
(
    'verification',
    'تحقق',
    'Verification',
    'Verification email for 2FA',
    'إيميل التحقق للمصادقة الثنائية',
    'إيميل التحقق للمصادقة الثنائية',
    (SELECT id FROM email_templates WHERE name = 'verification_email' LIMIT 1)
);

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

SELECT 'تم إنشاء جداول الإشعارات البريدية بنجاح!' as message;





