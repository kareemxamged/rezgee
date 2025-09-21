// اختبار شامل لنظام الإيميلات المحدث - رزقي
// اختبار جميع المكونات الجديدة

import { UnifiedEmailService } from './unifiedEmailService';
import { EmailNotificationsExtension } from './emailNotificationsExtension';
import { AdvancedEmailDeliveryMethods } from './advancedEmailDeliveryMethods';
import { createUnifiedEmailTemplate, EmailTemplates } from './unifiedEmailTemplate';

export interface EmailResult {
  success: boolean;
  error?: string;
  method?: string;
  messageId?: string;
}

export interface TestResult {
  testName: string;
  success: boolean;
  error?: string;
  method?: string;
  messageId?: string;
  duration?: number;
}

export class EmailSystemTester {
  private static readonly testEmail = 'kemooamegoo@gmail.com';
  private static readonly testUserData = { first_name: 'مستخدم', last_name: 'الاختبار' };

  /**
   * تشغيل جميع اختبارات النظام
   */
  static async runCompleteTestSuite(): Promise<TestResult[]> {
    console.log('🧪 بدء الاختبار الشامل لنظام الإيميلات المحدث...');
    
    const results: TestResult[] = [];

    // 1. اختبار التيمبليت الموحد
    results.push(...await this.testUnifiedTemplates());

    // 2. اختبار الخدمة الموحدة الأساسية
    results.push(...await this.testUnifiedService());

    // 3. اختبار الإيميلات الإضافية
    results.push(...await this.testAdditionalEmails());

    // 4. اختبار طرق الإرسال المتقدمة
    results.push(...await this.testAdvancedDeliveryMethods());

    // 5. اختبار التكامل مع النظام القديم
    results.push(...await this.testLegacyIntegration());

    console.log('✅ انتهى الاختبار الشامل');
    this.printTestSummary(results);

    return results;
  }

