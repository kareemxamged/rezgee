# تحليل صفحة "نسيت كلمة المرور" - رزقي

## 🔍 **كيف يعمل النظام حالياً:**

### **1. تدفق العمل:**

```
المستخدم يدخل الإيميل في صفحة "نسيت كلمة المرور"
    ↓
ForgotPasswordPage.tsx → onSubmit()
    ↓
sendTemporaryPasswordViaSupabase(email)
    ↓
createTemporaryPassword(email) - إنشاء كلمة مرور مؤقتة
    ↓
UnifiedEmailService.sendTemporaryPasswordEmail()
    ↓
AdvancedEmailService.generateEmailTemplate('temporary_password', data, language)
    ↓
createTemporaryPasswordTemplate() - إنشاء المحتوى
    ↓
إرسال الإيميل باستخدام SMTP
```

### **2. الملفات المشاركة:**

#### **الصفحة الرئيسية:**
- `src/components/ForgotPasswordPage.tsx` - واجهة المستخدم

#### **الخدمات:**
- `src/lib/temporaryPasswordService.ts` - إنشاء كلمة المرور المؤقتة
- `src/lib/unifiedEmailService.ts` - خدمة الإيميل الموحدة
- `src/lib/finalEmailService.ts` - إنشاء قوالب الإيميل

### **3. القوالب المستخدمة حالياً:**

#### **في `finalEmailService.ts` - دالة `createTemporaryPasswordTemplate`:**

**النسخة العربية:**
```typescript
const content = {
  ar: {
    title: 'كلمة المرور المؤقتة - رزقي',
    heading: 'كلمة المرور المؤقتة',
    greeting: `السلام عليكم ${data.recipientName || 'عزيزي المستخدم'}،`,
    description: 'تم إنشاء كلمة مرور مؤقتة لحسابك في موقع رزقي للزواج الإسلامي. استخدم كلمة المرور أدناه لتسجيل الدخول وتعيين كلمة مرور جديدة:',
    passwordLabel: 'كلمة المرور المؤقتة',
    instructions: 'تعليمات الاستخدام:',
    step1: '1. اذهب إلى صفحة تسجيل الدخول في موقع رزقي',
    step2: '2. أدخل بريدك الإلكتروني وكلمة المرور المؤقتة أعلاه',
    step3: '3. ستتم مطالبتك بتعيين كلمة مرور جديدة وآمنة',
    validUntil: `صالحة حتى: ${expiryTime}`,
    securityNote: 'ملاحظة أمنية: لا تشارك كلمة المرور هذه مع أي شخص. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا الإيميل.',
    footer: 'فريق رزقي - موقع الزواج الإسلامي الشرعي'
  }
};
```

**النسخة الإنجليزية:**
```typescript
const content = {
  en: {
    title: 'Temporary Password - Rezge',
    heading: 'Temporary Password',
    greeting: `Hello ${data.recipientName || 'Dear User'},`,
    description: 'A temporary password has been created for your Rezge Islamic marriage account. Use the password below to log in and set a new password:',
    passwordLabel: 'Temporary Password',
    instructions: 'Usage Instructions:',
    step1: '1. Go to the Rezge login page',
    step2: '2. Enter your email and the temporary password above',
    step3: '3. You will be prompted to set a new secure password',
    validUntil: `Valid until: ${expiryTime}`,
    securityNote: 'Security Note: Do not share this password with anyone. If you didn\'t request a password reset, please ignore this email.',
    footer: 'Rezge Team - Islamic Marriage Platform'
  }
};
```

### **4. HTML Template:**

```html
<div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
  <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 5px; margin: 0; font-family: monospace;">${data.temporaryPassword}</h1>
</div>

<div style="background: #dcfce7; border-radius: 10px; padding: 20px; margin: 30px 0; border-right: 4px solid #16a34a;">
  <h3 style="color: #166534; font-size: 18px; margin: 0 0 15px 0;">📋 ${t.instructions}</h3>
  <div style="color: #166534; line-height: 1.8; font-size: 15px;">
    <p style="margin: 8px 0;">${t.step1}</p>
    <p style="margin: 8px 0;">${t.step2}</p>
    <p style="margin: 8px 0;">${t.step3}</p>
  </div>
</div>

<div style="background: #fef3c7; border-radius: 10px; padding: 20px; margin: 20px 0; border-right: 4px solid #f59e0b;">
  <p style="color: #92400e; margin: 0 0 10px 0; font-weight: bold;">⏰ ${t.validUntil}</p>
  <p style="color: #92400e; margin: 0; line-height: 1.6; font-size: 14px;">${t.securityNote}</p>
</div>
```

### **5. Text Content:**

```
السلام عليكم عزيزي المستخدم،

تم إنشاء كلمة مرور مؤقتة لحسابك في موقع رزقي للزواج الإسلامي. استخدم كلمة المرور أدناه لتسجيل الدخول وتعيين كلمة مرور جديدة:

كلمة المرور المؤقتة: [PASSWORD]

تعليمات الاستخدام:
1. اذهب إلى صفحة تسجيل الدخول في موقع رزقي
2. أدخل بريدك الإلكتروني وكلمة المرور المؤقتة أعلاه
3. ستتم مطالبتك بتعيين كلمة مرور جديدة وآمنة

صالحة حتى: [EXPIRY_TIME]

ملاحظة أمنية: لا تشارك كلمة المرور هذه مع أي شخص. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا الإيميل.

---
فريق رزقي - موقع الزواج الإسلامي الشرعي
https://rezge.com
```

## 🎯 **الخطة المقترحة:**

### **المرحلة 1: إنشاء قالب في قاعدة البيانات**

1. **إنشاء قالب `temporary_password` في جدول `email_templates`:**
   - النسخة العربية مع المحتوى الحالي
   - النسخة الإنجليزية مع المحتوى الحالي
   - HTML template للنسختين
   - Text content للنسختين

2. **إنشاء نوع إشعار `temporary_password` في جدول `email_notification_types`**

### **المرحلة 2: تحديث النظام ليستخدم قاعدة البيانات**

1. **تعديل `UnifiedEmailService.sendTemporaryPasswordEmail()`:**
   - استخدام `DatabaseEmailService.getEmailTemplate('temporary_password', language)`
   - استخدام البيانات من قاعدة البيانات بدلاً من الكود المدمج

2. **تحديث `finalEmailService.ts`:**
   - إزالة `createTemporaryPasswordTemplate` أو جعلها تستخدم قاعدة البيانات

### **المرحلة 3: اختبار النظام**

1. **اختبار النسخة العربية**
2. **اختبار النسخة الإنجليزية**
3. **التحقق من أن المحتوى مطابق للمحتوى الحالي**

## 📋 **الخطوات التالية:**

1. **إنشاء SQL script لإدراج قالب كلمة المرور المؤقتة**
2. **تحديث النظام ليستخدم قاعدة البيانات**
3. **اختبار النظام**
4. **التحقق من أن المحتوى مطابق للمحتوى الحالي**

هل تريد أن نبدأ بإنشاء SQL script لإدراج قالب كلمة المرور المؤقتة في قاعدة البيانات؟







