import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import PhoneInput from './PhoneInput';
import { 
  User, 
  Edit3, 
  Save,
  X,
  MapPin,
  Calendar,
  Book,
  Briefcase,
  GraduationCap,
  Mail,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

// Schema for profile data
const profileSchema = z.object({
  firstName: z.string().min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل'),
  lastName: z.string().min(2, 'اسم العائلة يجب أن يكون حرفين على الأقل'),
  age: z.number().min(18, 'العمر يجب أن يكون 18 سنة على الأقل').max(80, 'العمر يجب أن يكون أقل من 80 سنة'),
  city: z.string().min(2, 'يرجى إدخال المدينة'),
  education: z.string().min(2, 'يرجى إدخال المؤهل التعليمي'),
  profession: z.string().min(2, 'يرجى إدخال المهنة'),
  maritalStatus: z.enum(['single', 'divorced', 'widowed'], { required_error: 'يرجى اختيار الحالة الاجتماعية' }),
  religiousCommitment: z.enum(['high', 'medium', 'practicing'], { required_error: 'يرجى اختيار مستوى الالتزام الديني' }),
  bio: z.string().max(500, 'النبذة الشخصية يجب أن تكون أقل من 500 حرف').optional(),
  lookingFor: z.string().max(300, 'ما تبحث عنه يجب أن يكون أقل من 300 حرف').optional(),
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Mock user data
const mockUserData: ProfileFormData = {
  firstName: 'أحمد',
  lastName: 'محمد',
  age: 28,
  city: 'الرياض',
  education: 'بكالوريوس هندسة',
  profession: 'مهندس برمجيات',
  maritalStatus: 'single',
  religiousCommitment: 'high',
  bio: 'شخص ملتزم بتعاليم الإسلام، أبحث عن شريكة حياة تشاركني نفس القيم والمبادئ',
  lookingFor: 'أبحث عن زوجة ملتزمة ومتدينة تحب الخير وتسعى لبناء أسرة مسلمة',
  phone: '0501234567',
  email: 'ahmed.mohammed@email.com'
};

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const { userProfile, updateProfile, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  // تحميل بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    if (userProfile) {
      const profileData = {
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        age: userProfile.age || 18,
        city: userProfile.city || '',
        education: userProfile.education || '',
        profession: userProfile.profession || '',
        maritalStatus: userProfile.marital_status || 'single',
        religiousCommitment: userProfile.religious_commitment || 'practicing',
        bio: userProfile.bio || '',
        lookingFor: userProfile.looking_for || '',
        phone: userProfile.phone || '',
        email: userProfile.email || ''
      };

      reset(profileData);
      setPhoneNumber(userProfile.phone || '');
    }
  }, [userProfile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    // التحقق من صحة رقم الهاتف
    if (!isPhoneValid) {
      alert('يرجى إدخال رقم هاتف صحيح');
      return;
    }

    try {
      // تحديث الملف الشخصي باستخدام نظام المصادقة
      const result = await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        age: data.age,
        city: data.city,
        education: data.education,
        profession: data.profession,
        marital_status: data.maritalStatus,
        religious_commitment: data.religiousCommitment,
        bio: data.bio,
        looking_for: data.lookingFor,
        phone: phoneNumber
      });

      if (result.success) {
        alert('تم تحديث الملف الشخصي بنجاح!');
        setIsEditing(false);
      } else {
        alert(result.error || 'حدث خطأ أثناء تحديث الملف الشخصي');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('حدث خطأ غير متوقع');
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      const profileData = {
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        age: userProfile.age || 18,
        city: userProfile.city || '',
        education: userProfile.education || '',
        profession: userProfile.profession || '',
        maritalStatus: userProfile.marital_status || 'single',
        religiousCommitment: userProfile.religious_commitment || 'practicing',
        bio: userProfile.bio || '',
        lookingFor: userProfile.looking_for || '',
        phone: userProfile.phone || '',
        email: userProfile.email || ''
      };
      reset(profileData);
      setPhoneNumber(userProfile.phone || '');
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 py-4 md:py-8" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-32 h-32 md:w-64 md:h-64 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 md:mb-4 font-display">
            الملف الشخصي
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 px-4">
            إدارة معلوماتك الشخصية وتفضيلاتك
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-600 to-emerald-600 px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                {/* Avatar Placeholder (Islamic compliant - no photos for women) */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
                <div className="text-white text-center sm:text-right">
                  <h2 className="text-xl md:text-2xl font-bold mb-1">
                    {mockUserData.firstName} {mockUserData.lastName}
                  </h2>
                  <p className="text-white/80 mb-2 text-sm md:text-base">{mockUserData.profession}</p>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs md:text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{mockUserData.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{mockUserData.age} سنة</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-200 flex items-center gap-2 text-sm md:text-base"
                >
                  <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">تعديل الملف</span>
                  <span className="sm:hidden">تعديل</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-4 md:p-6 lg:p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Personal Information */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                  المعلومات الشخصية
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      {...register('firstName')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      اسم العائلة
                    </label>
                    <input
                      type="text"
                      {...register('lastName')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
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

                  {/* City */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      المدينة
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  {/* Marital Status */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      الحالة الاجتماعية
                    </label>
                    <select
                      {...register('maritalStatus')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="single">أعزب/عزباء</option>
                      <option value="divorced">مطلق/مطلقة</option>
                      <option value="widowed">أرمل/أرملة</option>
                    </select>
                    {errors.maritalStatus && (
                      <p className="text-red-500 text-sm mt-1">{errors.maritalStatus.message}</p>
                    )}
                  </div>

                  {/* Religious Commitment */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      مستوى الالتزام الديني
                    </label>
                    <select
                      {...register('religiousCommitment')}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option value="high">ملتزم جداً</option>
                      <option value="medium">ملتزم</option>
                      <option value="practicing">ممارس</option>
                    </select>
                    {errors.religiousCommitment && (
                      <p className="text-red-500 text-sm mt-1">{errors.religiousCommitment.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-primary-600" />
                  المعلومات المهنية والتعليمية
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Education */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      المؤهل التعليمي
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        {...register('education')}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                      />
                    </div>
                    {errors.education && (
                      <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>
                    )}
                  </div>

                  {/* Profession */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      المهنة
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        {...register('profession')}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                      />
                    </div>
                    {errors.profession && (
                      <p className="text-red-500 text-sm mt-1">{errors.profession.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Book className="w-6 h-6 text-primary-600" />
                  النبذة الشخصية
                </h3>
                
                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
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

                  {/* Looking For */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      ما تبحث عنه في شريك الحياة
                    </label>
                    <textarea
                      {...register('lookingFor')}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600 resize-none"
                      placeholder="اكتب ما تبحث عنه في شريك حياتك..."
                    />
                    {errors.lookingFor && (
                      <p className="text-red-500 text-sm mt-1">{errors.lookingFor.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary-600" />
                    معلومات الاتصال
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowContactInfo(!showContactInfo)}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    {showContactInfo ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    <span>{showContactInfo ? 'إخفاء' : 'إظهار'}</span>
                  </button>
                </div>
                
                {showContactInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        رقم الهاتف
                      </label>
                      <PhoneInput
                        value={phoneNumber}
                        onChange={(fullPhone, isValid) => {
                          setPhoneNumber(fullPhone);
                          setIsPhoneValid(isValid);
                        }}
                        placeholder="رقم الهاتف"
                        disabled={!isEditing}
                        error={errors.phone?.message}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        البريد الإلكتروني
                      </label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="email"
                          {...register('email')}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-600"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    إلغاء
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
                        حفظ التغييرات
                      </>
                    )}
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

export default ProfilePage;
