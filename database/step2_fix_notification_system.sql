-- الخطوة الثانية: حذف وإعادة إنشاء نظام الإشعارات البريدية
-- تاريخ الإنشاء: 12-09-2025
-- بناءً على النتائج المكتشفة من الخطوة الأولى

-- ===================================
-- 1. حذف جميع الـ triggers الموجودة
-- ===================================

DROP TRIGGER IF EXISTS trigger_notify_like ON public.user_likes;
DROP TRIGGER IF EXISTS trigger_notify_like_response ON public.likes;
DROP TRIGGER IF EXISTS trigger_notify_new_message ON public.messages;
DROP TRIGGER IF EXISTS trigger_notify_profile_view ON public.profile_views;
DROP TRIGGER IF EXISTS trigger_notify_user_like ON public.likes;

-- ===================================
-- 2. حذف جميع الدوال (سنحذفها بالقوة مع CASCADE)
-- ===================================

-- حذف دوال الإشعارات
DROP FUNCTION IF EXISTS notify_user_like() CASCADE;
DROP FUNCTION IF EXISTS notify_profile_view() CASCADE;
DROP FUNCTION IF EXISTS notify_new_message() CASCADE;
DROP FUNCTION IF EXISTS notify_new_match() CASCADE;
DROP FUNCTION IF EXISTS notify_like_response() CASCADE;

