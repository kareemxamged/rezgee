# دليل نظام قيود إرسال روابط التحقق

## 📋 نظرة عامة

تم تطبيق نظام شامل لقيود إرسال روابط التحقق في موقع Rezge لضمان الأمان ومنع إساءة الاستخدام. النظام يطبق ثلاثة أنواع من القيود:

### القيود المطبقة:
1. **حد أقصى 4 محاولات متتالية** قبل الانتظار ساعتين
2. **حد أقصى 12 محاولة يومياً** لكل بريد إلكتروني  
3. **حد أدنى 5 دقائق** بين كل محاولة

---

## 🔧 كيفية عمل النظام

### 1. تسجيل المحاولات
كل محاولة إرسال رابط تحقق يتم تسجيلها في جدول `verification_attempts` مع:
- البريد الإلكتروني
- عنوان IP (إن أمكن)
- معلومات المتصفح (User Agent)
- نتيجة المحاولة (نجح/فشل)
- سبب الفشل (إن وجد)
- وقت المحاولة

### 2. فحص القيود
قبل كل محاولة إرسال، يتم فحص:
- عدد المحاولات المتتالية الفاشلة خلال آخر ساعتين
- إجمالي المحاولات خلال آخر 24 ساعة
- الوقت المنقضي منذ آخر محاولة

### 3. تطبيق القيود
إذا تم تجاوز أي من الحدود، يتم منع الإرسال مع عرض:
- سبب المنع
- الوقت المتبقي للمحاولة التالية
- إحصائيات المحاولات

---

## 💻 للمطورين

### استخدام النظام في الكود:

```typescript
import { emailVerificationService } from '../lib/emailVerification';

// فحص القيود قبل الإرسال
const limits = await emailVerificationService.checkVerificationLimits(
  email, 
  ipAddress // اختياري
);

if (!limits.canSend) {
  console.log(`منع الإرسال: ${limits.reason}`);
  console.log(`الانتظار: ${limits.waitTime} دقيقة`);
  return;
}

// إرسال رابط التحقق
const result = await emailVerificationService.createVerificationRequest(
  email,
  userData,
  ipAddress, // اختياري
  userAgent  // اختياري
);

// تسجيل المحاولة يتم تلقائياً داخل createVerificationRequest
```

### الحصول على إحصائيات مستخدم:

```typescript
const stats = await emailVerificationService.getVerificationStats(email);

console.log('إجمالي المحاولات:', stats.totalAttempts);
console.log('محاولات اليوم:', stats.todayAttempts);
console.log('المحاولات الناجحة:', stats.successfulAttempts);
console.log('المحاولات الفاشلة:', stats.failedAttempts);
```

---

## 🎛️ للإدارة

### الوصول لواجهة الإدارة:
```typescript
import VerificationAttemptsAdmin from '../components/VerificationAttemptsAdmin';

// استخدام المكون في صفحة إدارية
<VerificationAttemptsAdmin />
```

### الوظائف الإدارية المتاحة:

#### 1. مراقبة المحاولات:
- عرض جميع المحاولات مع الفلاتر
- تفاصيل كل محاولة (IP، المتصفح، الخطأ)
- إحصائيات لكل مستخدم

#### 2. إدارة المستخدمين:
```typescript
// إعادة تعيين محاولات مستخدم
const result = await emailVerificationService.resetUserAttempts(email);
if (result.success) {
  console.log('تم إعادة التعيين بنجاح');
}
```

#### 3. تنظيف البيانات:
```typescript
// حذف المحاولات الأقدم من 30 يوم
await emailVerificationService.cleanupOldAttempts();
```

---

## 👤 للمستخدمين

### عرض إحصائيات التحقق:
```typescript
import VerificationStatus from '../components/VerificationStatus';

// استخدام المكون لعرض إحصائيات المستخدم
<VerificationStatus 
  email={userEmail}
  onStatsUpdate={(stats) => {
    // معالجة تحديث الإحصائيات
  }}
/>
```

### فهم رسائل النظام:

