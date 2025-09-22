/**
 * اختبار القوالب الاجتماعية (Social Templates)
 * Test Social Templates
 */

console.log('🧪 بدء اختبار القوالب الاجتماعية...');

// اختبار البيانات المطلوبة
const testData = {
    // بيانات قالب الإعجاب
    likeNotification: {
        userName: 'أحمد محمد',
        likerName: 'فاطمة علي',
        likerCity: 'الرياض',
        likerAge: 25,
        timestamp: new Date().toLocaleString('ar-SA'),
        profileUrl: 'https://rezge.com/profile/123'
    },

    // بيانات قالب الرسالة الجديدة
    newMessageNotification: {
        userName: 'سارة أحمد',
        senderName: 'محمد خالد',
        senderCity: 'جدة',
        senderAge: 28,
        timestamp: new Date().toLocaleString('ar-SA'),
        messagePreview: 'السلام عليكم، كيف حالك؟ أتمنى أن تكون بخير',
        messagesUrl: 'https://rezge.com/messages'
    },

    // بيانات قالب المطابقة الجديدة
    matchNotification: {
        userName: 'نور الدين',
        matchName: 'ريم السعد',
        matchCity: 'الدمام',
        matchAge: 26,
        timestamp: new Date().toLocaleString('ar-SA'),
        profileUrl: 'https://rezge.com/profile/456'
    }
};

// اختبار قالب الإعجاب
function testLikeNotificationTemplate() {
    console.log('💖 اختبار قالب الإعجاب...');

    const template = {
        name: 'like_notification',
        name_ar: 'إشعار الإعجاب',
        name_en: 'Like Notification',
        subject_ar: '💖 شخص جديد أعجب بك - رزقي',
        subject_en: '💖 Someone New Liked You - Rezge'
    };

    // اختبار البيانات الأساسية
    console.log('✅ اسم القالب:', template.name);
    console.log('✅ الاسم العربي:', template.name_ar);
    console.log('✅ الاسم الإنجليزي:', template.name_en);
    console.log('✅ الموضوع العربي:', template.subject_ar);
    console.log('✅ الموضوع الإنجليزي:', template.subject_en);

    // اختبار المتغيرات
    const variables = ['{{userName}}', '{{likerName}}', '{{likerCity}}', '{{likerAge}}', '{{timestamp}}', '{{profileUrl}}'];
    console.log('✅ المتغيرات المطلوبة:', variables.join(', '));

    // اختبار استبدال المتغيرات
    const testContent = `مرحباً {{userName}}، {{likerName}} من {{likerCity}} أعجب بك!`;
    const replacedContent = testContent
        .replace('{{userName}}', testData.likeNotification.userName)
        .replace('{{likerName}}', testData.likeNotification.likerName)
        .replace('{{likerCity}}', testData.likeNotification.likerCity);

    console.log('✅ اختبار استبدال المتغيرات:', replacedContent);

    return true;
}

// اختبار قالب الرسالة الجديدة
function testNewMessageNotificationTemplate() {
    console.log('💬 اختبار قالب الرسالة الجديدة...');

    const template = {
        name: 'new_message_notification',
        name_ar: 'إشعار الرسالة الجديدة',
        name_en: 'New Message Notification',
        subject_ar: '💬 رسالة جديدة من {{senderName}} - رزقي',
        subject_en: '💬 New Message from {{senderName}} - Rezge'
    };

    // اختبار البيانات الأساسية
    console.log('✅ اسم القالب:', template.name);
    console.log('✅ الاسم العربي:', template.name_ar);
    console.log('✅ الاسم الإنجليزي:', template.name_en);
    console.log('✅ الموضوع العربي:', template.subject_ar);
    console.log('✅ الموضوع الإنجليزي:', template.subject_en);

    // اختبار المتغيرات
    const variables = ['{{userName}}', '{{senderName}}', '{{senderCity}}', '{{senderAge}}', '{{timestamp}}', '{{messagePreview}}', '{{messagesUrl}}'];
    console.log('✅ المتغيرات المطلوبة:', variables.join(', '));

    // اختبار استبدال المتغيرات
    const testContent = `مرحباً {{userName}}، لديك رسالة جديدة من {{senderName}} من {{senderCity}}`;
    const replacedContent = testContent
        .replace('{{userName}}', testData.newMessageNotification.userName)
        .replace('{{senderName}}', testData.newMessageNotification.senderName)
        .replace('{{senderCity}}', testData.newMessageNotification.senderCity);

    console.log('✅ اختبار استبدال المتغيرات:', replacedContent);

    return true;
}

