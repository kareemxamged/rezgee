<div align="center">

# 🚀 دليل رفع مشروع رزقي على VPS في Hostinger
## Rezge Islamic Marriage Platform - VPS Deployment Guide

[![Hostinger](https://img.shields.io/badge/Hostinger-2E3540?style=for-the-badge&logo=hostinger&logoColor=white)](https://hostinger.com)
[![VPS](https://img.shields.io/badge/VPS-Ready-green?style=for-the-badge)](https://hostinger.com/vps-hosting)
[![Deployment](https://img.shields.io/badge/Deployment-Guide-blue?style=for-the-badge)](https://github.com)

**دليل شامل لشراء VPS ورفع مشروع رزقي الإسلامي على Hostinger**

</div>

---

## 📋 جدول المحتويات

1. [🛒 شراء VPS من Hostinger](#-شراء-vps-من-hostinger)
2. [🔧 إعداد VPS](#-إعداد-vps)
3. [📦 إعداد المشروع للنشر](#-إعداد-المشروع-للنشر)
4. [🗄️ إعداد قاعدة البيانات](#️-إعداد-قاعدة-البيانات)
5. [🌐 إعداد خادم الويب](#-إعداد-خادم-الويب)
6. [🔒 إعداد الأمان وSSL](#-إعداد-الأمان-وssl)
7. [🌍 ربط النطاق](#-ربط-النطاق)
8. [📊 مراقبة النظام](#-مراقبة-النظام)
9. [🔄 النسخ الاحتياطي](#-النسخ-الاحتياطي)
10. [❓ استكشاف الأخطاء](#-استكشاف-الأخطاء)

---

## 🛒 شراء VPS من Hostinger

### 1. اختيار خطة VPS مناسبة

#### 🎯 **الخطة الموصى بها: VPS 1**

| المواصفات | VPS 1 | VPS 2 | VPS 3 |
|:---:|:---:|:---:|:---:|
| **المعالج** | 1 vCPU | 2 vCPU | 3 vCPU |
| **الذاكرة** | 4 GB RAM | 8 GB RAM | 12 GB RAM |
| **التخزين** | 80 GB SSD | 160 GB SSD | 240 GB SSD |
| **الترفيع** | 1 TB | 2 TB | 4 TB |
| **السعر/شهر** | $3.99 | $5.99 | $7.99 |

#### 💡 **توصيات للمشروع:**
- **للمشروع الحالي**: VPS 1 كافٍ للبداية
- **للمشروع مع نمو المستخدمين**: VPS 2
- **للمشروع مع حركة مرور عالية**: VPS 3

### 2. خطوات الشراء

#### 📝 **الخطوة 1: التسجيل في Hostinger**
1. اذهب إلى [hostinger.com](https://hostinger.com)
2. اضغط على "VPS Hosting"
3. اختر "VPS 1" أو الخطة المناسبة
4. اضغط "Get Started"

#### 📝 **الخطوة 2: إعداد VPS**
1. **اختر نظام التشغيل**: Ubuntu 22.04 LTS
2. **اختر موقع الخادم**: 
   - أوروبا (للمستخدمين العرب في أوروبا)
   - آسيا (للمستخدمين العرب في آسيا)
3. **اختر فترة الاشتراك**: سنوي (أرخص)
4. **أضف نطاق مجاني** (اختياري)

#### 📝 **الخطوة 3: إعدادات إضافية**
- ✅ **Backup**: مفعل (مهم جداً)
- ✅ **SSL Certificate**: مفعل
- ✅ **DDoS Protection**: مفعل
- ❌ **Managed VPS**: غير مطلوب (نحن سنقوم بالإدارة)

#### 📝 **الخطوة 4: الدفع**
- اختر طريقة الدفع المناسبة
- أكمل عملية الشراء
- ستتلقى بيانات الدخول عبر البريد الإلكتروني

---

## 🔧 إعداد VPS

### 1. الحصول على بيانات الدخول

بعد الشراء، ستتلقى:
- **IP Address**: عنوان الخادم
- **Username**: اسم المستخدم (عادة `root`)
- **Password**: كلمة المرور
- **SSH Port**: منفذ SSH (عادة 22)

### 2. الاتصال بالخادم

#### 🖥️ **من Windows (PowerShell/CMD):**
```bash
ssh root@YOUR_IP_ADDRESS
```

#### 🖥️ **من Mac/Linux:**
```bash
ssh root@YOUR_IP_ADDRESS
```

### 3. تحديث النظام

```bash
# تحديث قائمة الحزم
apt update && apt upgrade -y

# تثبيت الحزم الأساسية
apt install -y curl wget git nano htop unzip software-properties-common
```

### 4. إعداد المستخدم الجديد (اختياري لكن مُوصى به)

```bash
# إنشاء مستخدم جديد
adduser rezge

# إضافة المستخدم لمجموعة sudo
usermod -aG sudo rezge

# التبديل للمستخدم الجديد
su - rezge
```

---

## 📦 إعداد المشروع للنشر

### 1. رفع ملفات المشروع

#### 🚀 **الطريقة 1: Git Clone (مُوصى بها)**
```bash
# إنشاء مجلد للمشروع
mkdir -p /var/www/rezge
cd /var/www/rezge

# رفع المشروع من GitHub (إذا كان متوفراً)
git clone https://github.com/your-username/rezge-islamic-marriage.git .

# أو رفع الملفات يدوياً باستخدام SCP/SFTP
```

#### 🚀 **الطريقة 2: رفع يدوي**
```bash
# إنشاء مجلد للمشروع
mkdir -p /var/www/rezge
cd /var/www/rezge

# رفع ملفات المشروع باستخدام SCP من جهازك المحلي
# scp -r /path/to/your/project/* root@YOUR_IP:/var/www/rezge/
```

### 2. تثبيت Node.js

```bash
# تثبيت Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# التحقق من التثبيت
node --version
npm --version
```

### 3. تثبيت PM2 لإدارة العمليات

```bash
# تثبيت PM2 عالمياً
sudo npm install -g pm2

# إعداد PM2 للبدء مع النظام
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u rezge --hp /home/rezge
```

### 4. إعداد متغيرات البيئة

```bash
# إنشاء ملف البيئة
nano /var/www/rezge/.env.production

# إضافة المتغيرات التالية:
```

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# SMTP Configuration
VITE_SMTP_HOST=your_smtp_host
VITE_SMTP_PORT=587
VITE_SMTP_USER=your_smtp_user
VITE_SMTP_PASS=your_smtp_password
VITE_SMTP_FROM=your_email@domain.com

# App Configuration
VITE_APP_URL=https://yourdomain.com
VITE_APP_NAME=رزقي - Rezge
NODE_ENV=production
```

### 5. بناء المشروع

```bash
# الانتقال لمجلد المشروع
cd /var/www/rezge

# تثبيت التبعيات
npm install

# بناء المشروع للإنتاج
npm run build

# التحقق من البناء
ls -la dist/
```

---

## 🗄️ إعداد قاعدة البيانات

### 1. تثبيت PostgreSQL

```bash
# تثبيت PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# بدء خدمة PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# التحقق من الحالة
sudo systemctl status postgresql
```

### 2. إعداد قاعدة البيانات

```bash
# التبديل لمستخدم PostgreSQL
sudo -u postgres psql

# إنشاء قاعدة بيانات جديدة
CREATE DATABASE rezge_db;
CREATE USER rezge_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE rezge_db TO rezge_user;
\q
```

### 3. استيراد بيانات المشروع

```bash
# استيراد ملفات SQL (إذا كانت متوفرة)
sudo -u postgres psql -d rezge_db -f /var/www/rezge/database/schema.sql
sudo -u postgres psql -d rezge_db -f /var/www/rezge/database/data.sql
```

---

## 🌐 إعداد خادم الويب

### 1. تثبيت Nginx

```bash
# تثبيت Nginx
sudo apt install -y nginx

# بدء خدمة Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# التحقق من الحالة
sudo systemctl status nginx
```

### 2. إعداد Nginx للمشروع

```bash
# إنشاء ملف الإعداد
sudo nano /etc/nginx/sites-available/rezge

# إضافة التكوين التالي:
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/rezge/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Main location
    location / {
        try_files $uri $uri/ /index.html;
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

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security
    location ~ /\. {
        deny all;
    }
}
```

### 3. تفعيل الموقع

```bash
# إنشاء رابط رمزي
sudo ln -s /etc/nginx/sites-available/rezge /etc/nginx/sites-enabled/

# إزالة الموقع الافتراضي
sudo rm /etc/nginx/sites-enabled/default

# اختبار التكوين
sudo nginx -t

# إعادة تحميل Nginx
sudo systemctl reload nginx
```

---

## 🔒 إعداد الأمان وSSL

### 1. تثبيت Certbot

```bash
# تثبيت Certbot
sudo apt install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# اختبار التجديد التلقائي
sudo certbot renew --dry-run
```

### 2. إعداد Firewall

```bash
# تثبيت UFW
sudo apt install -y ufw

# إعداد القواعد الأساسية
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 80
sudo ufw allow 443

# تفعيل Firewall
sudo ufw enable

# التحقق من الحالة
sudo ufw status
```

### 3. تحديث Nginx لSSL

```bash
# تحديث ملف الإعداد
sudo nano /etc/nginx/sites-available/rezge
```

```nginx
# إضافة التكوين التالي للـ SSL
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # باقي التكوين...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 🌍 ربط النطاق

### 1. إعداد DNS

#### 📝 **في لوحة تحكم Hostinger:**
1. اذهب إلى "Domains" في لوحة التحكم
2. اختر النطاق المطلوب
3. اذهب إلى "DNS Zone Editor"
4. أضف السجلات التالية:

| النوع | الاسم | القيمة | TTL |
|:---:|:---:|:---:|:---:|
| A | @ | YOUR_VPS_IP | 3600 |
| A | www | YOUR_VPS_IP | 3600 |
| CNAME | mail | yourdomain.com | 3600 |

### 2. اختبار النطاق

```bash
# اختبار DNS
nslookup yourdomain.com
dig yourdomain.com

# اختبار الاتصال
curl -I https://yourdomain.com
```

---

## 📊 مراقبة النظام

### 1. إعداد PM2 للمشروع

```bash
# إنشاء ملف PM2
nano /var/www/rezge/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'rezge-app',
    script: 'npm',
    args: 'run preview',
    cwd: '/var/www/rezge',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### 2. بدء التطبيق

```bash
# بدء التطبيق
pm2 start /var/www/rezge/ecosystem.config.js

# حفظ إعدادات PM2
pm2 save

# مراقبة التطبيق
pm2 monit
```

### 3. إعداد مراقبة النظام

```bash
# تثبيت أدوات المراقبة
sudo apt install -y htop iotop nethogs

# مراقبة الموارد
htop
```

---

## 🔄 النسخ الاحتياطي

### 1. إعداد النسخ الاحتياطي التلقائي

```bash
# إنشاء سكريبت النسخ الاحتياطي
nano /var/www/rezge/backup.sh
```

```bash
#!/bin/bash

# إعدادات النسخ الاحتياطي
BACKUP_DIR="/var/backups/rezge"
PROJECT_DIR="/var/www/rezge"
DB_NAME="rezge_db"
DATE=$(date +%Y%m%d_%H%M%S)

# إنشاء مجلد النسخ الاحتياطي
mkdir -p $BACKUP_DIR

# نسخ احتياطي للملفات
tar -czf $BACKUP_DIR/files_$DATE.tar.gz -C $PROJECT_DIR .

# نسخ احتياطي لقاعدة البيانات
sudo -u postgres pg_dump $DB_NAME > $BACKUP_DIR/database_$DATE.sql

# ضغط نسخة قاعدة البيانات
gzip $BACKUP_DIR/database_$DATE.sql

# حذف النسخ القديمة (أكثر من 7 أيام)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "تم إنشاء النسخ الاحتياطي بنجاح: $DATE"
```

### 2. تفعيل النسخ الاحتياطي التلقائي

```bash
# جعل السكريبت قابل للتنفيذ
chmod +x /var/www/rezge/backup.sh

# إضافة إلى crontab (نسخ احتياطي يومي في 2 صباحاً)
crontab -e

# إضافة السطر التالي:
0 2 * * * /var/www/rezge/backup.sh >> /var/log/rezge_backup.log 2>&1
```

---

## ❓ استكشاف الأخطاء

### 1. مشاكل شائعة وحلولها

#### 🔴 **المشكلة: الموقع لا يظهر**
```bash
# فحص حالة Nginx
sudo systemctl status nginx

# فحص ملفات السجل
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# اختبار التكوين
sudo nginx -t
```

#### 🔴 **المشكلة: خطأ في قاعدة البيانات**
```bash
# فحص حالة PostgreSQL
sudo systemctl status postgresql

# فحص الاتصال
sudo -u postgres psql -d rezge_db -c "SELECT version();"

# فحص السجلات
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### 🔴 **المشكلة: خطأ في PM2**
```bash
# فحص حالة التطبيقات
pm2 status

# فحص السجلات
pm2 logs rezge-app

# إعادة تشغيل التطبيق
pm2 restart rezge-app
```

### 2. أدوات التشخيص

```bash
# فحص استخدام الذاكرة
free -h

# فحص استخدام القرص
df -h

# فحص العمليات النشطة
ps aux | grep node

# فحص المنافذ المفتوحة
netstat -tulpn | grep :80
netstat -tulpn | grep :443
```

---

## 🎉 التحقق النهائي

### 1. قائمة التحقق

- [ ] ✅ VPS يعمل بشكل صحيح
- [ ] ✅ المشروع مرفوع ومبني
- [ ] ✅ قاعدة البيانات تعمل
- [ ] ✅ Nginx يعمل مع SSL
- [ ] ✅ النطاق يعمل بشكل صحيح
- [ ] ✅ PM2 يدير التطبيق
- [ ] ✅ النسخ الاحتياطي مُعد
- [ ] ✅ Firewall مُعد
- [ ] ✅ المراقبة تعمل

### 2. اختبار الأداء

```bash
# اختبار سرعة الموقع
curl -w "@curl-format.txt" -o /dev/null -s "https://yourdomain.com"

# اختبار الضغط
curl -H "Accept-Encoding: gzip" -I https://yourdomain.com
```

---

## 📞 الدعم والمساعدة

### 🆘 **في حالة المشاكل:**

1. **راجع السجلات**: `/var/log/nginx/error.log`
2. **فحص الحالة**: `sudo systemctl status nginx`
3. **اختبار التكوين**: `sudo nginx -t`
4. **إعادة تشغيل الخدمات**: `sudo systemctl restart nginx`

### 📚 **المراجع المفيدة:**

- [Hostinger VPS Documentation](https://support.hostinger.com/en/articles/1583299-vps-hosting-guide)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

<div align="center">

## 🎊 تهانينا! مشروع رزقي جاهز على الإنترنت

**تم رفع مشروع رزقي بنجاح على VPS في Hostinger**

[![Live Site](https://img.shields.io/badge/Live_Site-https://yourdomain.com-green?style=for-the-badge)](https://yourdomain.com)
[![Status](https://img.shields.io/badge/Status-Online-brightgreen?style=for-the-badge)](https://yourdomain.com)

---

**آخر تحديث:** يناير 2025  
**المؤلف:** Augment Agent  
**المشروع:** رزقي - Rezge للزواج الإسلامي

</div>
