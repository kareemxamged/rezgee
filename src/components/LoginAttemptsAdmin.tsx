import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, RefreshCw, AlertTriangle, Unlock } from 'lucide-react';
import { loginAttemptsService } from '../lib/loginAttemptsService';
import { supabase } from '../lib/supabase';

interface LoginAttempt {
  id: string;
  email: string;
  ip_address?: string;
  user_agent?: string;
  attempt_type: string;
  success: boolean;
  failure_reason?: string;
  user_id?: string;
  session_id?: string;
  created_at: string;
}

interface LoginBlock {
  id: string;
  email: string;
  ip_address?: string;
  block_type: 'short_term' | 'daily_limit' | 'manual';
  block_reason?: string;
  blocked_until: string;
  failed_attempts_count: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface UserStats {
  email: string;
  totalAttempts: number;
  successfulAttempts: number;
  failedAttempts: number;
  todayAttempts: number;
  isBlocked: boolean;
  blockInfo?: LoginBlock;
}

const LoginAttemptsAdmin: React.FC = () => {
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [blocks, setBlocks] = useState<LoginBlock[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'attempts' | 'blocks' | 'stats'>('attempts');
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'today'>('all');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  // تحميل المحاولات
  const loadAttempts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('login_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // تطبيق الفلاتر
      if (filter === 'success') {
        query = query.eq('success', true);
      } else if (filter === 'failed') {
        query = query.eq('success', false);
      } else if (filter === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte('created_at', today.toISOString());
      }

      if (selectedEmail) {
        query = query.eq('email', selectedEmail);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading attempts:', error);
        return;
      }

      setAttempts(data || []);
    } catch (error) {
      console.error('Error in loadAttempts:', error);
    } finally {
      setLoading(false);
    }
  };

  // تحميل حالات المنع
  const loadBlocks = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('login_blocks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading blocks:', error);
        return;
      }

