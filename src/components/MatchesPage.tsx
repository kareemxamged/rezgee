import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MatchingService, { type MatchResult } from '../lib/matchingService';
import LikesService from '../lib/likesService';
import {
  Heart,
  X,
  MapPin,
  GraduationCap,
  Calendar,
  Star,
  MessageCircle,
  Shield,
  Loader2,
  RefreshCw,
  Filter,
  Eye
} from 'lucide-react';

const MatchesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [likedMatches, setLikedMatches] = useState<string[]>([]);
  const [passedMatches, setPassedMatches] = useState<string[]>([]);

  // تحميل المطابقات عند تحميل الصفحة
  useEffect(() => {
    if (userProfile?.id) {
      loadMatches();
    }
  }, [userProfile]);

  const loadMatches = async () => {
    if (!userProfile?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await MatchingService.findMatches(userProfile.id, 20);
      if (error) {
        console.error('Error loading matches:', error);
      } else {
        setMatches(data);
        setCurrentMatchIndex(0);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // التعامل مع الإعجاب
  const handleLike = async () => {
    const currentMatch = matches[currentMatchIndex];
    if (!currentMatch || !userProfile?.id) return;

    try {
      // إرسال إعجاب عبر LikesService
      const { success } = await LikesService.sendLike(
        userProfile.id,
        currentMatch.user.id,
        'like'
      );

      if (success) {
        // إضافة إلى قائمة الإعجابات
        setLikedMatches(prev => [...prev, currentMatch.user.id]);

        // حفظ المطابقة في قاعدة البيانات
        await MatchingService.saveMatch(
          userProfile.id,
          currentMatch.user.id,
          currentMatch.compatibilityScore,
          'mutual_like'
        );
      }
    } catch (error) {
      console.error('Error sending like:', error);
    }

    // الانتقال للمطابقة التالية
    nextMatch();
  };

  // التعامل مع التمرير
  const handlePass = () => {
    const currentMatch = matches[currentMatchIndex];
    if (!currentMatch) return;

    setPassedMatches(prev => [...prev, currentMatch.user.id]);
    nextMatch();
  };

  // الانتقال للمطابقة التالية
  const nextMatch = () => {
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(prev => prev + 1);
    } else {
      // إعادة تحميل مطابقات جديدة
      loadMatches();
    }
  };

  // الحصول على لون نقاط التوافق
  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // الحصول على نص مستوى التوافق
  const getCompatibilityText = (score: number) => {
    if (score >= 80) return 'توافق ممتاز';
    if (score >= 60) return 'توافق جيد';
    if (score >= 40) return 'توافق متوسط';
    return 'توافق ضعيف';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">جاري البحث عن المطابقات المناسبة...</p>
        </div>
      </div>
    );
  }

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const currentMatch = matches[currentMatchIndex];

  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Heart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">لا توجد مطابقات جديدة</h2>
          <p className="text-slate-600 mb-6">
            لقد راجعت جميع المطابقات المتاحة حالياً. سنقوم بإشعارك عند ظهور مطابقات جديدة.
          </p>
          <button
            onClick={loadMatches}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            البحث مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">المطابقات المقترحة</h1>
              <p className="text-slate-600">اكتشف الأشخاص المناسبين لك</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <Filter className="w-5 h-5" />
                فلترة
              </button>
              <button
                onClick={loadMatches}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                تحديث
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Match Progress */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">
              المطابقة {currentMatchIndex + 1} من {matches.length}
            </span>
            <span className="text-sm text-slate-600">
              {likedMatches.length} إعجاب · {passedMatches.length} تمرير
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-600 to-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentMatchIndex + 1) / matches.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Match Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary-600 to-emerald-600 p-6 text-white text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-1">
                {currentMatch.user.first_name} {currentMatch.user.last_name}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calendar className="w-4 h-4" />
                <span>{currentMatch.user.age} سنة</span>
              </div>
              
              {/* Compatibility Score */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getCompatibilityColor(currentMatch.compatibilityScore)}`}>
                <Star className="w-4 h-4" />
                <span className="font-bold">{currentMatch.compatibilityScore}%</span>
                <span className="text-sm">{getCompatibilityText(currentMatch.compatibilityScore)}</span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 space-y-4">
              {/* Location */}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-500" />
                <span className="text-slate-700">{currentMatch.user.city}</span>
              </div>

              {/* Education */}
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-slate-500" />
                <span className="text-slate-700">{currentMatch.user.education}</span>
              </div>

              {/* Bio */}
              {currentMatch.user.bio && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-700 leading-relaxed">{currentMatch.user.bio}</p>
                </div>
              )}

              {/* Match Reasons */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">أسباب التوافق:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.matchReason.map((reason, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compatibility Breakdown */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">تفاصيل التوافق:</h3>
                <div className="space-y-2">
                  {Object.entries(currentMatch.compatibilityFactors).map(([key, value]) => {
                    const labels = {
                      age: 'العمر',
                      location: 'الموقع',
                      education: 'التعليم',
                      religiousCommitment: 'الالتزام الديني',
                      maritalStatus: 'الحالة الاجتماعية'
                    };
                    
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          {labels[key as keyof typeof labels]}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary-600 to-emerald-600 h-2 rounded-full"
                              style={{ width: `${value * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-700">
                            {Math.round(value * 100)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handlePass}
                  className="w-14 h-14 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors group"
                >
                  <X className="w-7 h-7 text-slate-600 group-hover:text-slate-800" />
                </button>

                <button
                  onClick={() => handleViewProfile(currentMatch.user.id)}
                  className="w-14 h-14 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors group"
                  title="عرض الملف الشخصي"
                >
                  <Eye className="w-7 h-7 text-blue-600 group-hover:text-blue-800" />
                </button>

                <button
                  onClick={handleLike}
                  className="w-18 h-18 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-lg"
                >
                  <Heart className="w-9 h-9 text-white" />
                </button>

                <button
                  className="w-14 h-14 bg-primary-100 hover:bg-primary-200 rounded-full flex items-center justify-center transition-colors group"
                >
                  <MessageCircle className="w-7 h-7 text-primary-600 group-hover:text-primary-800" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-600">
                <span>تمرير</span>
                <span>عرض</span>
                <span className="font-semibold text-primary-600">إعجاب</span>
                <span>رسالة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
