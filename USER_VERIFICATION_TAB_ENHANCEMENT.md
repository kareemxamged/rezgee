# إضافة قسم التوثيق في نافذة تفاصيل المستخدم (21-08-2025)

## 🎯 الهدف من التحسين

إضافة قسم جديد للتوثيق في نافذة "عرض التفاصيل" للمستخدمين في لوحة الإدارة، مع أزرار تحكم متقدمة لإدارة حالة التوثيق.

## ✨ الميزات الجديدة

### 1. **تبويب التوثيق الجديد**
- يظهر فقط للمستخدمين الموثقين أو الذين لديهم طلبات توثيق
- أيقونة خاصة مع مؤشر التوثيق الأخضر للمستخدمين الموثقين
- تصميم متسق مع باقي التبويبات

### 2. **عرض شامل لبيانات التوثيق**
- **معلومات الهوية**: الاسم بالعربية والإنجليزية، تاريخ الميلاد، الجنسية
- **معلومات المستند**: نوع المستند، الرقم، تواريخ الإصدار والانتهاء، جهة الإصدار
- **المستندات المرفقة**: عرض وتحميل الصور (الوجه الأمامي، الخلفي، السيلفي)
- **معلومات المراجعة**: تاريخ المراجعة، ملاحظات الإدارة، أسباب الرفض
- **معلومات الطلب**: تاريخ الإرسال وآخر تحديث

### 3. **أزرار التحكم المتقدمة**
#### للمستخدمين الموثقين:
- **تعليق التوثيق**: إيقاف مؤقت للتوثيق مع إدخال السبب
- **إلغاء التوثيق**: إلغاء نهائي للتوثيق

#### للمستخدمين المعلقين/الملغيين:
- **إعادة تفعيل التوثيق**: استعادة حالة التوثيق

### 4. **عرض وتحميل المستندات**
- **عرض الصور**: فتح الصور في نافذة جديدة للمراجعة
- **تحميل الصور**: تحميل المستندات للأرشفة أو المراجعة
- **معاينة مصغرة**: عرض مصغر للصور في الواجهة

## 🔧 التفاصيل التقنية

### الملفات الجديدة:

#### 1. `src/components/admin/users/UserVerificationTab.tsx`
مكون جديد مخصص لعرض وإدارة بيانات التوثيق:

```typescript
interface UserVerificationTabProps {
  userId: string;
  user: UserType;
}

interface VerificationRequest {
  id: string;
  full_name_arabic: string;
  full_name_english: string;
  birth_date: string;
  nationality: string;
  document_type: string;
  document_number: string;
  // ... باقي الحقول
}
```

**الميزات الرئيسية:**
- جلب بيانات التوثيق من قاعدة البيانات
- عرض حالة التوثيق مع الألوان المناسبة
- أزرار تحكم ديناميكية حسب الحالة
- عرض وتحميل المستندات
- تحديث فوري للحالة بعد العمليات

### الملفات المحدثة:

#### 1. `src/components/admin/users/UserDetailsModal.tsx`
- إضافة تبويب "التوثيق" الجديد
- شرط العرض للمستخدمين الموثقين أو الذين لديهم طلبات
- تحديث نوع التبويبات لتشمل 'verification'
- إضافة imports للأيقونات الجديدة

#### 2. `src/hooks/useRealtimeUpdates.ts`
- إصلاح مشكلة التحديث التلقائي المتكرر
- استخدام `useRef` لتجنب إعادة الاشتراك
- تحسين استقرار الدوال في hooks

## 🎨 التصميم والواجهة

### 1. **حالة التوثيق**
```jsx
<span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
  {getStatusText(status)}
</span>
```

**الألوان حسب الحالة:**
- ✅ **مقبول**: أخضر (`text-green-600 bg-green-100`)
- ❌ **مرفوض**: أحمر (`text-red-600 bg-red-100`)
- ⏸️ **معلق**: برتقالي (`text-orange-600 bg-orange-100`)
- 🚫 **ملغي**: رمادي (`text-gray-600 bg-gray-100`)
- 🔍 **تحت المراجعة**: أزرق (`text-blue-600 bg-blue-100`)
- ⏳ **في الانتظار**: أصفر (`text-yellow-600 bg-yellow-100`)

