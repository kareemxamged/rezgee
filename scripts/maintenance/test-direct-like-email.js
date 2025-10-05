// اختبار إرسال إيميل إعجاب مباشر
// Test direct like email sending

console.log('🧪 اختبار إرسال إيميل إعجاب مباشر...');
console.log('=====================================');

// محاكاة إرسال إيميل إعجاب
const testLikeEmail = async () => {
            try {
                // محاكاة البيانات كما في directNotificationEmailService.ts
                const emailData = {
                    to: 'kemooamegoo@gmail.com',
                    subject: 'إعجاب جديد! - رزقي',
                    html: `
        <html>
          <body style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
            <h2>إعجاب جديد!</h2>
            <p>لديك إعجاب جديد من أحمد محمد</p>
            <p>من: القاهرة</p>
            <p>هذا الإشعار تم إرساله تلقائياً من منصة رزقي</p>
          </body>
        </html>
      `,
                    text: 'لديك إعجاب جديد من أحمد محمد',
                    type: 'like_notification',
                    from: 'رزقي | الإعجاب' // هذا هو الاسم المخصص
                };

                testLikeEmail();