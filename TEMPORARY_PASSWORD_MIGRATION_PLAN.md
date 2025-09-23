# خطة نقل قالب كلمة المرور المؤقتة إلى قاعدة البيانات

## 🎯 **الهدف:**
نقل قالب كلمة المرور المؤقتة من الكود المدمج إلى قاعدة البيانات ليتم التحكم فيه من لوحة الإدارة.

## 📋 **الخطوات:**

### **المرحلة 1: إدراج القالب في قاعدة البيانات**

#### **1.1 تشغيل SQL Script:**
```sql
\i add_temporary_password_template.sql
```

#### **1.2 التحقق من النتائج:**
- ✅ إنشاء نوع إشعار `temporary_password`
- ✅ إنشاء قالب `temporary_password` مع النسختين العربية والإنجليزية
- ✅ HTML templates للنسختين
- ✅ Text content للنسختين

### **المرحلة 2: تحديث النظام ليستخدم قاعدة البيانات**

#### **2.1 تحديث `UnifiedEmailService.sendTemporaryPasswordEmail()`:**

**قبل التحديث:**
```typescript
static async sendTemporaryPasswordEmail(
  email: string,
  temporaryPassword: string,
  expiresAt: string,
  recipientName?: string,
  language: 'ar' | 'en' = 'ar'
): Promise<EmailResult> {
  try {
    // استيراد finalEmailService
    const { AdvancedEmailService } = await import('./finalEmailService');
    
    // استخدام تيمبليت كلمة المرور المؤقتة من finalEmailService
    const template = AdvancedEmailService.generateEmailTemplate('temporary_password', {
      temporaryPassword,
      expiresAt,
      recipientName
    }, language);

    return await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.htmlContent,
      text: template.textContent,
      type: 'temporary_password'
    }, 'security', language);
  } catch (error) {
    // معالجة الخطأ...
  }
}
```

**بعد التحديث:**
```typescript
static async sendTemporaryPasswordEmail(
  email: string,
  temporaryPassword: string,
  expiresAt: string,
  recipientName?: string,
  language: 'ar' | 'en' = 'ar'
): Promise<EmailResult> {
  try {
    // استيراد DatabaseEmailService
    const { DatabaseEmailService } = await import('./databaseEmailService');
    
    // جلب القالب من قاعدة البيانات
    const template = await DatabaseEmailService.getEmailTemplate('temporary_password', language);
    
    if (!template) {
      throw new Error(`لم يتم العثور على قالب كلمة المرور المؤقتة: ${language}`);
    }

    // استبدال المتغيرات في المحتوى
    const processedContent = this.processTemplateVariables(template, {
      temporaryPassword,
      expiresAt,
      recipientName: recipientName || (language === 'ar' ? 'عزيزي المستخدم' : 'Dear User')
    });

    return await this.sendEmail({
      to: email,
      subject: processedContent.subject,
      html: processedContent.htmlContent,
      text: processedContent.textContent,
      type: 'temporary_password'
    }, 'security', language);
  } catch (error) {
    // معالجة الخطأ...
  }
}
```

#### **2.2 إضافة دالة معالجة المتغيرات:**

```typescript
private static processTemplateVariables(template: any, variables: any): any {
  const processText = (text: string): string => {
    let processed = text;
    Object.keys(variables).forEach(key => {
      const placeholder = `{{${key}}}`;
      processed = processed.replace(new RegExp(placeholder, 'g'), variables[key] || '');
    });
    return processed;
  };

  return {
    subject: processText(template.subject_ar || template.subject_en),
    htmlContent: processText(template.html_template_ar || template.html_template_en),
    textContent: processText(template.content_ar || template.content_en)
  };
}
```

### **المرحلة 3: اختبار النظام**

#### **3.1 اختبار النسخة العربية:**
1. ✅ فتح صفحة "نسيت كلمة المرور"
2. ✅ إدخال إيميل صحيح
3. ✅ الضغط على "إرسال كلمة المرور المؤقتة"
4. ✅ التحقق من وصول الإيميل
5. ✅ التحقق من أن المحتوى مطابق للمحتوى الحالي

