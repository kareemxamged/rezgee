// سكريبت لحذف حدود الطلبات اليومية للمستخدم
// يمكن تشغيله من الكونسول في المتصفح

// نسخ هذا الكود وتشغيله في كونسول المتصفح (F12)
async function resetRateLimitForUser() {
  try {
    console.log('🚀 بدء عملية حذف حدود الطلبات اليومية...');
    
    // استيراد الخدمة (يجب أن تكون متاحة في السياق)
    const { ContactUpdateRateLimitService } = await import('./src/lib/contactUpdateRateLimit.ts');
    
    // حذف حدود الطلبات للمستخدم
    const result = await ContactUpdateRateLimitService.resetDailyLimitForUser('kemooamegoo@gmail.com');
    
    if (result.success) {
      console.log('✅ نجحت العملية:', result.message);
      alert('✅ تم حذف حدود الطلبات اليومية بنجاح!\nيمكنك الآن المحاولة مرة أخرى.');
    } else {
      console.error('❌ فشلت العملية:', result.message);
      alert('❌ فشل في حذف حدود الطلبات:\n' + result.message);
    }
    
  } catch (error) {
    console.error('💥 خطأ في تشغيل السكريبت:', error);
    alert('💥 خطأ في تشغيل السكريبت:\n' + error.message);
  }
}

// تشغيل الدالة
resetRateLimitForUser();

console.log(`
📋 تعليمات الاستخدام:
1. افتح كونسول المتصفح (F12)
2. انسخ والصق هذا الكود
3. اضغط Enter
4. انتظر رسالة النجاح
5. أعد تحميل الصفحة وجرب مرة أخرى
`);
