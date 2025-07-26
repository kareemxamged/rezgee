import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { arabCountries } from '../data/arabCountries';
import {
  User,
  Edit3,
  Save,
  X,
  MapPin,
  Calendar,
  Book,
  GraduationCap,
  Heart,
  Activity,
  DollarSign,
  Globe
} from 'lucide-react';

// Schema للملف الشخصي المطور - يدعم جميع الحقول ولكن يتجاهل التحقق للحقول غير المطلوبة
const enhancedProfileSchema = z.object({
  firstName: z.string().optional().or(z.literal('')),
  lastName: z.string().optional().or(z.literal('')),
  age: z.number().min(18, 'العمر يجب أن يكون 18 سنة على الأقل').max(80, 'العمر يجب أن يكون أقل من 80 سنة').optional(),
  city: z.string().optional().or(z.literal('')),

  // الحالة الاجتماعية المطورة
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'unmarried', 'divorced_female', 'widowed_female']).optional().or(z.literal('')),
  marriageType: z.enum(['first_wife', 'second_wife', 'only_wife', 'no_objection_polygamy']).optional().or(z.literal('')),
  childrenCount: z.number().min(0).max(20).optional(),

  // الجنسية والإقامة
  residenceLocation: z.string().optional().or(z.literal('')),
  nationality: z.string().optional().or(z.literal('')),

  // المواصفات الجسدية
  weight: z.number().min(30).max(300).optional(),
  height: z.number().min(120).max(250).optional(),
  skinColor: z.enum(['very_fair', 'fair', 'medium', 'olive', 'dark']).optional().or(z.literal('')),
  bodyType: z.enum(['slim', 'average', 'athletic', 'heavy']).optional().or(z.literal('')),

  // الالتزام الديني المطور
  religiosityLevel: z.enum(['not_religious', 'slightly_religious', 'religious', 'very_religious', 'prefer_not_say']).optional().or(z.literal('')),
  prayerCommitment: z.enum(['dont_pray', 'pray_all', 'pray_sometimes', 'prefer_not_say']).optional().or(z.literal('')),
  smoking: z.enum(['yes', 'no']).optional().or(z.literal('')),

  // الحقول الشرطية - متاحة لكلا الجنسين ولكن تظهر حسب الجنس فقط
  beard: z.enum(['yes', 'no']).optional().or(z.literal('')), // للذكور فقط
  hijab: z.enum(['no_hijab', 'hijab', 'niqab', 'prefer_not_say']).optional().or(z.literal('')), // للإناث فقط

  // الدراسة والعمل المطور
  educationLevel: z.enum(['primary', 'secondary', 'diploma', 'bachelor', 'master', 'phd']).optional().or(z.literal('')),
  financialStatus: z.enum(['poor', 'below_average', 'average', 'above_average', 'wealthy']).optional().or(z.literal('')),
  workField: z.string().optional().or(z.literal('')),
  jobTitle: z.string().optional().or(z.literal('')),

  // الدخل والصحة
  monthlyIncome: z.enum(['less_3000', '3000_5000', '5000_8000', '8000_12000', '12000_20000', 'more_20000', 'prefer_not_say']).optional().or(z.literal('')),
  healthStatus: z.enum(['excellent', 'very_good', 'good', 'fair', 'poor', 'prefer_not_say']).optional().or(z.literal('')),

  // الحقول الأصلية
  education: z.string().optional().or(z.literal('')),
  profession: z.string().optional().or(z.literal('')),
  religiousCommitment: z.enum(['high', 'medium', 'practicing']).optional().or(z.literal('')),
  bio: z.string().max(500, 'النبذة الشخصية يجب أن تكون أقل من 500 حرف').optional().or(z.literal('')),
  lookingFor: z.string().max(300, 'ما تبحث عنه يجب أن يكون أقل من 300 حرف').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
});

type EnhancedProfileFormData = z.infer<typeof enhancedProfileSchema>;

