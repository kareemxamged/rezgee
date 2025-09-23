import { IntegratedEmailService } from './integratedEmailService';
import { DatabaseEmailService } from './databaseEmailService';

/**
 * اختبار النظام المدمج للإيميلات
 * Test Integrated Email System
 */
export class TestIntegratedEmailSystem {
  
  /**
   * اختبار شامل للنظام المدمج
   */
  static async runFullTest(testEmail: string = 'kemooamegoo@gmail.com'): Promise<void> {
    console.log('🧪 بدء الاختبار الشامل للنظام المدمج...');
    console.log(`📧 إيميل الاختبار: ${testEmail}`);
    console.log('=' .repeat(60));

    try {
      // 1. اختبار الاتصال بقاعدة البيانات
      console.log('\n📊 1. اختبار الاتصال بقاعدة البيانات...');
      await this.testDatabaseConnection();

      // 2. اختبار القوالب الأساسية
      console.log('\n📧 2. اختبار القوالب الأساسية...');
      await this.testBasicTemplates(testEmail);

      // 3. اختبار القوالب الاجتماعية
      console.log('\n💕 3. اختبار القوالب الاجتماعية...');
      await this.testSocialTemplates(testEmail);

      // 4. اختبار القوالب الإدارية
      console.log('\n⚖️ 4. اختبار القوالب الإدارية...');
      await this.testAdminTemplates(testEmail);

      // 5. اختبار القوالب الأمنية
      console.log('\n🔒 5. اختبار القوالب الأمنية...');
      await this.testSecurityTemplates(testEmail);

      // 6. اختبار النظام المدمج
      console.log('\n🔗 6. اختبار النظام المدمج...');
      await this.testIntegratedSystem(testEmail);

      // 7. عرض الإحصائيات النهائية
      console.log('\n📈 7. الإحصائيات النهائية...');
      await this.showFinalStats();

      console.log('\n✅ انتهى الاختبار الشامل بنجاح!');
      console.log('=' .repeat(60));

    } catch (error) {
      console.error('❌ خطأ في الاختبار الشامل:', error);
    }
  }

