import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowRight, AlertCircle, CheckCircle, Clock, Shield, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next'; // غير مستخدم حالياً
import { createTemporaryPassword } from '../lib/temporaryPasswordService';
import { sendTemporaryPasswordEmail } from '../lib/temporaryPasswordEmailService';

// نوع بيانات النموذج
type ForgotPasswordFormData = {
  email: string;
};

const ForgotPasswordPage: React.FC = () => {
  // const { t } = useTranslation(); // غير مستخدم حالياً
  const navigate = useNavigate();
  
  // Schema validation
  const forgotPasswordSchema = z.object({
    email: z.string().email('يرجى إدخال بريد إلكتروني صحيح')
  });

  // حالات المكون
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [waitTime, setWaitTime] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const watchedEmail = watch('email');

  // دالة إرسال طلب كلمة المرور المؤقتة
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setWaitTime(null);
    setIsBlocked(false);

    try {
      // إنشاء كلمة المرور المؤقتة
      const result = await createTemporaryPassword(data.email);

      if (result.success && result.temporaryPassword && result.expiresAt) {
        // إرسال البريد الإلكتروني
        const emailResult = await sendTemporaryPasswordEmail(
          data.email,
          result.temporaryPassword,
          result.expiresAt,
          result.recipientName
        );

        if (emailResult.success) {
          setSuccessMessage(
            `تم إرسال كلمة المرور المؤقتة إلى بريدك الإلكتروني. ستنتهي صلاحيتها خلال 60 دقيقة.`
          );

          // توجيه المستخدم لصفحة استخدام كلمة المرور المؤقتة بعد 3 ثوان
          setTimeout(() => {
            navigate(`/temporary-password-login?email=${encodeURIComponent(data.email)}`);
          }, 3000);
        } else {
          setErrorMessage('تم إنشاء كلمة المرور المؤقتة ولكن فشل إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.');
        }
      } else {
        // معالجة الأخطاء المختلفة
        if (result.isBlocked) {
          setIsBlocked(true);
          setErrorMessage(result.blockReason || 'تم حظر الحساب مؤقتاً');
        } else if (result.waitTime) {
          setWaitTime(result.waitTime);
          setErrorMessage(`يجب الانتظار ${result.waitTime} دقيقة قبل الطلب مرة أخرى`);
        } else {
          setErrorMessage(result.error || 'حدث خطأ أثناء إنشاء كلمة المرور المؤقتة');
        }
      }
    } catch (error) {
      console.error('Error in forgot password:', error);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">نسيت كلمة المرور</h1>
          <p className="text-gray-600">
            أدخل بريدك الإلكتروني وسنرسل لك كلمة مرور مؤقتة
          </p>
        </div>

        {/* النموذج */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            {/* رسائل النجاح والخطأ */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 ml-2" />
                  <div>
                    <p className="text-green-800 font-medium">تم الإرسال بنجاح!</p>
                    <p className="text-green-700 text-sm mt-1">{successMessage}</p>
                    <div className="mt-3">
                      <Link
                        to={`/temporary-password-login?email=${encodeURIComponent(watchedEmail || '')}`}
                        className="inline-flex items-center text-green-700 hover:text-green-800 font-medium text-sm"
                      >
                        استخدام كلمة المرور المؤقتة الآن
                        <ArrowRight className="w-4 h-4 mr-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className={`border rounded-lg p-4 ${
                isBlocked ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start">
                  {isBlocked ? (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 ml-2" />
                  ) : waitTime ? (
                    <Clock className="w-5 h-5 text-yellow-500 mt-0.5 ml-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 ml-2" />
                  )}
                  <div>
                    <p className={`font-medium ${
                      isBlocked ? 'text-red-800' : 'text-yellow-800'
                    }`}>
                      {isBlocked ? 'تم حظر الحساب' : waitTime ? 'يجب الانتظار' : 'تنبيه'}
                    </p>
                    <p className={`text-sm mt-1 ${
                      isBlocked ? 'text-red-700' : 'text-yellow-700'
                    }`}>
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* زر الإرسال */}
            <button
              type="submit"
              disabled={isSubmitting || !watchedEmail || !!waitTime}
              className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-white font-medium transition-all duration-200 ${
                isSubmitting || !watchedEmail || !!waitTime
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-200'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  إرسال كلمة المرور المؤقتة
                  <ArrowRight className="w-5 h-5 mr-2" />
                </>
              )}
            </button>
          </form>

          {/* معلومات مهمة */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 ml-2" />
              <div>
                <h3 className="text-blue-800 font-medium mb-2">معلومات مهمة:</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• كلمة المرور المؤقتة صالحة لمدة 60 دقيقة فقط</li>
                  <li>• يمكن استخدامها مرة واحدة فقط</li>
                  <li>• ستصبح كلمة المرور الأساسية عند أول استخدام</li>
                  <li>• يُنصح بتغيير كلمة المرور بعد تسجيل الدخول</li>
                  <li>• يمكنك أيضاً استخدام كلمة المرور الأصلية إذا كنت تتذكرها</li>
                </ul>
              </div>
            </div>
          </div>

          {/* قيود الأمان */}
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-gray-500 mt-0.5 ml-2" />
              <div>
                <h3 className="text-gray-800 font-medium mb-2">قيود الأمان:</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• 3 طلبات كحد أقصى في اليوم الواحد</li>
                  <li>• فترة انتظار 5 دقائق بين الطلبات</li>
                  <li>• حظر شهري بعد 12 طلب غير مستخدم</li>
                </ul>
              </div>
            </div>
          </div>

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

export default ForgotPasswordPage;
