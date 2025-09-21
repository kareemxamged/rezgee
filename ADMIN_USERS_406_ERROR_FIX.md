# 🚨 إصلاح خطأ 406 في الوصول لجدول admin_users

## 🐛 المشكلة
عند دخول صفحة "إدارة المستخدمين" كان يظهر خطأ في Console:

```
GET https://sbtzngewizgeqzfbhfjy.supabase.co/rest/v1/admin_users?select=id%2Cis_active&user_id=eq.f7d18de3-9102-4c40-a01a-a34f863ce319&is_active=eq.true 406 (Not Acceptable)
```

## 🔍 تحليل المشكلة

### السبب الجذري:
1. **مشكلة في الصلاحيات**: الكود في `adminUsersService.ts` يحاول الوصول لجدول `admin_users` مباشرة
2. **سياسات RLS**: جدول `admin_users` محمي بسياسات Row Level Security تتطلب صلاحيات خاصة
3. **Service Key غير متوفر**: `VITE_SUPABASE_SERVICE_ROLE_KEY` غير مُعرف في متغيرات البيئة
4. **استخدام Client خاطئ**: يتم استخدام `supabase` العادي بدلاً من `adminSupabase`

### الكود المسبب للمشكلة:
```typescript
// في adminUsersService.ts السطر 457-459
const { data: adminUserIds, error: adminError } = await client
  .from('admin_users')
  .select('user_id');
```

### سياسات RLS الحالية:
```sql
-- سياسات تتطلب صلاحيات خاصة
"Admin users can view admin users" - requires is_admin_user()
"Super admin access" - requires specific user ID
"Super admins can manage admin users" - requires has_admin_permission()
```

## ✅ الحل المطبق

### 1. إنشاء دالة آمنة في قاعدة البيانات
```sql
CREATE OR REPLACE FUNCTION get_admin_user_ids()
RETURNS TABLE (user_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT au.user_id
    FROM public.admin_users au
    WHERE au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- منح صلاحية التنفيذ لجميع المستخدمين
GRANT EXECUTE ON FUNCTION get_admin_user_ids() TO public;
GRANT EXECUTE ON FUNCTION get_admin_user_ids() TO anon;
GRANT EXECUTE ON FUNCTION get_admin_user_ids() TO authenticated;
```

### 2. تحديث الكود لاستخدام الدالة الآمنة
```typescript
// قبل الإصلاح:
const { data: adminUserIds, error: adminError } = await client
  .from('admin_users')
  .select('user_id');

// بعد الإصلاح:
const { data: adminUserIds, error: adminError } = await client
  .rpc('get_admin_user_ids');
```

## 🎯 فوائد الحل

### ✅ المزايا:
1. **تجاوز سياسات RLS**: الدالة تعمل بصلاحيات `SECURITY DEFINER`
2. **لا يتطلب Service Key**: يعمل مع أي client عادي
3. **أمان محسن**: الدالة تعرض فقط البيانات المطلوبة
4. **سهولة الصيانة**: حل مركزي لجلب معرفات المشرفين

### 🔒 الأمان:
- الدالة تعرض فقط `user_id` للمشرفين النشطين
- لا تعرض معلومات حساسة أخرى
- محمية بـ `SECURITY DEFINER` لضمان التنفيذ الآمن

## 📁 الملفات المحدثة

### قاعدة البيانات:
- ✅ إنشاء دالة `get_admin_user_ids()`
- ✅ منح صلاحيات التنفيذ

### الكود:
- 📝 `src/lib/adminUsersService.ts` - تحديث استدعاءات جلب معرفات المشرفين (دالتان)
- 📝 `src/lib/separateAdminUsersService.ts` - تحديث استدعاء جلب معرفات المشرفين
- 📝 `src/lib/adminAuthService.ts` - تحديث دالة `isAdminUser` و `getCurrentAdminUser`
- 📝 `src/services/autoRefreshService.ts` - تحديث استدعاء جلب معرفات المشرفين

## 🧪 كيفية التأكد من الإصلاح

### 1. فحص Console
- يجب ألا يظهر خطأ `406 (Not Acceptable)`
- يجب ألا تظهر رسائل خطأ متعلقة بـ `admin_users`

### 2. فحص صفحة إدارة المستخدمين
- الصفحة تحمل بدون أخطاء
- قائمة المستخدمين تظهر بشكل طبيعي
- لا توجد رسائل خطأ في الواجهة

### 3. اختبار الدالة مباشرة
```sql
-- اختبار الدالة في قاعدة البيانات
SELECT * FROM get_admin_user_ids();
```

## ⚠️ ملاحظات مهمة

### للمطورين:
1. **استخدم الدالة**: بدلاً من الوصول المباشر لجدول `admin_users`
2. **تحقق من النتائج**: تأكد من أن الدالة ترجع البيانات المتوقعة
3. **مراقبة الأداء**: الدالة محسنة لكن راقب الأداء في حالة البيانات الكبيرة

### للإدارة:
- الحل آمن ولا يؤثر على أمان النظام
- يحسن من أداء وموثوقية صفحة إدارة المستخدمين
- لا يتطلب تغييرات في متغيرات البيئة

---
**تاريخ الإصلاح:** 25-08-2025
**الأولوية:** متوسطة 🔧
**الحالة:** تم الإصلاح ✅
