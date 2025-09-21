-- إنشاء جدول تتبع الإشعارات البريدية - نسخة مبسطة جداً
-- Create notification email tracking table - very simple version

-- إنشاء الجدول
CREATE TABLE IF NOT EXISTS public.notification_email_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    notification_id UUID NOT NULL,
    email_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    email_sent_at TIMESTAMP WITH TIME ZONE,
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(notification_id)
);

-- إنشاء الفهارس
CREATE INDEX IF NOT EXISTS idx_notification_email_tracking_status 
    ON public.notification_email_tracking(email_status);

CREATE INDEX IF NOT EXISTS idx_notification_email_tracking_created_at 
    ON public.notification_email_tracking(created_at);

CREATE INDEX IF NOT EXISTS idx_notification_email_tracking_notification_id 
    ON public.notification_email_tracking(notification_id);


