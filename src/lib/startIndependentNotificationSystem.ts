/**
 * بدء تشغيل نظام الإشعارات البريدية المستقل
 * Start Independent Notification Email System
 * رزقي - منصة الزواج الإسلامي الشرعي
 */

import { independentNotificationMonitor } from './independentNotificationMonitor';

export interface IndependentSystemConfig {
  checkInterval: number; // بالثواني
  maxRetries: number;
  retryDelay: number; // بالثواني
  batchSize: number; // عدد الإشعارات المعالجة في كل مرة
  enableEmailTracking: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * بدء تشغيل النظام المستقل
 */
export async function startIndependentNotificationSystem(config?: Partial<IndependentSystemConfig>): Promise<void> {
  try {
    console.log('🚀 بدء تشغيل نظام الإشعارات البريدية المستقل...');
    
    // إعدادات افتراضية محسنة للنظام المستقل
    const defaultConfig: IndependentSystemConfig = {
      checkInterval: 15, // كل 15 ثانية
      maxRetries: 3, // أقصى 3 أخطاء متتالية
      retryDelay: 30, // انتظار 30 ثانية
      batchSize: 10, // معالجة 10 إشعارات في كل مرة
      enableEmailTracking: true, // تتبع حالة الإرسال البريدي
      logLevel: 'info' // مستوى التسجيل
    };

    const finalConfig = { ...defaultConfig, ...config };

    // تحديث إعدادات المراقب المستقل
    independentNotificationMonitor.updateConfig(finalConfig);

    // بدء المراقبة المستقلة
    await independentNotificationMonitor.startIndependentMonitoring();
    
    console.log('✅ تم تشغيل النظام المستقل بنجاح!');
    console.log('📧 النظام سيعمل 24/7 لجميع المستخدمين مع الميزات التالية:');
    console.log(`   • 🔄 فحص كل ${finalConfig.checkInterval} ثانية`);
    console.log(`   • 📦 معالجة ${finalConfig.batchSize} إشعار في كل مرة`);
    console.log(`   • 🔁 أقصى ${finalConfig.maxRetries} محاولات`);
    console.log(`   • ⏱️ انتظار ${finalConfig.retryDelay} ثانية بين المحاولات`);
    console.log(`   • 📊 تتبع الإرسال: ${finalConfig.enableEmailTracking ? 'مفعل' : 'معطل'}`);
    console.log(`   • 📝 مستوى التسجيل: ${finalConfig.logLevel}`);
    console.log('🔔 أنواع الإشعارات المدعومة:');
    console.log('   • 👁️ مشاهدة الملف الشخصي');
    console.log('   • 💖 الإعجاب');
    console.log('   • 📨 الرسائل الجديدة');
    console.log('   • ✨ المطابقات الجديدة');
    console.log('   • ⚠️ البلاغات');
    console.log('   • ✅ حالة التوثيق');
    console.log('   • 📢 التنبيهات الإدارية');
    console.log('🎯 الميزات الجديدة:');
    console.log('   • 🔄 يعمل بدون تسجيل دخول');
    console.log('   • 📊 تتبع حالة الإرسال البريدي');
    console.log('   • 🔁 إعادة المحاولة التلقائية');
    console.log('   • 📈 إحصائيات مفصلة');
    
  } catch (error) {
    console.error('❌ خطأ في تشغيل النظام المستقل:', error);
    throw error;
  }
}

/**
 * إيقاف النظام المستقل
 */
export function stopIndependentNotificationSystem(): void {
  try {
    console.log('🛑 إيقاف نظام الإشعارات البريدية المستقل...');
    
    independentNotificationMonitor.stopIndependentMonitoring();
    
    console.log('✅ تم إيقاف النظام المستقل بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في إيقاف النظام المستقل:', error);
  }
}

/**
 * الحصول على حالة النظام المستقل
 */
export function getIndependentSystemStatus() {
  return independentNotificationMonitor.getStats();
}

/**
 * إعادة تعيين النظام المستقل
 */
export function resetIndependentSystem(): void {
  try {
    console.log('🔄 إعادة تعيين نظام الإشعارات البريدية المستقل...');
    
    independentNotificationMonitor.resetStats();
    
    console.log('✅ تم إعادة تعيين النظام المستقل بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين النظام المستقل:', error);
  }
}

/**
 * تحديث إعدادات النظام المستقل
 */
export function updateIndependentSystemConfig(config: Partial<IndependentSystemConfig>): void {
  try {
    console.log('⚙️ تحديث إعدادات النظام المستقل...');
    
    independentNotificationMonitor.updateConfig(config);
    
    console.log('✅ تم تحديث إعدادات النظام المستقل بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في تحديث إعدادات النظام المستقل:', error);
  }
}

/**
 * بدء النظام مع إعدادات محسنة للإنتاج
 */
export async function startProductionIndependentSystem(): Promise<void> {
  const productionConfig: IndependentSystemConfig = {
    checkInterval: 10, // كل 10 ثوان
    maxRetries: 5, // أقصى 5 أخطاء متتالية
    retryDelay: 60, // انتظار دقيقة واحدة
    batchSize: 20, // معالجة 20 إشعار في كل مرة
    enableEmailTracking: true,
    logLevel: 'info'
  };

  await startIndependentNotificationSystem(productionConfig);
}

/**
 * بدء النظام مع إعدادات محسنة للتطوير
 */
export async function startDevelopmentIndependentSystem(): Promise<void> {
  const developmentConfig: IndependentSystemConfig = {
    checkInterval: 30, // كل 30 ثانية
    maxRetries: 3, // أقصى 3 أخطاء متتالية
    retryDelay: 30, // انتظار 30 ثانية
    batchSize: 5, // معالجة 5 إشعارات في كل مرة
    enableEmailTracking: true,
    logLevel: 'debug'
  };

  await startIndependentNotificationSystem(developmentConfig);
}

/**
 * بدء النظام مع إعدادات محسنة للاختبار
 */
export async function startTestIndependentSystem(): Promise<void> {
  const testConfig: IndependentSystemConfig = {
    checkInterval: 5, // كل 5 ثوان
    maxRetries: 2, // أقصى 2 خطأ متتالي
    retryDelay: 15, // انتظار 15 ثانية
    batchSize: 3, // معالجة 3 إشعارات في كل مرة
    enableEmailTracking: true,
    logLevel: 'debug'
  };

  await startIndependentNotificationSystem(testConfig);
}

/**
 * عرض إحصائيات النظام المستقل
 */
export function displayIndependentSystemStats(): void {
  const stats = getIndependentSystemStatus();
  
  console.log('\n📊 إحصائيات نظام الإشعارات البريدية المستقل:');
  console.log('================================================');
  console.log(`🟢 الحالة: ${stats.isRunning ? 'يعمل' : 'متوقف'}`);
  console.log(`⏰ وقت البدء: ${new Date(stats.startTime).toLocaleString('ar-SA')}`);
  console.log(`⏱️ وقت التشغيل: ${Math.floor(stats.uptime / 3600)}س ${Math.floor((stats.uptime % 3600) / 60)}د`);
  console.log(`📧 إشعارات معالجة: ${stats.processedCount}`);
  console.log(`✅ إشعارات مرسلة: ${stats.sentCount}`);
  console.log(`❌ إشعارات فاشلة: ${stats.failedCount}`);
  console.log(`📈 معدل النجاح: ${stats.successRate}%`);
  console.log('================================================\n');
}

/**
 * الحصول على إحصائيات قاعدة البيانات
 */
export async function getDatabaseStats(): Promise<any> {
  try {
    const { supabase } = await import('./supabase');
    
    const { data, error } = await supabase.rpc('get_notification_email_stats');
    
    if (error) {
      throw new Error(`خطأ في جلب إحصائيات قاعدة البيانات: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('❌ خطأ في جلب إحصائيات قاعدة البيانات:', error);
    return null;
  }
}

/**
 * الحصول على الإشعارات غير المعالجة
 */
export async function getUnprocessedNotifications(): Promise<any[]> {
  try {
    const { supabase } = await import('./supabase');
    
    const { data, error } = await supabase.rpc('get_unprocessed_notifications');
    
    if (error) {
      throw new Error(`خطأ في جلب الإشعارات غير المعالجة: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('❌ خطأ في جلب الإشعارات غير المعالجة:', error);
    return [];
  }
}

/**
 * تنظيف السجلات القديمة
 */
export async function cleanupOldRecords(): Promise<number> {
  try {
    const { supabase } = await import('./supabase');
    
    const { data, error } = await supabase.rpc('cleanup_old_notification_tracking');
    
    if (error) {
      throw new Error(`خطأ في تنظيف السجلات القديمة: ${error.message}`);
    }
    
    console.log(`✅ تم حذف ${data} سجل قديم`);
    return data;
  } catch (error) {
    console.error('❌ خطأ في تنظيف السجلات القديمة:', error);
    return 0;
  }
}

// تصدير الدوال للاستخدام في التطبيق
export {
  independentNotificationMonitor
};

// بدء النظام تلقائياً إذا كان في بيئة الإنتاج
if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  startProductionIndependentSystem().catch(error => {
    console.error('❌ فشل في بدء النظام المستقل في الإنتاج:', error);
  });
}