#### **3.2 اختبار النسخة الإنجليزية:**
1. ✅ تغيير اللغة إلى الإنجليزية
2. ✅ فتح صفحة "نسيت كلمة المرور"
3. ✅ إدخال إيميل صحيح
4. ✅ الضغط على "إرسال كلمة المرور المؤقتة"
5. ✅ التحقق من وصول الإيميل بالإنجليزية
6. ✅ التحقق من أن المحتوى مطابق للمحتوى الحالي

#### **3.3 اختبار لوحة الإدارة:**
1. ✅ فتح صفحة "الإشعارات البريدية" في لوحة الإدارة
2. ✅ التحقق من ظهور قالب `temporary_password` في القائمة
3. ✅ اختبار تعديل القالب من لوحة الإدارة
4. ✅ اختبار إرسال إيميل تجريبي من لوحة الإدارة

### **المرحلة 4: التحقق من التوافق**

#### **4.1 التحقق من أن المحتوى مطابق:**
- ✅ النسخة العربية مطابقة للمحتوى الحالي
- ✅ النسخة الإنجليزية مطابقة للمحتوى الحالي
- ✅ HTML template يعمل بشكل صحيح
- ✅ Text content يعمل بشكل صحيح

#### **4.2 التحقق من المتغيرات:**
- ✅ `{{temporaryPassword}}` يتم استبدالها بشكل صحيح
- ✅ `{{expiryTime}}` يتم استبدالها بشكل صحيح
- ✅ `{{recipientName}}` يتم استبدالها بشكل صحيح

## 🔧 **الملفات التي سيتم تعديلها:**

### **1. `src/lib/unifiedEmailService.ts`:**
- ✅ تحديث `sendTemporaryPasswordEmail()` لاستخدام قاعدة البيانات
- ✅ إضافة `processTemplateVariables()`

### **2. `src/lib/databaseEmailService.ts`:**
- ✅ التأكد من أن `getEmailTemplate()` يعمل بشكل صحيح

### **3. قاعدة البيانات:**
- ✅ إدراج نوع إشعار `temporary_password`
- ✅ إدراج قالب `temporary_password` مع النسختين

## 📊 **المقارنة:**

### **قبل التحديث:**
- ❌ القالب مدمج في الكود
- ❌ لا يمكن تعديله من لوحة الإدارة
- ❌ لا يمكن إدارة النسختين بشكل منفصل
- ❌ صعب الصيانة والتطوير

### **بعد التحديث:**
- ✅ القالب في قاعدة البيانات
- ✅ يمكن تعديله من لوحة الإدارة
- ✅ يمكن إدارة النسختين بشكل منفصل
- ✅ سهولة الصيانة والتطوير
- ✅ يمكن إضافة قوالب جديدة بسهولة

## 🚀 **الفوائد:**

1. **المرونة:** يمكن تعديل القوالب من لوحة الإدارة
2. **الإدارة:** يمكن إدارة النسختين العربية والإنجليزية بشكل منفصل
3. **الصيانة:** سهولة الصيانة والتطوير
4. **التوسع:** يمكن إضافة قوالب جديدة بسهولة
5. **التحكم:** تحكم كامل في المحتوى والشكل

## ⚠️ **ملاحظات مهمة:**

1. **النسخ الاحتياطي:** تأكد من عمل نسخة احتياطية قبل التحديث
2. **الاختبار:** اختبر النظام جيداً قبل النشر
3. **المتغيرات:** تأكد من أن جميع المتغيرات تعمل بشكل صحيح
4. **التوافق:** تأكد من أن المحتوى الجديد مطابق للمحتوى الحالي

## 🎯 **النتيجة المتوقعة:**

بعد إكمال هذه الخطة، سيكون قالب كلمة المرور المؤقتة:
- ✅ في قاعدة البيانات
- ✅ قابل للتعديل من لوحة الإدارة
- ✅ يدعم النسختين العربية والإنجليزية
- ✅ يعمل بنفس الطريقة الحالية
- ✅ يمكن إدارته بسهولة







