import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { twoFactorService } from '../lib/twoFactorService';
import { useAuth } from '../contexts/AuthContext';


interface LocationState {
  email?: string;
  userId?: string;
  redirectTo?: string;
  codeType?: 'login' | 'enable_2fa' | 'disable_2fa';
}

const TwoFactorVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, updateProfile, completeTwoFactorLogin } = useAuth();
  
  const state = location.state as LocationState;
  const email = state?.email || userProfile?.email || '';
  const userId = state?.userId || user?.id || '';
  const redirectTo = state?.redirectTo || '/dashboard';
  const codeType = state?.codeType || 'login';
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // التحقق من وجود البيانات المطلوبة
  useEffect(() => {
    if (!email || !userId) {
      navigate('/login');
      return;
    }
    
    // بدء العد التنازلي لإعادة الإرسال (60 ثانية)
    setTimeLeft(60);
    setCanResend(false);
  }, [email, userId, navigate]);

  // العد التنازلي
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // التركيز على أول حقل عند تحميل الصفحة
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // السماح بالأرقام فقط
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // الانتقال للحقل التالي تلقائياً
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // مسح رسائل الخطأ عند الكتابة
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // الرجوع للحقل السابق عند الضغط على Backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // التحقق عند الضغط على Enter
    if (e.key === 'Enter') {
      handleVerification();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerification = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setErrorMessage('يرجى إدخال رمز التحقق كاملاً');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const result = await twoFactorService.verifyCode(userId, verificationCode, codeType);
      
      if (result.success) {
        setSuccessMessage('تم التحقق بنجاح! جاري التوجيه...');

        // تحديث حالة المصادقة الثنائية في قاعدة البيانات
        if (codeType === 'enable_2fa') {
          await updateProfile({ two_factor_enabled: true });
        } else if (codeType === 'disable_2fa') {
          await updateProfile({ two_factor_enabled: false });
        }

        // تأخير قصير لإظهار رسالة النجاح
        setTimeout(async () => {
          if (codeType === 'login') {
            // للمصادقة الثنائية في تسجيل الدخول، نحتاج لإعادة إنشاء الجلسة
            try {
              console.log('Completing 2FA login process...');

              // إكمال تسجيل الدخول بعد التحقق من المصادقة الثنائية
              // البيانات المطلوبة محفوظة مؤقتاً في AuthContext
              const loginResult = await completeTwoFactorLogin(userId, email, '');

              if (loginResult.success) {
                console.log('2FA login completed successfully, redirecting to:', redirectTo);
                navigate(redirectTo);
              } else {
                console.error('Failed to complete 2FA login:', loginResult.error);
                // في حالة الفشل، نوجه المستخدم لصفحة تسجيل الدخول مع رسالة
                navigate('/login', {
                  state: {
                    message: 'تم التحقق بنجاح ولكن فشل في إكمال تسجيل الدخول. يرجى المحاولة مرة أخرى.',
                    email: email
                  }
                });
              }
            } catch (error) {
              console.error('Error handling 2FA login:', error);
              // في حالة الخطأ، نوجه المستخدم لصفحة تسجيل الدخول
              navigate('/login', {
                state: {
                  message: 'حدث خطأ أثناء إكمال تسجيل الدخول. يرجى المحاولة مرة أخرى.',
                  email: email
                }
              });
            }
          } else if (codeType === 'enable_2fa') {
            // العودة لصفحة الإعدادات مع رسالة نجاح
            navigate('/security', {
              state: { message: 'تم تفعيل المصادقة الثنائية بنجاح' }
            });
          } else if (codeType === 'disable_2fa') {
            // العودة لصفحة الإعدادات مع رسالة نجاح
            navigate('/security', {
              state: { message: 'تم إلغاء تفعيل المصادقة الثنائية بنجاح' }
            });
          }
        }, 1500);
      } else {
        setErrorMessage(result.message);
        // مسح الرمز المدخل عند الخطأ
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      setErrorMessage('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || isResending) return;
    
    setIsResending(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const result = await twoFactorService.sendVerificationCode(
        userId,
        email,
        codeType
      );
      
      if (result.success) {
        setSuccessMessage('تم إرسال رمز جديد إلى بريدك الإلكتروني');
        setTimeLeft(60);
        setCanResend(false);
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Resend error:', error);
      setErrorMessage('فشل في إعادة إرسال الرمز. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsResending(false);
    }
  };

  const getPageTitle = () => {
    switch (codeType) {
      case 'enable_2fa':
        return 'تفعيل المصادقة الثنائية';
      case 'disable_2fa':
        return 'إلغاء المصادقة الثنائية';
      default:
        return 'التحقق من الهوية';
    }
  };

  const getPageDescription = () => {
    switch (codeType) {
      case 'enable_2fa':
        return 'أدخل رمز التحقق لتفعيل المصادقة الثنائية';
      case 'disable_2fa':
        return 'أدخل رمز التحقق لإلغاء تفعيل المصادقة الثنائية';
      default:
        return 'أدخل رمز التحقق المرسل إلى بريدك الإلكتروني';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 py-8" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 font-display">
            {getPageTitle()}
          </h1>
          <p className="text-slate-600">
            {getPageDescription()}
          </p>
        </div>

        {/* Email Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-blue-800 text-sm font-medium">تم إرسال الرمز إلى:</p>
            <p className="text-blue-700 text-sm">{email}</p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-800 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Verification Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="mb-6">
            <label className="block text-slate-700 font-medium mb-4 text-center">
              رمز التحقق
            </label>
            
            {/* Code Input */}
            <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerification}
              disabled={isLoading || code.join('').length !== 6}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-xl font-medium hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري التحقق...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  تحقق من الرمز
                </>
              )}
            </button>
          </div>

          {/* Resend Section */}
          <div className="text-center pt-6 border-t border-slate-200">
            <p className="text-slate-600 text-sm mb-3">
              لم تستلم الرمز؟
            </p>
            
            {canResend ? (
              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                {isResending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    إعادة إرسال الرمز
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                <Clock className="w-4 h-4" />
                يمكنك طلب رمز جديد خلال {timeLeft} ثانية
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            الرمز صالح لمدة 10 دقائق فقط
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerificationPage;
