// ===============================================
// Google Tag Manager Utilities
// ===============================================

// تعريف DataLayer
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// تهيئة DataLayer
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

/**
 * إرسال حدث إلى Google Tag Manager
 */
export const gtmPush = (event: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
    console.log('📊 GTM Event:', event);
  }
};

/**
 * تتبع تسجيل الدخول
 */
export const trackLogin = (method: string = 'email', userType: string = 'regular') => {
  gtmPush({
    event: 'login',
    method,
    user_type: userType,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع التسجيل
 */
export const trackSignUp = (method: string = 'email', userType: string = 'regular') => {
  gtmPush({
    event: 'sign_up',
    method,
    user_type: userType,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع البحث
 */
export const trackSearch = (searchTerm: string, filters?: Record<string, any>, resultsCount?: number) => {
  gtmPush({
    event: 'search',
    search_term: searchTerm,
    search_filters: filters ? JSON.stringify(filters) : null,
    results_count: resultsCount,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع مشاهدة الملف الشخصي
 */
export const trackProfileView = (profileId: string, viewerId?: string, profileType: string = 'public') => {
  gtmPush({
    event: 'view_profile',
    profile_id: profileId,
    viewer_id: viewerId,
    profile_type: profileType,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع إرسال الرسالة
 */
export const trackMessageSent = (messageType: string = 'text', recipientId: string, conversationId?: string) => {
  gtmPush({
    event: 'message_sent',
    message_type: messageType,
    recipient_id: recipientId,
    conversation_id: conversationId,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع الإعجاب
 */
export const trackLike = (profileId: string, likeType: string = 'like', action: string = 'like') => {
  gtmPush({
    event: 'like',
    profile_id: profileId,
    like_type: likeType,
    action,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع تبديل اللغة
 */
export const trackLanguageChange = (fromLanguage: string, toLanguage: string) => {
  gtmPush({
    event: 'language_change',
    from_language: fromLanguage,
    to_language: toLanguage,
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع التحويلات
 */
export const trackConversion = (conversionType: string, value?: number, currency: string = 'USD') => {
  gtmPush({
    event: 'conversion',
    conversion_type: conversionType,
    conversion_value: value,
    currency,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع الأخطاء
 */
export const trackError = (errorType: string, errorMessage: string, errorLocation?: string) => {
  gtmPush({
    event: 'error',
    error_type: errorType,
    error_message: errorMessage,
    error_location: errorLocation,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع الأداء
 */
export const trackPerformance = (metricName: string, value: number, unit: string = 'ms') => {
  gtmPush({
    event: 'performance_metric',
    metric_name: metricName,
    metric_value: value,
    metric_unit: unit,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع التفاعل مع النماذج
 */
export const trackFormInteraction = (formName: string, action: string, formId?: string) => {
  gtmPush({
    event: 'form_interaction',
    form_name: formName,
    form_action: action,
    form_id: formId,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع النقرات
 */
export const trackClick = (elementType: string, elementText?: string, elementUrl?: string) => {
  gtmPush({
    event: 'click',
    element_type: elementType,
    element_text: elementText,
    element_url: elementUrl,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع التمرير
 */
export const trackScroll = (scrollDepth: number, pageUrl: string) => {
  gtmPush({
    event: 'scroll',
    scroll_depth: scrollDepth,
    page_url: pageUrl,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع الوقت على الصفحة
 */
export const trackTimeOnPage = (pageUrl: string, timeSpent: number) => {
  gtmPush({
    event: 'time_on_page',
    page_url: pageUrl,
    time_spent: timeSpent,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * تتبع الأحداث المخصصة
 */
export const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  gtmPush({
    event: eventName,
    ...parameters,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

/**
 * إعداد User ID للتتبع
 */
export const setUserId = (userId: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-7QWP1R3BES', {
      user_id: userId
    });
  }
};

/**
 * إعداد خصائص المستخدم المتقدمة
 */
export const setAdvancedUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', {
      ...properties,
      // إعدادات إضافية
      custom_map: {
        'custom_parameter_1': 'language',
        'custom_parameter_2': 'user_type'
      }
    });
  }
};

/**
 * إعداد Enhanced Ecommerce
 */
export const setupEnhancedEcommerce = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-7QWP1R3BES', {
      enhanced_ecommerce: true,
      send_page_view: true,
      anonymize_ip: true
    });
  }
};

/**
 * إعداد Conversion Tracking
 */
export const setupConversionTracking = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-7QWP1R3BES', {
      conversion_linker: true,
      cookie_flags: 'SameSite=None;Secure',
      cookie_expires: 63072000 // سنتين
    });
  }
};

/**
 * إعداد Privacy Settings
 */
export const setupPrivacySettings = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-7QWP1R3BES', {
      anonymize_ip: true,
      allow_google_signals: true,
      allow_ad_personalization_signals: false,
      cookie_flags: 'SameSite=None;Secure'
    });
  }
};

/**
 * إعداد User Properties
 */
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
};

/**
 * تتبع الصفحة
 */
export const trackPageView = (pageUrl: string, pageTitle: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-7QWP1R3BES', {
      page_location: pageUrl,
      page_title: pageTitle
    });
  }
};

/**
 * مراقبة GTM Events في Console
 */
export const enableGTMDebug = () => {
  if (typeof window !== 'undefined') {
    const originalPush = window.dataLayer.push;
    window.dataLayer.push = function(event: any) {
      console.log('🔍 GTM Debug:', event);
      return originalPush.apply(this, arguments);
    };
    console.log('✅ GTM Debug mode enabled');
  }
};

/**
 * تعطيل GTM Debug
 */
export const disableGTMDebug = () => {
  if (typeof window !== 'undefined') {
    // إعادة تعيين إلى الوضع الطبيعي
    window.dataLayer = window.dataLayer || [];
    console.log('❌ GTM Debug mode disabled');
  }
};

/**
 * فحص حالة GTM
 */
export const checkGTMStatus = () => {
  if (typeof window !== 'undefined') {
    const hasGTM = !!window.dataLayer;
    const hasGTag = !!window.gtag;
    
    console.log('📊 GTM Status:', {
      dataLayer: hasGTM,
      gtag: hasGTag,
      dataLayerLength: window.dataLayer?.length || 0
    });
    
    return {
      hasGTM,
      hasGTag,
      dataLayerLength: window.dataLayer?.length || 0
    };
  }
  
  return {
    hasGTM: false,
    hasGTag: false,
    dataLayerLength: 0
  };
};

// تصدير جميع الدوال
export default {
  gtmPush,
  trackLogin,
  trackSignUp,
  trackSearch,
  trackProfileView,
  trackMessageSent,
  trackLike,
  trackLanguageChange,
  trackConversion,
  trackError,
  trackPerformance,
  trackFormInteraction,
  trackClick,
  trackScroll,
  trackTimeOnPage,
  trackCustomEvent,
  setUserId,
  setAdvancedUserProperties,
  setUserProperties,
  setupEnhancedEcommerce,
  setupConversionTracking,
  setupPrivacySettings,
  trackPageView,
  enableGTMDebug,
  disableGTMDebug,
  checkGTMStatus
};
