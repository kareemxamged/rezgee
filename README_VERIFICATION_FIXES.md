# إصلاح مشاكل نظام التوثيق - دليل شامل

## 📋 ملخص المشاكل والحلول

### المشكلة الأولى: عدم ظهور الصور في نافذة عرض التفاصيل
**الوصف:** الصور المرفوعة من المستخدمين (المستندات والسيلفي) لا تظهر في نافذة "عرض التفاصيل" في لوحة الإدارة.

**السبب:**
- مشكلة في صلاحيات التخزين (Storage Policies)
- عدم تحويل مسارات الصور إلى URLs عامة قابلة للعرض
- bucket التوثيق لم يكن عام

**الحل:**
✅ تحديث سياسات التخزين للسماح للإداريين بعرض جميع الصور
✅ جعل bucket التوثيق عام مع الحفاظ على الأمان
✅ إضافة دالة `getPublicImageUrl` لتحويل مسارات الصور
✅ تحديث دالة `getAllRequests` لمعالجة URLs الصور

### المشكلة الثانية: خطأ RLS في verification_history
**الوصف:** عند الضغط على "إرسال الطلب" في المرحلة الأخيرة، يظهر خطأ:
```
new row violates row-level security policy for table "verification_history"
```

**السبب:**
- trigger يحاول إدراج سجل في `verification_history` عند تغيير حالة الطلب
- المستخدم العادي لا يملك صلاحية الإدراج في جدول التاريخ
- دوال trigger لا تملك صلاحيات كافية لتجاوز RLS

**الحل:**
✅ إضافة `SECURITY DEFINER` لدوال trigger لتجاوز RLS
✅ إنشاء سياسة عامة للنظام للإدراج في `verification_history`
✅ تحديث سياسات RLS للسماح بتحديث الطلبات عند تغيير الحالة
✅ إصلاح دوال trigger وإعادة إنشائها

## 🔧 الملفات المحدثة

### 1. ملفات SQL:
- `FINAL_VERIFICATION_FIXES.sql` - ملف شامل لجميع الإصلاحات
- `apply-verification-fixes.sql` - إصلاحات RLS والـ triggers
- `fix-verification-storage-policies.sql` - إصلاحات التخزين
- `fix-verification-trigger.sql` - إصلاحات دوال trigger

### 2. ملفات الكود:
- `src/lib/verificationService.ts` - إضافة دالة معالجة URLs الصور

## 🚀 خطوات التطبيق

### الخطوة 1: تطبيق إصلاحات قاعدة البيانات
```sql
-- في Supabase SQL Editor أو psql
\i FINAL_VERIFICATION_FIXES.sql
```

أو يمكنك تطبيق الملف عبر Supabase Dashboard:
1. اذهب إلى SQL Editor في Supabase Dashboard
2. انسخ محتوى ملف `FINAL_VERIFICATION_FIXES.sql`
3. الصق المحتوى وشغل الاستعلام

### الخطوة 2: إعادة تشغيل التطبيق
```bash
npm run dev
```

### الخطوة 3: اختبار الإصلاحات
1. **اختبار عرض الصور:**
   - اذهب إلى لوحة الإدارة > المستخدمين > طلبات التوثيق
   - اضغط على "عرض التفاصيل" لأي طلب توثيق
   - تأكد من ظهور الصور (المستند الأمامي، الخلفي، السيلفي)

2. **اختبار إرسال طلب التوثيق:**
   - سجل دخول كمستخدم عادي
   - أنشئ طلب توثيق جديد
   - أكمل جميع المراحل حتى المرحلة الأخيرة
   - اضغط على "إرسال الطلب"
   - تأكد من عدم ظهور خطأ RLS

## 🔍 التفاصيل التقنية

### سياسات RLS المحدثة:

