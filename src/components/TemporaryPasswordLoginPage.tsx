import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { updatePasswordWithTempPassword } from '../lib/temporaryPasswordService';
import { useAuth } from '../contexts/AuthContext';

// نوع بيانات النموذج
type TemporaryPasswordFormData = {
  email: string;
  temporaryPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const TemporaryPasswordLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();
  
  // Schema validation
  const tempPasswordSchema = z.object({
    email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
    temporaryPassword: z.string().min(1, 'يرجى إدخال كلمة المرور المؤقتة'),
    newPassword: z.string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم'),
    confirmPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

  // حالات المكون
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<TemporaryPasswordFormData>({
    resolver: zodResolver(tempPasswordSchema),
    defaultValues: {
      email: searchParams.get('email') || ''
    }
  });

  const watchedEmail = watch('email');
  const watchedTempPassword = watch('temporaryPassword');
  const watchedNewPassword = watch('newPassword');

  // دالة تحديث كلمة المرور
  const onSubmit = async (data: TemporaryPasswordFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // تحديث كلمة المرور باستخدام كلمة المرور المؤقتة
      const updateResult = await updatePasswordWithTempPassword(
        data.email,
        data.temporaryPassword,
        data.newPassword
      );

      if (!updateResult.success) {
        setErrorMessage(updateResult.error || 'فشل في تحديث كلمة المرور');
        return;
      }

      setSuccessMessage('تم تحديث كلمة المرور بنجاح! جاري تسجيل الدخول...');

      // تسجيل الدخول بكلمة المرور الجديدة
      setTimeout(async () => {
        try {
          const loginResult = await signIn(data.email, data.newPassword);
          
          if (loginResult.success) {
            const returnUrl = searchParams.get('returnUrl') || '/profile';
            navigate(returnUrl);
          } else {
            setErrorMessage('تم تحديث كلمة المرور ولكن فشل تسجيل الدخول. يرجى تسجيل الدخول يدوياً.');
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          }
        } catch (loginError) {
          console.error('Login error after password update:', loginError);
          setErrorMessage('تم تحديث كلمة المرور. يرجى تسجيل الدخول يدوياً.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      }, 2000);

    } catch (error) {
      console.error('Error in temporary password login:', error);
      setErrorMessage('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">استخدام كلمة المرور المؤقتة</h1>
          <p className="text-gray-600">
            أدخل كلمة المرور المؤقتة وحدد كلمة مرور جديدة
          </p>
        </div>

        {/* النموذج */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off" noValidate>
            {/* حقل البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={`block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="أدخل بريدك الإلكتروني"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 ml-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* حقل كلمة المرور المؤقتة */}
            <div>
              <label htmlFor="temporaryPassword" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور المؤقتة
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('temporaryPassword')}
                  type={showTempPassword ? 'text' : 'password'}
                  id="temporaryPassword"
                  className={`block w-full pr-10 pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.temporaryPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="أدخل كلمة المرور المؤقتة"
                  disabled={isSubmitting}
                  autoComplete="current-password"
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
                  onClick={() => setShowTempPassword(!showTempPassword)}
                >
                  {showTempPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.temporaryPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 ml-1" />
                  {errors.temporaryPassword.message}
                </p>
              )}
            </div>

            {/* حقل كلمة المرور الجديدة */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('newPassword')}
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  className={`block w-full pr-10 pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 ml-1" />
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* حقل تأكيد كلمة المرور */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور الجديدة
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
                  placeholder="أعد إدخال كلمة المرور الجديدة"
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
              disabled={isSubmitting || !watchedEmail || !watchedTempPassword || !watchedNewPassword}
              className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-white font-medium transition-all duration-200 ${
                isSubmitting || !watchedEmail || !watchedTempPassword || !watchedNewPassword
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
                <>
                  تحديث كلمة المرور وتسجيل الدخول
                  <ArrowRight className="w-5 h-5 mr-2" />
                </>
              )}
            </button>
          </form>

          {/* روابط إضافية */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/forgot-password"
              className="block text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              طلب كلمة مرور مؤقتة جديدة
            </Link>
            <Link
              to="/login"
              className="block text-gray-600 hover:text-gray-700 transition-colors"
            >
              العودة إلى تسجيل الدخول العادي
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemporaryPasswordLoginPage;
