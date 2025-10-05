# دليل إعداد Google Tag Manager - منصة رزقي

## 🎯 نظرة عامة

تم إضافة Google Tag Manager (GTM) بنجاح إلى منصة رزقي مع المعرف: `GTM-N4TDJCRC`

## 📋 ما تم إنجازه

### 1. إضافة كود GTM إلى الموقع
- ✅ **كود JavaScript**: تم إضافته في `<head>`
- ✅ **كود noscript**: تم إضافته قبل `</body>`
- ✅ **المعرف**: `GTM-N4TDJCRC`

### 2. الملفات المحدثة
- **index.html**: تم إضافة كود GTM

## 🔧 إعداد Google Tag Manager

### 1. تسجيل الدخول
**الرابط**: https://tagmanager.google.com/
**الحساب**: استخدم نفس حساب Google Analytics

### 2. إنشاء Container جديد
- **Container Name**: `rezgee-website`
- **Target Platform**: `Web`
- **Container ID**: `GTM-N4TDJCRC`

### 3. إعداد Tags الأساسية

#### A. Google Analytics 4 Tag
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Configuration
Measurement ID: G-7QWP1R3BES
Trigger: All Pages
```

#### B. Google Analytics 4 Event Tag
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Configuration Tag: GA4 Configuration
Event Name: {{Event}}
Trigger: Custom Event
```

### 4. إعداد Triggers

#### A. Page View Trigger
```javascript
// Trigger Configuration
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
```

### 5. إعداد Variables

#### A. Built-in Variables
- **Page URL**: `{{Page URL}}`
- **Page Title**: `{{Page Title}}`
- **Referrer**: `{{Referrer}}`
- **User Agent**: `{{User Agent}}`

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

## 📊 إعداد Tags المتقدمة

### 1. Enhanced Ecommerce Tracking

#### A. Purchase Event
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: purchase
Parameters:
  - transaction_id: {{Transaction ID}}
  - value: {{Purchase Value}}
  - currency: {{Currency}}
  - items: {{Items}}
```

#### B. Add to Cart Event
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: add_to_cart
Parameters:
  - currency: {{Currency}}
  - value: {{Item Value}}
  - items: {{Items}}
```

### 2. User Engagement Tracking

#### A. Scroll Depth
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: scroll
Parameters:
  - scroll_depth: {{Scroll Depth}}
  - page_location: {{Page URL}}
```

#### B. Time on Page
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: timing_complete
Parameters:
  - name: {{Timing Name}}
  - value: {{Timing Value}}
```

### 3. Form Tracking

#### A. Form Submit
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: form_submit
Parameters:
  - form_id: {{Form ID}}
  - form_name: {{Form Name}}
```

#### B. Form Start
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: form_start
Parameters:
  - form_id: {{Form ID}}
  - form_name: {{Form Name}}
```

## 🎯 إعداد Tags خاصة بمنصة رزقي

### 1. User Registration Tracking
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: sign_up
Parameters:
  - method: {{Registration Method}}
  - user_type: {{User Type}}
  - language: {{Language}}
```

### 2. Profile View Tracking
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: view_profile
Parameters:
  - profile_id: {{Profile ID}}
  - viewer_id: {{Viewer ID}}
  - profile_type: {{Profile Type}}
```

### 3. Message Sent Tracking
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: message_sent
Parameters:
  - message_type: {{Message Type}}
  - recipient_id: {{Recipient ID}}
  - conversation_id: {{Conversation ID}}
```

### 4. Search Tracking
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: search
Parameters:
  - search_term: {{Search Term}}
  - search_filters: {{Search Filters}}
  - results_count: {{Results Count}}
```

### 5. Like/Interest Tracking
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: like
Parameters:
  - profile_id: {{Profile ID}}
  - like_type: {{Like Type}}
  - action: {{Action}}
```

## 🔧 إعداد Data Layer

### 1. إضافة Data Layer إلى الموقع
```javascript
// في src/main.tsx أو App.tsx
window.dataLayer = window.dataLayer || [];

// دالة لإرسال الأحداث
function gtmPush(event) {
  window.dataLayer.push(event);
}

// مثال على الاستخدام
gtmPush({
  event: 'sign_up',
  method: 'email',
  user_type: 'regular',
  language: 'ar'
});
```

### 2. أحداث Data Layer المخصصة
```javascript
// تسجيل الدخول
gtmPush({
  event: 'login',
  method: 'email',
  user_type: 'regular',
  language: 'ar'
});

// التسجيل
gtmPush({
  event: 'sign_up',
  method: 'email',
  user_type: 'regular',
  language: 'ar'
});

// البحث
gtmPush({
  event: 'search',
  search_term: 'user_search_term',
  search_filters: 'age,location',
  results_count: 25
});

// مشاهدة الملف الشخصي
gtmPush({
  event: 'view_profile',
  profile_id: 'user_id',
  viewer_id: 'current_user_id',
  profile_type: 'public'
});

// إرسال رسالة
gtmPush({
  event: 'message_sent',
  message_type: 'text',
  recipient_id: 'recipient_id',
  conversation_id: 'conversation_id'
});

