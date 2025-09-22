<div align="center">

# ⚡ دليل النشر السريع - رزقي
## Quick Deployment Guide - Rezge Islamic Marriage Platform

[![Deployment](https://img.shields.io/badge/Deployment-Ready-green?style=for-the-badge)](https://github.com)
[![VPS](https://img.shields.io/badge/VPS-Hostinger-blue?style=for-the-badge)](https://hostinger.com)
[![Time](https://img.shields.io/badge/Time-30_Minutes-orange?style=for-the-badge)](https://github.com)

**دليل سريع لرفع مشروع رزقي على VPS في 30 دقيقة**

</div>

---

## 🚀 النشر في 5 خطوات

### 1️⃣ **شراء VPS من Hostinger** (5 دقائق)

1. اذهب إلى [hostinger.com/vps-hosting](https://hostinger.com/vps-hosting)
2. اختر **VPS 1** (4GB RAM, 80GB SSD) - $3.99/شهر
3. اختر **Ubuntu 22.04 LTS**
4. اختر موقع الخادم (أوروبا أو آسيا)
5. أكمل عملية الشراء

### 2️⃣ **إعداد VPS** (10 دقائق)

```bash
# الاتصال بالخادم
ssh root@YOUR_VPS_IP

# تحديث النظام
apt update && apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# تثبيت Nginx
apt install -y nginx

# تثبيت PM2
npm install -g pm2

# تثبيت PostgreSQL
apt install -y postgresql postgresql-contrib
```

### 3️⃣ **رفع المشروع** (5 دقائق)

```bash
# إنشاء مجلد المشروع
mkdir -p /var/www/rezge
cd /var/www/rezge

# رفع ملفات المشروع (استخدم SCP أو Git)
# scp -r /path/to/your/project/* root@YOUR_VPS_IP:/var/www/rezge/

# تثبيت التبعيات
npm ci --only=production

# بناء المشروع
npm run build
```

### 4️⃣ **إعداد Nginx** (5 دقائق)

```bash
# نسخ ملف الإعداد
cp nginx.conf /etc/nginx/sites-available/rezge

# تحديث النطاق في الملف
nano /etc/nginx/sites-available/rezge
# استبدل yourdomain.com بالنطاق الفعلي

# تفعيل الموقع
ln -s /etc/nginx/sites-available/rezge /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# اختبار التكوين
nginx -t

# إعادة تحميل Nginx
systemctl reload nginx
```

### 5️⃣ **إعداد SSL والنطاق** (5 دقائق)

```bash
# تثبيت Certbot
apt install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# بدء التطبيق
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 📋 قائمة التحقق السريعة

### ✅ **قبل النشر:**
- [ ] VPS مشتري ومُعد
- [ ] النطاق مُعد ومُوجه لـ VPS
- [ ] ملفات المشروع جاهزة
- [ ] إعدادات البيئة محدثة

### ✅ **بعد النشر:**
- [ ] الموقع يعمل على HTTP
- [ ] SSL يعمل على HTTPS
- [ ] PM2 يدير التطبيق
- [ ] قاعدة البيانات تعمل
- [ ] البريد الإلكتروني يعمل

---

## 🔧 إعدادات سريعة

### **ملف البيئة (.env.production):**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_SMTP_HOST=smtp.hostinger.com
VITE_SMTP_USER=your_email@domain.com
VITE_SMTP_PASS=your_password
VITE_APP_URL=https://yourdomain.com
```

### **إعدادات Nginx الأساسية:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/rezge/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### **إعدادات PM2:**
```javascript
module.exports = {
  apps: [{
    name: 'rezge-app',
    script: 'npm',
    args: 'run preview',
    cwd: '/var/www/rezge',
    instances: 1,
    autorestart: true
  }]
};
```

---

## 🆘 حل المشاكل السريع

### **المشكلة: الموقع لا يظهر**
```bash
# فحص Nginx
systemctl status nginx
nginx -t

# فحص PM2
pm2 status
pm2 logs
```

### **المشكلة: خطأ SSL**
```bash
# إعادة تشغيل Certbot
certbot renew --dry-run
systemctl reload nginx
```

### **المشكلة: خطأ في قاعدة البيانات**
```bash
# فحص PostgreSQL
systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"
```

---

## 📞 الدعم السريع

### **أوامر مفيدة:**
```bash
# فحص حالة الخدمات
systemctl status nginx postgresql

# فحص PM2
pm2 status
pm2 logs rezge-app

# فحص السجلات
tail -f /var/log/nginx/error.log
tail -f /var/log/pm2/rezge-error.log

# إعادة تشغيل كل شيء
pm2 restart all
systemctl restart nginx
```

### **ملفات مهمة:**
- **Nginx config**: `/etc/nginx/sites-available/rezge`
- **PM2 config**: `/var/www/rezge/ecosystem.config.js`
- **Environment**: `/var/www/rezge/.env.production`
- **Logs**: `/var/log/nginx/` و `/var/log/pm2/`

---

## 🎉 تهانينا!

**تم نشر مشروع رزقي بنجاح! 🚀**

الموقع الآن متاح على: `https://yourdomain.com`

### **الخطوات التالية:**
1. ✅ اختبار جميع الميزات
2. ✅ إعداد النسخ الاحتياطي
3. ✅ مراقبة الأداء
4. ✅ تحديث المحتوى

---

<div align="center">

**للحصول على دليل مفصل، راجع: [HOSTINGER_VPS_DEPLOYMENT_GUIDE.md](HOSTINGER_VPS_DEPLOYMENT_GUIDE.md)**

---

**آخر تحديث:** يناير 2025  
**المشروع:** رزقي - Rezge للزواج الإسلامي

</div>