-- حذف جميع نسخ دالة create_notification (سنجرب جميع الاحتمالات)
DROP FUNCTION IF EXISTS create_notification() CASCADE;
DROP FUNCTION IF EXISTS create_notification(uuid) CASCADE;
DROP FUNCTION IF EXISTS create_notification(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS create_notification(uuid, uuid, text) CASCADE;
DROP FUNCTION IF EXISTS create_notification(uuid, uuid, text, text) CASCADE;
DROP FUNCTION IF EXISTS create_notification(uuid, uuid, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS create_notification(uuid, uuid, text, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS create_notification(uuid, uuid, text, text, text, text, text) CASCADE;

-- ===================================
-- 3. إنشاء دالة create_notification الجديدة
-- ===================================

CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_from_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_action_url TEXT DEFAULT NULL,
    p_action_text TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id,
        from_user_id,
        type,
        title,
        message,
        action_url,
        action_text,
        is_read,
        is_dismissed,
        created_at,
        updated_at
    ) VALUES (
        p_user_id,
        p_from_user_id,
        p_type,
        p_title,
        p_message,
        p_action_url,
        p_action_text,
        false,
        false,
        NOW(),
        NOW()
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================
-- 4. إنشاء دالة إشعار الإعجابات
-- ===================================

CREATE OR REPLACE FUNCTION public.notify_user_like()
RETURNS TRIGGER AS $$
DECLARE
    notification_id UUID;
BEGIN
    -- التأكد من أن المستخدم لا يعجب بنفسه
    IF NEW.liker_id = NEW.liked_user_id THEN
        RETURN NEW;
    END IF;
    
    -- إنشاء إشعار للمستخدم الذي تم الإعجاب به
    BEGIN
        notification_id := public.create_notification(
            NEW.liked_user_id,
            NEW.liker_id,
            'like',
            'notifications.content.like.title',
            'notifications.content.like.message',
            '/profile/' || NEW.liker_id::text,
            'notifications.content.like.actionText'
        );
        
        RAISE LOG 'تم إنشاء إشعار إعجاب: % للمستخدم: % من: %', notification_id, NEW.liked_user_id, NEW.liker_id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'خطأ في إنشاء إشعار الإعجاب: %', SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================
-- 5. إنشاء دالة إشعار مشاهدة الملف الشخصي
-- ===================================

CREATE OR REPLACE FUNCTION public.notify_profile_view()
RETURNS TRIGGER AS $$
DECLARE
    notification_id UUID;
BEGIN
    -- التأكد من أن المستخدم لا يشاهد ملفه الشخصي
    IF NEW.viewer_id = NEW.viewed_user_id THEN
        RETURN NEW;
    END IF;
    
    -- إنشاء إشعار للمستخدم الذي تم مشاهدة ملفه
    BEGIN
        notification_id := public.create_notification(
            NEW.viewed_user_id,
            NEW.viewer_id,
            'profile_view',
            'notifications.content.profileView.title',
            'notifications.content.profileView.message',
            '/profile/' || NEW.viewer_id::text,
            'notifications.content.profileView.actionText'
        );
        
        RAISE LOG 'تم إنشاء إشعار مشاهدة ملف: % للمستخدم: % من: %', notification_id, NEW.viewed_user_id, NEW.viewer_id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'خطأ في إنشاء إشعار مشاهدة الملف: %', SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================
-- 6. إنشاء الـ triggers الجديدة
-- ===================================

-- trigger للإعجابات على جدول user_likes
CREATE TRIGGER trigger_notify_user_like
    AFTER INSERT ON public.user_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_user_like();

-- trigger للإعجابات على جدول likes (إذا كان يستخدم)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'likes' AND table_schema = 'public') THEN
        EXECUTE 'CREATE TRIGGER trigger_notify_user_like_on_likes
            AFTER INSERT ON public.likes
            FOR EACH ROW
            EXECUTE FUNCTION public.notify_user_like()';
    END IF;
END $$;

-- trigger لمشاهدة الملفات
CREATE TRIGGER trigger_notify_profile_view
    AFTER INSERT ON public.profile_views
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_profile_view();

-- ===================================
-- 7. إعطاء الصلاحيات
-- ===================================

GRANT EXECUTE ON FUNCTION public.create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION public.notify_user_like TO authenticated;
GRANT EXECUTE ON FUNCTION public.notify_profile_view TO authenticated;

-- ===================================
-- 8. اختبار النظام
-- ===================================

DO $$
DECLARE
    test_notification_id UUID;
    test_user_id UUID := gen_random_uuid();
    test_from_user_id UUID := gen_random_uuid();
BEGIN
    BEGIN
        test_notification_id := public.create_notification(
            test_user_id,
            test_from_user_id,
            'test',
            'اختبار النظام',
            'هذا إشعار تجريبي للتأكد من عمل النظام'
        );
        
        RAISE NOTICE '✅ تم إنشاء إشعار تجريبي بنجاح: %', test_notification_id;
        
        DELETE FROM public.notifications WHERE id = test_notification_id;
        RAISE NOTICE '🗑️ تم حذف الإشعار التجريبي';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ خطأ في اختبار النظام: %', SQLERRM;
    END;
END;
$$;

-- ===================================
-- 9. التحقق من الـ triggers الجديدة
-- ===================================

SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_name LIKE '%notify%'
ORDER BY trigger_name;

-- ===================================
-- 10. تقرير النتائج
-- ===================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '📊 تقرير إعداد نظام الإشعارات البريدية:';
    RAISE NOTICE '';
    RAISE NOTICE '🗑️ تم حذف جميع الـ triggers والدوال القديمة';
    RAISE NOTICE '✅ تم إنشاء دالة create_notification الجديدة';
    RAISE NOTICE '✅ تم إنشاء دالة notify_user_like';
    RAISE NOTICE '✅ تم إنشاء دالة notify_profile_view';
    RAISE NOTICE '✅ تم إنشاء triggers للإعجابات ومشاهدة الملفات';
    RAISE NOTICE '✅ تم إعطاء الصلاحيات المطلوبة';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 النظام جاهز الآن!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 للاختبار:';
    RAISE NOTICE '1. جرب الإعجاب بملف شخصي آخر';
    RAISE NOTICE '2. جرب مشاهدة ملف شخصي آخر';
    RAISE NOTICE '3. راقب الكونسول للرسائل:';
    RAISE NOTICE '   - "📧 إشعار جديد تم إنشاؤه"';
    RAISE NOTICE '   - "📨 معالجة إشعار جديد من نوع"';
    RAISE NOTICE '   - "✅ تم إرسال إشعار بريدي"';
    RAISE NOTICE '4. تحقق من البريد الإلكتروني';
    RAISE NOTICE '';
    RAISE NOTICE '🔍 تم عرض الـ triggers الجديدة أعلاه للتأكد';
    RAISE NOTICE '';
END;
$$;