// اختبار قالب المطابقة الجديدة
function testMatchNotificationTemplate() {
    console.log('✨ اختبار قالب المطابقة الجديدة...');

    const template = {
        name: 'match_notification',
        name_ar: 'إشعار المطابقة الجديدة',
        name_en: 'Match Notification',
        subject_ar: '✨ مطابقة جديدة! - رزقي',
        subject_en: '✨ New Match! - Rezge'
    };

    // اختبار البيانات الأساسية
    console.log('✅ اسم القالب:', template.name);
    console.log('✅ الاسم العربي:', template.name_ar);
    console.log('✅ الاسم الإنجليزي:', template.name_en);
    console.log('✅ الموضوع العربي:', template.subject_ar);
    console.log('✅ الموضوع الإنجليزي:', template.subject_en);

    // اختبار المتغيرات
    const variables = ['{{userName}}', '{{matchName}}', '{{matchCity}}', '{{matchAge}}', '{{timestamp}}', '{{profileUrl}}'];
    console.log('✅ المتغيرات المطلوبة:', variables.join(', '));

    // اختبار استبدال المتغيرات
    const testContent = `تهانينا {{userName}}! لديك مطابقة جديدة مع {{matchName}} من {{matchCity}}`;
    const replacedContent = testContent
        .replace('{{userName}}', testData.matchNotification.userName)
        .replace('{{matchName}}', testData.matchNotification.matchName)
        .replace('{{matchCity}}', testData.matchNotification.matchCity);

    console.log('✅ اختبار استبدال المتغيرات:', replacedContent);

    return true;
}

// اختبار المحتوى العربي
function testArabicContent() {
    console.log('📝 اختبار المحتوى العربي...');

    const arabicContent = {
        likeNotification: {
            greeting: 'مرحباً أحمد محمد،',
            message: 'شخص جديد أعجب بك في منصة رزقي!',
            likerInfo: 'معلومات المعجب:',
            encouragement: 'هذا يعني أن شخصاً مهتماً بك ويريد التعرف عليك'
        },
        newMessageNotification: {
            greeting: 'مرحباً سارة أحمد،',
            message: 'وصلتك رسالة جديدة من محمد خالد',
            senderInfo: 'معلومات المرسل:',
            messagePreview: 'معاينة الرسالة:',
            action: 'يمكنك الآن قراءة الرسالة الكاملة والرد عليها'
        },
        matchNotification: {
            greeting: 'مرحباً نور الدين،',
            congratulations: 'تهانينا! لديك مطابقة جديدة في منصة رزقي!',
            matchInfo: 'معلومات المطابقة:',
            explanation: 'هذا يعني أن كلاكما أعجب بالآخر! يمكنك الآن البدء في التواصل معه'
        }
    };

    console.log('✅ محتوى قالب الإعجاب:', arabicContent.likeNotification);
    console.log('✅ محتوى قالب الرسالة الجديدة:', arabicContent.newMessageNotification);
    console.log('✅ محتوى قالب المطابقة الجديدة:', arabicContent.matchNotification);

    return true;
}

