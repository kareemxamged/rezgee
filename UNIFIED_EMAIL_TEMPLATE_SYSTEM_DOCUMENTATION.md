# 📧 نظام التيمبليت الموحد للإيميلات - رزقي

## 🎯 نظرة عامة

تم تطوير نظام التيمبليت الموحد للإيميلات لتوحيد تصميم وإرسال جميع أنواع الإيميلات في منصة رزقي. يوفر النظام تيمبليت HTML موحد وجميل مع إمكانية التخصيص لكل نوع إيميل.

## ✨ الميزات الرئيسية

### 🎨 **تصميم موحد وجميل**
- تيمبليت HTML متجاوب يعمل على جميع الأجهزة
- دعم كامل للغة العربية (RTL)
- تصميم حديث مع gradients وظلال
- ألوان متسقة مع هوية العلامة التجارية

### 🔧 **مرونة في التخصيص**
- إمكانية تخصيص الألوان والتدرجات
- أنواع محتوى متعددة (كود، كلمة مرور، زر، نص، HTML)
- إضافة تعليمات وملاحظات أمنية
- رسائل تحذيرية وتنبيهات

### 📱 **أنواع الإيميلات المدعومة**
1. **كلمة المرور المؤقتة** - لإعادة تعيين كلمة المرور
2. **رمز التحقق الثنائي** - لتسجيل الدخول وإدارة 2FA
3. **تأكيد تغيير بيانات التواصل** - لتحديث الإيميل والهاتف
4. **إشعار تسجيل دخول ناجح** - لتنبيه المستخدم بعمليات الدخول

## 🏗️ بنية النظام

### 📁 الملفات الأساسية

```
src/lib/
├── unifiedEmailTemplateSystem.ts    # النظام الأساسي للتيمبليت
├── unifiedEmailService.ts           # خدمة الإرسال الموحدة
└── unifiedEmailTemplate.ts          # النظام القديم (للتوافق)

supabase/functions/
└── send-unified-email/
    └── index.ts                      # Edge Function للإرسال
```

### 🔧 المكونات الرئيسية

#### 1. **UnifiedEmailTemplateSystem**
الكلاس الأساسي لإنشاء التيمبليت:

```typescript
export class UnifiedEmailTemplateSystem {
  static generateUnifiedTemplate(data: UnifiedEmailData): EmailTemplate
  // دوال مساعدة لرندر المحتوى
}
```

#### 2. **UnifiedEmailService**
خدمة الإرسال الموحدة:

```typescript
export class UnifiedEmailService {
  static async sendEmail(emailData: UnifiedEmailData, recipientEmail: string)
  static async sendTemporaryPassword(email, password, expiresAt, recipientName?)
  static async sendTwoFactorCode(email, code, codeType?, expiresInMinutes?)
  static async sendContactChangeConfirmation(email, confirmationUrl, changeType)
  static async sendSuccessfulLoginNotification(email, loginData)
}
```

#### 3. **UnifiedEmailTemplates**
قوالب جاهزة للاستخدام:

```typescript
export const UnifiedEmailTemplates = {
  temporaryPassword(password, expiresAt, recipientName?): UnifiedEmailData
  twoFactorCode(code, codeType?, expiresInMinutes?): UnifiedEmailData
  contactChangeConfirmation(confirmationUrl, changeType, oldValue?, newValue?): UnifiedEmailData
  successfulLogin(loginData): UnifiedEmailData
}
```

## 🚀 طريقة الاستخدام

### 1. **إرسال كلمة مرور مؤقتة**

```typescript
import { UnifiedEmailService } from './lib/unifiedEmailService';

const result = await UnifiedEmailService.sendTemporaryPassword(
  'user@example.com',
  'ABC123',
  '2025-09-20T10:00:00Z',
  'أحمد محمد'
);

if (result.success) {
  console.log('تم الإرسال بنجاح:', result.messageId);
}
```

### 2. **إرسال رمز التحقق الثنائي**

```typescript
const result = await UnifiedEmailService.sendTwoFactorCode(
  'user@example.com',
  '123456',
  'login', // أو 'enable_2fa' أو 'disable_2fa'
  15 // مدة الصلاحية بالدقائق
);
```

### 3. **إرسال تأكيد تغيير البيانات**

```typescript
const result = await UnifiedEmailService.sendContactChangeConfirmation(
  'user@example.com',
  'https://rezge.com/verify-change?token=abc123',
  'email', // أو 'phone' أو 'both'
  'old@example.com',
  'new@example.com'
);
```

### 4. **إرسال إشعار تسجيل دخول**

```typescript
const result = await UnifiedEmailService.sendSuccessfulLoginNotification(
  'user@example.com',
  {
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.1',
    location: 'الرياض، السعودية',
    deviceType: 'Desktop',
    browser: 'Chrome'
  }
);
```

