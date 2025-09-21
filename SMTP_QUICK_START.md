# 🚀 تشغيل خادم SMTP - دليل سريع

## ⚡ التشغيل السريع (3 خطوات)

### 1️⃣ تثبيت المتطلبات
```bash
npm install nodemailer
```

### 2️⃣ تشغيل الخادم
```bash
# على Windows
start-smtp-server.bat

# على Mac/Linux
node smtp-server.js
```

### 3️⃣ اختبار الخادم
```bash
node test-smtp-server.js
```

---

## 📱 للاستخدام مع التطبيق

### في البيئة المحلية:
1. شغل الخادم المحلي على البورت 3001
2. التطبيق سيستخدم `http://localhost:3001` تلقائياً

### في الإنتاج (Vercel/Netlify):
1. ارفع الخادم على منصة مثل Heroku أو Railway
2. أضف URL الخادم في متغيرات البيئة:
   ```env
   SMTP_SERVER_URL=https://your-smtp-server.herokuapp.com
   ```

---

## 🔧 إعدادات SMTP الحالية

- **الخادم:** smtp.hostinger.com
- **البورت:** 465 (SSL)
- **المستخدم:** manage@kareemamged.com
- **كلمة المرور:** Kareem@2024

---

## 📊 مراقبة الخادم

### رسائل النجاح:
```
🚀 خادم SMTP المستقل يعمل الآن!
📡 العنوان: http://localhost:3001
✅ تم إرسال الإيميل بنجاح
```

### رسائل الخطأ:
```
❌ SMTP Connection Error
❌ فشل إرسال الإيميل
```

---

## 🆘 حل المشاكل السريع

| المشكلة | الحل |
|---------|------|
| `ECONNREFUSED` | تأكد من تشغيل الخادم |
| `Authentication failed` | تحقق من بيانات SMTP |
| `Port already in use` | غير البورت أو أوقف العملية |
| `Module not found` | شغل `npm install` |

---

## 📞 اختبار سريع

```bash
# اختبار حالة الخادم
curl http://localhost:3001/status

# اختبار إرسال بريد
curl -X POST http://localhost:3001/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"اختبار","html":"<h1>مرحبا</h1>"}'
```

---

**💡 نصيحة:** احتفظ بالخادم يعمل في الخلفية أثناء تطوير التطبيق لضمان عمل إرسال البريد الإلكتروني.