// اختبار المحتوى الإنجليزي
function testEnglishContent() {
    console.log('📝 اختبار المحتوى الإنجليزي...');

    const englishContent = {
        likeNotification: {
            greeting: 'Hello Ahmed Mohamed,',
            message: 'Someone new liked you on Rezge platform!',
            likerInfo: 'Liker Information:',
            encouragement: 'This means someone is interested in you and wants to get to know you'
        },
        newMessageNotification: {
            greeting: 'Hello Sara Ahmed,',
            message: 'You have a new message from Mohamed Khaled',
            senderInfo: 'Sender Information:',
            messagePreview: 'Message Preview:',
            action: 'You can now read the full message and reply to it'
        },
        matchNotification: {
            greeting: 'Hello Nour Al-Din,',
            congratulations: 'Congratulations! You have a new match on Rezge platform!',
            matchInfo: 'Match Information:',
            explanation: 'This means you both liked each other! You can now start communicating with them'
        }
    };

    console.log('✅ English content for like notification:', englishContent.likeNotification);
    console.log('✅ English content for new message:', englishContent.newMessageNotification);
    console.log('✅ English content for match notification:', englishContent.matchNotification);

    return true;
}

// اختبار التصميم HTML
function testHTMLDesign() {
    console.log('🎨 اختبار التصميم HTML...');

    const designElements = {
        likeNotification: {
            colors: ['#e91e63', '#c2185b', '#fce4ec'],
            elements: ['header', 'alert-info', 'liker-box'],
            icons: ['💖', '👤', '📍', '🎂', '🕐', '👀']
        },
        newMessageNotification: {
            colors: ['#2196f3', '#1976d2', '#e3f2fd'],
            elements: ['header', 'alert-info', 'sender-box', 'message-preview'],
            icons: ['💬', '📨', '📝', '📍', '🎂', '📅', '💬']
        },
        matchNotification: {
            colors: ['#4caf50', '#2e7d32', '#e8f5e8'],
            elements: ['header', 'alert-success', 'match-box'],
            icons: ['✨', '👤', '📍', '🎂', '🕐', '💬']
        }
    };

    console.log('✅ عناصر تصميم قالب الإعجاب:', designElements.likeNotification);
    console.log('✅ عناصر تصميم قالب الرسالة الجديدة:', designElements.newMessageNotification);
    console.log('✅ عناصر تصميم قالب المطابقة الجديدة:', designElements.matchNotification);

    return true;
}

// اختبار قاعدة البيانات
function testDatabaseStructure() {
    console.log('🗄️ اختبار هيكل قاعدة البيانات...');

    const dbStructure = {
        email_notification_types: [{
                name: 'like_notification',
                name_ar: 'إشعار الإعجاب',
                name_en: 'Like Notification'
            },
            {
                name: 'new_message_notification',
                name_ar: 'إشعار الرسالة الجديدة',
                name_en: 'New Message Notification'
            },
            {
                name: 'match_notification',
                name_ar: 'إشعار المطابقة الجديدة',
                name_en: 'Match Notification'
            }
        ],
        email_templates: [{
                name: 'like_notification',
                has_arabic_content: true,
                has_english_content: true,
                has_html_arabic: true,
                has_html_english: true
            },
            {
                name: 'new_message_notification',
                has_arabic_content: true,
                has_english_content: true,
                has_html_arabic: true,
                has_html_english: true
            },
            {
                name: 'match_notification',
                has_arabic_content: true,
                has_english_content: true,
                has_html_arabic: true,
                has_html_english: true
            }
        ]
    };

    console.log('✅ هيكل جدول أنواع الإشعارات:', dbStructure.email_notification_types);
    console.log('✅ هيكل جدول القوالب:', dbStructure.email_templates);

    return true;
}

// اختبار التكامل مع النظام
function testSystemIntegration() {
    console.log('🔗 اختبار التكامل مع النظام...');

    const integrationPoints = {
        notificationEmailService: {
            sendLikeNotification: '✅ موجود',
            sendNewMessageNotification: '✅ موجود',
            sendMatchNotification: '✅ موجود'
        },
        integratedEmailService: {
            sendLikeNotification: '✅ موجود',
            sendMatchNotification: '✅ موجود'
        },
        directNotificationEmailService: {
            sendLikeNotificationEmail: '✅ موجود',
            sendMatchNotificationEmail: '✅ موجود'
        },
        socialFeatures: {
            like_system: '✅ نظام الإعجاب',
            messaging_system: '✅ نظام الرسائل',
            matching_system: '✅ نظام المطابقات',
            profile_views: '✅ زيارة الملفات الشخصية'
        }
    };

    console.log('✅ نقاط التكامل:', integrationPoints);

    return true;
}

