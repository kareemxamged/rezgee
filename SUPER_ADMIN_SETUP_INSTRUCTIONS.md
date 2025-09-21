# 🛡️ تعليمات تعيين Super Admin

## 📋 نظرة عامة

هذا الدليل يوضح كيفية تعيين الحساب `test6@gmail.com` كمشرف عام (Super Admin) للنظام الإداري في موقع "رزقي".

## 🚀 خطوات التنفيذ

### الطريقة الأولى: استخدام Supabase Dashboard

1. **الدخول إلى Supabase Dashboard**
   - اذهب إلى [supabase.com](https://supabase.com)
   - سجل الدخول إلى مشروعك

2. **فتح SQL Editor**
   - من القائمة الجانبية، اختر "SQL Editor"
   - انقر على "New query"

3. **تشغيل ملف SQL**
   - انسخ محتوى ملف `assign-super-admin.sql`
   - الصق المحتوى في محرر SQL
   - انقر على "Run" لتشغيل الاستعلام

4. **التحقق من النتائج**
   - يجب أن ترى رسالة تأكيد تظهر بيانات المستخدم
   - تأكد من أن `is_super_admin` = `true`

### الطريقة الثانية: استخدام Supabase CLI

```bash
# تأكد من تسجيل الدخول
supabase login

# ربط المشروع
supabase link --project-ref YOUR_PROJECT_REF

# تشغيل ملف SQL
supabase db push --file assign-super-admin.sql
```

### الطريقة الثالثة: استخدام psql مباشرة

```bash
# الاتصال بقاعدة البيانات
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"

# تشغيل الملف
\i assign-super-admin.sql
```

## ✅ التحقق من نجاح العملية

### 1. فحص قاعدة البيانات

```sql
-- التحقق من وجود المستخدم كـ Super Admin
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    au.is_super_admin,
    au.is_active,
    r.display_name as role_name,
    au.created_at
FROM public.users u
JOIN public.admin_users au ON u.id = au.user_id
JOIN public.admin_roles r ON au.role_id = r.id
WHERE u.email = 'test6@gmail.com';
```

### 2. اختبار الوصول

1. **تسجيل الدخول**
   - اذهب إلى موقع "رزقي"
   - سجل الدخول باستخدام `test6@gmail.com`

2. **الوصول للوحة الإدارة**
   - اذهب إلى `/admin` في المتصفح
   - يجب أن تظهر لوحة التحكم الإدارية

3. **التحقق من الصلاحيات**
   - تأكد من ظهور جميع القوائم الإدارية
   - جرب الوصول لإدارة المستخدمين والمحتوى

## 🔧 استكشاف الأخطاء

### خطأ: المستخدم غير موجود

```sql
-- إنشاء المستخدم يدوياً
INSERT INTO public.users (
    email, 
    first_name, 
    last_name, 
    verified, 
    status
) VALUES (
    'test6@gmail.com',
    'Super',
    'Admin',
    true,
    'active'
);
```

### خطأ: الجداول الإدارية غير موجودة

- تأكد من تشغيل ملف `assign-super-admin.sql` كاملاً
- الملف يحتوي على إنشاء جميع الجداول المطلوبة

### خطأ: عدم ظهور لوحة الإدارة

1. **تحقق من تسجيل الدخول**
   ```sql
   SELECT * FROM auth.users WHERE email = 'test6@gmail.com';
   ```

2. **تحقق من الصلاحيات**
   ```sql
   SELECT au.*, r.name as role_name 
   FROM admin_users au 
   JOIN admin_roles r ON au.role_id = r.id 
   JOIN users u ON au.user_id = u.id 
   WHERE u.email = 'test6@gmail.com';
   ```

## 📊 الصلاحيات الممنوحة

بعد تشغيل الملف، سيحصل `test6@gmail.com` على:

### 🔐 صلاحيات إدارة المستخدمين
- عرض جميع المستخدمين
- تعديل بيانات المستخدمين
- حذف المستخدمين
- إدارة حالة التحقق

### 📝 صلاحيات إدارة المحتوى
- عرض وإنشاء المقالات
- تعديل وحذف المقالات
- إدارة التصنيفات

### ⚙️ صلاحيات إدارة النظام
- الوصول للوحة التحكم
- عرض الإحصائيات والتحليلات
- إدارة إعدادات النظام
- عرض سجلات النظام

### 🛡️ صلاحيات الأمان
- عرض تقارير الأمان
- إدارة البلاغات
- إدارة حظر المستخدمين

### 👥 صلاحيات إدارة المشرفين
- عرض قائمة المشرفين
- إضافة مشرفين جدد
- إدارة الأدوار والصلاحيات

## 🎯 الخطوات التالية

بعد تعيين Super Admin بنجاح:

1. **تسجيل الدخول والاختبار**
   - سجل الدخول بالحساب الجديد
   - اختبر جميع الوظائف الإدارية

2. **إضافة مشرفين آخرين**
   - استخدم واجهة إدارة المشرفين
   - أضف مشرفين بأدوار مختلفة حسب الحاجة

3. **مراجعة الأمان**
   - تأكد من أن RLS يعمل بشكل صحيح
   - راجع سجلات الأنشطة

4. **التوثيق**
   - وثق أي تغييرات إضافية
   - حدث ملف README.md

## 📞 الدعم

في حالة مواجهة أي مشاكل:

1. تحقق من سجلات قاعدة البيانات
2. راجع ملف `ADMIN_SYSTEM_DOCUMENTATION.md`
3. تأكد من أن جميع الجداول تم إنشاؤها بنجاح
4. تحقق من صلاحيات المستخدم في Supabase Auth

---

**ملاحظة**: تأكد من الاحتفاظ بنسخة احتياطية من قاعدة البيانات قبل تشغيل أي ملفات SQL.
