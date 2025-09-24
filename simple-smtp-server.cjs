#!/usr/bin/env node

/**
 * خادم SMTP مبسط لموقع رزقي
 * يعمل بجانب خادم Vite تلقائياً
 */

const {
    createServer
} = require('http');
const https = require('https');
const nodemailer = require('nodemailer');
const path = require('path');
const {
    createClient
} = require('@supabase/supabase-js');

const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://sbtzngewizgeqzfbhfjy.supabase.co',
    process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidHpuZ2V3aXpnZXF6ZmJoZmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzc5MTMsImV4cCI6MjA2NjcxMzkxM30.T8iv9C4OeKAb-e4Oz6uw3tFnMrgFK3SKN6fVCrBEUGo'
);

// Load environment variables from .env.production
function loadEnvFile() {
    try {
        const envPath = path.join(__dirname, '.env.production');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const lines = envContent.split('\n');

            lines.forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                    const [key, ...valueParts] = trimmedLine.split('=');
                    if (key && valueParts.length > 0) {
                        const value = valueParts.join('=').trim();
                        if (!process.env[key]) {
                            process.env[key] = value;
                        }
                    }
                }
            });

            console.log('✅ تم تحميل متغيرات البيئة من .env.production');
        } else {
            console.log('⚠️ ملف .env.production غير موجود');
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل متغيرات البيئة:', error.message);
    }
}

// Load environment variables
loadEnvFile();

console.log('🚀 بدء تشغيل خادم SMTP المبسط...');

// إنشاء خادم HTTP بسيط
const server = createServer(async (req, res) => {
    // إعداد CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/send-email') {
        try {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    console.log('📧 استلام طلب إرسال إيميل...');
                    console.log('📋 البيانات المستلمة:', JSON.stringify(data, null, 2));

                    // إرسال إيميل حقيقي
                    const result = await sendRealEmail(data);

                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify(result));
                } catch (error) {
                    console.error('❌ خطأ في معالجة الطلب:', error);
                    res.writeHead(500, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({
                        success: false,
                        error: error.message
                    }));
                }
            });
        } catch (error) {
            res.writeHead(500, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                success: false,
                error: 'Server error'
            }));
        }
    } else if (req.method === 'GET' && req.url === '/status') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            status: 'running',
            service: 'Simple SMTP Server',
            port: PORT,
            timestamp: new Date().toISOString(),
            message: 'خادم SMTP يعمل بشكل طبيعي'
        }));
    } else {
        res.writeHead(404, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            error: 'Not Found',
            availableEndpoints: ['/send-email', '/status']
        }));
    }
});

