@echo off
REM Rezge Islamic Marriage Platform - Hostinger VPS Windows Deployment Script
REM سكريبت نشر منصة رزقي للزواج الإسلامي - VPS Hostinger - ويندوز

echo 🚀 بدء عملية نشر منصة رزقي على VPS Hostinger...
echo 📍 الخادم: 148.230.112.17
echo 🌐 النطاق: rezgee.com

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm غير مثبت. يرجى تثبيت npm أولاً.
    pause
    exit /b 1
)

echo ✅ متطلبات النظام جاهزة

REM Install dependencies
echo 📦 تثبيت التبعيات...
call npm ci --only=production
if %errorlevel% neq 0 (
    echo ❌ فشل في تثبيت التبعيات
    pause
    exit /b 1
)

REM Copy environment file if it doesn't exist
if not exist ".env.production" (
    if exist "env.production.hostinger" (
        echo 📋 نسخ ملف البيئة من المثال...
        copy env.production.hostinger .env.production
        echo ⚠️ يرجى تحديث ملف .env.production بالإعدادات الصحيحة
    ) else (
        echo ❌ ملف env.production.hostinger غير موجود
        pause
        exit /b 1
    )
)

REM Build the project
echo 🔨 بناء المشروع للإنتاج...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ فشل في بناء المشروع
    pause
    exit /b 1
)

REM Check if build was successful
if not exist "dist" (
    echo ❌ فشل في بناء المشروع. مجلد dist غير موجود.
    pause
    exit /b 1
)

echo ✅ تم بناء المشروع بنجاح

REM Create deployment package
echo 📦 إنشاء حزمة النشر...
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%%MM%%DD%-%HH%%Min%%Sec%"

set "DEPLOY_DIR=rezge-hostinger-deploy-%timestamp%"
mkdir "%DEPLOY_DIR%"

REM Copy necessary files
xcopy /E /I /Y dist "%DEPLOY_DIR%\dist\"
copy package.json "%DEPLOY_DIR%\"
if exist package-lock.json copy package-lock.json "%DEPLOY_DIR%\"
if exist .env.production copy .env.production "%DEPLOY_DIR%\"

REM Copy production configuration files
if exist ecosystem-production.config.js copy ecosystem-production.config.js "%DEPLOY_DIR%\ecosystem.config.js"
if exist nginx-rezgee.conf copy nginx-rezgee.conf "%DEPLOY_DIR%\nginx.conf"

REM Create PM2 ecosystem file
echo module.exports = { > "%DEPLOY_DIR%\ecosystem.config.js"
echo   apps: [{ >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     name: 'rezge-app', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     script: 'npm', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     args: 'run preview', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     cwd: '/var/www/rezge', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     instances: 1, >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     autorestart: true, >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     watch: false, >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     max_memory_restart: '1G', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     env: { >> "%DEPLOY_DIR%\ecosystem.config.js"
echo       NODE_ENV: 'production', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo       PORT: 3000, >> "%DEPLOY_DIR%\ecosystem.config.js"
echo       HOST: '0.0.0.0' >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     }, >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     error_file: '/var/log/pm2/rezge-error.log', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     out_file: '/var/log/pm2/rezge-out.log', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     log_file: '/var/log/pm2/rezge-combined.log', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     time: true >> "%DEPLOY_DIR%\ecosystem.config.js"
echo   }] >> "%DEPLOY_DIR%\ecosystem.config.js"
echo }; >> "%DEPLOY_DIR%\ecosystem.config.js"

REM Create logs directory
mkdir "%DEPLOY_DIR%\logs"

REM Create deployment info file
echo Rezge Islamic Marriage Platform - Hostinger VPS Deployment Information > "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo ==================================================================== >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo. >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo Deployment Date: %date% %time% >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo Node.js Version: >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
node --version >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo NPM Version: >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
npm --version >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo Build Directory: %DEPLOY_DIR% >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo Server IP: 148.230.112.17 >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo Domain: rezgee.com >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo. >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo Files included: >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo - dist/ (built application) >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo - package.json >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo - ecosystem.config.js (PM2 configuration) >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo - nginx.conf (Nginx configuration) >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo - .env.production (environment variables) >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo. >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo Next steps: >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 1. Upload this directory to your VPS: scp -r %DEPLOY_DIR% root@148.230.112.17:/tmp/ >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 2. SSH to VPS: ssh root@148.230.112.17 >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 3. Move files: mv /tmp/%DEPLOY_DIR%/* /var/www/rezge/ >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 4. Install dependencies: cd /var/www/rezge ^&^& npm ci --only=production >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 5. Configure Nginx: cp nginx.conf /etc/nginx/sites-available/rezgee.com >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 6. Enable site: ln -s /etc/nginx/sites-available/rezgee.com /etc/nginx/sites-enabled/ >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 7. Test Nginx: nginx -t >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 8. Reload Nginx: systemctl reload nginx >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 9. Start PM2: pm2 start ecosystem.config.js >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 10. Setup SSL: certbot --nginx -d rezgee.com -d www.rezgee.com >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo. >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo For detailed instructions, see HOSTINGER_VPS_DEPLOYMENT_GUIDE.md >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"

REM Create archive
echo 📦 إنشاء أرشيف النشر...
powershell Compress-Archive -Path "%DEPLOY_DIR%" -DestinationPath "%DEPLOY_DIR%.zip"

echo.
echo ==========================================
echo ✅ تم إكمال إعداد النشر بنجاح!
echo ==========================================
echo.
echo 📦 حزمة النشر: %DEPLOY_DIR%.zip
echo 📁 مجلد النشر: %DEPLOY_DIR%
echo 📋 معلومات النشر: %DEPLOY_DIR%\DEPLOYMENT_INFO.txt
echo.
echo الخطوات التالية:
echo 1. ارفع الملف %DEPLOY_DIR%.zip إلى VPS:
echo    scp %DEPLOY_DIR%.zip root@148.230.112.17:/tmp/
echo.
echo 2. اتصل بالخادم:
echo    ssh root@148.230.112.17
echo.
echo 3. استخرج الملفات:
echo    cd /var/www/rezge
echo    unzip /tmp/%DEPLOY_DIR%.zip
echo    mv %DEPLOY_DIR%/* .
echo.
echo 4. اتبع التعليمات في DEPLOYMENT_INFO.txt
echo.
echo ✅ جاهز للنشر على Hostinger VPS! 🚀
echo.
pause

