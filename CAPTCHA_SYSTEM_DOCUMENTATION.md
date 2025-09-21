# 🛡️ نظام CAPTCHA المخصص - رزقي

## 📋 نظرة عامة

تم تطوير نظام CAPTCHA مخصص بسيط لحماية منصة رزقي من الروبوتات والهجمات الآلية. النظام يعتمد على المسائل الرياضية ولا يحتاج لأي خدمات خارجية.

## ✅ الحالة الحالية

### 🔧 **التحديث الأخير:**
- **تم استبدال Google reCAPTCHA** بنظام CAPTCHA مخصص
- **السبب**: تجنب التعقيدات والاعتماد على خدمات خارجية
- **الحل**: نظام رياضي بسيط وفعال

### 🎯 **الصفحات المدعومة:**
- ✅ **صفحة تسجيل الدخول** (`/login`)
- ✅ **صفحة إنشاء الحساب** (`/register`)
- ✅ **صفحة نسيت كلمة المرور** (`/forgot-password`)
- ✅ **صفحة الاتصال** (`/contact`)
- ✅ **صفحة الأمان والخصوصية** (`/security`) - تغيير البريد الإلكتروني ورقم الهاتف وكلمة المرور

### 🔧 **المميزات:**
- 🔒 **حماية بسيطة وفعالة** من الروبوتات الأساسية
- 🧮 **مسائل رياضية متنوعة** (جمع، طرح، ضرب)
- 🧠 **نظام ثقة ذكي** - يتذكر المستخدمين الموثوقين
- 🚀 **تخطي تلقائي للـ CAPTCHA** للمستخدمين الموثوقين
- 📊 **نظام نقاط الثقة** يحسب مصداقية المستخدم
- 🌐 **دعم متعدد اللغات** (العربية والإنجليزية)
- 📱 **تصميم متجاوب** يعمل على جميع الأجهزة
- ⚡ **أداء سريع** بدون اعتماد على خدمات خارجية
- 🎨 **واجهة مستخدم أنيقة** مع رسائل واضحة
- 🔄 **إعادة تحديث فورية** للمسائل عند الفشل
- ⏰ **انتهاء صلاحية تلقائي** للتحديات (5 دقائق)
- 💾 **ذاكرة محلية** لحفظ معلومات الثقة

## 🧠 نظام الثقة الذكي

### 📊 **كيف يعمل نظام الثقة:**
1. **المستخدم الجديد**: يحتاج للتحقق من CAPTCHA في كل مرة
2. **بناء الثقة**: بعد 3 محاولات ناجحة، يبدأ بناء الثقة
3. **المستخدم الموثوق**: عند الوصول لـ 80% نقاط ثقة، يتم تخطي CAPTCHA تلقائياً
4. **انتهاء الثقة**: تنتهي الثقة بعد 24 ساعة من عدم النشاط

### ⚙️ **إعدادات نظام الثقة:**
- **مدة الثقة**: 24 ساعة (قابلة للتخصيص)
- **الحد الأدنى للمحاولات الناجحة**: 3 محاولات
- **الحد الأقصى للمحاولات الفاشلة**: محاولتان
- **نقاط الثقة المطلوبة**: 80%
- **تخطي CAPTCHA**: مفعل للمستخدمين الموثوقين

### 🔢 **حساب نقاط الثقة:**
```
نقاط الثقة = (المحاولات الناجحة ÷ إجمالي المحاولات) × مكافأة التكرار × عقوبة الفشل × عامل الوقت
```

- **مكافأة التكرار**: مكافأة للمستخدمين ذوي المحاولات الناجحة الكثيرة
- **عقوبة الفشل**: تقليل النقاط عند تجاوز الحد المسموح للفشل
- **عامل الوقت**: المستخدمين الجدد يحصلون على نقاط أقل

## 🏗️ مكونات النظام

### 📁 **الملفات الأساسية:**

#### 1. **خدمة CAPTCHA** (`src/lib/captchaService.ts`)
```typescript
export class CaptchaService {
  // تحميل وتنفيذ Google reCAPTCHA v3
  // التحقق من التوكن
  // إدارة الإعدادات والإحصائيات
}

export type CaptchaAction = 
  | 'login' 
  | 'register' 
  | 'forgot_password' 
  | 'contact_form' 
  | 'password_reset'
  | 'email_change'
  | 'profile_update';
```

#### 2. **مكون CAPTCHA** (`src/components/CaptchaComponent.tsx`)
```typescript
interface CaptchaComponentProps {
  action: CaptchaAction;
  onVerify: (result: CaptchaVerificationResult) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  size?: 'small' | 'normal' | 'large';
  theme?: 'light' | 'dark' | 'auto';
  showScore?: boolean;
  autoExecute?: boolean;
}
```

### 🔧 **الإعدادات المطلوبة:**

#### متغيرات البيئة (`.env.local`):
```env
# Google reCAPTCHA Configuration
VITE_RECAPTCHA_SITE_KEY=6LfYourSiteKeyHere
VITE_RECAPTCHA_SECRET_KEY=6LfYourSecretKeyHere
VITE_RECAPTCHA_MIN_SCORE=0.5
VITE_RECAPTCHA_ENABLED=true
```

## 🚀 كيفية الاستخدام

