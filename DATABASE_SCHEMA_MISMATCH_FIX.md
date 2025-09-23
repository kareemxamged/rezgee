# إصلاح مشكلة عدم تطابق هيكل قاعدة البيانات

**التاريخ:** 9 يناير 2025  
**المشروع:** رزقي - منصة الزواج الإسلامي الشرعي  
**المطور:** فريق التطوير - رزقي

---

## 🎯 المشكلة المحددة

### وصف المشكلة:
عند محاولة حفظ إعدادات SMTP في القوالب، يظهر خطأ 400 (Bad Request) مع الرسالة:
```
Could not find the 'contact_smtp_receive_id' column of 'email_templates' in the schema cache
```

### الأعراض:
- ✅ النظام يحفظ البيانات في الواجهة بشكل صحيح
- ✅ البيانات تظهر في الكونسول بشكل صحيح
- ❌ فشل في حفظ البيانات في قاعدة البيانات
- ❌ خطأ 400 (Bad Request) من Supabase
- ❌ العمود `contact_smtp_receive_id` غير موجود في جدول `email_templates`

---

## 🔍 تشخيص المشكلة

### 1. **فحص هيكل جدول `email_templates` الحالي**

#### الهيكل الحالي في `simple_email_tables.sql`:
```sql
CREATE TABLE email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    subject_ar VARCHAR(500) NOT NULL,
    subject_en VARCHAR(500) NOT NULL,
    content_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    html_template_ar TEXT NOT NULL,
    html_template_en TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### الأعمدة المفقودة:
- ❌ `smtp_settings_id` - إعدادات SMTP للقوالب العادية
- ❌ `contact_smtp_send_id` - إعدادات SMTP لإرسال إيميلات التواصل
- ❌ `contact_smtp_receive_id` - إعدادات SMTP لاستقبال إيميلات التواصل
- ❌ `is_default` - في جدول `email_settings`

### 2. **فحص رسائل الخطأ**

#### رسائل الكونسول:
```
📋 تحميل بيانات القالب للتعديل: {id: '1f8d28f4-f98b-4322-a1d3-34cb6e5710ac', ...}
🔧 إعدادات SMTP المحملة: {smtp_settings_id: undefined, contact_smtp_send_id: undefined, contact_smtp_receive_id: undefined}
📝 بيانات النموذج المحملة: {smtp_settings_id: '', contact_smtp_send_id: '', contact_smtp_receive_id: ''}
📝 بيانات القالب المرسلة: {...}
🔧 إعدادات SMTP: {smtp_settings_id: '723ddbd8-bceb-4bdb-aafa-6160cedbe2da', contact_smtp_send_id: null, contact_smtp_receive_id: null}
📝 تحديث قالب إيميل: {id: '1f8d28f4-f98b-4322-a1d3-34cb6e5710ac', data: {...}}
❌ خطأ في تحديث قالب الإيميل: {code: 'PGRST204', details: null, hint: null, message: "Could not find the 'contact_smtp_receive_id' column of 'email_templates' in the schema cache"}
```

#### تحليل الخطأ:
- **الكود:** `PGRST204` - خطأ في PostgREST
- **الرسالة:** العمود `contact_smtp_receive_id` غير موجود في schema cache
- **السبب:** الجدول في قاعدة البيانات لا يحتوي على الأعمدة المطلوبة

---

## ✅ الإصلاحات المطبقة

### 1. **إنشاء ملف SQL لإضافة الأعمدة المفقودة**

#### ملف `add_smtp_columns_to_templates.sql`:
```sql
-- إضافة الأعمدة المطلوبة إلى جدول email_templates
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS smtp_settings_id UUID;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS contact_smtp_send_id UUID;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS contact_smtp_receive_id UUID;

