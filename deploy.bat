@echo off
REM Rezge Islamic Marriage Platform - Windows Deployment Script
REM سكريبت نشر منصة رزقي للزواج الإسلامي - ويندوز

echo 🚀 بدء عملية نشر منصة رزقي...

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
    if exist "env.production.example" (
        echo 📋 نسخ ملف البيئة من المثال...
        copy env.production.example .env.production
        echo ⚠️ يرجى تحديث ملف .env.production بالإعدادات الصحيحة
    ) else (
        echo ❌ ملف env.production.example غير موجود
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

set "DEPLOY_DIR=rezge-deploy-%timestamp%"
mkdir "%DEPLOY_DIR%"

REM Copy necessary files
xcopy /E /I /Y dist "%DEPLOY_DIR%\dist\"
copy package.json "%DEPLOY_DIR%\"
if exist package-lock.json copy package-lock.json "%DEPLOY_DIR%\"
if exist .env.production copy .env.production "%DEPLOY_DIR%\"

REM Create PM2 ecosystem file
echo module.exports = { > "%DEPLOY_DIR%\ecosystem.config.js"
echo   apps: [{ >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     name: 'rezge-app', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     script: 'npm', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     args: 'run preview', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     cwd: process.cwd(), >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     instances: 1, >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     autorestart: true, >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     watch: false, >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     max_memory_restart: '1G', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     env: { >> "%DEPLOY_DIR%\ecosystem.config.js"
echo       NODE_ENV: 'production', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo       PORT: 3000 >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     }, >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     error_file: './logs/err.log', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     out_file: './logs/out.log', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     log_file: './logs/combined.log', >> "%DEPLOY_DIR%\ecosystem.config.js"
echo     time: true >> "%DEPLOY_DIR%\ecosystem.config.js"
echo   }] >> "%DEPLOY_DIR%\ecosystem.config.js"
echo }; >> "%DEPLOY_DIR%\ecosystem.config.js"

REM Create logs directory
mkdir "%DEPLOY_DIR%\logs"

REM Create deployment info file
echo Rezge Islamic Marriage Platform - Deployment Information > "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo ======================================================= >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo. >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo Deployment Date: %date% %time% >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo Node.js Version: >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
node --version >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo NPM Version: >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
npm --version >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo Build Directory: %DEPLOY_DIR% >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo. >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo Files included: >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo - dist/ (built application) >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo - package.json >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo - ecosystem.config.js (PM2 configuration) >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo - .env.production (environment variables) >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo. >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo Next steps: >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 1. Upload this directory to your VPS >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 2. Install dependencies: npm ci --only=production >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 3. Start with PM2: pm2 start ecosystem.config.js >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 4. Configure Nginx to serve the application >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 5. Set up SSL certificate >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
echo 6. Configure domain DNS >> "%DEPLOY_DIR%\DEPLOYMENT_INFO.txt"
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
echo 1. ارفع الملف %DEPLOY_DIR%.zip إلى VPS
echo 2. استخرج الملف: unzip %DEPLOY_DIR%.zip
echo 3. اتبع دليل النشر: HOSTINGER_VPS_DEPLOYMENT_GUIDE.md
echo.
echo ✅ جاهز للنشر! 🚀
echo.
pause
