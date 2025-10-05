import { useCallback } from 'react';

interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export const useAnalytics = () => {
  // تتبع حدث مخصص
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }
  }, []);

  // تتبع زيارة صفحة
  const trackPageView = useCallback((pagePath: string, pageTitle?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-7QWP1R3BES', {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
  }, []);

  // تتبع تسجيل الدخول
  const trackLogin = useCallback((method: string = 'email') => {
    trackEvent({
      action: 'login',
      category: 'engagement',
      label: method,
      custom_parameters: {
        method: method
      }
    });
  }, [trackEvent]);

  // تتبع إنشاء حساب
  const trackSignUp = useCallback((method: string = 'email') => {
    trackEvent({
      action: 'sign_up',
      category: 'engagement',
      label: method,
      custom_parameters: {
        method: method
      }
    });
  }, [trackEvent]);

  // تتبع البحث
  const trackSearch = useCallback((searchTerm: string) => {
    trackEvent({
      action: 'search',
      category: 'engagement',
      label: searchTerm,
      custom_parameters: {
        search_term: searchTerm
      }
    });
  }, [trackEvent]);

  // تتبع النقر على ملف شخصي
  const trackProfileView = useCallback((profileId: string) => {
    trackEvent({
      action: 'view_profile',
      category: 'engagement',
      label: profileId,
      custom_parameters: {
        profile_id: profileId
      }
    });
  }, [trackEvent]);

  // تتبع إرسال رسالة
  const trackMessageSent = useCallback((recipientId: string) => {
    trackEvent({
      action: 'send_message',
      category: 'engagement',
      label: recipientId,
      custom_parameters: {
        recipient_id: recipientId
      }
    });
  }, [trackEvent]);

  // تتبع الإعجاب
  const trackLike = useCallback((profileId: string) => {
    trackEvent({
      action: 'like',
      category: 'engagement',
      label: profileId,
      custom_parameters: {
        profile_id: profileId
      }
    });
  }, [trackEvent]);

  // تتبع تغيير اللغة
  const trackLanguageChange = useCallback((fromLanguage: string, toLanguage: string) => {
    trackEvent({
      action: 'language_change',
      category: 'user_preference',
      label: `${fromLanguage}_to_${toLanguage}`,
      custom_parameters: {
        from_language: fromLanguage,
        to_language: toLanguage
      }
    });
  }, [trackEvent]);

  // تتبع النقر على رابط خارجي
  const trackExternalLink = useCallback((url: string, linkText?: string) => {
    trackEvent({
      action: 'click_external_link',
      category: 'outbound',
      label: linkText || url,
      custom_parameters: {
        link_url: url,
        link_text: linkText
      }
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackLogin,
    trackSignUp,
    trackSearch,
    trackProfileView,
    trackMessageSent,
    trackLike,
    trackLanguageChange,
    trackExternalLink
  };
};

export default useAnalytics;
