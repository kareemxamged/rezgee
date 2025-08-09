import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireVerification = false,
  redirectTo = '/login',
  fallback
}) => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  // عرض شاشة التحميل أثناء التحقق من المصادقة
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
              <Shield className="w-8 h-8 text-primary-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">{t('loading.verifyingIdentity')}</h2>
          <p className="text-slate-600">{t('loading.pleaseWait')}</p>
        </div>
      </div>
    );
  }

  // إذا كانت الصفحة تتطلب مصادقة والمستخدم غير مصادق
  if (requireAuth && !isAuthenticated) {
    // حفظ الصفحة المطلوبة للعودة إليها بعد تسجيل الدخول
    const returnUrl = location.pathname + location.search;
    const loginUrl = `${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`;
    
    return <Navigate to={loginUrl} replace />;
  }

  // إذا كانت الصفحة تتطلب تحقق من الهوية والمستخدم غير محقق
  if (requireVerification && userProfile && !userProfile.verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-lg border border-amber-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">حسابك قيد المراجعة</h2>
          <p className="text-slate-600 mb-6">
            يتم مراجعة حسابك من قبل فريق الإدارة. ستتلقى إشعاراً عند اكتمال المراجعة.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/profile'}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              عرض الملف الشخصي
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  // عرض المحتوى إذا تم استيفاء جميع الشروط
  return <>{children}</>;
};

// مكون خاص للصفحات التي تتطلب عدم تسجيل الدخول (مثل صفحة تسجيل الدخول نفسها)
interface GuestOnlyRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const GuestOnlyRoute: React.FC<GuestOnlyRouteProps> = ({
  children,
  redirectTo = '/dashboard'
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  console.log('GuestOnlyRoute check:', {
    isAuthenticated,
    isLoading,
    hasUser: !!user,
    currentPath: location.pathname
  });

  // عرض شاشة التحميل أثناء التحقق من المصادقة
  if (isLoading) {
    console.log('GuestOnlyRoute: Still loading, showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
              <Shield className="w-8 h-8 text-primary-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">{t('loading.verifyingIdentity')}</h2>
          <p className="text-slate-600">{t('loading.pleaseWait')}</p>
        </div>
      </div>
    );
  }

  // إذا كان المستخدم مسجل الدخول، إعادة توجيه للوحة التحكم
  if (isAuthenticated || user) {
    console.log('GuestOnlyRoute: User is authenticated, redirecting from', location.pathname, 'to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // إذا لم يكن مسجل الدخول، عرض المحتوى
  console.log('GuestOnlyRoute: User not authenticated, showing guest content');
  return <>{children}</>;
};



export default ProtectedRoute;
