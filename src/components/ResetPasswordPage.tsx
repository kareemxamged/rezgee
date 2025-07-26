import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// نوع بيانات النموذج
type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams(); // غير مستخدم حالياً
  
  // Schema validation
  const resetPasswordSchema = z.object({
    password: z.string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم'),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

  // حالات المكون
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const watchedPassword = watch('password');

  // فحص صحة جلسة إعادة تعيين كلمة المرور
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setErrorMessage('رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية');
          return;
        }

        if (session) {
          setIsValidSession(true);
        } else {
          setErrorMessage('رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setErrorMessage('حدث خطأ في التحقق من صحة الرابط');
      }
    };

    checkSession();
  }, []);

  // دالة إعادة تعيين كلمة المرور
  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) {
        console.error('Error updating password:', error);
        setErrorMessage('فشل في تحديث كلمة المرور. يرجى المحاولة مرة أخرى.');
        return;
      }

      setSuccessMessage('تم تحديث كلمة المرور بنجاح! سيتم توجيهك لصفحة تسجيل الدخول...');
      
      // توجيه المستخدم لصفحة تسجيل الدخول بعد 3 ثوان
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      console.error('Error in password reset:', error);
      setErrorMessage('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidSession && !errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من صحة الرابط...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إعادة تعيين كلمة المرور</h1>
          <p className="text-gray-600">
            أدخل كلمة المرور الجديدة لحسابك
          </p>
        </div>

        {/* النموذج */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isValidSession ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off" noValidate>
              {/* حقل كلمة المرور الجديدة */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`block w-full pr-10 pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="أدخل كلمة المرور الجديدة"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-bwignore="true"
                    data-dashlane-ignore="true"
                    data-lastpass-ignore="true"
                    data-bitwarden-ignore="true"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* حقل تأكيد كلمة المرور */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={`block w-full pr-10 pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="أعد إدخال كلمة المرور"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-bwignore="true"
                    data-dashlane-ignore="true"
                    data-lastpass-ignore="true"
                    data-bitwarden-ignore="true"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* رسائل النجاح والخطأ */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 ml-2" />
                    <div>
                      <p className="text-green-800 font-medium">تم بنجاح!</p>
                      <p className="text-green-700 text-sm mt-1">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 ml-2" />
                    <div>
                      <p className="text-red-800 font-medium">خطأ</p>
                      <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* زر التحديث */}
              <button
                type="submit"
                disabled={isSubmitting || !watchedPassword}
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-white font-medium transition-all duration-200 ${
                  isSubmitting || !watchedPassword
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-200'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                    جاري التحديث...
                  </>
                ) : (
                  'تحديث كلمة المرور'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">رابط غير صالح</h3>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <Link
                to="/forgot-password"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                طلب رابط جديد
              </Link>
            </div>
          )}

          {/* رابط العودة */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