### 2. **أزرار التحكم**
```jsx
// تعليق التوثيق
<button className="bg-orange-600 text-white rounded-lg hover:bg-orange-700">
  <Pause className="w-4 h-4" />
  تعليق التوثيق
</button>

// إلغاء التوثيق
<button className="bg-red-600 text-white rounded-lg hover:bg-red-700">
  <Ban className="w-4 h-4" />
  إلغاء التوثيق
</button>

// إعادة تفعيل
<button className="bg-green-600 text-white rounded-lg hover:bg-green-700">
  <RotateCcw className="w-4 h-4" />
  إعادة تفعيل التوثيق
</button>
```

### 3. **عرض المستندات**
```jsx
<div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
  <img 
    src={imageUrl} 
    alt="المستند"
    className="w-full h-full object-cover"
  />
</div>
<div className="flex gap-2">
  <button className="bg-blue-600 text-white">
    <Eye className="w-4 h-4" />
    عرض
  </button>
  <button className="bg-gray-600 text-white">
    <Download className="w-4 h-4" />
    تحميل
  </button>
</div>
```

## 🔄 العمليات المدعومة

### 1. **تعليق التوثيق**
```typescript
const handleSuspendVerification = async () => {
  const reason = window.prompt('يرجى إدخال سبب تعليق التوثيق:');
  if (!reason) return;

  // تحديث حالة المستخدم
  await supabase.from('users').update({ verified: false }).eq('id', userId);
  
  // تحديث طلب التوثيق
  await supabase.from('verification_requests').update({
    status: 'suspended',
    admin_notes: `تم تعليق التوثيق: ${reason}`
  }).eq('id', verificationData.id);
};
```

### 2. **إلغاء التوثيق**
```typescript
const handleCancelVerification = async () => {
  const confirmed = window.confirm('هل أنت متأكد من إلغاء توثيق هذا المستخدم؟');
  if (!confirmed) return;

  // تحديث حالة المستخدم والطلب
  await supabase.from('users').update({ verified: false }).eq('id', userId);
  await supabase.from('verification_requests').update({
    status: 'cancelled',
    admin_notes: 'تم إلغاء التوثيق من قبل الإدارة'
  }).eq('id', verificationData.id);
};
```

### 3. **إعادة تفعيل التوثيق**
```typescript
const handleReactivateVerification = async () => {
  // استعادة حالة التوثيق
  await supabase.from('users').update({ verified: true }).eq('id', userId);
  await supabase.from('verification_requests').update({
    status: 'approved',
    admin_notes: 'تم إعادة تفعيل التوثيق من قبل الإدارة'
  }).eq('id', verificationData.id);
};
```

## 🧪 كيفية الاختبار

### 1. **اختبار عرض التبويب**
1. افتح لوحة الإدارة → إدارة المستخدمين
2. اضغط على "عرض التفاصيل" لمستخدم موثق
3. تأكد من ظهور تبويب "التوثيق" مع أيقونة التوثيق الخضراء
4. اضغط على التبويب وتأكد من عرض البيانات

### 2. **اختبار أزرار التحكم**
1. **للمستخدم الموثق**: تأكد من ظهور أزرار "تعليق" و "إلغاء"
2. **اختبر تعليق التوثيق**: أدخل سبب وتأكد من التحديث
3. **اختبر إعادة التفعيل**: تأكد من استعادة الحالة

### 3. **اختبار عرض المستندات**
1. تأكد من عرض الصور المصغرة
2. اختبر زر "عرض" - يجب فتح الصورة في نافذة جديدة
3. اختبر زر "تحميل" - يجب تحميل الصورة

## 📊 الفوائد المحققة

### ✅ للإداريين:
- **عرض شامل** لجميع بيانات التوثيق في مكان واحد
- **تحكم كامل** في حالة التوثيق للمستخدمين
- **مراجعة سهلة** للمستندات المرفقة
- **تتبع تاريخ** العمليات والتغييرات

### ✅ للنظام:
- **تنظيم أفضل** لبيانات التوثيق
- **أمان محسن** مع تأكيدات العمليات
- **تحديث فوري** للحالة في قاعدة البيانات
- **تجربة مستخدم متسقة** مع باقي الواجهة

### ✅ للصيانة:
- **كود منظم** في مكون منفصل
- **إعادة استخدام** سهلة للمكون
- **اختبار مستقل** للوظائف
- **توثيق شامل** للعمليات

---

**تاريخ التطوير:** 21-08-2025  
**حالة التطوير:** ✅ مكتمل ومختبر  
**المطور:** AI Assistant  
**الأولوية:** متوسطة - تحسين تجربة الإدارة
