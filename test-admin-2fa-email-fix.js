// اختبار إصلاح اسم المرسل في إيميل رمز التحقق الإداري
// Test fix for sender name in admin 2FA email

import {
    UnifiedEmailService
} from './src/lib/unifiedEmailService.ts';

console.log('🧪 اختبار إصلاح اسم المرسل في إيميل رمز التحقق الإداري...');
console.log('================================================');

const testAdmin2FAEmail = async () => {
    try {
        console.log('📧 إرسال إيميل رمز التحقق الإداري...');

        const result = await UnifiedEmailService.sendAdmin2FACodeEmail(
            'kemooamegoo@gmail.com', // إلى
            '123456', // كود التحقق
            'admin', // اسم المشرف
            10, // صلاحية 10 دقائق
            'ar' // اللغة العربية
        );

        if (result.success) {
            console.log('✅ تم إرسال الإيميل بنجاح!');
            console.log('📧 معرف الرسالة:', result.messageId);
            console.log('🔧 الطريقة المستخدمة:', result.method);

            console.log('\n📋 تفاصيل الإيميل:');
            console.log('  📬 إلى: kemooamegoo@gmail.com');
            console.log('  👤 من: رزقي | منصة الزواج الإسلامي الشرعي <manage@kareemamged.com>');
            console.log('  📝 الموضوع: رمز التحقق الإداري - رزقي');
            console.log('  🌐 اللغة: العربية');
            console.log('  ⏰ الصلاحية: 10 دقائق');

            console.log('\n🎯 النتيجة المتوقعة:');
            console.log('✅ يجب أن يظهر اسم المرسل كـ "رزقي | منصة الزواج الإسلامي الشرعي"');
            console.log('✅ يجب أن يظهر الإيميل من "manage@kareemamged.com"');
            console.log('✅ يجب ألا يظهر "رزقي>" أو أي تنسيق خاطئ');

        } else {
            console.error('❌ فشل إرسال الإيميل:', result.error);
        }

    } catch (error) {
        console.error('❌ خطأ غير متوقع:', error);
    }
};

const testEnglishVersion = async () => {
    try {
        console.log('\n📧 اختبار النسخة الإنجليزية...');

        const result = await UnifiedEmailService.sendAdmin2FACodeEmail(
            'kemooamegoo@gmail.com', // إلى
            '654321', // كود التحقق
            'admin', // اسم المشرف
            10, // صلاحية 10 دقائق
            'en' // اللغة الإنجليزية
        );

        if (result.success) {
            console.log('✅ تم إرسال الإيميل الإنجليزي بنجاح!');
            console.log('📧 معرف الرسالة:', result.messageId);

            console.log('\n📋 تفاصيل الإيميل الإنجليزي:');
            console.log('  📬 إلى: kemooamegoo@gmail.com');
            console.log('  👤 من: Rezge | Islamic Marriage Platform <manage@kareemamged.com>');
            console.log('  📝 الموضوع: Admin Verification Code - Rezge');
            console.log('  🌐 اللغة: الإنجليزية');
            console.log('  ⏰ الصلاحية: 10 دقائق');

        } else {
            console.error('❌ فشل إرسال الإيميل الإنجليزي:', result.error);
        }

    } catch (error) {
        console.error('❌ خطأ في النسخة الإنجليزية:', error);
    }
};

// تشغيل الاختبارات
const runTests = async () => {
    console.log('🚀 بدء اختبارات إصلاح اسم المرسل...\n');

    await testAdmin2FAEmail();
    await testEnglishVersion();

    console.log('\n🎉 انتهت الاختبارات!');
    console.log('📧 تحقق من Gmail لرؤية النتائج');
    console.log('🔍 تأكد من أن اسم المرسل يظهر بشكل صحيح');
};

runTests();