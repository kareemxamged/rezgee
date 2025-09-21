# شرح نظام الإشعارات البريدية
## Notification Email System Explanation

**رزقي - منصة الزواج الإسلامي الشرعي**  
**Rezge - Islamic Marriage Platform**

---

## 🎯 كيف يعمل النظام؟
## How Does the System Work?

### 📋 **المبدأ الأساسي:**
### 📋 **Basic Principle:**

النظام يراقب **جميع الإشعارات الجديدة** (آخر 24 ساعة) ويرسل إيميلات لها، **بغض النظر عن كونها مقروءة أم لا**.

The system monitors **all new notifications** (last 24 hours) and sends emails for them, **regardless of whether they are read or not**.

---

## 🔄 آلية العمل:
## Working Mechanism:

### 1. **المراقبة المستمرة:**
### 1. **Continuous Monitoring:**

```typescript
// النظام يفحص كل 15 ثانية
setInterval(async () => {
  await this.processUnreadNotifications();
}, 15000);
```

### 2. **جلب الإشعارات الجديدة:**
### 2. **Fetch New Notifications:**

```typescript
const { data: notifications } = await supabase
  .from('notifications')
  .select(`...`)
  .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // آخر 24 ساعة
  .limit(this.config.batchSize)
  .order('created_at', { ascending: true });
```

**المهم:** النظام لا يهتم بحالة `is_read` - يفحص جميع الإشعارات الجديدة!  
**Important:** The system doesn't care about `is_read` status - it checks all new notifications!

### 3. **منع الإرسال المكرر:**
### 3. **Prevent Duplicate Sending:**

```typescript
// التحقق من عدم إرسال إيميل لهذا الإشعار من قبل
const emailStatus = await this.getEmailStatus(notification.id);
if (emailStatus && emailStatus.email_status === 'sent') {
  this.log('debug', `⏭️ تم تخطي الإشعار ${notification.id} - تم إرسال إيميل من قبل`);
  continue;
}
```

---

## 📊 أمثلة عملية:
## Practical Examples:

### **مثال 1: الإعجاب**
### **Example 1: Like**

1. **المستخدم (أ) يعجب بالمستخدم (ب)**
2. **يتم إنشاء إشعار في قاعدة البيانات**
3. **النظام يكتشف الإشعار الجديد خلال 15 ثانية**
4. **يرسل إيميل للمستخدم (ب) فوراً**
5. **يسجل في جدول التتبع أن الإيميل تم إرساله**

### **مثال 2: مشاهدة الملف الشخصي**
### **Example 2: Profile View**

1. **المستخدم (أ) يشاهد ملف المستخدم (ب)**
2. **يتم إنشاء إشعار في قاعدة البيانات**
3. **النظام يكتشف الإشعار الجديد خلال 15 ثانية**
4. **يرسل إيميل للمستخدم (ب) فوراً**
5. **يسجل في جدول التتبع أن الإيميل تم إرساله**

---

## ⚡ الميزات الرئيسية:
## ⚡ Key Features:

### ✅ **عمل مستقل:**
- يعمل بدون تسجيل دخول المستخدمين
- يعمل 24/7 في الخلفية
- لا يحتاج تدخل المستخدم

### ✅ **مراقبة ذكية:**
- يفحص الإشعارات الجديدة فقط (آخر 24 ساعة)
- لا يهتم بحالة القراءة (`is_read`)
- يتجنب الإرسال المكرر

### ✅ **إرسال فوري:**
- يرسل الإيميلات خلال 15 ثانية من إنشاء الإشعار
- يعمل لجميع أنواع الإشعارات
- يضمن وصول الإيميلات للمستخدمين

---

## 🎯 أنواع الإشعارات المدعومة:
## 🎯 Supported Notification Types:

| النوع | الوصف | مثال |
|-------|--------|------|
| **like** | الإعجاب | شخص أعجب بحسابك |
| **profile_view** | مشاهدة الملف | شخص شاهد ملفك الشخصي |
| **message** | رسالة جديدة | شخص أرسل لك رسالة |
| **match** | مطابقة جديدة | حدثت مطابقة جديدة |
| **report_received** | استلام بلاغ | تم الإبلاغ عنك |
| **report_accepted** | قبول بلاغ | تم قبول البلاغ ضدك |
| **report_rejected** | رفض بلاغ | تم رفض البلاغ ضدك |
| **verification_approved** | قبول توثيق | تم قبول طلب التوثيق |
| **verification_rejected** | رفض توثيق | تم رفض طلب التوثيق |
| **system** | إشعار نظام | إشعارات النظام العامة |

---

## 🔍 مثال كامل:
## 🔍 Complete Example:

### **السيناريو:**
المستخدم "أحمد" يعجب بالمستخدمة "فاطمة"

### **ما يحدث:**

1. **إنشاء الإشعار:**
```sql
INSERT INTO notifications (
  user_id, from_user_id, type, title, message, created_at
) VALUES (
  'fatemah_id', 'ahmed_id', 'like', 'إعجاب جديد', 'أحمد أعجب بحسابك', NOW()
);
```

2. **اكتشاف النظام:**
```
📧 تم العثور على 1 إشعار جديد
```

3. **إرسال الإيميل:**
```
✅ تم إرسال إشعار بريدي: like للمستخدم fatemah_id
```

4. **تسجيل التتبع:**
```sql
INSERT INTO notification_email_tracking (
  notification_id, email_status, email_sent_at
) VALUES (
  'notification_id', 'sent', NOW()
);
```

---

## 📈 الإحصائيات:
## 📈 Statistics:

النظام يحتفظ بإحصائيات مفصلة:

- **عدد الإشعارات المعالجة**
- **عدد الإيميلات المرسلة**
- **عدد الإيميلات الفاشلة**
- **معدل النجاح**
- **وقت التشغيل**

---

## 🎉 الخلاصة:
## 🎉 Summary:

**النظام يعمل بشكل مثالي!**

- ✅ يراقب جميع الإشعارات الجديدة
- ✅ لا يهتم بحالة القراءة
- ✅ يرسل الإيميلات فوراً
- ✅ يتجنب الإرسال المكرر
- ✅ يعمل 24/7 بدون تدخل

**The system works perfectly!**

- ✅ Monitors all new notifications
- ✅ Doesn't care about read status
- ✅ Sends emails immediately
- ✅ Prevents duplicate sending
- ✅ Works 24/7 without intervention

---

**تاريخ التوضيح:** 2025-01-09  
**Explanation Date:** 2025-01-09

**فريق التطوير - رزقي**  
**Development Team - Rezge**






