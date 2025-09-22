# نظام الإشعارات البريدية المدمج - Integrated Email System

## 📧 نظرة عامة

تم إنشاء نظام إشعارات بريدية متكامل يربط النظام الحالي بقاعدة البيانات، مما يسمح بإدارة شاملة لجميع جوانب الإشعارات البريدية من خلال لوحة الإدارة.

## 🔧 الملفات الجديدة

### 1. `src/lib/databaseEmailService.ts`
**الخدمة الأساسية للاتصال بقاعدة البيانات**

#### الميزات:
- جلب القوالب من جدول `email_templates`
- جلب إعدادات SMTP من جدول `email_settings`
- جلب أنواع الإشعارات من جدول `email_notification_types`
- إنشاء محتوى الإيميلات من القوالب
- إرسال الإيميلات باستخدام القوالب من قاعدة البيانات
- تسجيل الإيميلات في سجل `email_logs`
- جلب إحصائيات الإيميلات
- اختبار القوالب

#### الطرق الرئيسية:
```typescript
// جلب قالب من قاعدة البيانات
static async getEmailTemplate(templateName: string, language: 'ar' | 'en' = 'ar')

// جلب إعدادات SMTP
static async getEmailSettings()

// إرسال إيميل باستخدام القالب
static async sendEmailWithTemplate(templateName: string, to: string, data: Record<string, any>, language: 'ar' | 'en' = 'ar')

// تسجيل الإيميل في السجل
static async logEmail(templateName: string, to: string, subject: string, status: 'sent' | 'failed' | 'pending', error?: string)

// اختبار قالب محدد
static async testEmailTemplate(templateName: string, testEmail: string = 'kemooamegoo@gmail.com', language: 'ar' | 'en' = 'ar')
```

### 2. `src/lib/integratedEmailService.ts`
**الخدمة المدمجة التي تربط النظام الحالي بقاعدة البيانات**

#### الميزات:
- إرسال إيميلات مع دعم القوالب من قاعدة البيانات
- استخدام النظام الحالي كبديل في حالة فشل قاعدة البيانات
- تحديد اسم القالب حسب نوع الإيميل تلقائياً
- دعم جميع أنواع الإيميلات (تحقق، ترحيب، إعجاب، رسائل، إلخ)
- اختبار النظام المدمج
- جلب إحصائيات النظام

#### الطرق الرئيسية:
```typescript
// إرسال إيميل عام
static async sendEmail(emailData: EmailData, templateData?: any, language: 'ar' | 'en' = 'ar')

// إرسال إيميل تحقق الحساب
static async sendVerificationEmail(email: string, verificationUrl: string, firstName: string, lastName: string, language: 'ar' | 'en' = 'ar')

// إرسال إيميل ترحيب
static async sendWelcomeEmail(email: string, userName: string, language: 'ar' | 'en' = 'ar')

// إرسال إشعار إعجاب
static async sendLikeNotification(email: string, userName: string, likerName: string, likerCity: string, likerAge: number, language: 'ar' | 'en' = 'ar')

// اختبار النظام المدمج
static async testIntegratedSystem(testEmail: string = 'kemooamegoo@gmail.com', language: 'ar' | 'en' = 'ar')
```

### 3. `src/lib/testIntegratedEmailSystem.ts`
**نظام اختبار شامل للنظام المدمج**

#### الميزات:
- اختبار شامل للنظام المدمج
- اختبار الاتصال بقاعدة البيانات
- اختبار جميع القوالب (أساسية، اجتماعية، إدارية، أمنية)
- اختبار النظام المدمج
- عرض الإحصائيات النهائية
- اختبار سريع

#### الطرق الرئيسية:
```typescript
// اختبار شامل
static async runFullTest(testEmail: string = 'kemooamegoo@gmail.com')

// اختبار سريع
static async quickTest(testEmail: string = 'kemooamegoo@gmail.com'): Promise<boolean>
```

## 🔄 التحديثات على النظام الحالي

### 1. `src/lib/notificationEmailService.ts`
**تم تحديث خدمة الإشعارات البريدية الرئيسية**

#### التحديثات:
- إضافة استيراد `IntegratedEmailService`
- تحديث دالة `sendEmail` لتستخدم النظام المدمج أولاً
- استخدام النظام الحالي كبديل في حالة فشل النظام المدمج

```typescript
// محاولة 1: استخدام النظام المدمج (قاعدة البيانات أولاً)
const integratedResult = await IntegratedEmailService.sendEmail(emailData, {}, 'ar');

if (integratedResult.success) {
  console.log('✅ تم إرسال الإيميل بنجاح عبر النظام المدمج');
  return { success: true };
}

// محاولة 2: استخدام النظام الحالي كبديل
const fallbackResult = await this.sendEmailFallback(emailData);
return fallbackResult;
```

