#!/usr/bin/env node

/**
 * اختبار إرسال إشعار تسجيل الدخول باستخدام قالب قاعدة البيانات
 * Test sending login notification using database template
 */

import { createClient } from '@supabase/supabase-js';

// إعدادات Supabase
const SUPABASE_URL = 'https://sbtzngewizgeqzfbhfjy.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidHpuZ2V3aXpnZXF6ZmJoZmp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTEzNzkxMywiZXhwIjoyMDY2NzEzOTEzfQ.HhFFZyYcaYlrsllR5VZ0ppix8lOYGsso5IWCPsjP-3g';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testLoginNotificationWithDatabaseTemplate() {
  console.log('🚀 بدء اختبار إشعار تسجيل الدخول باستخدام قالب قاعدة البيانات...');
  console.log('');

  try {
    // 1. جلب قالب login_success من قاعدة البيانات
    console.log('📊 1. جلب قالب login_success من قاعدة البيانات...');
    
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', 'login_success')
      .eq('is_active', true)
      .single();
    
    if (templateError || !template) {
      console.error('❌ خطأ في جلب القالب:', templateError);
      return;
    }
    
    console.log('✅ تم جلب القالب بنجاح:');
    console.log(`   📧 الاسم: ${template.name_ar}`);
    console.log(`   📝 الموضوع: ${template.subject_ar}`);
    console.log(`   📄 طول المحتوى: ${template.content_ar?.length || 0} حرف`);
    console.log(`   🎨 طول HTML: ${template.html_template_ar?.length || 0} حرف`);
    console.log('');

    // 2. إعداد بيانات تسجيل الدخول للاختبار
    console.log('📋 2. إعداد بيانات تسجيل الدخول للاختبار...');
    
    const loginData = {
      timestamp: new Date().toISOString(),
      ipAddress: '154.190.63.22',
      location: 'Cairo, Cairo Governorate, Egypt',
      deviceType: 'Desktop',
      browser: 'Chrome',
      loginMethod: 'normal'
    };
    
    const userName = 'مستخدم تجريبي';
    const userEmail = 'kemooamegoo@gmail.com';
    
    console.log(`   👤 اسم المستخدم: ${userName}`);
    console.log(`   📧 البريد الإلكتروني: ${userEmail}`);
    console.log(`   🕐 وقت تسجيل الدخول: ${loginData.timestamp}`);
    console.log(`   🌍 الموقع: ${loginData.location}`);
    console.log('');

    // 3. معالجة القالب واستبدال المتغيرات
    console.log('🔧 3. معالجة القالب واستبدال المتغيرات...');
    
    let processedSubject = template.subject_ar;
    let processedHtml = template.html_template_ar;
    let processedText = template.content_ar;
    
    // تحويل التاريخ للميلادي
    const loginDate = new Date(loginData.timestamp);
    const gregorianDate = loginDate.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const gregorianTime = loginDate.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const dayName = loginDate.toLocaleDateString('ar-SA', { weekday: 'long' });
    
    // استبدال المتغيرات
    const replacements = {
      '{{userName}}': userName,
      '{{timestamp}}': loginData.timestamp,
      '{{loginDate}}': gregorianDate,
      '{{loginTime}}': gregorianTime,
      '{{dayName}}': dayName,
      '{{ipAddress}}': loginData.ipAddress,
      '{{location}}': loginData.location,
      '{{deviceType}}': loginData.deviceType,
      '{{browser}}': loginData.browser,
      '{{loginMethod}}': 'تسجيل دخول عادي'
    };
    
    // تطبيق الاستبدالات
    for (const [key, value] of Object.entries(replacements)) {
      processedSubject = processedSubject.replace(new RegExp(key, 'g'), value);
      processedHtml = processedHtml.replace(new RegExp(key, 'g'), value);
      processedText = processedText.replace(new RegExp(key, 'g'), value);
    }
    
    console.log('✅ تم معالجة القالب بنجاح:');
    console.log(`   📧 الموضوع المعالج: ${processedSubject}`);
    console.log(`   📄 طول المحتوى المعالج: ${processedText.length} حرف`);
    console.log(`   🎨 طول HTML المعالج: ${processedHtml.length} حرف`);
    console.log('');

    // 4. إرسال الإيميل عبر الخادم المحلي
    console.log('📤 4. إرسال الإيميل عبر الخادم المحلي...');
    
    const emailPayload = {
      to: userEmail,
      subject: processedSubject,
      html: processedHtml,
      text: processedText,
      from: 'manage@kareemamged.com',
      fromName: 'رزقي - موقع الزواج الإسلامي'
    };
    
    console.log(`   📬 إلى: ${emailPayload.to}`);
    console.log(`   📝 الموضوع: ${emailPayload.subject}`);
    console.log(`   👤 من: ${emailPayload.fromName} <${emailPayload.from}>`);
    console.log('');
    
    const response = await fetch('http://localhost:3001/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload)
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        console.log('✅ تم إرسال الإيميل بنجاح!');
        console.log(`   📧 معرف الرسالة: ${result.messageId || 'غير متاح'}`);
        console.log(`   ⏰ الطابع الزمني: ${result.timestamp || 'غير متاح'}`);
        console.log(`   🔧 الطريقة: ${result.method || 'غير متاح'}`);
        console.log('');
        console.log('🎉 تم إرسال إشعار تسجيل الدخول باستخدام قالب قاعدة البيانات بنجاح!');
        console.log('📧 يرجى فحص بريدك الإلكتروني للتأكد من وصول الإيميل بالقالب الصحيح.');
      } else {
        console.error('❌ فشل في إرسال الإيميل:', result.error);
      }
    } else {
      console.error('❌ خطأ في الاتصال بالخادم المحلي:', response.status);
      const errorText = await response.text();
      console.error('   📝 تفاصيل الخطأ:', errorText);
    }

  } catch (error) {
    console.error('❌ خطأ في اختبار إشعار تسجيل الدخول:', error.message);
    console.error('   📝 تفاصيل الخطأ:', error);
  }
}

// تشغيل الاختبار
testLoginNotificationWithDatabaseTemplate();
