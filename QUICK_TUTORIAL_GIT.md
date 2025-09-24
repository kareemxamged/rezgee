# ⚡ توتوريال النشر السريع - رزقي على VPS Hostinger
## Quick Deployment Tutorial - Rezge on Hostinger VPS

<div align="center">

[![Quick Deploy](https://img.shields.io/badge/Quick-Deploy-green?style=for-the-badge)](https://github.com)
[![Git](https://img.shields.io/badge/Git-Clone-blue?style=for-the-badge)](https://git-scm.com)
[![Time](https://img.shields.io/badge/Time-45_Minutes-orange?style=for-the-badge)](https://github.com)

**توتوريال سريع لرفع مشروع رزقي على VPS Hostinger باستخدام Git**

</div>

---

## 📋 **معلومات المشروع**

- **اسم المشروع:** رزقي - Rezge (منصة الزواج الإسلامي)
- **نوع المشروع:** React + TypeScript + Supabase
- **IP الخادم:** `148.230.112.17`
- **النطاق:** `rezgee.com`
- **نظام التشغيل:** Ubuntu 22.04 LTS

---

## 🚀 **النشر في 8 خطوات**

### **1️⃣ إعداد VPS (10 دقائق)**

```bash
# الاتصال بالخادم
ssh root@148.230.112.17

# تحديث النظام
apt update && apt upgrade -y

# تثبيت المتطلبات الأساسية
apt install -y curl wget git unzip software-properties-common

# تثبيت Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# تثبيت Nginx
apt install -y nginx
systemctl enable nginx
systemctl start nginx

# تثبيت PM2
npm install -g pm2

# تثبيت Certbot للـ SSL
apt install -y certbot python3-certbot-nginx

# إعداد الجدار الناري
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3000
```

### **2️⃣ إنشاء مستخدم ومجلدات المشروع (3 دقائق)**

```bash
# إنشاء مستخدم rezgee
adduser --disabled-password --gecos "" rezgee
usermod -aG sudo rezgee

# إنشاء مجلدات المشروع
mkdir -p /var/www/rezgee
mkdir -p /var/log/pm2
chown -R rezgee:rezgee /var/www/rezgee
chown -R rezgee:rezgee /var/log/pm2
```

### **3️⃣ استنساخ المشروع من Git (5 دقائق)**

```bash
# الانتقال إلى مجلد المشروع
cd /var/www/rezgee

# استنساخ المشروع من Git
git clone https://github.com/your-username/rezgee-islamic-marriage.git .

# تثبيت التبعيات
npm ci --only=production

# بناء المشروع
npm run build
```

### **4️⃣ إنشاء ملفات التكوين (5 دقائق)**

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

```bash
# إنشاء ملف البيئة
nano .env.production
```

**أدخل المحتوى التالي:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# SMTP Email Configuration
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

### **5️⃣ إعداد Nginx (5 دقائق)**

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

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
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

```bash
# تفعيل الموقع
ln -sf /etc/nginx/sites-available/rezgee.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# اختبار تكوين Nginx
nginx -t

# إعادة تحميل Nginx
systemctl reload nginx
```

### **6️⃣ بدء التطبيق (3 دقائق)**

```bash
# إعداد PM2 للبدء التلقائي
sudo -u rezgee pm2 startup systemd -u rezgee --hp /home/rezgee

# بدء التطبيق
sudo -u rezgee pm2 start ecosystem.config.js

# حفظ إعدادات PM2
sudo -u rezgee pm2 save

# التحقق من حالة التطبيق
sudo -u rezgee pm2 status
```

### **7️⃣ إعداد SSL (5 دقائق)**

```bash
# الحصول على شهادة SSL
certbot --nginx -d rezgee.com -d www.rezgee.com

# اختبار التجديد التلقائي
certbot renew --dry-run

# إعداد التجديد التلقائي
crontab -e
# أضف السطر التالي:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### **8️⃣ إعداد DNS (4 دقائق)**

**في لوحة تحكم النطاق، أضف السجلات التالية:**

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

**انتظر 5-30 دقيقة حتى ينتشر DNS**

---

## ✅ **التحقق من النشر**

### **فحص الخدمات:**
```bash
# فحص Nginx
systemctl status nginx

# فحص PM2
sudo -u rezgee pm2 status

# فحص SSL
curl -I https://rezgee.com
```

### **اختبار الموقع:**
- اذهب إلى: `https://rezgee.com`
- تأكد من عمل جميع الميزات
- اختبر تسجيل الدخول والتسجيل
- اختبر إرسال البريد الإلكتروني

---

## 🔄 **تحديث المشروع عبر Git**

### **طريقة التحديث اليدوي:**
```bash
cd /var/www/rezgee
git pull origin main
npm ci --only=production
npm run build
sudo -u rezgee pm2 restart rezgee-app
```

### **إنشاء سكريبت التحديث التلقائي:**
```bash
# إنشاء سكريبت التحديث
nano /var/www/rezgee/update-project.sh
```

**أدخل المحتوى التالي:**
```bash
#!/bin/bash
cd /var/www/rezgee
git pull origin main
npm ci --only=production
npm run build
sudo -u rezgee pm2 restart rezgee-app
echo "Project updated successfully!"
```

```bash
# جعل السكريبت قابل للتنفيذ
chmod +x /var/www/rezgee/update-project.sh

# استخدام السكريبت
/var/www/rezgee/update-project.sh
```

---

## 🆘 **حل المشاكل السريع**

### **المشكلة: الموقع لا يظهر**
```bash
sudo -u rezgee pm2 restart all
systemctl restart nginx
```

### **المشكلة: خطأ SSL**
```bash
certbot renew --dry-run
systemctl reload nginx
```

### **المشكلة: خطأ في التطبيق**
```bash
sudo -u rezgee pm2 logs rezgee-app
tail -f /var/log/nginx/error.log
```

---

## 📋 **قائمة التحقق السريعة**

- [ ] VPS مُعد ومُجهز
- [ ] المشروع مستنسخ من Git
- [ ] التبعيات مُثبتة والمشروع مبني
- [ ] البيئة مُعدة
- [ ] Nginx يعمل
- [ ] PM2 يدير التطبيق
- [ ] SSL يعمل
- [ ] DNS مُوجه
- [ ] الموقع يعمل

---

## 🎉 **تهانينا!**

**تم نشر مشروع رزقي بنجاح! 🚀**

الموقع متاح على: **https://rezgee.com**

---

**للحصول على دليل مفصل:** [TUTORIAL_DEPLOYMENT_HOSTINGER.md](TUTORIAL_DEPLOYMENT_HOSTINGER.md)

**آخر تحديث:** يناير 2025
