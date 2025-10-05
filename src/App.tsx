import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import './i18n'; // Initialize i18n
import './styles/custom-scrollbar.css'; // Custom scrollbar styles
import './utils/initializeTestTools'; // Initialize testing tools
import { setupAdminConsoleFilter } from './utils/hideAdminConsoleMessages'; // Hide admin console messages in public platform

import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ToastContainer';
// import { startServerNotificationSystem, stopServerNotificationSystem } from './lib/startServerNotificationSystem';
import ProtectedRoute, { GuestOnlyRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import SilentConnectionManager from './components/SilentConnectionManager';
import LoadingSpinner from './components/LoadingSpinner';
import PerformanceMonitor from './components/PerformanceMonitor';

// Lazy load components for better performance
const HomePage = lazy(() => import('./components/HomePage'));
const RegisterPage = lazy(() => import('./components/RegisterPage'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./components/ForgotPasswordPage'));
const TemporaryPasswordLoginPage = lazy(() => import('./components/TemporaryPasswordLoginPage'));
const ResetPasswordPage = lazy(() => import('./components/ResetPasswordPage'));
const SetPasswordPage = lazy(() => import('./components/SetPasswordPage'));

const TwoFactorVerificationPage = lazy(() => import('./components/TwoFactorVerificationPage'));
const EnhancedProfilePage = lazy(() => import('./components/EnhancedProfilePage'));
const PublicProfilePage = lazy(() => import('./components/PublicProfilePage'));
const SearchPage = lazy(() => import('./components/SearchPage'));
const MessagesPage = lazy(() => import('./components/MessagesPage'));
const MatchesPage = lazy(() => import('./components/MatchesPage'));
const LikesPage = lazy(() => import('./components/LikesPage'));
const DashboardPage = lazy(() => import('./components/DashboardPage'));
const NotificationsPage = lazy(() => import('./components/NotificationsPage'));
const ReportDetailsPage = lazy(() => import('./components/ReportDetailsPage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const NewAdminLoginPage = lazy(() => import('./components/admin/NewAdminLoginPage'));
const NewsletterManagement = lazy(() => import('./components/admin/NewsletterManagement'));
const EmailNotificationsManagement = lazy(() => import('./components/admin/EmailNotificationsManagement'));
const UnsubscribePage = lazy(() => import('./components/UnsubscribePage'));
const AdminTwoFactorPage = lazy(() => import('./components/admin/AdminTwoFactorPage'));
// Keep ThemeProvider as regular import since it's needed immediately
import { ThemeProvider } from './contexts/ThemeContext';
const UnifiedUsersManagement = lazy(() => import('./components/admin/users/UnifiedUsersManagement'));
const SubscriptionManagement = lazy(() => import('./components/admin/SubscriptionManagement'));
const SubscriptionBanner = lazy(() => import('./components/SubscriptionBanner'));
const SubscriptionPage = lazy(() => import('./components/SubscriptionPage'));
const PaymentPage = lazy(() => import('./components/PaymentPage'));
const SecuritySettingsPage = lazy(() => import('./components/SecuritySettingsPage'));
const AdminArticlesPage = lazy(() => import('./pages/admin/ArticlesPage'));
const CategoriesPage = lazy(() => import('./pages/admin/CategoriesPage'));
const CommentsPage = lazy(() => import('./pages/admin/CommentsPage'));
const ContentAnalyticsPage = lazy(() => import('./pages/admin/ContentAnalyticsPage'));
const ContentManagementPage = lazy(() => import('./pages/admin/ContentManagementPage'));

const VerifyEmailChangePage = lazy(() => import('./components/VerifyEmailChangePage'));
const FeaturesPage = lazy(() => import('./components/FeaturesPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const HelpCenterPage = lazy(() => import('./components/HelpCenterPage'));
const FAQPage = lazy(() => import('./components/FAQPage'));
const ArticlesPage = lazy(() => import('./components/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('./components/ArticleDetailPage'));
const IslamicGuidelinesPage = lazy(() => import('./components/IslamicGuidelinesPage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./components/TermsOfServicePage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));
const Footer = lazy(() => import('./components/Footer'));
const AlertsManager = lazy(() => import('./components/alerts/AlertsManager'));
const FaviconManager = lazy(() => import('./components/FaviconManager'));
const PageTitleManager = lazy(() => import('./components/PageTitleManager'));
const DynamicMetaTags = lazy(() => import('./components/DynamicMetaTags'));

// Keep usePageMeta as regular import since it's a hook
import { usePageMeta } from './hooks/usePageMeta';

// مكون داخلي لاستخدام hooks داخل Router
const AppContent: React.FC = () => {
  // استخدام hook لإدارة meta tags
  const pageMeta = usePageMeta();

  return (
    <>
      {/* مراقب الأداء - يعمل في الخلفية */}
      <PerformanceMonitor 
        enabled={true} 
        reportToAnalytics={true} 
        logToConsole={import.meta.env.DEV} 
      />
      
      <Suspense fallback={<LoadingSpinner fullScreen text="جاري تحميل الموقع..." />}>
        <DynamicMetaTags {...pageMeta} />
      </Suspense>
      <Suspense fallback={<LoadingSpinner size="sm" />}>
        <FaviconManager />
      </Suspense>
      <Suspense fallback={<LoadingSpinner size="sm" />}>
        <PageTitleManager />
      </Suspense>
      <ScrollToTop />
      <Routes>
        {/* صفحة تسجيل الدخول الإدارية المنفصلة */}
        <Route path="/admin/login" element={
          <ThemeProvider>
            <Suspense fallback={<LoadingSpinner fullScreen text="جاري تحميل صفحة تسجيل الدخول..." />}>
              <NewAdminLoginPage />
            </Suspense>
          </ThemeProvider>
        } />

        {/* صفحة التحقق الإضافي للمشرفين */}
        <Route path="/admin/two-factor" element={
          <ThemeProvider>
            <Suspense fallback={<LoadingSpinner fullScreen text="جاري تحميل صفحة التحقق..." />}>
              <AdminTwoFactorPage />
            </Suspense>
          </ThemeProvider>
        } />

        {/* مسارات الإدارة - منفصلة بالكامل عن تخطيط الموقع العام */}
        <Route path="/admin/*" element={
          <Suspense fallback={<LoadingSpinner fullScreen text="جاري تحميل لوحة الإدارة..." />}>
            <AdminLayout />
          </Suspense>
        }>
          <Route index element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل لوحة التحكم..." />}>
              <AdminDashboard />
            </Suspense>
          } />
          <Route path="users" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل إدارة المستخدمين..." />}>
              <UnifiedUsersManagement />
            </Suspense>
          } />
          <Route path="content" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل إدارة المحتوى..." />}>
              <ContentManagementPage />
            </Suspense>
          } />
          <Route path="articles" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل إدارة المقالات..." />}>
              <AdminArticlesPage />
            </Suspense>
          } />
          <Route path="categories" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل إدارة الفئات..." />}>
              <CategoriesPage />
            </Suspense>
          } />
          <Route path="comments" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل إدارة التعليقات..." />}>
              <CommentsPage />
            </Suspense>
          } />
          <Route path="content-analytics" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل تحليلات المحتوى..." />}>
              <ContentAnalyticsPage />
            </Suspense>
          } />
          <Route path="newsletter" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل إدارة النشرة الإخبارية..." />}>
              <NewsletterManagement />
            </Suspense>
          } />
          <Route path="email-notifications" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل إدارة الإشعارات..." />}>
              <EmailNotificationsManagement />
            </Suspense>
          } />
          <Route path="subscriptions" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل إدارة الاشتراكات..." />}>
              <SubscriptionManagement />
            </Suspense>
          } />
          <Route path="subscriptions/plans" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل خطط الاشتراك..." />}>
              <SubscriptionManagement />
            </Suspense>
          } />
          <Route path="subscriptions/users" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل مستخدمي الاشتراك..." />}>
              <SubscriptionManagement />
            </Suspense>
          } />
          <Route path="subscriptions/payments" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل مدفوعات الاشتراك..." />}>
              <SubscriptionManagement />
            </Suspense>
          } />
          <Route path="subscriptions/trials" element={
            <Suspense fallback={<LoadingSpinner text="جاري تحميل التجارب المجانية..." />}>
              <SubscriptionManagement />
            </Suspense>
          } />
          {/* يمكن إضافة المزيد من المسارات الإدارية هنا لاحقاً */}
        </Route>

        {/* باقي مسارات الموقع العام مع التخطيط العادي */}
        <Route path="/*" element={
          <div className="main-site min-h-screen bg-white font-arabic" dir="rtl">
            <Header />

            {/* بانر الاشتراك - يظهر أسفل الهيدر للمستخدمين المسجلين */}
            <Suspense fallback={<LoadingSpinner size="sm" />}>
              <SubscriptionBanner />
            </Suspense>

            {/* مدير الاتصال الصامت - يعمل خلف الكواليس */}
            <SilentConnectionManager />

            {/* مدير التنبيهات - يعرض التنبيهات تلقائياً */}
            <Suspense fallback={<LoadingSpinner size="sm" />}>
              <AlertsManager />
            </Suspense>

            <main>
              <Routes>
              {/* الصفحات العامة */}
              <Route path="/" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل الصفحة الرئيسية..." />}>
                  <HomePage />
                </Suspense>
              } />
              <Route path="/features" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة المميزات..." />}>
                  <FeaturesPage />
                </Suspense>
              } />
              <Route path="/about" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة من نحن..." />}>
                  <AboutPage />
                </Suspense>
              } />
              <Route path="/contact" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة التواصل..." />}>
                  <ContactPage />
                </Suspense>
              } />
              <Route path="/help-center" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل مركز المساعدة..." />}>
                  <HelpCenterPage />
                </Suspense>
              } />
              <Route path="/faq" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل الأسئلة الشائعة..." />}>
                  <FAQPage />
                </Suspense>
              } />
              <Route path="/articles" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل المقالات..." />}>
                  <ArticlesPage />
                </Suspense>
              } />
              <Route path="/articles/:id" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل المقال..." />}>
                  <ArticleDetailPage />
                </Suspense>
              } />
              <Route path="/islamic-guidelines" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل الإرشادات الإسلامية..." />}>
                  <IslamicGuidelinesPage />
                </Suspense>
              } />
              <Route path="/privacy-policy" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل سياسة الخصوصية..." />}>
                  <PrivacyPolicyPage />
                </Suspense>
              } />
              <Route path="/terms-of-service" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل شروط الخدمة..." />}>
                  <TermsOfServicePage />
                </Suspense>
              } />

              {/* صفحة إلغاء الاشتراك من النشرة الإخبارية */}
              <Route path="/unsubscribe" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة إلغاء الاشتراك..." />}>
                  <UnsubscribePage />
                </Suspense>
              } />

              {/* صفحات للزوار فقط (غير المسجلين) */}
              <Route path="/register" element={
                <GuestOnlyRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة التسجيل..." />}>
                    <RegisterPage />
                  </Suspense>
                </GuestOnlyRoute>
              } />
              <Route path="/login" element={
                <GuestOnlyRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة تسجيل الدخول..." />}>
                    <LoginPage />
                  </Suspense>
                </GuestOnlyRoute>
              } />
              <Route path="/forgot-password" element={
                <GuestOnlyRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة نسيان كلمة المرور..." />}>
                    <ForgotPasswordPage />
                  </Suspense>
                </GuestOnlyRoute>
              } />
              <Route path="/temporary-password-login" element={
                <GuestOnlyRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة تسجيل الدخول المؤقت..." />}>
                    <TemporaryPasswordLoginPage />
                  </Suspense>
                </GuestOnlyRoute>
              } />
              <Route path="/reset-password" element={
                <GuestOnlyRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة إعادة تعيين كلمة المرور..." />}>
                    <ResetPasswordPage />
                  </Suspense>
                </GuestOnlyRoute>
              } />
              <Route path="/set-password" element={
                <GuestOnlyRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة تعيين كلمة المرور..." />}>
                    <SetPasswordPage />
                  </Suspense>
                </GuestOnlyRoute>
              } />


              {/* صفحة التحقق من المصادقة الثنائية */}
              <Route path="/two-factor-verification" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة التحقق..." />}>
                  <TwoFactorVerificationPage />
                </Suspense>
              } />

              {/* الصفحات المحمية (تتطلب تسجيل دخول) */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل لوحة التحكم..." />}>
                    <DashboardPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل الإشعارات..." />}>
                    <NotificationsPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/report/:reportId" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل تفاصيل التقرير..." />}>
                    <ReportDetailsPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل الملف الشخصي..." />}>
                    <EnhancedProfilePage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/profile/:userId" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل الملف الشخصي..." />}>
                  <PublicProfilePage />
                </Suspense>
              } />
              <Route path="/search" element={
                <ProtectedRoute requireVerification={true}>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة البحث..." />}>
                    <SearchPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute requireVerification={true}>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل الرسائل..." />}>
                    <MessagesPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/matches" element={
                <ProtectedRoute requireVerification={true}>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل المطابقات..." />}>
                    <MatchesPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/likes" element={
                <ProtectedRoute requireVerification={true}>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل الإعجابات..." />}>
                    <LikesPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/security" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل إعدادات الأمان..." />}>
                    <SecuritySettingsPage />
                  </Suspense>
                </ProtectedRoute>
              } />

              <Route path="/subscription" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة الاشتراك..." />}>
                    <SubscriptionPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/payment" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة الدفع..." />}>
                    <PaymentPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/verify-email-change" element={
                <Suspense fallback={<LoadingSpinner text="جاري تحميل صفحة التحقق من البريد الإلكتروني..." />}>
                  <VerifyEmailChangePage />
                </Suspense>
              } />

                {/* صفحة 404 - يجب أن تكون في النهاية */}
                <Route path="*" element={
                  <Suspense fallback={<LoadingSpinner text="جاري تحميل الصفحة..." />}>
                    <NotFoundPage />
                  </Suspense>
                } />
              </Routes>
            </main>
            <Suspense fallback={<LoadingSpinner size="sm" />}>
              <Footer />
            </Suspense>
          </div>
        } />
      </Routes>
    </>
  );
};

