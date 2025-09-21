@echo off
title رزقي - موقع الزواج الإسلامي
color 0A

echo.
echo     ██████╗ ███████╗███████╗ ██████╗ ███████╗
echo     ██╔══██╗██╔════╝╚══███╔╝██╔════╝ ██╔════╝
echo     ██████╔╝█████╗    ███╔╝ ██║  ███╗█████╗  
echo     ██╔══██╗██╔══╝   ███╔╝  ██║   ██║██╔══╝  
echo     ██║  ██║███████╗███████╗╚██████╔╝███████╗
echo     ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝
echo.
echo     🌟 موقع الزواج الإسلامي - رزقي 🌟
echo     ================================
echo.

REM التحقق من وجود Node.js
echo [1/4] 🔍 التحقق من Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت!
    echo 📥 يرجى تثبيت Node.js من: https://nodejs.org
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js متوفر

REM تثبيت المكتبات
echo [2/4] 📦 تثبيت المكتبات...
if not exist "node_modules" (
    echo 🔄 تثبيت مكتبات المشروع...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ فشل في تثبيت المكتبات
        pause
        exit /b 1
    )
) else (
    echo ✅ المكتبات متوفرة
)

REM تثبيت مكتبات SMTP
echo [3/4] 📧 تحضير خادم SMTP...
npm list nodemailer >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔄 تثبيت مكتبات SMTP...
    npm install nodemailer cors concurrently
    if %errorlevel% neq 0 (
        echo ❌ فشل في تثبيت مكتبات SMTP
        pause
        exit /b 1
    )
)
echo ✅ خادم SMTP جاهز

REM تنظيف العمليات السابقة
echo [4/4] 🧹 تنظيف العمليات السابقة...
for /f "tokens=5" %%a in ('netstat -ano ^| find "5173" ^| find "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| find "3001" ^| find "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 >nul
echo ✅ تم التنظيف

echo.
echo ================================================
echo 🚀 بدء تشغيل مشروع رزقي
echo ================================================
echo 📱 التطبيق الرئيسي: http://localhost:5173
echo 📧 خادم SMTP: http://localhost:3001
echo 🧪 صفحة الاختبار: test-independent-smtp.html
echo ================================================
echo.
echo 💡 نصائح:
echo    • استخدم صفحة "نسيت الباسوورد" لاختبار الإرسال
echo    • راقب الكونسول لرؤية تفاصيل الإرسال
echo    • لإيقاف الخوادم: اضغط Ctrl+C
echo.
echo 🎯 جاري التشغيل...

REM تشغيل المشروع
npm run dev

echo.
echo 🛑 تم إيقاف الخوادم
pause
