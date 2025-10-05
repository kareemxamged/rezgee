// اختبار اسم المرسل الفعلي
// Test actual sender name

console.log('🧪 اختبار اسم المرسل الفعلي...');
console.log('=====================================');

// محاكاة البيانات كما تأتي من directNotificationEmailService
const emailData = {
    to: 'kemooamegoo@gmail.com',
    subject: 'إعجاب جديد! - رزقي',
    html: '<html><body>لديك إعجاب جديد!</body></html>',
    text: 'لديك إعجاب جديد من أحمد محمد',
    type: 'like_notification',
    from: 'رزقي | الإعجاب' // هذا هو الاسم المخصص
};

console.log('📧 emailData الأصلي:');
console.log('  from:', emailData.from);
console.log('  type:', emailData.type);

// محاكاة EmailSenderManager.getSenderConfig
const emailType = 'like_notification';
const language = 'ar';
const style = 'modern';

// محاكاة modernNames من emailSenderConfig.ts
const platformName = {
    ar: 'رزقي',
    en: 'Rezge'
};
const modernNames = {
    like_notification: {
        ar: `${platformName.ar} | الإعجاب`,
        en: `${platformName.en} | Likes`
    }
};

const senderConfig = {
    name: modernNames[emailType] ? . [language] || `${platformName[language]} | منصة الزواج الإسلامي الشرعي`,
    email: 'noreply@rezgee.com',
    replyTo: 'support@rezgee.com'
};

console.log('\n🔧 senderConfig من EmailSenderManager:');
console.log('  name:', senderConfig.name);

console.log('❌ إذا ظهر "رزقي منصة الزواج الإسلامي الشرعي" فهناك مشكلة في النظام');