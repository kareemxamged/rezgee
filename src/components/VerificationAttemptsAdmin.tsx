import React, { useState, useEffect } from 'react';
import { Shield, Clock, CheckCircle, XCircle, RefreshCw, Trash2, Eye } from 'lucide-react';
import { emailVerificationService } from '../lib/emailVerification';
import { supabase } from '../lib/supabase';

interface VerificationAttempt {
  id: string;
  email: string;
  ip_address?: string;
  user_agent?: string;
  attempt_type: string;
  success: boolean;
  error_message?: string;
  created_at: string;
}

interface UserStats {
  email: string;
  totalAttempts: number;
  successfulAttempts: number;
  failedAttempts: number;
  todayAttempts: number;
  lastAttempt?: Date;
  canSendNext?: Date;
}

const VerificationAttemptsAdmin: React.FC = () => {
  const [attempts, setAttempts] = useState<VerificationAttempt[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'today'>('all');

  // تحميل المحاولات
  const loadAttempts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('verification_attempts')
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

  // تحميل إحصائيات المستخدمين
  const loadUserStats = async () => {
    try {
      // الحصول على قائمة البريد الإلكتروني الفريدة
      const { data: emails, error } = await supabase
        .from('verification_attempts')
        .select('email')
        .order('email');

      if (error || !emails) return;

      const uniqueEmails = [...new Set(emails.map(e => e.email))];
      const stats: UserStats[] = [];

      for (const email of uniqueEmails) {
        const emailStats = await emailVerificationService.getVerificationStats(email);
        stats.push({
          email,
          ...emailStats
        });
      }

      setUserStats(stats.sort((a, b) => b.todayAttempts - a.todayAttempts));
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  // إعادة تعيين محاولات مستخدم
  const resetUserAttempts = async (email: string) => {
    if (!confirm(`هل أنت متأكد من إعادة تعيين محاولات ${email}؟`)) return;

    try {
      const result = await emailVerificationService.resetUserAttempts(email);
      if (result.success) {
        alert('تم إعادة تعيين المحاولات بنجاح');
        loadAttempts();
        loadUserStats();
      } else {
        alert('حدث خطأ: ' + result.error);
      }
    } catch (error) {
      alert('حدث خطأ غير متوقع');
    }
  };

  // تنظيف المحاولات القديمة
  const cleanupOldAttempts = async () => {
    if (!confirm('هل أنت متأكد من حذف المحاولات الأقدم من 30 يوم؟')) return;

    try {
      await emailVerificationService.cleanupOldAttempts();
      alert('تم تنظيف المحاولات القديمة بنجاح');
      loadAttempts();
      loadUserStats();
    } catch (error) {
      alert('حدث خطأ في التنظيف');
    }
  };

  useEffect(() => {
    loadAttempts();
    loadUserStats();
  }, [filter, selectedEmail]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA');
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusText = (success: boolean) => {
    return success ? 'نجح' : 'فشل';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  مراقبة محاولات التحقق
                </h1>
                <p className="text-gray-600">
                  إدارة ومراقبة محاولات إرسال روابط التحقق
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadAttempts}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4" />
                تحديث
              </button>
              <button
                onClick={cleanupOldAttempts}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                تنظيف قديم
              </button>
            </div>
          </div>
        </div>

        {/* الفلاتر */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الفلتر
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع المحاولات</option>
                <option value="success">الناجحة فقط</option>
                <option value="failed">الفاشلة فقط</option>
                <option value="today">اليوم فقط</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                placeholder="فلترة حسب البريد الإلكتروني"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* إحصائيات المستخدمين */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                إحصائيات المستخدمين
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userStats.map((stat) => (
                  <div
                    key={stat.email}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {stat.email}
                      </div>
                      <div className="text-sm text-gray-600">
                        اليوم: {stat.todayAttempts}/12 | 
                        الإجمالي: {stat.totalAttempts} | 
                        نجح: {stat.successfulAttempts} | 
                        فشل: {stat.failedAttempts}
                      </div>
                      {stat.canSendNext && new Date() < stat.canSendNext && (
                        <div className="text-sm text-red-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          محظور حتى: {stat.canSendNext.toLocaleString('ar-SA')}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => resetUserAttempts(stat.email)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      إعادة تعيين
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* قائمة المحاولات */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                المحاولات الأخيرة ({attempts.length})
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-600 mt-2">جاري التحميل...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {attempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(attempt.success)}
                          <div>
                            <div className="font-medium text-gray-900">
                              {attempt.email}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(attempt.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            attempt.success 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {getStatusText(attempt.success)}
                          </span>
                          <button
                            onClick={() => setShowDetails(
                              showDetails === attempt.id ? null : attempt.id
                            )}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {showDetails === attempt.id && (
                        <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="font-medium">IP:</span> {attempt.ip_address || 'غير متاح'}
                            </div>
                            <div>
                              <span className="font-medium">النوع:</span> {attempt.attempt_type}
                            </div>
                          </div>
                          {attempt.error_message && (
                            <div className="mt-2">
                              <span className="font-medium">الخطأ:</span>
                              <div className="text-red-600 bg-red-50 p-2 rounded mt-1">
                                {attempt.error_message}
                              </div>
                            </div>
                          )}
                          {attempt.user_agent && (
                            <div className="mt-2">
                              <span className="font-medium">المتصفح:</span>
                              <div className="text-gray-600 text-xs mt-1 break-all">
                                {attempt.user_agent}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {attempts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      لا توجد محاولات للعرض
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationAttemptsAdmin;