-- إضافة فهارس للأعمدة الجديدة لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_email_templates_smtp_settings_id ON email_templates(smtp_settings_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_contact_smtp_send_id ON email_templates(contact_smtp_send_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_contact_smtp_receive_id ON email_templates(contact_smtp_receive_id);
```

### 2. **إنشاء ملف SQL شامل للتحديث**

#### ملف `update_email_tables_complete.sql`:
```sql
-- ========================================
-- 1. إضافة حقل is_default إلى جدول email_settings
-- ========================================

-- إضافة حقل is_default
ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- إنشاء فهرس فريد لضمان وجود إعداد افتراضي واحد فقط
CREATE UNIQUE INDEX IF NOT EXISTS email_settings_default_unique 
ON email_settings (is_default) 
WHERE is_default = true;

-- تعيين أول إعداد نشط كافتراضي إذا لم يكن هناك إعداد افتراضي
UPDATE email_settings 
SET is_default = true 
WHERE id = (
    SELECT id 
    FROM email_settings 
    WHERE is_active = true 
    ORDER BY created_at ASC 
    LIMIT 1
) 
AND NOT EXISTS (
    SELECT 1 
    FROM email_settings 
    WHERE is_default = true
);

-- ========================================
-- 2. إضافة أعمدة إعدادات SMTP إلى جدول email_templates
-- ========================================

-- إضافة الأعمدة المطلوبة إلى جدول email_templates
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS smtp_settings_id UUID;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS contact_smtp_send_id UUID;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS contact_smtp_receive_id UUID;

-- إضافة فهارس للأعمدة الجديدة لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_email_templates_smtp_settings_id ON email_templates(smtp_settings_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_contact_smtp_send_id ON email_templates(contact_smtp_send_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_contact_smtp_receive_id ON email_templates(contact_smtp_receive_id);

-- ========================================
-- 3. تحديث البيانات الموجودة
-- ========================================

-- تحديث القوالب الموجودة لتحديد إعدادات SMTP افتراضية
UPDATE email_templates 
SET smtp_settings_id = (
    SELECT id 
    FROM email_settings 
    WHERE is_default = true 
    LIMIT 1
)
WHERE smtp_settings_id IS NULL;
```

### 3. **الهيكل المحدث للجداول**

#### جدول `email_settings` المحدث:
```sql
CREATE TABLE email_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    smtp_host VARCHAR(255) NOT NULL,
    smtp_port INTEGER NOT NULL DEFAULT 587,
    smtp_username VARCHAR(255) NOT NULL,
    smtp_password VARCHAR(255) NOT NULL,
    from_name_ar VARCHAR(255) NOT NULL,
    from_name_en VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    reply_to VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,  -- ← عمود جديد
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### جدول `email_templates` المحدث:
```sql
CREATE TABLE email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    subject_ar VARCHAR(500) NOT NULL,
    subject_en VARCHAR(500) NOT NULL,
    content_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    html_template_ar TEXT NOT NULL,
    html_template_en TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    smtp_settings_id UUID,                    -- ← عمود جديد
    contact_smtp_send_id UUID,                -- ← عمود جديد
    contact_smtp_receive_id UUID,             -- ← عمود جديد
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🧪 كيفية تطبيق الإصلاح

### الخطوة 1: تشغيل ملف SQL للتحديث
```sql
-- تشغيل الملف التالي في Supabase SQL Editor:
-- update_email_tables_complete.sql
```

### الخطوة 2: التحقق من التحديث
```sql
-- التحقق من وجود الأعمدة الجديدة
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'email_templates' 
AND column_name IN ('smtp_settings_id', 'contact_smtp_send_id', 'contact_smtp_receive_id');

-- التحقق من وجود العمود الجديد في email_settings
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'email_settings' 
AND column_name = 'is_default';
```

### الخطوة 3: اختبار النظام
1. انتقل إلى لوحة الإدارة → الإشعارات البريدية
2. حاول تعديل قالب وتحديد إعدادات SMTP
3. احفظ القالب
4. افتح نافذة التعديل مرة أخرى وتأكد من ظهور الإعدادات

---

## 📊 النتائج المتوقعة

### ✅ **بعد تطبيق الإصلاح:**
- **حفظ إعدادات SMTP**: سيعمل بدون أخطاء
- **تحميل الإعدادات**: ستظهر الإعدادات المحفوظة في نافذة التعديل
- **نظام الإعداد الافتراضي**: سيعمل بشكل صحيح
- **لا مزيد من أخطاء 400**: لن تظهر أخطاء PostgREST

### ✅ **التحسينات المضافة:**
- **فهارس محسنة**: لتحسين أداء الاستعلامات
- **قيود البيانات**: لضمان سلامة البيانات
- **تحديث البيانات الموجودة**: لتعيين إعدادات افتراضية للقوالب الموجودة

---

## 🔧 الملفات المُنشأة

### 1. **ملفات SQL**
- `add_smtp_columns_to_templates.sql` - إضافة أعمدة SMTP للقوالب
- `update_email_tables_complete.sql` - تحديث شامل للجداول

### 2. **ملفات التوثيق**
- `DATABASE_SCHEMA_MISMATCH_FIX.md` - هذا الملف

---

## 📝 ملاحظات مهمة

1. **النسخ الاحتياطي**: تأكد من عمل نسخة احتياطية من قاعدة البيانات قبل التحديث
2. **الاختبار**: اختبر النظام بعد التحديث للتأكد من عمل كل شيء
3. **الفهارس**: تم إضافة فهارس لتحسين الأداء
4. **البيانات الموجودة**: سيتم تحديث القوالب الموجودة تلقائياً

---

## 🎉 الخلاصة

تم تحديد وإصلاح مشكلة عدم تطابق هيكل قاعدة البيانات بنجاح. المشكلة كانت أن جدول `email_templates` لا يحتوي على الأعمدة المطلوبة لحفظ إعدادات SMTP.

**الحل:**
- ✅ **إضافة الأعمدة المفقودة** إلى جدول `email_templates`
- ✅ **إضافة حقل `is_default`** إلى جدول `email_settings`
- ✅ **إنشاء فهارس محسنة** لتحسين الأداء
- ✅ **تحديث البيانات الموجودة** تلقائياً

**النتيجة:** بعد تطبيق ملف SQL، سيعمل النظام بشكل صحيح ولن تظهر أخطاء 400 عند حفظ إعدادات SMTP في القوالب.

**تاريخ الإنجاز:** 9 يناير 2025  
**فريق التطوير - رزقي**






