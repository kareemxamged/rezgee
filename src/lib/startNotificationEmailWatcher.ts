/**
 * بدء تشغيل مراقب الإشعارات البريدية التلقائية
 * Start Automatic Notification Email Watcher
 * رزقي - منصة الزواج الإسلامي الشرعي
 */

import { notificationEmailWatcher } from './notificationEmailWatcher';

/**
 * بدء تشغيل مراقب الإشعارات البريدية
 */
export function startNotificationEmailWatcher(): void {
  try {
    console.log('🚀 بدء تشغيل مراقب الإشعارات البريدية التلقائية...');
    
    // بدء المراقبة
    notificationEmailWatcher.startWatching();
    
    console.log('✅ تم تشغيل مراقب الإشعارات البريدية بنجاح!');
    console.log('📧 سيتم مراقبة الإشعارات الجديدة كل 30 ثانية');
    console.log('🔔 أنواع الإشعارات المدعومة:');
    console.log('   • 👁️ مشاهدة الملف الشخصي');
    console.log('   • 💖 الإعجاب');
    console.log('   • 📨 الرسائل الجديدة');
    console.log('   • ✨ المطابقات الجديدة');
    console.log('   • ⚠️ البلاغات');
    console.log('   • ✅ حالة التوثيق');
    console.log('   • 📢 التنبيهات الإدارية');
    
  } catch (error) {
    console.error('❌ خطأ في تشغيل مراقب الإشعارات البريدية:', error);
  }
}

/**
 * إيقاف مراقب الإشعارات البريدية
 */
export function stopNotificationEmailWatcher(): void {
  try {
    console.log('🛑 إيقاف مراقب الإشعارات البريدية...');
    
    notificationEmailWatcher.stopWatching();
    
    console.log('✅ تم إيقاف مراقب الإشعارات البريدية بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في إيقاف مراقب الإشعارات البريدية:', error);
  }
}

/**
 * الحصول على حالة مراقب الإشعارات البريدية
 */
export function getNotificationEmailWatcherStatus() {
  return notificationEmailWatcher.getStatus();
}

/**
 * إعادة تعيين مراقب الإشعارات البريدية
 */
export function resetNotificationEmailWatcher(): void {
  try {
    console.log('🔄 إعادة تعيين مراقب الإشعارات البريدية...');
    
    notificationEmailWatcher.reset();
    
    console.log('✅ تم إعادة تعيين مراقب الإشعارات البريدية بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين مراقب الإشعارات البريدية:', error);
  }
}

// تصدير الدوال للاستخدام في التطبيق
export {
  notificationEmailWatcher
};