### 5. **إرسال إيميل مخصص**

```typescript
import { UnifiedEmailService, UnifiedEmailData } from './lib/unifiedEmailService';

const customEmail: UnifiedEmailData = {
  title: 'رسالة مخصصة - رزقي',
  heading: 'مرحباً بك',
  icon: '🎉',
  greeting: 'السلام عليكم أحمد،',
  description: 'هذه رسالة مخصصة من منصة رزقي.',
  mainContent: 'محتوى مهم',
  mainContentType: 'text',
  securityNote: 'هذه رسالة آمنة ومشفرة',
  gradientColors: ['#1e40af', '#059669']
};

const result = await UnifiedEmailService.sendCustomEmail('user@example.com', customEmail);
```

## 🔧 التكامل مع الخدمات الموجودة

### 1. **تحديث خدمة كلمة المرور المؤقتة**

```typescript
// في temporaryPasswordService.ts
import { UnifiedEmailService } from './unifiedEmailService';

async function sendTemporaryPasswordEmail(email, password, expiresAt, recipientName) {
  const result = await UnifiedEmailService.sendTemporaryPassword(
    email, password, expiresAt, recipientName
  );
  return { success: result.success, error: result.error };
}
```

### 2. **تحديث خدمة التحقق الثنائي**

```typescript
// في twoFactorService.ts
import { UnifiedEmailService } from './unifiedEmailService';

private async sendCodeByEmail(email, code, codeType) {
  const result = await UnifiedEmailService.sendTwoFactorCode(email, code, codeType, 15);
  return result.success;
}
```

### 3. **تحديث خدمة الأمان والخصوصية**

```typescript
// في SecuritySettingsPage.tsx
import { UnifiedEmailService } from '../lib/unifiedEmailService';

const sendChangeConfirmation = async (email, confirmationUrl, changeType) => {
  return await UnifiedEmailService.sendContactChangeConfirmation(
    email, confirmationUrl, changeType
  );
};
```

## 🎨 التخصيص والتصميم

### 1. **تخصيص الألوان**

```typescript
const customEmailData: UnifiedEmailData = {
  // ... باقي البيانات
  primaryColor: '#8b5cf6', // لون أساسي مخصص
  gradientColors: ['#8b5cf6', '#06b6d4'], // تدرج مخصص
};
```

### 2. **أنواع المحتوى الرئيسي**

- `'code'` - لعرض رموز التحقق
- `'password'` - لعرض كلمات المرور
- `'button'` - لعرض أزرار العمل
- `'text'` - لعرض نص عادي
- `'html'` - لعرض محتوى HTML مخصص

### 3. **إضافة تعليمات**

```typescript
const emailData: UnifiedEmailData = {
  // ... باقي البيانات
  instructions: [
    'اذهب إلى صفحة تسجيل الدخول',
    'أدخل بريدك الإلكتروني',
    'أدخل الرمز المرسل',
    'اضغط على تسجيل الدخول'
  ]
};
```

## 🔒 الأمان والخصوصية

### 1. **تشفير البيانات**
- جميع البيانات الحساسة مشفرة أثناء النقل
- استخدام HTTPS لجميع الاتصالات
- عدم تخزين كلمات المرور في السجلات

### 2. **معلومات الجلسة**
- تسجيل معلومات الجهاز والموقع
- تتبع عمليات تسجيل الدخول المشبوهة
- تنبيهات أمنية فورية

### 3. **انتهاء الصلاحية**
- جميع الرموز لها مدة صلاحية محددة
- تنظيف تلقائي للرموز المنتهية الصلاحية
- حدود زمنية لمنع الإساءة

## 📊 المراقبة والسجلات

### 1. **سجلات الإيميل**
```sql
-- جدول email_logs في قاعدة البيانات
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  email_type TEXT NOT NULL,
  status TEXT NOT NULL, -- 'sent', 'failed', 'pending'
  provider TEXT NOT NULL, -- 'resend', 'smtp', etc.
  message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. **إحصائيات الإرسال**
- معدل نجاح الإرسال
- أوقات الاستجابة
- أنواع الأخطاء الشائعة
- استخدام مقدمي الخدمة

## 🧪 الاختبار

### 1. **اختبار محلي**

```typescript
// في بيئة التطوير
import { UnifiedEmailService } from './lib/unifiedEmailService';

// اختبار إرسال كلمة مرور مؤقتة
const testTempPassword = async () => {
  const result = await UnifiedEmailService.sendTemporaryPassword(
    'test@example.com',
    'TEST123',
    new Date(Date.now() + 3600000).toISOString(), // ساعة من الآن
    'مستخدم تجريبي'
  );
  console.log('نتيجة الاختبار:', result);
};
```

### 2. **اختبار التيمبليت**

```typescript
import { UnifiedEmailTemplateSystem, UnifiedEmailTemplates } from './lib/unifiedEmailTemplateSystem';

