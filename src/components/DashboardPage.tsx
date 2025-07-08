import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import MatchingService from '../lib/matchingService';
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
  Award,
  Activity,
  Clock,
  MapPin,
  Loader2
} from 'lucide-react';

interface DashboardStats {
  profileViews: number;
  likes: number;
  matches: number;
  messages: number;
  profileCompletion: number;
  lastActive: string;
}

interface RecentActivity {
  id: string;
  type: 'view' | 'like' | 'message' | 'match';
  description: string;
  timestamp: string;
  user?: {
    name: string;
    city: string;
  };
}

const DashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    profileViews: 0,
    likes: 0,
    matches: 0,
    messages: 0,
    profileCompletion: 0,
    lastActive: ''
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [suggestedMatches, setSuggestedMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.id) {
      loadDashboardData();
    }
  }, [userProfile]);

  const loadDashboardData = async () => {
    if (!userProfile?.id) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadRecentActivity(),
        loadSuggestedMatches()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    if (!userProfile?.id) return;

    try {
      // حساب اكتمال الملف الشخصي
      const completion = calculateProfileCompletion();
      
      // الحصول على إحصائيات المطابقات
      const { data: matchesData } = await supabase
        .from('matches')
        .select('*')
        .eq('user1_id', userProfile.id);

      // الحصول على إحصائيات الرسائل
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', userProfile.id);

      setStats({
        profileViews: Math.floor(Math.random() * 50) + 10, // مؤقت - سيتم تطوير نظام المشاهدات لاحقاً
        likes: Math.floor(Math.random() * 20) + 5, // مؤقت
        matches: matchesData?.length || 0,
        messages: messagesData?.length || 0,
        profileCompletion: completion,
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentActivity = async () => {
    // مؤقت - بيانات تجريبية للنشاطات الأخيرة
    const mockActivity: RecentActivity[] = [
      {
        id: '1',
        type: 'view',
        description: 'شاهد أحمد ملفك الشخصي',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: { name: 'أحمد محمد', city: 'الرياض' }
      },
      {
        id: '2',
        type: 'like',
        description: 'أعجبت فاطمة بملفك الشخصي',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        user: { name: 'فاطمة أحمد', city: 'جدة' }
      },
      {
        id: '3',
        type: 'match',
        description: 'مطابقة جديدة مع سارة',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        user: { name: 'سارة علي', city: 'الدمام' }
      }
    ];
    
    setRecentActivity(mockActivity);
  };

  const loadSuggestedMatches = async () => {
    if (!userProfile?.id) return;

    try {
      const { data } = await MatchingService.findMatches(userProfile.id, 3);
      setSuggestedMatches(data);
    } catch (error) {
      console.error('Error loading suggested matches:', error);
    }
  };

  const calculateProfileCompletion = (): number => {
    if (!userProfile) return 0;
    
    const fields = [
      'first_name', 'last_name', 'age', 'city', 'education', 
      'profession', 'marital_status', 'religious_commitment', 'bio'
    ];
    
    const completedFields = fields.filter(field => 
      userProfile[field as keyof typeof userProfile]
    ).length;
    
    return Math.round((completedFields / fields.length) * 100);
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              
              <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                تحسين الملف الشخصي
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">النشاط الأخير</h2>
                <Bell className="w-5 h-5 text-slate-500" />
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
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
                ))}
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
                  <div key={index} className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-bold text-slate-700">
                            {match.compatibilityScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-slate-800 mb-1">
                      {match.user.first_name} {match.user.last_name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{match.user.city}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-3 h-3" />
                      <span>{match.user.age} سنة</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {suggestedMatches.length === 0 && (
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
