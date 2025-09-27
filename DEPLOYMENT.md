# دليل النشر

## نظرة عامة

هذا الدليل يوضح كيفية نشر منصة رزقي على خادم VPS باستخدام Hostinger.

## المتطلبات

### الخادم
- VPS مع Ubuntu 20.04 أو أحدث
- 2GB RAM على الأقل
- 20GB مساحة تخزين على الأقل
- عنوان IP ثابت
- دومين مرتبط بالخادم

### البرمجيات المطلوبة
- Node.js 20.x
- npm 8.x
- PM2
- Nginx
- Certbot
- Git

## خطوات النشر

### 1. إعداد الخادم

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت PM2
npm install -g pm2

# تثبيت Nginx
sudo apt install nginx -y

# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx -y

# تثبيت Git
sudo apt install git -y
```

### 2. استنساخ المشروع

```bash
# الانتقال إلى مجلد الويب
cd /var/www

# استنساخ المشروع
sudo git clone https://github.com/kareemxamged/rezgee.git
sudo chown -R $USER:$USER /var/www/rezgee
cd /var/www/rezgee

# تثبيت التبعيات
npm install

# بناء المشروع
npm run build
```

### 3. إعداد متغيرات البيئة

```bash
# نسخ ملف البيئة
cp .env.example .env.production

# تعديل المتغيرات
nano .env.production
```

### 4. إعداد PM2

```bash
# بدء التطبيق
pm2 start ecosystem.config.cjs

# حفظ إعدادات PM2
pm2 save

# إعداد PM2 للبدء التلقائي
pm2 startup
```

### 5. إعداد Nginx

```bash
# إنشاء ملف التكوين
sudo nano /etc/nginx/sites-available/rezgee.com
```

محتوى الملف:
```nginx
server {
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
    }

    # SMTP Server Proxy
    location /smtp/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
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
sudo ln -s /etc/nginx/sites-available/rezgee.com /etc/nginx/sites-enabled/

# إزالة الموقع الافتراضي
sudo rm -f /etc/nginx/sites-enabled/default

# اختبار التكوين
sudo nginx -t

# إعادة تحميل Nginx
sudo systemctl reload nginx
```

### 6. إعداد SSL

```bash
# الحصول على شهادة SSL
sudo certbot --nginx -d rezgee.com -d www.rezgee.com

# اختبار التجديد التلقائي
sudo certbot renew --dry-run
```

### 7. إعداد الجدار الناري

```bash
# تثبيت UFW
sudo apt install ufw -y

# إعداد القواعد
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3001

# تفعيل الجدار الناري
sudo ufw enable
```

## التحديث التلقائي

### إعداد سكريبت التحديث

```bash
# جعل السكريبت قابل للتنفيذ
chmod +x update-project.sh

# اختبار السكريبت
./update-project.sh
```

### إعداد Cron للتحديث التلقائي

```bash
# فتح crontab
crontab -e

# إضافة المهمة التالية
0 2 * * * /var/www/rezgee/update-project.sh >> /var/log/rezgee-update.log 2>&1
```

## مراقبة التطبيق

### PM2

```bash
# عرض حالة العمليات
pm2 status

# عرض السجلات
pm2 logs

# إعادة تشغيل التطبيق
pm2 restart all

# إيقاف التطبيق
pm2 stop all
```

### Nginx

```bash
# عرض حالة Nginx
sudo systemctl status nginx

# عرض السجلات
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### النظام

```bash
# مراقبة استخدام الموارد
htop

# مراقبة المساحة
df -h

# مراقبة الذاكرة
free -h
```

## استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في البناء**
   ```bash
   # تنظيف node_modules وإعادة التثبيت
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **خطأ في PM2**
   ```bash
   # إعادة تشغيل PM2
   pm2 restart all
   pm2 logs
   ```

3. **خطأ في Nginx**
   ```bash
   # اختبار التكوين
   sudo nginx -t
   
   # إعادة تحميل التكوين
   sudo systemctl reload nginx
   ```

4. **خطأ في SSL**
   ```bash
   # تجديد الشهادة
   sudo certbot renew
   ```

### سجلات مفيدة

```bash
# سجلات PM2
pm2 logs

# سجلات Nginx
sudo tail -f /var/log/nginx/error.log

# سجلات النظام
sudo journalctl -u nginx
sudo journalctl -u pm2-root
```

## النسخ الاحتياطي

### نسخ احتياطي للكود

```bash
# إنشاء نسخة احتياطية
tar -czf rezgee-backup-$(date +%Y%m%d).tar.gz /var/www/rezgee

# نسخ إلى موقع آمن
scp rezgee-backup-*.tar.gz user@backup-server:/backups/
```

### نسخ احتياطي لقاعدة البيانات

```bash
# نسخ احتياطي لـ Supabase
# يتم إدارته تلقائياً من خلال Supabase
```

## الأمان

### تحديثات النظام

```bash
# تحديث النظام بانتظام
sudo apt update && sudo apt upgrade -y
```

### مراقبة الأمان

```bash
# فحص الثغرات
npm audit

# فحص الملفات الحساسة
grep -r "password\|secret\|key" /var/www/rezgee/
```

---

**آخر تحديث**: 2025-09-24
