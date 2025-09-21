# إعداد خادم SMTP محلي للاختبار - رزقي

## 🚀 إعداد سريع

### 1. تثبيت المتطلبات
```bash
# إنشاء مجلد جديد للخادم المحلي
mkdir local-smtp-server
cd local-smtp-server

# نسخ ملفات الخادم
copy ..\local-smtp-server.js .
copy ..\package-smtp.json package.json

# تثبيت المتطلبات
npm install
```

### 2. إعداد Gmail App Password
1. اذهب إلى [Google Account Settings](https://myaccount.google.com/)
2. اختر "Security" من القائمة الجانبية
3. في قسم "Signing in to Google"، اختر "2-Step Verification"
4. في أسفل الصفحة، اختر "App passwords"
5. اختر "Mail" و "Other (Custom name)"
6. اكتب "Rezge Local SMTP"
7. انسخ كلمة المرور التي تظهر (16 حرف)

### 3. تحديث إعدادات الخادم
افتح `local-smtp-server.js` وحدث:
```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'kemooamegoo@gmail.com', // بريدك الإلكتروني
    pass: 'your-16-character-app-password' // كلمة مرور التطبيق
  }
});
```

### 4. تشغيل الخادم
```bash
npm start
```

ستظهر رسالة:
```
🚀 خادم SMTP محلي يعمل على المنفذ 3001
📧 رابط الإرسال: http://localhost:3001/send-email
🧪 رابط الاختبار: http://localhost:3001/test
```

## 🧪 اختبار النظام

### 1. اختبار الخادم
افتح المتصفح واذهب إلى: `http://localhost:3001/test`

### 2. اختبار إرسال إيميل
```bash
curl -X POST http://localhost:3001/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "kemooamegoo@gmail.com",
    "subject": "اختبار إيميل",
    "html": "<h1>مرحباً!</h1><p>هذا اختبار لإرسال الإيميلات.</p>",
    "text": "مرحباً! هذا اختبار لإرسال الإيميلات.",
    "from": "رزقي - منصة الزواج الإسلامي الشرعي <kemooamegoo@gmail.com>"
  }'
```

### 3. اختبار من التطبيق
الآن عندما تقوم بإعجاب أو إرسال رسالة، سيتم إرسال الإيميل عبر الخادم المحلي.

## 🔧 استكشاف الأخطاء

### 1. خطأ "Authentication failed"
- تأكد من تفعيل 2-Step Verification
- تأكد من استخدام App Password وليس كلمة المرور العادية
- تأكد من صحة البريد الإلكتروني

### 2. خطأ "Connection timeout"
- تأكد من تشغيل الخادم على المنفذ 3001
- تأكد من عدم وجود جدار حماية يحجب المنفذ

### 3. خطأ "Invalid credentials"
- تأكد من صحة App Password (16 حرف)
- تأكد من عدم وجود مسافات إضافية

## 📧 أنواع الإيميلات المدعومة

1. **إيميل الإعجاب** - عند الإعجاب بمستخدم
2. **إيميل زيارة الملف الشخصي** - عند مشاهدة الملف الشخصي
3. **إيميل الرسالة الجديدة** - عند إرسال رسالة جديدة
4. **إيميل البلاغ** - عند الإبلاغ عن مستخدم
5. **إيميل تحديث حالة البلاغ** - عند قبول/رفض البلاغ
6. **إيميل تحديث حالة التوثيق** - عند قبول/رفض طلب التوثيق
7. **إيميل الحظر/إلغاء الحظر** - عند حظر أو إلغاء حظر المستخدم
8. **إيميل التنبيه الإداري** - عند إرسال تنبيه إداري

## 🎯 الخطوات التالية

1. **تشغيل الخادم المحلي** - للاختبار المحلي
2. **اختبار الإيميلات** - تأكد من وصولها
3. **تطبيق النظام** - في بيئة الإنتاج
4. **مراقبة الأداء** - من خلال السجلات

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من سجلات الخادم في Terminal
2. تحقق من سجلات المتصفح (F12)
3. تأكد من إعدادات Gmail App Password
4. تأكد من تشغيل الخادم على المنفذ الصحيح

---

**ملاحظة:** هذا الخادم مخصص للاختبار المحلي فقط. في بيئة الإنتاج، استخدم خدمات SMTP احترافية مثل SendGrid أو Mailgun.
```env
# إعدادات SMTP
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=manage@kareemamged.com
SMTP_PASS=Kareem@2024
SMTP_FROM_NAME=رزقي - موقع الزواج الإسلامي

# إعدادات الخادم
PORT=3001
NODE_ENV=production

# للإنتاج - URL الخادم المرفوع
SMTP_SERVER_URL=https://your-smtp-server.herokuapp.com
```

## 🚀 تشغيل الخادم

### للتطوير المحلي:

```bash
# تشغيل الخادم
npm start

# أو للتطوير مع إعادة التشغيل التلقائي
npm run dev
```

### للإنتاج:

```bash
# تشغيل الخادم في الإنتاج
NODE_ENV=production npm start
```

## 🧪 اختبار الخادم

### 1. اختبار حالة الخادم:

```bash
curl http://localhost:3001/status
```

### 2. اختبار إرسال بريد إلكتروني:

```bash
curl -X POST http://localhost:3001/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "اختبار خادم SMTP",
    "html": "<h1>مرحباً من رزقي!</h1>",
    "text": "مرحباً من رزقي!"
  }'
```

### 3. اختبار من التطبيق:

```typescript
import { LocalSMTPService } from './src/lib/localSMTPService';

// اختبار الاتصال
const isConnected = await LocalSMTPService.testConnection();
console.log('خادم SMTP متاح:', isConnected);

// إرسال بريد اختبار
const result = await LocalSMTPService.sendTestEmail('your-email@example.com');
console.log('نتيجة الاختبار:', result);
```

## 🌐 النشر على منصات الاستضافة

### Heroku:

```bash
# إنشاء تطبيق Heroku
heroku create your-smtp-server

# إعداد متغيرات البيئة
heroku config:set SMTP_HOST=smtp.hostinger.com
heroku config:set SMTP_PORT=465
heroku config:set SMTP_USER=manage@kareemamged.com
heroku config:set SMTP_PASS=Kareem@2024

# نشر التطبيق
git push heroku main
```

### Railway:

```bash
# ربط المشروع بـ Railway
railway login
railway init
railway up
```

### DigitalOcean App Platform:

1. إنشاء تطبيق جديد
2. ربط مستودع Git
3. إعداد متغيرات البيئة
4. نشر التطبيق

## 🔧 إعداد التطبيق الرئيسي

### 1. تحديث متغيرات البيئة في التطبيق:

```env
# في ملف .env للتطبيق الرئيسي
SMTP_SERVER_URL=https://your-smtp-server.herokuapp.com
```

### 2. استخدام الخدمة في التطبيق:

```typescript
// في temporaryPasswordService.ts
import { LocalSMTPService } from './localSMTPService';

const emailResult = await LocalSMTPService.sendEmail({
  to: email,
  subject: subject,
  html: htmlContent,
  text: textContent,
  type: 'temporary_password'
});
```

## 📊 مراقبة الخادم

### رسائل الكونسول:

```
🚀 خادم SMTP المستقل يعمل الآن!
📡 العنوان: http://localhost:3001
📧 جاهز لاستقبال طلبات الإرسال
⏰ الوقت: ٢٢‏/٣‏/١٤٤٧ هـ ٧:٤٥:٣٠ ص

📋 نقاط النهاية المتاحة:
   POST /send-email - إرسال إيميل
   GET  /status     - حالة الخادم
```

### عند إرسال بريد إلكتروني:

```
📧 استلام طلب إرسال إيميل...
📬 إرسال إلى: user@example.com
📝 الموضوع: كلمة المرور المؤقتة - رزقي
✅ تم إرسال الإيميل بنجاح
📧 Message ID: <message-id@smtp.hostinger.com>
```

## 🛡️ الأمان

### 1. حماية متغيرات البيئة:
- لا تضع كلمات المرور في الكود
- استخدم ملفات `.env` منفصلة
- أضف `.env` إلى `.gitignore`

### 2. تقييد الوصول:
```javascript
// إضافة تحقق من المصدر
const allowedOrigins = [
  'http://localhost:5173',
  'https://rezgee.vercel.app',
  'https://your-domain.com'
];
```

### 3. معدل الطلبات:
```javascript
// إضافة حد أقصى للطلبات
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // حد أقصى 100 طلب
};
```

## 🔍 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ ECONNREFUSED:**
   - تأكد من تشغيل الخادم
   - تحقق من رقم البورت

2. **خطأ SMTP Authentication:**
   - تحقق من بيانات SMTP
   - تأكد من تفعيل SMTP في حساب البريد

3. **خطأ CORS:**
   - أضف النطاق إلى قائمة المسموح بها
   - تحقق من إعدادات CORS

### سجلات مفيدة:

```bash
# عرض سجلات الخادم
tail -f smtp-server.log

# مراقبة استخدام الذاكرة
top -p $(pgrep -f smtp-server)
```

## 📈 تحسين الأداء

### 1. استخدام PM2 للإنتاج:

```bash
npm install -g pm2
pm2 start smtp-server.js --name "smtp-server"
pm2 startup
pm2 save
```

### 2. إعداد Load Balancer:

```javascript
// في حالة الحاجة لعدة خوادم
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // كود الخادم هنا
}
```

## 📞 الدعم

إذا واجهت أي مشاكل:

1. تحقق من سجلات الخادم
2. اختبر الاتصال بـ SMTP
3. تأكد من إعدادات الشبكة
4. راجع متغيرات البيئة

---

**ملاحظة:** هذا الخادم مصمم خصيصاً لموقع رزقي ويمكن تخصيصه حسب احتياجاتك الخاصة.
