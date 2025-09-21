/**
 * ملف اختبار النظام الموحد للإيميلات
 * يمكن استخدامه للتأكد من عمل النظام بشكل صحيح
 */

import { UnifiedEmailService } from '../lib/unifiedEmailService';
import { UnifiedEmailTemplateSystem, UnifiedEmailTemplates } from '../lib/unifiedEmailTemplateSystem';

/**
 * اختبار إرسال كلمة المرور المؤقتة
 */
export async function testTemporaryPassword(email: string = 'test@example.com') {
  console.log('🧪 اختبار إرسال كلمة المرور المؤقتة...');
  
  const password = 'TEST123';
  const expiresAt = new Date(Date.now() + 3600000).toISOString(); // ساعة من الآن
  const recipientName = 'مستخدم تجريبي';
  
  try {
    const result = await UnifiedEmailService.sendTemporaryPassword(
      email,
      password,
      expiresAt,
      recipientName
    );
    
    console.log('✅ نتيجة اختبار كلمة المرور المؤقتة:', result);
    return result;
  } catch (error) {
    console.error('❌ خطأ في اختبار كلمة المرور المؤقتة:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

/**
 * اختبار إرسال رمز التحقق الثنائي
 */
export async function testTwoFactorCode(email: string = 'test@example.com') {
  console.log('🧪 اختبار إرسال رمز التحقق الثنائي...');
  
  const code = '123456';
  const codeType = 'login';
  const expiresInMinutes = 15;
  
  try {
    const result = await UnifiedEmailService.sendTwoFactorCode(
      email,
      code,
      codeType,
      expiresInMinutes
    );
    
    console.log('✅ نتيجة اختبار رمز التحقق الثنائي:', result);
    return result;
  } catch (error) {
    console.error('❌ خطأ في اختبار رمز التحقق الثنائي:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

/**
 * اختبار إرسال تأكيد تغيير البيانات
 */
export async function testContactChangeConfirmation(email: string = 'test@example.com') {
  console.log('🧪 اختبار إرسال تأكيد تغيير البيانات...');
  
  const confirmationUrl = 'https://rezge.com/verify-change?token=test123';
  const changeType = 'email';
  const oldValue = 'old@example.com';
  const newValue = 'new@example.com';
  
  try {
    const result = await UnifiedEmailService.sendContactChangeConfirmation(
      email,
      confirmationUrl,
      changeType,
      oldValue,
      newValue
    );
    
    console.log('✅ نتيجة اختبار تأكيد تغيير البيانات:', result);
    return result;
  } catch (error) {
    console.error('❌ خطأ في اختبار تأكيد تغيير البيانات:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

/**
 * اختبار إرسال إشعار تسجيل دخول ناجح
 */
export async function testSuccessfulLoginNotification(email: string = 'test@example.com') {
  console.log('🧪 اختبار إرسال إشعار تسجيل دخول ناجح...');
  
  const loginData = {
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.1',
    location: 'الرياض، السعودية',
    deviceType: 'Desktop',
    browser: 'Chrome'
  };
  
  try {
    const result = await UnifiedEmailService.sendSuccessfulLoginNotification(
      email,
      loginData
    );
    
    console.log('✅ نتيجة اختبار إشعار تسجيل الدخول:', result);
    return result;
  } catch (error) {
    console.error('❌ خطأ في اختبار إشعار تسجيل الدخول:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

/**
 * اختبار إنشاء التيمبليت فقط (بدون إرسال)
 */
export function testTemplateGeneration() {
  console.log('🧪 اختبار إنشاء التيمبليت...');
  
  try {
    // اختبار تيمبليت كلمة المرور المؤقتة
    const tempPasswordData = UnifiedEmailTemplates.temporaryPassword(
      'ABC123',
      new Date(Date.now() + 3600000).toISOString(),
      'أحمد محمد'
    );
    const tempPasswordTemplate = UnifiedEmailTemplateSystem.generateUnifiedTemplate(tempPasswordData);
    console.log('✅ تيمبليت كلمة المرور المؤقتة:', {
      subject: tempPasswordTemplate.subject,
      htmlLength: tempPasswordTemplate.htmlContent.length,
      textLength: tempPasswordTemplate.textContent.length
    });
    
    // اختبار تيمبليت رمز التحقق الثنائي
    const twoFactorData = UnifiedEmailTemplates.twoFactorCode('123456', 'login', 15);
    const twoFactorTemplate = UnifiedEmailTemplateSystem.generateUnifiedTemplate(twoFactorData);
    console.log('✅ تيمبليت رمز التحقق الثنائي:', {
      subject: twoFactorTemplate.subject,
      htmlLength: twoFactorTemplate.htmlContent.length,
      textLength: twoFactorTemplate.textContent.length
    });
    
    // اختبار تيمبليت تأكيد تغيير البيانات
    const contactChangeData = UnifiedEmailTemplates.contactChangeConfirmation(
      'https://example.com/verify',
      'email',
      'old@example.com',
      'new@example.com'
    );
    const contactChangeTemplate = UnifiedEmailTemplateSystem.generateUnifiedTemplate(contactChangeData);
    console.log('✅ تيمبليت تأكيد تغيير البيانات:', {
      subject: contactChangeTemplate.subject,
      htmlLength: contactChangeTemplate.htmlContent.length,
      textLength: contactChangeTemplate.textContent.length
    });
    
    // اختبار تيمبليت إشعار تسجيل الدخول
    const loginData = UnifiedEmailTemplates.successfulLogin({
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      location: 'الرياض، السعودية',
      deviceType: 'Desktop',
      browser: 'Chrome'
    });
    const loginTemplate = UnifiedEmailTemplateSystem.generateUnifiedTemplate(loginData);
    console.log('✅ تيمبليت إشعار تسجيل الدخول:', {
      subject: loginTemplate.subject,
      htmlLength: loginTemplate.htmlContent.length,
      textLength: loginTemplate.textContent.length
    });
    
    return {
      success: true,
      templates: {
        temporaryPassword: tempPasswordTemplate,
        twoFactor: twoFactorTemplate,
        contactChange: contactChangeTemplate,
        login: loginTemplate
      }
    };
  } catch (error) {
    console.error('❌ خطأ في اختبار إنشاء التيمبليت:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

/**
 * تشغيل جميع الاختبارات
 */
export async function runAllTests(email: string = 'test@example.com') {
  console.log('🚀 بدء تشغيل جميع اختبارات النظام الموحد...');
  
  const results = {
    templateGeneration: testTemplateGeneration(),
    temporaryPassword: await testTemporaryPassword(email),
    twoFactorCode: await testTwoFactorCode(email),
    contactChangeConfirmation: await testContactChangeConfirmation(email),
    successfulLoginNotification: await testSuccessfulLoginNotification(email)
  };
  
  console.log('📊 نتائج جميع الاختبارات:', results);
  
  // إحصائيات النجاح
  const successCount = Object.values(results).filter(result => result.success).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`📈 معدل النجاح: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`);
  
  return results;
}

/**
 * إتاحة الاختبارات في الكونسول (بيئة التطوير فقط)
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).testUnifiedEmailSystem = {
    testTemporaryPassword,
    testTwoFactorCode,
    testContactChangeConfirmation,
    testSuccessfulLoginNotification,
    testTemplateGeneration,
    runAllTests
  };
  
  console.log('🔧 أدوات اختبار النظام الموحد متاحة في الكونسول:');
  console.log('💡 testUnifiedEmailSystem.testTemporaryPassword("email@example.com")');
  console.log('💡 testUnifiedEmailSystem.testTwoFactorCode("email@example.com")');
  console.log('💡 testUnifiedEmailSystem.testContactChangeConfirmation("email@example.com")');
  console.log('💡 testUnifiedEmailSystem.testSuccessfulLoginNotification("email@example.com")');
  console.log('💡 testUnifiedEmailSystem.testTemplateGeneration()');
  console.log('💡 testUnifiedEmailSystem.runAllTests("email@example.com")');
}
