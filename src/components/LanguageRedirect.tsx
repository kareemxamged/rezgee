import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    console.log('🔍 LanguageRedirect checking path:', currentPath);

    // تحديث اللغة بناءً على URL
    const urlLanguage = currentPath.startsWith('/en') ? 'en' : 'ar';
    if (urlLanguage !== i18n.language) {
      console.log('🌍 Updating language from', i18n.language, 'to', urlLanguage);
      i18n.changeLanguage(urlLanguage);
    }

    // إذا كان المستخدم في الصفحة الرئيسية بدون بادئة لغة
    if (currentPath === '/') {
      setIsRedirecting(true);
      // إعادة توجيه إلى اللغة الحالية
      const redirectPath = `/${i18n.language}`;
      console.log('🔄 Redirecting from / to', redirectPath);
      navigate(redirectPath, { replace: true });
      return;
    }

    // إذا كان المستخدم في مسار بدون بادئة لغة (وليس الصفحة الرئيسية)
    if (!currentPath.startsWith('/ar/') && !currentPath.startsWith('/en/') && currentPath !== '/ar' && currentPath !== '/en') {
      setIsRedirecting(true);
      // إضافة بادئة اللغة الحالية
      const redirectPath = `/${i18n.language}${currentPath}`;
      console.log('🔄 Redirecting from', currentPath, 'to', redirectPath);
      navigate(redirectPath, { replace: true });
      return;
    }

    // إذا وصلنا هنا، فالمسار صحيح ولا نحتاج إعادة توجيه
    setIsRedirecting(false);
    console.log('✅ Path is correct, no redirect needed');
  }, [location.pathname, i18n, navigate]);

  // إظهار شاشة تحميل فقط أثناء التوجيه
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">جاري التوجيه...</h2>
          <p className="text-slate-600">يتم توجيهك إلى الصفحة الصحيحة</p>
        </div>
      </div>
    );
  }

  // لا نعرض أي شيء إذا لم يكن هناك إعادة توجيه
  return null;
};

export default LanguageRedirect;
