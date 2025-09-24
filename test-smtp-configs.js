#!/usr/bin/env node

/**
 * اختبار شامل لإعدادات SMTP
 * Comprehensive SMTP Testing Script
 */

const nodemailer = require('nodemailer');

// إعدادات SMTP للاختبار
const smtpConfigs = [
    {
        name: 'Hostinger SMTP (Current)',
        config: {
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: 'noreply@rezgee.com',
                pass: 'R3zG89&Secure'
            }
        }
    },
    {
        name: 'Hostinger SMTP (Alternative)',
        config: {
            host: 'smtp.hostinger.com',
            port: 587,
            secure: false,
            auth: {
                user: 'noreply@rezgee.com',
                pass: 'R3zG89&Secure'
            }
        }
    },
    {
        name: 'Hostinger SMTP (Old Settings)',
        config: {
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: 'manage@kareemamged.com',
                pass: 'Kk170404#'
            }
        }
    }
];

async function testSMTPConnection(config) {
    console.log(`\n🔍 اختبار ${config.name}...`);
    console.log(`📧 Host: ${config.config.host}`);
    console.log(`🔌 Port: ${config.config.port}`);
    console.log(`🔐 Secure: ${config.config.secure}`);
    console.log(`👤 User: ${config.config.auth.user}`);
    console.log(`🔑 Pass: ${config.config.auth.pass.substring(0, 3)}***`);
    
    try {
        const transporter = nodemailer.createTransporter(config.config);
        
        // اختبار الاتصال
        console.log('🔄 اختبار الاتصال...');
        await transporter.verify();
        console.log('✅ تم التحقق من الاتصال بنجاح!');
        
        // اختبار إرسال بريد
        console.log('📤 اختبار إرسال بريد...');
        const testEmail = {
            from: `"رزقي - منصة الزواج الإسلامي" <${config.config.auth.user}>`,
            to: 'kareemxamged@gmail.com',
            subject: `اختبار SMTP - ${config.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; direction: rtl; text-align: center; padding: 20px;">
                    <h2>🧪 اختبار إعدادات SMTP</h2>
                    <p><strong>الإعدادات:</strong> ${config.name}</p>
                    <p><strong>الخادم:</strong> ${config.config.host}:${config.config.port}</p>
                    <p><strong>المستخدم:</strong> ${config.config.auth.user}</p>
                    <p><strong>الوقت:</strong> ${new Date().toLocaleString('ar-SA')}</p>
                    <hr>
                    <p style="font-size: 12px; color: #666;">
                        إذا وصلتك هذه الرسالة، فإن إعدادات SMTP تعمل بشكل صحيح! ✅
                    </p>
                </div>
            `,
            text: `اختبار إعدادات SMTP\n\nالإعدادات: ${config.name}\nالخادم: ${config.config.host}:${config.config.port}\nالمستخدم: ${config.config.auth.user}\nالوقت: ${new Date().toLocaleString('ar-SA')}\n\nإذا وصلتك هذه الرسالة، فإن إعدادات SMTP تعمل بشكل صحيح!`
        };
        
        const result = await transporter.sendMail(testEmail);
        console.log('✅ تم إرسال البريد بنجاح!');
        console.log(`📧 Message ID: ${result.messageId}`);
        console.log(`📡 Response: ${result.response}`);
        
        return {
            success: true,
            messageId: result.messageId,
            response: result.response
        };
        
    } catch (error) {
        console.error('❌ فشل الاختبار:', error.message);
        console.error('🔍 تفاصيل الخطأ:', {
            code: error.code,
            response: error.response,
            responseCode: error.responseCode,
            command: error.command
        });
        
        return {
            success: false,
            error: error.message,
            details: {
                code: error.code,
                response: error.response,
                responseCode: error.responseCode,
                command: error.command
            }
        };
    }
}

async function runAllTests() {
    console.log('🚀 بدء اختبار شامل لإعدادات SMTP...');
    console.log('='.repeat(60));
    
    const results = [];
    
    for (const config of smtpConfigs) {
        const result = await testSMTPConnection(config);
        results.push({
            name: config.name,
            ...result
        });
        
        // انتظار قصير بين الاختبارات
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 ملخص النتائج:');
    console.log('='.repeat(60));
    
    results.forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.name}:`);
        if (result.success) {
            console.log('   ✅ نجح الاختبار');
            console.log(`   📧 Message ID: ${result.messageId}`);
        } else {
            console.log('   ❌ فشل الاختبار');
            console.log(`   🔍 الخطأ: ${result.error}`);
            if (result.details) {
                console.log(`   📋 الكود: ${result.details.code}`);
                console.log(`   📡 الاستجابة: ${result.details.response}`);
            }
        }
    });
    
    const successfulConfigs = results.filter(r => r.success);
    const failedConfigs = results.filter(r => !r.success);
    
    console.log('\n' + '='.repeat(60));
    console.log('📈 إحصائيات:');
    console.log(`✅ نجح: ${successfulConfigs.length}`);
    console.log(`❌ فشل: ${failedConfigs.length}`);
    console.log(`📊 المجموع: ${results.length}`);
    
    if (successfulConfigs.length > 0) {
        console.log('\n🎉 الإعدادات التي تعمل:');
        successfulConfigs.forEach(config => {
            console.log(`   ✅ ${config.name}`);
        });
    }
    
    if (failedConfigs.length > 0) {
        console.log('\n⚠️ الإعدادات التي تحتاج إصلاح:');
        failedConfigs.forEach(config => {
            console.log(`   ❌ ${config.name}: ${config.error}`);
        });
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🏁 انتهى الاختبار الشامل');
}

// تشغيل الاختبارات
runAllTests().catch(console.error);
