# 🚀 دليل النشر الشامل على VPS Hostinger - رزقي
## Comprehensive Hostinger VPS Deployment Guide - Rezge

<div align="center">

[![Deployment](https://img.shields.io/badge/Deployment-Ready-green?style=for-the-badge)](https://github.com)
[![VPS](https://img.shields.io/badge/VPS-Hostinger-blue?style=for-the-badge)](https://hostinger.com)
[![Time](https://img.shields.io/badge/Time-60_Minutes-orange?style=for-the-badge)](https://github.com)

**دليل مفصل لرفع مشروع رزقي على VPS Hostinger**

</div>

---

## 📋 **المعلومات الأساسية**

- **IP الخادم:** `148.230.112.17`
- **النطاق:** `rezgee.com`
- **نوع المشروع:** React + TypeScript + Supabase
- **الخادم:** VPS Hostinger Ubuntu 22.04 LTS

---

## **المرحلة الأولى: إعداد VPS** ⚙️

### 1️⃣ **الاتصال بالخادم**
```bash
ssh root@148.230.112.17
```

### 2️⃣ **تشغيل سكريبت الإعداد التلقائي**
```bash
# رفع سكريبت الإعداد
scp setup-vps.sh root@148.230.112.17:/tmp/

# تشغيل السكريبت
ssh root@148.230.112.17
chmod +x /tmp/setup-vps.sh
/tmp/setup-vps.sh
```

### 3️⃣ **التحقق من الإعداد**
```bash
# فحص الخدمات
systemctl status nginx postgresql
sudo -u rezge pm2 --version
node --version
```

---

## **المرحلة الثانية: رفع ملفات المشروع** 📁

### 1️⃣ **إعداد المشروع محلياً**

#### أ. تشغيل سكريبت النشر:
```bash
# على Linux/Mac
./deploy-hostinger.sh

# على Windows
deploy-hostinger.bat
```

#### ب. رفع الملف المضغوط:
```bash
# رفع الملف المضغوط إلى الخادم
scp rezge-hostinger-deploy-*.tar.gz root@148.230.112.17:/tmp/
```

### 2️⃣ **استخراج وتركيب المشروع على الخادم**
```bash
# على الخادم
cd /var/www/rezge

# استخراج الملفات
tar -xzf /tmp/rezge-hostinger-deploy-*.tar.gz --strip-components=1

# تثبيت التبعيات
npm ci --only=production

# بناء المشروع
npm run build
```

---

## **المرحلة الثالثة: إعداد البيئة** 🔧

### 1️⃣ **تحديث ملف البيئة**
```bash
# تعديل الملف
nano /var/www/rezge/.env.production
```

### 2️⃣ **إعدادات البيئة المطلوبة**
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# SMTP Email Configuration - Hostinger
VITE_SMTP_HOST=smtp.hostinger.com
VITE_SMTP_PORT=465
VITE_SMTP_USER=noreply@rezgee.com
VITE_SMTP_PASS=your_smtp_password_here
VITE_SMTP_FROM=رزقي - Rezge <noreply@rezgee.com>
VITE_SMTP_FROM_NAME=رزقي - Rezge

# Application Configuration
VITE_APP_URL=https://rezgee.com
VITE_APP_NAME=رزقي - Rezge
VITE_APP_DESCRIPTION=منصة الزواج الإسلامي الشرعي
VITE_APP_VERSION=1.0.0
NODE_ENV=production

# Security Configuration
VITE_ENABLE_2FA=true
VITE_ENABLE_CAPTCHA=true
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_LOGIN_ATTEMPTS=5

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_VERIFICATION=true
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_ARTICLES=true
VITE_ENABLE_COMMENTS=true

# Development/Testing (Set to false in production)
VITE_DEBUG_MODE=false
VITE_MOCK_DATA=false
VITE_VERBOSE_LOGGING=false

# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```

---

## **المرحلة الرابعة: إعداد Nginx** 🌐

### 1️⃣ **تطبيق إعدادات Nginx**
```bash
# نسخ ملف الإعداد
cp nginx.conf /etc/nginx/sites-available/rezgee.com

# تحديث النطاق في الملف
nano /etc/nginx/sites-available/rezgee.com
# تأكد من أن server_name يحتوي على rezgee.com www.rezgee.com

# تفعيل الموقع
ln -sf /etc/nginx/sites-available/rezgee.com /etc/nginx/sites-enabled/

# اختبار التكوين
nginx -t

# إعادة تحميل Nginx
systemctl reload nginx
```

---

## **المرحلة الخامسة: إعداد PM2** 🔄

### 1️⃣ **بدء التطبيق**
```bash
# إنشاء مجلد السجلات
mkdir -p /var/log/pm2

# بدء التطبيق
sudo -u rezge pm2 start ecosystem.config.js

# حفظ إعدادات PM2
sudo -u rezge pm2 save

# إعداد بدء تلقائي
sudo -u rezge pm2 startup
```

### 2️⃣ **التحقق من حالة التطبيق**
```bash
# فحص حالة PM2
sudo -u rezge pm2 status

# فحص السجلات
sudo -u rezge pm2 logs rezge-app
```

---

## **المرحلة السادسة: إعداد SSL** 🔒

### 1️⃣ **الحصول على شهادة SSL**
```bash
# الحصول على شهادة SSL
certbot --nginx -d rezgee.com -d www.rezgee.com

# اختبار التجديد التلقائي
certbot renew --dry-run
```

### 2️⃣ **إعداد التجديد التلقائي**
```bash
# إضافة مهمة cron للتجديد التلقائي
crontab -e

# إضافة السطر التالي:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## **المرحلة السابعة: إعداد DNS** 🌍

### 1️⃣ **تحديث DNS في لوحة تحكم النطاق**
```
Type: A
Name: @
Value: 148.230.112.17
TTL: 3600

Type: A
Name: www
Value: 148.230.112.17
TTL: 3600
```

### 2️⃣ **انتظار انتشار DNS**
```bash
# فحص DNS
nslookup rezgee.com
dig rezgee.com
```

---

## **المرحلة الثامنة: الاختبار والتحقق** ✅

### 1️⃣ **فحص الخدمات**
```bash
# فحص حالة Nginx
systemctl status nginx

# فحص حالة PM2
sudo -u rezge pm2 status

# فحص السجلات
sudo -u rezge pm2 logs rezge-app
tail -f /var/log/nginx/error.log
```

### 2️⃣ **اختبار الموقع**
```bash
# اختبار HTTP
curl -I http://rezgee.com

# اختبار HTTPS
curl -I https://rezgee.com

# اختبار من المتصفح
# اذهب إلى: https://rezgee.com
```

---

## **المرحلة التاسعة: الصيانة والمراقبة** 🔧

### 1️⃣ **مراقبة النظام**
```bash
# تشغيل سكريبت المراقبة
/root/monitor-system.sh

# مراقبة استخدام الموارد
htop

# مراقبة PM2
sudo -u rezge pm2 monit
```

### 2️⃣ **النسخ الاحتياطي**
```bash
# تشغيل النسخ الاحتياطي يدوياً
/root/backup-rezge.sh

# النسخ الاحتياطي التلقائي يعمل يومياً في الساعة 2:00 صباحاً
```

---

## **حل المشاكل الشائعة** 🆘

### 1️⃣ **المشكلة: الموقع لا يظهر**
```bash
# فحص Nginx
systemctl status nginx
nginx -t

# فحص PM2
sudo -u rezge pm2 status
sudo -u rezge pm2 logs rezge-app

# فحص الجدار الناري
ufw status
```

### 2️⃣ **المشكلة: خطأ SSL**
```bash
# إعادة تشغيل Certbot
certbot renew --dry-run
systemctl reload nginx

# فحص الشهادة
openssl x509 -in /etc/letsencrypt/live/rezgee.com/cert.pem -text -noout
```

### 3️⃣ **المشكلة: خطأ في قاعدة البيانات**
```bash
# فحص PostgreSQL
systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"

# فحص اتصال Supabase
curl -I https://your-supabase-url.supabase.co
```

### 4️⃣ **المشكلة: خطأ في البريد الإلكتروني**
```bash
# فحص إعدادات SMTP
telnet smtp.hostinger.com 465

# فحص السجلات
sudo -u rezge pm2 logs rezge-app | grep -i smtp
```

---

## **أوامر مفيدة للصيانة** 🛠️

### **فحص حالة النظام:**
```bash
# حالة الخدمات
systemctl status nginx postgresql

# حالة PM2
sudo -u rezge pm2 status
sudo -u rezge pm2 logs rezge-app

# استخدام الموارد
htop
df -h
free -h
```

### **إعادة تشغيل الخدمات:**
```bash
# إعادة تشغيل Nginx
systemctl restart nginx

# إعادة تشغيل PM2
sudo -u rezge pm2 restart all

# إعادة تشغيل كل شيء
sudo -u rezge pm2 restart all && systemctl restart nginx
```

### **فحص السجلات:**
```bash
# سجلات Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# سجلات PM2
sudo -u rezge pm2 logs rezge-app
tail -f /var/log/pm2/rezge-error.log
```

---

## **قائمة التحقق النهائية** ✅

### **قبل النشر:**
- [ ] VPS مشتري ومُعد
- [ ] النطاق مُعد ومُوجه لـ VPS
- [ ] ملفات المشروع جاهزة ومبنية
- [ ] إعدادات البيئة محدثة
- [ ] إعدادات Supabase صحيحة
- [ ] إعدادات SMTP صحيحة

### **بعد النشر:**
- [ ] الموقع يعمل على HTTP
- [ ] SSL يعمل على HTTPS
- [ ] PM2 يدير التطبيق
- [ ] قاعدة البيانات تعمل (Supabase)
- [ ] البريد الإلكتروني يعمل
- [ ] جميع الميزات تعمل بشكل صحيح
- [ ] النسخ الاحتياطي مُعد
- [ ] المراقبة مُعدة

---

## **الملفات المهمة** 📁

- **Nginx config**: `/etc/nginx/sites-available/rezgee.com`
- **PM2 config**: `/var/www/rezge/ecosystem.config.js`
- **Environment**: `/var/www/rezge/.env.production`
- **Logs**: `/var/log/nginx/` و `/var/log/pm2/`
- **Backups**: `/root/backups/`
- **Project**: `/var/www/rezge/`

---

## **الخطوات التالية** 🚀

1. ✅ **اختبار جميع الميزات**
2. ✅ **إعداد النسخ الاحتياطي**
3. ✅ **مراقبة الأداء**
4. ✅ **تحديث المحتوى**
5. ✅ **إعداد المراقبة المتقدمة**
6. ✅ **تحسين الأداء**

---

<div align="center">

## 🎉 **تهانينا!**

**تم نشر مشروع رزقي بنجاح! 🚀**

الموقع الآن متاح على: **https://rezgee.com**

---

**آخر تحديث:** يناير 2025  
**المشروع:** رزقي - Rezge للزواج الإسلامي  
**الخادم:** VPS Hostinger - 148.230.112.17

</div>

