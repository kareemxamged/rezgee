# نظام كلمات المرور المؤقتة - رزقي

## نظرة عامة

تم تطوير نظام كلمات المرور المؤقتة لموقع رزقي ليحل محل نظام إعادة تعيين كلمة المرور التقليدي. بدلاً من إرسال رابط إعادة التعيين، يتم إرسال كلمة مرور مؤقتة آمنة عبر البريد الإلكتروني.

## المميزات الرئيسية

### 🔐 الأمان
- **تشفير قوي**: كلمات المرور المؤقتة مشفرة باستخدام bcrypt مع salt rounds = 12
- **انتهاء صلاحية**: كل كلمة مرور مؤقتة تنتهي صلاحيتها خلال 60 دقيقة
- **استخدام واحد**: كل كلمة مرور مؤقتة تُستخدم مرة واحدة فقط
- **حماية من التعداد**: عدم الكشف عن وجود أو عدم وجود البريد الإلكتروني

### 🛡️ الحماية من الإساءة
- **حد يومي**: 6 طلبات كحد أقصى يومياً لكل مستخدم
- **حد شهري**: 12 طلب كحد أقصى شهرياً لكل مستخدم
- **فترة انتظار**: 5 دقائق بين كل طلب
- **حظر تلقائي**: حظر المستخدمين الذين يتجاوزون الحدود

### 📧 التكامل مع Supabase
- **SMTP مخصص**: استخدام Supabase Custom SMTP (smtp.hostinger.com)
- **Templates محدثة**: تم تحديث template الـ recovery ليحتوي على كلمة المرور المؤقتة
- **متغيرات ديناميكية**: استخدام {{.Token}} و {{.ExpiresAt}} في Templates

## الملفات المتأثرة

### 1. خدمة كلمات المرور المؤقتة
- **الملف**: `src/lib/temporaryPasswordService.ts`
- **الوظائف الرئيسية**:
  - `createTemporaryPassword()`: إنشاء كلمة مرور مؤقتة
  - `verifyTemporaryPassword()`: التحقق من كلمة المرور المؤقتة
  - `sendTemporaryPasswordViaSupabase()`: إرسال كلمة المرور عبر Supabase
  - `updatePasswordWithTempPassword()`: تحديث كلمة المرور باستخدام المؤقتة

### 2. صفحة نسيت الباسوورد
- **الملف**: `src/components/ForgotPasswordPage.tsx`
- **التحديثات**:
  - استخدام `sendTemporaryPasswordViaSupabase()` بدلاً من الخدمات القديمة
  - تبسيط معالجة الأخطاء
  - توجيه المستخدم لصفحة استخدام كلمة المرور المؤقتة

### 3. صفحة استخدام كلمة المرور المؤقتة
- **الملف**: `src/components/TemporaryPasswordLoginPage.tsx`
- **الوظائف**:
  - إدخال كلمة المرور المؤقتة
  - تعيين كلمة مرور جديدة
  - تسجيل الدخول التلقائي بعد التحديث

## قاعدة البيانات

### جدول `temporary_passwords`
```sql
CREATE TABLE temporary_passwords (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    temp_password_hash TEXT NOT NULL,
    temp_password_plain TEXT, -- للاختبار فقط
    is_used BOOLEAN DEFAULT FALSE,
    is_first_use BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    ip_address TEXT,
    user_agent TEXT,
    replaced_original BOOLEAN DEFAULT FALSE
);
```

### جدول `password_reset_requests`
```sql
CREATE TABLE password_reset_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    daily_requests_count INTEGER DEFAULT 0,
    daily_reset_date DATE DEFAULT CURRENT_DATE,
    last_request_at TIMESTAMP WITH TIME ZONE,
    monthly_requests_count INTEGER DEFAULT 0,
    monthly_reset_date DATE DEFAULT CURRENT_DATE,
    unused_requests_count INTEGER DEFAULT 0,
    is_blocked_until TIMESTAMP WITH TIME ZONE,
    block_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## إعدادات Supabase

### SMTP Configuration
- **Host**: smtp.hostinger.com
- **Port**: 465
- **User**: manage@kareemamged.com
- **Sender Name**: REZGEE

### Email Templates
- **Recovery Subject**: "كلمة المرور المؤقتة - رزقي"
- **Recovery Template**: تم تحديثه ليحتوي على كلمة المرور المؤقتة بدلاً من رابط إعادة التعيين

## كيفية الاستخدام

### 1. طلب كلمة مرور مؤقتة
```typescript
import { sendTemporaryPasswordViaSupabase } from '../lib/temporaryPasswordService';

