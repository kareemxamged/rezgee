import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, MapPin, Calendar, Heart, Shield, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { emailVerificationService } from '../lib/emailVerification';
import PhoneInput from './PhoneInput';
import VerificationStatus from './VerificationStatus';

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
  maritalStatus: 'single' | 'divorced' | 'widowed';
  acceptTerms: boolean;
  acceptPrivacy: boolean;
};

const RegisterPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  // Schema validation for registration
  const registerSchema = z.object({
    firstName: z.string().min(2, t('auth.register.validation.firstNameMin')),
    lastName: z.string().min(2, t('auth.register.validation.lastNameMin')),
    email: z.string().email(t('auth.register.validation.emailInvalid')),
    age: z.number().min(18, t('auth.register.validation.ageMin')).max(80, t('auth.register.validation.ageMax')),
    gender: z.enum(['male', 'female'], { required_error: t('auth.register.validation.genderRequired') }),
    city: z.string().min(2, t('auth.register.validation.cityMin')),
    maritalStatus: z.enum(['single', 'divorced', 'widowed'], { required_error: t('auth.register.validation.maritalStatusRequired') }),
    acceptTerms: z.boolean().refine(val => val === true, t('auth.register.validation.acceptTermsRequired')),
    acceptPrivacy: z.boolean().refine(val => val === true, t('auth.register.validation.acceptPrivacyRequired'))
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [waitTime, setWaitTime] = useState<number | null>(null);
  const [showVerificationStats, setShowVerificationStats] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  // معالج أخطاء النموذج
  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
    setErrorMessage(t('auth.register.validation.formErrors'));
  };

  const onSubmit = async (data: RegisterFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Phone number:', phoneNumber);
    console.log('Is phone valid:', isPhoneValid);

    // مسح الرسائل السابقة
    setSuccessMessage('');
    setErrorMessage('');
    setWaitTime(null);

    // التحقق من صحة رقم الهاتف
    if (!phoneNumber || phoneNumber.trim() === '') {
      setErrorMessage(t('auth.register.validation.phoneRequired'));
      return;
    }

    if (!isPhoneValid) {
      setErrorMessage(t('auth.register.validation.phoneInvalid'));
      return;
    }

    setIsLoading(true);

    try {
      // الحصول على معلومات المتصفح والـ IP (للأمان)
      const userAgent = navigator.userAgent;
      // ملاحظة: لا يمكن الحصول على IP الحقيقي من المتصفح لأسباب أمنية
      // في بيئة الإنتاج، يجب الحصول على IP من الخادم

      // إنشاء طلب تحقق البريد الإلكتروني
      const result = await emailVerificationService.createVerificationRequest(
        data.email,
        {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: phoneNumber, // استخدام رقم الهاتف مع رمز الدولة
          age: data.age,
          gender: data.gender,
          city: data.city,
          marital_status: data.maritalStatus,
        },
        undefined, // IP address - سيتم تمريره من الخادم في بيئة الإنتاج
        userAgent
      );

      if (result.success && result.token) {
        // عرض معلومات إضافية عن المحاولات إذا كانت متاحة
        let additionalInfo = '';
        if (result.limits) {
          additionalInfo = `\n\n📊 إحصائيات: ${result.limits.dailyAttempts}/12 محاولة اليوم`;
          if (result.limits.consecutiveAttempts > 0) {
            additionalInfo += ` | ${result.limits.consecutiveAttempts} محاولة متتالية`;
          }
        }

        setSuccessMessage(
          `${t('auth.register.messages.verificationSent')} ${data.email}. ` +
          `${t('auth.register.messages.linkValid')}.` +
          additionalInfo
        );

        // مسح النموذج
        reset();
        setPhoneNumber('');

        // إظهار رسالة إضافية بعد 5 ثوان
        setTimeout(() => {
          setSuccessMessage(prev =>
            prev + '\n\n💡 ' + t('auth.register.messages.tip')
          );
        }, 5000);

      } else {
        let errorMsg = result.error || t('auth.register.messages.verificationError');

        // إضافة معلومات إضافية عن القيود
        if (result.limits) {
          if (result.limits.dailyAttempts >= 12) {
            errorMsg += `\n\n⚠️ ${t('auth.register.messages.dailyLimitReached')} (${result.limits.dailyAttempts}/12 ${t('auth.register.messages.attempts')})`;
          } else if (result.limits.consecutiveAttempts >= 4) {
            errorMsg += `\n\n⚠️ ${t('auth.register.messages.consecutiveLimitReached')} (${result.limits.consecutiveAttempts}/4)`;
          }

          if (result.limits.nextAllowedTime) {
            const nextTime = new Date(result.limits.nextAllowedTime);
            errorMsg += `\n⏰ ${t('auth.register.messages.nextAttemptTime')} ${nextTime.toLocaleString(i18n.language === 'ar' ? 'ar-SA' : 'en-US')}`;
          }
        }

        setErrorMessage(errorMsg);
        if (result.waitTime) {
          setWaitTime(result.waitTime);
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorMessage(t('auth.register.messages.unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 py-6 md:py-12" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-32 h-32 md:w-64 md:h-64 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 md:mb-4 font-display">
            {t('auth.register.title')}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 mb-4 md:mb-6 px-4">
            {t('auth.register.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-slate-600 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
              <span>{t('auth.register.features.secure')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
              <span>{t('auth.register.features.verified')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
              <span>{t('auth.register.features.free')}</span>
            </div>
          </div>
        </div>

        {/* رسائل النجاح والخطأ */}
        {successMessage && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-emerald-50 border border-emerald-200 rounded-lg md:rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-800 text-sm md:text-base leading-relaxed">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg md:rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-red-800 text-sm md:text-base">
              <p>{errorMessage}</p>
              {waitTime && (
                <p className="text-xs md:text-sm mt-1 opacity-80">
                  {t('auth.register.messages.waitTime')} {waitTime} {t('auth.register.messages.minutes')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Verification Status - عرض إحصائيات التحقق */}
        {currentEmail && showVerificationStats && (
          <div className="mb-6">
            <VerificationStatus
              email={currentEmail}
              onStatsUpdate={(stats) => {
                // يمكن استخدام الإحصائيات لتحديث واجهة المستخدم
                console.log('Verification stats updated:', stats);
              }}
            />
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-white/20 p-4 md:p-6 lg:p-8">
          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4 md:space-y-6">
            {/* Personal Information */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                <User className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                {t('auth.register.personalInfo')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                    {t('auth.register.firstName')} *
                  </label>
                  <input
                    type="text"
                    {...register('firstName')}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-slate-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                    placeholder={t('auth.register.firstNamePlaceholder')}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                    {t('auth.register.lastName')} *
                  </label>
                  <input
                    type="text"
                    {...register('lastName')}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-slate-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                    placeholder={t('auth.register.lastNamePlaceholder')}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    {t('auth.register.email')} *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5`} />
                    <input
                      type="email"
                      {...register('email')}
                      onChange={(e) => {
                        setCurrentEmail(e.target.value);
                        // إخفاء الإحصائيات عند تغيير البريد الإلكتروني
                        if (showVerificationStats) {
                          setShowVerificationStats(false);
                        }
                      }}
                      className={`w-full px-4 py-3 ${i18n.language === 'ar' ? 'pr-12' : 'pl-12'} border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                      placeholder={t('auth.register.emailPlaceholder')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}

                  {/* زر عرض إحصائيات التحقق */}
                  {currentEmail && currentEmail.includes('@') && (
                    <button
                      type="button"
                      onClick={() => setShowVerificationStats(!showVerificationStats)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      {showVerificationStats ? t('auth.register.verification.hideStats') : t('auth.register.verification.showStats')}
                    </button>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    {t('auth.register.phone')} *
                  </label>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={(fullPhone, isValid) => {
                      setPhoneNumber(fullPhone);
                      setIsPhoneValid(isValid);
                    }}
                    placeholder={t('auth.register.phonePlaceholder')}
                    error={!isPhoneValid && phoneNumber ? t('auth.register.validation.phoneInvalid') : undefined}
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    {t('auth.register.age')} *
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5`} />
                    <input
                      type="number"
                      {...register('age', { valueAsNumber: true })}
                      className={`w-full px-4 py-3 ${i18n.language === 'ar' ? 'pr-12' : 'pl-12'} border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                      placeholder={t('auth.register.agePlaceholder')}
                      min="18"
                      max="80"
                    />
                  </div>
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    {t('auth.register.city')} *
                  </label>
                  <div className="relative">
                    <MapPin className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5`} />
                    <input
                      type="text"
                      {...register('city')}
                      className={`w-full px-4 py-3 ${i18n.language === 'ar' ? 'pr-12' : 'pl-12'} border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                      placeholder={t('auth.register.cityPlaceholder')}
                    />
                  </div>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    {t('auth.register.gender')} *
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">{t('auth.register.genderOptions.placeholder')}</option>
                    <option value="male">{t('auth.register.genderOptions.male')}</option>
                    <option value="female">{t('auth.register.genderOptions.female')}</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                  )}
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    {t('auth.register.maritalStatus')} *
                  </label>
                  <select
                    {...register('maritalStatus')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">{t('auth.register.maritalStatusOptions.placeholder')}</option>
                    <option value="single">{t('auth.register.maritalStatusOptions.single')}</option>
                    <option value="divorced">{t('auth.register.maritalStatusOptions.divorced')}</option>
                    <option value="widowed">{t('auth.register.maritalStatusOptions.widowed')}</option>
                  </select>
                  {errors.maritalStatus && (
                    <p className="text-red-500 text-sm mt-1">{errors.maritalStatus.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register('acceptTerms')}
                  className="mt-1 w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
                <label className="text-slate-700">
                  {t('auth.register.terms.acceptTerms')}{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                    {t('auth.register.terms.termsLink')}
                  </Link>
                  {' '}{t('auth.register.terms.termsText')}
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
              )}

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register('acceptPrivacy')}
                  className="mt-1 w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
                <label className="text-slate-700">
                  {t('auth.register.terms.acceptPrivacy')}{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                    {t('auth.register.terms.privacyLink')}
                  </Link>
                  {' '}{t('auth.register.terms.privacyText')}
                </label>
              </div>
              {errors.acceptPrivacy && (
                <p className="text-red-500 text-sm">{errors.acceptPrivacy.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-emerald-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('auth.register.submitButtonLoading')}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    {t('auth.register.submitButton')}
                  </div>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-slate-600">
                {t('auth.register.alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  {t('auth.register.loginLink')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
