import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { changeLanguage } from '../i18n';
import { trackLanguageChange } from '../utils/gtm';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

    const toggleLanguage = () => {
      const newLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
      console.log('🌐 Language toggle clicked:', currentLanguage, '->', newLanguage);

      // تتبع استخدام زر تبديل اللغة في Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'language_toggle_clicked', {
          'from_language': currentLanguage,
          'to_language': newLanguage,
          'page_location': window.location.href
        });
      }

      // تتبع تبديل اللغة في GTM
      trackLanguageChange(currentLanguage, newLanguage);

      changeLanguage(newLanguage);
    };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-2 lg:px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors duration-200"
      aria-label={currentLanguage === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Globe className="w-4 h-4 lg:w-5 lg:h-5" />
      {/* إخفاء النص في الشاشات الصغيرة */}
      <span className="hidden sm:inline">
        {currentLanguage === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
};

export default LanguageToggle;