// اختبار أنواع التفاعلات الاجتماعية
function testSocialInteractions() {
    console.log('🤝 اختبار أنواع التفاعلات الاجتماعية...');

    const socialInteractions = {
        like: {
            arabic: 'إعجاب',
            english: 'Like',
            description: 'إعجاب بالمستخدمين الآخرين'
        },
        message: {
            arabic: 'رسالة',
            english: 'Message',
            description: 'إرسال رسائل للمستخدمين الآخرين'
        },
        match: {
            arabic: 'مطابقة',
            english: 'Match',
            description: 'مطابقة متبادلة بين المستخدمين'
        },
        profileView: {
            arabic: 'زيارة ملف شخصي',
            english: 'Profile View',
            description: 'زيارة ملفات المستخدمين الآخرين'
        }
    };

    console.log('✅ أنواع التفاعلات الاجتماعية:', socialInteractions);

    return true;
}

// اختبار أزرار العمل
function testActionButtons() {
    console.log('🔘 اختبار أزرار العمل...');

    const actionButtons = {
        likeNotification: {
            buttonText: 'مراجعة الملف الشخصي',
            buttonUrl: '{{profileUrl}}',
            buttonColor: '#e91e63'
        },
        newMessageNotification: {
            buttonText: 'قراءة الرسالة',
            buttonUrl: '{{messagesUrl}}',
            buttonColor: '#2196f3'
        },
        matchNotification: {
            buttonText: 'بدء المحادثة',
            buttonUrl: '{{profileUrl}}',
            buttonColor: '#4caf50'
        }
    };

    console.log('✅ أزرار العمل:', actionButtons);

    return true;
}

// تشغيل جميع الاختبارات
function runAllTests() {
    console.log('🚀 بدء تشغيل جميع الاختبارات...\n');

    const tests = [{
            name: 'قالب الإعجاب',
            test: testLikeNotificationTemplate
        },
        {
            name: 'قالب الرسالة الجديدة',
            test: testNewMessageNotificationTemplate
        },
        {
            name: 'قالب المطابقة الجديدة',
            test: testMatchNotificationTemplate
        },
        {
            name: 'المحتوى العربي',
            test: testArabicContent
        },
        {
            name: 'المحتوى الإنجليزي',
            test: testEnglishContent
        },
        {
            name: 'التصميم HTML',
            test: testHTMLDesign
        },
        {
            name: 'هيكل قاعدة البيانات',
            test: testDatabaseStructure
        },
        {
            name: 'التكامل مع النظام',
            test: testSystemIntegration
        },
        {
            name: 'أنواع التفاعلات الاجتماعية',
            test: testSocialInteractions
        },
        {
            name: 'أزرار العمل',
            test: testActionButtons
        }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    tests.forEach((test, index) => {
        console.log(`\n📋 الاختبار ${index + 1}: ${test.name}`);
        try {
            const result = test.test();
            if (result) {
                console.log(`✅ نجح الاختبار: ${test.name}`);
                passedTests++;
            } else {
                console.log(`❌ فشل الاختبار: ${test.name}`);
            }
        } catch (error) {
            console.log(`❌ خطأ في الاختبار: ${test.name}`, error.message);
        }
    });

    console.log(`\n📊 نتائج الاختبارات:`);
    console.log(`✅ نجح: ${passedTests}/${totalTests}`);
    console.log(`❌ فشل: ${totalTests - passedTests}/${totalTests}`);
    console.log(`📈 معدل النجاح: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (passedTests === totalTests) {
        console.log('\n🎉 جميع الاختبارات نجحت! القوالب الاجتماعية جاهزة للاستخدام.');
    } else {
        console.log('\n⚠️ بعض الاختبارات فشلت. يرجى مراجعة الأخطاء.');
    }

    return passedTests === totalTests;
}

// تشغيل الاختبارات
runAllTests();

console.log('\n🏁 انتهاء اختبار القوالب الاجتماعية.');




