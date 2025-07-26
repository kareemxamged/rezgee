import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Key,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  Users,
  Settings,
  Save,
  RefreshCw,

} from 'lucide-react';
import { validatePasswordStrength } from '../utils/security';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import PhoneInput from './PhoneInput';

// Schema for security settings (بدون حقول كلمة المرور)
const securitySchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  twoFactorEnabled: z.boolean(),
  showPhone: z.boolean(),
  showEmail: z.boolean(),
  allowMessages: z.boolean(),
  familyCanView: z.boolean(),
  profileVisibility: z.enum(['public', 'members', 'verified']),
  loginNotifications: z.boolean(),
  messageNotifications: z.boolean()
});

// Schema منفصل لتغيير كلمة المرور (لم نعد نحتاجه لأننا نستخدم HTML validation)
// const passwordChangeSchema = z.object({
//   currentPassword: z.string().min(1, 'يجب إدخال كلمة المرور الحالية'),
//   newPassword: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
//   confirmPassword: z.string().min(1, 'يجب تأكيد كلمة المرور الجديدة')
// }).refine((data) => data.newPassword === data.confirmPassword, {
//   message: "كلمة المرور الجديدة وتأكيدها غير متطابقتين",
//   path: ["confirmPassword"]
// });

type SecurityFormData = z.infer<typeof securitySchema>;
// type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>; // لم نعد نحتاجه

const SecuritySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, updateProfile, enableTwoFactor, disableTwoFactor, refreshProfile, isLoading: authLoading, isAuthenticated } = useAuth();

  // حالات نموذج الإعدادات العامة
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [, setIsPhoneValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // حالات نموذج معلومات التواصل المنفصل
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [contactSuccessMessage, setContactSuccessMessage] = useState('');
  const [contactErrorMessage, setContactErrorMessage] = useState('');

  // حالات تحديث البريد الإلكتروني
  const [pendingEmailChange, setPendingEmailChange] = useState<string | null>(null);
  const [emailChangeToken, setEmailChangeToken] = useState<string | null>(null);

  // حالات نموذج تغيير كلمة المرور المنفصل
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [currentPasswordValue, setCurrentPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

  // حساب قوة كلمة المرور باستخدام useMemo لتجنب إعادة الحساب المستمرة
  const passwordStrength = useMemo(() => {
    if (!newPasswordValue) return { score: 0, feedback: [] as string[] };
    return validatePasswordStrength(newPasswordValue);
  }, [newPasswordValue]);



  // نموذج الإعدادات العامة
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      email: '',
      twoFactorEnabled: false,
      showPhone: false,
      showEmail: true,
      allowMessages: true,
      familyCanView: true,
      profileVisibility: 'verified',
      loginNotifications: true,
      messageNotifications: true
    }
  });

  // لم نعد نحتاج react-hook-form لنموذج كلمة المرور لأننا نستخدم HTML form validation

  // تحميل بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    if (userProfile) {
      console.log('SecuritySettingsPage: Loading user profile data:', {
        phone: userProfile.phone,
        email: userProfile.email,
        id: userProfile.id
      });

      setValue('email', userProfile.email || '');
      setValue('twoFactorEnabled', userProfile.two_factor_enabled || false);
      setValue('showPhone', userProfile.show_phone || false);
      setValue('showEmail', userProfile.show_email || false);
      setValue('allowMessages', userProfile.allow_messages || true);
      setValue('familyCanView', userProfile.family_can_view || false);
      setValue('profileVisibility', userProfile.profile_visibility || 'verified');
      setValue('loginNotifications', userProfile.login_notifications || true);
      setValue('messageNotifications', userProfile.message_notifications || true);

      const phoneValue = userProfile.phone || '';
      console.log('SecuritySettingsPage: Setting phone number to:', phoneValue);
      setPhoneNumber(phoneValue);
      setIsPhoneValid(!!phoneValue);
    }
  }, [userProfile, setValue]);

  // التحقق من طلبات تحديث البريد الإلكتروني المعلقة
  useEffect(() => {
    const checkPendingEmailChange = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('email_change_requests')
          .select('new_email, verification_token, expires_at')
          .eq('user_id', user.id)
          .eq('verified', false)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error checking pending email change:', error);
          return;
        }

        if (data && data.length > 0) {
          const request = data[0];
          setPendingEmailChange(request.new_email);
          setEmailChangeToken(request.verification_token);
        }
      } catch (error) {
        console.error('Error checking pending email change:', error);
      }
    };

    checkPendingEmailChange();
  }, [user]);

  // مراقبة قوة كلمة المرور تتم الآن في onChange handler



  // تم نقل منع الاقتراحات إلى SecurePasswordInput component



  // معالجة رسائل النجاح من صفحة التحقق
  useEffect(() => {
    const state = location.state as { message?: string };
    if (state?.message) {
      // إذا كانت الرسالة متعلقة بالبريد الإلكتروني، اعرضها في قسم معلومات التواصل
      if (state.message.includes('البريد الإلكتروني')) {
        setContactSuccessMessage(state.message);
        // إخفاء الرسالة بعد 5 ثوان
        setTimeout(() => {
          setContactSuccessMessage('');
        }, 5000);
      } else {
        setSuccessMessage(state.message);
        // إخفاء الرسالة بعد 5 ثوان
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
      // مسح الرسالة من التاريخ
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);









  // دالة إنشاء طلب تحديث البريد الإلكتروني
  const createEmailChangeRequest = async (newEmail: string, newPhone?: string) => {
    try {
      if (!user) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      // إنشاء token فريد
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // ينتهي خلال 24 ساعة

      // حفظ طلب التحديث في قاعدة البيانات
      const { error } = await supabase
        .from('email_change_requests')
        .insert({
          user_id: user.id,
          current_email: user.email,
          new_email: newEmail,
          new_phone: newPhone,
          verification_token: token,
          expires_at: expiresAt.toISOString()
        });

      if (error) {
        throw new Error(`فشل في إنشاء طلب التحديث: ${error.message}`);
      }

      // إرسال بريد التأكيد (محاكاة)
      console.log('إرسال بريد تأكيد إلى:', user.email);
      console.log('رابط التأكيد:', `${window.location.origin}/verify-email-change?token=${token}`);

      // في التطبيق الحقيقي، ستقوم بإرسال بريد إلكتروني فعلي هنا
      // await sendEmailVerification(user.email, token);

      setPendingEmailChange(newEmail);
      setEmailChangeToken(token);

      return true;
    } catch (error) {
      console.error('Error creating email change request:', error);
      throw error;
    }
  };

  // دالة إلغاء طلب تحديث البريد الإلكتروني
  const cancelEmailChangeRequest = async () => {
    try {
      if (!user || !emailChangeToken) return;

      const { error } = await supabase
        .from('email_change_requests')
        .delete()
        .eq('user_id', user.id)
        .eq('verification_token', emailChangeToken);

      if (error) {
        console.error('Error canceling email change request:', error);
        setContactErrorMessage('فشل في إلغاء طلب تحديث البريد الإلكتروني');
        return;
      }

      setPendingEmailChange(null);
      setEmailChangeToken(null);
      setContactSuccessMessage('تم إلغاء طلب تحديث البريد الإلكتروني');

      setTimeout(() => {
        setContactSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error canceling email change request:', error);
      setContactErrorMessage('حدث خطأ أثناء إلغاء طلب تحديث البريد الإلكتروني');
    }
  };

  // معالجة إرسال نموذج معلومات التواصل
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactLoading(true);
    setContactErrorMessage('');
    setContactSuccessMessage('');

    try {
      if (!user) {
        setContactErrorMessage('يجب تسجيل الدخول أولاً');
        return;
      }

      // الحصول على البيانات من النموذج
      const formData = new FormData(e.target as HTMLFormElement);
      const newEmail = formData.get('email') as string;
      const currentEmail = user.email;

      console.log('Updating contact info for user:', user.id);
      console.log('Phone:', phoneNumber);
      console.log('Email change:', currentEmail, '->', newEmail);

      // التحقق من تغيير البريد الإلكتروني
      if (newEmail && newEmail !== currentEmail) {
        // إنشاء طلب تحديث البريد الإلكتروني مع رقم الهاتف
        await createEmailChangeRequest(newEmail, phoneNumber);
        setContactSuccessMessage('تم إرسال رابط تأكيد تحديث البريد الإلكتروني إلى بريدك الحالي. يرجى التحقق من بريدك الإلكتروني.');
      } else {
        // تحديث رقم الهاتف فقط
        const { data, error } = await supabase
          .from('users')
          .update({
            phone: phoneNumber,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select('id, phone, updated_at');

        if (error) {
          console.error('Error updating contact info:', error);
          setContactErrorMessage(`حدث خطأ أثناء تحديث معلومات التواصل: ${error.message || 'خطأ غير معروف'}`);
          return;
        }

        console.log('Contact info updated successfully:', data);
        setContactSuccessMessage('تم تحديث رقم الهاتف بنجاح!');
      }

      // إخفاء رسالة النجاح بعد 5 ثوان
      setTimeout(() => {
        setContactSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Contact update error:', error);
      setContactErrorMessage('حدث خطأ أثناء تحديث معلومات التواصل');
    } finally {
      setIsContactLoading(false);
    }
  };

  // معالج تغيير حالة المصادقة الثنائية
  const handleTwoFactorToggle = async (enabled: boolean) => {
    console.log('handleTwoFactorToggle called:', { enabled, authLoading, isAuthenticated, hasUser: !!user, hasUserProfile: !!userProfile });

    // التحقق من حالة المصادقة أولاً
    if (authLoading) {
      setErrorMessage('يرجى الانتظار حتى اكتمال تحميل البيانات');
      setValue('twoFactorEnabled', !enabled); // إعادة تعيين المفتاح
      return;
    }

    if (!isAuthenticated || !user) {
      setErrorMessage('يجب تسجيل الدخول أولاً');
      setValue('twoFactorEnabled', !enabled); // إعادة تعيين المفتاح
      return;
    }

    if (!userProfile) {
      setErrorMessage('لم يتم تحميل بيانات المستخدم بعد، يرجى المحاولة مرة أخرى');
      setValue('twoFactorEnabled', !enabled); // إعادة تعيين المفتاح
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      if (enabled) {
        console.log('Attempting to enable 2FA...');
        // تفعيل المصادقة الثنائية
        const result = await enableTwoFactor();
        console.log('Enable 2FA result:', result);

        if (result.success) {
          // التوجه لصفحة التحقق
          navigate('/two-factor-verification', {
            state: {
              email: userProfile.email,
              codeType: 'enable_2fa'
            }
          });
        } else {
          setErrorMessage(result.error || 'فشل في تفعيل المصادقة الثنائية');
          setValue('twoFactorEnabled', false); // إعادة تعيين المفتاح
        }
      } else {
        console.log('Attempting to disable 2FA...');
        // إلغاء تفعيل المصادقة الثنائية
        const result = await disableTwoFactor();
        console.log('Disable 2FA result:', result);

        if (result.success) {
          // التوجه لصفحة التحقق
          navigate('/two-factor-verification', {
            state: {
              email: userProfile.email,
              codeType: 'disable_2fa'
            }
          });
        } else {
          setErrorMessage(result.error || 'فشل في إلغاء تفعيل المصادقة الثنائية');
          setValue('twoFactorEnabled', true); // إعادة تعيين المفتاح
        }
      }
    } catch (error) {
      console.error('Two factor toggle error:', error);
      setErrorMessage('حدث خطأ غير متوقع');
      setValue('twoFactorEnabled', !enabled); // إعادة تعيين المفتاح
    } finally {
      setIsLoading(false);
    }
  };

  // دالة تحديث الإعدادات العامة (بدون كلمة المرور)
  const onSubmit = async (data: SecurityFormData) => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      if (!user || !userProfile) {
        setErrorMessage('يجب تسجيل الدخول أولاً');
        return;
      }

      // تحديث البيانات
      const updates = {
        email: data.email,
        phone: phoneNumber,
        two_factor_enabled: data.twoFactorEnabled,
        show_phone: data.showPhone,
        show_email: data.showEmail,
        allow_messages: data.allowMessages,
        family_can_view: data.familyCanView,
        profile_visibility: data.profileVisibility,
        login_notifications: data.loginNotifications,
        message_notifications: data.messageNotifications
      };

      const result = await updateProfile(updates);

      if (result.success) {
        // التحقق من وجود رسالة خاصة (مثل تأكيد البريد الإلكتروني)
        if (result.error && result.error.includes('تأكيد')) {
          // هذه رسالة إعلامية وليس خطأ
          setSuccessMessage(result.error);
        } else {
          setSuccessMessage('تم تحديث إعدادات الأمان والخصوصية بنجاح!');
        }

        // إعادة تحميل بيانات المستخدم لضمان التحديث في الواجهة
        await refreshProfile();
      } else {
        setErrorMessage(result.error || 'حدث خطأ أثناء تحديث الإعدادات');
      }
    } catch (error) {
      console.error('Security update error:', error);
      setErrorMessage('حدث خطأ غير متوقع أثناء تحديث الإعدادات');
    } finally {
      setIsLoading(false);
    }
  };

  // دالة تغيير كلمة المرور المنفصلة
  const handlePasswordFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // منع السلوك الافتراضي

    // استخدام state بدلاً من FormData
    const currentPassword = currentPasswordValue;
    const newPassword = newPasswordValue;
    const confirmPassword = confirmPasswordValue;

    // التحقق من الحقول المطلوبة
    if (!currentPassword) {
      setPasswordErrorMessage('يجب إدخال كلمة المرور الحالية');
      return;
    }

    if (!newPassword) {
      setPasswordErrorMessage('يجب إدخال كلمة المرور الجديدة');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordErrorMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMessage('كلمة المرور الجديدة وتأكيدها غير متطابقتين');
      return;
    }

    setIsPasswordLoading(true);
    setPasswordSuccessMessage('');
    setPasswordErrorMessage('');

    try {
      if (!user || !userProfile) {
        setPasswordErrorMessage('يجب تسجيل الدخول أولاً');
        return;
      }

      // التحقق من كلمة المرور الحالية
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userProfile.email,
        password: currentPassword
      });

      if (signInError) {
        setPasswordErrorMessage('كلمة المرور الحالية غير صحيحة');
        return;
      }

      // تحديث كلمة المرور
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (passwordError) {
        setPasswordErrorMessage('فشل في تحديث كلمة المرور: ' + passwordError.message);
        return;
      }

      setPasswordSuccessMessage('تم تحديث كلمة المرور بنجاح!');

      // مسح النموذج
      setCurrentPasswordValue('');
      setNewPasswordValue('');
      setConfirmPasswordValue('');

      // إخفاء رسالة النجاح بعد 5 ثوان
      setTimeout(() => {
        setPasswordSuccessMessage('');
      }, 5000);

    } catch (error) {
      console.error('Password update error:', error);
      setPasswordErrorMessage('حدث خطأ غير متوقع أثناء تحديث كلمة المرور');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 2) return 'ضعيفة';
    if (score <= 3) return 'متوسطة';
    return 'قوية';
  };

  // عرض شاشة التحميل إذا كانت البيانات لا تزال تحمل
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">جاري تحميل إعدادات الأمان...</p>
        </div>
      </div>
    );
  }

  // التحقق من المصادقة
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-slate-600 mb-4">يجب تسجيل الدخول للوصول لهذه الصفحة</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 py-8" dir="rtl">



      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-display">
            إعدادات الأمان والخصوصية
          </h1>
          <p className="text-xl text-slate-600">
            احم حسابك وتحكم في خصوصيتك
          </p>
        </div>

        {/* رسائل النجاح والخطأ */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-800 text-sm leading-relaxed">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* قسم معلومات التواصل المنفصل */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Phone className="w-6 h-6 text-primary-600" />
            معلومات التواصل
          </h2>
          <p className="text-slate-600 mb-6 text-sm">
            قم بتحديث معلومات التواصل الخاصة بك
          </p>

          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  البريد الإلكتروني *
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  رقم الهاتف
                </label>
                <PhoneInput
                  value={phoneNumber}
                  onChange={(fullPhone, isValid) => {
                    console.log('SecuritySettingsPage: PhoneInput onChange:', { fullPhone, isValid });
                    setPhoneNumber(fullPhone);
                    setIsPhoneValid(isValid);
                  }}
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
            </div>

            {/* رسائل النجاح والخطأ */}
            {contactSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <p className="text-emerald-800 font-medium">{contactSuccessMessage}</p>
                </div>
              </div>
            )}

            {contactErrorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 font-medium">{contactErrorMessage}</p>
                </div>
              </div>
            )}

            {/* رسالة تنبيهية لطلب تحديث البريد الإلكتروني المعلق */}
            {pendingEmailChange && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-amber-800 font-medium text-sm">
                      طلب تحديث البريد الإلكتروني معلق
                    </p>
                    <p className="text-amber-700 text-sm mt-1">
                      تم إرسال رابط تأكيد إلى بريدك الحالي لتحديث البريد إلى: <strong>{pendingEmailChange}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={cancelEmailChangeRequest}
                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-800 rounded text-xs font-medium transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* زر حفظ معلومات التواصل */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isContactLoading}
                className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isContactLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    حفظ معلومات التواصل
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* قسم تغيير كلمة المرور المنفصل */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Lock className="w-6 h-6 text-primary-600" />
            تغيير كلمة المرور
          </h2>
          <p className="text-slate-600 mb-6 text-sm">
            قم بتحديث كلمة المرور الخاصة بك لضمان أمان حسابك
          </p>

              <form
                onSubmit={handlePasswordFormSubmit}
                className="space-y-6"
                autoComplete="off"
                noValidate
              >
                {/* Current Password */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    كلمة المرور الحالية
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPasswordValue}
                      onChange={(e) => setCurrentPasswordValue(e.target.value)}
                      placeholder="أدخل كلمة المرور الحالية"
                      className="w-full px-4 py-3 pr-12 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                </div>

                {/* New Password */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPasswordValue}
                      onChange={(e) => setNewPasswordValue(e.target.value)}
                      placeholder="أدخل كلمة مرور جديدة"
                      className="w-full px-4 py-3 pr-12 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>


                  {/* Password Strength Indicator */}
                  {newPasswordValue && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-slate-600">قوة كلمة المرور:</span>
                        <span className={`text-sm font-medium ${
                          passwordStrength.score <= 2 ? 'text-red-600' :
                          passwordStrength.score <= 3 ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {getPasswordStrengthText(passwordStrength.score)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <ul className="mt-2 text-xs text-slate-600 space-y-1">
                          {passwordStrength.feedback.map((feedback, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              {feedback}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPasswordValue}
                      onChange={(e) => setConfirmPasswordValue(e.target.value)}
                      placeholder="أعد إدخال كلمة المرور الجديدة"
                      className="w-full px-4 py-3 pr-12 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                </div>

                {/* رسائل النجاح والخطأ */}
                {passwordSuccessMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <p className="text-emerald-800 font-medium">{passwordSuccessMessage}</p>
                    </div>
                  </div>
                )}

                {passwordErrorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <p className="text-red-800 font-medium">{passwordErrorMessage}</p>
                    </div>
                  </div>
                )}

                {/* زر تحديث كلمة المرور */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isPasswordLoading}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    {isPasswordLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        جاري التحديث...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        تحديث كلمة المرور
                      </>
                    )}
                  </button>
                </div>
              </form>
        </div>

        {/* قسم الإعدادات العامة */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary-600" />
            إعدادات الأمان والخصوصية
          </h2>

          <form
            method="post"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
            className="space-y-8"
          >

              {/* Two-Factor Authentication */}
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h3 className="font-medium text-emerald-800">المصادقة الثنائية</h3>
                      <p className="text-sm text-emerald-700">طبقة حماية إضافية لحسابك</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('twoFactorEnabled')}
                      onChange={(e) => handleTwoFactorToggle(e.target.checked)}
                      disabled={isLoading}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
                  </label>
                </div>
              </div>

            {/* Privacy Settings */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Eye className="w-6 h-6 text-primary-600" />
                إعدادات الخصوصية
              </h2>

              <div className="space-y-4">
                {/* Contact Information Visibility */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-medium text-slate-800 mb-3">إظهار معلومات الاتصال</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-600" />
                        <span className="text-slate-700">رقم الهاتف</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('showPhone')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-600" />
                        <span className="text-slate-700">البريد الإلكتروني</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('showEmail')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Profile Visibility */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-medium text-slate-800 mb-3">من يمكنه رؤية ملفك الشخصي</h3>
                  <select
                    {...register('profileVisibility')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="public">جميع المستخدمين</option>
                    <option value="members">الأعضاء المسجلين فقط</option>
                    <option value="verified">الأعضاء الموثقين فقط</option>
                  </select>
                </div>

                {/* Communication Settings */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-medium text-slate-800 mb-3">إعدادات التواصل</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">السماح بالرسائل</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('allowMessages')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-600" />
                        <span className="text-slate-700">السماح للأهل بالاطلاع</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('familyCanView')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-primary-600" />
                إعدادات الإشعارات
              </h2>
              
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">إشعارات تسجيل الدخول</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('loginNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">إشعارات الرسائل الجديدة</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('messageNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6">
              <button
                type="button"
                onClick={() => reset()}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                إعادة تعيين
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-xl font-medium hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    حفظ الإعدادات
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-600" />
            نصائح الأمان
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <h3 className="font-medium text-slate-800 mb-1">استخدم كلمة مرور قوية</h3>
                <p className="text-slate-600 text-sm">اختر كلمة مرور تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <h3 className="font-medium text-slate-800 mb-1">فعّل المصادقة الثنائية</h3>
                <p className="text-slate-600 text-sm">طبقة حماية إضافية تحمي حسابك من الاختراق</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <h3 className="font-medium text-slate-800 mb-1">احم معلوماتك الشخصية</h3>
                <p className="text-slate-600 text-sm">لا تشارك معلومات حساسة مع أشخاص لا تعرفهم</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <h3 className="font-medium text-slate-800 mb-1">أبلغ عن السلوك المشبوه</h3>
                <p className="text-slate-600 text-sm">ساعدنا في الحفاظ على أمان المجتمع بالإبلاغ عن أي سلوك غير مناسب</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
