import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService, messageService } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  MapPin,
  Calendar,
  Book,
  GraduationCap,
  Heart,
  DollarSign,
  Globe,
  MessageSquare,
  ArrowLeft,
  Shield,
  Users,
  Home,
  Star
} from 'lucide-react';

interface PublicUserProfile {
  id: string;
  first_name: string;
  last_name: string;
  age?: number;
  gender?: 'male' | 'female';
  city?: string;
  marital_status?: string;
  education?: string;
  profession?: string;
  religious_commitment?: string;
  bio?: string;
  looking_for?: string;
  verified?: boolean;
  status?: string;
  created_at?: string;
  marriage_type?: string;
  children_count?: number;
  residence_location?: string;
  nationality?: string;
  weight?: number;
  height?: number;
  skin_color?: string;
  body_type?: string;
  religiosity_level?: string;
  prayer_commitment?: string;
  smoking?: string;
  beard?: string;
  hijab?: string;
  education_level?: string;
  financial_status?: string;
  work_field?: string;
  job_title?: string;
  monthly_income?: string;
  health_status?: string;
}

const PublicProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId]);

  const fetchUserProfile = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await userService.getPublicUserProfile(id);
      
      if (error) {
        setError('لم يتم العثور على الملف الشخصي أو أنه غير متاح للعرض');
        return;
      }

      if (!data) {
        setError('الملف الشخصي غير موجود');
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('حدث خطأ أثناء تحميل الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser || !profile) return;

    try {
      setSendingMessage(true);
      
      // Create or get conversation
      const { error: convError } = await messageService.createConversation(
        currentUser.id,
        profile.id
      );

      if (convError) {
        console.error('Error creating conversation:', convError);
        return;
      }

      // Navigate to messages page
      navigate('/messages');
    } catch (err) {
      console.error('Error starting conversation:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Helper functions for displaying data
  const getMaritalStatusText = (status?: string) => {
    const statusMap: { [key: string]: string } = {
      'single': 'أعزب/عزباء',
      'married': 'متزوج/متزوجة',
      'divorced': 'مطلق',
      'widowed': 'أرمل',
      'unmarried': 'غير متزوج',
      'divorced_female': 'مطلقة',
      'widowed_female': 'أرملة'
    };
    return statusMap[status || ''] || status || 'غير محدد';
  };

  const getMarriageTypeText = (type?: string) => {
    const typeMap: { [key: string]: string } = {
      'first_wife': 'زوجة أولى',
      'second_wife': 'زوجة ثانية',
      'only_wife': 'الزوجة الوحيدة',
      'no_objection_polygamy': 'لا مانع من التعدد'
    };
    return typeMap[type || ''] || '';
  };

  const getReligiousCommitmentText = (level?: string) => {
    const levelMap: { [key: string]: string } = {
      'high': 'ملتزم جداً',
      'medium': 'ملتزم',
      'practicing': 'ممارس'
    };
    return levelMap[level || ''] || level || 'غير محدد';
  };

  const getReligiosityLevelText = (level?: string) => {
    const levelMap: { [key: string]: string } = {
      'not_religious': 'غير متدين',
      'slightly_religious': 'متدين قليلاً',
      'religious': 'متدين',
      'very_religious': 'متدين جداً',
      'prefer_not_say': 'أفضل عدم الإفصاح'
    };
    return levelMap[level || ''] || '';
  };

  const getPrayerCommitmentText = (commitment?: string) => {
    const commitmentMap: { [key: string]: string } = {
      'dont_pray': 'لا يصلي',
      'pray_all': 'يصلي جميع الفروض',
      'pray_sometimes': 'يصلي أحياناً',
      'prefer_not_say': 'أفضل عدم الإفصاح'
    };
    return commitmentMap[commitment || ''] || '';
  };



  const getEducationLevelText = (level?: string) => {
    const levelMap: { [key: string]: string } = {
      'primary': 'ابتدائي',
      'secondary': 'ثانوي',
      'diploma': 'دبلوم',
      'bachelor': 'بكالوريوس',
      'master': 'ماجستير',
      'phd': 'دكتوراه'
    };
    return levelMap[level || ''] || '';
  };

  const getFinancialStatusText = (status?: string) => {
    const statusMap: { [key: string]: string } = {
      'poor': 'ضعيف',
      'below_average': 'أقل من المتوسط',
      'average': 'متوسط',
      'above_average': 'أعلى من المتوسط',
      'wealthy': 'ميسور'
    };
    return statusMap[status || ''] || '';
  };

  const getMonthlyIncomeText = (income?: string) => {
    const incomeMap: { [key: string]: string } = {
      'less_3000': 'أقل من 3000',
      '3000_5000': '3000 - 5000',
      '5000_8000': '5000 - 8000',
      '8000_12000': '8000 - 12000',
      '12000_20000': '12000 - 20000',
      'more_20000': 'أكثر من 20000',
      'prefer_not_say': 'أفضل عدم الإفصاح'
    };
    return incomeMap[income || ''] || '';
  };

  const getHealthStatusText = (status?: string) => {
    const statusMap: { [key: string]: string } = {
      'excellent': 'ممتاز',
      'very_good': 'جيد جداً',
      'good': 'جيد',
      'fair': 'مقبول',
      'poor': 'ضعيف',
      'prefer_not_say': 'أفضل عدم الإفصاح'
    };
    return statusMap[status || ''] || '';
  };

  const getHijabText = (hijab?: string) => {
    const hijabMap: { [key: string]: string } = {
      'no_hijab': 'بدون حجاب',
      'hijab': 'حجاب',
      'niqab': 'نقاب',
      'prefer_not_say': 'أفضل عدم الإفصاح'
    };
    return hijabMap[hijab || ''] || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">الملف الشخصي غير متاح</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة
          </button>
          
          {currentUser && currentUser.id !== profile.id && (
            <button
              onClick={handleSendMessage}
              disabled={sendingMessage}
              className="bg-gradient-to-r from-primary-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingMessage ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  إرسال رسالة
                </>
              )}
            </button>
          )}
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8">
              {/* Profile Header */}
              <div className="flex items-start gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-slate-800">
                      {profile.first_name} {profile.last_name}
                    </h1>
                    {profile.verified && (
                      <Shield className="w-6 h-6 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-slate-600 mb-4">
                    {profile.age && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{profile.age} سنة</span>
                      </div>
                    )}
                    {profile.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.city}</span>
                      </div>
                    )}
                    {profile.gender && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{profile.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                      </div>
                    )}
                  </div>
                  {profile.created_at && (
                    <p className="text-sm text-slate-500">
                      عضو منذ {new Date(profile.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        calendar: 'gregory'
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              {profile.bio && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Book className="w-5 h-5 text-primary-600" />
                    نبذة شخصية
                  </h3>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Looking For Section */}
              {profile.looking_for && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary-600" />
                    ما أبحث عنه
                  </h3>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">
                    {profile.looking_for}
                  </p>
                </div>
              )}

              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  المعلومات الأساسية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.marital_status && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">الحالة الاجتماعية</span>
                      </div>
                      <p className="text-slate-600">{getMaritalStatusText(profile.marital_status)}</p>
                    </div>
                  )}

                  {profile.marriage_type && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">نوع الزواج</span>
                      </div>
                      <p className="text-slate-600">{getMarriageTypeText(profile.marriage_type)}</p>
                    </div>
                  )}

                  {profile.children_count !== undefined && profile.children_count !== null && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">عدد الأطفال</span>
                      </div>
                      <p className="text-slate-600">{profile.children_count}</p>
                    </div>
                  )}

                  {profile.nationality && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">الجنسية</span>
                      </div>
                      <p className="text-slate-600">{profile.nationality}</p>
                    </div>
                  )}

                  {profile.residence_location && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Home className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">مكان الإقامة</span>
                      </div>
                      <p className="text-slate-600">{profile.residence_location}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Religious Information */}
            {(profile.religious_commitment || profile.religiosity_level || profile.prayer_commitment || profile.smoking || profile.beard || profile.hijab) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary-600" />
                  الالتزام الديني
                </h3>
                <div className="space-y-4">
                  {profile.religious_commitment && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">مستوى الالتزام</span>
                      <p className="text-slate-600">{getReligiousCommitmentText(profile.religious_commitment)}</p>
                    </div>
                  )}

                  {profile.religiosity_level && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">مستوى التدين</span>
                      <p className="text-slate-600">{getReligiosityLevelText(profile.religiosity_level)}</p>
                    </div>
                  )}

                  {profile.prayer_commitment && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">الالتزام بالصلاة</span>
                      <p className="text-slate-600">{getPrayerCommitmentText(profile.prayer_commitment)}</p>
                    </div>
                  )}

                  {profile.smoking && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">التدخين</span>
                      <p className="text-slate-600">{profile.smoking === 'yes' ? 'نعم' : 'لا'}</p>
                    </div>
                  )}

                  {profile.gender === 'male' && profile.beard && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">اللحية</span>
                      <p className="text-slate-600">{profile.beard === 'yes' ? 'نعم' : 'لا'}</p>
                    </div>
                  )}

                  {profile.gender === 'female' && profile.hijab && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">الحجاب</span>
                      <p className="text-slate-600">{getHijabText(profile.hijab)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Education & Work */}
            {(profile.education || profile.profession || profile.education_level || profile.work_field || profile.job_title) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary-600" />
                  التعليم والعمل
                </h3>
                <div className="space-y-4">
                  {profile.education && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">التعليم</span>
                      <p className="text-slate-600">{profile.education}</p>
                    </div>
                  )}

                  {profile.education_level && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">المستوى التعليمي</span>
                      <p className="text-slate-600">{getEducationLevelText(profile.education_level)}</p>
                    </div>
                  )}

                  {profile.profession && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">المهنة</span>
                      <p className="text-slate-600">{profile.profession}</p>
                    </div>
                  )}

                  {profile.work_field && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">مجال العمل</span>
                      <p className="text-slate-600">{profile.work_field}</p>
                    </div>
                  )}

                  {profile.job_title && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">المسمى الوظيفي</span>
                      <p className="text-slate-600">{profile.job_title}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Financial & Health */}
            {(profile.financial_status || profile.monthly_income || profile.health_status) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                  الوضع المالي والصحي
                </h3>
                <div className="space-y-4">
                  {profile.financial_status && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">الوضع المالي</span>
                      <p className="text-slate-600">{getFinancialStatusText(profile.financial_status)}</p>
                    </div>
                  )}

                  {profile.monthly_income && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">الدخل الشهري</span>
                      <p className="text-slate-600">{getMonthlyIncomeText(profile.monthly_income)}</p>
                    </div>
                  )}

                  {profile.health_status && (
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">الحالة الصحية</span>
                      <p className="text-slate-600">{getHealthStatusText(profile.health_status)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
