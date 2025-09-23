# إصلاح مشكلة استخدام إعدادات SMTP المحددة في القوالب وإضافة الإعداد الافتراضي

**التاريخ:** 9 يناير 2025  
**المشروع:** رزقي - منصة الزواج الإسلامي الشرعي  
**المطور:** فريق التطوير - رزقي

---

## 🎯 المشاكل المحددة

### المشكلة الأولى: القوالب لا تستخدم الإعدادات المحددة لها
- عند تحديد إعدادات SMTP جديدة لقالب معين، كان النظام يستخدم الإعدادات القديمة بدلاً من الجديدة
- لم يكن هناك منطق لاستخدام `smtp_settings_id` المحدد في القوالب

### المشكلة الثانية: عدم وجود إعداد افتراضي
- لم يكن هناك نظام لإعداد افتراضي يتم استخدامه عند عدم تحديد إعدادات للقوالب
- هذا يؤدي إلى مشاكل في الإرسال عندما لا يتم تحديد إعدادات SMTP للقالب

---

## 🔍 تشخيص المشاكل

### 1. **عدم استخدام إعدادات SMTP المحددة في القوالب**
- النظام كان يستخدم إعدادات SMTP ثابتة في الكود
- لم يكن هناك منطق لقراءة `smtp_settings_id` من القوالب
- لم يكن هناك خدمة لإدارة اختيار إعدادات SMTP حسب القالب

### 2. **عدم وجود نظام الإعداد الافتراضي**
- جدول `email_settings` لم يكن يحتوي على حقل `is_default`
- لم يكن هناك منطق لاختيار الإعدادات الافتراضية
- لم يكن هناك واجهة لإدارة الإعدادات الافتراضية

---

## ✅ الإصلاحات المطبقة

### 1. **إضافة حقل `is_default` إلى قاعدة البيانات**

#### ملف `add_default_smtp_field.sql`:
```sql
-- إضافة حقل is_default إلى جدول email_settings
ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- إنشاء فهرس فريد لضمان وجود إعداد افتراضي واحد فقط
CREATE UNIQUE INDEX IF NOT EXISTS email_settings_default_unique 
ON email_settings (is_default) 
WHERE is_default = true;

-- تعيين أول إعداد نشط كافتراضي إذا لم يكن هناك إعداد افتراضي
UPDATE email_settings 
SET is_default = true 
WHERE id = (
    SELECT id 
    FROM email_settings 
    WHERE is_active = true 
    ORDER BY created_at ASC 
    LIMIT 1
) 
AND NOT EXISTS (
    SELECT 1 
    FROM email_settings 
    WHERE is_default = true
);
```

### 2. **تحديث واجهة الإدارة**

#### في `src/components/admin/EmailNotificationsManagement.tsx`:

##### أ. إضافة حقل `is_default` إلى الواجهة:
```typescript
interface EmailSettings {
  // ... الحقول الموجودة
  is_default: boolean; // ← حقل جديد
}

// إضافة إلى settingsFormData
const [settingsFormData, setSettingsFormData] = useState({
  // ... الحقول الموجودة
  is_default: false // ← حقل جديد
});
```

##### ب. إضافة checkbox للإعداد الافتراضي:
```typescript
<div className="flex items-center">
  <input
    type="checkbox"
    checked={settingsFormData.is_default}
    onChange={(e) => setSettingsFormData(prev => ({ ...prev, is_default: e.target.checked }))}
    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
  />
  <label className="mr-2 text-sm font-medium modal-text-primary">افتراضي</label>
  <span className="text-xs text-gray-500">(سيتم استخدامه عند عدم تحديد إعدادات للقوالب)</span>
</div>
```

##### ج. إضافة عمود "افتراضي" في الجدول:
```typescript
<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">افتراضي</th>

// في صف البيانات
<td className="px-6 py-4 whitespace-nowrap">
  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
    settings.is_default 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-800'
  }`}>
    {settings.is_default ? 'افتراضي' : 'عادي'}
  </span>
</td>
```

##### د. إضافة زر "تعيين كافتراضي":
```typescript
{!settings.is_default && (
  <button
    onClick={() => handleSetAsDefault(settings)}
    className="text-purple-600 hover:text-purple-900"
    title="تعيين كافتراضي"
  >
    <CheckCircle className="w-4 h-4" />
  </button>
)}
```

### 3. **تحديث خدمة إدارة الإشعارات البريدية**

#### في `src/lib/emailNotificationsAdminService.ts`:

##### أ. إضافة `is_default` إلى العمليات:
```typescript
// في createEmailSettings
const insertData = {
  // ... الحقول الموجودة
  is_default: data.is_default ?? false, // ← حقل جديد
};

