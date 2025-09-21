import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NewsletterService } from '../lib/newsletterService';
import LanguageToggle from './LanguageToggle';

const UnsubscribePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [message, setMessage] = useState<string>('');
  const [showResubscribe, setShowResubscribe] = useState<boolean>(false);

  useEffect(() => {
    // استخراج المعاملات من URL
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const tokenParam = urlParams.get('token');

    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(tokenParam);
      // تنفيذ عملية إلغاء الاشتراك تلقائياً
      handleUnsubscribe(emailParam, tokenParam);
    }
  }, []);

  const handleUnsubscribe = async (emailAddress?: string, tokenValue?: string) => {
    const targetEmail = emailAddress || email;
    const targetToken = tokenValue || token;

    if (!targetEmail || !targetToken) {
      setStatus('error');
      setMessage(t('footer.newsletter.unsubscribe.status.missingData'));
      return;
    }

    setStatus('loading');
    setMessage(t('footer.newsletter.unsubscribe.status.loading'));

    try {
      const result = await NewsletterService.unsubscribe(targetEmail, targetToken);
      
      if (result.success) {
        setStatus('success');
        setMessage(t('footer.newsletter.unsubscribe.status.success'));
        setShowResubscribe(true);
      } else {
        setStatus('error');
        setMessage(result.error || t('footer.newsletter.unsubscribe.status.error'));
      }
    } catch (error) {
      setStatus('error');
      setMessage(t('footer.newsletter.unsubscribe.status.unexpectedError'));
      console.error('Unsubscribe error:', error);
    }
  };

  const handleResubscribe = async () => {
    if (!email) {
      setMessage(t('footer.newsletter.unsubscribe.status.enterEmail'));
      return;
    }

    setStatus('loading');
    setMessage(t('footer.newsletter.unsubscribe.status.resubscribing'));

    try {
      const result = await NewsletterService.subscribe(email, i18n.language as 'ar' | 'en', 'unsubscribe_page');
      
      if (result.success) {
        setStatus('success');
        setMessage(t('footer.newsletter.unsubscribe.status.resubscribed'));
        setShowResubscribe(false);
      } else {
        setStatus('error');
        setMessage(result.error || t('footer.newsletter.unsubscribe.status.resubscribeError'));
      }
    } catch (error) {
      setStatus('error');
      setMessage(t('footer.newsletter.unsubscribe.status.unexpectedError'));
      console.error('Resubscribe error:', error);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        );
      case 'success':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'loading':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* زر تبديل اللغة في أعلى الصفحة */}
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            {t('footer.newsletter.unsubscribe.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            {t('footer.newsletter.unsubscribe.subtitle')}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {/* حالة العملية */}
          {status !== 'idle' && (
            <div className={`mb-6 p-4 rounded-lg border ${getStatusColor()}`}>
              <div className="flex items-center">
                {getStatusIcon()}
                <p className="mr-3 text-sm font-medium" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>{message}</p>
              </div>
            </div>
          )}

          {/* نموذج إدخال البيانات يدوياً */}
          {status === 'idle' && (
            <div className="space-y-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('footer.newsletter.unsubscribe.emailLabel')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('footer.newsletter.unsubscribe.emailPlaceholder')}
                  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                  {t('footer.newsletter.unsubscribe.tokenLabel')}
                </label>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('footer.newsletter.unsubscribe.tokenPlaceholder')}
                  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <button
                onClick={() => handleUnsubscribe()}
                disabled={!email || !token}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('footer.newsletter.unsubscribe.unsubscribeButton')}
              </button>
            </div>
          )}

          {/* زر إعادة الاشتراك */}
          {showResubscribe && status === 'success' && (
            <div className="mt-6">
              <div className="text-center" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                <p className="text-sm text-gray-600 mb-4">
                  {t('footer.newsletter.unsubscribe.resubscribeQuestion')}
                </p>
                <button
                  onClick={handleResubscribe}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {t('footer.newsletter.unsubscribe.resubscribeButton')}
                </button>
              </div>
            </div>
          )}

          {/* زر العودة للصفحة الرئيسية */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-500"
              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            >
              {t('footer.newsletter.unsubscribe.backToHome')}
            </a>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="text-center">
          <p className="text-xs text-gray-500" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            {t('footer.newsletter.unsubscribe.contactSupport')}{' '}
            <a href="mailto:support@rezgee.com" className="text-blue-600 hover:text-blue-500">
              support@rezgee.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribePage;