// دالة مساعدة لاستخراج البيانات من userProfile
const getEnhancedDisplayData = (userProfile: any): EnhancedProfileFormData => {
  if (!userProfile) {
    return {
      firstName: '',
      lastName: '',
      age: 18,
      city: '',
      maritalStatus: '',
      marriageType: '',
      childrenCount: 0,
      residenceLocation: '',
      nationality: '',
      weight: undefined,
      height: undefined,
      skinColor: '',
      bodyType: '',
      religiosityLevel: '',
      prayerCommitment: '',
      smoking: '',
      beard: '',
      hijab: '',
      educationLevel: '',
      financialStatus: '',
      workField: '',
      jobTitle: '',
      monthlyIncome: '',
      healthStatus: '',
      education: '',
      profession: '',
      religiousCommitment: '',
      bio: '',
      lookingFor: '',
      phone: '',
      email: ''
    };
  }

  return {
    firstName: userProfile.first_name || '',
    lastName: userProfile.last_name || '',
    age: userProfile.age || 18,
    city: userProfile.city || '',
    maritalStatus: userProfile.marital_status || '',
    marriageType: userProfile.marriage_type || '',
    childrenCount: userProfile.children_count || 0,
    residenceLocation: userProfile.residence_location || '',
    nationality: userProfile.nationality || '',
    weight: userProfile.weight,
    height: userProfile.height,
    skinColor: userProfile.skin_color || '',
    bodyType: userProfile.body_type || '',
    religiosityLevel: userProfile.religiosity_level || '',
    prayerCommitment: userProfile.prayer_commitment || '',
    smoking: userProfile.smoking || '',
    beard: userProfile.beard || '',
    hijab: userProfile.hijab || '',
    educationLevel: userProfile.education_level || '',
    financialStatus: userProfile.financial_status || '',
    workField: userProfile.work_field || '',
    jobTitle: userProfile.job_title || '',
    monthlyIncome: userProfile.monthly_income || '',
    healthStatus: userProfile.health_status || '',
    education: userProfile.education || '',
    profession: userProfile.profession || '',
    religiousCommitment: userProfile.religious_commitment || '',
    bio: userProfile.bio || '',
    lookingFor: userProfile.looking_for || '',
    phone: userProfile.phone || '',
    email: userProfile.email || ''
  };
};

// خيارات الترجمة
const getMaritalStatusOptions = (gender: 'male' | 'female') => {
  if (gender === 'male') {
    return [
      { value: 'single', label: 'عازب' },
      { value: 'married', label: 'متزوج' },
      { value: 'divorced', label: 'مطلق' },
      { value: 'widowed', label: 'أرمل' }
    ];
  } else {
    return [
      { value: 'unmarried', label: 'آنسة' },
      { value: 'divorced_female', label: 'مطلقة' },
      { value: 'widowed_female', label: 'أرملة' }
    ];
  }
};

const getMarriageTypeOptions = (gender: 'male' | 'female') => {
  if (gender === 'male') {
    return [
      { value: 'first_wife', label: 'زوجة أولى' },
      { value: 'second_wife', label: 'زوجة ثانية' }
    ];
  } else {
    return [
      { value: 'only_wife', label: 'الوحيدة' },
      { value: 'no_objection_polygamy', label: 'لا مانع من التعدد' }
    ];
  }
};

const religiosityLevelOptions = [
  { value: 'not_religious', label: 'غير متدين' },
  { value: 'slightly_religious', label: 'متدين قليلاً' },
  { value: 'religious', label: 'متدين' },
  { value: 'very_religious', label: 'متدين كثيراً' },
  { value: 'prefer_not_say', label: 'أفضل أن لا أقول' }
];

const prayerCommitmentOptions = [
  { value: 'dont_pray', label: 'لا أصلي' },
  { value: 'pray_all', label: 'أصلي جميع الفروض' },
  { value: 'pray_sometimes', label: 'أصلي أحياناً' },
  { value: 'prefer_not_say', label: 'أفضل أن لا أقول' }
];

const hijabOptions = [
  { value: 'no_hijab', label: 'غير محجبة' },
  { value: 'hijab', label: 'محجبة' },
  { value: 'niqab', label: 'منتقبة' },
  { value: 'prefer_not_say', label: 'أفضل أن لا أقول' }
];

const educationLevelOptions = [
  { value: 'primary', label: 'ابتدائي' },
  { value: 'secondary', label: 'ثانوي' },
  { value: 'diploma', label: 'دبلوم' },
  { value: 'bachelor', label: 'بكالوريوس' },
  { value: 'master', label: 'ماجستير' },
  { value: 'phd', label: 'دكتوراه' }
];

