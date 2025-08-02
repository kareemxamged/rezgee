import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LikesService from '../lib/likesService';
import {
  Heart,
  Clock,
  Check,
  X,
  Calendar,
  MapPin,
  GraduationCap,
  Shield,
  Loader2
} from 'lucide-react';

const LikesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [receivedLikes, setReceivedLikes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    if (userProfile?.id) {
      loadReceivedLikes();

      // تحديث تلقائي كل 30 ثانية
      const interval = setInterval(() => {
        loadReceivedLikes();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userProfile]);

  const loadReceivedLikes = async () => {
    if (!userProfile?.id) return;

    setIsLoading(true);
    try {
      const { data } = await LikesService.getReceivedLikes(userProfile.id);
      setReceivedLikes(data || []);
    } catch (error) {
      console.error('Error loading received likes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeResponse = async (likeId: string, response: 'accepted' | 'rejected') => {
    try {
      const { success } = await LikesService.respondToLike(likeId, response);
      if (success) {
        loadReceivedLikes(); // إعادة تحميل البيانات
      }
    } catch (error) {
      console.error('Error responding to like:', error);
    }
  };

  // التحديث يتم تلقائياً كل 30 ثانية

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'منذ دقائق';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `منذ ${diffInDays} يوم`;
  };

  // تم إزالة دوال تصنيف الإعجابات لتبسيط التجربة

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  // عرض جميع الإعجابات بدون فلترة




  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-primary-600 animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-slate-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 375px) {
          .text-xs { font-size: 0.65rem; }
          .text-sm { font-size: 0.75rem; }
          .p-3 { padding: 0.5rem; }
          .gap-3 { gap: 0.5rem; }
          .rounded-xl { border-radius: 0.75rem; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="truncate">الإعجابات المستلمة</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600">الأشخاص الذين أعجبوا بملفك الشخصي</p>
            </div>


          </div>

        </div>



        {/* Received Likes Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />
                الإعجابات المستلمة
              </h2>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {receivedLikes.length} إعجاب
              </span>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                {receivedLikes.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">لا توجد إعجابات جديدة</h3>
                    <p className="text-sm sm:text-base text-slate-600">عندما يعجب أحد بملفك الشخصي، ستظهر هنا</p>
                  </div>
                ) : (
                  receivedLikes.map((like: any) => (
                    like && like.liker ? (
                    <div key={like.id} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                          <div
                            className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
                            onClick={() => handleViewProfile(like.liker?.id)}
                            title="عرض الملف الشخصي"
                          >
                            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3
                                className="text-base sm:text-lg font-semibold text-slate-800 cursor-pointer hover:text-primary-600 transition-colors truncate"
                                onClick={() => handleViewProfile(like.liker?.id)}
                                title="عرض الملف الشخصي"
                              >
                                {like.liker?.first_name || 'مستخدم'} {like.liker?.last_name || 'غير متاح'}
                              </h3>
                              {like.liker?.verified && (
                                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{like.liker?.age || 'غير محدد'} سنة</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="truncate max-w-[100px] sm:max-w-none">{like.liker?.city || 'غير محدد'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="truncate max-w-[80px] sm:max-w-none">{like.liker.education}</span>
                              </div>
                            </div>

                            {like.message && (
                              <div className="bg-slate-50 rounded-lg p-2 sm:p-3 mb-3">
                                <p className="text-slate-700 text-xs sm:text-sm break-words">{like.message}</p>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 sm:mb-0">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(like.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                          {like.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleLikeResponse(like.id, 'rejected')}
                                className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors group"
                                title="رفض الإعجاب"
                              >
                                <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:scale-110 transition-transform" />
                              </button>
                              <button
                                onClick={() => handleLikeResponse(like.id, 'accepted')}
                                className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors group"
                                title="قبول الإعجاب"
                              >
                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 group-hover:scale-110 transition-transform" />
                              </button>
                            </>
                          ) : (
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              like.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {like.status === 'accepted' ? '✓ تم القبول' : '✗ تم الرفض'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    ) : null
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikesPage;
