import React, { useState } from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NewsletterService from '../lib/newsletterService';

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      setNewsletterStatus('error');
      setNewsletterMessage(i18n.language === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email address');
      return;
    }

    setNewsletterStatus('loading');
    setNewsletterMessage('');

    try {
      const result = await NewsletterService.subscribe(
        newsletterEmail.trim(),
        undefined,
        i18n.language as 'ar' | 'en',
        'footer'
      );

      if (result.success) {
        setNewsletterStatus('success');
        setNewsletterMessage(
          i18n.language === 'ar' 
            ? 'تم الاشتراك في النشرة الإخبارية بنجاح!' 
            : 'Successfully subscribed to newsletter!'
        );
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(result.error || (i18n.language === 'ar' ? 'حدث خطأ في الاشتراك' : 'Subscription failed'));
      }
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage(i18n.language === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    }
  };

  return (
    <footer className="bg-slate-900 text-white" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className={`sm:col-span-2 lg:col-span-1 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-3 mb-4 md:mb-6 ${i18n.language === 'ar' ? 'justify-start' : 'justify-start'}`}>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center">
                <Heart className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold">{t('footer.brand.name')}</h3>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
              {t('footer.brand.description')}
            </p>
            <div className={`flex gap-3 md:gap-4 ${i18n.language === 'ar' ? 'justify-start' : 'justify-start'}`}>
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Facebook className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Twitter className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Youtube className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="text-base md:text-lg font-bold mb-4 md:mb-6">{t('footer.quickLinks.title')}</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><Link to="/" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">{t('footer.quickLinks.home')}</Link></li>
              <li><Link to="/features" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">{t('footer.quickLinks.features')}</Link></li>
              <li><Link to="/about" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">{t('footer.quickLinks.about')}</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">{t('footer.quickLinks.contact')}</Link></li>
              <li><Link to="/articles" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">{t('navigation.articles')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          {/* <div className="text-right">
            <h4 className="text-base md:text-lg font-bold mb-4 md:mb-6">خدماتنا</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><Link to="/search" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">البحث المتقدم</Link></li>
              <li><Link to="/messages" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">المراسلات الآمنة</Link></li>
              <li><Link to="/verification" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">التحقق من الهوية</Link></li>
              <li><Link to="/consultation" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">الاستشارات الشرعية</Link></li>
              <li><Link to="/guide" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">دليل الزواج</Link></li>
              <li><Link to="/success" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">قصص النجاح</Link></li>
            </ul>
          </div> */}

          {/* Support */}
          <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="text-base md:text-lg font-bold mb-4 md:mb-6">{t('footer.support.title')}</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><Link to="/help-center" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">{t('footer.support.helpCenter')}</Link></li>
              <li><Link to="/faq" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">{t('footer.support.faq')}</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">{t('footer.support.contact')}</Link></li>
              <li><Link to="/islamic-guidelines" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">{t('footer.support.islamicGuidelines')}</Link></li>
              <li><Link to="/privacy-policy" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">{t('footer.support.privacyPolicy')}</Link></li>
              <li><Link to="/terms-of-service" className="text-slate-300 hover:text-white transition-colors text-sm md:text-base">{t('footer.support.termsOfService')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="text-base md:text-lg font-bold mb-4 md:mb-6">{t('footer.contactInfo.title')}</h4>
            <div className="space-y-3 md:space-y-4">
              <div className={`flex items-center gap-3 ${i18n.language === 'ar' ? 'justify-start' : 'justify-start'}`}>
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
                <Link to="mailto:info@rezge.com">
                  <span className="text-slate-300 text-sm md:text-base">{t('footer.contactInfo.email')}</span>
                </Link>
              </div>
              <div className={`flex items-center gap-3 ${i18n.language === 'ar' ? 'justify-start' : 'justify-start'}`}>
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
                <Link to="tel:+966582352555">
                  <span className="text-slate-300 text-sm md:text-base" dir="ltr">{t('footer.contactInfo.phone')}</span>
                </Link>
              </div>
              <div className={`flex items-center gap-3 ${i18n.language === 'ar' ? 'justify-start' : 'justify-start'}`}>
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
                <span className="text-slate-300 text-sm md:text-base">{t('footer.contactInfo.address')}</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6 md:mt-8">
              <h5 className={`font-bold mb-3 text-sm md:text-base ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>{t('footer.newsletter.title')}</h5>
              
              <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={t('footer.newsletter.placeholder')}
                    className="flex-1 px-3 md:px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 text-sm md:text-base"
                    disabled={newsletterStatus === 'loading'}
                  />
                  <button 
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="px-3 md:px-4 py-2 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-lg hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 text-sm md:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {newsletterStatus === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {i18n.language === 'ar' ? 'جاري...' : 'Loading...'}
                      </>
                    ) : (
                      t('footer.newsletter.subscribe')
                    )}
                  </button>
                </div>
                
                {/* Status Message */}
                {newsletterMessage && (
                  <div className={`flex items-center gap-2 text-sm ${
                    newsletterStatus === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {newsletterStatus === 'success' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>{newsletterMessage}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className={`text-slate-400 text-sm ${i18n.language === 'ar' ? 'text-right md:text-right' : 'text-left md:text-left'}`}>
              {t('footer.copyright')}
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">{t('navigation.privacyPolicy')}</Link>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">{t('navigation.termsOfService')}</Link>
              <Link to="/help-center" className="hover:text-white transition-colors">{t('navigation.helpCenter')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
