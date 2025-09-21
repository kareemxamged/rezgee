# تقرير تقني: الحقول المخصصة للجنس في الملف الشخصي

## 📋 نظرة عامة

هذا التقرير يوثق تطبيق وعمل الحقول المخصصة للجنس في صفحة الملف الشخصي لموقع "رزقي" - منصة الزواج الإسلامي. يضمن النظام عرض الحقول المناسبة حسب جنس المستخدم وفقاً للضوابط الشرعية.

## 🎯 الهدف

ضمان عرض الحقول المناسبة فقط حسب جنس المستخدم:
- **للذكور**: عرض حقل "اللحية" وإخفاء حقل "الحجاب"
- **للإناث**: عرض حقل "الحجاب" وإخفاء حقل "اللحية"

## 🏗️ البنية التقنية

### 1. قاعدة البيانات (Supabase)

**جدول users:**
```sql
-- الحقول المخصصة للجنس
beard VARCHAR(50) NULL,        -- للذكور: 'yes', 'no'
hijab VARCHAR(50) NULL,        -- للإناث: 'no_hijab', 'hijab', 'niqab', 'prefer_not_say'
gender VARCHAR(10) NOT NULL    -- 'male', 'female'
```

### 2. مكون React (EnhancedProfilePage.tsx)

**متغير مراقبة الجنس:**
```javascript
const watchedGender = userProfile?.gender || 'male';
```

**Schema التحقق من البيانات:**
```javascript
const enhancedProfileSchema = z.object({
  // الحقول الشرطية - متاحة لكلا الجنسين ولكن تظهر حسب الجنس فقط
  beard: z.enum(['yes', 'no']).optional().or(z.literal('')), // للذكور فقط
  hijab: z.enum(['no_hijab', 'hijab', 'niqab', 'prefer_not_say']).optional().or(z.literal('')), // للإناث فقط
  // ... باقي الحقول
});
```

## 🔧 التطبيق العملي

### 1. عرض حقل اللحية (للذكور فقط)

```jsx
{/* اللحية - للذكور فقط */}
{watchedGender === 'male' && (
  <div>
    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
      اللحية
    </label>
    <select
      {...register('beard')}
      disabled={!isEditing}
      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
    >
      <option value="">اختر...</option>
      <option value="yes">نعم</option>
      <option value="no">لا</option>
    </select>
    {errors.beard && (
      <p className="text-red-500 text-sm mt-1">{errors.beard.message}</p>
    )}
  </div>
)}
```

### 2. عرض حقل الحجاب (للإناث فقط)

```jsx
{/* الحجاب - للإناث فقط */}
{watchedGender === 'female' && (
  <div>
    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
      الحجاب
    </label>
    <select
      {...register('hijab')}
      disabled={!isEditing}
      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
    >
      <option value="">اختر...</option>
      {hijabOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {errors.hijab && (
      <p className="text-red-500 text-sm mt-1">{errors.hijab.message}</p>
    )}
  </div>
)}
```

### 3. خيارات الحقول

**خيارات اللحية:**
```javascript
// مدمجة مباشرة في JSX
<option value="yes">نعم</option>
<option value="no">لا</option>
```

**خيارات الحجاب:**
```javascript
const hijabOptions = [
  { value: 'no_hijab', label: 'غير محجبة' },
  { value: 'hijab', label: 'محجبة' },
  { value: 'niqab', label: 'منتقبة' },
  { value: 'prefer_not_say', label: 'أفضل أن لا أقول' }
];
```

## ✅ التحقق من صحة البيانات

### منطق التحقق المخصص

```javascript
const hasGenderSpecificErrors = () => {
  if (watchedGender === 'male') {
    // للذكور: تجاهل أخطاء حقل الحجاب
    const filteredErrors = Object.keys(errors).filter(key => key !== 'hijab');
    return filteredErrors.length > 0;
  } else {
    // للإناث: تجاهل أخطاء حقل اللحية
    const filteredErrors = Object.keys(errors).filter(key => key !== 'beard');
    return filteredErrors.length > 0;
  }
};

const isFormValid = () => {
  return !hasGenderSpecificErrors() && isPhoneValid;
};
```

### معالجة الأخطاء

