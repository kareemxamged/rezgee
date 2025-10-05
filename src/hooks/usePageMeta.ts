import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface PageMeta {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  type?: string;
}

export const usePageMeta = (customMeta?: Partial<PageMeta>): PageMeta => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLanguage = i18n.language;

  // تحديد نوع الصفحة من المسار
  const getPageType = (pathname: string): string => {
    if (pathname === '/') return 'website';
    if (pathname.startsWith('/articles/')) return 'article';
    if (pathname.startsWith('/profile/')) return 'profile';
    return 'website';
  };

  // إنشاء meta tags حسب الصفحة واللغة
  const getPageMeta = (): PageMeta => {
    const pathname = location.pathname;
    const pageType = getPageType(pathname);

    // Meta tags افتراضية
    const defaultMeta: PageMeta = {
      title: currentLanguage === 'ar' 
        ? 'رزقي - موقع الزواج الإسلامي | تعارف جاد و زواج شرعي للمسلمين'
        : 'Rezgee - Islamic Marriage Platform | Serious Dating & Halal Marriage for Muslims',
      description: currentLanguage === 'ar'
        ? 'موقع رزقي - أول منصة زواج إسلامية موثوقة للتعارف الجاد والزواج الشرعي. آمن ومتوافق مع الشريعة الإسلامية. انضم إلى آلاف المسلمين الباحثين عن شريك الحياة.'
        : 'Rezgee - The first trusted Islamic marriage platform for serious dating and halal marriage. Safe, free, and compliant with Islamic Sharia. Join thousands of Muslims seeking a life partner.',
      keywords: currentLanguage === 'ar'
        ? 'موقع زواج اسلامي, تعارف جاد, زواج شرعي, موقع زواج مجاني, تعارف للمسلمين, زواج سعودي, زواج مصري, زواج خليجي, موقع تعارف اسلامي, زواج مسلم, موقع رزقي, زواج اونلاين, تعارف للزواج, موقع زواج موثوق, زواج اسلامي مجاني, تعارف جاد اسلامي, موقع زواج امن, زواج شرعي اسلامي, تعارف مسلمين, موقع زواج عربي, زواج اسلامي موثوق, تعارف زواج اسلامي, موقع زواج للمسلمين, زواج شرعي, تعارف للزواج الاسلامي, موقع زواج اسلامي, زواج مسلم, تعارف زواج, موقع زواج اسلامي امن, زواج شرعي اونلاين, تعارف اسلامي جاد, موقع زواج اسلامي موثوق, زواج مسلم اونلاين, تعارف زواج شرعي, موقع زواج اسلامي امن, زواج شرعي اسلامي, تعارف جاد للزواج الاسلامي, موقع زواج اسلامي شرعي, زواج مسلم شرعي, تعارف زواج اسلامي, موقع زواج اسلامي امن, زواج شرعي اسلامي اونلاين, تعارف جاد اسلامي'
        : 'Islamic marriage site, serious dating, halal marriage, free marriage site, dating for Muslims, Saudi marriage, Egyptian marriage, Gulf marriage, Islamic dating site, Muslim marriage, Rezgee site, online marriage, dating for marriage, trusted marriage site, free Islamic marriage, serious Islamic dating, secure marriage site, halal Islamic marriage, Muslim dating, Arab marriage site, trusted Islamic marriage, Islamic marriage dating, free Islamic marriage site for Muslims, free halal marriage, dating for Islamic marriage, free Islamic marriage site, free Muslim marriage, free marriage dating, secure Islamic marriage site, online halal marriage, serious Islamic dating, trusted Islamic marriage site, online Muslim marriage, halal marriage dating, secure free Islamic marriage site, free halal Islamic marriage, serious Islamic dating for Islamic marriage, Islamic halal marriage site, halal Muslim marriage, free Islamic marriage dating, secure free Islamic marriage site, online halal Islamic marriage, serious free Islamic dating',
      image: 'https://rezgee.com/images/rezgee-og-image.jpg',
      type: pageType
    };

    // Meta tags مخصصة حسب الصفحة
    const pageSpecificMeta: Record<string, PageMeta> = {
      '/': {
        title: currentLanguage === 'ar'
          ? 'رزقي - موقع الزواج الإسلامي | تعارف جاد و زواج شرعي للمسلمين'
          : 'Rezgee - Islamic Marriage Platform | Serious Dating & Halal Marriage for Muslims',
        description: currentLanguage === 'ar'
          ? 'موقع رزقي - أول منصة زواج إسلامية موثوقة للتعارف الجاد والزواج الشرعي. آمن ومتوافق مع الشريعة الإسلامية. انضم إلى آلاف المسلمين الباحثين عن شريك الحياة.'
          : 'Rezgee - The first trusted Islamic marriage platform for serious dating and halal marriage. Safe, free, and compliant with Islamic Sharia. Join thousands of Muslims seeking a life partner.',
        keywords: defaultMeta.keywords,
        image: 'https://rezgee.com/images/rezgee-homepage.jpg',
        type: 'website'
      },
      '/features': {
        title: currentLanguage === 'ar'
          ? 'مميزات رزقي - منصة الزواج الإسلامي الموثوقة'
          : 'Rezgee Features - Trusted Islamic Marriage Platform',
        description: currentLanguage === 'ar'
          ? 'اكتشف ميزات رزقي الفريدة: التحقق من الهوية، المراسلات الآمنة، الاستشارات الشرعية، والبحث المتقدم للعثور على شريك الحياة المناسب.'
          : 'Discover Rezgee\'s unique features: identity verification, secure messaging, Islamic consultations, and advanced search to find your perfect life partner.',
        keywords: currentLanguage === 'ar'
          ? 'ميزات رزقي, التحقق من الهوية, المراسلات الآمنة, الاستشارات الشرعية, البحث المتقدم, منصة زواج اسلامي'
          : 'Rezgee features, identity verification, secure messaging, Islamic consultations, advanced search, Islamic marriage platform',
        image: 'https://rezgee.com/images/rezgee-features.jpg',
        type: 'website'
      },
      '/about': {
        title: currentLanguage === 'ar'
          ? 'من نحن - رزقي منصة الزواج الإسلامي'
          : 'About Us - Rezgee Islamic Marriage Platform',
        description: currentLanguage === 'ar'
          ? 'تعرف على قصة رزقي، منصة الزواج الإسلامي الأولى في المنطقة. مهمتنا هي مساعدة المسلمين في العثور على شريك الحياة المناسب وفقاً للشريعة الإسلامية.'
          : 'Learn about Rezgee\'s story, the first Islamic marriage platform in the region. Our mission is to help Muslims find their perfect life partner in accordance with Islamic Sharia.',
        keywords: currentLanguage === 'ar'
          ? 'من نحن, رزقي, قصة رزقي, مهمة رزقي, منصة زواج اسلامي, زواج شرعي'
          : 'about us, Rezgee, Rezgee story, Rezgee mission, Islamic marriage platform, halal marriage',
        image: 'https://rezgee.com/images/rezgee-about.jpg',
        type: 'website'
      },
      '/contact': {
        title: currentLanguage === 'ar'
          ? 'اتصل بنا - رزقي منصة الزواج الإسلامي'
          : 'Contact Us - Rezgee Islamic Marriage Platform',
        description: currentLanguage === 'ar'
          ? 'تواصل مع فريق رزقي للحصول على المساعدة والدعم. نحن هنا لمساعدتك في رحلتك للعثور على شريك الحياة المناسب.'
          : 'Contact Rezgee\'s team for help and support. We\'re here to assist you in your journey to find your perfect life partner.',
        keywords: currentLanguage === 'ar'
          ? 'اتصل بنا, تواصل معنا, دعم رزقي, مساعدة, منصة زواج اسلامي'
          : 'contact us, get in touch, Rezgee support, help, Islamic marriage platform',
        image: 'https://rezgee.com/images/rezgee-contact.jpg',
        type: 'website'
      },
      '/login': {
        title: currentLanguage === 'ar'
          ? 'تسجيل الدخول - رزقي'
          : 'Login - Rezgee',
        description: currentLanguage === 'ar'
          ? 'سجل دخولك إلى حسابك في رزقي للوصول إلى منصة الزواج الإسلامي الموثوقة.'
          : 'Log in to your Rezgee account to access the trusted Islamic marriage platform.',
        keywords: currentLanguage === 'ar'
          ? 'تسجيل دخول, دخول, حساب رزقي, منصة زواج اسلامي'
          : 'login, sign in, Rezgee account, Islamic marriage platform',
        image: 'https://rezgee.com/images/rezgee-login.jpg',
        type: 'website'
      },
      '/register': {
        title: currentLanguage === 'ar'
          ? 'إنشاء حساب - رزقي'
          : 'Register - Rezgee',
        description: currentLanguage === 'ar'
          ? 'انضم إلى رزقي اليوم وابدأ رحلتك للعثور على شريك الحياة المناسب. إنشاء حساب مجاني وآمن.'
          : 'Join Rezgee today and start your journey to find your perfect life partner. Free and secure account creation.',
        keywords: currentLanguage === 'ar'
          ? 'إنشاء حساب, تسجيل, انضمام, حساب جديد, منصة زواج اسلامي'
          : 'register, sign up, join, new account, Islamic marriage platform',
        image: 'https://rezgee.com/images/rezgee-register.jpg',
        type: 'website'
      },
      '/dashboard': {
        title: currentLanguage === 'ar'
          ? 'لوحة التحكم - رزقي'
          : 'Dashboard - Rezgee',
        description: currentLanguage === 'ar'
          ? 'أهلاً بك في لوحة تحكم رزقي. إدارة حسابك والوصول إلى جميع الميزات المتاحة.'
          : 'Welcome to your Rezgee dashboard. Manage your account and access all available features.',
        keywords: currentLanguage === 'ar'
          ? 'لوحة التحكم, حسابي, إدارة الحساب, منصة زواج اسلامي'
          : 'dashboard, my account, account management, Islamic marriage platform',
        image: 'https://rezgee.com/images/rezgee-dashboard.jpg',
        type: 'website'
      },
      '/search': {
        title: currentLanguage === 'ar'
          ? 'البحث المتقدم - رزقي'
          : 'Advanced Search - Rezgee',
        description: currentLanguage === 'ar'
          ? 'ابحث عن شريك الحياة المناسب باستخدام أدوات البحث المتقدمة في رزقي. فلترة حسب العمر، الموقع، التعليم والمزيد.'
          : 'Search for your perfect life partner using Rezgee\'s advanced search tools. Filter by age, location, education, and more.',
        keywords: currentLanguage === 'ar'
          ? 'البحث المتقدم, البحث, فلترة, شريك الحياة, منصة زواج اسلامي'
          : 'advanced search, search, filtering, life partner, Islamic marriage platform',
        image: 'https://rezgee.com/images/rezgee-search.jpg',
        type: 'website'
      },
      '/articles': {
        title: currentLanguage === 'ar'
          ? 'المقالات - رزقي'
          : 'Articles - Rezgee',
        description: currentLanguage === 'ar'
          ? 'اقرأ مقالات مفيدة عن الزواج الإسلامي، العلاقات، والأسرة في رزقي.'
          : 'Read helpful articles about Islamic marriage, relationships, and family on Rezgee.',
        keywords: currentLanguage === 'ar'
          ? 'مقالات, زواج اسلامي, علاقات, أسرة, نصائح, منصة زواج اسلامي'
          : 'articles, Islamic marriage, relationships, family, tips, Islamic marriage platform',
        image: 'https://rezgee.com/images/rezgee-articles.jpg',
        type: 'website'
      }
    };

    // الحصول على meta tags للصفحة الحالية
    const currentPageMeta = pageSpecificMeta[pathname] || defaultMeta;

    // دمج مع meta tags مخصصة
    return {
      ...currentPageMeta,
      ...customMeta
    };
  };

  return getPageMeta();
};

export default usePageMeta;
