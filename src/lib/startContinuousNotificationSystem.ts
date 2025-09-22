/**
 * بدء تشغيل نظام الإشعارات البريدية المستمر 24/7
 * Start Continuous 24/7 Notification Email System
 * رزقي - منصة الزواج الإسلامي الشرعي
 */

import { continuousNotificationWatcher } from './continuousNotificationWatcher';

export interface SystemConfig {
  checkInterval: number; // بالثواني
  maxRetries: number;
  retryDelay: number; // بالثواني
  healthCheckInterval: number; // بالثواني
  autoRestart: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * بدء تشغيل النظام المستمر
 */
export async function startContinuousNotificationSystem(config?: Partial<SystemConfig>): Promise<void> {
  try {
    console.log('🚀 بدء تشغيل نظام الإشعارات البريدية المستمر 24/7...');
    
    // إعدادات افتراضية محسنة للنظام المستمر
    const defaultConfig: SystemConfig = {
      checkInterval: 30, // كل 30 ثانية
      maxRetries: 5, // أقصى 5 أخطاء متتالية
      retryDelay: 60, // انتظار دقيقة واحدة قبل إعادة التشغيل
      healthCheckInterval: 300, // فحص الصحة كل 5 دقائق
      autoRestart: true, // إعادة التشغيل التلقائي
      logLevel: 'info' // مستوى التسجيل
    };

    const finalConfig = { ...defaultConfig, ...config };

    // تحديث إعدادات المراقب
    continuousNotificationWatcher.updateConfig(finalConfig);

    // بدء المراقبة المستمرة
    await continuousNotificationWatcher.startContinuousWatching();
    
    console.log('✅ تم تشغيل النظام المستمر بنجاح!');
    console.log('📧 النظام سيعمل 24/7 مع الميزات التالية:');
    console.log(`   • 🔄 فحص كل ${finalConfig.checkInterval} ثانية`);
    console.log(`   • 🔁 إعادة تشغيل تلقائي بعد ${finalConfig.maxRetries} أخطاء`);
    console.log(`   • ⏱️ انتظار ${finalConfig.retryDelay} ثانية قبل إعادة التشغيل`);
    console.log(`   • 🏥 فحص الصحة كل ${finalConfig.healthCheckInterval} ثانية`);
    console.log(`   • 📝 مستوى التسجيل: ${finalConfig.logLevel}`);
    console.log('🔔 أنواع الإشعارات المدعومة:');
    console.log('   • 👁️ مشاهدة الملف الشخصي');
    console.log('   • 💖 الإعجاب');
    console.log('   • 📨 الرسائل الجديدة');
    console.log('   • ✨ المطابقات الجديدة');
    console.log('   • ⚠️ البلاغات');
    console.log('   • ✅ حالة التوثيق');
    console.log('   • 📢 التنبيهات الإدارية');
    
  } catch (error) {
    console.error('❌ خطأ في تشغيل النظام المستمر:', error);
    throw error;
  }
}

/**
 * إيقاف النظام المستمر
 */
export function stopContinuousNotificationSystem(): void {
  try {
    console.log('🛑 إيقاف نظام الإشعارات البريدية المستمر...');
    
    continuousNotificationWatcher.stopContinuousWatching();
    
    console.log('✅ تم إيقاف النظام المستمر بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في إيقاف النظام المستمر:', error);
  }
}

/**
 * الحصول على حالة النظام المستمر
 */
export function getContinuousSystemStatus() {
  return continuousNotificationWatcher.getHealthStatus();
}

/**
 * إعادة تعيين النظام المستمر
 */
export function resetContinuousSystem(): void {
  try {
    console.log('🔄 إعادة تعيين نظام الإشعارات البريدية المستمر...');
    
    continuousNotificationWatcher.reset();
    
    console.log('✅ تم إعادة تعيين النظام المستمر بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين النظام المستمر:', error);
  }
}

/**
 * تحديث إعدادات النظام المستمر
 */
export function updateContinuousSystemConfig(config: Partial<SystemConfig>): void {
  try {
    console.log('⚙️ تحديث إعدادات النظام المستمر...');
    
    continuousNotificationWatcher.updateConfig(config);
    
    console.log('✅ تم تحديث إعدادات النظام المستمر بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في تحديث إعدادات النظام المستمر:', error);
  }
}

/**
 * بدء النظام مع إعدادات محسنة للإنتاج
 */
export async function startProductionSystem(): Promise<void> {
  const productionConfig: SystemConfig = {
    checkInterval: 30, // كل 30 ثانية
    maxRetries: 10, // أقصى 10 أخطاء متتالية
    retryDelay: 120, // انتظار دقيقتين قبل إعادة التشغيل
    healthCheckInterval: 600, // فحص الصحة كل 10 دقائق
    autoRestart: true,
    logLevel: 'info'
  };

  await startContinuousNotificationSystem(productionConfig);
}

/**
 * بدء النظام مع إعدادات محسنة للتطوير
 */
export async function startDevelopmentSystem(): Promise<void> {
  const developmentConfig: SystemConfig = {
    checkInterval: 60, // كل دقيقة
    maxRetries: 3, // أقصى 3 أخطاء متتالية
    retryDelay: 30, // انتظار 30 ثانية قبل إعادة التشغيل
    healthCheckInterval: 180, // فحص الصحة كل 3 دقائق
    autoRestart: true,
    logLevel: 'debug'
  };

  await startContinuousNotificationSystem(developmentConfig);
}

/**
 * بدء النظام مع إعدادات محسنة للاختبار
 */
export async function startTestSystem(): Promise<void> {
  const testConfig: SystemConfig = {
    checkInterval: 10, // كل 10 ثوان
    maxRetries: 2, // أقصى 2 خطأ متتالي
    retryDelay: 15, // انتظار 15 ثانية قبل إعادة التشغيل
    healthCheckInterval: 60, // فحص الصحة كل دقيقة
    autoRestart: false, // لا إعادة تشغيل تلقائي في الاختبار
    logLevel: 'debug'
  };

  await startContinuousNotificationSystem(testConfig);
}

/**
 * عرض إحصائيات النظام
 */
export function displaySystemStats(): void {
  const status = getContinuousSystemStatus();
  
  console.log('\n📊 إحصائيات نظام الإشعارات البريدية المستمر:');
  console.log('================================================');
  console.log(`🟢 الحالة: ${status.isRunning ? 'يعمل' : 'متوقف'}`);
  console.log(`⏰ وقت البدء: ${new Date(status.startTime).toLocaleString('ar-SA')}`);
  console.log(`🔄 آخر فحص: ${new Date(status.lastCheck).toLocaleString('ar-SA')}`);
  console.log(`📈 إجمالي الفحوصات: ${status.totalChecks}`);
  console.log(`✅ فحوصات ناجحة: ${status.successfulChecks}`);
  console.log(`❌ فحوصات فاشلة: ${status.failedChecks}`);
  console.log(`📧 إشعارات معالجة: ${status.notificationsProcessed}`);
  console.log(`📢 تنبيهات معالجة: ${status.alertsProcessed}`);
  console.log(`🔴 أخطاء متتالية: ${status.consecutiveFailures}`);
  console.log(`⏱️ وقت التشغيل: ${Math.floor(status.uptime / 3600)}س ${Math.floor((status.uptime % 3600) / 60)}د`);
  console.log(`💾 استخدام الذاكرة: ${status.memoryUsage}MB`);
  
  if (status.errorHistory.length > 0) {
    console.log('\n❌ آخر الأخطاء:');
    status.errorHistory.slice(-3).forEach((error, index) => {
      console.log(`   ${index + 1}. ${new Date(error.timestamp).toLocaleString('ar-SA')}: ${error.error}`);
    });
  }
  
  console.log('================================================\n');
}

// تصدير الدوال للاستخدام في التطبيق
export {
  continuousNotificationWatcher
};

// بدء النظام تلقائياً إذا كان في بيئة الإنتاج
if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  startProductionSystem().catch(error => {
    console.error('❌ فشل في بدء النظام المستمر في الإنتاج:', error);
  });
}