  /**
   * اختبار التيمبليت الموحد
   */
  private static async testUnifiedTemplates(): Promise<TestResult[]> {
    console.log('🔧 اختبار التيمبليت الموحد...');
    const results: TestResult[] = [];

    try {
      // اختبار تيمبليت التحقق
      const verificationTemplate = EmailTemplates.verification(
        'https://rezgee.vercel.app/verify?token=test',
        'أحمد',
        'محمد'
      );
      const verificationResult = createUnifiedEmailTemplate(verificationTemplate);
      
      results.push({
        testName: 'تيمبليت التحقق',
        success: verificationResult.html.includes('أحمد') && verificationResult.html.includes('تأكيد الحساب'),
        duration: 0
      });

      // اختبار تيمبليت كلمة المرور المؤقتة
      const tempPasswordTemplate = EmailTemplates.temporaryPassword(
        'TempPass123',
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        'المستخدم'
      );
      const tempPasswordResult = createUnifiedEmailTemplate(tempPasswordTemplate);
      
      results.push({
        testName: 'تيمبليت كلمة المرور المؤقتة',
        success: tempPasswordResult.html.includes('TempPass123') && tempPasswordResult.html.includes('كلمة المرور المؤقتة'),
        duration: 0
      });

      // اختبار تيمبليت التحقق الثنائي
      const twoFactorTemplate = EmailTemplates.twoFactor('123456', 'login', 15);
      const twoFactorResult = createUnifiedEmailTemplate(twoFactorTemplate);
      
      results.push({
        testName: 'تيمبليت التحقق الثنائي',
        success: twoFactorResult.html.includes('123456') && twoFactorResult.html.includes('رمز التحقق الثنائي'),
        duration: 0
      });

    } catch (error) {
      results.push({
        testName: 'التيمبليت الموحد',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    return results;
  }

  /**
   * اختبار الخدمة الموحدة الأساسية
   */
  private static async testUnifiedService(): Promise<TestResult[]> {
    console.log('🔧 اختبار الخدمة الموحدة الأساسية...');
    const results: TestResult[] = [];

    const startTime = Date.now();

    try {
      // اختبار إيميل التحقق
      const verificationResult = await UnifiedEmailService.sendVerificationEmail(
        this.testEmail,
        'https://rezgee.vercel.app/verify?token=test',
        this.testUserData
      );
      
      results.push({
        testName: 'إيميل التحقق',
        success: verificationResult.success,
        error: verificationResult.error,
        method: verificationResult.method,
        messageId: verificationResult.messageId,
        duration: Date.now() - startTime
      });

      // اختبار كلمة المرور المؤقتة
      const tempPasswordResult = await UnifiedEmailService.sendTemporaryPasswordEmail(
        this.testEmail,
        'TempPass123',
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        'المستخدم'
      );
      
      results.push({
        testName: 'كلمة المرور المؤقتة',
        success: tempPasswordResult.success,
        error: tempPasswordResult.error,
        method: tempPasswordResult.method,
        messageId: tempPasswordResult.messageId,
        duration: Date.now() - startTime
      });

      // اختبار رمز التحقق الثنائي
      const twoFactorResult = await UnifiedEmailService.send2FACodeEmail(
        this.testEmail,
        '123456',
        'login',
        15
      );
      
      results.push({
        testName: 'رمز التحقق الثنائي',
        success: twoFactorResult.success,
        error: twoFactorResult.error,
        method: twoFactorResult.method,
        messageId: twoFactorResult.messageId,
        duration: Date.now() - startTime
      });

    } catch (error) {
      results.push({
        testName: 'الخدمة الموحدة الأساسية',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      });
    }

    return results;
  }

  /**
   * اختبار الإيميلات الإضافية
   */
  private static async testAdditionalEmails(): Promise<TestResult[]> {
    console.log('🔧 اختبار الإيميلات الإضافية...');
    const results: TestResult[] = [];

    const startTime = Date.now();

    try {
      // اختبار إيميل الترحيب
      const welcomeResult = await EmailNotificationsExtension.sendWelcomeEmailAfterRegistration(
        this.testEmail,
        this.testUserData
      );
      
      results.push({
        testName: 'إيميل الترحيب',
        success: welcomeResult.success,
        error: welcomeResult.error,
        method: welcomeResult.method,
        messageId: welcomeResult.messageId,
        duration: Date.now() - startTime
      });

      // اختبار تأكيد تغيير كلمة المرور
      const passwordChangeResult = await EmailNotificationsExtension.sendPasswordChangeConfirmation(
        this.testEmail,
        this.testUserData,
        {
          timestamp: new Date().toLocaleString('ar-SA'),
          ipAddress: '192.168.1.1',
          deviceType: 'Desktop',
          browser: 'Chrome'
        }
      );
      
      results.push({
        testName: 'تأكيد تغيير كلمة المرور',
        success: passwordChangeResult.success,
        error: passwordChangeResult.error,
        method: passwordChangeResult.method,
        messageId: passwordChangeResult.messageId,
        duration: Date.now() - startTime
      });

      // اختبار إشعار رسالة جديدة
      const messageResult = await EmailNotificationsExtension.sendNewMessageNotification(
        this.testEmail,
        this.testUserData,
        {
          senderName: 'مستخدم آخر',
          messagePreview: 'مرحباً، كيف حالك؟',
          timestamp: new Date().toLocaleString('ar-SA')
        }
      );
      
      results.push({
        testName: 'إشعار رسالة جديدة',
        success: messageResult.success,
        error: messageResult.error,
        method: messageResult.method,
        messageId: messageResult.messageId,
        duration: Date.now() - startTime
      });

    } catch (error) {
      results.push({
        testName: 'الإيميلات الإضافية',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      });
    }

    return results;
  }

  /**
   * اختبار طرق الإرسال المتقدمة
   */
  private static async testAdvancedDeliveryMethods(): Promise<TestResult[]> {
    console.log('🔧 اختبار طرق الإرسال المتقدمة...');
    const results: TestResult[] = [];

    const startTime = Date.now();

    try {
      const advancedResults = await AdvancedEmailDeliveryMethods.testAllAdvancedMethods(this.testEmail);
      
      advancedResults.forEach((result, index) => {
        results.push({
          testName: `طريقة إرسال متقدمة ${index + 1}`,
          success: result.success,
          error: result.error,
          method: result.method,
          messageId: result.messageId,
          duration: Date.now() - startTime
        });
      });

    } catch (error) {
      results.push({
        testName: 'طرق الإرسال المتقدمة',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      });
    }

    return results;
  }

  /**
   * اختبار التكامل مع النظام القديم
   */
  private static async testLegacyIntegration(): Promise<TestResult[]> {
    console.log('🔧 اختبار التكامل مع النظام القديم...');
    const results: TestResult[] = [];

    const startTime = Date.now();

    try {
      // اختبار النظام الموحد مع البيانات القديمة
      const legacyResult = await UnifiedEmailService.testSystem(this.testEmail);
      
      results.push({
        testName: 'التكامل مع النظام القديم',
        success: legacyResult.success,
        error: legacyResult.error,
        method: legacyResult.method,
        messageId: legacyResult.messageId,
        duration: Date.now() - startTime
      });

    } catch (error) {
      results.push({
        testName: 'التكامل مع النظام القديم',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      });
    }

    return results;
  }

  /**
   * طباعة ملخص الاختبارات
   */
  private static printTestSummary(results: TestResult[]): void {
    console.log('\n📊 ملخص الاختبارات:');
    console.log('='.repeat(50));
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const total = results.length;

    console.log(`✅ نجح: ${successful}/${total}`);
    console.log(`❌ فشل: ${failed}/${total}`);
    console.log(`📈 نسبة النجاح: ${((successful / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ الاختبارات الفاشلة:');
      results.filter(r => !r.success).forEach(result => {
        console.log(`  - ${result.testName}: ${result.error}`);
      });
    }

    console.log('\n✅ الاختبارات الناجحة:');
    results.filter(r => r.success).forEach(result => {
      console.log(`  - ${result.testName} (${result.method || 'N/A'})`);
    });

    console.log('='.repeat(50));
  }

  /**
   * اختبار سريع للنظام
   */
  static async quickTest(email: string = this.testEmail): Promise<TestResult> {
    console.log('⚡ اختبار سريع للنظام...');

    const startTime = Date.now();

    try {
      const result = await UnifiedEmailService.testSystem(email);
      
      return {
        testName: 'اختبار سريع',
        success: result.success,
        error: result.error,
        method: result.method,
        messageId: result.messageId,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testName: 'اختبار سريع',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * اختبار نوع إيميل محدد
   */
  static async testSpecificEmailType(
    type: 'verification' | 'temporary_password' | '2fa' | 'welcome' | 'password_change',
    email: string = this.testEmail
  ): Promise<TestResult> {
    console.log(`🔧 اختبار نوع الإيميل: ${type}...`);

    const startTime = Date.now();

    try {
      let result: any;

      switch (type) {
        case 'verification':
          result = await UnifiedEmailService.sendVerificationEmail(
            email,
            'https://rezgee.vercel.app/verify?token=test',
            this.testUserData
          );
          break;
        case 'temporary_password':
          result = await UnifiedEmailService.sendTemporaryPasswordEmail(
            email,
            'TempPass123',
            new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            'المستخدم'
          );
          break;
        case '2fa':
          result = await UnifiedEmailService.send2FACodeEmail(email, '123456', 'login', 15);
          break;
        case 'welcome':
          result = await EmailNotificationsExtension.sendWelcomeEmailAfterRegistration(email, this.testUserData);
          break;
        case 'password_change':
          result = await EmailNotificationsExtension.sendPasswordChangeConfirmation(
            email,
            this.testUserData,
            {
              timestamp: new Date().toLocaleString('ar-SA'),
              ipAddress: '192.168.1.1',
              deviceType: 'Desktop',
              browser: 'Chrome'
            }
          );
          break;
        default:
          throw new Error(`نوع الإيميل غير مدعوم: ${type}`);
      }

      return {
        testName: `اختبار ${type}`,
        success: result.success,
        error: result.error,
        method: result.method,
        messageId: result.messageId,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testName: `اختبار ${type}`,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      };
    }
  }
}

export default EmailSystemTester;
