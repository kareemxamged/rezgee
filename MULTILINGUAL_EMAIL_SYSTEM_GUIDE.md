# دليل نظام الإشعارات البريدية متعدد اللغات (بدون أزرار) - رزقي

## 🌍 نظرة عامة

تم تطوير نظام الإشعارات البريدية ليدعم اللغتين العربية والإنجليزية مع ضبط اتجاه النص تلقائياً حسب اللغة المختارة. تم إزالة جميع الأزرار من الإيميلات لتبسيط التصميم.

## ✨ الميزات الجديدة

### 1. دعم اللغتين
- **العربية (ar)**: النص من اليمين إلى اليسار (RTL)
- **الإنجليزية (en)**: النص من اليسار إلى اليمين (LTR)

### 2. ضبط الاتجاه التلقائي
- **العربية**: `direction: rtl` و `text-align: right`
- **الإنجليزية**: `direction: ltr` و `text-align: left`

### 3. محتوى مترجم بالكامل
- العناوين
- التحيات
- المحتوى الرئيسي
- التحذيرات
- التذييلات

### 4. تصميم مبسط
- إزالة جميع الأزرار من الإيميلات
- تركيز على المحتوى النصي فقط
- تصميم نظيف وواضح

## 📧 أنواع الإيميلات المدعومة

### 1. إيميل الإعجاب 💖

#### العربية:
```javascript
await DirectNotificationEmailService.sendLikeNotificationEmail(
  'user-id-1', // المستخدم المعجب به
  'user-id-2', // المستخدم المعجب
  'ar' // اللغة العربية
);
```

**المحتوى العربي:**
- العنوان: "إعجاب جديد!"
- التحية: "مرحباً [اسم المستخدم]،"
- المحتوى: "قام [اسم المعجب] بالإعجاب بك!"

#### الإنجليزية:
```javascript
await DirectNotificationEmailService.sendLikeNotificationEmail(
  'user-id-1', // المستخدم المعجب به
  'user-id-2', // المستخدم المعجب
  'en' // اللغة الإنجليزية
);
```

**المحتوى الإنجليزي:**
- العنوان: "New Like!"
- التحية: "Hello [اسم المستخدم],"
- المحتوى: "[اسم المعجب] liked your profile!"

### 2. إيميل زيارة الملف الشخصي 👀

#### العربية:
```javascript
await DirectNotificationEmailService.sendProfileViewNotificationEmail(
  'viewed-user-id',
  'viewer-id',
  'ar'
);
```

**المحتوى العربي:**
- العنوان: "زيارة جديدة لملفك الشخصي!"
- المحتوى: "قام [اسم الزائر] بزيارة ملفك الشخصي!"

#### الإنجليزية:
```javascript
await DirectNotificationEmailService.sendProfileViewNotificationEmail(
  'viewed-user-id',
  'viewer-id',
  'en'
);
```

**المحتوى الإنجليزي:**
- العنوان: "New Profile View!"
- المحتوى: "[اسم الزائر] viewed your profile!"

### 3. إيميل الرسالة الجديدة 💬

#### العربية:
```javascript
await DirectNotificationEmailService.sendNewMessageNotificationEmail(
  'receiver-id',
  'sender-id',
  'ar'
);
```

**المحتوى العربي:**
- العنوان: "رسالة جديدة!"
- المحتوى: "لديك رسالة جديدة من [اسم المرسل]"

#### الإنجليزية:
```javascript
await DirectNotificationEmailService.sendNewMessageNotificationEmail(
  'receiver-id',
  'sender-id',
  'en'
);
```

**المحتوى الإنجليزي:**
- العنوان: "New Message!"
- المحتوى: "You have a new message from [اسم المرسل]"

### 4. إيميل البلاغ ⚠️

#### العربية:
```javascript
await DirectNotificationEmailService.sendReportNotificationEmail(
  'reported-user-id',
  'reporter-id',
  'محتوى غير مناسب',
  'ar'
);
```

