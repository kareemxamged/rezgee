// اختبار إيميل النشرة الإخبارية ثنائي اللغة
// Test Bilingual Newsletter Email

const {
    EmailTemplates,
    createUnifiedEmailTemplate
} = require('./src/lib/unifiedEmailTemplate.ts');

console.log('🧪 اختبار إيميل النشرة الإخبارية ثنائي اللغة...\n');

// اختبار إيميل الترحيب
console.log('📧 إيميل الترحيب:');
const welcomeTemplate = EmailTemplates.newsletterWelcome('test@example.com', 'أحمد');
const welcomeEmail = createUnifiedEmailTemplate(welcomeTemplate);

console.log('📝 الموضوع:', welcomeEmail.subject);
console.log('👋 التحية (HTML):', welcomeTemplate.greeting);
console.log('📄 المحتوى الرئيسي:');
console.log(welcomeTemplate.mainContent);
console.log('⚠️ التحذير:', welcomeTemplate.warning);
console.log('🦶 التذييل:', welcomeTemplate.footer);

console.log('\n' + '='.repeat(80) + '\n');

// اختبار إيميل إلغاء الاشتراك
console.log('📧 إيميل إلغاء الاشتراك:');
const unsubscribeTemplate = EmailTemplates.newsletterUnsubscribe('test@example.com', 'أحمد');
const unsubscribeEmail = createUnifiedEmailTemplate(unsubscribeTemplate);

console.log('• 🎯 رسائل واضحة ومفهومة');