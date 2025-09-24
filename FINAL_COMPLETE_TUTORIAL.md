# 🚀 التوتوريال النهائي الشامل - رزقي على VPS Hostinger
## Complete Final Tutorial - Rezge on Hostinger VPS

<div align="center">

[![Tutorial](https://img.shields.io/badge/Tutorial-Complete_Final-blue?style=for-the-badge)](https://github.com)
[![VPS](https://img.shields.io/badge/VPS-Hostinger-green?style=for-the-badge)](https://hostinger.com)
[![Root](https://img.shields.io/badge/Root-Only-red?style=for-the-badge)](https://github.com)
[![Time](https://img.shields.io/badge/Time-60_Minutes-orange?style=for-the-badge)](https://github.com)

**التوتوريال النهائي الشامل لرفع مشروع رزقي على VPS Hostinger مع جميع الحلول والأخطاء الشائعة**

</div>

---

## 📋 **معلومات المشروع**

- **اسم المشروع:** رزقي - Rezge (منصة الزواج الإسلامي)
- **نوع المشروع:** React + TypeScript + Supabase + SMTP Server
- **IP الخادم:** `148.230.112.17`
- **النطاق:** `rezgee.com`
- **نظام التشغيل:** Ubuntu 22.04 LTS
- **المستخدم:** root فقط
- **GitHub Repository:** `https://github.com/kareemxamged/rezgee.git`

---

## **المرحلة الأولى: إعداد VPS** ⚙️

### **الخطوة 1: الاتصال بالخادم**

```bash
ssh root@148.230.112.17
```

### **الخطوة 2: تحديث النظام**

```bash
# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release htop nano vim ufw fail2ban
```

### **الخطوة 3: تثبيت Node.js 20.x**

```bash
# Remove old Node.js if exists
apt remove -y nodejs npm

# Add Node.js 20.x repository
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Install Node.js 20.x
apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**Expected Result:**
- Node.js version: v20.x.x
- NPM version: 10.x.x

### **الخطوة 4: تثبيت Nginx**

```bash
# Install Nginx
apt install -y nginx

# Enable and start Nginx
systemctl enable nginx
systemctl start nginx

# Check Nginx status
systemctl status nginx
```

### **الخطوة 5: تثبيت PM2**

```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

### **الخطوة 6: تثبيت Certbot للـ SSL**

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

### **الخطوة 7: إعداد الجدار الناري**

```bash
# Enable firewall
ufw --force enable

# Allow SSH
ufw allow ssh

# Allow Nginx
ufw allow 'Nginx Full'

# Allow application ports
ufw allow 3000
ufw allow 3001
ufw allow 4173

# Check firewall status
ufw status
```

### **الخطوة 8: إنشاء مجلدات المشروع**

```bash
# Create project directory
mkdir -p /var/www/rezgee

# Create logs directory
mkdir -p /var/log/pm2

# Verify directories
ls -la /var/www/
ls -la /var/log/pm2
```

---

## **المرحلة الثانية: رفع المشروع عبر Git** 📁

### **الخطوة 9: استنساخ المشروع على الخادم**

```bash
# Navigate to project directory
cd /var/www/rezgee

# Clone project from Git
git clone https://github.com/kareemxamged/rezgee.git .

# Verify files
ls -la
```

### **الخطوة 10: إنشاء ملف PM2**

```bash
# Create PM2 configuration file
nano ecosystem.config.cjs
```

**Enter the following content:**

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
    }, {
        name: 'rezgee-smtp',
        script: 'node',
        args: 'simple-smtp-server.js',
        cwd: '/var/www/rezgee',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '512M',
        env: {
            NODE_ENV: 'production',
            PORT: 3001
        },
        error_file: '/var/log/pm2/rezgee-smtp-error.log',
        out_file: '/var/log/pm2/rezgee-smtp-out.log',
        log_file: '/var/log/pm2/rezgee-smtp-combined.log',
        time: true
    }]
};
```

**Save file:** Press `Ctrl + X` then `Y` then `Enter`

### **الخطوة 11: تثبيت التبعيات**

```bash
# Install dependencies
npm ci --only=production

# Verify installation
npm list --depth=0
```

### **الخطوة 12: بناء المشروع**

```bash
# Build project for production
npm run build

# Verify dist folder exists
ls -la dist/
```

---

## **المرحلة الثالثة: إعداد البيئة** 🔧

### **الخطوة 13: تحديث ملف البيئة**

```bash
# Edit environment file
nano /var/www/rezgee/.env.production
```

**Update the following values:**

```env
# Supabase Configuration (Get these values from Supabase dashboard)
VITE_SUPABASE_URL=https://sbtzngewizgeqzfbhfjy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidHpuZ2V3aXpnZXF6ZmJoZmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzc5MTMsImV4cCI6MjA2NjcxMzkxM30.T8iv9C4OeKAb-e4Oz6uw3tFnMrgFK3SKN6fVCrBEUGo

# SMTP Email Configuration (Get these values from Hostinger)
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

**Save file:** Press `Ctrl + X` then `Y` then `Enter`

### **الخطوة 14: بناء المشروع على الخادم**

```bash
# Build project
npm run build

# Verify dist folder exists
ls -la dist/
```

---

## **المرحلة الرابعة: إعداد Nginx** 🌐

### **الخطوة 15: إنشاء ملف إعداد Nginx**

```bash
# Create Nginx configuration file
nano /etc/nginx/sites-available/rezgee.com
```

**Enter the following content:**

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
        proxy_pass http://localhost:4173;
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

**Save file:** Press `Ctrl + X` then `Y` then `Enter`

### **الخطوة 16: تفعيل الموقع**

```bash
# Enable site
ln -sf /etc/nginx/sites-available/rezgee.com /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t
```

**Expected Result:** `nginx: configuration file /etc/nginx/nginx.conf test is successful`

### **الخطوة 17: إعادة تحميل Nginx**

```bash
# Reload Nginx
systemctl reload nginx

# Check Nginx status
systemctl status nginx
```

---

## **المرحلة الخامسة: إعداد PM2** 🔄

### **الخطوة 18: إعداد PM2 للبدء التلقائي**

```bash
# Setup PM2 for auto-start
pm2 startup systemd

# Follow the instructions that appear on screen
# Copy and paste the command that appears (without sudo)
```

### **الخطوة 19: بدء التطبيق**

```bash
# Navigate to project directory
cd /var/www/rezgee

# Start application with PM2
pm2 start ecosystem.config.cjs

# Save PM2 settings
pm2 save
```

### **الخطوة 20: التحقق من حالة التطبيق**

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs rezgee-app
pm2 logs rezgee-smtp

# Check resource usage
pm2 monit
```

---

## **المرحلة السادسة: إعداد SSL** 🔒

### **الخطوة 21: الحصول على شهادة SSL**

```bash
# Get SSL certificate
certbot --nginx -d rezgee.com -d www.rezgee.com
```

**Follow instructions:**
1. Enter your email address
2. Read and agree to terms of service
3. Choose whether to share your email
4. Choose to redirect HTTP to HTTPS

### **الخطوة 22: اختبار التجديد التلقائي**

```bash
# Test automatic renewal
certbot renew --dry-run
```

### **الخطوة 23: إعداد التجديد التلقائي**

```bash
# Add cron job for automatic renewal
crontab -e
```

**Add the following line:**
```
0 12 * * * /usr/bin/certbot renew --quiet
```

**Save file:** Press `Ctrl + X` then `Y` then `Enter`

---

## **المرحلة السابعة: إعداد DNS** 🌍

### **الخطوة 24: تحديث DNS في لوحة تحكم النطاق**

Go to your domain control panel and add the following records:

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

### **الخطوة 25: انتظار انتشار DNS**

```bash
# Check DNS
nslookup rezgee.com
dig rezgee.com

# Check from another server
curl -I http://rezgee.com
```

**Wait 5-30 minutes for DNS propagation**

---

## **المرحلة الثامنة: الاختبار والتحقق** ✅

### **الخطوة 26: فحص الخدمات**

```bash
# Check Nginx status
systemctl status nginx

# Check PM2 status
pm2 status

# Check ports
netstat -tlnp | grep :443
netstat -tlnp | grep :80
netstat -tlnp | grep :4173
netstat -tlnp | grep :3001
```

### **الخطوة 27: اختبار الموقع**

```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://rezgee.com

# Test HTTPS
curl -I https://rezgee.com

# Test from browser
# Go to: https://rezgee.com
```

### **الخطوة 28: اختبار الميزات**

1. **Test homepage**
2. **Test login**
3. **Test registration**
4. **Test email sending**
5. **Test all features**

---

## **المرحلة التاسعة: إعداد التحديث التلقائي** 🔄

### **الخطوة 29: إنشاء سكريبت التحديث التلقائي**

```bash
# Create update script
nano /var/www/rezgee/update-project.sh
```

**Enter the following content:**

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Start update process
print_status "Starting project update process..."

# Navigate to project directory
cd /var/www/rezgee || {
    print_error "Failed to navigate to project directory"
    exit 1
}

# Check for available updates
print_status "Checking for available updates..."
git fetch origin || {
    print_error "Failed to fetch updates from GitHub"
    exit 1
}

# Display available updates
UPDATES=$(git log HEAD..origin/main --oneline)
if [ -z "$UPDATES" ]; then
    print_success "No new updates available"
    exit 0
fi

print_status "Available updates:"
echo "$UPDATES"

# Pull updates from GitHub
print_status "Pulling updates from GitHub..."
git pull origin main || {
    print_error "Failed to pull updates from GitHub"
    exit 1
}

# Install new dependencies
print_status "Installing dependencies..."
npm ci --only=production || {
    print_error "Failed to install dependencies"
    exit 1
}

# Build the project
print_status "Building project..."
npm run build || {
    print_error "Failed to build project"
    exit 1
}

# Restart the application
print_status "Restarting application..."
pm2 restart rezgee-app || {
    print_error "Failed to restart application"
    exit 1
}

# Check application status
print_status "Checking application status..."
pm2 status

print_success "Project updated successfully!"
print_status "Update completed at $(date)"
```

**Save file:** Press `Ctrl + X` then `Y` then `Enter`

### **الخطوة 30: جعل السكريبت قابل للتنفيذ**

```bash
# Make script executable
chmod +x /var/www/rezgee/update-project.sh

# Test script
/var/www/rezgee/update-project.sh
```

---

## **المرحلة العاشرة: الصيانة والمراقبة** 🔧

### **الخطوة 31: إنشاء سكريبت النسخ الاحتياطي**

```bash
# Create backup script
nano /root/backup-rezgee.sh
```

**Enter the following content:**

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

**Save file:** Press `Ctrl + X` then `Y` then `Enter`

```bash
# Make script executable
chmod +x /root/backup-rezgee.sh

# Add cron job for daily backup
crontab -e
```

**Add the following line:**
```
0 2 * * * /root/backup-rezgee.sh
```

### **الخطوة 32: إنشاء سكريبت مراقبة النظام**

```bash
# Create monitoring script
nano /root/monitor-system.sh
```

**Enter the following content:**

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

**Save file:** Press `Ctrl + X` then `Y` then `Enter`

```bash
# Make script executable
chmod +x /root/monitor-system.sh
```

---

## **تحديث المشروع عبر Git** 🔄

### **طريقة التحديث اليدوي:**

```bash
# Navigate to project directory
cd /var/www/rezgee

# Pull updates from Git
git pull origin main

# Install new dependencies
npm ci --only=production

# Build project
npm run build

# Restart application
pm2 restart rezgee-app
```

### **طريقة التحديث التلقائي:**

```bash
# Use update script
/var/www/rezgee/update-project.sh
```

---

## **حل المشاكل الشائعة** 🆘

### **المشكلة 1: الموقع لا يظهر**

```bash
# Check Nginx
systemctl status nginx
nginx -t

# Check PM2
pm2 status
pm2 logs rezgee-app

# Check firewall
ufw status

# Restart services
pm2 restart all
systemctl restart nginx
```

### **المشكلة 2: خطأ SSL**

```bash
# Restart Certbot
certbot renew --dry-run
systemctl reload nginx

# Check certificate
openssl x509 -in /etc/letsencrypt/live/rezgee.com/cert.pem -text -noout

# Re-obtain certificate
certbot --nginx -d rezgee.com -d www.rezgee.com --force-renewal
```

### **المشكلة 3: خطأ في التطبيق**

```bash
# Check PM2 logs
pm2 logs rezgee-app

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Restart application
pm2 restart rezgee-app
```

### **المشكلة 4: خطأ في البريد الإلكتروني**

```bash
# Check SMTP settings
telnet smtp.hostinger.com 465

# Check logs
pm2 logs rezgee-smtp

# Test email sending
curl -X POST https://rezgee.com/api/test-email
```

### **المشكلة 5: خطأ في Git Pull**

```bash
# Check Git remote
git remote -v

# Check Git status
git status

# If private repository, setup authentication
git remote set-url origin https://username:token@github.com/kareemxamged/rezgee.git
```

---

## **أوامر مفيدة للصيانة** 🛠️

### **فحص حالة النظام:**
```bash
# Service status
systemctl status nginx postgresql

# PM2 status
pm2 status
pm2 logs rezgee-app

# Resource usage
htop
df -h
free -h
```

### **إعادة تشغيل الخدمات:**
```bash
# Restart Nginx
systemctl restart nginx

# Restart PM2
pm2 restart all

# Restart everything
pm2 restart all && systemctl restart nginx
```

### **فحص السجلات:**
```bash
# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# PM2 logs
pm2 logs rezgee-app
tail -f /var/log/pm2/rezgee-error.log
```

---

## **قائمة التحقق النهائية** ✅

### **قبل النشر:**
- [ ] VPS purchased and configured
- [ ] Domain configured and pointed to VPS
- [ ] Project files ready and built
- [ ] Environment settings updated
- [ ] Supabase settings correct
- [ ] SMTP settings correct

### **بعد النشر:**
- [ ] Site works on HTTP
- [ ] SSL works on HTTPS
- [ ] PM2 manages application
- [ ] Database works (Supabase)
- [ ] Email works
- [ ] All features work correctly
- [ ] Backup configured
- [ ] Monitoring configured

---

## **الملفات المهمة** 📁

- **Nginx config**: `/etc/nginx/sites-available/rezgee.com`
- **PM2 config**: `/var/www/rezgee/ecosystem.config.cjs`
- **Environment**: `/var/www/rezgee/.env.production`
- **Logs**: `/var/log/nginx/` and `/var/log/pm2/`
- **Backups**: `/root/backups/`
- **Project**: `/var/www/rezgee/`
- **Update Script**: `/var/www/rezgee/update-project.sh`

---

## **الخطوات التالية** 🚀

1. ✅ **Test all features**
2. ✅ **Setup backup**
3. ✅ **Monitor performance**
4. ✅ **Update content**
5. ✅ **Setup advanced monitoring**
6. ✅ **Optimize performance**

---

<div align="center">

## 🎉 **Congratulations!**

**Rezge project deployed successfully! 🚀**

The site is now available at: **https://rezgee.com**

---

**Last Updated:** January 2025  
**Project:** Rezge Islamic Marriage Platform  
**Server:** Hostinger VPS - 148.230.112.17  
**User:** root only

</div>

