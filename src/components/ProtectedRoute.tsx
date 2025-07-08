import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Shield, AlertCircle } from 'lucide-react';

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
          <h2 className="text-xl font-semibold text-slate-800 mb-2">جاري التحقق من الهوية</h2>
          <p className="text-slate-600">يرجى الانتظار...</p>
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
  redirectTo = '/profile'
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

// مكون للصفحات التي تتطلب صلاحيات إدارية
interface AdminRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  redirectTo = '/'
}) => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // التحقق من الصلاحيات الإدارية (يمكن تخصيص هذا حسب نظام الصلاحيات)
  const isAdmin = userProfile?.email?.includes('admin') || userProfile?.id === 'admin-user-id';
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-lg border border-red-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">غير مصرح لك</h2>
          <p className="text-slate-600 mb-6">
            ليس لديك صلاحية للوصول إلى هذه الصفحة.
          </p>
          <button
            onClick={() => window.location.href = redirectTo}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
