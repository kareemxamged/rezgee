# ⚡ تعليمات النشر السريع - رزقي على VPS Hostinger
## Quick Deployment Instructions - Rezge on Hostinger VPS

<div align="center">

[![Quick Deploy](https://img.shields.io/badge/Quick-Deploy-green?style=for-the-badge)](https://github.com)
[![Time](https://img.shields.io/badge/Time-30_Minutes-orange?style=for-the-badge)](https://github.com)

**تعليمات سريعة لرفع مشروع رزقي على VPS Hostinger في 30 دقيقة**

</div>

---

## 🚀 **النشر في 8 خطوات**

### **1️⃣ إعداد VPS (5 دقائق)**
```bash
# الاتصال بالخادم
ssh root@148.230.112.17

# رفع وتشغيل سكريبت الإعداد
scp setup-vps.sh root@148.230.112.17:/tmp/
ssh root@148.230.112.17
chmod +x /tmp/setup-vps.sh
/tmp/setup-vps.sh
```

### **2️⃣ إعداد المشروع محلياً (5 دقائق)**
```bash
# تشغيل سكريبت النشر
./deploy-hostinger.sh
# أو على Windows: deploy-hostinger.bat
```

### **3️⃣ رفع المشروع (5 دقائق)**
```bash
# رفع الملف المضغوط
scp rezge-hostinger-deploy-*.tar.gz root@148.230.112.17:/tmp/

# استخراج وتركيب
ssh root@148.230.112.17
cd /var/www/rezge
tar -xzf /tmp/rezge-hostinger-deploy-*.tar.gz --strip-components=1
npm ci --only=production
npm run build
```

### **4️⃣ إعداد البيئة (3 دقائق)**
```bash
# تحديث ملف البيئة
nano /var/www/rezge/.env.production

# تحديث الإعدادات التالية:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_key
# VITE_SMTP_USER=noreply@rezgee.com
# VITE_SMTP_PASS=your_smtp_password
# VITE_APP_URL=https://rezgee.com
```

### **5️⃣ إعداد Nginx (2 دقائق)**
```bash
# تطبيق إعدادات Nginx
cp nginx.conf /etc/nginx/sites-available/rezgee.com
ln -sf /etc/nginx/sites-available/rezgee.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### **6️⃣ بدء التطبيق (2 دقائق)**
```bash
# بدء التطبيق مع PM2
sudo -u rezge pm2 start ecosystem.config.js
sudo -u rezge pm2 save
sudo -u rezge pm2 startup
```

### **7️⃣ إعداد SSL (5 دقائق)**
```bash
# الحصول على شهادة SSL
certbot --nginx -d rezgee.com -d www.rezgee.com

# إعداد التجديد التلقائي
crontab -e
# إضافة: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **8️⃣ إعداد DNS (3 دقائق)**
```
# في لوحة تحكم النطاق:
Type: A, Name: @, Value: 148.230.112.17
Type: A, Name: www, Value: 148.230.112.17
```

---

## ✅ **التحقق من النشر**

### **فحص الخدمات:**
```bash
# فحص Nginx
systemctl status nginx

# فحص PM2
sudo -u rezge pm2 status

# فحص SSL
curl -I https://rezgee.com
```

### **اختبار الموقع:**
- اذهب إلى: `https://rezgee.com`
- تأكد من عمل جميع الميزات
- اختبر تسجيل الدخول والتسجيل
- اختبر إرسال البريد الإلكتروني

---

## 🆘 **حل المشاكل السريع**

### **المشكلة: الموقع لا يظهر**
```bash
sudo -u rezge pm2 restart all
systemctl restart nginx
```

### **المشكلة: خطأ SSL**
```bash
certbot renew --dry-run
systemctl reload nginx
```

### **المشكلة: خطأ في التطبيق**
```bash
sudo -u rezge pm2 logs rezge-app
tail -f /var/log/nginx/error.log
```

---

## 📋 **قائمة التحقق السريعة**

- [ ] VPS مُعد ومُجهز
- [ ] المشروع مرفوع ومبني
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

**للحصول على دليل مفصل:** [README_DEPLOYMENT_HOSTINGER.md](README_DEPLOYMENT_HOSTINGER.md)

**آخر تحديث:** يناير 2025

