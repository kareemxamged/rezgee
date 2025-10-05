import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// دالة إنشاء transporter ديناميكي
function createTransporter(smtpConfig) {
    if (smtpConfig) {
        console.log('🔧 إنشاء transporter مع إعدادات مخصصة:', {
            host: smtpConfig.host,
            port: smtpConfig.port,
            user: smtpConfig.auth ? .user,
            passLength: smtpConfig.auth ? .pass ? .length
        });

        return nodemailer.createTransport({
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: smtpConfig.secure,
            auth: smtpConfig.auth,
            tls: {
                rejectUnauthorized: false
            }
        });
    } else {
        console.log('🔧 استخدام إعدادات SMTP الافتراضية');
        return nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: 'manage@kareemamged.com',
                pass: 'Kk170404#'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
}

// دالة إرسال الإيميل
app.post('/send-email', async (req, res) => {
    try {
        console.log('\n🌟 ═══════════════════════════════════════════════════════════');
        console.log('📧 طلب إرسال إيميل جديد - خادم SMTP محلي');
        console.log('🕐 الوقت:', new Date().toLocaleString('ar-EG'));
        console.log('═══════════════════════════════════════════════════════════');

        const {
            to,
            subject,
            html,
            text,
            from,
            fromName,
            fromEmail,
            smtpConfig
        } = req.body;

        console.log('📧 استلام طلب إرسال إيميل:');
        console.log(`📬 إلى: ${to}`);
        console.log(`📝 الموضوع: ${subject}`);
        console.log(`👤 من: ${from}`);

        // إنشاء transporter مع إعدادات SMTP المحددة
        const transporter = createTransporter(smtpConfig);

        // تسجيل إعدادات transporter المستخدمة فعلياً
        console.log('🔧 إعدادات Transporter المستخدمة فعلياً:');
        console.log(`  - Host: ${transporter.options.host}`);
        console.log(`  - Port: ${transporter.options.port}`);
        console.log(`  - User: ${transporter.options.auth?.user}`);
        console.log(`  - Secure: ${transporter.options.secure}`);

        // اختبار الاتصال بـ SMTP
        console.log('🔍 اختبار الاتصال بـ SMTP...');
        await transporter.verify();
        console.log('✅ تم التحقق من اتصال SMTP بنجاح');

        // تحديد اسم المرسل والبريد الإلكتروني من إعدادات SMTP أو البيانات المرسلة
        const senderName = smtpConfig ? .from ? .name || fromName || 'رزقي - منصة الزواج الإسلامي الشرعي';
        const senderEmail = smtpConfig ? .from ? .email || fromEmail || from || 'manage@kareemamged.com';

        console.log('🔧 إعدادات SMTP المستخدمة:');
        console.log(`🔐 SMTP Host: ${smtpConfig?.host || 'smtp.hostinger.com'}:${smtpConfig?.port || 465}`);
        console.log(`👤 SMTP User: ${smtpConfig?.auth?.user || 'manage@kareemamged.com'}`);
        console.log(`🔑 SMTP Pass: ${smtpConfig?.auth?.pass ? smtpConfig.auth.pass.substring(0, 3) + '***' : 'Kk1***'}`);
        console.log(`📧 Sender Email: ${senderEmail}`);
        console.log(`👤 Sender Name: ${senderName}`);

        // تسجيل مفصل للإعدادات المرسلة
        if (smtpConfig) {
            console.log('📋 إعدادات SMTP المرسلة من القالب:');
            console.log(`  - Host: ${smtpConfig.host}`);
            console.log(`  - Port: ${smtpConfig.port}`);
            console.log(`  - User: ${smtpConfig.auth?.user}`);
            console.log(`  - From Email: ${smtpConfig.from?.email}`);
            console.log(`  - From Name: ${smtpConfig.from?.name}`);
        } else {
            console.log('⚠️ لا توجد إعدادات SMTP مخصصة، استخدام الإعدادات الافتراضية');
        }

        const mailOptions = {
            from: {
                name: senderName,
                address: senderEmail
            },
            to: to,
            subject: subject,
            html: html,
            text: text
        };

        console.log('📤 بدء إرسال الإيميل...');
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ تم إرسال الإيميل بنجاح:', info.messageId);
        console.log('📧 معرف الرسالة:', info.messageId);
        console.log('📬 تم الإرسال إلى:', to);
        console.log('═══════════════════════════════════════════════════════════\n');

        res.json({
            success: true,
            messageId: info.messageId,
            message: 'تم إرسال الإيميل بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في إرسال الإيميل:', error);
        console.error('📋 تفاصيل الخطأ:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دالة اختبار الاتصال
app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'خادم SMTP محلي يعمل بنجاح',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`🚀 خادم SMTP محلي يعمل على المنفذ ${PORT}`);
    console.log(`📧 رابط الإرسال: http://localhost:${PORT}/send-email`);
    console.log(`🧪 رابط الاختبار: http://localhost:${PORT}/test`);
    console.log(`🌐 CORS مُفعل للطلبات من localhost:5173`);
});

export default app;