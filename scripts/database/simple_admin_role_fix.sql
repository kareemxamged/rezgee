-- إصلاح بسيط لمشكلة role_id في جدول admin_accounts
-- Simple fix for role_id issue in admin_accounts table

-- 1. التحقق من البيانات الحالية
SELECT 
  id, 
  username, 
  email, 
  role_id, 
  is_super_admin,
  is_active
FROM admin_accounts 
WHERE username = 'shbakhur_admin';

-- 2. إنشاء دور افتراضي إذا لم يكن موجوداً
INSERT INTO admin_roles (id, name, display_name, description, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'مدير النظام',
  'مدير النظام',
  'دور افتراضي لمديري النظام',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 3. تحديث المشرفين الذين لا يملكون role_id
UPDATE admin_accounts 
SET role_id = '00000000-0000-0000-0000-000000000001'
WHERE role_id IS NULL 
  AND is_active = true;

-- 4. التحقق من النتيجة النهائية
SELECT 
  au.id,
  au.username,
  au.email,
  au.role_id,
  ar.name as role_name,
  ar.display_name as role_display_name,
  au.is_super_admin,
  au.is_active
FROM admin_accounts au
LEFT JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.username = 'shbakhur_admin';





