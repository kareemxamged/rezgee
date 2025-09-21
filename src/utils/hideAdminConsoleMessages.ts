// خدمة إخفاء رسائل الكونسول الخاصة بلوحة الإدارة
// Hide Admin Console Messages Service

/**
 * التحقق من أن المستخدم في لوحة الإدارة
 */
function isInAdminPanel(): boolean {
  return window.location.pathname.startsWith('/admin');
}

/**
 * التحقق من أن المستخدم هو مدير
 */
function isAdminUser(): boolean {
  // التحقق من وجود بيانات المدير في localStorage
  const adminData = localStorage.getItem('adminData');
  const adminSession = localStorage.getItem('adminSession');
  
  return !!(adminData || adminSession);
}

/**
 * التحقق من أن الرسالة خاصة بلوحة الإدارة
 */
function isAdminMessage(message: string): boolean {
  const adminKeywords = [
    'admin',
    'مدير',
    'إدارة',
    'لوحة',
    'dashboard',
    'permission',
    'صلاحية',
    'role',
    'دور',
    'auth',
    'مصادقة',
    'login',
    'تسجيل',
    'session',
    'جلسة',
    'newsletter',
    'نشرة',
    'campaign',
    'حملة',
    'verification',
    'توثيق',
    'request',
    'طلب',
    'approve',
    'قبول',
    'reject',
    'رفض',
    'review',
    'مراجعة'
  ];

  const lowerMessage = message.toLowerCase();
  return adminKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
}

/**
 * إخفاء رسائل الكونسول الخاصة بلوحة الإدارة في المنصة العامة
 */
function hideAdminConsoleMessages(): void {
  // حفظ الوظائف الأصلية
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;
  const originalDebug = console.debug;

  // دالة للتحقق من إخفاء الرسالة
  const shouldHideMessage = (message: string): boolean => {
    // إذا كان المستخدم في لوحة الإدارة، اعرض جميع الرسائل
    if (isInAdminPanel()) {
      return false;
    }

    // إذا كان المستخدم مدير، اعرض جميع الرسائل
    if (isAdminUser()) {
      return false;
    }

    // إذا كانت الرسالة خاصة بلوحة الإدارة، أخفيها
    return isAdminMessage(message);
  };

  // دالة معالجة الرسائل
  const processMessage = (originalMethod: Function, args: any[]): void => {
    const message = args.join(' ');
    
    if (shouldHideMessage(message)) {
      // إخفاء الرسالة
      return;
    }

    // عرض الرسالة العادية
    originalMethod.apply(console, args);
  };

  // استبدال وظائف الكونسول
  console.log = (...args: any[]) => {
    processMessage(originalLog, args);
  };

  console.error = (...args: any[]) => {
    processMessage(originalError, args);
  };

  console.warn = (...args: any[]) => {
    processMessage(originalWarn, args);
  };

  console.info = (...args: any[]) => {
    processMessage(originalInfo, args);
  };

  console.debug = (...args: any[]) => {
    processMessage(originalDebug, args);
  };

  console.log('✅ تم تفعيل فلتر رسائل الكونسول الخاصة بلوحة الإدارة');
}

/**
 * إعداد فلتر رسائل الكونسول الخاصة بلوحة الإدارة
 */
export function setupAdminConsoleFilter(): void {
  try {
    // التأكد من أن الكود يعمل في بيئة المتصفح
    if (typeof window !== 'undefined') {
      hideAdminConsoleMessages();
    }
  } catch (error) {
    console.error('❌ خطأ في إعداد فلتر رسائل الكونسول:', error);
  }
}

/**
 * إعادة تعيين فلتر رسائل الكونسول (للتطوير فقط)
 */
export function resetAdminConsoleFilter(): void {
  try {
    // إعادة تحميل الصفحة لإعادة تعيين الكونسول
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين فلتر رسائل الكونسول:', error);
  }
}

/**
 * التحقق من حالة الفلتر
 */
export function getAdminConsoleFilterStatus(): {
  isActive: boolean;
  isInAdminPanel: boolean;
  isAdminUser: boolean;
} {
  return {
    isActive: true,
    isInAdminPanel: isInAdminPanel(),
    isAdminUser: isAdminUser()
  };
}

// تصدير الوظائف المساعدة للاستخدام الخارجي
export {
  isInAdminPanel,
  isAdminUser,
  isAdminMessage
};


