import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '../lib/supabase';

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
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema)
  });

  // Load initial data
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await userService.getUsers({ limit: 20 });
      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SearchFormData) => {
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

      // Search with real data from Supabase
      const { data: results, error } = await userService.getUsers({
        ageMin: data.ageMin,
        ageMax: data.ageMax,
        city: data.city,
        maritalStatus: data.maritalStatus,
        religiousCommitment: data.religiousCommitment,
        limit: 50
      });

      if (error) throw error;
      setSearchResults(results || []);
    } catch (error) {
      console.error('Search error:', error);
      alert('حدث خطأ أثناء البحث');
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    reset();
    setActiveFilters([]);
    loadUsers(); // Reload all users
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
          <p className="text-base md:text-lg lg:text-xl text-slate-600 px-4">
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
                <select className="px-3 py-1 border border-slate-300 rounded-lg text-sm">
                  <option>الأحدث</option>
                  <option>العمر</option>
                  <option>التقييم</option>
                  <option>آخر ظهور</option>
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
                    <button className="flex-1 bg-gradient-to-r from-primary-600 to-emerald-600 text-white py-2 px-4 rounded-xl font-medium hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      إرسال رسالة
                    </button>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center">
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