// إعجاب
gtmPush({
  event: 'like',
  profile_id: 'liked_user_id',
  like_type: 'like',
  action: 'like'
});
```

## 📊 إعداد Custom Dimensions

### 1. في Google Analytics 4
```javascript
// Custom Dimensions
1. User Type (regular, premium, admin)
2. Language (ar, en)
3. Registration Method (email, social)
4. Profile Type (public, private)
5. Search Filters (age, location, etc.)
```

### 2. في Google Tag Manager
```javascript
// Variable Configuration
Variable Type: Custom JavaScript
Variable Name: User Type
Code:
function() {
  return window.userType || 'guest';
}
```

## 🚀 إعداد Tags المتقدمة

### 1. Scroll Tracking
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: scroll
Parameters:
  - scroll_depth: {{Scroll Depth}}
  - page_location: {{Page URL}}
  - page_title: {{Page Title}}
```

### 2. Click Tracking
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: click
Parameters:
  - click_element: {{Click Element}}
  - click_url: {{Click URL}}
  - click_text: {{Click Text}}
```

### 3. Video Tracking
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: video_play
Parameters:
  - video_title: {{Video Title}}
  - video_duration: {{Video Duration}}
  - video_percent: {{Video Percent}}
```

## 🔍 إعداد Debug Mode

### 1. GTM Preview Mode
- **الرابط**: https://tagmanager.google.com/
- **الخطوات**:
  1. اختر Container
  2. اضغط "Preview"
  3. أدخل URL الموقع
  4. اضغط "Connect"

### 2. GTM Debug Extension
- **Chrome Extension**: Google Tag Assistant
- **الوظائف**: مراقبة Tags في الوقت الفعلي

### 3. Console Debugging
```javascript
// في Console المتصفح
console.log(window.dataLayer);

// مراقبة الأحداث
window.dataLayer.push = function(event) {
  console.log('GTM Event:', event);
  return Array.prototype.push.apply(this, arguments);
};
```

## 📱 إعداد Mobile Tracking

### 1. Mobile App Events
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: mobile_app_event
Parameters:
  - app_name: {{App Name}}
  - app_version: {{App Version}}
  - device_type: {{Device Type}}
```

### 2. Responsive Design Tracking
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: responsive_design
Parameters:
  - screen_width: {{Screen Width}}
  - screen_height: {{Screen Height}}
  - device_type: {{Device Type}}
```

## 🎯 إعداد Conversion Tracking

### 1. Registration Conversion
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: conversion
Parameters:
  - conversion_type: 'registration'
  - conversion_value: 1
  - currency: 'USD'
```

### 2. Profile Completion Conversion
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: conversion
Parameters:
  - conversion_type: 'profile_completion'
  - conversion_value: 5
  - currency: 'USD'
```

### 3. Message Sent Conversion
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: conversion
Parameters:
  - conversion_type: 'message_sent'
  - conversion_value: 10
  - currency: 'USD'
```

## 📊 إعداد Reports

### 1. Custom Reports في GA4
- **User Registration Report**
- **Profile View Report**
- **Message Sent Report**
- **Search Behavior Report**

### 2. GTM Built-in Reports
- **Tag Firing Report**
- **Trigger Firing Report**
- **Variable Usage Report**

## 🔧 إعداد Advanced Features

### 1. Cross-Domain Tracking
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Configuration
Measurement ID: G-7QWP1R3BES
Cross Domain: rezgee.com, www.rezgee.com
```

### 2. Enhanced Ecommerce
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Event
Event Name: purchase
Parameters:
  - transaction_id: {{Transaction ID}}
  - value: {{Purchase Value}}
  - currency: {{Currency}}
  - items: {{Items}}
```

### 3. User ID Tracking
```javascript
// Tag Configuration
Tag Type: Google Analytics: GA4 Configuration
Measurement ID: G-7QWP1R3BES
User ID: {{User ID}}
```

## 📋 قائمة التحقق

### ✅ الإعداد الأساسي:
- [ ] إضافة GTM إلى الموقع
- [ ] إنشاء Container في GTM
- [ ] إعداد GA4 Tag
- [ ] إعداد Page View Trigger

### ✅ Tags الأساسية:
- [ ] Login Event Tag
- [ ] Sign Up Event Tag
- [ ] Search Event Tag
- [ ] Profile View Tag

### ✅ Tags المتقدمة:
- [ ] Message Sent Tag
- [ ] Like/Interest Tag
- [ ] Scroll Tracking Tag
- [ ] Click Tracking Tag

### ✅ Variables:
- [ ] Built-in Variables
- [ ] Custom Variables
- [ ] Data Layer Variables
- [ ] JavaScript Variables

### ✅ Testing:
- [ ] GTM Preview Mode
- [ ] GA4 Real-time Reports
- [ ] Console Debugging
- [ ] Mobile Testing

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
- [Google Analytics Help](https://support.google.com/analytics/)
- [GTM Community](https://productforums.google.com/forum/#!forum/tag-manager)

### مجتمعات المطورين:
- [GTM Community Forum](https://productforums.google.com/forum/#!forum/tag-manager)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-tag-manager)
- [Reddit GTM](https://www.reddit.com/r/GoogleTagManager/)

### الدورات التدريبية:
- [Google Tag Manager Course](https://analytics.google.com/analytics/academy/)
- [GTM Fundamentals](https://support.google.com/tagmanager/answer/6107163)

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
