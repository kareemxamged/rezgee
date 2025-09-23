# إصلاح مشكلة تعديل القوالب

## 🐛 **المشكلة:**

عند الضغط على زر تعديل القالب، النافذة المنبثقة تظهر فارغة ولا يتم تحميل بيانات القالب في الحقول.

## 🔍 **السبب:**

### **1. عدم تحميل البيانات:**
- دالة `handleUpdateTemplate` لا تحمل بيانات القالب في `templateFormData`
- النافذة تستخدم `templateFormData` الفارغ بدلاً من بيانات القالب المحدد

### **2. عدم ربط البيانات:**
- الحقول مرتبطة بـ `templateFormData` وليس بـ `editingTemplate`
- لا يتم تحديث `templateFormData` عند فتح نافذة التعديل

## ✅ **الحل المُطبق:**

### **1. تحديث دالة `handleUpdateTemplate`:**

#### **قبل الإصلاح:**
```typescript
const handleUpdateTemplate = (template: EmailTemplate) => {
  setEditingTemplate(template);
  setShowTemplateModal(true);
};
```

#### **بعد الإصلاح:**
```typescript
const handleUpdateTemplate = (template: EmailTemplate) => {
  setEditingTemplate(template);
  setTemplateFormData({
    name: template.name || '',
    name_ar: template.name_ar || '',
    name_en: template.name_en || '',
    subject_ar: template.subject_ar || '',
    subject_en: template.subject_en || '',
    content_ar: template.content_ar || '',
    content_en: template.content_en || '',
    html_template_ar: template.html_template_ar || '',
    html_template_en: template.html_template_en || '',
    is_active: template.is_active || false
  });
  setShowTemplateModal(true);
};
```

### **2. تحديث دالة `handleSaveTemplate`:**

#### **دعم التعديل والإنشاء:**
```typescript
const handleSaveTemplate = async () => {
  if (!isTemplateFormValid) {
    showError('بيانات غير مكتملة', 'يرجى ملء جميع الحقول المطلوبة');
    return;
  }

  try {
    setLoading(true);
    
    const templateData = {
      ...templateFormData,
      updated_at: new Date().toISOString()
    };

    let result;
    if (editingTemplate) {
      // تحديث قالب موجود
      result = await EmailNotificationsAdminService.updateEmailTemplate(editingTemplate.id, templateData);
    } else {
      // إنشاء قالب جديد
      templateData.created_at = new Date().toISOString();
      result = await EmailNotificationsAdminService.createEmailTemplate(templateData);
    }
    
    if (result && result.success) {
      const action = editingTemplate ? 'تحديث' : 'إنشاء';
      showSuccess(
        `تم ${action} القالب بنجاح`,
        `تم ${action} القالب "${templateFormData.name_ar}" بنجاح في النظام`
      );
      setShowTemplateModal(false);
      setEditingTemplate(null);
      await refreshData();
    } else {
      showError(
        'فشل في حفظ القالب',
        `حدث خطأ في حفظ القالب: ${result?.error || 'خطأ غير معروف'}`
      );
    }
  } catch (error) {
    console.error('خطأ في حفظ القالب:', error);
    showError(
      'خطأ في حفظ القالب',
      'حدث خطأ غير متوقع في حفظ القالب. يرجى المحاولة مرة أخرى.'
    );
  } finally {
    setLoading(false);
  }
};
```

### **3. إعادة تعيين البيانات عند الإغلاق:**

#### **زر الإغلاق (X):**
```typescript
<button
  onClick={() => {
    setShowTemplateModal(false);
    setEditingTemplate(null);
    setTemplateFormData({
      name: '',
      name_ar: '',
      name_en: '',
      subject_ar: '',
      subject_en: '',
      content_ar: '',
      content_en: '',
      html_template_ar: '',
      html_template_en: '',
      is_active: true
    });
  }}
  className="modal-text-tertiary hover:modal-text-primary transition-colors"
>
  <X className="w-6 h-6" />
</button>
```

#### **زر الإلغاء:**
```typescript
<button
  onClick={() => {
    setShowTemplateModal(false);
    setEditingTemplate(null);
    setTemplateFormData({
      name: '',
      name_ar: '',
      name_en: '',
      subject_ar: '',
      subject_en: '',
      content_ar: '',
      content_en: '',
      html_template_ar: '',
      html_template_en: '',
      is_active: true
    });
  }}
  className="modal-button-secondary px-4 py-2 rounded-lg"
>
  إلغاء
</button>
```

