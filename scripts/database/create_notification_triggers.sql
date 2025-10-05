-- إنشاء triggers الإشعارات البريدية
-- تاريخ الإنشاء: 20-09-2025
-- الغرض: إنشاء triggers لإنشاء الإشعارات عند الإعجاب ومشاهدة الملفات

-- ===================================
-- 1. إنشاء دالة إنشاء الإشعارات
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
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
        created_at
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
        NOW()
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$;

-- ===================================
-- 2. إنشاء دالة إشعار الإعجابات
-- ===================================

CREATE OR REPLACE FUNCTION public.notify_user_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
            'إعجاب جديد!',
            'أعجب بك مستخدم جديد',
            '/profile/' || NEW.liker_id::text,
            'عرض الملف الشخصي'
        );
        
        RAISE LOG 'تم إنشاء إشعار إعجاب: % للمستخدم: % من: %', notification_id, NEW.liked_user_id, NEW.liker_id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'خطأ في إنشاء إشعار الإعجاب: %', SQLERRM;
    END;
    
    RETURN NEW;
END;
$$;

-- ===================================
-- 3. إنشاء دالة إشعار مشاهدة الملف الشخصي
-- ===================================

CREATE OR REPLACE FUNCTION public.notify_profile_view()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
            'مشاهدة جديدة!',
            'شاهد ملفك الشخصي مستخدم جديد',
            '/profile/' || NEW.viewer_id::text,
            'عرض الملف الشخصي'
        );
        
        RAISE LOG 'تم إنشاء إشعار مشاهدة: % للمستخدم: % من: %', notification_id, NEW.viewed_user_id, NEW.viewer_id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'خطأ في إنشاء إشعار المشاهدة: %', SQLERRM;
    END;
    
    RETURN NEW;
END;
$$;

-- ===================================
-- 4. حذف الـ triggers القديمة إذا كانت موجودة
-- ===================================

DROP TRIGGER IF EXISTS trigger_notify_user_like ON public.user_likes;
DROP TRIGGER IF EXISTS trigger_notify_profile_view ON public.profile_views;

-- ===================================
-- 5. إنشاء الـ triggers الجديدة
-- ===================================

-- إنشاء trigger للإعجابات
CREATE TRIGGER trigger_notify_user_like
    AFTER INSERT ON public.user_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_user_like();

-- إنشاء trigger لمشاهدة الملفات
CREATE TRIGGER trigger_notify_profile_view
    AFTER INSERT ON public.profile_views
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_profile_view();

-- ===================================
-- 6. إعطاء الصلاحيات
-- ===================================

GRANT EXECUTE ON FUNCTION public.create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION public.notify_user_like TO authenticated;
GRANT EXECUTE ON FUNCTION public.notify_profile_view TO authenticated;

-- ===================================
-- 7. اختبار النظام
-- ===================================

-- اختبار إنشاء إشعار يدوي
DO $$
DECLARE
    test_notification_id UUID;
    test_user_id UUID;
BEGIN
    -- الحصول على معرف مستخدم موجود
    SELECT id INTO test_user_id FROM public.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- إنشاء إشعار تجريبي
        test_notification_id := public.create_notification(
            test_user_id,
            test_user_id,
            'system',
            'اختبار النظام',
            'تم إنشاء triggers الإشعارات بنجاح',
            '/',
            'عرض الصفحة الرئيسية'
        );
        
        RAISE LOG 'تم إنشاء إشعار تجريبي: %', test_notification_id;
    END IF;
END;
$$;

-- ===================================
-- 8. رسالة النجاح
-- ===================================

DO $$
BEGIN
    RAISE LOG '✅ تم إنشاء triggers الإشعارات البريدية بنجاح!';
    RAISE LOG '📧 النظام جاهز لإرسال الإشعارات البريدية عند الإعجاب ومشاهدة الملفات';
END;
$$;
