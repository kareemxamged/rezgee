# 🚀 توتوريال النشر المفصل - رزقي على VPS Hostinger
## Step-by-Step Deployment Tutorial - Rezge on Hostinger VPS

<div align="center">

[![Tutorial](https://img.shields.io/badge/Tutorial-Step_by_Step-blue?style=for-the-badge)](https://github.com)
[![VPS](https://img.shields.io/badge/VPS-Hostinger-green?style=for-the-badge)](https://hostinger.com)
[![Time](https://img.shields.io/badge/Time-60_Minutes-orange?style=for-the-badge)](https://github.com)

**توتوريال مفصل خطوة بخطوة لرفع مشروع رزقي على VPS Hostinger**

</div>

---

## 📋 **معلومات المشروع**

- **اسم المشروع:** رزقي - Rezge (منصة الزواج الإسلامي)
- **نوع المشروع:** React + TypeScript + Supabase
- **IP الخادم:** `148.230.112.17`
- **النطاق:** `rezgee.com`
- **نظام التشغيل:** Ubuntu 22.04 LTS

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

قم بتحديث النظام وتثبيت المتطلبات الأساسية:

```bash
# تحديث النظام
apt update && apt upgrade -y

# تثبيت المتطلبات الأساسية
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### **الخطوة 3: تثبيت Node.js 20.x**

```bash
# إضافة مستودع Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# تثبيت Node.js
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

### **الخطوة 6: تثبيت PostgreSQL (اختياري)**

```bash
# تثبيت PostgreSQL
apt install -y postgresql postgresql-contrib

# تفعيل وبدء PostgreSQL
systemctl enable postgresql
systemctl start postgresql

# التحقق من حالة PostgreSQL
systemctl status postgresql
```

### **الخطوة 7: تثبيت Certbot للـ SSL**

```bash
# تثبيت Certbot
apt install -y certbot python3-certbot-nginx

# التحقق من التثبيت
certbot --version
```

### **الخطوة 8: تثبيت أدوات إضافية**

```bash
# تثبيت أدوات مفيدة
apt install -y htop nano vim ufw fail2ban
```

### **الخطوة 9: إعداد الجدار الناري**

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

### **الخطوة 10: إنشاء مستخدم للمشروع**

```bash
# إنشاء مستخدم rezgee
adduser --disabled-password --gecos "" rezgee

# إضافة المستخدم لمجموعة sudo
usermod -aG sudo rezgee

# التحقق من إنشاء المستخدم
id rezgee
```

### **الخطوة 11: إنشاء مجلدات المشروع**

```bash
# إنشاء مجلد المشروع
mkdir -p /var/www/rezgee

# إنشاء مجلد السجلات
mkdir -p /var/log/pm2

# تغيير ملكية المجلدات
chown -R rezgee:rezgee /var/www/rezgee
chown -R rezgee:rezgee /var/log/pm2

# التحقق من الأذونات
ls -la /var/www/
ls -la /var/log/pm2
```

---

## **المرحلة الثانية: رفع المشروع عبر Git** 📁

### **الخطوة 12: إعداد مستودع Git**

**أولاً، تأكد من أن مشروعك موجود على GitHub أو GitLab:**

1. اذهب إلى GitHub/GitLab
2. أنشئ مستودع جديد أو استخدم المستودع الموجود
3. ارفع جميع ملفات المشروع إلى المستودع

### **الخطوة 13: استنساخ المشروع على الخادم**

```bash
# على الخادم، الانتقال إلى مجلد المشروع
cd /var/www/rezgee

# استنساخ المشروع من Git
git clone https://github.com/your-username/rezgee-islamic-marriage.git .

# أو إذا كان المستودع خاص، استخدم SSH:
# git clone git@github.com:your-username/rezgee-islamic-marriage.git .

# التحقق من الملفات
ls -la
```

### **الخطوة 14: إنشاء ملف PM2**

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

### **الخطوة 15: تثبيت التبعيات**

```bash
# تثبيت التبعيات
npm ci --only=production

# التحقق من التثبيت
npm list --depth=0
```

### **الخطوة 16: بناء المشروع**

```bash
# بناء المشروع للإنتاج
npm run build

# التحقق من وجود مجلد dist
ls -la dist/
```

### **الخطوة 17: إعداد Git للاستخدام المستقبلي (اختياري)**

```bash
# إعداد Git للمستخدم rezgee
sudo -u rezgee git config --global user.name "Rezgee Admin"
sudo -u rezgee git config --global user.email "admin@rezgee.com"

# إعداد SSH key للوصول للمستودعات الخاصة (إذا لزم الأمر)
# sudo -u rezgee ssh-keygen -t rsa -b 4096 -C "admin@rezgee.com"
# sudo -u rezgee cat /home/rezgee/.ssh/id_rsa.pub
```

### **الخطوة 18: إنشاء سكريبت التحديث التلقائي**

```bash
# إنشاء سكريبت لتحديث المشروع
nano /var/www/rezgee/update-project.sh
```

**أدخل المحتوى التالي:**

```bash
#!/bin/bash
cd /var/www/rezgee

# سحب التحديثات من Git
git pull origin main

# تثبيت التبعيات الجديدة
npm ci --only=production

# بناء المشروع
npm run build

# إعادة تشغيل التطبيق
sudo -u rezgee pm2 restart rezgee-app

echo "Project updated successfully!"
```

**حفظ الملف:** اضغط `Ctrl + X` ثم `Y` ثم `Enter`

```bash
# جعل السكريبت قابل للتنفيذ
chmod +x /var/www/rezgee/update-project.sh
```

---

## **المرحلة الثالثة: إعداد البيئة** 🔧

### **الخطوة 19: تحديث ملف البيئة**

```bash
# تعديل ملف البيئة
nano /var/www/rezgee/.env.production
```

**قم بتحديث القيم التالية:**

```env
# Supabase Configuration (احصل على هذه القيم من لوحة تحكم Supabase)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# SMTP Email Configuration (احصل على هذه القيم من Hostinger)
VITE_SMTP_HOST=smtp.hostinger.com
VITE_SMTP_PORT=465
VITE_SMTP_USER=noreply@rezgee.com
VITE_SMTP_PASS=your_actual_smtp_password
VITE_SMTP_FROM=رزقي - Rezge <noreply@rezgee.com>
VITE_SMTP_FROM_NAME=رزقي - Rezge

# Application Configuration
VITE_APP_URL=https://rezgee.com
VITE_APP_NAME=رزقي - Rezge
VITE_APP_DESCRIPTION=منصة الزواج الإسلامي الشرعي
VITE_APP_VERSION=1.0.0
NODE_ENV=production
```

**حفظ الملف:** اضغط `Ctrl + X` ثم `Y` ثم `Enter`

### **الخطوة 20: بناء المشروع على الخادم**

```bash
# بناء المشروع
npm run build

# التحقق من وجود مجلد dist
ls -la dist/
```

---

## **المرحلة الرابعة: إعداد Nginx** 🌐

### **الخطوة 21: إنشاء ملف إعداد Nginx**

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
    gzip_proxied expired no-cache no-store private must-revalidate auth;
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

### **الخطوة 22: تفعيل الموقع**

```bash
# تفعيل الموقع
ln -sf /etc/nginx/sites-available/rezgee.com /etc/nginx/sites-enabled/

# إزالة الموقع الافتراضي
rm -f /etc/nginx/sites-enabled/default

# اختبار تكوين Nginx
nginx -t
```

**النتيجة المتوقعة:** `nginx: configuration file /etc/nginx/nginx.conf test is successful`

### **الخطوة 23: إعادة تحميل Nginx**

```bash
# إعادة تحميل Nginx
systemctl reload nginx

# التحقق من حالة Nginx
systemctl status nginx
```

---

## **المرحلة الخامسة: إعداد PM2** 🔄

### **الخطوة 24: إعداد PM2 للبدء التلقائي**

```bash
# إعداد PM2 للبدء التلقائي
sudo -u rezgee pm2 startup systemd -u rezgee --hp /home/rezgee
```

**اتبع التعليمات التي تظهر على الشاشة**

### **الخطوة 25: بدء التطبيق**

```bash
# الانتقال إلى مجلد المشروع
cd /var/www/rezgee

# بدء التطبيق مع PM2
sudo -u rezgee pm2 start ecosystem.config.js

# حفظ إعدادات PM2
sudo -u rezgee pm2 save
```

### **الخطوة 26: التحقق من حالة التطبيق**

```bash
# فحص حالة PM2
sudo -u rezgee pm2 status

# فحص السجلات
sudo -u rezgee pm2 logs rezgee-app

# فحص استخدام الموارد
sudo -u rezgee pm2 monit
```

---

## **المرحلة السادسة: إعداد SSL** 🔒

### **الخطوة 27: الحصول على شهادة SSL**

```bash
# الحصول على شهادة SSL
certbot --nginx -d rezgee.com -d www.rezgee.com
```

**اتبع التعليمات:**
1. أدخل بريدك الإلكتروني
2. اقرأ وأوافق على شروط الخدمة
3. اختر ما إذا كنت تريد مشاركة بريدك الإلكتروني
4. اختر إعادة توجيه HTTP إلى HTTPS

### **الخطوة 28: اختبار التجديد التلقائي**

```bash
# اختبار التجديد التلقائي
certbot renew --dry-run
```

### **الخطوة 29: إعداد التجديد التلقائي**

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

### **الخطوة 30: تحديث DNS في لوحة تحكم النطاق**

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

### **الخطوة 31: انتظار انتشار DNS**

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

### **الخطوة 32: فحص الخدمات**

```bash
# فحص حالة Nginx
systemctl status nginx

# فحص حالة PM2
sudo -u rezgee pm2 status

# فحص حالة PostgreSQL (إذا كان مُثبت)
systemctl status postgresql
```

### **الخطوة 33: اختبار الموقع**

```bash
# اختبار HTTP
curl -I http://rezgee.com

# اختبار HTTPS
curl -I https://rezgee.com

# اختبار من المتصفح
# اذهب إلى: https://rezgee.com
```

### **الخطوة 34: اختبار الميزات**

1. **اختبار الصفحة الرئيسية**
2. **اختبار تسجيل الدخول**
3. **اختبار التسجيل**
4. **اختبار إرسال البريد الإلكتروني**
5. **اختبار جميع الميزات**

---

## **المرحلة التاسعة: الصيانة والمراقبة** 🔧

### **الخطوة 35: إنشاء سكريبت النسخ الاحتياطي**

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

# Backup database (if using local PostgreSQL)
# sudo -u postgres pg_dump rezgee_db > $BACKUP_DIR/rezgee-db-$DATE.sql

# Remove old backups (older than 7 days)
find $BACKUP_DIR -name "rezgee-backup-*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "rezgee-db-*.sql" -mtime +7 -delete

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

### **الخطوة 36: إنشاء سكريبت مراقبة النظام**

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
sudo -u rezgee pm2 status
echo "Nginx Status:"
systemctl status nginx --no-pager -l
echo "PostgreSQL Status:"
systemctl status postgresql --no-pager -l
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
sudo -u rezgee pm2 restart rezgee-app
```

### **طريقة التحديث التلقائي:**

```bash
# استخدام السكريبت المُعد مسبقاً
/var/www/rezgee/update-project.sh
```

### **إعداد التحديث التلقائي عبر Cron:**

```bash
# إضافة مهمة cron للتحديث التلقائي (اختياري)
crontab -e

# إضافة السطر التالي للتحديث كل يوم في الساعة 3:00 صباحاً:
# 0 3 * * * /var/www/rezgee/update-project.sh
```

---

## **حل المشاكل الشائعة** 🆘

### **المشكلة 1: الموقع لا يظهر**

```bash
# فحص Nginx
systemctl status nginx
nginx -t

# فحص PM2
sudo -u rezgee pm2 status
sudo -u rezgee pm2 logs rezgee-app

# فحص الجدار الناري
ufw status

# إعادة تشغيل الخدمات
sudo -u rezgee pm2 restart all
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
sudo -u rezgee pm2 logs rezgee-app

# فحص سجلات Nginx
tail -f /var/log/nginx/error.log

# إعادة تشغيل التطبيق
sudo -u rezgee pm2 restart rezgee-app
```

### **المشكلة 4: خطأ في البريد الإلكتروني**

```bash
# فحص إعدادات SMTP
telnet smtp.hostinger.com 465

# فحص السجلات
sudo -u rezgee pm2 logs rezgee-app | grep -i smtp

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
sudo -u rezgee pm2 status
sudo -u rezgee pm2 logs rezgee-app

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
sudo -u rezgee pm2 restart all

# إعادة تشغيل كل شيء
sudo -u rezgee pm2 restart all && systemctl restart nginx
```

### **فحص السجلات:**
```bash
# سجلات Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# سجلات PM2
sudo -u rezgee pm2 logs rezgee-app
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

</div>
