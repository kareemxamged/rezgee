-- إصلاح عمود metadata في جدول notifications
-- تاريخ الإنشاء: 2025-01-09
-- الغرض: إضافة عمود metadata إذا لم يكن موجوداً

-- بدء المعاملة
BEGIN;

-- التحقق من وجود العمود وإضافته إذا لم يكن موجوداً
DO $$ 
BEGIN
    -- التحقق من وجود عمود metadata
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'notifications' 
        AND column_name = 'metadata'
    ) THEN
        -- إضافة عمود metadata
        ALTER TABLE public.notifications 
        ADD COLUMN metadata JSONB DEFAULT '{}';
        
        -- إضافة تعليق على العمود
        COMMENT ON COLUMN public.notifications.metadata IS 'بيانات إضافية للإشعار (JSON)';
        
        RAISE NOTICE 'تم إضافة عمود metadata إلى جدول notifications';
    ELSE
        RAISE NOTICE 'عمود metadata موجود بالفعل في جدول notifications';
    END IF;
END $$;

-- التحقق من وجود العمود مرة أخرى
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'notifications' 
AND column_name = 'metadata';

-- إنهاء المعاملة
COMMIT;

-- رسالة نجاح
SELECT 'تم إصلاح جدول notifications بنجاح!' as result;











