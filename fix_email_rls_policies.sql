-- إصلاح سياسات RLS لجداول الإشعارات البريدية
-- Fix RLS policies for email notification tables

-- حذف السياسات الموجودة
DROP POLICY IF EXISTS "Admin can manage email notification types" ON email_notification_types;
DROP POLICY IF EXISTS "Admin can manage email templates" ON email_templates;
DROP POLICY IF EXISTS "Admin can manage email settings" ON email_settings;
DROP POLICY IF EXISTS "Admin can view email logs" ON email_logs;
DROP POLICY IF EXISTS "System can insert email logs" ON email_logs;

-- إنشاء سياسات جديدة أكثر مرونة
-- سياسات للقراءة (SELECT) - السماح للجميع بالقراءة
CREATE POLICY "Allow read access to email notification types" ON email_notification_types
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to email templates" ON email_templates
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to email settings" ON email_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to email logs" ON email_logs
    FOR SELECT USING (true);

-- سياسات للكتابة (INSERT, UPDATE, DELETE) - السماح للجميع بالكتابة
CREATE POLICY "Allow insert access to email notification types" ON email_notification_types
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to email notification types" ON email_notification_types
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to email notification types" ON email_notification_types
    FOR DELETE USING (true);

CREATE POLICY "Allow insert access to email templates" ON email_templates
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to email templates" ON email_templates
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to email templates" ON email_templates
    FOR DELETE USING (true);

CREATE POLICY "Allow insert access to email settings" ON email_settings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to email settings" ON email_settings
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to email settings" ON email_settings
    FOR DELETE USING (true);

CREATE POLICY "Allow insert access to email logs" ON email_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to email logs" ON email_logs
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to email logs" ON email_logs
    FOR DELETE USING (true);

-- رسالة نجاح
SELECT 'تم إصلاح سياسات RLS لجداول الإشعارات البريدية بنجاح!' as message;