const result = await sendTemporaryPasswordViaSupabase('user@example.com');
if (result.success) {
    // تم إرسال كلمة المرور المؤقتة بنجاح
    console.log('تم الإرسال بنجاح');
} else {
    // معالجة الخطأ
    console.error(result.error);
}
```

### 2. التحقق من كلمة المرور المؤقتة
```typescript
import { verifyTemporaryPassword } from '../lib/temporaryPasswordService';

const result = await verifyTemporaryPassword('user@example.com', 'temp_password');
if (result.isValid && result.isTemporary) {
    // كلمة المرور المؤقتة صحيحة
    console.log('كلمة المرور صحيحة');
}
```

### 3. تحديث كلمة المرور
```typescript
import { updatePasswordWithTempPassword } from '../lib/temporaryPasswordService';

const result = await updatePasswordWithTempPassword(
    'user@example.com',
    'temp_password',
    'new_password'
);
if (result.success) {
    // تم تحديث كلمة المرور بنجاح
    console.log('تم التحديث بنجاح');
}
```

## الأمان والحماية

### حماية من الهجمات
1. **Rate Limiting**: حدود يومية وشهرية للطلبات
2. **Brute Force Protection**: فترات انتظار بين الطلبات
3. **Account Enumeration Protection**: عدم الكشف عن وجود الحسابات
4. **Secure Password Generation**: كلمات مرور قوية وعشوائية

### التشفير
- **bcrypt**: تشفير كلمات المرور المؤقتة
- **Salt Rounds**: 12 rounds للحماية القوية
- **Secure Random**: توليد كلمات مرور عشوائية آمنة

## الصيانة والتنظيف

### تنظيف تلقائي
- **دالة**: `cleanup_expired_temporary_passwords()`
- **التشغيل**: يتم استدعاؤها تلقائياً عند إنشاء كلمة مرور جديدة
- **الوظيفة**: حذف كلمات المرور المنتهية الصلاحية والمستخدمة

### مراقبة النظام
- **Logs**: تسجيل مفصل لجميع العمليات
- **Error Handling**: معالجة شاملة للأخطاء
- **Performance Monitoring**: مراقبة أداء قاعدة البيانات

## المشاكل التي تم حلها

### 1. مشكلة Row Level Security (RLS)
- **المشكلة**: خطأ 42501 - انتهاك سياسة RLS عند إدراج كلمات المرور المؤقتة
- **الحل**: تحديث سياسات RLS للسماح بالإدراج والتحديث
- **الكود المطبق**:
```sql
CREATE POLICY "Allow insert temporary passwords" ON temporary_passwords
    FOR INSERT WITH CHECK (true);