function App() {
  // بدء نظام الإشعارات البريدية المستقل 24/7 عند تحميل التطبيق
  useEffect(() => {
    // console.log('🚀 بدء تطبيق رزقي...');

    // إعداد فلتر رسائل الكونسول الخاصة بلوحة الإدارة
    setupAdminConsoleFilter();

    // بدء نظام الإشعارات البريدية للخادم - معطل مؤقتاً
    // const initializeServerNotificationSystem = async () => {
    //   try {
    //     console.log('📧 بدء تشغيل نظام الإشعارات البريدية للخادم...');
    //     await startServerNotificationSystem({
    //       checkInterval: 10,        // كل 10 ثوان
    //       maxRetries: 3,           // أقصى 3 أخطاء متتالية
    //       retryDelay: 30,          // انتظار 30 ثانية
    //       batchSize: 20,           // معالجة 20 إشعار في كل مرة
    //       enableEmailTracking: true, // تتبع حالة الإرسال البريدي
    //       logLevel: 'debug'       // مستوى تسجيل مفصل
    //     });
    //     console.log('✅ تم تشغيل نظام الإشعارات البريدية للخادم بنجاح!');
    //     console.log('🌍 النظام سيراقب إشعارات جميع المستخدمين في المنصة!');
    //   } catch (error) {
    //     console.error('❌ خطأ في تشغيل نظام الإشعارات البريدية للخادم:', error);
    //   }
    // };

    // initializeServerNotificationSystem();

    // تنظيف النظام عند إغلاق التطبيق - معطل مؤقتاً
    // return () => {
    //   console.log('🛑 إيقاف نظام الإشعارات البريدية للخادم...');
    //   stopServerNotificationSystem();
    // };
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
