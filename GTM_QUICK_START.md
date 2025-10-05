# دليل البدء السريع - Google Tag Manager

## 🎯 نظرة عامة

تم إضافة Google Tag Manager بنجاح إلى منصة رزقي مع المعرف: `GTM-N4TDJCRC`

## ✅ ما تم إنجازه

### 1. إضافة كود GTM إلى الموقع
- ✅ **كود JavaScript**: تم إضافته في `<head>`
- ✅ **كود noscript**: تم إضافته قبل `</body>`
- ✅ **المعرف**: `GTM-N4TDJCRC`

### 2. إنشاء Utilities للـ GTM
- ✅ **الملف**: `src/utils/gtm.ts`
- ✅ **الدوال**: تتبع جميع الأحداث المهمة
- ✅ **التكامل**: مع Google Analytics 4

### 3. تحديث المكونات
- ✅ **LanguageToggle**: تتبع تبديل اللغة
- ✅ **DynamicMetaTags**: تتبع الصفحات

## 🚀 الخطوات التالية

### 1. تسجيل الدخول إلى GTM
**الرابط**: https://tagmanager.google.com/
- استخدم نفس حساب Google Analytics
- اختر Container: `GTM-N4TDJCRC`

### 2. إعداد Tags الأساسية

#### A. Google Analytics 4 Configuration Tag
```javascript
Tag Type: Google Analytics: GA4 Configuration
Measurement ID: G-7QWP1R3BES
Trigger: All Pages
Tag Name: GA4 Configuration
```

#### B. Page View Tag
```javascript
Tag Type: Google Analytics: GA4 Event
Event Name: page_view
Configuration Tag: GA4 Configuration
Trigger: All Pages
Tag Name: GA4 Page View
```

### 3. إعداد Triggers

#### A. All Pages Trigger
```javascript
Trigger Type: Page View
Trigger Name: All Pages
This trigger fires on: All Pages
```

#### B. Custom Event Triggers
```javascript
// Login Event
Trigger Type: Custom Event
Event Name: login
Trigger Name: Login Event

// Sign Up Event
Trigger Type: Custom Event
Event Name: sign_up
Trigger Name: Sign Up Event

// Search Event
Trigger Type: Custom Event
Event Name: search
Trigger Name: Search Event

// Language Change Event
Trigger Type: Custom Event
Event Name: language_change
Trigger Name: Language Change Event
```

### 4. إعداد Variables

#### A. Built-in Variables
- ✅ Page URL
- ✅ Page Title
- ✅ Referrer
- ✅ User Agent

#### B. Custom Variables
```javascript
// Language Variable
Variable Type: Data Layer Variable
Variable Name: Language
Data Layer Variable Name: language

// User Type Variable
Variable Type: Data Layer Variable
Variable Name: User Type
Data Layer Variable Name: user_type
```

## 📊 إعداد Tags خاصة بمنصة رزقي

### 1. Login Event Tag
```javascript
Tag Type: Google Analytics: GA4 Event
Event Name: login
Configuration Tag: GA4 Configuration
Parameters:
  - method: {{DLV - method}}
  - user_type: {{DLV - user_type}}
  - language: {{DLV - language}}
Trigger: Login Event
```

### 2. Sign Up Event Tag
```javascript
Tag Type: Google Analytics: GA4 Event
Event Name: sign_up
Configuration Tag: GA4 Configuration
Parameters:
  - method: {{DLV - method}}
  - user_type: {{DLV - user_type}}
  - language: {{DLV - language}}
Trigger: Sign Up Event
```

### 3. Search Event Tag
```javascript
Tag Type: Google Analytics: GA4 Event
Event Name: search
Configuration Tag: GA4 Configuration
Parameters:
  - search_term: {{DLV - search_term}}
  - search_filters: {{DLV - search_filters}}
  - results_count: {{DLV - results_count}}
Trigger: Search Event
```

### 4. Language Change Event Tag
```javascript
Tag Type: Google Analytics: GA4 Event
Event Name: language_change
Configuration Tag: GA4 Configuration
Parameters:
  - from_language: {{DLV - from_language}}
  - to_language: {{DLV - to_language}}
Trigger: Language Change Event
```

## 🔧 استخدام GTM Utilities

### 1. تتبع تسجيل الدخول
```typescript
import { trackLogin } from '../utils/gtm';

// في مكون تسجيل الدخول
const handleLogin = async (credentials) => {
  try {
    await loginUser(credentials);
    
    // تتبع تسجيل الدخول
    trackLogin('email', 'regular');
    
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 2. تتبع التسجيل
```typescript
import { trackSignUp } from '../utils/gtm';

// في مكون التسجيل
const handleSignUp = async (userData) => {
  try {
    await registerUser(userData);
    
    // تتبع التسجيل
    trackSignUp('email', 'regular');
    
  } catch (error) {
    console.error('Sign up failed:', error);
  }
};
```

### 3. تتبع البحث
```typescript
import { trackSearch } from '../utils/gtm';

// في مكون البحث
const handleSearch = (searchTerm, filters) => {
  const results = performSearch(searchTerm, filters);
  
  // تتبع البحث
  trackSearch(searchTerm, filters, results.length);
  
  return results;
};
```

### 4. تتبع مشاهدة الملف الشخصي
```typescript
import { trackProfileView } from '../utils/gtm';

