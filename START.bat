@echo off
title رزقي - تشغيل المشروع
color 0B

echo.
echo ================================================
echo 🌟 مشروع رزقي - موقع الزواج الإسلامي 🌟
echo ================================================
echo.

REM التحقق من Node.js
echo [1/3] 🔍 التحقق من Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت!
    echo 📥 تحميل من: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js متوفر

REM تثبيت المكتبات إذا لم تكن موجودة
echo [2/3] 📦 التحقق من المكتبات...
if not exist "node_modules" (
    echo 🔄 تثبيت المكتبات...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ فشل في تثبيت المكتبات
        pause
        exit /b 1
    )
)
echo ✅ المكتبات جاهزة

REM تنظيف البورتات
echo [3/3] 🧹 تنظيف البورتات...
for /f "tokens=5" %%a in ('netstat -ano ^| find "5173" ^| find "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| find "3001" ^| find "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo ✅ البورتات نظيفة

echo.
echo ================================================
echo 🚀 بدء تشغيل المشروع
echo ================================================
echo 📱 التطبيق: http://localhost:5173
echo 📧 خادم SMTP: http://localhost:3001
echo 🧪 اختبار SMTP: test-independent-smtp.html
echo ================================================
echo.
echo 💡 نصائح:
echo    • استخدم "نسيت الباسوورد" لاختبار الإرسال
echo    • راقب هذه النافذة لرؤية رسائل SMTP
echo    • لإيقاف المشروع: اضغط Ctrl+C
echo.

REM تشغيل المشروع مع خادم SMTP
npm run dev

echo.
echo 🛑 تم إيقاف المشروع
pause
