import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  AlertTriangle,
  Shield,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  User,
  Calendar,
  MapPin,
  Mail,
  Phone,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe
} from 'lucide-react';
import SimpleTextManagement from './SimpleTextManagement';

// Mock data for admin dashboard
const mockStats = {
  totalUsers: 30000,
  activeUsers: 25000,
  newUsersToday: 150,
  totalMatches: 5000,
  pendingReports: 12,
  blockedUsers: 45
};

const mockUsers = [
  {
    id: 1,
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '0501234567',
    age: 28,
    city: 'الرياض',
    joinDate: '2024-01-15',
    status: 'active',
    verified: true,
    lastLogin: 'منذ ساعة'
  },
  {
    id: 2,
    name: 'فاطمة أحمد',
    email: 'fatima@example.com',
    phone: '0507654321',
    age: 26,
    city: 'جدة',
    joinDate: '2024-02-10',
    status: 'active',
    verified: true,
    lastLogin: 'منذ 3 ساعات'
  },
  {
    id: 3,
    name: 'محمد سالم',
    email: 'mohammed@example.com',
    phone: '0509876543',
    age: 32,
    city: 'الدمام',
    joinDate: '2024-01-20',
    status: 'suspended',
    verified: false,
    lastLogin: 'منذ يوم'
  }
];