## 🔧 **التحسينات التقنية:**

### **1. إدارة الحالة:**
- ✅ تحميل بيانات القالب في `templateFormData` عند التعديل
- ✅ إعادة تعيين البيانات عند الإغلاق
- ✅ تنظيف الحالة بعد الحفظ الناجح

### **2. دعم العمليات المزدوجة:**
- ✅ دعم إنشاء قالب جديد
- ✅ دعم تعديل قالب موجود
- ✅ رسائل مختلفة حسب نوع العملية

### **3. تجربة المستخدم:**
- ✅ تحميل فوري للبيانات عند التعديل
- ✅ تنظيف البيانات عند الإغلاق
- ✅ رسائل واضحة للنجاح والفشل

## 📁 **الملفات المُحدثة:**

### **`src/components/admin/EmailNotificationsManagement.tsx`:**
- ✅ تحديث `handleUpdateTemplate` لتحميل البيانات
- ✅ تحديث `handleSaveTemplate` لدعم التعديل والإنشاء
- ✅ إضافة إعادة تعيين البيانات عند الإغلاق
- ✅ تحسين رسائل النجاح والفشل

## 🚀 **النتائج المتوقعة:**

### **1. تعديل القوالب:**
- ✅ تحميل فوري لبيانات القالب في الحقول
- ✅ إمكانية تعديل البيانات
- ✅ حفظ التعديلات بنجاح
- ✅ تحديث القائمة بعد التعديل

### **2. إنشاء القوالب:**
- ✅ فتح نافذة فارغة للقوالب الجديدة
- ✅ إمكانية إدخال البيانات الجديدة
- ✅ حفظ القالب الجديد بنجاح
- ✅ ظهور القالب الجديد في القائمة

### **3. إدارة الحالة:**
- ✅ تنظيف البيانات عند الإغلاق
- ✅ عدم تداخل البيانات بين العمليات
- ✅ حالة واضحة لكل عملية

## 🧪 **اختبار النظام:**

### **1. اختبار التعديل:**
1. ✅ الضغط على زر تعديل أي قالب
2. ✅ التحقق من تحميل البيانات في الحقول
3. ✅ تعديل بعض البيانات
4. ✅ الضغط على حفظ والتحقق من النجاح
5. ✅ التحقق من تحديث البيانات في القائمة

### **2. اختبار الإنشاء:**
1. ✅ الضغط على "إضافة قالب جديد"
2. ✅ التحقق من فتح نافذة فارغة
3. ✅ ملء البيانات الجديدة
4. ✅ الضغط على حفظ والتحقق من النجاح
5. ✅ التحقق من ظهور القالب الجديد في القائمة

### **3. اختبار الإغلاق:**
1. ✅ فتح نافذة تعديل أو إنشاء
2. ✅ الضغط على زر الإغلاق (X)
3. ✅ التحقق من تنظيف البيانات
4. ✅ فتح نافذة جديدة والتأكد من عدم وجود بيانات قديمة

## ⚠️ **ملاحظات مهمة:**

### **1. البيانات المطلوبة:**
- يتم التحقق من صحة البيانات قبل الحفظ
- الحقول المطلوبة يجب أن تكون مملوءة
- رسائل خطأ واضحة عند عدم اكتمال البيانات

### **2. العمليات المختلفة:**
- **إنشاء:** إضافة `created_at` و `updated_at`
- **تعديل:** إضافة `updated_at` فقط
- **رسائل مختلفة:** "إنشاء" مقابل "تحديث"

### **3. تنظيف الحالة:**
- إعادة تعيين `editingTemplate` إلى `null`
- إعادة تعيين `templateFormData` إلى القيم الافتراضية
- إغلاق النافذة المنبثقة

## 🎯 **الخلاصة:**

تم إصلاح مشكلة تعديل القوالب بنجاح:

1. **✅ تحميل البيانات:** يتم تحميل بيانات القالب في الحقول عند التعديل
2. **✅ دعم العمليات المزدوجة:** دعم إنشاء وتعديل القوالب
3. **✅ إدارة الحالة:** تنظيف البيانات عند الإغلاق والحفظ
4. **✅ تجربة مستخدم محسنة:** تحميل فوري ورسائل واضحة

النظام الآن يعمل بشكل صحيح لكل من إنشاء وتعديل القوالب!







