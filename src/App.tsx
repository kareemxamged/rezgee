
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
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
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import TemporaryPasswordLoginPage from './components/TemporaryPasswordLoginPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import SetPasswordPage from './components/SetPasswordPage';

import TwoFactorVerificationPage from './components/TwoFactorVerificationPage';
import EnhancedProfilePage from './components/EnhancedProfilePage';
import PublicProfilePage from './components/PublicProfilePage';
import SearchPage from './components/SearchPage';
import MessagesPage from './components/MessagesPage';
import MatchesPage from './components/MatchesPage';
import LikesPage from './components/LikesPage';
import DashboardPage from './components/DashboardPage';
import NotificationsPage from './components/NotificationsPage';
import ReportDetailsPage from './components/ReportDetailsPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import NewAdminLoginPage from './components/admin/NewAdminLoginPage';
import NewsletterManagement from './components/admin/NewsletterManagement';
import EmailNotificationsManagement from './components/admin/EmailNotificationsManagement';
import UnsubscribePage from './components/UnsubscribePage';
import AdminTwoFactorPage from './components/admin/AdminTwoFactorPage';
import { ThemeProvider } from './contexts/ThemeContext';
import UnifiedUsersManagement from './components/admin/users/UnifiedUsersManagement';
import SubscriptionManagement from './components/admin/SubscriptionManagement';
import SubscriptionBanner from './components/SubscriptionBanner';
import SubscriptionPage from './components/SubscriptionPage';
import PaymentPage from './components/PaymentPage';
import SecuritySettingsPage from './components/SecuritySettingsPage';
import AdminArticlesPage from './pages/admin/ArticlesPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import CommentsPage from './pages/admin/CommentsPage';
import ContentAnalyticsPage from './pages/admin/ContentAnalyticsPage';
import ContentManagementPage from './pages/admin/ContentManagementPage';

import VerifyEmailChangePage from './components/VerifyEmailChangePage';
import FeaturesPage from './components/FeaturesPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import HelpCenterPage from './components/HelpCenterPage';
import FAQPage from './components/FAQPage';
import ArticlesPage from './components/ArticlesPage';
import ArticleDetailPage from './components/ArticleDetailPage';
import IslamicGuidelinesPage from './components/IslamicGuidelinesPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import NotFoundPage from './components/NotFoundPage';
import Footer from './components/Footer';
import AlertsManager from './components/alerts/AlertsManager';
import FaviconManager from './components/FaviconManager';
import PageTitleManager from './components/PageTitleManager';

function App() {
  // بدء نظام الإشعارات البريدية المستقل 24/7 عند تحميل التطبيق
  useEffect(() => {
    console.log('🚀 بدء تطبيق رزقي...');

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
          <FaviconManager />
          <PageTitleManager />
          <ScrollToTop />
          <Routes>
            {/* صفحة تسجيل الدخول الإدارية المنفصلة */}
            <Route path="/admin/login" element={
              <ThemeProvider>
                <NewAdminLoginPage />
              </ThemeProvider>
            } />

            {/* صفحة التحقق الإضافي للمشرفين */}
            <Route path="/admin/two-factor" element={
              <ThemeProvider>
                <AdminTwoFactorPage />
              </ThemeProvider>
            } />

            {/* مسارات الإدارة - منفصلة بالكامل عن تخطيط الموقع العام */}
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UnifiedUsersManagement />} />
              <Route path="content" element={<ContentManagementPage />} />
              <Route path="articles" element={<AdminArticlesPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="comments" element={<CommentsPage />} />
              <Route path="content-analytics" element={<ContentAnalyticsPage />} />
              <Route path="newsletter" element={<NewsletterManagement />} />
              <Route path="email-notifications" element={<EmailNotificationsManagement />} />
              <Route path="subscriptions" element={<SubscriptionManagement />} />
              <Route path="subscriptions/plans" element={<SubscriptionManagement />} />
              <Route path="subscriptions/users" element={<SubscriptionManagement />} />
              <Route path="subscriptions/payments" element={<SubscriptionManagement />} />
              <Route path="subscriptions/trials" element={<SubscriptionManagement />} />
              {/* يمكن إضافة المزيد من المسارات الإدارية هنا لاحقاً */}
            </Route>

            {/* باقي مسارات الموقع العام مع التخطيط العادي */}
            <Route path="/*" element={
              <div className="main-site min-h-screen bg-white font-arabic" dir="rtl">
                <Header />

                {/* بانر الاشتراك - يظهر أسفل الهيدر للمستخدمين المسجلين */}
                <SubscriptionBanner />

                {/* مدير الاتصال الصامت - يعمل خلف الكواليس */}
                <SilentConnectionManager />

                {/* مدير التنبيهات - يعرض التنبيهات تلقائياً */}
                <AlertsManager />

                <main>
                  <Routes>
              {/* الصفحات العامة */}
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/help-center" element={<HelpCenterPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:id" element={<ArticleDetailPage />} />
              <Route path="/islamic-guidelines" element={<IslamicGuidelinesPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />

              {/* صفحة إلغاء الاشتراك من النشرة الإخبارية */}
              <Route path="/unsubscribe" element={<UnsubscribePage />} />

              {/* صفحات للزوار فقط (غير المسجلين) */}
              <Route path="/register" element={
                <GuestOnlyRoute>
                  <RegisterPage />
                </GuestOnlyRoute>
              } />
              <Route path="/login" element={
                <GuestOnlyRoute>
                  <LoginPage />
                </GuestOnlyRoute>
              } />
              <Route path="/forgot-password" element={
                <GuestOnlyRoute>
                  <ForgotPasswordPage />
                </GuestOnlyRoute>
              } />
              <Route path="/temporary-password-login" element={
                <GuestOnlyRoute>
                  <TemporaryPasswordLoginPage />
                </GuestOnlyRoute>
              } />
              <Route path="/reset-password" element={
                <GuestOnlyRoute>
                  <ResetPasswordPage />
                </GuestOnlyRoute>
              } />
              <Route path="/set-password" element={
                <GuestOnlyRoute>
                  <SetPasswordPage />
                </GuestOnlyRoute>
              } />


              {/* صفحة التحقق من المصادقة الثنائية */}
              <Route path="/two-factor-verification" element={<TwoFactorVerificationPage />} />

              {/* الصفحات المحمية (تتطلب تسجيل دخول) */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/report/:reportId" element={
                <ProtectedRoute>
                  <ReportDetailsPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <EnhancedProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/profile/:userId" element={<PublicProfilePage />} />
              <Route path="/search" element={
                <ProtectedRoute requireVerification={true}>
                  <SearchPage />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute requireVerification={true}>
                  <MessagesPage />
                </ProtectedRoute>
              } />
              <Route path="/matches" element={
                <ProtectedRoute requireVerification={true}>
                  <MatchesPage />
                </ProtectedRoute>
              } />
              <Route path="/likes" element={
                <ProtectedRoute requireVerification={true}>
                  <LikesPage />
                </ProtectedRoute>
              } />
              <Route path="/security" element={
                <ProtectedRoute>
                  <SecuritySettingsPage />
                </ProtectedRoute>
              } />

              <Route path="/subscription" element={
                <ProtectedRoute>
                  <SubscriptionPage />
                </ProtectedRoute>
              } />
              <Route path="/payment" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/verify-email-change" element={<VerifyEmailChangePage />} />

              {/* صفحة 404 - يجب أن تكون في النهاية */}
              <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
