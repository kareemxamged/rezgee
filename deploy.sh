#!/bin/bash

# Rezge Islamic Marriage Platform - Deployment Script
# سكريبت نشر منصة رزقي للزواج الإسلامي

set -e  # Exit on any error

echo "🚀 بدء عملية نشر منصة رزقي..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "التحقق من متطلبات النظام..."

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_warning "Node.js version $NODE_VERSION is detected. Version 18+ is recommended."
fi

print_success "متطلبات النظام جاهزة"

# Install dependencies
print_status "تثبيت التبعيات..."
npm ci --only=production

# Copy environment file if it doesn't exist
if [ ! -f ".env.production" ]; then
    if [ -f "env.production.example" ]; then
        print_status "نسخ ملف البيئة من المثال..."
        cp env.production.example .env.production
        print_warning "يرجى تحديث ملف .env.production بالإعدادات الصحيحة"
    else
        print_error "ملف env.production.example غير موجود"
        exit 1
    fi
fi

# Build the project
print_status "بناء المشروع للإنتاج..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "فشل في بناء المشروع. مجلد dist غير موجود."
    exit 1
fi

print_success "تم بناء المشروع بنجاح"

# Create deployment package
print_status "إنشاء حزمة النشر..."
DEPLOY_DIR="rezge-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy necessary files
cp -r dist/* "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp package-lock.json "$DEPLOY_DIR/" 2>/dev/null || true
cp .env.production "$DEPLOY_DIR/" 2>/dev/null || true

# Create PM2 ecosystem file
cat > "$DEPLOY_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [{
    name: 'rezge-app',
    script: 'npm',
    args: 'run preview',
    cwd: process.cwd(),
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p "$DEPLOY_DIR/logs"

# Create deployment info file
cat > "$DEPLOY_DIR/DEPLOYMENT_INFO.txt" << EOF
Rezge Islamic Marriage Platform - Deployment Information
=======================================================

Deployment Date: $(date)
Node.js Version: $(node --version)
NPM Version: $(npm --version)
Build Directory: $DEPLOY_DIR

Files included:
- dist/ (built application)
- package.json
- ecosystem.config.js (PM2 configuration)
- .env.production (environment variables)

Next steps:
1. Upload this directory to your VPS
2. Install dependencies: npm ci --only=production
3. Start with PM2: pm2 start ecosystem.config.js
4. Configure Nginx to serve the application
5. Set up SSL certificate
6. Configure domain DNS

For detailed instructions, see HOSTINGER_VPS_DEPLOYMENT_GUIDE.md
EOF

# Create archive
print_status "إنشاء أرشيف النشر..."
tar -czf "${DEPLOY_DIR}.tar.gz" "$DEPLOY_DIR"

print_success "تم إنشاء حزمة النشر: ${DEPLOY_DIR}.tar.gz"

# Display deployment summary
echo ""
echo "=========================================="
print_success "تم إكمال إعداد النشر بنجاح!"
echo "=========================================="
echo ""
echo "📦 حزمة النشر: ${DEPLOY_DIR}.tar.gz"
echo "📁 مجلد النشر: $DEPLOY_DIR"
echo "📋 معلومات النشر: $DEPLOY_DIR/DEPLOYMENT_INFO.txt"
echo ""
echo "الخطوات التالية:"
echo "1. ارفع الملف ${DEPLOY_DIR}.tar.gz إلى VPS"
echo "2. استخرج الملف: tar -xzf ${DEPLOY_DIR}.tar.gz"
echo "3. اتبع دليل النشر: HOSTINGER_VPS_DEPLOYMENT_GUIDE.md"
echo ""
print_success "جاهز للنشر! 🚀"
