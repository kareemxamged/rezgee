/**
 * بدء تشغيل نظام الإشعارات البريدية للخادم
 * Start Server Notification Email System
 * رزقي - منصة الزواج الإسلامي الشرعي
 * 
 * هذا النظام يعمل في الخادم ويراقب إشعارات جميع المستخدمين
 */

import { serverNotificationMonitor } from './serverNotificationMonitor';

export interface ServerSystemConfig {
  checkInterval: number; // بالثواني
  maxRetries: number;
  retryDelay: number; // بالثواني
  batchSize: number; // عدد الإشعارات المعالجة في كل مرة
  enableEmailTracking: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * بدء تشغيل النظام للخادم
 */
export async function startServerNotificationSystem(config?: Partial<ServerSystemConfig>): Promise<void> {
  try {
    console.log('🚀 بدء تشغيل نظام الإشعارات البريدية للخادم...');
    
    // إعدادات افتراضية محسنة للنظام الخادم
    const defaultConfig: ServerSystemConfig = {
      checkInterval: 10, // كل 10 ثوان
      maxRetries: 3, // أقصى 3 أخطاء متتالية
      retryDelay: 30, // انتظار 30 ثانية
      batchSize: 20, // معالجة 20 إشعار في كل مرة
      enableEmailTracking: true, // تتبع حالة الإرسال البريدي
      logLevel: 'info' // مستوى التسجيل
    };

    const finalConfig = { ...defaultConfig, ...config };

    // تحديث إعدادات المراقب الخادم
    serverNotificationMonitor.updateConfig(finalConfig);

    // بدء المراقبة المستقلة
    await serverNotificationMonitor.startServerMonitoring();
    
    console.log('✅ تم تشغيل النظام للخادم بنجاح!');
    console.log('🌍 النظام سيعمل 24/7 لجميع المستخدمين مع الميزات التالية:');
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
    console.log('   • 🌍 يعمل لجميع المستخدمين في المنصة');
    console.log('   • 🔄 يعمل بدون تسجيل دخول');
    console.log('   • 📊 تتبع حالة الإرسال البريدي');
    console.log('   • 🔁 إعادة المحاولة التلقائية');
    console.log('   • 📈 إحصائيات مفصلة');
    
  } catch (error) {
    console.error('❌ خطأ في تشغيل النظام للخادم:', error);
    throw error;
  }
}

/**
 * إيقاف النظام للخادم
 */
export function stopServerNotificationSystem(): void {
  try {
    console.log('🛑 إيقاف نظام الإشعارات البريدية للخادم...');
    
    serverNotificationMonitor.stopServerMonitoring();
    
    console.log('✅ تم إيقاف النظام للخادم بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في إيقاف النظام للخادم:', error);
  }
}

/**
 * الحصول على حالة النظام للخادم
 */
export function getServerSystemStatus() {
  return serverNotificationMonitor.getStats();
}

/**
 * إعادة تعيين النظام للخادم
 */
export function resetServerSystem(): void {
  try {
    console.log('🔄 إعادة تعيين نظام الإشعارات البريدية للخادم...');
    
    serverNotificationMonitor.resetStats();
    
    console.log('✅ تم إعادة تعيين النظام للخادم بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين النظام للخادم:', error);
  }
}

/**
 * تحديث إعدادات النظام للخادم
 */
export function updateServerSystemConfig(config: Partial<ServerSystemConfig>): void {
  try {
    console.log('⚙️ تحديث إعدادات النظام للخادم...');
    
    serverNotificationMonitor.updateConfig(config);
    
    console.log('✅ تم تحديث إعدادات النظام للخادم بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في تحديث إعدادات النظام للخادم:', error);
  }
}

/**
 * بدء النظام مع إعدادات محسنة للإنتاج
 */
export async function startProductionServerSystem(): Promise<void> {
  const productionConfig: ServerSystemConfig = {
    checkInterval: 5, // كل 5 ثوان
    maxRetries: 5, // أقصى 5 أخطاء متتالية
    retryDelay: 60, // انتظار دقيقة واحدة
    batchSize: 50, // معالجة 50 إشعار في كل مرة
    enableEmailTracking: true,
    logLevel: 'info'
  };

  await startServerNotificationSystem(productionConfig);
}

/**
 * بدء النظام مع إعدادات محسنة للتطوير
 */
export async function startDevelopmentServerSystem(): Promise<void> {
  const developmentConfig: ServerSystemConfig = {
    checkInterval: 15, // كل 15 ثانية
    maxRetries: 3, // أقصى 3 أخطاء متتالية
    retryDelay: 30, // انتظار 30 ثانية
    batchSize: 10, // معالجة 10 إشعارات في كل مرة
    enableEmailTracking: true,
    logLevel: 'debug'
  };

  await startServerNotificationSystem(developmentConfig);
}

/**
 * بدء النظام مع إعدادات محسنة للاختبار
 */
export async function startTestServerSystem(): Promise<void> {
  const testConfig: ServerSystemConfig = {
    checkInterval: 5, // كل 5 ثوان
    maxRetries: 2, // أقصى 2 خطأ متتالي
    retryDelay: 15, // انتظار 15 ثانية
    batchSize: 5, // معالجة 5 إشعارات في كل مرة
    enableEmailTracking: true,
    logLevel: 'debug'
  };

  await startServerNotificationSystem(testConfig);
}

/**
 * عرض إحصائيات النظام للخادم
 */
export function displayServerSystemStats(): void {
  const stats = getServerSystemStatus();
  
  console.log('\n📊 إحصائيات نظام الإشعارات البريدية للخادم:');
  console.log('================================================');
  console.log(`🟢 الحالة: ${stats.isRunning ? 'يعمل' : 'متوقف'}`);
  console.log(`⏰ وقت البدء: ${new Date(stats.startTime).toLocaleString('ar-SA')}`);
  console.log(`⏱️ وقت التشغيل: ${Math.floor(stats.uptime / 3600)}س ${Math.floor((stats.uptime % 3600) / 60)}د`);
  console.log(`📧 إشعارات معالجة: ${stats.processedCount}`);
  console.log(`✅ إشعارات مرسلة: ${stats.sentCount}`);
  console.log(`❌ إشعارات فاشلة: ${stats.failedCount}`);
  console.log(`📈 معدل النجاح: ${stats.successRate}%`);
  console.log(`🕐 آخر فحص: ${new Date(stats.lastCheckTime).toLocaleString('ar-SA')}`);
  console.log('================================================\n');
}

/**
 * الحصول على إحصائيات قاعدة البيانات
 */
export async function getServerDatabaseStats(): Promise<any> {
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
export async function getServerUnprocessedNotifications(): Promise<any[]> {
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
export async function cleanupServerOldRecords(): Promise<number> {
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
  serverNotificationMonitor
};

// بدء النظام تلقائياً إذا كان في بيئة الإنتاج
if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  startProductionServerSystem().catch(error => {
    console.error('❌ فشل في بدء النظام للخادم في الإنتاج:', error);
  });
}










