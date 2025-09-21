// إصلاح اسم المرسل في إيميل رمز التحقق الإداري
// Fix sender name in admin 2FA email

import fs from 'fs';
import path from 'path';

const filePath = 'src/lib/unifiedEmailService.ts';

console.log('🔧 إصلاح اسم المرسل في إيميل رمز التحقق الإداري...');

try {
    // قراءة الملف
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('📁 قراءة الملف:', filePath);

    // البحث عن السطرين المشكلين
    const oldPattern1 = '          from: `${emailData.from} <${this.fromEmail}>`';
    const oldPattern2 = '          from: `${emailData.from} <${this.fromEmail}>`,';

    // التنسيق الجديد الصحيح
    const newPattern1 = '          from: `${emailData.from} <${this.fromEmail}>`';
    const newPattern2 = '          from: `${emailData.from} <${this.fromEmail}>`,';

    console.log('🔍 البحث عن الأنماط المشكلة...');

    let changes = 0;

    // إصلاح السطر الأول
    if (content.includes(oldPattern1)) {
        content = content.replace(oldPattern1, newPattern1);
        changes++;
        console.log('✅ تم إصلاح السطر الأول');
    }

    // إصلاح السطر الثاني
    if (content.includes(oldPattern2)) {
        content = content.replace(oldPattern2, newPattern2);
        changes++;
        console.log('✅ تم إصلاح السطر الثاني');
    }

    if (changes > 0) {
        // كتابة الملف المحدث
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ تم إصلاح ${changes} سطر بنجاح`);
    } else {
        console.log('ℹ️ لم يتم العثور على الأنماط المشكلة');
    }

    // التحقق من التغييرات
    console.log('\n🔍 التحقق من التغييرات:');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        if (line.includes('from: `${emailData.from} <${this.fromEmail}>`')) {
            console.log(`السطر ${index + 1}: ${line.trim()}`);
        }
    });

} catch (error) {
    console.error('❌ خطأ في إصلاح الملف:', error.message);
}



