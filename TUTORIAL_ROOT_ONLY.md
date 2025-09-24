# 🚀 توتوريال النشر الشامل - رزقي على VPS Hostinger (Root Only)
## Complete Deployment Tutorial - Rezge on Hostinger VPS (Root Only)

<div align="center">

[![Tutorial](https://img.shields.io/badge/Tutorial-Step_by_Step-blue?style=for-the-badge)](https://github.com)
[![VPS](https://img.shields.io/badge/VPS-Hostinger-green?style=for-the-badge)](https://hostinger.com)
[![Root](https://img.shields.io/badge/Root-Only-red?style=for-the-badge)](https://github.com)
[![Time](https://img.shields.io/badge/Time-45_Minutes-orange?style=for-the-badge)](https://github.com)

**توتوريال مفصل خطوة بخطوة لرفع مشروع رزقي على VPS Hostinger باستخدام المستخدم root فقط**

</div>

---

## 📋 **معلومات المشروع**

- **اسم المشروع:** رزقي - Rezge (منصة الزواج الإسلامي)
- **نوع المشروع:** React + TypeScript + Supabase
- **IP الخادم:** `148.230.112.17`
- **النطاق:** `rezgee.com`
- **نظام التشغيل:** Ubuntu 22.04 LTS
- **المستخدم:** root فقط

---

## **المرحلة الأولى: إعداد VPS** ⚙️

### **الخطوة 1: الاتصال بالخادم**

افتح Terminal أو Command Prompt واتصل بالخادم:

```bash
ssh root@148.230.112.17
```

**ملاحظة:** إذا كان لديك مفتاح SSH، استخدم:
```bash
ssh -i /path/to/your/key root@148.230.112.17
```

### **الخطوة 2: تحديث النظام**

```bash
# تحديث النظام
apt update && apt upgrade -y

# تثبيت المتطلبات الأساسية
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### **الخطوة 3: تثبيت Node.js 20.x**

```bash
# حذف Node.js القديم إذا كان موجوداً
apt remove -y nodejs npm

# إضافة مستودع Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# تثبيت Node.js 20.x
apt-get install -y nodejs

# التحقق من التثبيت
node --version
npm --version
```

**النتيجة المتوقعة:**
- Node.js version: v20.x.x
- NPM version: 10.x.x

### **الخطوة 4: تثبيت Nginx**

```bash
# تثبيت Nginx
apt install -y nginx

# تفعيل وبدء Nginx
systemctl enable nginx
systemctl start nginx

# التحقق من حالة Nginx
systemctl status nginx
```

### **الخطوة 5: تثبيت PM2**

```bash
# تثبيت PM2 عالمياً
npm install -g pm2

# التحقق من التثبيت
pm2 --version
```

### **الخطوة 6: تثبيت Certbot للـ SSL**

```bash
# تثبيت Certbot
apt install -y certbot python3-certbot-nginx

# التحقق من التثبيت
certbot --version
```

### **الخطوة 7: تثبيت أدوات إضافية**

```bash
# تثبيت أدوات مفيدة
apt install -y htop nano vim ufw fail2ban
```

### **الخطوة 8: إعداد الجدار الناري**

```bash
# تفعيل الجدار الناري
ufw --force enable

# السماح بـ SSH
ufw allow ssh

# السماح بـ Nginx
ufw allow 'Nginx Full'

# السماح بالمنفذ 3000 للتطبيق
ufw allow 3000

# فحص حالة الجدار الناري
ufw status
```

### **الخطوة 9: إنشاء مجلدات المشروع**

```bash
# إنشاء مجلد المشروع
mkdir -p /var/www/rezgee

# إنشاء مجلد السجلات
mkdir -p /var/log/pm2

# التحقق من المجلدات
ls -la /var/www/
ls -la /var/log/pm2
```

---

## **المرحلة الثانية: رفع المشروع عبر Git** 📁

### **الخطوة 10: إعداد مستودع Git**

**أولاً، تأكد من أن مشروعك موجود على GitHub أو GitLab:**

1. اذهب إلى GitHub/GitLab
2. أنشئ مستودع جديد أو استخدم المستودع الموجود
3. ارفع جميع ملفات المشروع إلى المستودع

### **الخطوة 11: استنساخ المشروع على الخادم**

```bash
# على الخادم، الانتقال إلى مجلد المشروع
cd /var/www/rezgee

# استنساخ المشروع من Git
git clone https://github.com/kareemxamged/rezgee.git .

# التحقق من الملفات
ls -la
```

### **الخطوة 12: إنشاء ملف PM2**

```bash
# إنشاء ملف PM2
nano ecosystem.config.js
```

**أدخل المحتوى التالي:**

```javascript
module.exports = {
    apps: [{
        name: 'rezgee-app',
        script: 'npm',
        args: 'run preview',
        cwd: '/var/www/rezgee',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production',
            PORT: 3000,
            HOST: '0.0.0.0'
        },
        error_file: '/var/log/pm2/rezgee-error.log',
        out_file: '/var/log/pm2/rezgee-out.log',
        log_file: '/var/log/pm2/rezgee-combined.log',
        time: true
    }]
};
```

**حفظ الملف:** اضغط `Ctrl + X` ثم `Y` ثم `Enter`

### **الخطوة 13: تثبيت التبعيات**

```bash
# تثبيت التبعيات
npm ci --only=production

# التحقق من التثبيت
npm list --depth=0
```

### **الخطوة 14: بناء المشروع**

```bash
# بناء المشروع للإنتاج
npm run build

# التحقق من وجود مجلد dist
ls -la dist/
```

---

## **المرحلة الثالثة: إعداد البيئة** 🔧

### **الخطوة 15: تحديث ملف البيئة**

```bash
# تعديل ملف البيئة
nano /var/www/rezgee/.env.production
```

**قم بتحديث القيم التالية:**

```env
# Supabase Configuration (احصل على هذه القيم من لوحة تحكم Supabase)
VITE_SUPABASE_URL=https://sbtzngewizgeqzfbhfjy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidHpuZ2V3aXpnZXF6ZmJoZmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzc5MTMsImV4cCI6MjA2NjcxMzkxM30.T8iv9C4OeKAb-e4Oz6uw3tFnMrgFK3SKN6fVCrBEUGo

# SMTP Email Configuration (احصل على هذه القيم من Hostinger)
VITE_SMTP_HOST=smtp.hostinger.com
VITE_SMTP_PORT=465
VITE_SMTP_USER=no-reply@rezgee.com
VITE_SMTP_PASS=R3zG89&Secure
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

# Development/Testing
VITE_DEBUG_MODE=false
VITE_MOCK_DATA=false
VITE_VERBOSE_LOGGING=false

# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```

**حفظ الملف:** اضغط `Ctrl + X` ثم `Y` ثم `Enter`

### **الخطوة 16: بناء المشروع على الخادم**

```bash
# بناء المشروع
npm run build

# التحقق من وجود مجلد dist
ls -la dist/
```

---

## **المرحلة الرابعة: إعداد Nginx** 🌐

### **الخطوة 17: إنشاء ملف إعداد Nginx**

```bash
# إنشاء ملف إعداد Nginx
nano /etc/nginx/sites-available/rezgee.com
```

**أدخل المحتوى التالي:**

```nginx
server {
    listen 80;
    server_name rezgee.com www.rezgee.com;
    root /var/www/rezgee/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Main application
    location / {
        try_files $uri $uri/ /index.html;
        
        # Security
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(env|log|sql)$ {
        deny all;
    }
}
```

**حفظ الملف:** اضغط `Ctrl + X` ثم `Y` ثم `Enter`

### **الخطوة 18: تفعيل الموقع**

```bash
# تفعيل الموقع
ln -sf /etc/nginx/sites-available/rezgee.com /etc/nginx/sites-enabled/

# إزالة الموقع الافتراضي
rm -f /etc/nginx/sites-enabled/default

# اختبار تكوين Nginx
nginx -t
```

**النتيجة المتوقعة:** `nginx: configuration file /etc/nginx/nginx.conf test is successful`

### **الخطوة 19: إعادة تحميل Nginx**

```bash
# إعادة تحميل Nginx
systemctl reload nginx

# التحقق من حالة Nginx
systemctl status nginx
```

---

## **المرحلة الخامسة: إعداد PM2** 🔄

### **الخطوة 20: إعداد PM2 للبدء التلقائي**

```bash
# إعداد PM2 للبدء التلقائي
pm2 startup systemd

# اتبع التعليمات التي تظهر على الشاشة
```

### **الخطوة 21: بدء التطبيق**

```bash
# الانتقال إلى مجلد المشروع
cd /var/www/rezgee

# بدء التطبيق مع PM2
pm2 start ecosystem.config.js

# حفظ إعدادات PM2
pm2 save
```

### **الخطوة 22: التحقق من حالة التطبيق**

```bash
# فحص حالة PM2
pm2 status

# فحص السجلات
pm2 logs rezgee-app

# فحص استخدام الموارد
pm2 monit
```

---

## **المرحلة السادسة: إعداد SSL** 🔒

### **الخطوة 23: الحصول على شهادة SSL**

```bash
# الحصول على شهادة SSL
certbot --nginx -d rezgee.com -d www.rezgee.com
```

**اتبع التعليمات:**
1. أدخل بريدك الإلكتروني
2. اقرأ وأوافق على شروط الخدمة
3. اختر ما إذا كنت تريد مشاركة بريدك الإلكتروني
4. اختر إعادة توجيه HTTP إلى HTTPS

### **الخطوة 24: اختبار التجديد التلقائي**

```bash
# اختبار التجديد التلقائي
certbot renew --dry-run
```

### **الخطوة 25: إعداد التجديد التلقائي**

```bash
# إضافة مهمة cron للتجديد التلقائي
crontab -e
```

**أضف السطر التالي:**
```
0 12 * * * /usr/bin/certbot renew --quiet
```

**حفظ الملف:** اضغط `Ctrl + X` ثم `Y` ثم `Enter`

---

## **المرحلة السابعة: إعداد DNS** 🌍

### **الخطوة 26: تحديث DNS في لوحة تحكم النطاق**

اذهب إلى لوحة تحكم النطاق وأضف السجلات التالية:

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

### **الخطوة 27: انتظار انتشار DNS**

```bash
# فحص DNS
nslookup rezgee.com
dig rezgee.com

# فحص من خادم آخر
curl -I http://rezgee.com
```

**انتظر 5-30 دقيقة حتى ينتشر DNS**

---

## **المرحلة الثامنة: الاختبار والتحقق** ✅

### **الخطوة 28: فحص الخدمات**

```bash
# فحص حالة Nginx
systemctl status nginx

# فحص حالة PM2
pm2 status

# فحص حالة PostgreSQL (إذا كان مُثبت)
systemctl status postgresql
```

### **الخطوة 29: اختبار الموقع**

```bash
# اختبار HTTP
curl -I http://rezgee.com

# اختبار HTTPS
curl -I https://rezgee.com

# اختبار من المتصفح
# اذهب إلى: https://rezgee.com
```

### **الخطوة 30: اختبار الميزات**

1. **اختبار الصفحة الرئيسية**
2. **اختبار تسجيل الدخول**
3. **اختبار التسجيل**
4. **اختبار إرسال البريد الإلكتروني**
5. **اختبار جميع الميزات**

---

## **المرحلة التاسعة: الصيانة والمراقبة** 🔧

### **الخطوة 31: إنشاء سكريبت النسخ الاحتياطي**

```bash
# إنشاء سكريبت النسخ الاحتياطي
nano /root/backup-rezgee.sh
```

**أدخل المحتوى التالي:**

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
PROJECT_DIR="/var/www/rezgee"

mkdir -p $BACKUP_DIR

# Backup project files
tar -czf $BACKUP_DIR/rezgee-backup-$DATE.tar.gz -C $PROJECT_DIR .

# Remove old backups (older than 7 days)
find $BACKUP_DIR -name "rezgee-backup-*.tar.gz" -mtime +7 -delete

echo "Backup completed: rezgee-backup-$DATE.tar.gz"
```

**حفظ الملف:** اضغط `Ctrl + X` ثم `Y` ثم `Enter`

```bash
# جعل السكريبت قابل للتنفيذ
chmod +x /root/backup-rezgee.sh

# إضافة مهمة cron للنسخ الاحتياطي اليومي
crontab -e
```

**أضف السطر التالي:**
```
0 2 * * * /root/backup-rezgee.sh
```

### **الخطوة 32: إنشاء سكريبت مراقبة النظام**

```bash
# إنشاء سكريبت المراقبة
nano /root/monitor-system.sh
```

**أدخل المحتوى التالي:**

```bash
#!/bin/bash
echo "=== System Status ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "Memory Usage:"
free -h
echo "Disk Usage:"
df -h
echo "PM2 Status:"
pm2 status
echo "Nginx Status:"
systemctl status nginx --no-pager -l
```

**حفظ الملف:** اضغط `Ctrl + X` ثم `Y` ثم `Enter`

```bash
# جعل السكريبت قابل للتنفيذ
chmod +x /root/monitor-system.sh
```

---

## **تحديث المشروع عبر Git** 🔄

### **طريقة التحديث اليدوي:**

```bash
# الانتقال إلى مجلد المشروع
cd /var/www/rezgee

# سحب التحديثات من Git
git pull origin main

# تثبيت التبعيات الجديدة
npm ci --only=production

# بناء المشروع
npm run build

# إعادة تشغيل التطبيق
pm2 restart rezgee-app
```

### **إنشاء سكريبت التحديث التلقائي:**

```bash
# إنشاء سكريبت التحديث
nano /var/www/rezgee/update-project.sh
```

**أدخل المحتوى التالي:**
```bash
#!/bin/bash
#!/bin/bash
echo "�� Starting project update..."

# Navigate to project directory
cd /var/www/rezgee

# Check for available updates
echo "🔍 Checking for available updates..."
git fetch origin

# Display available updates
UPDATES=$(git log HEAD..origin/main --oneline)
if [ -z "$UPDATES" ]; then
    echo "✅ No new updates available"
    exit 0
fi

echo "📥 Available updates:"
echo "$UPDATES"

# Pull updates from GitHub
echo "📥 Pulling updates from GitHub..."
git pull origin main

# Install new dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the project
echo "🏗️ Building project..."
npm run build

# Restart the application
echo "🔄 Restarting application..."
pm2 restart rezgee-app

# Check application status
echo "✅ Checking application status..."
pm2 status

echo "🎉 Project updated successfully!"
```

```bash
# جعل السكريبت قابل للتنفيذ
chmod +x /var/www/rezgee/update-project.sh

# استخدام السكريبت
/var/www/rezgee/update-project.sh
```

---

## **حل المشاكل الشائعة** 🆘

### **المشكلة 1: الموقع لا يظهر**

```bash
# فحص Nginx
systemctl status nginx
nginx -t

# فحص PM2
pm2 status
pm2 logs rezgee-app

# فحص الجدار الناري
ufw status

# إعادة تشغيل الخدمات
pm2 restart all
systemctl restart nginx
```

### **المشكلة 2: خطأ SSL**

```bash
# إعادة تشغيل Certbot
certbot renew --dry-run
systemctl reload nginx

# فحص الشهادة
openssl x509 -in /etc/letsencrypt/live/rezgee.com/cert.pem -text -noout

# إعادة الحصول على الشهادة
certbot --nginx -d rezgee.com -d www.rezgee.com --force-renewal
```

### **المشكلة 3: خطأ في التطبيق**

```bash
# فحص سجلات PM2
pm2 logs rezgee-app

# فحص سجلات Nginx
tail -f /var/log/nginx/error.log

# إعادة تشغيل التطبيق
pm2 restart rezgee-app
```

### **المشكلة 4: خطأ في البريد الإلكتروني**

```bash
# فحص إعدادات SMTP
telnet smtp.hostinger.com 465

# فحص السجلات
pm2 logs rezgee-app | grep -i smtp

# اختبار إرسال بريد
curl -X POST https://rezgee.com/api/test-email
```

---

## **أوامر مفيدة للصيانة** 🛠️

### **فحص حالة النظام:**
```bash
# حالة الخدمات
systemctl status nginx postgresql

# حالة PM2
pm2 status
pm2 logs rezgee-app

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
pm2 restart all

# إعادة تشغيل كل شيء
pm2 restart all && systemctl restart nginx
```

### **فحص السجلات:**
```bash
# سجلات Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# سجلات PM2
pm2 logs rezgee-app
tail -f /var/log/pm2/rezgee-error.log
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
- **PM2 config**: `/var/www/rezgee/ecosystem.config.js`
- **Environment**: `/var/www/rezgee/.env.production`
- **Logs**: `/var/log/nginx/` و `/var/log/pm2/`
- **Backups**: `/root/backups/`
- **Project**: `/var/www/rezgee/`

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
**المستخدم:** root فقط

</div>