### 2. `src/components/admin/EmailNotificationsManagement.tsx`
**تم تحديث صفحة إدارة الإشعارات البريدية**

#### التحديثات:
- إضافة استيراد الخدمات الجديدة
- إضافة زر "اختبار النظام المدمج"
- إضافة زر "اختبار القالب" لكل قالب
- تحديث واجهة المستخدم لعرض البيانات من قاعدة البيانات

## 📊 قاعدة البيانات

### الجداول المستخدمة:

#### 1. `email_templates`
```sql
- id (UUID)
- name (VARCHAR) - اسم القالب الفريد
- name_ar (VARCHAR) - الاسم بالعربية
- name_en (VARCHAR) - الاسم بالإنجليزية
- subject_ar (VARCHAR) - موضوع الإيميل بالعربية
- subject_en (VARCHAR) - موضوع الإيميل بالإنجليزية
- content_ar (TEXT) - المحتوى النصي بالعربية
- content_en (TEXT) - المحتوى النصي بالإنجليزية
- html_template_ar (TEXT) - القالب HTML بالعربية
- html_template_en (TEXT) - القالب HTML بالإنجليزية
- is_active (BOOLEAN) - حالة القالب
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. `email_notification_types`
```sql
- id (UUID)
- name (VARCHAR) - نوع الإشعار الفريد
- name_ar (VARCHAR) - الاسم بالعربية
- name_en (VARCHAR) - الاسم بالإنجليزية
- description_ar (TEXT) - الوصف بالعربية
- description_en (TEXT) - الوصف بالإنجليزية
- template_id (UUID) - مرجع للقالب
- is_active (BOOLEAN) - حالة النوع
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 3. `email_settings`
```sql
- id (UUID)
- smtp_host (VARCHAR) - خادم SMTP
- smtp_port (INTEGER) - منفذ SMTP
- smtp_username (VARCHAR) - اسم المستخدم
- smtp_password (VARCHAR) - كلمة المرور
- from_name_ar (VARCHAR) - اسم المرسل بالعربية
- from_name_en (VARCHAR) - اسم المرسل بالإنجليزية
- from_email (VARCHAR) - البريد الإلكتروني للمرسل
- reply_to (VARCHAR) - البريد الإلكتروني للرد
- is_active (BOOLEAN) - حالة الإعدادات
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 4. `email_logs`
```sql
- id (UUID)
- template_name (VARCHAR) - اسم القالب المستخدم
- recipient_email (VARCHAR) - بريد المستقبل
- subject (VARCHAR) - موضوع الإيميل
- status (VARCHAR) - حالة الإرسال (sent/failed/pending)
- error_message (TEXT) - رسالة الخطأ (إن وجدت)
- sent_at (TIMESTAMP) - وقت الإرسال الفعلي
- created_at (TIMESTAMP)
```

## 🎯 أنواع الإيميلات المدعومة

### القوالب الأساسية (4):
1. **account_verification** - تحقق الحساب
2. **temporary_password** - كلمة المرور المؤقتة
3. **two_factor_code** - رمز التحقق الثنائي
4. **welcome_email** - إيميل الترحيب

### القوالب الاجتماعية (4):
1. **like_notification** - إشعار الإعجاب
2. **profile_view_notification** - إشعار زيارة الملف الشخصي
3. **message_notification** - إشعار الرسالة الجديدة
4. **match_notification** - إشعار المطابقة

### القوالب الإدارية (6):
1. **report_received_notification** - إشعار استلام البلاغ
2. **report_accepted_notification** - إشعار قبول البلاغ
3. **report_rejected_notification** - إشعار رفض البلاغ
4. **verification_approved_notification** - إشعار قبول التوثيق
5. **verification_rejected_notification** - إشعار رفض التوثيق
6. **user_ban_notification** - إشعار حظر المستخدم

### القوالب الأمنية (4):
1. **login_success_notification** - إشعار تسجيل الدخول الناجح
2. **login_failed_notification** - إشعار محاولة تسجيل دخول فاشلة
3. **two_factor_failure_notification** - إشعار فشل التحقق الثنائي
4. **two_factor_disable_notification** - إشعار تعطيل التحقق الثنائي

## 🚀 كيفية الاستخدام

### 1. اختبار النظام المدمج:
```typescript
import TestIntegratedEmailSystem from './lib/testIntegratedEmailSystem';

// اختبار سريع
const result = await TestIntegratedEmailSystem.quickTest('test@example.com');

// اختبار شامل
await TestIntegratedEmailSystem.runFullTest('test@example.com');
```

### 2. إرسال إيميل باستخدام النظام المدمج:
```typescript
import { IntegratedEmailService } from './lib/integratedEmailService';

