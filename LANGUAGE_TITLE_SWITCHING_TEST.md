# اختبار تبديل عنوان الصفحة مع اللغة

## 🎯 الهدف
التأكد من أن عنوان الصفحة (title في tab المتصفح) يتغير فورياً عند الضغط على زر تبديل اللغة.

## 🔧 التحديثات المطبقة

### 1. تحديث usePageTitle Hook
```typescript
// إضافة console.log لمراقبة التغييرات
console.log('🔄 Page title updated:', title, '| Language:', i18n.language, '| Path:', location.pathname);

// إضافة تنفيذ مؤجل للتأكد من تحديث الترجمات
const timeoutId = setTimeout(updateTitle, 100);

// تحديث dependencies لتشمل i18n.language
}, [location.pathname, customTitle, i18n.language]);
```

### 2. تحديث LanguageToggle
```typescript
const toggleLanguage = () => {
  const newLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
  console.log('🌐 Language toggle clicked:', currentLanguage, '->', newLanguage);
  changeLanguage(newLanguage);
};
```

### 3. تحديث changeLanguage في i18n.ts
```typescript
export const changeLanguage = (language: string) => {
  console.log('🔄 changeLanguage called:', language);
  
  i18n.changeLanguage(language);
  // ... باقي الكود
  
  console.log('✅ Language changed to:', language, '| Direction:', isRTL ? 'rtl' : 'ltr');
};
```

## 🧪 خطوات الاختبار

### الخطوة 1: فتح Developer Tools
1. افتح الموقع
2. اضغط F12 لفتح Developer Tools
3. انتقل لتبويب Console

### الخطوة 2: اختبار الصفحة الرئيسية
1. تأكد أنك في الصفحة الرئيسية (/)
2. لاحظ عنوان الصفحة الحالي في tab المتصفح
3. اضغط على زر تبديل اللغة في الهيدر
4. راقب رسائل الكونسول
5. لاحظ تغيير عنوان الصفحة فورياً

### الخطوة 3: اختبار صفحات أخرى
1. انتقل لصفحة البحث (/search)
2. بدل اللغة ولاحظ تغيير العنوان
3. انتقل لصفحة الملف الشخصي (/profile)
4. بدل اللغة ولاحظ تغيير العنوان

### الخطوة 4: اختبار لوحة الإدارة
1. ادخل للوحة الإدارة (/admin)
2. بدل اللغة ولاحظ تغيير العنوان
3. انتقل لصفحة إدارة المستخدمين (/admin/users)
4. بدل اللغة ولاحظ تغيير العنوان

## 📋 رسائل الكونسول المتوقعة

عند الضغط على زر تبديل اللغة، يجب أن تظهر هذه الرسائل:

```
🌐 Language toggle clicked: ar -> en
🔄 changeLanguage called: en
✅ Language changed to: en | Direction: ltr
🔄 Page title updated: Rezge - Islamic Marriage Website | Language: en | Path: /
```

أو عند التبديل من الإنجليزية للعربية:

```
🌐 Language toggle clicked: en -> ar
🔄 changeLanguage called: ar
✅ Language changed to: ar | Direction: rtl
🔄 Page title updated: رزقي - موقع الزواج الإسلامي | Language: ar | Path: /
```

## 📊 العناوين المتوقعة

### الموقع العام
| الصفحة | العربية | الإنجليزية |
|--------|---------|------------|
| الرئيسية (/) | رزقي - موقع الزواج الإسلامي | Rezge - Islamic Marriage Website |
| البحث (/search) | البحث المتقدم - رزقي | Advanced Search - Rezge |
| الملف الشخصي (/profile) | الملف الشخصي - رزقي | Profile - Rezge |
| الرسائل (/messages) | الرسائل - رزقي | Messages - Rezge |
| الإعدادات (/settings) | الإعدادات - رزقي | Settings - Rezge |

### لوحة الإدارة
| الصفحة | العربية | الإنجليزية |
|--------|---------|------------|
| لوحة التحكم (/admin) | لوحة التحكم - إدارة رزقي | Dashboard - Rezge Admin |
| إدارة المستخدمين (/admin/users) | إدارة المستخدمين - إدارة رزقي | User Management - Rezge Admin |

## ❌ استكشاف الأخطاء

### إذا لم يتغير العنوان:

1. **تحقق من رسائل الكونسول:**
   - هل تظهر رسالة "Language toggle clicked"؟
   - هل تظهر رسالة "changeLanguage called"؟
   - هل تظهر رسالة "Page title updated"؟

2. **تحقق من ملفات الترجمة:**
   - تأكد من وجود `pageTitles` في ar.json و en.json
   - تأكد من صحة مفاتيح الترجمة

3. **تحقق من usePageTitle:**
   - تأكد من أن PageTitleManager مضاف في App.tsx
   - تأكد من أن dependencies في useEffect صحيحة

4. **تحقق من i18n:**
   - تأكد من أن الموقع يستخدم src/i18n.ts وليس dynamicI18n.ts
   - تأكد من أن LanguageToggle يستورد changeLanguage من المكان الصحيح

## ✅ النتائج المتوقعة

بعد تطبيق التحديثات:
- ✅ تبديل اللغة يغير عنوان الصفحة فورياً
- ✅ العنوان يتغير بدون إعادة تحميل الصفحة
- ✅ العنوان يتغير بدون الانتقال لصفحة أخرى
- ✅ النظام يعمل في جميع صفحات الموقع
- ✅ النظام يعمل في لوحة الإدارة
- ✅ رسائل الكونسول تؤكد عمل النظام
- ✅ Meta description يتحدث أيضاً مع اللغة

## 🔄 إذا استمرت المشكلة

إذا لم يعمل النظام بعد هذه التحديثات، فقد تكون المشكلة في:

1. **تضارب بين أنظمة i18n:** الموقع قد يستخدم dynamicI18n بدلاً من i18n العادي
2. **مشكلة في React re-rendering:** قد نحتاج لاستخدام forceUpdate أو key prop
3. **مشكلة في timing:** قد نحتاج لزيادة التأخير في setTimeout

في هذه الحالة، يرجى مشاركة رسائل الكونسول لتحديد السبب الدقيق.
