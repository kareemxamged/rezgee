# ⚡ التوتوريال السريع النهائي - رزقي على VPS Hostinger
## Final Quick Tutorial - Rezge on Hostinger VPS

<div align="center">

[![Quick Deploy](https://img.shields.io/badge/Quick-Deploy-green?style=for-the-badge)](https://github.com)
[![Git](https://img.shields.io/badge/Git-Clone-blue?style=for-the-badge)](https://git-scm.com)
[![Root](https://img.shields.io/badge/Root-Only-red?style=for-the-badge)](https://github.com)
[![Time](https://img.shields.io/badge/Time-30_Minutes-orange?style=for-the-badge)](https://github.com)

**التوتوريال السريع النهائي لرفع مشروع رزقي على VPS Hostinger مع جميع الحلول**

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

## 🚀 **النشر في 10 خطوات**

### **1️⃣ إعداد VPS (10 دقائق)**

```bash
# Connect to server
ssh root@148.230.112.17

# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release htop nano vim ufw fail2ban

# Remove old Node.js if exists
apt remove -y nodejs npm

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install Nginx
apt install -y nginx
systemctl enable nginx
systemctl start nginx

# Install PM2
npm install -g pm2

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx

# Setup firewall
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3000
ufw allow 3001
ufw allow 4173
```

### **2️⃣ إنشاء مجلدات المشروع (2 دقيقة)**

```bash
# Create project directories
mkdir -p /var/www/rezgee
mkdir -p /var/log/pm2
```

### **3️⃣ استنساخ المشروع من Git (5 دقائق)**

```bash
# Navigate to project directory
cd /var/www/rezgee

# Clone project from Git
git clone https://github.com/kareemxamged/rezgee.git .

# Install dependencies
npm ci --only=production

# Build project
npm run build
```

### **4️⃣ إنشاء ملفات التكوين (5 دقائق)**

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

```bash
# Create environment file
nano .env.production
```

**Enter the following content:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://sbtzngewizgeqzfbhfjy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidHpuZ2V3aXpnZXF6ZmJoZmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzc5MTMsImV4cCI6MjA2NjcxMzkxM30.T8iv9C4OeKAb-e4Oz6uw3tFnMrgFK3SKN6fVCrBEUGo

# SMTP Email Configuration
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

```bash
# Enable site
ln -sf /etc/nginx/sites-available/rezgee.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

### **6️⃣ بدء التطبيق (3 دقائق)**

```bash
# Setup PM2 for auto-start
pm2 startup systemd

# Start application
pm2 start ecosystem.config.cjs

# Save PM2 settings
pm2 save

# Check application status
pm2 status
```

### **7️⃣ إعداد SSL (5 دقائق)**

```bash
# Get SSL certificate
certbot --nginx -d rezgee.com -d www.rezgee.com

# Test automatic renewal
certbot renew --dry-run

# Setup automatic renewal
crontab -e
# Add the following line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### **8️⃣ إعداد DNS (2 دقيقة)**

**In your domain control panel, add the following records:**

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

**Wait 5-30 minutes for DNS propagation**

### **9️⃣ إنشاء سكريبت التحديث التلقائي (3 دقائق)**

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

```bash
# Make script executable
chmod +x /var/www/rezgee/update-project.sh

# Test script
/var/www/rezgee/update-project.sh
```

### **🔟 التحقق من النشر (2 دقيقة)**

```bash
# Check services
systemctl status nginx
pm2 status

# Check ports
netstat -tlnp | grep :443
netstat -tlnp | grep :80
netstat -tlnp | grep :4173
netstat -tlnp | grep :3001

# Test site
curl -I https://rezgee.com
```

---

## ✅ **التحقق من النشر**

### **فحص الخدمات:**
```bash
# Check Nginx
systemctl status nginx

# Check PM2
pm2 status

# Check SSL
curl -I https://rezgee.com
```

### **اختبار الموقع:**
- Go to: `https://rezgee.com`
- Check for security lock 🔒
- Test all features

---

## 🔄 **تحديث المشروع عبر Git**

### **طريقة التحديث اليدوي:**
```bash
cd /var/www/rezgee
git pull origin main
npm ci --only=production
npm run build
pm2 restart rezgee-app
```

### **طريقة التحديث التلقائي:**
```bash
/var/www/rezgee/update-project.sh
```

---

## 🆘 **حل المشاكل السريع**

### **المشكلة: الموقع لا يظهر**
```bash
pm2 restart all
systemctl restart nginx
```

### **المشكلة: خطأ SSL**
```bash
certbot renew --dry-run
systemctl reload nginx
```

### **المشكلة: خطأ في التطبيق**
```bash
pm2 logs rezgee-app
tail -f /var/log/nginx/error.log
```

### **المشكلة: خطأ في Git Pull**
```bash
git remote -v
git status
```

---

## 📋 **قائمة التحقق السريعة**

- [ ] VPS configured and ready
- [ ] Project cloned from Git
- [ ] Dependencies installed and project built
- [ ] Environment configured
- [ ] Nginx working
- [ ] PM2 managing application
- [ ] SSL working
- [ ] DNS pointed
- [ ] Site working
- [ ] Update script created

---

## 🎉 **Congratulations!**

**Rezge project deployed successfully! 🚀**

The site is available at: **https://rezgee.com**

---

**For detailed guide:** [FINAL_COMPLETE_TUTORIAL.md](FINAL_COMPLETE_TUTORIAL.md)

**Last Updated:** January 2025

