import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import arTranslations from './locales/ar.json';
import enTranslations from './locales/en.json';

const resources = {
  ar: {
    translation: arTranslations
  },
  en: {
    translation: enTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // Default language is Arabic
    fallbackLng: 'ar',

    interpolation: {
      escapeValue: false // React already does escaping
    },

    // Configure for RTL support
    react: {
      useSuspense: false
    }
  });

// Function to change language and update document direction
export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);

  // Update document direction and lang attribute
  const isRTL = language === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = language;

  // Update body class for styling
  document.body.classList.toggle('rtl', isRTL);
  document.body.classList.toggle('ltr', !isRTL);
};

// Initialize direction on load
const currentLang = i18n.language || 'ar';
changeLanguage(currentLang);

export default i18n;