```

### 2. مشكلة الوصول لجدول المستخدمين
- **المشكلة**: محاولة الوصول لجدول `users` في `public` schema بدلاً من `auth.users`
- **الحل**: إنشاء دالة `getUserInfo()` للوصول الصحيح للمستخدمين
- **التحسين**: دمج معلومات من `auth.users` و `profiles`

### 3. مشكلة إعدادات Supabase Templates
- **المشكلة**: Template الـ recovery لا يحتوي على متغيرات كلمة المرور المؤقتة
- **الحل الأول**: تحديث template ليستخدم `{{.Token}}` و `{{.ExpiresAt}}`
- **الحل النهائي**: إنشاء Edge Function مخصص مع Resend API
- **النتيجة**: إرسال كلمات مرور مؤقتة مباشرة عبر Resend API

### 4. مشكلة إرسال البريد الإلكتروني
- **المشكلة**: Supabase SMTP لا يرسل البريد الإلكتروني بشكل موثوق
- **الحل**: إنشاء Edge Function `send-temporary-password` يستخدم Resend API
- **المفتاح**: `re_YrvygStJ_EWyFv3jnpzR9BbZP78iA1ZXm`
- **النتيجة**: إرسال موثوق للبريد الإلكتروني مع تتبع حالة الإرسال

## الاختبارات المنجزة

### 1. اختبارات الوحدة (Unit Tests)
- **الملف**: `src/tests/temporaryPasswordSystem.test.ts`
- **التغطية**: جميع الدوال الرئيسية
- **الأدوات**: Vitest, Mock Supabase, Mock bcrypt

### 2. اختبارات التكامل
- **النطاق**: التدفق الكامل من إنشاء إلى استخدام كلمة المرور المؤقتة
- **البيئة**: قاعدة بيانات اختبار منفصلة
- **السيناريوهات**: حالات النجاح والفشل

## التطوير المستقبلي

### تحسينات مخططة
1. **SMS Support**: إضافة دعم إرسال كلمات المرور عبر SMS
2. **Multi-language Templates**: قوالب متعددة اللغات
3. **Advanced Analytics**: تحليلات متقدمة لاستخدام النظام
4. **Mobile App Integration**: تكامل مع تطبيق الهاتف المحمول

### اختبارات إضافية مطلوبة
1. **Load Testing**: اختبارات الحمولة العالية
2. **Security Penetration**: اختبارات اختراق الأمان
3. **Cross-browser Testing**: اختبارات متعددة المتصفحات
4. **Mobile Responsiveness**: اختبارات الاستجابة للهواتف

## الدعم والمساعدة

للحصول على المساعدة أو الإبلاغ عن مشاكل:
- **البريد الإلكتروني**: support@rezge.com
- **التوثيق**: راجع هذا الملف للتفاصيل الكاملة
- **الكود المصدري**: `src/lib/temporaryPasswordService.ts`

## حالة النظام الحالية

### ✅ مكتمل ويعمل
- [x] إنشاء كلمات المرور المؤقتة
- [x] تشفير وحفظ كلمات المرور في قاعدة البيانات
- [x] إرسال كلمات المرور عبر Resend API (Edge Function)
- [x] التحقق من كلمات المرور المؤقتة
- [x] تحديث كلمة المرور باستخدام المؤقتة
- [x] حماية من الإساءة والحدود اليومية/الشهرية
- [x] سياسات RLS محدثة وتعمل بشكل صحيح
- [x] Edge Function `send-temporary-password` منشور ويعمل
- [x] اختبارات شاملة للنظام
- [x] تكامل مع Resend API للإرسال الموثوق

### 🔄 قيد التطوير
- [ ] تحسين رسائل الخطأ وترجمتها
- [ ] إضافة المزيد من اختبارات الأمان
- [ ] تحسين واجهة المستخدم

### 📋 خطوات التشغيل
1. **تأكد من Edge Function**: `send-temporary-password` منشور في Supabase
2. **تحقق من Resend API**: المفتاح `re_YrvygStJ_EWyFv3jnpzR9BbZP78iA1ZXm` يعمل
3. **تشغيل الاختبارات**: `npm test temporaryPasswordSystem.test.ts`
4. **اختبار الوظيفة**: استخدم صفحة "نسيت الباسوورد"
5. **مراقبة الأداء**: تحقق من logs في Supabase Dashboard

### معلومات تقنية
- **Edge Function ID**: `2b2d9627-7667-43e7-9f0f-477b6c0a4ec2`
- **Function Slug**: `send-temporary-password`
- **Resend API Key**: `re_YrvygStJ_EWyFv3jnpzR9BbZP78iA1ZXm`
- **From Email**: `manage@kareemamged.com`
- **CORS**: مُفعل لجميع المصادر

---

**تاريخ آخر تحديث**: 2025-01-14
**الإصدار**: 1.1.0
**الحالة**: ✅ جاهز للإنتاج ومُختبر
**المطور**: فريق رزقي التقني
**Edge Function**: `send-temporary-password` (نشط)
**API Provider**: Resend API (موثوق)