**المحتوى العربي:**
- العنوان: "تم الإبلاغ عنك"
- المحتوى: "تم الإبلاغ عنك في منصة رزقي"
- التسمية: "نوع البلاغ:"
- التحذير: "سيتم مراجعة البلاغ من قبل فريق الإدارة"

#### الإنجليزية:
```javascript
await DirectNotificationEmailService.sendReportNotificationEmail(
  'reported-user-id',
  'reporter-id',
  'Inappropriate Content',
  'en'
);
```

**المحتوى الإنجليزي:**
- العنوان: "You Have Been Reported"
- المحتوى: "You have been reported on Rezge platform"
- التسمية: "Report Type:"
- التحذير: "The report will be reviewed by the admin team"

### 5. إيميل تحديث حالة البلاغ 📋

#### العربية:
```javascript
await DirectNotificationEmailService.sendReportStatusNotificationEmail(
  'reporter-id',
  'report-id',
  'accepted',
  'تم قبول البلاغ بعد المراجعة',
  'ar'
);
```

**المحتوى العربي:**
- العنوان: "تحديث حالة البلاغ - تم قبول البلاغ"
- المحتوى: "تم قبول البلاغ الذي قدمته في منصة رزقي"
- التسمية: "ملاحظات الإدارة:"
- الشكر: "نشكرك على مساهمتك في الحفاظ على بيئة آمنة"

#### الإنجليزية:
```javascript
await DirectNotificationEmailService.sendReportStatusNotificationEmail(
  'reporter-id',
  'report-id',
  'accepted',
  'Report accepted after review',
  'en'
);
```

**المحتوى الإنجليزي:**
- العنوان: "Report Status Update - Report Accepted"
- المحتوى: "Your report has been accepted on Rezge platform"
- التسمية: "Admin Notes:"
- الشكر: "Thank you for your contribution to maintaining a safe environment"

### 6. إيميل تحديث حالة التوثيق ✅

#### العربية:
```javascript
await DirectNotificationEmailService.sendVerificationStatusNotificationEmail(
  'user-id',
  'approved',
  'تم قبول طلب التوثيق بعد مراجعة المستندات',
  'ar'
);
```

**المحتوى العربي:**
- العنوان: "تحديث حالة التوثيق - تم قبول طلب التوثيق"
- المحتوى: "تم قبول طلب التوثيق لحسابك في منصة رزقي"

#### الإنجليزية:
```javascript
await DirectNotificationEmailService.sendVerificationStatusNotificationEmail(
  'user-id',
  'approved',
  'Verification request approved after document review',
  'en'
);
```

**المحتوى الإنجليزي:**
- العنوان: "Verification Status Update - Verification Approved"
- المحتوى: "Your verification request has been approved for your Rezge account"

### 7. إيميل الحظر/إلغاء الحظر 🚫/✅

#### العربية:
```javascript
await DirectNotificationEmailService.sendBanStatusNotificationEmail(
  'user-id',
  'banned',
  'انتهاك شروط الاستخدام',
  '30 يوم',
  'ar'
);
```

**المحتوى العربي:**
- العنوان: "تحديث حالة الحساب - تم حظر حسابك"
- المحتوى: "تم حظر حسابك في منصة رزقي"
- التسميات: "السبب:" و "مدة الحظر:"

#### الإنجليزية:
```javascript
await DirectNotificationEmailService.sendBanStatusNotificationEmail(
  'user-id',
  'banned',
  'Terms of Service Violation',
  '30 days',
  'en'
);
```

**المحتوى الإنجليزي:**
- العنوان: "Account Status Update - Account Banned"
- المحتوى: "Your account has been banned on Rezge platform"
- التسميات: "Reason:" و "Ban Duration:"

### 8. إيميل التنبيه الإداري 📢

#### العربية:
```javascript
await DirectNotificationEmailService.sendAdminAlertNotificationEmail(
  'user-id',
  'تحديث مهم في المنصة',
  'نود إعلامكم بتحديث جديد في منصة رزقي يتضمن ميزات جديدة لتحسين تجربة المستخدم.',
  'announcement',
  'ar'
);
```