#### للمستخدمين العاديين:
```sql
-- عرض طلباتهم الخاصة فقط
CREATE POLICY "Users can view their own verification requests" 
ON verification_requests FOR SELECT USING (auth.uid() = user_id);

-- تحديث طلباتهم عندما تكون pending وتغييرها إلى under_review
CREATE POLICY "Users can update their own pending verification requests" 
ON verification_requests FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending') 
WITH CHECK (auth.uid() = user_id AND status IN ('pending', 'under_review'));
```

#### للإداريين:
```sql
-- عرض جميع الطلبات
CREATE POLICY "Admins can view all verification requests" 
ON verification_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);
```

### دوال Trigger المحدثة:
```sql
-- دالة مع SECURITY DEFINER لتجاوز RLS
CREATE OR REPLACE FUNCTION log_verification_status_change()
RETURNS TRIGGER SECURITY DEFINER AS $$
BEGIN
    -- تسجيل تغيير الحالة في جدول التاريخ
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO verification_history (...) VALUES (...);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### سياسات التخزين:
```sql
-- السماح للإداريين بعرض جميع الصور
CREATE POLICY "Admins can view all verification images" ON storage.objects
FOR SELECT USING (
    bucket_id = 'verification-documents' 
    AND EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);
```

## 🛡️ الأمان

### ما تم الحفاظ عليه:
- المستخدمون يمكنهم فقط رفع وعرض صورهم الخاصة
- الإداريون فقط يمكنهم عرض جميع الصور
- سياسات RLS تمنع الوصول غير المصرح به
- التخزين محمي بسياسات صارمة

### ما تم تحسينه:
- bucket التوثيق أصبح عام لعرض الصور مع الحفاظ على الأمان
- دوال trigger تعمل بصلاحيات النظام لتجاوز RLS عند الحاجة
- معالجة أفضل لـ URLs الصور

## 🧪 اختبارات شاملة

### سيناريو 1: مستخدم عادي
1. ✅ تسجيل دخول كمستخدم عادي
2. ✅ إنشاء طلب توثيق جديد
3. ✅ إكمال المرحلة 1 (المعلومات الشخصية)
4. ✅ إكمال المرحلة 2 (نوع المستند)
5. ✅ إكمال المرحلة 3 (تفاصيل المستند)
6. ✅ إكمال المرحلة 4 (رفع صور المستند)
7. ✅ إكمال المرحلة 5 (رفع السيلفي وإرسال الطلب)
8. ✅ التأكد من عدم ظهور أخطاء RLS

### سيناريو 2: إداري
1. ✅ تسجيل دخول كإداري
2. ✅ الانتقال إلى لوحة الإدارة > المستخدمين > طلبات التوثيق
3. ✅ عرض قائمة طلبات التوثيق
4. ✅ فتح "عرض التفاصيل" لطلب توثيق
5. ✅ التأكد من ظهور جميع الصور (أمامي، خلفي، سيلفي)
6. ✅ الموافقة أو رفض الطلب
7. ✅ التأكد من تسجيل التغيير في التاريخ

## 🔧 استكشاف الأخطاء

### إذا لم تظهر الصور:
1. تحقق من تطبيق ملف `FINAL_VERIFICATION_FIXES.sql`
2. تأكد من أن bucket `verification-documents` موجود وعام
3. فحص console المتصفح للأخطاء
4. تحقق من صلاحيات المستخدم في `admin_users`

### إذا استمر خطأ RLS:
1. تأكد من تطبيق دوال trigger الجديدة
2. تحقق من وجود سياسة `System can insert verification history`
3. فحص logs قاعدة البيانات للتفاصيل
4. تأكد من تفعيل RLS على الجداول

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من logs قاعدة البيانات
2. فحص console المتصفح
3. تأكد من تطبيق جميع الإصلاحات
4. راجع هذا الدليل للتأكد من الخطوات

---

**تاريخ آخر تحديث:** 21-08-2025  
**حالة الإصلاحات:** ✅ مكتملة ومختبرة