#### رسائل المنع:
- **"تم الوصول للحد الأقصى من المحاولات المتتالية"**: 4 محاولات فاشلة متتالية
- **"تم الوصول للحد الأقصى اليومي"**: 12 محاولة في يوم واحد
- **"يرجى الانتظار X دقيقة"**: لم تمر 5 دقائق من آخر محاولة

#### معلومات الإحصائيات:
- **محاولات اليوم**: X/12 (العدد الحالي من أصل الحد الأقصى)
- **إجمالي المحاولات**: جميع المحاولات منذ البداية
- **المحاولات الناجحة/الفاشلة**: تصنيف النتائج

---

## 🧪 الاختبار

### تشغيل الاختبارات:
```typescript
import verificationTests from '../tests/verificationLimits.test';

// تشغيل جميع الاختبارات
const results = await verificationTests.runAllTests();
console.log(`نجح ${results.passed} من أصل ${results.total} اختبار`);

// تشغيل اختبار محدد
const consecutiveTest = await verificationTests.testConsecutiveLimit();
console.log('اختبار القيد المتتالي:', consecutiveTest ? 'نجح' : 'فشل');
```

### سيناريوهات الاختبار:
1. **اختبار القيد المتتالي**: 4 محاولات فاشلة → منع لساعتين
2. **اختبار القيد اليومي**: 12 محاولة → منع لليوم التالي
3. **اختبار التسجيل**: التأكد من تسجيل جميع المحاولات
4. **اختبار الإحصائيات**: صحة حساب الأرقام

---

## 🔍 استكشاف الأخطاء

### مشاكل شائعة وحلولها:

#### 1. "لا يمكن إرسال رابط التحقق"
**السبب المحتمل**: تجاوز أحد القيود
**الحل**: 
- تحقق من إحصائيات المستخدم
- انتظر الوقت المحدد
- للإدارة: إعادة تعيين محاولات المستخدم

#### 2. "الإحصائيات غير صحيحة"
**السبب المحتمل**: مشكلة في قاعدة البيانات
**الحل**:
- تحقق من اتصال قاعدة البيانات
- تشغيل اختبارات النظام
- مراجعة سجلات الأخطاء

#### 3. "بطء في الاستجابة"
**السبب المحتمل**: كثرة البيانات في جدول المحاولات
**الحل**:
- تشغيل تنظيف البيانات القديمة
- فحص الفهارس في قاعدة البيانات
- مراقبة أداء الاستعلامات

---

## 📊 قاعدة البيانات

### جدول verification_attempts:
```sql
CREATE TABLE verification_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  attempt_type VARCHAR(50) DEFAULT 'email_verification',
  success BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### الفهارس المحسنة:
- `idx_verification_attempts_email` - للبحث بالبريد الإلكتروني
- `idx_verification_attempts_created_at` - للبحث بالتاريخ
- `idx_verification_attempts_email_created` - للبحث المركب
- `idx_verification_attempts_ip_created` - لمراقبة IP

---

## 🚀 التطوير المستقبلي

### تحسينات مقترحة:
1. **نظام تنبيهات**: إشعارات للإدارة عند محاولات مشبوهة
2. **تقارير تحليلية**: رسوم بيانية لاستخدام النظام
3. **API خارجي**: واجهة برمجية للتكامل مع أنظمة أخرى
4. **ذكاء اصطناعي**: كشف أنماط الاستخدام المشبوهة

### صيانة دورية:
- تنظيف البيانات القديمة شهرياً
- مراجعة الفهارس وتحسين الأداء
- تحديث حدود النظام حسب الحاجة
- مراقبة استخدام قاعدة البيانات

---

## 📞 الدعم

للحصول على المساعدة أو الإبلاغ عن مشاكل:
1. مراجعة هذا الدليل أولاً
2. تشغيل اختبارات النظام
3. فحص سجلات الأخطاء
4. التواصل مع فريق التطوير

**ملاحظة**: هذا النظام مصمم لضمان الأمان وتحسين تجربة المستخدم. جميع القيود قابلة للتعديل حسب احتياجات الموقع.
