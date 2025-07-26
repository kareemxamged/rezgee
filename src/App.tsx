
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n'; // Initialize i18n
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ToastContainer';
import ProtectedRoute, { GuestOnlyRoute, AdminRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import TemporaryPasswordLoginPage from './components/TemporaryPasswordLoginPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import SetPasswordPage from './components/SetPasswordPage';
import VerificationLinkPage from './components/VerificationLinkPage';
import TwoFactorVerificationPage from './components/TwoFactorVerificationPage';
import EnhancedProfilePage from './components/EnhancedProfilePage';
import PublicProfilePage from './components/PublicProfilePage';
import SearchPage from './components/SearchPage';
import MessagesPage from './components/MessagesPage';
import MatchesPage from './components/MatchesPage';
import LikesPage from './components/LikesPage';
import DashboardPage from './components/DashboardPage';
import AdminDashboard from './components/AdminDashboard';
import SecuritySettingsPage from './components/SecuritySettingsPage';
import VerifyEmailChangePage from './components/VerifyEmailChangePage';
import FeaturesPage from './components/FeaturesPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import HelpCenterPage from './components/HelpCenterPage';
import FAQPage from './components/FAQPage';
import IslamicGuidelinesPage from './components/IslamicGuidelinesPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import NotFoundPage from './components/NotFoundPage';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-white font-arabic" dir="rtl">
            <Header />
            <main>
            <Routes>
              {/* الصفحات العامة */}
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/help-center" element={<HelpCenterPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/islamic-guidelines" element={<IslamicGuidelinesPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />

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
              <Route path="/verify-email" element={
                <GuestOnlyRoute>
                  <SetPasswordPage />
                </GuestOnlyRoute>
              } />
              <Route path="/verification-link" element={
                <GuestOnlyRoute>
                  <VerificationLinkPage />
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
              <Route path="/verify-email-change" element={<VerifyEmailChangePage />} />

              {/* صفحات الإدارة */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />

              {/* صفحة 404 - يجب أن تكون في النهاية */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