// إرسال إيميل تحقق
await IntegratedEmailService.sendVerificationEmail(
  'user@example.com',
  'https://rezge.com/verify/123',
  'أحمد',
  'محمد',
  'ar'
);

// إرسال إشعار إعجاب
await IntegratedEmailService.sendLikeNotification(
  'user@example.com',
  'مستخدم',
  'سارة أحمد',
  'الرياض',
  25,
  'ar'
);
```

### 3. استخدام الخدمة المباشرة لقاعدة البيانات:
```typescript
import { DatabaseEmailService } from './lib/databaseEmailService';

// جلب قالب
const template = await DatabaseEmailService.getEmailTemplate('account_verification', 'ar');

// إرسال إيميل باستخدام القالب
await DatabaseEmailService.sendEmailWithTemplate(
  'account_verification',
  'user@example.com',
  { firstName: 'أحمد', lastName: 'محمد', verificationUrl: 'https://rezge.com/verify/123' },
  'ar'
);

// اختبار قالب محدد
await DatabaseEmailService.testEmailTemplate('account_verification', 'test@example.com', 'ar');
```

## 🔧 إعداد النظام

### 1. تشغيل ملفات SQL:
```bash
# تشغيل الملفات بالترتيب:
1. complete_email_system_update.sql
2. social_email_templates.sql
3. admin_email_templates.sql
4. security_email_templates.sql
```

### 2. التحقق من البيانات:
```sql
-- التحقق من القوالب
SELECT COUNT(*) FROM email_templates;

-- التحقق من أنواع الإشعارات
SELECT COUNT(*) FROM email_notification_types;

-- التحقق من إعدادات SMTP
SELECT COUNT(*) FROM email_settings;
```

### 3. اختبار النظام:
- انتقل إلى لوحة الإدارة
- اذهب إلى صفحة "إدارة الإشعارات البريدية"
- اضغط على "اختبار النظام المدمج"
- تحقق من النتائج في سجل الإيميلات

## 📈 المزايا

### 1. **إدارة مركزية**:
- جميع القوالب والإعدادات في مكان واحد
- سهولة التعديل والتحديث
- نسخ احتياطية تلقائية

### 2. **مرونة عالية**:
- دعم النسختين العربية والإنجليزية
- متغيرات ديناميكية في القوالب
- تصميمات HTML متقدمة

### 3. **موثوقية**:
- نظام بديل في حالة فشل قاعدة البيانات
- تسجيل شامل لجميع الإيميلات
- إحصائيات مفصلة

### 4. **سهولة الاستخدام**:
- واجهة إدارة بديهية
- اختبار مباشر للقوالب
- تصدير السجلات

## 🔍 استكشاف الأخطاء

### مشاكل شائعة:

#### 1. **لا تظهر البيانات في لوحة الإدارة**:
```typescript
// تحقق من سياسات RLS
// تأكد من تشغيل ملفات SQL
// تحقق من اتصال قاعدة البيانات
```

#### 2. **فشل في إرسال الإيميلات**:
```typescript
// تحقق من إعدادات SMTP
// تأكد من وجود القوالب في قاعدة البيانات
// تحقق من سجل الأخطاء
```

#### 3. **القوالب لا تعمل**:
```typescript
// تحقق من أسماء القوالب
// تأكد من وجود المتغيرات المطلوبة
// اختبر القالب مباشرة
```

## 📝 ملاحظات مهمة

1. **الأولوية**: النظام المدمج يحاول استخدام قاعدة البيانات أولاً، ثم النظام الحالي كبديل
2. **التسجيل**: جميع الإيميلات تُسجل في `email_logs` تلقائياً
3. **الاختبار**: استخدم `TestIntegratedEmailSystem` لاختبار النظام قبل الإنتاج
4. **التحديث**: أي تعديل على القوالب في لوحة الإدارة يُطبق فوراً
5. **الأمان**: كلمات مرور SMTP محمية في قاعدة البيانات

## 🎉 الخلاصة

تم إنشاء نظام إشعارات بريدية متكامل يربط النظام الحالي بقاعدة البيانات، مما يوفر:

- **18 قالب إيميل** كامل مع HTML
- **18 نوع إشعار** مرتبط بالقوالب
- **إعدادات SMTP** قابلة للتعديل
- **سجل شامل** لجميع الإيميلات
- **إحصائيات مفصلة** للأداء
- **واجهة إدارة** سهلة الاستخدام
- **نظام اختبار** شامل
- **دعم كامل** للعربية والإنجليزية

النظام جاهز للاستخدام ويمكن إدارته بالكامل من خلال لوحة الإدارة! 🚀





