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

// إعداد Nodemailer مع Hostinger SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // استخدام SSL
    auth: {
        user: 'manage@kareemamged.com',
        pass: 'Kk170404#' // كلمة مرور Hostinger الصحيحة
    },
    tls: {
        rejectUnauthorized: false // تجاهل شهادات SSL غير الموثقة
    }
});

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
            fromEmail
        } = req.body;

        console.log('📧 استلام طلب إرسال إيميل:');
        console.log(`📬 إلى: ${to}`);
        console.log(`📝 الموضوع: ${subject}`);
        console.log(`👤 من: ${from}`);

        // اختبار الاتصال بـ SMTP
        console.log('🔍 اختبار الاتصال بـ SMTP...');
        await transporter.verify();
        console.log('✅ تم التحقق من اتصال SMTP بنجاح');

        // تحديد اسم المرسل والبريد الإلكتروني
        const senderName = fromName || 'رزقي - منصة الزواج الإسلامي الشرعي';
        const senderEmail = fromEmail || 'manage@kareemamged.com';

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