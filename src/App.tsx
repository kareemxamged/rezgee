
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n'; // Initialize i18n
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute, { GuestOnlyRoute, AdminRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import SetPasswordPage from './components/SetPasswordPage';
import ProfilePage from './components/ProfilePage';
import SearchPage from './components/SearchPage';
import MessagesPage from './components/MessagesPage';
import MatchesPage from './components/MatchesPage';
import LikesPage from './components/LikesPage';
import DashboardPage from './components/DashboardPage';
import AdminDashboard from './components/AdminDashboard';
import SecuritySettingsPage from './components/SecuritySettingsPage';
import FeaturesPage from './components/FeaturesPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import HelpCenterPage from './components/HelpCenterPage';
import FAQPage from './components/FAQPage';
import IslamicGuidelinesPage from './components/IslamicGuidelinesPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
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
              <Route path="/verify-email" element={
                <GuestOnlyRoute>
                  <SetPasswordPage />
                </GuestOnlyRoute>
              } />

              {/* الصفحات المحمية (تتطلب تسجيل دخول) */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
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

              {/* صفحات الإدارة */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