// إنشاء تيمبليت للمعاينة
const testTemplate = UnifiedEmailTemplates.temporaryPassword('ABC123', '2025-09-20T10:00:00Z', 'أحمد');
const template = UnifiedEmailTemplateSystem.generateUnifiedTemplate(testTemplate);

// حفظ HTML للمعاينة
console.log(template.htmlContent);
```

## 🔄 الترقية من النظام القديم

### 1. **التوافق مع النظام القديم**
النظام الجديد متوافق مع النظام القديم ويمكن استخدامهما معاً:

```typescript
// النظام القديم (لا يزال يعمل)
import { createUnifiedEmailTemplate, EmailTemplates } from './unifiedEmailTemplate';

// النظام الجديد (مُحسَّن)
import { UnifiedEmailService, UnifiedEmailTemplates } from './unifiedEmailService';
```

### 2. **خطة الترقية التدريجية**
1. ✅ إنشاء النظام الموحد الجديد
2. ✅ تحديث خدمة كلمة المرور المؤقتة
3. ✅ تحديث خدمة التحقق الثنائي
4. 🔄 تحديث خدمة إشعارات تسجيل الدخول
5. 🔄 تحديث خدمة تغيير بيانات التواصل
6. 📝 إزالة النظام القديم (بعد التأكد من الاستقرار)

## 📈 الأداء والتحسينات

### 1. **تحسينات الأداء**
- تحميل lazy للتيمبليت
- ضغط HTML وCSS
- استخدام CDN للخطوط والموارد
- تخزين مؤقت للتيمبليت المُنشأة

### 2. **معالجة الأخطاء**
- إعادة المحاولة التلقائية
- نظام fallback للنظام القديم
- تسجيل مفصل للأخطاء
- تنبيهات المطورين

## 🎯 الخطوات التالية

### المرحلة الحالية ✅
- [x] إنشاء النظام الأساسي
- [x] تطوير خدمة الإرسال الموحدة
- [x] إنشاء Edge Function
- [x] تحديث خدمة كلمة المرور المؤقتة
- [x] تحديث خدمة التحقق الثنائي

### المرحلة التالية 🔄
- [ ] تحديث خدمة إشعارات تسجيل الدخول
- [ ] تحديث خدمة تغيير بيانات التواصل
- [ ] اختبار شامل لجميع أنواع الإيميلات
- [ ] تحسين الأداء والاستقرار

### المرحلة المستقبلية 📋
- [ ] إضافة قوالب جديدة (ترحيب، تأكيد التسجيل، إلخ)
- [ ] دعم اللغة الإنجليزية
- [ ] نظام إدارة القوالب من لوحة الإدارة
- [ ] تحليلات متقدمة للإيميلات

## 🆘 استكشاف الأخطاء

### 1. **مشاكل شائعة**

#### خطأ في إرسال الإيميل
```typescript
// التحقق من إعدادات SMTP
const { data: smtpSettings } = await supabase
  .from('smtp_settings')
  .select('*')
  .eq('is_active', true);

if (!smtpSettings) {
  console.error('إعدادات SMTP غير موجودة');
}
```

#### مشكلة في التيمبليت
```typescript
// التحقق من صحة البيانات
const validateEmailData = (data: UnifiedEmailData) => {
  if (!data.title || !data.heading || !data.description) {
    throw new Error('بيانات التيمبليت غير مكتملة');
  }
};
```

### 2. **أدوات التشخيص**

```typescript
// في الكونسول (بيئة التطوير)
window.testUnifiedEmail = async (type: string) => {
  // اختبار سريع لأنواع الإيميلات المختلفة
};

window.checkEmailLogs = async () => {
  // فحص سجلات الإيميل الأخيرة
};
```

## 📞 الدعم والمساعدة

للحصول على المساعدة أو الإبلاغ عن مشاكل:

1. **مراجعة السجلات**: تحقق من سجلات الكونسول والقاعدة
2. **اختبار التيمبليت**: استخدم أدوات الاختبار المدمجة
3. **فحص الإعدادات**: تأكد من صحة إعدادات SMTP
4. **التوثيق**: راجع هذا الملف والتعليقات في الكود

---

## 📝 سجل التحديثات

### الإصدار 1.0.0 (19-09-2025)
- ✨ إطلاق النظام الموحد للتيمبليت
- 🎨 تصميم موحد وجميل لجميع الإيميلات
- 🔧 دعم 4 أنواع رئيسية من الإيميلات
- 📱 تصميم متجاوب ودعم RTL كامل
- 🔒 تحسينات أمنية وتشفير البيانات
- 📊 نظام سجلات ومراقبة متقدم

---

**© 2025 رزقي - منصة الزواج الإسلامي الشرعي**  
**تم تطوير هذا النظام بعناية لضمان أفضل تجربة للمستخدمين** 🕌