// في مكون الملف الشخصي
const handleProfileView = (profileId, viewerId) => {
  // تتبع مشاهدة الملف الشخصي
  trackProfileView(profileId, viewerId, 'public');
};
```

### 5. تتبع إرسال الرسالة
```typescript
import { trackMessageSent } from '../utils/gtm';

// في مكون الرسائل
const handleSendMessage = (message, recipientId, conversationId) => {
  // إرسال الرسالة
  sendMessage(message, recipientId, conversationId);
  
  // تتبع إرسال الرسالة
  trackMessageSent('text', recipientId, conversationId);
};
```

### 6. تتبع الإعجاب
```typescript
import { trackLike } from '../utils/gtm';

// في مكون الإعجاب
const handleLike = (profileId, likeType) => {
  // إرسال الإعجاب
  sendLike(profileId, likeType);
  
  // تتبع الإعجاب
  trackLike(profileId, likeType, 'like');
};
```

## 🔍 اختبار GTM

### 1. GTM Preview Mode
1. **الرابط**: https://tagmanager.google.com/
2. **اختر Container**: `GTM-N4TDJCRC`
3. **اضغط "Preview"**
4. **أدخل URL**: `https://rezgee.com`
5. **اضغط "Connect"**

### 2. مراقبة الأحداث
```typescript
import { enableGTMDebug } from '../utils/gtm';

// تفعيل وضع التصحيح
enableGTMDebug();

// مراقبة الأحداث في Console
// ستظهر جميع الأحداث المرسلة إلى GTM
```

### 3. فحص الحالة
```typescript
import { checkGTMStatus } from '../utils/gtm';

// فحص حالة GTM
const status = checkGTMStatus();
console.log('GTM Status:', status);
```

## 📊 مراقبة البيانات

### 1. Google Analytics 4
**الرابط**: https://analytics.google.com/
- **Real-time**: مراقبة الأحداث المباشرة
- **Events**: مراجعة جميع الأحداث
- **Audience**: تحليل الجمهور

### 2. GTM Debug Console
- **Preview Mode**: مراقبة Tags في الوقت الفعلي
- **Console Logs**: مراجعة الأحداث المرسلة
- **Tag Firing**: التحقق من تشغيل Tags

## 🎯 الأحداث المتاحة

### 1. أحداث المستخدم
- `login`: تسجيل الدخول
- `sign_up`: التسجيل
- `language_change`: تبديل اللغة

### 2. أحداث التفاعل
- `search`: البحث
- `view_profile`: مشاهدة الملف الشخصي
- `message_sent`: إرسال الرسالة
- `like`: الإعجاب

### 3. أحداث النظام
- `page_view`: مشاهدة الصفحة
- `error`: الأخطاء
- `performance_metric`: مقاييس الأداء

### 4. أحداث مخصصة
- `conversion`: التحويلات
- `form_interaction`: تفاعل النماذج
- `click`: النقرات
- `scroll`: التمرير

## 📋 قائمة التحقق

### ✅ الإعداد الأساسي:
- [ ] إضافة GTM إلى الموقع
- [ ] إنشاء Container في GTM
- [ ] إعداد GA4 Configuration Tag
- [ ] إعداد Page View Trigger

### ✅ Tags الأساسية:
- [ ] Login Event Tag
- [ ] Sign Up Event Tag
- [ ] Search Event Tag
- [ ] Language Change Tag

### ✅ Variables:
- [ ] Built-in Variables
- [ ] Custom Variables
- [ ] Data Layer Variables

### ✅ Testing:
- [ ] GTM Preview Mode
- [ ] GA4 Real-time Reports
- [ ] Console Debugging
- [ ] Event Verification

## 🚨 نصائح مهمة

### 1. الأمان:
- تأكد من صحة كود GTM
- استخدم HTTPS فقط
- راقب الأحداث المشبوهة

### 2. الأداء:
- لا تفرط في استخدام Tags
- استخدم Triggers المناسبة
- راقب سرعة الموقع

### 3. الخصوصية:
- احترم خصوصية المستخدمين
- استخدم Cookie Consent
- اتبع قوانين GDPR

### 4. الصيانة:
- راقب Tags باستمرار
- حدث GTM بانتظام
- احتفظ بنسخ احتياطية

## 📞 الدعم والمساعدة

### موارد Google:
- [Google Tag Manager Help](https://support.google.com/tagmanager/)
- [GTM Community](https://productforums.google.com/forum/#!forum/tag-manager)
- [GTM YouTube Channel](https://www.youtube.com/user/GoogleTagManager)

### مجتمعات المطورين:
- [GTM Community Forum](https://productforums.google.com/forum/#!forum/tag-manager)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-tag-manager)
- [Reddit GTM](https://www.reddit.com/r/GoogleTagManager/)

---

**تاريخ الإعداد**: 15 يناير 2025  
**الإصدار**: 1.0.0  
**المطور**: فريق تطوير رزقي

## 🎉 نصائح للنجاح

1. **ابدأ بسيط**: لا تفرط في استخدام Tags
2. **اختبر دائماً**: استخدم Preview Mode
3. **راقب الأداء**: تأكد من عدم تأثير GTM على سرعة الموقع
4. **حدث بانتظام**: احتفظ بـ GTM محدث
5. **استخدم البيانات**: اتخذ قرارات مبنية على البيانات
6. **احترم الخصوصية**: اتبع قوانين الخصوصية
7. **وثق كل شيء**: احتفظ بسجل للتغييرات
8. **تعلم باستمرار**: تابع آخر التحديثات
