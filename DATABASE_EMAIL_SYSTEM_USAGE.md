# دليل استخدام نظام الإيميلات المتصل بقاعدة البيانات

## 📋 نظرة عامة

تم إنشاء نظام جديد لإرسال الإيميلات يستخدم القوالب من قاعدة البيانات بدلاً من القوالب المدمجة في الكود. هذا يوفر مرونة كاملة في التحكم في القوالب من لوحة الإدارة.

## 🔧 الخدمات الجديدة

### 1. UnifiedDatabaseEmailService
الخدمة الرئيسية الموحدة لإرسال الإيميلات باستخدام قاعدة البيانات.

```typescript
import { UnifiedDatabaseEmailService } from './unifiedDatabaseEmailService';

// إرسال إيميل باستخدام قالب من قاعدة البيانات
const result = await UnifiedDatabaseEmailService.sendEmail(
  'template_name',           // اسم القالب في قاعدة البيانات
  'user@example.com',        // البريد الإلكتروني للمستقبل
  {                          // البيانات الديناميكية
    userName: 'أحمد محمد',
    timestamp: new Date().toLocaleString('ar-SA')
  },
  'ar'                       // اللغة (ar أو en)
);
```

### 2. NotificationEmailServiceDatabase
خدمة الإشعارات الاجتماعية المتصلة بقاعدة البيانات.

```typescript
import { NotificationEmailServiceDatabase } from './notificationEmailServiceDatabase';

// إرسال إشعار إعجاب
await NotificationEmailServiceDatabase.sendLikeNotification(
  'user@example.com',
  'أحمد محمد',
  'فاطمة علي',
  'الرياض',
  25
);

// إرسال إشعار رسالة جديدة
await NotificationEmailServiceDatabase.sendNewMessageNotification(
  'user@example.com',
  'سارة أحمد',
  'محمد خالد',
  'جدة',
  28,
  'السلام عليكم، كيف حالك؟'
);

// إرسال إشعار مطابقة جديدة
await NotificationEmailServiceDatabase.sendMatchNotification(
  'user@example.com',
  'نور الدين',
  'ريم السعد',
  'الدمام',
  26
);
```

### 3. AuthEmailServiceDatabase
خدمة إيميلات المصادقة المتصلة بقاعدة البيانات.

```typescript
import { AuthEmailServiceDatabase } from './authEmailServiceDatabase';

// إرسال كلمة المرور المؤقتة
await AuthEmailServiceDatabase.sendTemporaryPassword(
  'user@example.com',
  'أحمد محمد',
  'TempPass123!',
  new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('ar-SA')
);

// إرسال رمز التحقق الثنائي
await AuthEmailServiceDatabase.sendTwoFactorCode(
  'user@example.com',
  'أحمد محمد',
  '123456',
  'login'
);

// إرسال إشعار نجاح تسجيل الدخول
await AuthEmailServiceDatabase.sendSuccessfulLoginNotification(
  'user@example.com',
  'أحمد محمد',
  {
    timestamp: new Date().toLocaleString('ar-SA'),
    ipAddress: '192.168.1.1',
    location: 'الرياض',
    device: 'Chrome on Windows',
    browser: 'Chrome 120'
  }
);
```

## 🔄 كيفية التحديث من النظام القديم

### الخطوة 1: استبدال الاستيرادات

**قبل:**
```typescript
import { notificationEmailService } from './notificationEmailService';
import { temporaryPasswordService } from './temporaryPasswordService';
```

**بعد:**
```typescript
import { NotificationEmailServiceDatabase } from './notificationEmailServiceDatabase';
import { AuthEmailServiceDatabase } from './authEmailServiceDatabase';
```

### الخطوة 2: تحديث استدعاءات الدوال

**قبل:**
```typescript
// إرسال إشعار إعجاب
await notificationEmailService.sendLikeNotification(
  userEmail,
  userName,
  likerName,
  likerCity,
  likerAge
);
```

**بعد:**
```typescript
// إرسال إشعار إعجاب
await NotificationEmailServiceDatabase.sendLikeNotification(
  userEmail,
  userName,
  likerName,
  likerCity,
  likerAge
);
```

### الخطوة 3: تحديث معالجة النتائج

**قبل:**
```typescript
const success = await notificationEmailService.sendLikeNotification(...);
if (success) {
  console.log('تم إرسال الإشعار');
}
```

**بعد:**
```typescript
const result = await NotificationEmailServiceDatabase.sendLikeNotification(...);
if (result.success) {
  console.log('تم إرسال الإشعار');
} else {
  console.error('فشل في إرسال الإشعار:', result.error);
}
```

## 📊 القوالب المتاحة في قاعدة البيانات

### قوالب المصادقة:
- `temporary_password` - كلمة المرور المؤقتة
- `password_reset_success` - نجاح إعادة تعيين كلمة المرور
- `two_factor_login` - رمز التحقق الثنائي
- `two_factor_enable_notification` - تفعيل المصادقة الثنائية
- `two_factor_disable_notification` - تعطيل المصادقة الثنائية

### قوالب التسجيل:
- `welcome_new_user` - ترحيب بالمستخدمين الجدد

### قوالب الأمان:
- `login_success` - نجاح تسجيل الدخول
- `failed_login_notification` - فشل تسجيل الدخول

### قوالب التواصل:
- `contact_form_message` - رسالة التواصل

### قوالب البلاغات:
- `report_received` - استلام البلاغ
- `report_status_update` - تحديث حالة البلاغ

### قوالب اجتماعية:
- `like_notification` - إشعار الإعجاب
- `new_message_notification` - إشعار الرسالة الجديدة
- `match_notification` - إشعار المطابقة الجديدة

## 🎯 المتغيرات الديناميكية المدعومة

