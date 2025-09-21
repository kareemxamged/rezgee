# 📧 نظام SMTP المستقل - دليل التشغيل

## 🎯 نظرة عامة
تم إنشاء نظام إرسال بريدي مستقل بالكامل لموقع رزقي، بدون الاعتماد على أي خدمات خارجية.

## 🏗️ مكونات النظام

### 1. خادم SMTP المستقل (`smtp-server.js`)
- خادم Node.js يعمل على البورت 3001
- يستخدم مكتبة `nodemailer` للإرسال المباشر
- يدعم SMTP آمن مع تشفير SSL/TLS

### 2. Service Worker (`public/smtp-worker.js`)
- يعمل في الخلفية في المتصفح
- يتعامل مع طلبات الإرسال
- يوفر نظام fallback ذكي

### 3. نظام الإرسال المحدث (`finalEmailService.ts`)
- تم إعادة تصميمه ليستخدم النظام المستقل
- يدعم أنواع مختلفة من الإيميلات
- معالجة أخطاء شاملة

## 🚀 خطوات التشغيل

### الخطوة 1: تثبيت Node.js
تأكد من وجود Node.js على النظام (الإصدار 14 أو أحدث)

### الخطوة 2: تثبيت المكتبات
```bash
# انسخ ملف package.json
cp smtp-package.json package.json

# ثبت المكتبات المطلوبة
npm install nodemailer cors

# أو استخدم الأمر المختصر
npm run install-deps
```

### الخطوة 3: تشغيل خادم SMTP
```bash
# تشغيل الخادم
node smtp-server.js

# أو للتطوير مع إعادة التشغيل التلقائي
npm install -g nodemon
npm run dev
```

### الخطوة 4: التحقق من عمل الخادم
```bash
# اختبار حالة الخادم
curl http://localhost:3001/status

# أو افتح في المتصفح
# http://localhost:3001/status
```

## 📋 إعدادات SMTP

### الإعدادات الحالية (Hostinger)
```javascript
{
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  user: 'manage@kareemamged.com',
  pass: 'Kareem@2024'
}
```

### تخصيص الإعدادات
يمكنك تعديل إعدادات SMTP في ملف `smtp-server.js`:

```javascript
const smtpConfig = {
  host: 'your-smtp-server.com',
  port: 587, // أو 465 للـ SSL
  secure: false, // true للـ SSL
  auth: {
    user: 'your-email@domain.com',
    pass: 'your-password'
  }
};
```

## 🧪 اختبار النظام

### 1. اختبار خادم SMTP
```bash
# اختبار إرسال إيميل
curl -X POST http://localhost:3001/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "emailData": {
      "to": "test@example.com",
      "subject": "اختبار",
      "text": "رسالة اختبار",
      "html": "<h1>رسالة اختبار</h1>"
    }
  }'
```

### 2. اختبار من التطبيق
- افتح صفحة "نسيت الباسوورد"
- أدخل بريد إلكتروني صحيح
- راقب الكونسول للتأكد من الإرسال

## 🔧 استكشاف الأخطاء

### مشكلة: الخادم لا يعمل
```bash
# تحقق من البورت
netstat -an | grep 3001

# تحقق من العمليات
ps aux | grep node
```

### مشكلة: فشل الاتصال بـ SMTP
- تحقق من إعدادات الشبكة
- تأكد من صحة بيانات SMTP
- تحقق من إعدادات الجدار الناري

### مشكلة: Service Worker لا يعمل
- تأكد من أن الملف في مجلد `public`
- افتح Developer Tools → Application → Service Workers
- تحقق من تسجيل Service Worker

## 📊 مراقبة النظام

### سجلات الخادم
```bash
# عرض السجلات المباشرة
tail -f smtp-server.log

# أو استخدم PM2 للإدارة المتقدمة
npm install -g pm2
pm2 start smtp-server.js --name "rezge-smtp"
pm2 logs rezge-smtp
```

### مراقبة الأداء
- راقب استخدام الذاكرة والمعالج
- تتبع عدد الإيميلات المرسلة
- مراقبة أوقات الاستجابة

## 🔒 الأمان

### حماية بيانات SMTP
- لا تشارك كلمات المرور في الكود
- استخدم متغيرات البيئة:
```bash
export SMTP_USER="manage@kareemamged.com"
export SMTP_PASS="Kareem@2024"
```

### تشفير الاتصالات
- استخدم SSL/TLS دائماً
- تحقق من شهادات الأمان
- فعل `rejectUnauthorized: false` فقط للاختبار

## 🚀 النشر في الإنتاج

### 1. استخدام PM2
```bash
pm2 start smtp-server.js --name "rezge-smtp"
pm2 startup
pm2 save
```

### 2. إعداد Nginx (اختياري)
```nginx
location /smtp/ {
    proxy_pass http://localhost:3001/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### 3. إعداد SSL
```bash
# استخدام Let's Encrypt
certbot --nginx -d yourdomain.com
```

## 📈 تحسينات مستقبلية

### 1. قاعدة بيانات للسجلات
- حفظ سجل الإيميلات المرسلة
- تتبع حالات الفشل
- إحصائيات الاستخدام

### 2. نظام طوابير
- طابور للإيميلات المؤجلة
- إعادة المحاولة التلقائية
- توزيع الحمولة

### 3. واجهة إدارة
- لوحة تحكم ويب
- مراقبة مباشرة
- إعدادات ديناميكية

## 📞 الدعم الفني

إذا واجهت أي مشاكل:
1. تحقق من السجلات
2. راجع إعدادات SMTP
3. اختبر الاتصال بالخادم
4. تأكد من عمل Service Worker

---

**ملاحظة**: هذا النظام مصمم ليكون مستقلاً بالكامل ولا يعتمد على أي خدمات خارجية. جميع الإيميلات تُرسل مباشرة عبر خادم SMTP الخاص بك.
