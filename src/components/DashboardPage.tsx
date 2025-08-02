import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService, type DashboardStats, type RecentActivity } from '../lib/dashboardService';
import {
  Heart,
  MessageCircle,
  Eye,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Bell,
  Settings,
  Shield,
  Activity,
  Clock,
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle,
  Target,
  Zap
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { i18n } = useTranslation();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    profileViews: 0,
    likes: 0,
    matches: 0,
    messages: 0,
    profileCompletion: 0,
    lastActive: '',
    responseRate: 0,
    newMatches: 0,
    unreadMessages: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [suggestedMatches, setSuggestedMatches] = useState<any[]>([]);
  const [profileTips, setProfileTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.id) {
      loadDashboardData();
    }
  }, [userProfile]);

  const loadDashboardData = async () => {
    if (!userProfile?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // استخدام الخدمة الجديدة لجلب جميع البيانات
      const comprehensiveStats = await dashboardService.getComprehensiveStats(userProfile.id);

      setStats(comprehensiveStats.userStats);
      setRecentActivity(comprehensiveStats.recentActivity);
      setSuggestedMatches(comprehensiveStats.suggestedMatches);

      // جلب نصائح تحسين الملف الشخصي
      const tips = dashboardService.getProfileImprovementTips(userProfile);
      setProfileTips(tips);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('حدث خطأ في تحميل بيانات لوحة التحكم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleRefreshData = () => {
    if (userProfile?.id) {
      loadDashboardData();
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view': return <Eye className="w-4 h-4" />;
      case 'like': return <Heart className="w-4 h-4" />;
      case 'message': return <MessageCircle className="w-4 h-4" />;
      case 'match': return <Star className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'view': return 'text-blue-600 bg-blue-100';
      case 'like': return 'text-pink-600 bg-pink-100';
      case 'message': return 'text-green-600 bg-green-100';
      case 'match': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'منذ دقائق';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `منذ ${diffInDays} يوم`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            مرحباً، {userProfile?.first_name}
          </h1>
          <p className="text-slate-600">
            إليك نظرة عامة على نشاطك ومطابقاتك الجديدة
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
            <button
              onClick={handleRefreshData}
              className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.profileViews}</h3>
            <p className="text-slate-600 text-sm">مشاهدة للملف الشخصي</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.likes}</h3>
            <p className="text-slate-600 text-sm">إعجاب</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.matches}</h3>
            <p className="text-slate-600 text-sm">مطابقة</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.messages}</h3>
            <p className="text-slate-600 text-sm">رسالة مرسلة</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.responseRate}%</h3>
            <p className="text-slate-600 text-sm">معدل الاستجابة</p>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-emerald-200 text-sm">جديد</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.newMatches}</h3>
            <p className="text-emerald-100 text-sm">مطابقات جديدة هذا الأسبوع</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <span className="text-blue-200 text-sm">عاجل</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.unreadMessages}</h3>
            <p className="text-blue-100 text-sm">رسائل غير مقروءة</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-purple-200 text-sm">إنجاز</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.profileCompletion}%</h3>
            <p className="text-purple-100 text-sm">اكتمال الملف الشخصي</p>
          </div>
        </div>

        {/* Enhanced Profile Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-emerald-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">الملف الشخصي</h3>
                    <p className="text-white/80 text-sm">حقول مفصلة أكثر للتعارف الشرعي</p>
                  </div>
                </div>
                <p className="text-white/90 mb-4">
                  يحتوي على 6 أقسام جديدة: الحالة الاجتماعية، الجنسية والإقامة، المواصفات، الالتزام الديني، الدراسة والعمل، والدخل والصحة
                </p>
                <a
                  href="/profile"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  انتقل للملف الشخصي
                </a>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Completion */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">اكتمال الملف الشخصي</h2>
                <Settings className="w-5 h-5 text-slate-500" />
              </div>
              
              <div className="relative mb-4">
                <div className="w-24 h-24 mx-auto">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.profileCompletion / 100)}`}
                      className="text-primary-600 transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">{stats.profileCompletion}%</span>
                  </div>
                </div>
              </div>
              
              <p className="text-center text-slate-600 mb-4">
                {stats.profileCompletion < 80 ? 
                  'أكمل ملفك الشخصي لزيادة فرص المطابقة' : 
                  'ملفك الشخصي مكتمل بشكل ممتاز!'
                }
              </p>
              
              <button
                onClick={() => navigate('/profile')}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                تحسين الملف الشخصي
              </button>
            </div>

            {/* Profile Tips */}
            {profileTips.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800">نصائح لتحسين ملفك</h2>
                  <Target className="w-5 h-5 text-slate-500" />
                </div>

                <div className="space-y-3">
                  {profileTips.slice(0, 3).map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary-600 text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>

                {profileTips.length > 3 && (
                  <button
                    onClick={() => navigate('/profile')}
                    className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    عرض المزيد من النصائح
                  </button>
                )}
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">النشاط الأخير</h2>
                <Bell className="w-5 h-5 text-slate-500" />
              </div>
              
              <div className="space-y-4">
                {recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 font-medium">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">لا توجد أنشطة حديثة</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Suggested Matches */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">المطابقات المقترحة</h2>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  عرض الكل
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestedMatches.slice(0, 3).map((match, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors cursor-pointer hover:shadow-md transform hover:-translate-y-1"
                    onClick={() => handleViewProfile(match.id)}
                    title="عرض الملف الشخصي"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-bold text-slate-700">
                            {match.compatibilityScore || 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold text-slate-800 mb-1 hover:text-primary-600 transition-colors">
                      {match.first_name || 'غير محدد'} {match.last_name || ''}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{match.city || 'غير محدد'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-3 h-3" />
                      <span>{match.age || 'غير محدد'} سنة</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {(!suggestedMatches || suggestedMatches.length === 0) && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">لا توجد مطابقات جديدة حالياً</p>
                  <p className="text-sm text-slate-500 mt-1">سنقوم بإشعارك عند ظهور مطابقات جديدة</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