      setBlocks(data || []);
    } catch (error) {
      console.error('Error in loadBlocks:', error);
    } finally {
      setLoading(false);
    }
  };

  // تحميل إحصائيات المستخدمين
  const loadUserStats = async () => {
    try {
      setLoading(true);
      
      // الحصول على قائمة البريد الإلكتروني الفريدة
      const { data: emailsData, error: emailsError } = await supabase
        .from('login_attempts')
        .select('email')
        .order('created_at', { ascending: false });

      if (emailsError) {
        console.error('Error loading emails:', emailsError);
        return;
      }

      const uniqueEmails = [...new Set(emailsData?.map(item => item.email) || [])];
      const stats: UserStats[] = [];

      // الحصول على إحصائيات كل بريد إلكتروني
      for (const email of uniqueEmails.slice(0, 20)) { // أول 20 بريد إلكتروني
        const userStat = await loginAttemptsService.getUserStats(email);
        stats.push({
          email,
          ...userStat
        });
      }

      setUserStats(stats);
    } catch (error) {
      console.error('Error in loadUserStats:', error);
    } finally {
      setLoading(false);
    }
  };

  // إلغاء منع المستخدم
  const handleUnblockUser = async (email: string) => {
    try {
      const result = await loginAttemptsService.unblockUser(email);
      if (result.success) {
        alert('تم إلغاء منع المستخدم بنجاح');
        loadBlocks();
        loadUserStats();
      } else {
        alert('فشل في إلغاء المنع: ' + result.error);
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('حدث خطأ أثناء إلغاء المنع');
    }
  };

  // البحث عن إحصائيات مستخدم معين
  const handleSearchUser = async () => {
    if (!searchEmail) return;
    
    try {
      const userStat = await loginAttemptsService.getUserStats(searchEmail);
      setUserStats([{
        email: searchEmail,
        ...userStat
      }]);
    } catch (error) {
      console.error('Error searching user:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'attempts') {
      loadAttempts();
    } else if (activeTab === 'blocks') {
      loadBlocks();
    } else if (activeTab === 'stats') {
      loadUserStats();
    }
  }, [activeTab, filter, selectedEmail]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      calendar: 'gregory'
    });
  };

  const getBlockTypeLabel = (blockType: string) => {
    switch (blockType) {
      case 'short_term': return 'منع قصير المدى (5 ساعات)';
      case 'daily_limit': return 'منع يومي (24 ساعة)';
      case 'manual': return 'منع يدوي';
      default: return blockType;
    }
  };

  const getFailureReasonLabel = (reason?: string) => {
    switch (reason) {
      case 'invalid_credentials': return 'بيانات خاطئة';
      case 'account_not_verified': return 'حساب غير مؤكد';
      case 'account_suspended': return 'حساب معلق';
      case 'rate_limited': return 'تجاوز الحد المسموح';
      case 'system_error': return 'خطأ في النظام';
      default: return reason || 'غير محدد';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">إدارة محاولات تسجيل الدخول</h1>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('attempts')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'attempts'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              محاولات تسجيل الدخول
            </button>
            <button
              onClick={() => setActiveTab('blocks')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'blocks'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              حالات المنع
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              إحصائيات المستخدمين
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            {activeTab === 'attempts' && (
              <>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">جميع المحاولات</option>
                  <option value="success">المحاولات الناجحة</option>
                  <option value="failed">المحاولات الفاشلة</option>
                  <option value="today">محاولات اليوم</option>
                </select>
                
                <input
                  type="email"
                  placeholder="البحث بالبريد الإلكتروني"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </>
            )}
            
            {activeTab === 'stats' && (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="البحث عن مستخدم"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleSearchUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  بحث
                </button>
              </div>
            )}
            
            <button
              onClick={() => {
                if (activeTab === 'attempts') loadAttempts();
                else if (activeTab === 'blocks') loadBlocks();
                else loadUserStats();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Login Attempts Tab */}
              {activeTab === 'attempts' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-right py-3 px-4">البريد الإلكتروني</th>
                        <th className="text-right py-3 px-4">النتيجة</th>
                        <th className="text-right py-3 px-4">سبب الفشل</th>
                        <th className="text-right py-3 px-4">عنوان IP</th>
                        <th className="text-right py-3 px-4">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map((attempt) => (
                        <tr key={attempt.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{attempt.email}</td>
                          <td className="py-3 px-4">
                            {attempt.success ? (
                              <span className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                نجح
                              </span>
                            ) : (
                              <span className="flex items-center gap-2 text-red-600">
                                <XCircle className="w-4 h-4" />
                                فشل
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {attempt.failure_reason ? getFailureReasonLabel(attempt.failure_reason) : '-'}
                          </td>
                          <td className="py-3 px-4">{attempt.ip_address || '-'}</td>
                          <td className="py-3 px-4">{formatDate(attempt.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {attempts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      لا توجد محاولات تسجيل دخول
                    </div>
                  )}
                </div>
              )}

              {/* Login Blocks Tab */}
              {activeTab === 'blocks' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-right py-3 px-4">البريد الإلكتروني</th>
                        <th className="text-right py-3 px-4">نوع المنع</th>
                        <th className="text-right py-3 px-4">منع حتى</th>
                        <th className="text-right py-3 px-4">المحاولات الفاشلة</th>
                        <th className="text-right py-3 px-4">الحالة</th>
                        <th className="text-right py-3 px-4">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blocks.map((block) => (
                        <tr key={block.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{block.email}</td>
                          <td className="py-3 px-4">{getBlockTypeLabel(block.block_type)}</td>
                          <td className="py-3 px-4">{formatDate(block.blocked_until)}</td>
                          <td className="py-3 px-4">{block.failed_attempts_count}</td>
                          <td className="py-3 px-4">
                            {block.is_active && new Date(block.blocked_until) > new Date() ? (
                              <span className="text-red-600 font-medium">نشط</span>
                            ) : (
                              <span className="text-gray-500">منتهي</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {block.is_active && new Date(block.blocked_until) > new Date() && (
                              <button
                                onClick={() => handleUnblockUser(block.email)}
                                className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-xs"
                              >
                                <Unlock className="w-3 h-3" />
                                إلغاء المنع
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {blocks.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      لا توجد حالات منع
                    </div>
                  )}
                </div>
              )}

              {/* User Stats Tab */}
              {activeTab === 'stats' && (
                <div className="grid gap-4">
                  {userStats.map((stat) => (
                    <div key={stat.email} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{stat.email}</h3>
                        {stat.isBlocked && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs">
                            <AlertTriangle className="w-3 h-3" />
                            محظور
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">إجمالي المحاولات:</span>
                          <span className="font-medium mr-2">{stat.totalAttempts}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">المحاولات الناجحة:</span>
                          <span className="font-medium mr-2 text-green-600">{stat.successfulAttempts}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">المحاولات الفاشلة:</span>
                          <span className="font-medium mr-2 text-red-600">{stat.failedAttempts}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">محاولات اليوم:</span>
                          <span className="font-medium mr-2">{stat.todayAttempts}</span>
                        </div>
                      </div>
                      
                      {stat.blockInfo && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="text-sm text-red-800">
                            <strong>معلومات المنع:</strong> {getBlockTypeLabel(stat.blockInfo.block_type)}
                            <br />
                            <strong>منع حتى:</strong> {formatDate(stat.blockInfo.blocked_until)}
                            <br />
                            {stat.blockInfo.block_reason && (
                              <>
                                <strong>السبب:</strong> {stat.blockInfo.block_reason}
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => handleUnblockUser(stat.email)}
                            className="mt-2 flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-xs"
                          >
                            <Unlock className="w-3 h-3" />
                            إلغاء المنع
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {userStats.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      لا توجد إحصائيات متاحة
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginAttemptsAdmin;