const financialStatusOptions = [
  { value: 'poor', label: 'ضعيف' },
  { value: 'below_average', label: 'أقل من المتوسط' },
  { value: 'average', label: 'متوسط' },
  { value: 'above_average', label: 'أعلى من المتوسط' },
  { value: 'wealthy', label: 'ميسور' }
];

const monthlyIncomeOptions = [
  { value: 'less_3000', label: 'أقل من 3000 ريال' },
  { value: '3000_5000', label: '3000 - 5000 ريال' },
  { value: '5000_8000', label: '5000 - 8000 ريال' },
  { value: '8000_12000', label: '8000 - 12000 ريال' },
  { value: '12000_20000', label: '12000 - 20000 ريال' },
  { value: 'more_20000', label: 'أكثر من 20000 ريال' },
  { value: 'prefer_not_say', label: 'أفضل أن لا أقول' }
];

const healthStatusOptions = [
  { value: 'excellent', label: 'ممتازة' },
  { value: 'very_good', label: 'جيدة جداً' },
  { value: 'good', label: 'جيدة' },
  { value: 'fair', label: 'مقبولة' },
  { value: 'poor', label: 'ضعيفة' },
  { value: 'prefer_not_say', label: 'أفضل أن لا أقول' }
];

const skinColorOptions = [
  { value: 'very_fair', label: 'فاتح جداً' },
  { value: 'fair', label: 'فاتح' },
  { value: 'medium', label: 'متوسط' },
  { value: 'olive', label: 'زيتوني' },
  { value: 'dark', label: 'غامق' }
];

const bodyTypeOptions = [
  { value: 'slim', label: 'نحيف/رفيع' },
  { value: 'average', label: 'متوسط البنية' },
  { value: 'athletic', label: 'جسم رياضي' },
  { value: 'heavy', label: 'ثقيل البنية' }
];

const EnhancedProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid] = useState(true);
  const { userProfile, updateProfile, isLoading, fixMissingProfileData } = useAuth();

  // مراقبة الجنس لإظهار الحقول المناسبة
  const watchedGender = userProfile?.gender || 'male';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<EnhancedProfileFormData>({
    resolver: zodResolver(enhancedProfileSchema),
    mode: 'onChange'
  });

  // تحميل بيانات المستخدم عند تحميل الصفحة مع إصلاح تلقائي
  useEffect(() => {
    if (userProfile) {
      const profileData = getEnhancedDisplayData(userProfile);
      reset(profileData);
      setPhoneNumber(userProfile.phone || '');

      // إصلاح تلقائي للبيانات المفقودة فور تحميل الصفحة
      const autoFixData = async () => {
        // فحص إذا كانت هناك بيانات مفقودة أو خاطئة
        const hasMissingData = !userProfile.membership_number ||
                              !userProfile.first_name ||
                              userProfile.first_name.trim() === '' ||
                              userProfile.first_name === 'المستخدم' || // إصلاح الاسم الافتراضي
                              (!userProfile.education && !userProfile.profession) ||
                              !userProfile.bio;

        if (hasMissingData) {
          console.log('🔧 Auto-fixing missing/incorrect profile data...');
          console.log('📊 Current profile state:', {
            membership_number: userProfile.membership_number,
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            education: userProfile.education,
            profession: userProfile.profession,
            bio: userProfile.bio
          });

          try {
            const result = await fixMissingProfileData();
            if (result.success) {
              console.log('✅ Auto-fix completed:', result.message);
            }
          } catch (error) {
            console.error('❌ Auto-fix failed:', error);
          }
        } else {
          console.log('✅ Profile data appears complete, no auto-fix needed');
        }
      };

      // تشغيل الإصلاح التلقائي بعد تأخير قصير لضمان تحميل البيانات
      setTimeout(autoFixData, 500);
    }
  }, [userProfile, reset, fixMissingProfileData]);

  // Get display data from userProfile
  const displayData = getEnhancedDisplayData(userProfile);

  // دالة مخصصة للتحقق من صحة النموذج
  const isFormValid = () => {

    // التحقق من الحقول الشرطية
    const hasGenderSpecificErrors = () => {
      if (watchedGender === 'male') {
        // للذكور: تجاهل أخطاء حقل الحجاب
        const filteredErrors = Object.keys(errors).filter(key => key !== 'hijab');
        return filteredErrors.length > 0;
      } else {
        // للإناث: تجاهل أخطاء حقل اللحية
        const filteredErrors = Object.keys(errors).filter(key => key !== 'beard');
        return filteredErrors.length > 0;
      }
    };

    return !hasGenderSpecificErrors() && isPhoneValid;
  };

  // تشخيص البيانات
  console.log('🔍 Enhanced Profile Debug:', {
    userProfile,
    displayData,
    isLoading,
    membershipNumber: userProfile?.membership_number,
    errors,
    isValid,
    isFormValid: isFormValid(),
    watchedGender
  });

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">جاري تحميل الملف الشخصي</h2>
            <p className="text-slate-600 mb-6">
              يرجى الانتظار بينما نحمل بياناتك الشخصية...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: EnhancedProfileFormData) => {
    console.log('✅ Starting enhanced profile update...');
    console.log('📊 Form data:', data);
    console.log('👤 User gender:', watchedGender);
    console.log('📝 Form validation status:', {
      isValid,
      isFormValid: isFormValid(),
      isPhoneValid,
      errors
    });

    try {
      // دالة مساعدة لتحويل القيم الفارغة إلى undefined
      const convertEmptyToUndefined = (value: any) => {
        return value === '' ? undefined : value;
      };

      // تحديث الملف الشخصي باستخدام نظام المصادقة
      const result = await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        age: data.age,
        city: data.city,
        marital_status: convertEmptyToUndefined(data.maritalStatus),
        marriage_type: convertEmptyToUndefined(data.marriageType),
        children_count: data.childrenCount,
        residence_location: data.residenceLocation,
        nationality: data.nationality,
        weight: data.weight,
        height: data.height,
        skin_color: convertEmptyToUndefined(data.skinColor),
        body_type: convertEmptyToUndefined(data.bodyType),
        religiosity_level: convertEmptyToUndefined(data.religiosityLevel),
        prayer_commitment: convertEmptyToUndefined(data.prayerCommitment),
        smoking: convertEmptyToUndefined(data.smoking),
        beard: convertEmptyToUndefined(data.beard),
        hijab: convertEmptyToUndefined(data.hijab),
        education_level: convertEmptyToUndefined(data.educationLevel),
        financial_status: convertEmptyToUndefined(data.financialStatus),
        work_field: data.workField,
        job_title: data.jobTitle,
        monthly_income: convertEmptyToUndefined(data.monthlyIncome),
        health_status: convertEmptyToUndefined(data.healthStatus),
        education: data.education,
        profession: data.profession,
        religious_commitment: convertEmptyToUndefined(data.religiousCommitment),
        bio: data.bio,
        looking_for: data.lookingFor,
        phone: phoneNumber
      });

      if (result.success) {
        console.log('✅ Profile updated successfully');
        setIsEditing(false);
      } else {
        console.error('❌ Profile update failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Unexpected error during profile update:', error);
    }
  };

  const onError = (errors: any) => {
    console.log('❌ Form validation errors:', errors);
    console.log('👤 Current gender:', watchedGender);
    console.log('📝 Form is valid according to custom logic:', isFormValid());

    // تفصيل الأخطاء حسب الجنس
    if (watchedGender === 'male' && errors.hijab) {
      console.log('⚠️ Hijab error for male user (should be ignored):', errors.hijab);
    }
    if (watchedGender === 'female' && errors.beard) {
      console.log('⚠️ Beard error for female user (should be ignored):', errors.beard);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      const profileData = getEnhancedDisplayData(userProfile);
      reset(profileData);
      setPhoneNumber(userProfile.phone || '');
    }
    setIsEditing(false);
  };

  // دالة إصلاح يدوي للحالات الطارئة
  const handleManualFix = async () => {
    console.log('🔧 Manual fix requested by user');
    try {
      const result = await fixMissingProfileData();
      if (result.success) {
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Error in manual fix:', error);
      alert('❌ حدث خطأ أثناء الإصلاح');
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 py-4 md:py-8" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-32 h-32 md:w-64 md:h-64 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 md:mb-4 font-display">
            الملف الشخصي المطور
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 px-4">
            إدارة معلوماتك الشخصية وتفضيلاتك بشكل مفصل
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-600 to-emerald-600 px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                {/* Avatar Placeholder */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
                <div className="text-white text-center sm:text-right">
                  <h2 className="text-xl md:text-2xl font-bold mb-1">
                    {displayData.firstName || 'المستخدم'} {displayData.lastName || ''}
                  </h2>
                  {/* رقم العضوية */}
                  <p className="text-white/90 mb-2 text-sm md:text-base font-medium">
                    رقم العضوية: {userProfile.membership_number || 'غير محدد'}
                    {(!userProfile.membership_number || userProfile.first_name === 'المستخدم') && (
                      <button
                        onClick={handleManualFix}
                        className="mr-2 text-xs text-white/70 hover:text-white underline"
                        title="إصلاح البيانات المفقودة"
                      >
                        إصلاح
                      </button>
                    )}
                  </p>
                  <p className="text-white/80 mb-2 text-sm md:text-base">
                    {displayData.profession || displayData.jobTitle || 'لم يتم تحديد المهنة'}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs md:text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{displayData.city || displayData.residenceLocation || 'لم يتم تحديد المدينة'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{displayData.age} سنة</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white font-medium"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    إلغاء
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    تعديل
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-4 md:p-6 lg:p-8">
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              {/* 1. قسم الحالة الاجتماعية */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                  الحالة الاجتماعية
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* نوع الزواج */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      نوع الزواج
                    </label>
                    <select
                      {...register('marriageType')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      {getMarriageTypeOptions(watchedGender).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.marriageType && (
                      <p className="text-red-500 text-sm mt-1">{errors.marriageType.message}</p>
                    )}
                  </div>

                  {/* الحالة الاجتماعية */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      الحالة الاجتماعية
                    </label>
                    <select
                      {...register('maritalStatus')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      {getMaritalStatusOptions(watchedGender).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.maritalStatus && (
                      <p className="text-red-500 text-sm mt-1">{errors.maritalStatus.message}</p>
                    )}
                  </div>

                  {/* العمر */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      العمر
                    </label>
                    <input
                      type="number"
                      {...register('age', { valueAsNumber: true })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                      min="18"
                      max="80"
                    />
                    {errors.age && (
                      <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                    )}
                  </div>

                  {/* عدد الأطفال */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      عدد الأطفال
                    </label>
                    <input
                      type="number"
                      {...register('childrenCount', { valueAsNumber: true })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                      min="0"
                      max="20"
                    />
                    {errors.childrenCount && (
                      <p className="text-red-500 text-sm mt-1">{errors.childrenCount.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. قسم الجنسية والإقامة */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                  <Globe className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                  الجنسية والإقامة
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* مكان الإقامة */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      مكان الإقامة (الدولة)
                    </label>
                    <select
                      {...register('residenceLocation')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      {arabCountries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.residenceLocation && (
                      <p className="text-red-500 text-sm mt-1">{errors.residenceLocation.message}</p>
                    )}
                  </div>

                  {/* الجنسية */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      الجنسية
                    </label>
                    <select
                      {...register('nationality')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      {arabCountries.map((country) => (
                        <option key={`nationality-${country.code}`} value={country.name}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.nationality && (
                      <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>
                    )}
                  </div>

                  {/* المدينة */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      المدينة
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                      placeholder="المدينة الحالية"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. قسم المواصفات */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                  <Activity className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                  المواصفات
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* الوزن */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      الوزن (كجم)
                    </label>
                    <input
                      type="number"
                      {...register('weight', { valueAsNumber: true })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                      min="30"
                      max="300"
                      placeholder="70"
                    />
                    {errors.weight && (
                      <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                    )}
                  </div>

                  {/* الطول */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      الطول (سم)
                    </label>
                    <input
                      type="number"
                      {...register('height', { valueAsNumber: true })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                      min="120"
                      max="250"
                      placeholder="170"
                    />
                    {errors.height && (
                      <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                    )}
                  </div>

                  {/* لون البشرة */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      لون البشرة
                    </label>
                    <select
                      {...register('skinColor')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      {skinColorOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.skinColor && (
                      <p className="text-red-500 text-sm mt-1">{errors.skinColor.message}</p>
                    )}
                  </div>

                  {/* بنية الجسم */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      بنية الجسم
                    </label>
                    <select
                      {...register('bodyType')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      {bodyTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.bodyType && (
                      <p className="text-red-500 text-sm mt-1">{errors.bodyType.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. قسم الالتزام الديني */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                  <Book className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                  الالتزام الديني
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* التدين */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      التدين
                    </label>
                    <select
                      {...register('religiosityLevel')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      {religiosityLevelOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.religiosityLevel && (
                      <p className="text-red-500 text-sm mt-1">{errors.religiosityLevel.message}</p>
                    )}
                  </div>

                  {/* الصلاة */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      الصلاة
                    </label>
                    <select
                      {...register('prayerCommitment')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      {prayerCommitmentOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.prayerCommitment && (
                      <p className="text-red-500 text-sm mt-1">{errors.prayerCommitment.message}</p>
                    )}
                  </div>

                  {/* التدخين */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      التدخين
                    </label>
                    <select
                      {...register('smoking')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      <option value="yes">نعم</option>
                      <option value="no">لا</option>
                    </select>
                    {errors.smoking && (
                      <p className="text-red-500 text-sm mt-1">{errors.smoking.message}</p>
                    )}
                  </div>

                  {/* اللحية - للذكور فقط */}
                  {watchedGender === 'male' && (
                    <div>
                      <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                        اللحية
                      </label>
                      <select
                        {...register('beard')}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                      >
                        <option value="">اختر...</option>
                        <option value="yes">نعم</option>
                        <option value="no">لا</option>
                      </select>
                      {errors.beard && (
                        <p className="text-red-500 text-sm mt-1">{errors.beard.message}</p>
                      )}
                    </div>
                  )}

                  {/* الحجاب - للإناث فقط */}
                  {watchedGender === 'female' && (
                    <div>
                      <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                        الحجاب
                      </label>
                      <select
                        {...register('hijab')}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                      >
                        <option value="">اختر...</option>
                        {hijabOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.hijab && (
                        <p className="text-red-500 text-sm mt-1">{errors.hijab.message}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 5. قسم الدراسة والعمل */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                  <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                  الدراسة والعمل
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* المستوى التعليمي */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      المستوى التعليمي
                    </label>
                    <select
                      {...register('educationLevel')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      {educationLevelOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.educationLevel && (
                      <p className="text-red-500 text-sm mt-1">{errors.educationLevel.message}</p>
                    )}
                  </div>

                  {/* الوضع المادي */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      الوضع المادي
                    </label>
                    <select
                      {...register('financialStatus')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      {financialStatusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.financialStatus && (
                      <p className="text-red-500 text-sm mt-1">{errors.financialStatus.message}</p>
                    )}
                  </div>

                  {/* مجال العمل */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      مجال العمل
                    </label>
                    <input
                      type="text"
                      {...register('workField')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                      placeholder="مثل: تقنية المعلومات، الطب، التعليم"
                    />
                    {errors.workField && (
                      <p className="text-red-500 text-sm mt-1">{errors.workField.message}</p>
                    )}
                  </div>

                  {/* الوظيفة */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      الوظيفة
                    </label>
                    <input
                      type="text"
                      {...register('jobTitle')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                      placeholder="مثل: مطور برمجيات، طبيب، مدرس"
                    />
                    {errors.jobTitle && (
                      <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 6. قسم الدخل الشهري والحالة الصحية */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                  <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                  الدخل الشهري والحالة الصحية
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* الدخل الشهري */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      الدخل الشهري
                    </label>
                    <select
                      {...register('monthlyIncome')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      {monthlyIncomeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.monthlyIncome && (
                      <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome.message}</p>
                    )}
                  </div>

                  {/* الحالة الصحية */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      الحالة الصحية
                    </label>
                    <select
                      {...register('healthStatus')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="">اختر...</option>
                      {healthStatusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.healthStatus && (
                      <p className="text-red-500 text-sm mt-1">{errors.healthStatus.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* النبذة الشخصية */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                  النبذة الشخصية
                </h3>

                <div className="space-y-4 md:space-y-6">
                  {/* نبذة عن نفسك */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      نبذة عن نفسك
                    </label>
                    <textarea
                      {...register('bio')}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600 resize-none"
                      placeholder="اكتب نبذة مختصرة عن شخصيتك وقيمك..."
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                    )}
                  </div>

                  {/* ما تبحث عنه */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      ما تبحث عنه في شريك الحياة
                    </label>
                    <textarea
                      {...register('lookingFor')}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600 resize-none"
                      placeholder="اكتب المواصفات التي تبحث عنها في شريك الحياة..."
                    />
                    {errors.lookingFor && (
                      <p className="text-red-500 text-sm mt-1">{errors.lookingFor.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    حفظ التغييرات
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none bg-slate-500 text-white py-3 px-6 rounded-xl font-bold text-lg hover:bg-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    إلغاء
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfilePage;
