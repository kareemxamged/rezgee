import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { userService, messageService } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Local type definition to avoid import issues
interface UserType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  age?: number;
  city?: string;
  education?: string;
  profession?: string;
  marital_status?: string;
  bio?: string;
  verified?: boolean;
  status?: string;
  last_login?: string;
}
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Heart,
  User,
  GraduationCap,
  Briefcase,
  Eye,
  MessageSquare,
  Shield,
  ChevronDown,
  X
} from 'lucide-react';

// Search filters schema
const searchSchema = z.object({
  ageMin: z.number().min(18, 'العمر الأدنى يجب أن يكون 18 سنة على الأقل').optional(),
  ageMax: z.number().max(80, 'العمر الأقصى يجب أن يكون أقل من 80 سنة').optional(),
  city: z.string().optional(),
  maritalStatus: z.enum(['single', 'divorced', 'widowed', 'any']).optional(),
  education: z.string().optional(),
  profession: z.string().optional(),
  religiousCommitment: z.enum(['high', 'medium', 'practicing', 'any']).optional(),
  gender: z.enum(['male', 'female']).optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

// Mock search results (unused for now)
// const mockResults = [
//   {
//     id: 1,
//     name: 'فاطمة أحمد',
//     age: 26,
//     city: 'الرياض',
//     education: 'بكالوريوس طب',
//     profession: 'طبيبة',
//     maritalStatus: 'single',
//     religiousCommitment: 'high',
//     bio: 'طبيبة ملتزمة، أحب العمل الخيري والقراءة',
//     rating: 5,
//     verified: true,
//     lastSeen: 'منذ ساعة'
//   },
//   {
//     id: 2,
//     name: 'مريم سالم',
//     age: 24,
//     city: 'جدة',
//     education: 'بكالوريوس تربية',
//     profession: 'معلمة',
//     maritalStatus: 'single',
//     religiousCommitment: 'high',
//     bio: 'معلمة متحمسة، أحب التعليم والأطفال',
//     rating: 5,
//     verified: true,
//     lastSeen: 'منذ 3 ساعات'
//   },
//   {
//     id: 3,
//     name: 'نورا محمد',
//     age: 28,
//     city: 'الدمام',
//     education: 'ماجستير إدارة أعمال',
//     profession: 'مديرة مشاريع',
//     maritalStatus: 'divorced',
//     religiousCommitment: 'medium',
//     bio: 'مديرة مشاريع ناجحة، أبحث عن شريك حياة مناسب',
//     rating: 4,
//     verified: true,
//     lastSeen: 'منذ يوم'
//   }
// ];

const SearchPage: React.FC = () => {
  const { userProfile, isAuthenticated, isLoading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isRefreshingProfile, setIsRefreshingProfile] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'age' | 'rating' | 'lastSeen'>('newest');

  const {
    register,
    handleSubmit,
    reset
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema)
  });

  // دالة لاستنتاج الجنس من البيانات الموجودة
  const inferGenderFromProfile = (profile: any): 'male' | 'female' | null => {
    if (profile.gender) return profile.gender;

    // استنتاج من بيانات اللحية (للذكور)
    if (profile.beard && (profile.beard === 'yes' || profile.beard === 'no')) {
      return 'male';
    }
    // استنتاج من بيانات الحجاب (للإناث)
    if (profile.hijab && ['no_hijab', 'hijab', 'niqab'].includes(profile.hijab)) {
      return 'female';
    }

    return null;
  };

  // Load initial data
  useEffect(() => {
    // تحميل البيانات فقط إذا كان المستخدم مصادق وتم تحميل الملف الشخصي
    if (isAuthenticated && userProfile) {
      const inferredGender = inferGenderFromProfile(userProfile);

      if (inferredGender) {
        console.log('تحميل البيانات الأولية للبحث - المستخدم:', userProfile.id, 'الجنس:', inferredGender);
        loadUsers();
      } else {
        console.log('المستخدم مصادق والملف الشخصي محمل لكن لا يمكن تحديد الجنس');
      }
    } else if (isAuthenticated && !userProfile) {
      console.log('المستخدم مصادق لكن الملف الشخصي لم يتم تحميله بعد');
    }
  }, [isAuthenticated, userProfile]);

  const loadUsers = async () => {
    if (!userProfile) {
      console.log('لا يمكن تحميل المستخدمين - الملف الشخصي غير محمل');
      return;
    }

    const inferredGender = inferGenderFromProfile(userProfile);

    if (!inferredGender) {
      console.log('لا يمكن تحميل المستخدمين - لا يمكن تحديد الجنس من الملف الشخصي');
      console.log('userProfile:', userProfile);
      console.log('userProfile.gender:', userProfile?.gender);
      console.log('userProfile.beard:', userProfile?.beard);
      console.log('userProfile.hijab:', userProfile?.hijab);

      // محاولة إعادة تحميل الملف الشخصي
      try {
        await refreshProfile();
        console.log('تم إعادة تحميل الملف الشخصي');
      } catch (error) {
        console.error('خطأ في إعادة تحميل الملف الشخصي:', error);
      }
      return;
    }

    setIsLoading(true);
    try {
      console.log('تحميل المستخدمين للمستخدم:', userProfile.id, 'الجنس:', inferredGender);

      // استخدام الدالة الجديدة للبحث المفلتر حسب الجنس
      const { data, error } = await userService.searchUsersForMatching(
        userProfile.id,
        inferredGender,
        { limit: 20 }
      );

      if (error) {
        console.error('خطأ في البحث:', error);
        console.error('تفاصيل الخطأ:', error);
        throw error;
      }

      console.log('نتائج البحث الخام:', data);
      const sortedData = sortResults(data || [], sortBy);
      setSearchResults(sortedData);
      console.log(`تم تحميل ${data?.length || 0} مستخدم بنجاح وترتيبهم حسب: ${sortBy}`);

      // إضافة تسجيل مفصل للنتائج
      if (data && data.length > 0) {
        console.log('أول 3 نتائج:', data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading users:', error);
      console.error('Stack trace:', error);
      // عرض رسالة خطأ للمستخدم
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SearchFormData) => {
    if (!userProfile) {
      console.error('لا يمكن البحث - الملف الشخصي غير محمل');
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }

    const inferredGender = inferGenderFromProfile(userProfile);

    if (!inferredGender) {
      console.error('لا يمكن البحث - لا يمكن تحديد الجنس من الملف الشخصي');
      alert('يرجى إكمال الملف الشخصي وتحديد الجنس أولاً');
      return;
    }

    setIsLoading(true);
    try {
      // Update active filters for display
      const filters = [];
      if (data.ageMin || data.ageMax) {
        filters.push(`العمر: ${data.ageMin || 18}-${data.ageMax || 80}`);
      }
      if (data.city) filters.push(`المدينة: ${data.city}`);
      if (data.maritalStatus && data.maritalStatus !== 'any') {
        const statusMap = {
          single: 'أعزب/عزباء',
          divorced: 'مطلق/مطلقة',
          widowed: 'أرمل/أرملة'
        };
        filters.push(`الحالة: ${statusMap[data.maritalStatus]}`);
      }
      if (data.education) filters.push(`التعليم: ${data.education}`);
      if (data.profession) filters.push(`المهنة: ${data.profession}`);
      if (data.religiousCommitment && data.religiousCommitment !== 'any') {
        const commitmentMap = {
          high: 'ملتزم جداً',
          medium: 'ملتزم',
          practicing: 'ممارس'
        };
        filters.push(`الالتزام: ${commitmentMap[data.religiousCommitment]}`);
      }

      setActiveFilters(filters);

      console.log('البحث مع الفلاتر للمستخدم:', userProfile.id, 'الجنس:', userProfile.gender);
      console.log('فلاتر البحث:', {
        ageMin: data.ageMin,
        ageMax: data.ageMax,
        city: data.city,
        maritalStatus: data.maritalStatus,
        religiousCommitment: data.religiousCommitment
      });

      // البحث مع فلترة الجنس المقابل
      const { data: results, error } = await userService.searchUsersForMatching(
        userProfile.id,
        inferredGender,
        {
          ageMin: data.ageMin,
          ageMax: data.ageMax,
          city: data.city,
          maritalStatus: data.maritalStatus,
          religiousCommitment: data.religiousCommitment,
          limit: 50
        }
      );

      if (error) {
        console.error('خطأ في البحث مع الفلاتر:', error);
        throw error;
      }

      console.log('نتائج البحث مع الفلاتر:', results);
      const sortedResults = sortResults(results || [], sortBy);
      setSearchResults(sortedResults);

      console.log(`تم العثور على ${results?.length || 0} نتيجة وترتيبها حسب: ${sortBy}`);
    } catch (error) {
      console.error('Search error:', error);
      console.error('تفاصيل خطأ البحث:', error);
      alert('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  // دالة لإعادة تحميل الملف الشخصي
  const handleRefreshProfile = async () => {
    setIsRefreshingProfile(true);
    try {
      await refreshProfile();
      console.log('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      console.error('خطأ في تحديث الملف الشخصي:', error);
    } finally {
      setIsRefreshingProfile(false);
    }
  };

  // دالة ترتيب النتائج
  const sortResults = (results: UserType[], sortType: string) => {
    const sortedResults = [...results];

    switch (sortType) {
      case 'newest':
        return sortedResults.sort((a, b) =>
          new Date((b as any).created_at || 0).getTime() - new Date((a as any).created_at || 0).getTime()
        );
      case 'age':
        return sortedResults.sort((a, b) => (a.age || 0) - (b.age || 0));
      case 'rating':
        // يمكن إضافة نظام تقييم لاحقاً
        return sortedResults.sort((_a, _b) => Math.random() - 0.5);
      case 'lastSeen':
        return sortedResults.sort((a, b) =>
          new Date(b.last_login || 0).getTime() - new Date(a.last_login || 0).getTime()
        );
      default:
        return sortedResults;
    }
  };

  // دالة معالجة تغيير الترتيب
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy as 'newest' | 'age' | 'rating' | 'lastSeen');
    const sortedResults = sortResults(searchResults, newSortBy);
    setSearchResults(sortedResults);
    console.log(`تم ترتيب النتائج حسب: ${newSortBy}`);
  };

  const clearFilters = () => {
    reset();
    setActiveFilters([]);
    loadUsers(); // Reload all users
  };

  // دالة إنشاء محادثة جديدة
  const handleStartConversation = async (targetUserId: string) => {
    if (!userProfile?.id) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }

    try {
      console.log('إنشاء محادثة جديدة مع المستخدم:', targetUserId);

      const { data, error } = await messageService.createConversation(
        userProfile.id,
        targetUserId
      );

      if (error) {
        console.error('خطأ في إنشاء المحادثة:', error);
        alert('حدث خطأ أثناء إنشاء المحادثة');
        return;
      }

      console.log('تم إنشاء المحادثة بنجاح:', data);

      // الانتقال إلى صفحة الرسائل
      navigate('/messages');
    } catch (error) {
      console.error('خطأ غير متوقع في إنشاء المحادثة:', error);
      alert('حدث خطأ غير متوقع');
    }
  };

  const getMaritalStatusText = (status: string) => {
    const statusMap = {
      single: 'أعزب/عزباء',
      divorced: 'مطلق/مطلقة',
      widowed: 'أرمل/أرملة'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  // Unused function - commented out
  // const getReligiousCommitmentText = (commitment: string) => {
  //   const commitmentMap = {
  //     high: 'ملتزم جداً',
  //     medium: 'ملتزم',
  //     practicing: 'ممارس'
  //   };
  //   return commitmentMap[commitment as keyof typeof commitmentMap] || commitment;
  // };

  // عرض شاشة تحميل أثناء فحص المصادقة أو تحميل الملف الشخصي
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">جاري التحقق من المصادقة...</p>
        </div>
      </div>
    );
  }

  // عرض رسالة إذا لم يكن المستخدم مسجل دخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center" dir="rtl">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">يرجى تسجيل الدخول</h2>
          <p className="text-slate-600 mb-6">
            يجب تسجيل الدخول للوصول إلى صفحة البحث
          </p>
          <a
            href="/login"
            className="bg-gradient-to-r from-primary-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-medium hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            تسجيل الدخول
          </a>
        </div>
      </div>
    );
  }

  // عرض شاشة تحميل إذا كان المستخدم مصادق لكن الملف الشخصي لم يتم تحميله بعد
  if (isAuthenticated && !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  // عرض رسالة إذا تم تحميل الملف الشخصي لكن لا يمكن تحديد الجنس
  if (userProfile && !inferGenderFromProfile(userProfile)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center" dir="rtl">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">يرجى إكمال الملف الشخصي</h2>
          <p className="text-slate-600 mb-6">
            يجب تحديد الجنس في الملف الشخصي للوصول إلى صفحة البحث. يرجى الذهاب إلى صفحة الملف الشخصي وتحديد الجنس.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-sm">
              💡 إذا كنت قد حددت الجنس أثناء التسجيل، جرب إعادة تحميل الملف الشخصي أولاً
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRefreshProfile}
              disabled={isRefreshingProfile}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isRefreshingProfile ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري إعادة التحميل...
                </div>
              ) : (
                'إعادة تحميل الملف الشخصي'
              )}
            </button>
            <a
              href="/profile"
              className="bg-gradient-to-r from-primary-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-medium hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              إكمال الملف الشخصي
            </a>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 py-4 md:py-8" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-32 h-32 md:w-64 md:h-64 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 md:mb-4 font-display">
            البحث المتقدم
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 px-4 mb-4">
            ابحث عن شريك حياتك المثالي باستخدام فلاتر البحث المتقدمة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {/* Search Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-white/20 p-4 md:p-6 lg:sticky lg:top-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Filter className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
                  فلاتر البحث
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-slate-600 hover:text-slate-800"
                >
                  <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Age Range */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-3">
                      العمر
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="number"
                          {...register('ageMin', { valueAsNumber: true })}
                          placeholder="من"
                          min="18"
                          max="80"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          {...register('ageMax', { valueAsNumber: true })}
                          placeholder="إلى"
                          min="18"
                          max="80"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      المدينة
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      placeholder="اختر المدينة"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Marital Status */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      الحالة الاجتماعية
                    </label>
                    <select
                      {...register('maritalStatus')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                      <option value="any">الكل</option>
                      <option value="single">أعزب/عزباء</option>
                      <option value="divorced">مطلق/مطلقة</option>
                      <option value="widowed">أرمل/أرملة</option>
                    </select>
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      التعليم
                    </label>
                    <input
                      type="text"
                      {...register('education')}
                      placeholder="المؤهل التعليمي"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Profession */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      المهنة
                    </label>
                    <input
                      type="text"
                      {...register('profession')}
                      placeholder="المهنة"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Religious Commitment */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      مستوى الالتزام الديني
                    </label>
                    <select
                      {...register('religiousCommitment')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                      <option value="any">الكل</option>
                      <option value="high">ملتزم جداً</option>
                      <option value="medium">ملتزم</option>
                      <option value="practicing">ممارس</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري البحث...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        بحث
                      </>
                    )}
                  </button>

                  {/* Clear Filters */}
                  {activeFilters.length > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="w-full text-slate-600 hover:text-slate-800 py-2 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      مسح الفلاتر
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-slate-800 mb-3">الفلاتر النشطة:</h3>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {filter}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                نتائج البحث ({searchResults.length})
              </h2>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-sm">ترتيب حسب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="newest">الأحدث</option>
                  <option value="age">العمر</option>
                  <option value="rating">التقييم</option>
                  <option value="lastSeen">آخر ظهور</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 p-6 transform hover:-translate-y-1"
                >
                  {/* Profile Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar Placeholder */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-slate-800">
                            {result.first_name} {result.last_name}
                          </h3>
                          {result.verified && (
                            <Shield className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{result.age} سنة</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{result.city}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${
                        result.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}></div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-3 mb-4">
                    {result.education && (
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{result.education}</span>
                      </div>
                    )}
                    {result.profession && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{result.profession}</span>
                      </div>
                    )}
                    {result.marital_status && (
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{getMaritalStatusText(result.marital_status)}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {result.bio && (
                    <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-2">
                      {result.bio}
                    </p>
                  )}

                  {/* Last Seen */}
                  {result.last_login && (
                    <div className="text-xs text-slate-500 mb-4">
                      آخر ظهور: {new Date(result.last_login).toLocaleDateString('ar-SA')}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStartConversation(result.id)}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-emerald-600 text-white py-2 px-4 rounded-xl font-medium hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      إرسال رسالة
                    </button>
                    <button
                      onClick={() => navigate(`/profile/${result.id}`)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center"
                      title="عرض الملف الشخصي"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {searchResults.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  لا توجد نتائج
                </h3>
                <p className="text-slate-600 mb-4">
                  لم نجد أي نتائج تطابق معايير البحث الخاصة بك
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                  مسح الفلاتر والبحث مرة أخرى
                </button>
              </div>
            )}

            {/* Pagination */}
            {searchResults.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    السابق
                  </button>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                    1
                  </button>
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    2
                  </button>
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    3
                  </button>
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    التالي
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
