import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { trackPageView } from '../utils/gtm';

interface DynamicMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const DynamicMetaTags: React.FC<DynamicMetaTagsProps> = ({
  title,
  description,
  keywords,
  image = 'https://rezgee.com/images/rezgee-og-image.jpg',
  url,
  type = 'website'
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // تحديد اللغة الحالية
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === 'ar';

  // إنشاء URL الكامل
  const fullUrl = url || `https://rezgee.com${location.pathname}`;

  // إنشاء العنوان والوصف حسب اللغة
  const getLocalizedContent = () => {
    if (currentLanguage === 'en') {
      return {
        title: title || t('meta.title', 'Rezgee - Islamic Marriage Platform | Serious Dating & Halal Marriage for Muslims'),
        description: description || t('meta.description', 'Rezgee - The first trusted Islamic marriage platform for serious dating and halal marriage. Safe, free, and compliant with Islamic Sharia. Join thousands of Muslims seeking a life partner.'),
        keywords: keywords || t('meta.keywords', 'rezgee, rezge, rezgee com, rezgee website, rezgee company, rezge website, rezge company, rezgee app, rezge com, rezge company, Islamic marriage site, serious dating, halal marriage, free marriage site, dating for Muslims, Saudi marriage, Egyptian marriage, Gulf marriage, Islamic dating site, Muslim marriage, Rezgee site, online marriage, dating for marriage, trusted marriage site, free Islamic marriage, serious Islamic dating, secure marriage site, halal Islamic marriage, Muslim dating, Arab marriage site, trusted Islamic marriage, Islamic marriage dating, free Islamic marriage site for Muslims, free halal marriage, dating for Islamic marriage, free Islamic marriage site, free Muslim marriage, free marriage dating, secure Islamic marriage site, online halal marriage, serious Islamic dating, trusted Islamic marriage site, online Muslim marriage, halal marriage dating, secure free Islamic marriage site, free halal Islamic marriage, serious Islamic dating for Islamic marriage, Islamic halal marriage site, halal Muslim marriage, free Islamic marriage dating, secure free Islamic marriage site, online halal Islamic marriage, serious free Islamic dating'),
        locale: 'en_US',
        alternateLocale: 'ar_SA'
      };
    } else {
      return {
        title: title || t('meta.title', 'رزقي - موقع الزواج الإسلامي | تعارف جاد و زواج شرعي للمسلمين'),
        description: description || t('meta.description', 'موقع رزقي - أول منصة زواج إسلامية موثوقة للتعارف الجاد والزواج الشرعي. آمن ومتوافق مع الشريعة الإسلامية. انضم إلى آلاف المسلمين الباحثين عن شريك الحياة.'),
        keywords: keywords || t('meta.keywords', 'rezgee, rezge, rezgee com, rezgee website, rezgee company, rezge website, rezge company, rezgee app, rezge com, rezge company, منصة رزقي, شركة رزقي, مؤسسة رزقي, رزقي للزواج, رزقي للتعارف, رزقي للزواج الاسلامي, موقع رزجي, موقع رزقي, رزقي, رزجي, موقع زواج اسلامي, تعارف جاد, زواج شرعي, موقع زواج مجاني, تعارف للمسلمين, زواج سعودي, زواج مصري, زواج خليجي, موقع تعارف اسلامي, زواج مسلم, موقع رزقي, زواج اونلاين, تعارف للزواج, موقع زواج موثوق, زواج اسلامي مجاني, تعارف جاد اسلامي, موقع زواج امن, زواج شرعي اسلامي, تعارف مسلمين, موقع زواج عربي, زواج اسلامي موثوق, تعارف زواج اسلامي, موقع زواج للمسلمين, زواج شرعي, تعارف للزواج الاسلامي, موقع زواج اسلامي, زواج مسلم, تعارف زواج, موقع زواج اسلامي امن, زواج شرعي اونلاين, تعارف اسلامي جاد, موقع زواج اسلامي موثوق, زواج مسلم اونلاين, تعارف زواج شرعي, موقع زواج اسلامي امن, زواج شرعي اسلامي, تعارف جاد للزواج الاسلامي, موقع زواج اسلامي شرعي, زواج مسلم شرعي, تعارف زواج اسلامي, موقع زواج اسلامي امن, زواج شرعي اسلامي اونلاين, تعارف جاد اسلامي'),
        locale: 'ar_SA',
        alternateLocale: 'en_US'
      };
    }
  };

  const content = getLocalizedContent();

  useEffect(() => {
    // تحديث عنوان الصفحة
    document.title = content.title;

    // تحديث اتجاه الصفحة
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;

    // تتبع تغيير اللغة في Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'language_change', {
        'language': currentLanguage,
        'page_title': content.title,
        'page_location': fullUrl
      });
    }

    // تتبع الصفحة في GTM
    trackPageView(fullUrl, content.title);

    // تحديث meta tags الأساسية
    updateMetaTag('description', content.description);
    updateMetaTag('keywords', content.keywords);

    // تحديث Open Graph tags
    updateMetaTag('og:title', content.title, 'property');
    updateMetaTag('og:description', content.description, 'property');
    updateMetaTag('og:url', fullUrl, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:locale', content.locale, 'property');
    updateMetaTag('og:locale:alternate', content.alternateLocale, 'property');

    // تحديث Twitter Card tags
    updateMetaTag('twitter:title', content.title, 'name');
    updateMetaTag('twitter:description', content.description, 'name');
    updateMetaTag('twitter:image', image, 'name');

    // تحديث hreflang tags
    updateHreflangTags();

    // تحديث canonical URL
    updateCanonicalUrl(fullUrl);

  }, [currentLanguage, content.title, content.description, content.keywords, fullUrl, image, type, isRTL]);

  // دالة لتحديث meta tags
  const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // دالة لتحديث hreflang tags
  const updateHreflangTags = () => {
    // إزالة hreflang tags الموجودة
    const existingHreflangs = document.querySelectorAll('link[hreflang]');
    existingHreflangs.forEach(link => link.remove());

    // إضافة hreflang tags جديدة
    const hreflangs = [
      { lang: 'ar', url: `https://rezgee.com${location.pathname}?lang=ar` },
      { lang: 'en', url: `https://rezgee.com${location.pathname}?lang=en` },
      { lang: 'x-default', url: `https://rezgee.com${location.pathname}` }
    ];

    hreflangs.forEach(({ lang, url }) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', url);
      document.head.appendChild(link);
    });
  };

  // دالة لتحديث canonical URL
  const updateCanonicalUrl = (url: string) => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  };

  // إضافة JSON-LD structured data
  useEffect(() => {
    // إزالة JSON-LD الموجود
    const existingJsonLd = document.querySelector('script[type="application/ld+json"]');
    if (existingJsonLd) {
      existingJsonLd.remove();
    }

    // إضافة JSON-LD جديد
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": currentLanguage === 'ar' ? 'رزقي' : 'Rezgee',
      "alternateName": currentLanguage === 'ar' ? 'Rezgee' : 'رزقي',
      "url": fullUrl,
      "description": content.description,
      "inLanguage": [currentLanguage, currentLanguage === 'ar' ? 'en' : 'ar'],
      "potentialAction": {
        "@type": "SearchAction",
        "target": `https://rezgee.com/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": currentLanguage === 'ar' ? 'رزقي' : 'Rezgee',
        "url": "https://rezgee.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://rezgee.com/images/rezgee-logo.png",
          "width": 200,
          "height": 60
        }
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [currentLanguage, content.description, fullUrl]);

  return null; // هذا المكون لا يعرض أي شيء
};

export default DynamicMetaTags;
