// SMTP URL Helper - رزقي
// مساعد عنوان خادم SMTP

/**
 * الحصول على عنوان خادم SMTP الصحيح حسب البيئة
 */
export function getSMTPUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://148.230.112.17:3001/send-email';
  }

  const hostname = window.location.hostname;
  
  // إذا كان localhost أو VPS IP
  if (hostname.includes('localhost') || hostname.includes('148.230.112.17')) {
    return 'http://148.230.112.17:3001/send-email';
  }
  
  // للإنتاج
  return 'http://148.230.112.17:3001/send-email';
}

/**
 * الحصول على عنوان خادم SMTP للاستخدام في fetch
 */
export function getSMTPFetchUrl(): string {
  return getSMTPUrl();
}
