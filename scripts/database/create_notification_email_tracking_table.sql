-- إنشاء جدول تتبع الإشعارات البريدية
-- Create notification email tracking table
-- رزقي - منصة الزواج الإسلامي الشرعي

CREATE OR REPLACE FUNCTION create_notification_email_tracking_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- إنشاء جدول تتبع الإشعارات البريدية إذا لم يكن موجوداً
    CREATE TABLE IF NOT EXISTS public.notification_email_tracking (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
        email_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'failed', 'retry')),
        email_sent_at TIMESTAMP WITH TIME ZONE,
        retry_count INTEGER DEFAULT 0,
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- فهرس فريد لكل إشعار
        UNIQUE(notification_id)
    );

    -- إنشاء فهارس لتحسين الأداء
    CREATE INDEX IF NOT EXISTS idx_notification_email_tracking_status 
        ON public.notification_email_tracking(email_status);
    
    CREATE INDEX IF NOT EXISTS idx_notification_email_tracking_created_at 
        ON public.notification_email_tracking(created_at);
    
    CREATE INDEX IF NOT EXISTS idx_notification_email_tracking_notification_id 
        ON public.notification_email_tracking(notification_id);

    -- إنشاء دالة لتحديث updated_at تلقائياً
    CREATE OR REPLACE FUNCTION update_notification_email_tracking_updated_at()
    RETURNS TRIGGER AS $func$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;

    -- إنشاء trigger لتحديث updated_at
    DROP TRIGGER IF EXISTS trigger_update_notification_email_tracking_updated_at 
        ON public.notification_email_tracking;
    
    CREATE TRIGGER trigger_update_notification_email_tracking_updated_at
        BEFORE UPDATE ON public.notification_email_tracking
        FOR EACH ROW
        EXECUTE FUNCTION update_notification_email_tracking_updated_at();

    -- إضافة تعليقات على الجدول والأعمدة
    COMMENT ON TABLE public.notification_email_tracking IS 'جدول تتبع حالة الإرسال البريدي للإشعارات';
    COMMENT ON COLUMN public.notification_email_tracking.notification_id IS 'معرف الإشعار المرتبط';
    COMMENT ON COLUMN public.notification_email_tracking.email_status IS 'حالة الإرسال البريدي: pending, sent, failed, retry';
    COMMENT ON COLUMN public.notification_email_tracking.email_sent_at IS 'وقت إرسال الإيميل بنجاح';
    COMMENT ON COLUMN public.notification_email_tracking.retry_count IS 'عدد المحاولات لإرسال الإيميل';
    COMMENT ON COLUMN public.notification_email_tracking.error_message IS 'رسالة الخطأ في حالة فشل الإرسال';

    RAISE NOTICE 'تم إنشاء جدول notification_email_tracking بنجاح';
END;
$$;

-- تشغيل الدالة لإنشاء الجدول
SELECT create_notification_email_tracking_table();

-- دالة للحصول على إحصائيات الإشعارات البريدية
CREATE OR REPLACE FUNCTION get_notification_email_stats()
RETURNS TABLE (
    total_notifications BIGINT,
    pending_notifications BIGINT,
    sent_notifications BIGINT,
    failed_notifications BIGINT,
    retry_notifications BIGINT,
    success_rate NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_notifications,
        COUNT(*) FILTER (WHERE net.email_status = 'pending') as pending_notifications,
        COUNT(*) FILTER (WHERE net.email_status = 'sent') as sent_notifications,
        COUNT(*) FILTER (WHERE net.email_status = 'failed') as failed_notifications,
        COUNT(*) FILTER (WHERE net.email_status = 'retry') as retry_notifications,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(*) FILTER (WHERE net.email_status = 'sent')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
            ELSE 0
        END as success_rate
    FROM public.notification_email_tracking net;
END;
$$;

-- دالة للحصول على الإشعارات غير المرسلة
CREATE OR REPLACE FUNCTION get_unprocessed_notifications()
RETURNS TABLE (
    notification_id UUID,
    user_id UUID,
    type VARCHAR(50),
    title TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    email_status VARCHAR(20),
    retry_count INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id as notification_id,
        n.user_id,
        n.type,
        n.title,
        n.message,
        n.created_at,
        COALESCE(net.email_status, 'pending') as email_status,
        COALESCE(net.retry_count, 0) as retry_count
    FROM public.notifications n
    LEFT JOIN public.notification_email_tracking net ON n.id = net.notification_id
    WHERE n.is_read = false
    AND (net.email_status IS NULL OR net.email_status IN ('pending', 'failed'))
    ORDER BY n.created_at ASC;
END;
$$;

-- دالة لتنظيف السجلات القديمة (أكثر من 30 يوم)
CREATE OR REPLACE FUNCTION cleanup_old_notification_tracking()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.notification_email_tracking 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RAISE NOTICE 'تم حذف % سجل قديم من جدول تتبع الإشعارات', deleted_count;
    
    RETURN deleted_count;
END;
$$;

-- إنشاء جدولة لتنظيف السجلات القديمة (إذا كان cron متاحاً)
-- يمكن تشغيلها يدوياً أو جدولتها حسب البيئة
-- SELECT cron.schedule('cleanup-notification-tracking', '0 2 * * *', 'SELECT cleanup_old_notification_tracking();');

COMMENT ON FUNCTION create_notification_email_tracking_table() IS 'إنشاء جدول تتبع الإشعارات البريدية مع الفهارس والـ triggers';
COMMENT ON FUNCTION get_notification_email_stats() IS 'الحصول على إحصائيات الإشعارات البريدية';
COMMENT ON FUNCTION get_unprocessed_notifications() IS 'الحصول على الإشعارات غير المعالجة';
COMMENT ON FUNCTION cleanup_old_notification_tracking() IS 'تنظيف السجلات القديمة من جدول التتبع';