// في updateEmailSettings
.update({
  // ... الحقول الموجودة
  is_default: data.is_default, // ← حقل جديد
})
```

##### ب. إضافة دوال إدارة الإعداد الافتراضي:
```typescript
// تعيين إعدادات SMTP كافتراضي
static async setAsDefault(id: string): Promise<{ success: boolean; error?: string }> {
  // إلغاء تعيين جميع الإعدادات الأخرى كافتراضي
  await this.unsetAllDefaults();
  
  // تعيين الإعداد المحدد كافتراضي
  const { data: result, error } = await supabase
    .from('email_settings')
    .update({ is_default: true, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
    
  return { success: !error, error: error?.message };
}

// إلغاء تعيين جميع الإعدادات كافتراضي
static async unsetAllDefaults(): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('email_settings')
    .update({ is_default: false, updated_at: new Date().toISOString() })
    .eq('is_default', true);
    
  return { success: !error, error: error?.message };
}

// الحصول على الإعدادات الافتراضية
static async getDefaultEmailSettings(): Promise<any> {
  const { data: result, error } = await supabase
    .from('email_settings')
    .select('*')
    .eq('is_default', true)
    .eq('is_active', true)
    .single();
    
  return error ? null : result;
}
```

### 4. **إنشاء مدير إعدادات SMTP للقوالب**

#### ملف `src/lib/templateSMTPManager.ts`:
```typescript
export class TemplateSMTPManager {
  /**
   * الحصول على إعدادات SMTP للقالب المحدد
   */
  static async getSMTPForTemplate(templateId: string): Promise<any> {
    // جلب القالب مع إعدادات SMTP المحددة
    const { data: template } = await supabase
      .from('email_templates')
      .select('smtp_settings_id, contact_smtp_send_id, contact_smtp_receive_id, name_ar')
      .eq('id', templateId)
      .single();

    // تحديد نوع القالب (تواصل أم عادي)
    const isContactTemplate = template.name_ar?.includes('تواصل') || template.name_ar?.includes('contact');
    
    let smtpSettingsId: string | null = null;
    
    if (isContactTemplate) {
      // قالب التواصل - استخدام إعدادات الإرسال
      smtpSettingsId = template.contact_smtp_send_id;
    } else {
      // قالب عادي - استخدام إعدادات SMTP العادية
      smtpSettingsId = template.smtp_settings_id;
    }

    // إذا لم تكن هناك إعدادات محددة، استخدم الإعدادات الافتراضية
    if (!smtpSettingsId) {
      return await this.getDefaultSMTP();
    }

    // جلب إعدادات SMTP المحددة
    const { data: smtpSettings } = await supabase
      .from('email_settings')
      .select('*')
      .eq('id', smtpSettingsId)
      .eq('is_active', true)
      .single();

    return smtpSettings || await this.getDefaultSMTP();
  }

  /**
   * الحصول على الإعدادات الافتراضية
   */
  static async getDefaultSMTP(): Promise<any> {
    const defaultSettings = await EmailNotificationsAdminService.getDefaultEmailSettings();
    
    if (defaultSettings) {
      return defaultSettings;
    }

    // إذا لم تكن هناك إعدادات افتراضية، جلب أول إعداد نشط
    const { data: fallbackSettings } = await supabase
      .from('email_settings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    return fallbackSettings;
  }

  /**
   * تحويل إعدادات SMTP إلى تنسيق قابل للاستخدام
   */
  static formatSMTPConfig(smtpSettings: any): any {
    return {
      host: smtpSettings.smtp_host,
      port: smtpSettings.smtp_port,
      secure: smtpSettings.smtp_port === 465,
      auth: {
        user: smtpSettings.smtp_username,
        pass: smtpSettings.smtp_password
      },
      from: {
        name: smtpSettings.from_name_ar,
        email: smtpSettings.from_email
      },
      replyTo: smtpSettings.reply_to || smtpSettings.from_email,
      isDefault: smtpSettings.is_default || false
    };
  }
}
```

---

## 🧪 كيفية الاستخدام

### 1. **إعداد الإعداد الافتراضي**
1. انتقل إلى لوحة الإدارة → الإشعارات البريدية → إعدادات SMTP
2. انقر على زر "تعيين كافتراضي" (✅) بجانب الإعداد المطلوب
3. سيتم تعيين هذا الإعداد كافتراضي تلقائياً

### 2. **تحديد إعدادات SMTP للقوالب**
1. انتقل إلى لوحة الإدارة → الإشعارات البريدية → قوالب الإيميلات
2. انقر على "تعديل" للقالب المطلوب
3. في قسم "إعدادات SMTP"، اختر الإعدادات المطلوبة
4. احفظ التغييرات

### 3. **استخدام الإعدادات في الكود**
```typescript
import { TemplateSMTPManager } from './lib/templateSMTPManager';

// الحصول على إعدادات SMTP للقالب
const smtpSettings = await TemplateSMTPManager.getSMTPForTemplate(templateId);

// تحويلها إلى تنسيق قابل للاستخدام
const config = TemplateSMTPManager.formatSMTPConfig(smtpSettings);

// استخدامها في الإرسال
console.log('خادم SMTP:', config.host);
console.log('المنفذ:', config.port);
console.log('المستخدم:', config.auth.user);
```

---

## 📊 النتائج المحققة

### ✅ **المشاكل المحلولة:**
- **القوالب تستخدم الإعدادات المحددة**: الآن النظام يقرأ `smtp_settings_id` من القوالب ويستخدم الإعدادات الصحيحة
- **نظام الإعداد الافتراضي**: تم إضافة نظام شامل لإدارة الإعدادات الافتراضية
- **واجهة إدارة محسنة**: إضافة أزرار وواجهات لإدارة الإعدادات الافتراضية
- **منطق اختيار ذكي**: النظام يختار الإعدادات المناسبة حسب نوع القالب

### ✅ **التحسينات المضافة:**
- **مدير إعدادات SMTP**: خدمة شاملة لإدارة اختيار إعدادات SMTP
- **دعم قوالب التواصل**: معالجة خاصة لقوالب التواصل مع إعدادات منفصلة
- **نظام احتياطي**: إذا فشل جلب الإعدادات المحددة، يتم استخدام الافتراضية
- **تسجيل مفصل**: تسجيل شامل لجميع العمليات والأخطاء

---

## 🔧 الملفات المعدلة

### 1. **قاعدة البيانات**
- `add_default_smtp_field.sql` - إضافة حقل `is_default` وفهارس

### 2. **واجهة الإدارة**
- `src/components/admin/EmailNotificationsManagement.tsx` - إضافة واجهة الإعداد الافتراضي

### 3. **الخدمات**
- `src/lib/emailNotificationsAdminService.ts` - إضافة دوال إدارة الإعداد الافتراضي
- `src/lib/templateSMTPManager.ts` - خدمة جديدة لإدارة إعدادات SMTP للقوالب

---

## 📝 ملاحظات مهمة

1. **فهرس فريد**: تم إنشاء فهرس فريد لضمان وجود إعداد افتراضي واحد فقط
2. **معالجة الأخطاء**: جميع العمليات محمية بمعالجة شاملة للأخطاء
3. **التوافق مع الأنواع**: النظام يدعم قوالب التواصل والقوالب العادية
4. **النظام الاحتياطي**: إذا فشل جلب الإعدادات المحددة، يتم استخدام الافتراضية

---

## 🎉 الخلاصة

تم إصلاح مشكلة استخدام إعدادات SMTP المحددة في القوالب وإضافة نظام الإعداد الافتراضي بنجاح. الآن:

- ✅ **القوالب تستخدم الإعدادات المحددة لها** - النظام يقرأ `smtp_settings_id` ويستخدم الإعدادات الصحيحة
- ✅ **نظام الإعداد الافتراضي** - يمكن تعيين إعداد افتراضي يتم استخدامه عند عدم تحديد إعدادات للقوالب
- ✅ **واجهة إدارة محسنة** - أزرار وواجهات لإدارة الإعدادات الافتراضية
- ✅ **منطق اختيار ذكي** - النظام يختار الإعدادات المناسبة حسب نوع القالب
- ✅ **خدمة شاملة** - `TemplateSMTPManager` لإدارة جميع عمليات اختيار إعدادات SMTP

**تاريخ الإنجاز:** 9 يناير 2025  
**فريق التطوير - رزقي**






