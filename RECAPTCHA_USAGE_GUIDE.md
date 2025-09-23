# دليل استخدام Google reCAPTCHA في المنصة

## 🚀 البدء السريع

### 1. التحقق من التكوين
تأكد من أن مفاتيح reCAPTCHA صحيحة في الملفات:
- **Site Key**: `6LewINIrAAAAACzqj4aHviy5SlRiV5Q2HaAC0XKP`
- **Secret Key**: `6LewINIrAAAAAFycWJU_h2A-8iIdMpa-axh17_O3`

### 2. الصفحات المدعومة
- ✅ صفحة تسجيل الدخول (`/login`)
- ✅ صفحة إنشاء الحساب (`/register`)
- ✅ صفحة نسيت كلمة المرور (`/forgot-password`)
- ✅ صفحة الاتصال (`/contact`)

## 🔧 كيفية العمل

### 1. آلية التحميل
```typescript
// يتم تحميل reCAPTCHA تلقائياً عند فتح الصفحة
useEffect(() => {
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit&hl=${i18n.language}`;
  document.head.appendChild(script);
}, []);
```

### 2. منطق الاحتياطي
```typescript
// إذا فشل تحميل reCAPTCHA، يتم عرض المكون التقليدي
if (useFallback || recaptchaError) {
  return <CaptchaComponent {...props} />;
}
```

### 3. التحقق على الخادم
```typescript
// يتم التحقق من صحة token على الخادم
const response = await fetch('/api/verify-recaptcha', {
  method: 'POST',
  body: JSON.stringify({ token, action })
});
```

## 🎯 أنواع العمليات

| العملية | الوصف | الصفحة |
|---------|--------|---------|
| `login` | تسجيل الدخول | صفحة تسجيل الدخول |
| `register` | إنشاء حساب جديد | صفحة التسجيل |
| `forgot_password` | نسيت كلمة المرور | صفحة نسيت كلمة المرور |
| `contact` | الاتصال | صفحة الاتصال |

## 🛠️ التخصيص

### 1. تغيير الحجم
```typescript
<RecaptchaComponent
  size="compact" // أو "normal" أو "invisible"
  // ...
/>
```

### 2. تغيير الموضوع
```typescript
<RecaptchaComponent
  theme="dark" // أو "light"
  // ...
/>
```

### 3. تفعيل/إلغاء التفاعل التلقائي
```typescript
<RecaptchaComponent
  autoExecute={true} // أو false
  // ...
/>
```

## 🐛 استكشاف الأخطاء

### 1. reCAPTCHA لا يظهر
**الأسباب المحتملة:**
- مشاكل في الاتصال بالإنترنت
- مفاتيح reCAPTCHA غير صحيحة
- المشروع لا يعمل على HTTPS

**الحل:**
- تحقق من الاتصال بالإنترنت
- تأكد من صحة المفاتيح
- استخدم HTTPS في الإنتاج

### 2. المكون التقليدي يظهر دائماً
**الأسباب المحتملة:**
- فشل تحميل Google reCAPTCHA
- انتهاء مهلة التحميل (10 ثوان)
- خطأ في تهيئة reCAPTCHA

**الحل:**
- تحقق من وحدة تحكم المتصفح للأخطاء
- تأكد من أن المشروع يعمل على HTTPS
- تحقق من إعدادات الجدار الناري

### 3. التحقق يفشل على الخادم
**الأسباب المحتملة:**
- Secret Key غير صحيح
- API endpoint غير متاح
- مشاكل في الشبكة

**الحل:**
- تأكد من صحة Secret Key
- تحقق من توفر `/api/verify-recaptcha`
- تحقق من سجلات الخادم

## 📊 مراقبة الأداء

### 1. سجلات التحميل
```javascript
// في وحدة تحكم المتصفح
console.log('✅ تم تحميل Google reCAPTCHA بنجاح');
console.log('⚠️ انتهت مهلة تحميل reCAPTCHA، استخدام المكون التقليدي');
```

### 2. سجلات التحقق
```javascript
// في وحدة تحكم المتصفح
console.log('✅ تم التحقق من reCAPTCHA:', token);
console.log('⏰ انتهت صلاحية reCAPTCHA');
```

### 3. سجلات الخادم
```javascript
// في سجلات الخادم
console.log('🔍 التحقق من reCAPTCHA token...');
console.log('📊 نتيجة التحقق من reCAPTCHA:', result);
```

## 🔒 الأمان

### 1. حماية المفاتيح
- **Site Key**: آمن للاستخدام في الكود الأمامي
- **Secret Key**: يجب أن يبقى سرياً على الخادم فقط

### 2. التحقق من النتائج
```typescript
// التحقق من النتيجة (عادة يجب أن تكون >= 0.5)
if (score < 0.5) {
  return { success: false, message: 'النتيجة منخفضة جداً' };
}
```

### 3. تسجيل النشاطات
```typescript
// تسجيل محاولات التحقق المشبوهة
console.log('📝 تسجيل نشاط reCAPTCHA:', {
  action,
  success: result.success,
  score: result.score,
  userId: userId || 'anonymous'
});
```

## 🚀 النشر

### 1. متطلبات الإنتاج
- ✅ HTTPS مطلوب لـ reCAPTCHA
- ✅ مفاتيح صحيحة ومفعلة
- ✅ API endpoint متاح على الخادم

### 2. اختبار ما قبل النشر
```bash
# تأكد من أن المشروع يعمل على HTTPS
npm run build
npm run preview -- --https

# اختبر جميع الصفحات
# - صفحة تسجيل الدخول
# - صفحة التسجيل
# - صفحة نسيت كلمة المرور
# - صفحة الاتصال
```

### 3. مراقبة ما بعد النشر
- راقب سجلات reCAPTCHA
- تحقق من معدل نجاح التحقق
- راقب استخدام المكون التقليدي كاحتياطي

## 📞 الدعم

### في حالة المشاكل:
1. تحقق من وحدة تحكم المتصفح للأخطاء
2. تحقق من سجلات الخادم
3. تأكد من صحة مفاتيح reCAPTCHA
4. تحقق من توفر HTTPS

### للمطورين:
- راجع `src/components/RecaptchaComponent.tsx` للتفاصيل التقنية
- راجع `src/lib/recaptchaService.ts` لخدمة التحقق
- راجع `src/api/verify-recaptcha.ts` لـ API endpoint

---

**تاريخ الإنشاء**: 09-08-2025  
**الإصدار**: 1.0  
**الحالة**: جاهز للاستخدام ✅


