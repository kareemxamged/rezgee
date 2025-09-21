-- إصلاح مشكلة role_id في جدول admin_accounts
-- Fix role_id issue in admin_accounts table

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

-- 4. إضافة صلاحيات افتراضية للدور الافتراضي
INSERT INTO admin_permissions (id, code, name, description, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000011', 'manage_users', 'إدارة المستخدمين', 'إدارة المستخدمين في النظام', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000012', 'manage_content', 'إدارة المحتوى', 'إدارة المحتوى في النظام', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000013', 'manage_newsletter', 'إدارة النشرة الإخبارية', 'إدارة النشرة الإخبارية', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000014', 'view_analytics', 'عرض التحليلات', 'عرض التحليلات والإحصائيات', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000015', 'manage_settings', 'إدارة الإعدادات', 'إدارة إعدادات النظام', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. ربط الصلاحيات بالدور الافتراضي
INSERT INTO admin_role_permissions (role_id, permission_id, created_at, updated_at)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  id,
  NOW(),
  NOW()
FROM admin_permissions
WHERE id IN (
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000012', 
  '00000000-0000-0000-0000-000000000013',
  '00000000-0000-0000-0000-000000000014',
  '00000000-0000-0000-0000-000000000015'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 6. التحقق من النتيجة النهائية
SELECT 
  au.id,
  au.username,
  au.email,
  au.role_id,
  ar.name as role_name,
  au.is_super_admin,
  au.is_active
FROM admin_accounts au
LEFT JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.username = 'shbakhur_admin';

-- 7. التحقق من الصلاحيات
SELECT 
  ar.name as role_name,
  ap.code as permission_code,
  ap.name as permission_name
FROM admin_role_permissions arp
JOIN admin_roles ar ON arp.role_id = ar.id
JOIN admin_permissions ap ON arp.permission_id = ap.id
WHERE ar.id = '00000000-0000-0000-0000-000000000001';







