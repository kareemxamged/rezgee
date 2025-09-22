# إصلاح مشكلة القوالب المكررة

## 🐛 **المشكلة:**

```
❌ خطأ في جلب قالب الإيميل: {code: 'PGRST116', details: 'Results contain 3 rows, application/vnd.pgrst.object+json requires 1 row', hint: null, message: 'JSON object requested, multiple (or no) rows returned'}
```

## 🔍 **السبب:**

### **1. قوالب مكررة في قاعدة البيانات:**
- يوجد عدة قوالب بنفس الاسم `report_received_notification`
- دالة `getEmailTemplate` تستخدم `.maybeSingle()` التي تتوقع صف واحد فقط
- وجود عدة صفوف يسبب خطأ `PGRST116`

### **2. عدم وجود ترتيب للنتائج:**
- لا يوجد ترتيب محدد للقوالب عند جلبها
- قد يتم جلب قالب قديم بدلاً من الأحدث

## ✅ **الحل المُطبق:**

### **1. تحسين استعلام جلب القالب:**
```typescript
// قبل الإصلاح
const { data, error } = await supabase
  .from('email_templates')
  .select('*')
  .eq('name', templateName)
  .eq('is_active', true)
  .maybeSingle();

// بعد الإصلاح
const { data, error } = await supabase
  .from('email_templates')
  .select('*')
  .eq('name', templateName)
  .eq('is_active', true)
  .order('created_at', { ascending: false })  // ترتيب حسب الأحدث
  .limit(1)                                   // تحديد صف واحد فقط
  .maybeSingle();
```

### **2. تحسين معالجة الأخطاء:**
```typescript
if (!data) {
  console.warn(`⚠️ لم يتم العثور على قالب الإيميل: ${templateName}`);
  return null;
}
```

### **3. رسائل خطأ أكثر وضوحاً:**
```typescript
throw new Error(`لم يتم العثور على القالب النشط: ${templateName}. تأكد من وجود القالب وأنه مفعل في قاعدة البيانات.`);
```

### **4. استعلام لحذف القوالب المكررة:**
```sql
-- حذف القوالب المكررة (يبقي على أحدثها)
WITH duplicate_templates AS (
    SELECT 
        id,
        name,
        ROW_NUMBER() OVER (
            PARTITION BY name 
            ORDER BY created_at DESC, id DESC
        ) as rn
    FROM email_templates
)
DELETE FROM email_templates 
WHERE id IN (
    SELECT id 
    FROM duplicate_templates 
    WHERE rn > 1
);
```

## 🔧 **التفاصيل التقنية:**

### **1. ترتيب النتائج:**
- `ORDER BY created_at DESC`: ترتيب حسب تاريخ الإنشاء (الأحدث أولاً)
- `LIMIT 1`: تحديد صف واحد فقط
- `maybeSingle()`: يعمل بشكل صحيح مع صف واحد أو صفر

### **2. معالجة المكررات:**
- استخدام `ROW_NUMBER()` لتحديد المكررات
- `PARTITION BY name`: تجميع حسب اسم القالب
- `ORDER BY created_at DESC, id DESC`: ترتيب للحصول على الأحدث

### **3. الأمان:**
- استخدام `BEGIN` و `COMMIT` لضمان سلامة البيانات
- عرض النتائج قبل وبعد الحذف للتحقق

## 📁 **الملفات المُحدثة:**

### **1. `src/lib/databaseEmailService.ts`:**
- ✅ إضافة ترتيب للاستعلام
- ✅ إضافة `LIMIT 1`
- ✅ تحسين معالجة الأخطاء
- ✅ رسائل خطأ أكثر وضوحاً

### **2. `fix_duplicate_templates.sql`:**
- ✅ استعلام لحذف القوالب المكررة
- ✅ عرض النتائج قبل وبعد الحذف
- ✅ إحصائيات مفصلة

## 🚀 **كيفية الاستخدام:**

### **الطريقة 1: تشغيل الاستعلام (موصى به):**
```sql
-- تشغيل الملف لحذف المكررات
\i fix_duplicate_templates.sql
```

### **الطريقة 2: التحقق من المكررات:**
```sql
-- عرض القوالب المكررة
SELECT 
    name,
    COUNT(*) as count,
    MIN(created_at) as oldest,
    MAX(created_at) as newest
FROM email_templates 
GROUP BY name 
HAVING COUNT(*) > 1
ORDER BY count DESC;
```

## 🔍 **التحقق من النتائج:**

### **بعد تشغيل الاستعلام:**
```sql
-- يجب أن ترى:
-- ✅ لا توجد قوالب مكررة
-- ✅ كل قالب له صف واحد فقط
-- ✅ إجمالي القوالب محدث
```

### **اختبار النظام:**
1. ✅ الضغط على زر اختبار القالب
2. ✅ عدم ظهور خطأ `PGRST116`
3. ✅ جلب القالب بنجاح
4. ✅ إرسال الإيميل بنجاح

## ⚠️ **ملاحظات مهمة:**

### **1. النسخ الاحتياطي:**
- ✅ تأكد من عمل نسخة احتياطية قبل حذف المكررات
- ✅ الاستعلام آمن ويبقي على أحدث القوالب

### **2. المراقبة:**
- ✅ راقب السجلات بعد التطبيق
- ✅ تأكد من عمل جميع القوالب بشكل صحيح

### **3. الوقاية:**
- ✅ تجنب إنشاء قوالب مكررة في المستقبل
- ✅ استخدم أسماء فريدة للقوالب الجديدة

## 🎯 **الخلاصة:**

تم إصلاح مشكلة القوالب المكررة بنجاح من خلال:

1. **تحسين استعلام جلب القالب** مع ترتيب وتحديد صف واحد
2. **إنشاء استعلام لحذف المكررات** مع الحفاظ على أحدث القوالب
3. **تحسين معالجة الأخطاء** مع رسائل أكثر وضوحاً
4. **ضمان سلامة البيانات** مع استخدام المعاملات

الآن يجب أن يعمل اختبار القوالب بدون أخطاء، وسيتم جلب أحدث قالب لكل اسم بشكل صحيح.