### متغيرات عامة:
- `{{userName}}` - اسم المستخدم
- `{{userEmail}}` - البريد الإلكتروني
- `{{timestamp}}` - الوقت الحالي
- `{{currentYear}}` - السنة الحالية
- `{{platformName}}` - اسم المنصة (رزقي/Rezge)
- `{{supportEmail}}` - بريد الدعم
- `{{contactEmail}}` - بريد التواصل
- `{{baseUrl}}` - رابط الموقع الأساسي

### متغيرات الإعجاب:
- `{{likerName}}` - اسم المعجب
- `{{likerCity}}` - مدينة المعجب
- `{{likerAge}}` - عمر المعجب
- `{{profileUrl}}` - رابط الملف الشخصي

### متغيرات الرسائل:
- `{{senderName}}` - اسم المرسل
- `{{senderCity}}` - مدينة المرسل
- `{{senderAge}}` - عمر المرسل
- `{{messagePreview}}` - معاينة الرسالة
- `{{messagesUrl}}` - رابط الرسائل

### متغيرات المطابقات:
- `{{matchName}}` - اسم المطابقة
- `{{matchCity}}` - مدينة المطابقة
- `{{matchAge}}` - عمر المطابقة

### متغيرات البلاغات:
- `{{reportType}}` - نوع البلاغ
- `{{status}}` - حالة البلاغ
- `{{isAccepted}}` - هل تم قبول البلاغ
- `{{supportUrl}}` - رابط الدعم

## 🔧 الشروط الشرطية المدعومة

```html
{{#if condition}}
المحتوى يظهر فقط إذا كان الشرط صحيح
{{/if}}
```

**مثال:**
```html
{{#if isAccepted}}
تم قبول البلاغ!
{{/if}}

{{#if isRejected}}
تم رفض البلاغ!
{{/if}}
```

## 🧪 اختبار القوالب

```typescript
// اختبار قالب معين
const result = await UnifiedDatabaseEmailService.testTemplate(
  'like_notification',
  'test@example.com',
  {
    userName: 'مستخدم تجريبي',
    likerName: 'معجب تجريبي',
    likerCity: 'الرياض',
    likerAge: 25
  },
  'ar'
);

if (result.success) {
  console.log('تم إرسال الإيميل التجريبي بنجاح');
} else {
  console.error('فشل في إرسال الإيميل التجريبي:', result.error);
}
```

## 📈 إحصائيات القوالب

```typescript
// جلب إحصائيات القوالب
const stats = await UnifiedDatabaseEmailService.getTemplateStats();
console.log('إجمالي القوالب:', stats.totalTemplates);
console.log('القوالب النشطة:', stats.activeTemplates);
console.log('القوالب غير النشطة:', stats.inactiveTemplates);
```

## 🔍 التحقق من وجود القوالب

```typescript
// التحقق من وجود قالب
const exists = await UnifiedDatabaseEmailService.templateExists('like_notification');
if (exists) {
  console.log('القالب موجود');
} else {
  console.log('القالب غير موجود');
}
```

## 🚀 المميزات الجديدة

### 1. التحكم الكامل من لوحة الإدارة
- تعديل القوالب مباشرة
- تغيير المحتوى والألوان
- إضافة/حذف القوالب
- تفعيل/تعطيل القوالب

### 2. دعم متعدد اللغات
- قوالب منفصلة للعربية والإنجليزية
- تبديل تلقائي حسب لغة المستخدم
- دعم RTL للعربية

### 3. معالجة متقدمة للمتغيرات
- استبدال ديناميكي للمتغيرات
- دعم الشروط الشرطية
- معالجة آمنة للبيانات

### 4. تسجيل شامل
- تسجيل جميع الإيميلات المرسلة
- تتبع حالة الإرسال
- تسجيل الأخطاء

### 5. أداء محسن
- تخزين مؤقت للقوالب
- تحميل عند الحاجة
- تقليل حجم الكود

## ⚠️ ملاحظات مهمة

### 1. التوافق مع النظام القديم
- النظام الجديد متوافق مع النظام القديم
- يمكن الانتقال تدريجياً
- لا يؤثر على الوظائف الموجودة

### 2. معالجة الأخطاء
- جميع الدوال ترجع `{ success: boolean, error?: string }`
- معالجة شاملة للأخطاء
- رسائل خطأ واضحة

### 3. الأمان
- التحقق من صحة البيانات المدخلة
- حماية من حقن SQL
- تنظيف القوالب من المحتوى الضار

## 📝 مثال شامل

```typescript
import { NotificationEmailServiceDatabase } from './notificationEmailServiceDatabase';

// مثال شامل لإرسال إشعار إعجاب
async function handleUserLike(likerId: string, likedUserId: string) {
  try {
    // جلب بيانات المستخدمين
    const liker = await getUserData(likerId);
    const likedUser = await getUserData(likedUserId);
    
    // إرسال إشعار الإعجاب
    const result = await NotificationEmailServiceDatabase.sendLikeNotification(
      likedUser.email,
      likedUser.name,
      liker.name,
      liker.city,
      liker.age
    );
    
    if (result.success) {
      console.log('تم إرسال إشعار الإعجاب بنجاح');
      
      // تسجيل النشاط
      await logActivity('like_notification_sent', {
        likerId,
        likedUserId,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('فشل في إرسال إشعار الإعجاب:', result.error);
      
      // تسجيل الخطأ
      await logError('like_notification_failed', {
        likerId,
        likedUserId,
        error: result.error
      });
    }
  } catch (error) {
    console.error('خطأ في معالجة الإعجاب:', error);
  }
}
```

---

**تاريخ الإنشاء:** ${new Date().toLocaleDateString('ar-EG')}  
**الحالة:** جاهز للاستخدام  
**المطور:** مساعد الذكاء الاصطناعي





