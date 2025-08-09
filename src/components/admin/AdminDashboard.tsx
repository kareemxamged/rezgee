import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Shield,
  TrendingUp,
  Activity,
  AlertTriangle,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { adminDashboardService } from '../../lib/adminDashboardService';
import type { DashboardStats, RecentActivity, SystemAlert } from '../../lib/adminDashboardService';
import StatsCard from './StatsCard';
import RecentActivities from './RecentActivities';
import SystemAlerts from './SystemAlerts';

const AdminDashboard: React.FC = () => {
  const { adminUser, logActivity } = useAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // تحميل البيانات
  const loadDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const [statsData, activitiesData, alertsData] = await Promise.all([
        adminDashboardService.getDashboardStats(),
        adminDashboardService.getRecentActivities(10),
        adminDashboardService.getSystemAlerts()
      ]);

      setStats(statsData);
      setActivities(activitiesData);
      setAlerts(alertsData);

      // تسجيل النشاط
      await logActivity('view_dashboard', 'dashboard');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // تحميل البيانات عند تحميل المكون
  useEffect(() => {
    loadDashboardData();
  }, []);

  // تحديث البيانات
  const handleRefresh = () => {
    loadDashboardData(true);
  };

  // إغلاق التنبيه
  const handleDismissAlert = async (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    await logActivity('dismiss_alert', 'system_alert', alertId);
  };

  // التعامل مع إجراء التنبيه
  const handleAlertAction = async (alert: SystemAlert) => {
    if (alert.action?.url) {
      window.location.href = alert.action.url;
      await logActivity('click_alert_action', 'system_alert', alert.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" dir="rtl">
      {/* الهيدر */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم الإدارية</h1>
            <p className="text-slate-600 mt-1">
              مرحباً {adminUser?.user_profile?.first_name && adminUser?.user_profile?.last_name
                ? `${adminUser.user_profile.first_name} ${adminUser.user_profile.last_name}`
                : adminUser?.user_profile?.email
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="إجمالي المستخدمين"
            value={stats?.totalUsers || 0}
            icon={Users}
            color="blue"
            loading={loading}
            change={{
              value: 12,
              type: 'increase',
              period: 'هذا الشهر'
            }}
            onClick={() => window.location.href = '/admin/users'}
          />
          
          <StatsCard
            title="المقالات المنشورة"
            value={stats?.publishedArticles || 0}
            icon={FileText}
            color="green"
            loading={loading}
            change={{
              value: 8,
              type: 'increase',
              period: 'هذا الأسبوع'
            }}
            onClick={() => window.location.href = '/admin/content'}
          />
          
          <StatsCard
            title="الرسائل النشطة"
            value={stats?.totalMessages || 0}
            icon={MessageSquare}
            color="yellow"
            loading={loading}
            change={{
              value: 5,
              type: 'increase',
              period: 'اليوم'
            }}
            onClick={() => window.location.href = '/admin/messages'}
          />
          
          <StatsCard
            title="أحداث الأمان"
            value={stats?.securityEvents || 0}
            icon={Shield}
            color="red"
            loading={loading}
            change={{
              value: -15,
              type: 'decrease',
              period: 'هذا الأسبوع'
            }}
            onClick={() => window.location.href = '/admin/security'}
          />
        </div>

        {/* إحصائيات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="مستخدمون جدد اليوم"
            value={stats?.newUsersToday || 0}
            icon={TrendingUp}
            color="indigo"
            loading={loading}
          />
          
          <StatsCard
            title="المستخدمون النشطون"
            value={stats?.activeUsers || 0}
            icon={Activity}
            color="purple"
            loading={loading}
          />
          
          <StatsCard
            title="البلاغات المعلقة"
            value={stats?.reportedUsers || 0}
            icon={AlertTriangle}
            color="red"
            loading={loading}
          />
          
          <StatsCard
            title="المشرفون النشطون"
            value={stats?.activeAdmins || 0}
            icon={Settings}
            color="blue"
            loading={loading}
          />
        </div>

        {/* المحتوى الرئيسي */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* الأنشطة الأخيرة */}
          <div className="lg:col-span-2">
            <RecentActivities
              activities={activities}
              loading={loading}
              onViewAll={() => window.location.href = '/admin/activities'}
            />
          </div>

          {/* التنبيهات */}
          <div>
            <SystemAlerts
              alerts={alerts}
              loading={loading}
              onDismiss={handleDismissAlert}
              onAction={handleAlertAction}
            />
          </div>
        </div>

        {/* معلومات النظام */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">معلومات النظام</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {stats?.systemUptime || 'غير متوفر'}
              </div>
              <div className="text-sm text-slate-500">وقت التشغيل</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stats?.lastBackup || 'غير متوفر'}
              </div>
              <div className="text-sm text-slate-500">آخر نسخة احتياطية</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {stats?.totalCategories || 0}
              </div>
              <div className="text-sm text-slate-500">تصنيفات المحتوى</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600 mb-1">
                {stats?.verifiedUsers || 0}
              </div>
              <div className="text-sm text-slate-500">مستخدمون محققون</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