### 1. **في صفحة React:**
```tsx
import CaptchaComponent from './CaptchaComponent';
import CaptchaService, { CaptchaVerificationResult } from '../lib/captchaService';

const [captchaVerified, setCaptchaVerified] = useState(false);

const handleCaptchaVerify = (result: CaptchaVerificationResult) => {
  setCaptchaVerified(result.success);
  if (!result.success) {
    setErrorMessage(result.message || 'فشل التحقق من Captcha');
  }
};

// في JSX:
{CaptchaService.isEnabled() && (
  <CaptchaComponent
    action="login"
    onVerify={handleCaptchaVerify}
    onError={handleCaptchaError}
    disabled={isSubmitting}
    size="normal"
    theme="auto"
  />
)}

// في دالة الإرسال:
if (CaptchaService.isEnabled() && !captchaVerified) {
  setErrorMessage('يجب التحقق من Captcha قبل المتابعة');
  return;
}
```

### 2. **التحقق من التوكن:**
```typescript
const token = await CaptchaService.executeRecaptcha('login');
const result = await CaptchaService.verifyToken(token, 'login', userInfo);

if (result.success) {
  // متابعة العملية
} else {
  // عرض رسالة خطأ
}
```

## 🎨 الميزات المتقدمة

### 🌐 **دعم متعدد اللغات:**
- ترجمات كاملة للعربية والإنجليزية
- تخطيط RTL/LTR تلقائي
- رسائل خطأ مترجمة

### 🎯 **أنواع العمليات المدعومة:**
- `login` - تسجيل الدخول
- `register` - إنشاء حساب جديد
- `forgot_password` - نسيت كلمة المرور
- `contact_form` - نموذج الاتصال
- `password_reset` - إعادة تعيين كلمة المرور
- `email_change` - تغيير البريد الإلكتروني
- `profile_update` - تحديث الملف الشخصي

### 📊 **نظام النقاط:**
- نقاط من 0.0 إلى 1.0
- الحد الأدنى المطلوب: 0.5
- تتبع الإحصائيات والمحاولات

### 🛡️ **الحماية المتقدمة:**
- منع الهجمات الآلية
- تتبع المحاولات المشبوهة
- حدود زمنية للمحاولات
- تسجيل مفصل للأنشطة

## 🧪 الاختبار

### **ملف الاختبار الشامل:**
```bash
# افتح في المتصفح
test-captcha-system.html
```

### **الاختبارات المتاحة:**
- ✅ فحص حالة النظام
- ✅ اختبار جميع الصفحات
- ✅ اختبار مكون CAPTCHA
- ✅ تصدير النتائج
- ✅ سجل الأحداث المفصل

### **اختبار سريع في الكونسول:**
```javascript
// فحص حالة CAPTCHA
console.log('CAPTCHA enabled:', CaptchaService.isEnabled());

// اختبار تنفيذ CAPTCHA
CaptchaService.executeRecaptcha('login')
  .then(token => console.log('Token:', token))
  .catch(error => console.error('Error:', error));
```

## 🔧 استكشاف الأخطاء

### **المشاكل الشائعة:**

#### 1. **CAPTCHA لا يظهر:**
```bash
# تحقق من متغيرات البيئة
echo $VITE_RECAPTCHA_SITE_KEY
echo $VITE_RECAPTCHA_ENABLED

# تحقق من الكونسول للأخطاء
```

#### 2. **خطأ في التحقق:**
```javascript
// تحقق من صحة المفاتيح
CaptchaService.getConfig()

// تحقق من الشبكة
// Developer Tools > Network > فلترة "recaptcha"
```

#### 3. **نقاط منخفضة:**
```javascript
// تحقق من النقاط المطلوبة
console.log('Min Score:', CaptchaService.getConfig().minScore);

// تحقق من إحصائيات المستخدم
CaptchaService.getUserCaptchaStats(userId, 24);
```

## 📈 الإحصائيات والمراقبة

### **إحصائيات متاحة:**
- إجمالي المحاولات
- المحاولات الناجحة/الفاشلة
- متوسط النقاط
- معدل النجاح
- المستخدمين المشبوهين

### **دوال المراقبة:**
```typescript
// إحصائيات المستخدم
await CaptchaService.getUserCaptchaStats(userId, hours);

// فحص المستخدم المشبوه
await CaptchaService.isSuspiciousUser(userId);

// تسجيل محاولة
await CaptchaService.logCaptchaAttempt(attempt);
```

## 🔄 التحديثات المستقبلية

### **المخطط له:**
- [ ] دعم CAPTCHA إضافية (hCaptcha, Turnstile)
- [ ] تحليلات متقدمة بالذكاء الاصطناعي
- [ ] تكامل مع نظام التنبيهات
- [ ] واجهة إدارية لإدارة CAPTCHA
- [ ] تقارير مفصلة للمشرفين

### **التحسينات الممكنة:**
- تحسين أداء التحميل
- دعم CAPTCHA غير مرئية
- تخصيص التصميم أكثر
- دعم المزيد من اللغات

## 📞 الدعم

### **في حالة المشاكل:**
1. تحقق من ملف `test-captcha-system.html`
2. راجع الكونسول للأخطاء
3. تأكد من صحة متغيرات البيئة
4. اختبر الاتصال بـ Google reCAPTCHA

### **الملفات المرجعية:**
- `src/lib/captchaService.ts` - الخدمة الأساسية
- `src/components/CaptchaComponent.tsx` - المكون الرئيسي
- `src/locales/ar.json` - الترجمات العربية
- `src/locales/en.json` - الترجمات الإنجليزية

---

## 🎉 الخلاصة

تم تطوير نظام CAPTCHA متكامل وآمن لحماية منصة رزقي. النظام جاهز للاستخدام ومتكامل مع جميع الصفحات المهمة. تم حل جميع المشاكل التقنية وإضافة نظام اختبار شامل.

**الحالة:** ✅ **جاهز للإنتاج**