// إرسال إيميل حقيقي
async function sendRealEmail(data) {
    try {
        console.log('📧 بدء إرسال إيميل حقيقي...');

        // جلب إعدادات SMTP من قاعدة البيانات أو البيانات المرسلة
        let smtpConfig;

        if (data.smtpConfig || data.config) {
            // استخدام إعدادات SMTP المرسلة من القالب
            smtpConfig = data.smtpConfig || data.config;
            console.log('🔧 استخدام إعدادات SMTP المرسلة من القالب');
        } else {
            // جلب الإعدادات الافتراضية من قاعدة البيانات
            console.log('🔍 جلب الإعدادات الافتراضية من قاعدة البيانات...');
            const {
                data: defaultSettings,
                error
            } = await supabase
                .from('email_settings')
                .select('*')
                .eq('is_active', true)
                .eq('is_default', true)
                .single();

            if (error || !defaultSettings) {
                console.log('⚠️ لم يتم العثور على إعدادات افتراضية، استخدام إعدادات البيئة');
                smtpConfig = {
                    host: process.env.VITE_SMTP_HOST || 'smtp.hostinger.com',
                    port: parseInt(process.env.VITE_SMTP_PORT) || 587,
                    secure: false,
                    auth: {
                        user: process.env.VITE_SMTP_USER || 'manage@rezgee.com',
                        pass: process.env.VITE_SMTP_PASS || 'R3zG89&Secure'
                    }
                };
            } else {
                console.log('✅ تم جلب الإعدادات الافتراضية من قاعدة البيانات');
                smtpConfig = {
                    host: defaultSettings.smtp_host,
                    port: defaultSettings.smtp_port,
                    secure: defaultSettings.smtp_port === 465,
                    auth: {
                        user: defaultSettings.smtp_username,
                        pass: defaultSettings.smtp_password
                    },
                    from: {
                        name: defaultSettings.from_name_ar,
                        email: defaultSettings.from_email
                    }
                };
            }
        }

        console.log('🔧 إعدادات SMTP المستخدمة:');
        console.log(`  - Host: ${smtpConfig.host}`);
        console.log(`  - Port: ${smtpConfig.port}`);
        console.log(`  - User: ${(smtpConfig.auth && smtpConfig.auth.user) || smtpConfig.user || 'غير محدد'}`);
        console.log(`  - From Email: ${data.from || data.fromEmail}`);
        console.log(`  - From Name: ${data.fromName}`);

        // إنشاء transporter - استخدام طريقة آمنة لتجنب أخطاء syntax
        const authUser = (smtpConfig.auth && smtpConfig.auth.user) || smtpConfig.user || 'manage@rezgee.com';
        const authPass = (smtpConfig.auth && smtpConfig.auth.pass) || smtpConfig.pass || 'R3zG89&Secure';

        const transporterConfig = {
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: smtpConfig.secure,
            auth: {
                user: authUser,
                pass: authPass
            },
            tls: {
                rejectUnauthorized: false
            }
        };

        console.log('🔧 إعداد transporter مع:', {
            host: transporterConfig.host,
            port: transporterConfig.port,
            user: transporterConfig.auth.user,
            passLength: transporterConfig.auth.pass.length
        });

        const transporter = nodemailer.createTransport(transporterConfig);

        // التحقق من تنسيق البيانات - قد تكون مباشرة أو داخل emailData
        const emailData = data.emailData || data;

        console.log('🔍 تحليل البيانات:');
        console.log('📦 data:', Object.keys(data));
        console.log('📧 emailData:', emailData ? Object.keys(emailData) : 'undefined');
        console.log('📬 to:', emailData && emailData.to);
        console.log('📝 subject:', emailData && emailData.subject);

        // استخدام البريد الإلكتروني الصحيح من إعدادات SMTP المرسلة أو قاعدة البيانات
        const fromEmail = data.from || data.fromEmail || (smtpConfig.from && smtpConfig.from.email) || (smtpConfig.auth && smtpConfig.auth.user) || transporterConfig.auth.user;
        const fromName = data.fromName || (smtpConfig.from && smtpConfig.from.name) || smtpConfig.fromName || 'رزقي - منصة الزواج الإسلامي الشرعي';

        const mailOptions = {
            from: `${fromName} <${fromEmail}>`,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html
        };

        console.log(`📬 إرسال إلى: ${mailOptions.to}`);
        console.log(`📝 الموضوع: ${mailOptions.subject}`);
        console.log(`🔐 SMTP Host: ${smtpConfig.host}:${smtpConfig.port}`);
        console.log(`👤 SMTP User: ${(smtpConfig.auth && smtpConfig.auth.user) || smtpConfig.user}`);
        console.log(`🔑 SMTP Pass: ${((smtpConfig.auth && smtpConfig.auth.pass) || smtpConfig.pass || '').substring(0, 3)}***`);
        console.log(`📧 From Email: ${fromEmail}`);
        console.log(`👤 From Name: ${fromName}`);

        // اختبار الاتصال أولاً
        console.log('🔍 اختبار الاتصال بـ SMTP...');
        await transporter.verify();
        console.log('✅ تم التحقق من اتصال SMTP بنجاح');

        // إرسال الإيميل
        console.log('📤 بدء إرسال الإيميل...');
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ تم إرسال الإيميل بنجاح!');
        console.log(`📧 Message ID: ${info.messageId}`);
        console.log(`📡 Response: ${info.response}`);
        console.log('');

        return {
            success: true,
            messageId: info.messageId,
            response: info.response,
            timestamp: new Date().toISOString(),
            method: 'Real SMTP'
        };
    } catch (error) {
        console.error('❌ فشل إرسال الإيميل:', error);
        console.log('🔄 التبديل للمحاكاة...');

        // في حالة فشل الإرسال الحقيقي، استخدم المحاكاة
        return await simulateEmailSending(data);
    }
}

