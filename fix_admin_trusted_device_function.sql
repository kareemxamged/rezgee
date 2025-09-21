-- إصلاح دالة add_trusted_device للمشرفين
-- Fix add_trusted_device function for admins

-- إسقاط جميع الدوال المتضاربة
DROP FUNCTION IF EXISTS public.add_trusted_device(UUID, TEXT, INET, TEXT, TIMESTAMP WITH TIME ZONE);
DROP FUNCTION IF EXISTS public.add_trusted_device(UUID, TEXT, INET, TEXT);
DROP FUNCTION IF EXISTS public.add_trusted_device(UUID, TEXT, TEXT, TEXT, TIMESTAMP WITH TIME ZONE);
DROP FUNCTION IF EXISTS public.add_trusted_device(UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.add_trusted_device;

-- إنشاء الدالة الجديدة مع المعاملات الصحيحة
CREATE OR REPLACE FUNCTION public.add_trusted_device(
    p_admin_id UUID,
    p_device_fingerprint TEXT,
    p_ip_address INET,
    p_user_agent TEXT,
    p_trusted_until TIMESTAMP WITH TIME ZONE
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO public.admin_trusted_devices (
        admin_id,
        device_fingerprint,
        ip_address,
        user_agent,
        trusted_until,
        created_at,
        last_used_at
    ) VALUES (
        p_admin_id,
        p_device_fingerprint,
        p_ip_address,
        p_user_agent,
        p_trusted_until,
        NOW(),
        NOW()
    ) ON CONFLICT (admin_id, device_fingerprint) 
    DO UPDATE SET
        ip_address = EXCLUDED.ip_address,
        user_agent = EXCLUDED.user_agent,
        trusted_until = EXCLUDED.trusted_until,
        last_used_at = NOW();
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إعطاء صلاحيات التنفيذ
GRANT EXECUTE ON FUNCTION public.add_trusted_device TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_trusted_device TO anon;

-- التحقق من وجود الجدول
CREATE TABLE IF NOT EXISTS public.admin_trusted_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.admin_accounts(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    trusted_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(admin_id, device_fingerprint)
);

-- إعطاء صلاحيات على الجدول
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_trusted_devices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_trusted_devices TO anon;

SELECT 'Function add_trusted_device fixed successfully!' as result;