  /**
   * اختبار الاتصال بقاعدة البيانات
   */
  private static async testDatabaseConnection(): Promise<void> {
    try {
      // اختبار جلب قالب
      const template = await DatabaseEmailService.getEmailTemplate('account_verification', 'ar');
      if (template) {
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
        console.log(`📧 القالب: ${template.name_ar} (${template.name})`);
      } else {
        console.log('⚠️ لم يتم العثور على القالب في قاعدة البيانات');
      }

      // اختبار جلب إعدادات SMTP
      const settings = await DatabaseEmailService.getEmailSettings();
      if (settings) {
        console.log('✅ تم جلب إعدادات SMTP بنجاح');
        console.log(`📧 الخادم: ${settings.smtp_host}:${settings.smtp_port}`);
      } else {
        console.log('⚠️ لم يتم العثور على إعدادات SMTP');
      }

    } catch (error) {
      console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error);
    }
  }

  /**
   * اختبار القوالب الأساسية
   */
  private static async testBasicTemplates(testEmail: string): Promise<void> {
    const basicTemplates = [
      'account_verification',
      'temporary_password',
      'two_factor_code',
      'welcome_email'
    ];

    for (const templateName of basicTemplates) {
      try {
        console.log(`🧪 اختبار: ${templateName}`);
        const result = await DatabaseEmailService.testEmailTemplate(templateName, testEmail, 'ar');
        
        if (result.success) {
          console.log(`✅ ${templateName}: نجح`);
        } else {
          console.log(`❌ ${templateName}: فشل - ${result.error}`);
        }
      } catch (error) {
        console.log(`❌ ${templateName}: خطأ - ${error}`);
      }
    }
  }

  /**
   * اختبار القوالب الاجتماعية
   */
  private static async testSocialTemplates(testEmail: string): Promise<void> {
    const socialTemplates = [
      'like_notification',
      'profile_view_notification',
      'message_notification',
      'match_notification'
    ];

    for (const templateName of socialTemplates) {
      try {
        console.log(`🧪 اختبار: ${templateName}`);
        const result = await DatabaseEmailService.testEmailTemplate(templateName, testEmail, 'ar');
        
        if (result.success) {
          console.log(`✅ ${templateName}: نجح`);
        } else {
          console.log(`❌ ${templateName}: فشل - ${result.error}`);
        }
      } catch (error) {
        console.log(`❌ ${templateName}: خطأ - ${error}`);
      }
    }
  }

  /**
   * اختبار القوالب الإدارية
   */
  private static async testAdminTemplates(testEmail: string): Promise<void> {
    const adminTemplates = [
      'report_received_notification',
      'report_accepted_notification',
      'report_rejected_notification',
      'verification_approved_notification',
      'verification_rejected_notification',
      'user_ban_notification'
    ];

    for (const templateName of adminTemplates) {
      try {
        console.log(`🧪 اختبار: ${templateName}`);
        const result = await DatabaseEmailService.testEmailTemplate(templateName, testEmail, 'ar');
        
        if (result.success) {
          console.log(`✅ ${templateName}: نجح`);
        } else {
          console.log(`❌ ${templateName}: فشل - ${result.error}`);
        }
      } catch (error) {
        console.log(`❌ ${templateName}: خطأ - ${error}`);
      }
    }
  }

  /**
   * اختبار القوالب الأمنية
   */
  private static async testSecurityTemplates(testEmail: string): Promise<void> {
    const securityTemplates = [
      'login_success_notification',
      'login_failed_notification',
      'two_factor_failure_notification',
      'two_factor_disable_notification'
    ];

    for (const templateName of securityTemplates) {
      try {
        console.log(`🧪 اختبار: ${templateName}`);
        const result = await DatabaseEmailService.testEmailTemplate(templateName, testEmail, 'ar');
        
        if (result.success) {
          console.log(`✅ ${templateName}: نجح`);
        } else {
          console.log(`❌ ${templateName}: فشل - ${result.error}`);
        }
      } catch (error) {
        console.log(`❌ ${templateName}: خطأ - ${error}`);
      }
    }
  }

  /**
   * اختبار النظام المدمج
   */
  private static async testIntegratedSystem(testEmail: string): Promise<void> {
    try {
      console.log('🧪 اختبار النظام المدمج...');
      
      // اختبار إرسال إيميل تحقق
      const verificationResult = await IntegratedEmailService.sendVerificationEmail(
        testEmail,
        'https://rezge.com/verify/test123',
        'أحمد',
        'محمد',
        'ar'
      );

      if (verificationResult.success) {
        console.log('✅ إيميل التحقق: نجح');
      } else {
        console.log(`❌ إيميل التحقق: فشل - ${verificationResult.error}`);
      }

      // اختبار إرسال إيميل ترحيب
      const welcomeResult = await IntegratedEmailService.sendWelcomeEmail(
        testEmail,
        'مستخدم تجريبي',
        'ar'
      );

      if (welcomeResult.success) {
        console.log('✅ إيميل الترحيب: نجح');
      } else {
        console.log(`❌ إيميل الترحيب: فشل - ${welcomeResult.error}`);
      }

      // اختبار إرسال إشعار إعجاب
      const likeResult = await IntegratedEmailService.sendLikeNotification(
        testEmail,
        'مستخدم تجريبي',
        'سارة أحمد',
        'الرياض',
        25,
        'ar'
      );

      if (likeResult.success) {
        console.log('✅ إشعار الإعجاب: نجح');
      } else {
        console.log(`❌ إشعار الإعجاب: فشل - ${likeResult.error}`);
      }

    } catch (error) {
      console.error('❌ خطأ في اختبار النظام المدمج:', error);
    }
  }

  /**
   * عرض الإحصائيات النهائية
   */
  private static async showFinalStats(): Promise<void> {
    try {
      const stats = await IntegratedEmailService.getSystemStats();
      
      console.log('📊 إحصائيات النظام المدمج:');
      console.log(`📧 إجمالي الإيميلات المرسلة: ${stats.databaseStats.totalSent}`);
      console.log(`❌ إجمالي الإيميلات الفاشلة: ${stats.databaseStats.totalFailed}`);
      console.log(`📈 معدل النجاح: ${stats.databaseStats.successRate}%`);
      console.log(`📅 الإرسالات اليومية: ${stats.databaseStats.dailySends}`);
      console.log(`📋 عدد القوالب: ${stats.templatesCount}`);
      console.log(`🔔 عدد أنواع الإشعارات: ${stats.notificationTypesCount}`);

    } catch (error) {
      console.error('❌ خطأ في جلب الإحصائيات:', error);
    }
  }

  /**
   * اختبار سريع للنظام
   */
  static async quickTest(testEmail: string = 'kemooamegoo@gmail.com'): Promise<boolean> {
    try {
      console.log('🚀 اختبار سريع للنظام المدمج...');
      
      const result = await IntegratedEmailService.testIntegratedSystem(testEmail);
      
      if (result.success) {
        console.log('✅ الاختبار السريع نجح!');
        return true;
      } else {
        console.log('❌ الاختبار السريع فشل');
        return false;
      }

    } catch (error) {
      console.error('❌ خطأ في الاختبار السريع:', error);
      return false;
    }
  }
}

// تصدير للاستخدام المباشر
export default TestIntegratedEmailSystem;