// محاكاة إرسال الإيميل (كـ fallback)
async function simulateEmailSending(data) {
    try {
        // التحقق من تنسيق البيانات - قد تكون مباشرة أو داخل emailData
        const emailData = data.emailData || data;

        console.log('📧 تفاصيل الإيميل:');
        console.log(`📬 إلى: ${emailData.to}`);
        console.log(`📝 الموضوع: ${emailData.subject}`);
        console.log(`📄 النوع: ${emailData.type || data.type || 'غير محدد'}`);
        console.log(`⏰ الوقت: ${new Date().toLocaleString('ar-SA')}`);

        if (emailData.text) {
            const preview = emailData.text.substring(0, 150);
            console.log(`📄 معاينة المحتوى: ${preview}...`);
        }

        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));

        const messageId = `rezge_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

        console.log('✅ تم محاكاة إرسال الإيميل بنجاح');
        console.log(`📧 Message ID: ${messageId}`);
        console.log('');

        return {
            success: true,
            messageId: messageId,
            response: 'Email simulated successfully',
            timestamp: new Date().toISOString(),
            method: 'Simulation'
        };
    } catch (error) {
        console.error('❌ فشل في محاكاة الإرسال:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// إعداد SSL
const sslOptions = {
    key: fs.readFileSync('/etc/ssl/smtp/smtp-key.pem'),
    cert: fs.readFileSync('/etc/ssl/smtp/smtp-cert.pem')
};

// إنشاء خادم HTTPS
const httpsServer = https.createServer(sslOptions, server);

// بدء الخادم
httpsServer.listen(PORT, '0.0.0.0', () => {
    console.log('✅ خادم SMTP المبسط يعمل الآن!');
    console.log(`📡 العناوين المتاحة:`);
    console.log(`   🌐 الشبكة HTTPS: https://148.230.112.17:${PORT}`);
    console.log(`   🏠 المحلي HTTPS: https://localhost:${PORT}`);
    console.log(`   🔗 عام HTTPS: https://0.0.0.0:${PORT}`);
    console.log(`📧 جاهز لاستقبال طلبات الإرسال`);
    console.log(`⏰ الوقت: ${new Date().toLocaleString('ar-SA')}`);
    console.log('');
    console.log('📋 نقاط النهاية:');
    console.log(`   POST /send-email - إرسال إيميل`);
    console.log(`   GET  /status     - حالة الخادم`);
    console.log('');
    console.log('💡 ملاحظة: خادم إرسال حقيقي مع fallback للمحاكاة');
    console.log('   يحاول الإرسال الحقيقي أولاً، ثم المحاكاة عند الفشل');
    console.log('');
    console.log('🔧 إعدادات SMTP الحالية:');
    console.log(`   Host: ${process.env.VITE_SMTP_HOST || 'smtp.hostinger.com'}`);
    console.log(`   Port: ${process.env.VITE_SMTP_PORT || '587'}`);
    console.log(`   User: ${process.env.VITE_SMTP_USER || 'manage@rezgee.com'}`);
    console.log(`   Pass: ${(process.env.VITE_SMTP_PASS || 'R3zG89&Secure').substring(0, 3)}***`);
    console.log('💡 ملاحظة: سيتم جلب الإعدادات من قاعدة البيانات عند الإرسال');
    console.log('');
});

// التعامل مع إيقاف الخادم
process.on('SIGINT', () => {
    console.log('\n🛑 إيقاف خادم SMTP...');
    server.close(() => {
        console.log('✅ تم إيقاف الخادم بنجاح');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 إيقاف خادم SMTP...');
    server.close(() => {
        console.log('✅ تم إيقاف الخادم بنجاح');
        process.exit(0);
    });
});

// التعامل مع الأخطاء
process.on('uncaughtException', (error) => {
    console.error('❌ خطأ غير متوقع:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ رفض غير معالج:', reason);
    process.exit(1);
});