**المحتوى العربي:**
- العنوان: "تنبيه إداري - تحديث مهم في المنصة"

#### الإنجليزية:
```javascript
await DirectNotificationEmailService.sendAdminAlertNotificationEmail(
  'user-id',
  'Important Platform Update',
  'We would like to inform you about a new update on Rezge platform that includes new features to improve user experience.',
  'announcement',
  'en'
);
```

**المحتوى الإنجليزي:**
- العنوان: "Admin Alert - Important Platform Update"

## 🎨 التصميم والاتجاه

### العربية (RTL):
```css
direction: rtl;
text-align: right;
```

### الإنجليزية (LTR):
```css
direction: ltr;
text-align: left;
```

## 🧪 الاختبار

### اختبار اللغة العربية:
```javascript
// في console المتصفح
await runArabicEmailTests();
```

### اختبار اللغة الإنجليزية:
```javascript
// في console المتصفح
await runEnglishEmailTests();
```

### اختبار جميع اللغات:
```javascript
// في console المتصفح
await runMultilingualEmailTests();
```

## 📱 الاستخدام في التطبيق

### تحديد لغة المستخدم:
```javascript
// يمكن تحديد اللغة من إعدادات المستخدم
const userLanguage = user.preferred_language || 'ar';

// أو من إعدادات المتصفح
const browserLanguage = navigator.language.startsWith('ar') ? 'ar' : 'en';
```

### إرسال إيميل باللغة المختارة:
```javascript
// مثال: إرسال إيميل إعجاب باللغة المختارة
await DirectNotificationEmailService.sendLikeNotificationEmail(
  likedUserId,
  likerId,
  userLanguage // 'ar' أو 'en'
);
```

## 🔧 التخصيص

### إضافة لغة جديدة:
1. إضافة اللغة إلى نوع البيانات: `'ar' | 'en' | 'fr'`
2. إضافة المحتوى المترجم في كل دالة
3. إضافة اتجاه النص المناسب

### تخصيص التصميم:
```css
/* للعربية */
.arabic-content {
  direction: rtl;
  text-align: right;
  font-family: 'Tahoma', Arial, sans-serif;
}

/* للإنجليزية */
.english-content {
  direction: ltr;
  text-align: left;
  font-family: 'Arial', sans-serif;
}
```

## 📊 إحصائيات النظام

- **8 أنواع إيميلات** مدعومة
- **16 قالب** (8 عربي + 8 إنجليزي)
- **اتجاه نص تلقائي** حسب اللغة
- **محتوى مترجم بالكامل**
- **تصميم مبسط** بدون أزرار
- **تصميم متسق** عبر جميع الإيميلات

## 🚀 الخطوات التالية

1. **اختبار شامل**: جرب جميع أنواع الإيميلات باللغتين
2. **مراقبة الأداء**: راقب سرعة الإرسال ومعدلات النجاح
3. **تجميع الملاحظات**: اجمع ملاحظات المستخدمين حول جودة الترجمة
4. **تحسين مستمر**: حسّن المحتوى والتصميم بناءً على الملاحظات

---

## ✅ ملخص الميزات

1. **دعم اللغتين**: العربية والإنجليزية
2. **اتجاه نص تلقائي**: RTL للعربية، LTR للإنجليزية
3. **محتوى مترجم بالكامل**: جميع النصوص والتحذيرات
4. **تصميم مبسط**: بدون أزرار، تركيز على المحتوى النصي
5. **تصميم متسق**: نفس التصميم مع ضبط الاتجاه
6. **سهولة الاستخدام**: معامل لغة واحد في كل دالة
7. **اختبار شامل**: أدوات اختبار للغتين

النظام الآن جاهز للاستخدام مع دعم كامل للغتين العربية والإنجليزية وتصميم مبسط بدون أزرار! 🎉