const mockReports = [
  {
    id: 1,
    reportedUser: 'عبدالله أحمد',
    reportedBy: 'مريم سالم',
    reason: 'محتوى غير مناسب',
    description: 'إرسال رسائل غير لائقة',
    date: '2024-06-28',
    status: 'pending',
    severity: 'high'
  },
  {
    id: 2,
    reportedUser: 'سارة محمد',
    reportedBy: 'أحمد علي',
    reason: 'انتحال شخصية',
    description: 'استخدام معلومات مزيفة',
    date: '2024-06-27',
    status: 'pending',
    severity: 'medium'
  }
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: Activity },
    { id: 'users', name: 'إدارة المستخدمين', icon: Users },
    { id: 'reports', name: 'البلاغات', icon: AlertTriangle },
    { id: 'messages', name: 'مراقبة المحتوى', icon: MessageSquare },
    { id: 'texts', name: 'إدارة النصوص', icon: Globe }
  ];

  const handleUserAction = (userId: number, action: string) => {
    console.log(`Action ${action} for user ${userId}`);
    // Here you would implement the actual action
    alert(`تم تنفيذ العملية: ${action} للمستخدم ${userId}`);
  };

  const handleReportAction = (reportId: number, action: string) => {
    console.log(`Report ${reportId} ${action}`);
    alert(`تم ${action} البلاغ رقم ${reportId}`);
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.includes(searchTerm) || user.email.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-32 h-32 md:w-64 md:h-64 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 relative">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 md:mb-4 font-display">
            لوحة تحكم المشرفين
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 px-4">
            إدارة ومراقبة الموقع والمستخدمين
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-white/20 mb-6 md:mb-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 md:gap-3 px-3 md:px-6 py-3 md:py-4 font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-white/20 p-4 md:p-6 lg:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6">نظرة عامة</h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8" />
                    <TrendingUp className="w-6 h-6 text-primary-200" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{mockStats.totalUsers.toLocaleString()}</h3>
                  <p className="text-primary-100">إجمالي المستخدمين</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="w-8 h-8" />
                    <TrendingUp className="w-6 h-6 text-emerald-200" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{mockStats.activeUsers.toLocaleString()}</h3>
                  <p className="text-emerald-100">المستخدمون النشطون</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8" />
                    <TrendingUp className="w-6 h-6 text-amber-200" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{mockStats.newUsersToday}</h3>
                  <p className="text-amber-100">مستخدمون جدد اليوم</p>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <MessageSquare className="w-8 h-8" />
                    <TrendingUp className="w-6 h-6 text-rose-200" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{mockStats.totalMatches.toLocaleString()}</h3>
                  <p className="text-rose-100">إجمالي المطابقات</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="w-8 h-8" />
                    <TrendingDown className="w-6 h-6 text-orange-200" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{mockStats.pendingReports}</h3>
                  <p className="text-orange-100">البلاغات المعلقة</p>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="w-8 h-8" />
                    <TrendingDown className="w-6 h-6 text-red-200" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{mockStats.blockedUsers}</h3>
                  <p className="text-red-100">المستخدمون المحظورون</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">النشاط الأخير</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-slate-700">تم تسجيل مستخدم جديد: أحمد محمد</span>
                    <span className="text-slate-500 text-sm mr-auto">منذ 5 دقائق</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-slate-700">بلاغ جديد تم استلامه</span>
                    <span className="text-slate-500 text-sm mr-auto">منذ 15 دقيقة</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-slate-700">تم إنشاء مطابقة جديدة</span>
                    <span className="text-slate-500 text-sm mr-auto">منذ 30 دقيقة</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Management Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">إدارة المستخدمين</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="البحث عن مستخدم..."
                      className="px-4 py-2 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-right py-3 px-4 font-medium text-slate-700">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">المستخدم</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">معلومات الاتصال</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">الموقع</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">تاريخ التسجيل</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">الحالة</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <input 
                            type="checkbox" 
                            className="rounded"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user.id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                              }
                            }}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-800">{user.name}</span>
                                {user.verified && (
                                  <Shield className="w-4 h-4 text-emerald-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-slate-500">
                                <Calendar className="w-3 h-3" />
                                <span>{user.age} سنة</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-600">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-600">{user.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{user.city}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {user.joinDate}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800'
                              : user.status === 'suspended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {user.status === 'active' ? 'نشط' : user.status === 'suspended' ? 'معلق' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUserAction(user.id, 'view')}
                              className="p-1 text-slate-600 hover:text-primary-600 transition-colors"
                              title="عرض"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, 'edit')}
                              className="p-1 text-slate-600 hover:text-emerald-600 transition-colors"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, 'suspend')}
                              className="p-1 text-slate-600 hover:text-amber-600 transition-colors"
                              title="تعليق"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, 'delete')}
                              className="p-1 text-slate-600 hover:text-red-600 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bulk Actions */}
              {selectedUsers.length > 0 && (
                <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-primary-800">
                      تم تحديد {selectedUsers.length} مستخدم
                    </span>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        تفعيل
                      </button>
                      <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                        تعليق
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">البلاغات</h2>
              
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div key={report.id} className="border border-slate-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          report.severity === 'high' ? 'bg-red-500' :
                          report.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}></div>
                        <div>
                          <h3 className="font-medium text-slate-800">
                            بلاغ ضد: {report.reportedUser}
                          </h3>
                          <p className="text-sm text-slate-600">
                            من: {report.reportedBy} • {report.date}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        report.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {report.status === 'pending' ? 'معلق' : 'تم الحل'}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-slate-700 mb-2">
                        <strong>السبب:</strong> {report.reason}
                      </p>
                      <p className="text-slate-600">
                        <strong>التفاصيل:</strong> {report.description}
                      </p>
                    </div>

                    {report.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReportAction(report.id, 'approve')}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          قبول البلاغ
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'reject')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          رفض البلاغ
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'investigate')}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          تحقيق
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Monitoring Tab */}
          {activeTab === 'messages' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">مراقبة المحتوى</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">الرسائل المعتمدة</h3>
                  <p className="text-3xl font-bold">1,247</p>
                  <p className="text-emerald-100 text-sm">اليوم</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">الرسائل المعلقة</h3>
                  <p className="text-3xl font-bold">23</p>
                  <p className="text-amber-100 text-sm">تحتاج مراجعة</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">الرسائل المعلقة للمراجعة</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-medium text-slate-800">أحمد محمد</span>
                        <span className="text-slate-500 text-sm mr-2">إلى فاطمة أحمد</span>
                      </div>
                      <span className="text-xs text-slate-500">منذ 5 دقائق</span>
                    </div>
                    <p className="text-slate-700 mb-3">
                      "أتمنى أن نتمكن من التحدث أكثر والتعرف على بعضنا البعض بشكل أفضل"
                    </p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors">
                        موافقة
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                        رفض
                      </button>
                      <button className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700 transition-colors">
                        تعديل
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Text Management Tab */}
          {activeTab === 'texts' && (
            <div>
              <SimpleTextManagement />
            </div>
          )}

          {/* Migration Tab */}
          {/* {activeTab === 'migration' && (
            <div>
              <MigrationManager />
            </div>
          )} */}

          {/* Test Tab */}
          {/* {activeTab === 'test' && (
            <div>
              <TranslationTest />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