```javascript
const onError = (errors: any) => {
  console.log('❌ Form validation errors:', errors);
  console.log('👤 Current gender:', watchedGender);
  
  // تفصيل الأخطاء حسب الجنس
  if (watchedGender === 'male' && errors.hijab) {
    console.log('⚠️ Hijab error for male user (should be ignored):', errors.hijab);
  }
  if (watchedGender === 'female' && errors.beard) {
    console.log('⚠️ Beard error for female user (should be ignored):', errors.beard);
  }
};
```

## 📊 بيانات الاختبار

### مستخدم ذكر
```json
{
  "email": "kemooamegoo@gmail.com",
  "first_name": "KARIM",
  "gender": "male",
  "beard": "yes",
  "hijab": null
}
```

### مستخدمة أنثى
```json
{
  "email": "fatima.mohammed@test.com",
  "first_name": "فاطمة",
  "gender": "female",
  "hijab": "hijab",
  "beard": null
}
```

## 🧪 الاختبارات

### 1. اختبار العرض الشرطي
- ✅ حقل اللحية يظهر للذكور فقط
- ✅ حقل الحجاب يظهر للإناث فقط
- ✅ الحقول غير المناسبة مخفية تماماً (ليس CSS فقط)

### 2. اختبار التحقق من البيانات
- ✅ أخطاء الحقول المخفية يتم تجاهلها
- ✅ التحقق يعمل بشكل صحيح للحقول المرئية
- ✅ النموذج يُعتبر صحيحاً عند تجاهل الأخطاء غير المناسبة

### 3. اختبار حفظ البيانات
- ✅ البيانات تُحفظ في الحقول الصحيحة في قاعدة البيانات
- ✅ البيانات تظهر بشكل صحيح عند إعادة تحميل الصفحة
- ✅ لا توجد أخطاء أثناء عملية الحفظ

## 🔒 الضوابط الشرعية

### 1. الفصل بين الجنسين
- الحقول المخصصة للذكور لا تظهر للإناث
- الحقول المخصصة للإناث لا تظهر للذكور
- منع الخلط أو الالتباس في المعلومات الشخصية

### 2. الخصوصية والاحترام
- خيارات "أفضل أن لا أقول" متاحة للحقول الحساسة
- عدم إجبار المستخدم على الإفصاح عن معلومات شخصية
- احترام الخصوصية الشخصية والدينية

## 📁 الملفات ذات الصلة

### 1. الملفات الأساسية
- `src/components/EnhancedProfilePage.tsx` - صفحة الملف الشخصي
- `src/lib/supabase.ts` - خدمات قاعدة البيانات
- `src/contexts/AuthContext.tsx` - سياق المصادقة

### 2. ملفات الاختبار
- `test-profile-gender-fields.html` - دليل اختبار شامل
- `GENDER_SPECIFIC_FIELDS_REPORT.md` - هذا التقرير

### 3. قاعدة البيانات
- جدول `users` في Supabase مع حقلي `beard` و `hijab`

## 🎯 النتائج والتوصيات

### النتائج المحققة
1. ✅ **عرض شرطي صحيح**: الحقول تظهر حسب الجنس فقط
2. ✅ **تحقق ذكي**: يتجاهل أخطاء الحقول غير المناسبة
3. ✅ **حفظ آمن**: البيانات تُحفظ في الحقول الصحيحة
4. ✅ **تجربة مستخدم سلسة**: لا توجد أخطاء أو التباس

### التوصيات للمستقبل
1. **إضافة المزيد من الحقول المخصصة**: حسب الحاجة والمتطلبات الشرعية
2. **تحسين واجهة المستخدم**: إضافة أيقونات أو ألوان مميزة للحقول المخصصة
3. **إضافة تلميحات**: شرح أهمية هذه الحقول في التطابق الشرعي
4. **اختبارات تلقائية**: إضافة اختبارات وحدة للتأكد من استمرار عمل الميزة

## 📈 الأثر على التطابق

هذه الحقول المخصصة تساهم في:
- **تحسين دقة التطابق**: معلومات أكثر تفصيلاً للمطابقة
- **الالتزام الشرعي**: ضمان التوافق في الجوانب الدينية المهمة
- **تجربة مستخدم أفضل**: معلومات واضحة ومناسبة لكل جنس
- **ثقة المستخدمين**: نظام يحترم الخصوصية والضوابط الشرعية

---

**تاريخ التقرير:** 2025-07-21  
**الحالة:** مكتمل وجاهز للاستخدام  
**المطور:** Augment Agent  
**المراجعة:** تمت مراجعة الكود والاختبار بنجاح
