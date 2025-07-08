import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { validatePasswordStrength } from '../utils/security';

// Schema for security settings
const securitySchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z.string().min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل'),
  confirmPassword: z.string(),
  twoFactorEnabled: z.boolean(),
  showPhone: z.boolean(),
  showEmail: z.boolean(),
  allowMessages: z.boolean(),
  familyCanView: z.boolean(),
  profileVisibility: z.enum(['public', 'members', 'verified']),
  loginNotifications: z.boolean(),
  messageNotifications: z.boolean()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type SecurityFormData = z.infer<typeof securitySchema>;

const SecuritySettingsPage: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] as string[] });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
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

  const newPassword = watch('newPassword');

  React.useEffect(() => {
    if (newPassword) {
      const strength = validatePasswordStrength(newPassword);
      setPasswordStrength(strength);
    }
  }, [newPassword]);

  const onSubmit = async (data: SecurityFormData) => {
    setIsLoading(true);
    try {
      // Here we would normally send data to backend
      console.log('Security settings update:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('تم تحديث إعدادات الأمان بنجاح!');
    } catch (error) {
      console.error('Security update error:', error);
      alert('حدث خطأ أثناء تحديث إعدادات الأمان');
    } finally {
      setIsLoading(false);
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

        {/* Security Settings Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Password Security */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Lock className="w-6 h-6 text-primary-600" />
                أمان كلمة المرور
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Password */}
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-medium mb-2">
                    كلمة المرور الحالية *
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      {...register('currentPassword')}
                      className="w-full px-4 py-3 pr-12 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="أدخل كلمة المرور الحالية"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    كلمة المرور الجديدة *
                  </label>
                  <div className="relative">
                    <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      {...register('newPassword')}
                      className="w-full px-4 py-3 pr-12 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="أدخل كلمة مرور جديدة"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {newPassword && (
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
                    تأكيد كلمة المرور الجديدة *
                  </label>
                  <div className="relative">
                    <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register('confirmPassword')}
                      className="w-full px-4 py-3 pr-12 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="أعد إدخال كلمة المرور الجديدة"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

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
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
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
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
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
