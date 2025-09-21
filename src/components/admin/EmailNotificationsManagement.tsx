import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  Settings, 
  FileText, 
  Users, 
  BarChart3, 
  RefreshCw, 
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Download,
  Upload,
  ToggleLeft,
  ToggleRight,
  MoreVertical,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
  Bell,
  AlertTriangle
} from 'lucide-react';
import ModernAdminContainer from './ModernAdminContainer';
import { EmailNotificationsAdminService } from '../../lib/emailNotificationsAdminService';
import { DatabaseEmailService } from '../../lib/databaseEmailService';
import TestIntegratedEmailSystem from '../../lib/testIntegratedEmailSystem';
import { useToast } from '../ToastContainer';

// تعريف الواجهات محلياً
interface EmailNotificationType {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  template_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  subject_ar: string;
  subject_en: string;
  content_ar: string;
  content_en: string;
  html_template_ar: string;
  html_template_en: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EmailSettings {
  id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  from_name_ar: string;
  from_name_en: string;
  from_email: string;
  reply_to: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EmailLog {
  id: string;
  template_name: string;
  recipient_email: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  error_message?: string;
  sent_at?: string;
  created_at: string;
}

interface EmailStats {
  totalSent: number;
  totalFailed: number;
  successRate: number;
  dailySends: number;
}

const EmailNotificationsManagement: React.FC = () => {
  const { t } = useTranslation();
  const { showSuccess, showError, showWarning } = useToast();
  
  // الحالة الأساسية
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // البيانات
  const [notificationTypes, setNotificationTypes] = useState<EmailNotificationType[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [emailSettings, setEmailSettings] = useState<EmailSettings[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [emailStats, setEmailStats] = useState<EmailStats>({
    totalSent: 0,
    totalFailed: 0,
    successRate: 0,
    dailySends: 0
  });

  const [refreshing, setRefreshing] = useState(false);
  
  // حالة البحث والفلترة للقوالب
  const [templateSearchTerm, setTemplateSearchTerm] = useState('');
  const [templateStatusFilter, setTemplateStatusFilter] = useState('all');
  const [templateSortBy, setTemplateSortBy] = useState('name');
  const [templateSortOrder, setTemplateSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // حالة النوافذ المنبثقة
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingType, setEditingType] = useState<EmailNotificationType | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [editingSettings, setEditingSettings] = useState<EmailSettings | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<EmailTemplate | null>(null);

  // تحميل البيانات
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadNotificationTypes(),
        loadEmailTemplates(),
        loadEmailSettings(),
        loadEmailLogs(),
        loadEmailStats()
      ]);
    } catch (err: any) {
      setError(err.message || 'خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationTypes = async () => {
    try {
      console.log('بدء تحميل أنواع الإشعارات...');
      const data = await EmailNotificationsAdminService.getNotificationTypes();
      console.log('تم تحميل أنواع الإشعارات:', data);
      setNotificationTypes(data);
    } catch (err: any) {
      console.error('خطأ في تحميل أنواع الإشعارات:', err);
      setNotificationTypes([]);
    }
  };

  const loadEmailTemplates = async () => {
    try {
      console.log('بدء تحميل قوالب الإيميلات...');
      const data = await EmailNotificationsAdminService.getEmailTemplates();
      console.log('تم تحميل قوالب الإيميلات:', data);
      setEmailTemplates(data);
    } catch (err: any) {
      console.error('خطأ في تحميل قوالب الإيميلات:', err);
      setEmailTemplates([]);
    }
  };

  const loadEmailSettings = async () => {
    try {
      console.log('بدء تحميل إعدادات الإيميلات...');
      const data = await EmailNotificationsAdminService.getEmailSettings();
      console.log('تم تحميل إعدادات الإيميلات:', data);
      setEmailSettings(data);
    } catch (err: any) {
      console.error('خطأ في تحميل إعدادات الإيميلات:', err);
      setEmailSettings([]);
    }
  };

  const loadEmailLogs = async () => {
    try {
      const data = await EmailNotificationsAdminService.getEmailLogs();
      setEmailLogs(data);
    } catch (err: any) {
      console.error('خطأ في تحميل سجل الإيميلات:', err);
      setEmailLogs([]);
    }
  };

  const loadEmailStats = async () => {
    try {
      const data = await EmailNotificationsAdminService.getEmailStats();
      setEmailStats(data);
    } catch (err: any) {
      console.error('خطأ في تحميل إحصائيات الإيميلات:', err);
      setEmailStats({ totalSent: 0, totalFailed: 0, successRate: 0, dailySends: 0 });
    }
  };

  // تحديث البيانات
  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // اختبار النظام المدمج
  const handleTestIntegratedSystem = async () => {
    try {
      setLoading(true);
      console.log('🧪 بدء اختبار النظام المدمج...');
      
      const result = await TestIntegratedEmailSystem.quickTest();
      
      if (result) {
        alert('✅ تم اختبار النظام المدمج بنجاح!');
        await refreshData();
      } else {
        alert('❌ فشل في اختبار النظام المدمج');
      }
    } catch (error) {
      console.error('❌ خطأ في اختبار النظام المدمج:', error);
      alert('❌ خطأ في اختبار النظام المدمج');
    } finally {
      setLoading(false);
    }
  };

  // اختبار قالب محدد
  const handleTestTemplate = async (template: EmailTemplate) => {
    try {
      setLoading(true);
      console.log(`🧪 اختبار القالب: ${template.name}`);
      
      const result = await DatabaseEmailService.testEmailTemplate(template.name, 'kemooamegoo@gmail.com', 'ar');
      
      if (result.success) {
        showSuccess(
          'تم اختبار القالب بنجاح',
          `تم إرسال إيميل اختبار للقالب "${template.name_ar}" بنجاح إلى kemooamegoo@gmail.com. تحقق من صندوق الوارد.`
        );
        await refreshData();
      } else {
        showError(
          'فشل في اختبار القالب',
          `حدث خطأ في اختبار القالب: ${result.error}`
        );
      }
    } catch (error) {
      console.error('❌ خطأ في اختبار القالب:', error);
      showError(
        'خطأ في اختبار القالب',
        'حدث خطأ غير متوقع في اختبار القالب. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setLoading(false);
    }
  };

  // اختبار إعدادات SMTP
  const handleTestSettings = async (settings: EmailSettings) => {
    try {
      setLoading(true);
      console.log(`🧪 اختبار إعدادات SMTP: ${settings.smtp_host}`);
      
      const result = await EmailNotificationsAdminService.testEmailSend(settings.id);
      
      if (result.success) {
        alert(`✅ تم اختبار إعدادات SMTP "${settings.smtp_host}" بنجاح!`);
        await refreshData();
      } else {
        alert(`❌ فشل في اختبار إعدادات SMTP: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ خطأ في اختبار إعدادات SMTP:', error);
      alert('❌ خطأ في اختبار إعدادات SMTP');
    } finally {
      setLoading(false);
    }
  };

  // إنشاء قالب جديد
  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowTemplateModal(true);
  };

  // إنشاء نوع إشعار جديد
  const handleCreateType = () => {
    setEditingType(null);
    setShowTypeModal(true);
  };

  // إنشاء إعدادات SMTP جديدة
  const handleCreateSettings = () => {
    setEditingSettings(null);
    setShowSettingsModal(true);
  };

  // دوال التحكم في القوالب
  const handleViewTemplate = (template: EmailTemplate) => {
    setPreviewData({
      type: 'template',
      data: template,
      title: `معاينة القالب: ${template.name_ar}`
    });
    setShowPreviewModal(true);
  };

  const handleCopyTemplate = async (template: EmailTemplate) => {
    try {
      const newTemplate = {
        ...template,
        id: undefined,
        name: `${template.name}_copy`,
        name_ar: `${template.name_ar} (نسخة)`,
        name_en: `${template.name_en} (Copy)`,
        created_at: undefined,
        updated_at: undefined
      };
      
      // محاولة إنشاء القالب الجديد
      const result = await EmailNotificationsAdminService.createEmailTemplate(newTemplate);
      if (result && result.success) {
        showSuccess(
          'تم نسخ القالب بنجاح',
          `تم إنشاء نسخة جديدة من القالب "${template.name_ar}" بنجاح. يمكنك الآن تعديل النسخة الجديدة حسب الحاجة.`
        );
        await refreshData();
      } else {
        showError(
          'فشل في نسخ القالب',
          `حدث خطأ في نسخ القالب: ${result?.error || 'خطأ غير معروف'}`
        );
      }
    } catch (error) {
      console.error('خطأ في نسخ القالب:', error);
      showError(
        'خطأ في نسخ القالب',
        'حدث خطأ غير متوقع في نسخ القالب. يرجى المحاولة مرة أخرى.'
      );
    }
  };

  const handleToggleTemplateStatus = async (template: EmailTemplate) => {
    try {
      const updatedTemplate = {
        ...template,
        is_active: !template.is_active
      };
      
      const result = await EmailNotificationsAdminService.updateEmailTemplate(template.id, updatedTemplate);
      if (result && result.success) {
        const action = template.is_active ? 'تعطيل' : 'تفعيل';
        const status = template.is_active ? 'معطل' : 'نشط';
        showSuccess(
          `تم ${action} القالب بنجاح`,
          `تم ${action} القالب "${template.name_ar}" بنجاح. الحالة الحالية: ${status}`
        );
        await refreshData();
      } else {
        showError(
          'فشل في تحديث حالة القالب',
          `حدث خطأ في تحديث حالة القالب: ${result?.error || 'خطأ غير معروف'}`
        );
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة القالب:', error);
      showError(
        'خطأ في تحديث حالة القالب',
        'حدث خطأ غير متوقع في تحديث حالة القالب. يرجى المحاولة مرة أخرى.'
      );
    }
  };

  const handleExportTemplate = (template: EmailTemplate) => {
    try {
      const templateData = {
        name: template.name,
        name_ar: template.name_ar,
        name_en: template.name_en,
        subject_ar: template.subject_ar,
        subject_en: template.subject_en,
        content_ar: template.content_ar,
        content_en: template.content_en,
        html_template_ar: template.html_template_ar,
        html_template_en: template.html_template_en,
        is_active: template.is_active,
        exported_at: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `template_${template.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showSuccess(
        'تم تصدير القالب بنجاح',
        `تم تصدير القالب "${template.name_ar}" بنجاح إلى ملف JSON. يمكنك الآن استخدام هذا الملف للنسخ الاحتياطي أو النقل.`
      );
    } catch (error) {
      console.error('خطأ في تصدير القالب:', error);
      showError(
        'خطأ في تصدير القالب',
        'حدث خطأ في تصدير القالب. يرجى المحاولة مرة أخرى.'
      );
    }
  };

  const handleDeleteTemplate = (template: EmailTemplate) => {
    setTemplateToDelete(template);
    setShowDeleteModal(true);
  };

  const confirmDeleteTemplate = async () => {
    if (!templateToDelete) return;
    
    try {
      const result = await EmailNotificationsAdminService.deleteEmailTemplate(templateToDelete.id);
      if (result && result.success) {
        showSuccess(
          'تم حذف القالب بنجاح',
          `تم حذف القالب "${templateToDelete.name_ar}" بنجاح من النظام. لا يمكن استرداد هذا القالب.`
        );
        await refreshData();
      } else {
        showError(
          'فشل في حذف القالب',
          `حدث خطأ في حذف القالب: ${result?.error || 'خطأ غير معروف'}`
        );
      }
    } catch (error) {
      console.error('خطأ في حذف القالب:', error);
      showError(
        'خطأ في حذف القالب',
        'حدث خطأ غير متوقع في حذف القالب. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setShowDeleteModal(false);
      setTemplateToDelete(null);
    }
  };

  const handleUpdateTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };

  // فلترة وترتيب القوالب
  const filteredTemplates = emailTemplates.filter(template => {
    const matchesSearch = template.name_ar.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
                         template.name_en.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
                         template.subject_ar.toLowerCase().includes(templateSearchTerm.toLowerCase());
    
    const matchesStatus = templateStatusFilter === 'all' || 
                         (templateStatusFilter === 'active' && template.is_active) ||
                         (templateStatusFilter === 'inactive' && !template.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    let aValue, bValue;
    
    switch (templateSortBy) {
      case 'name':
        aValue = a.name_ar;
        bValue = b.name_ar;
        break;
      case 'subject':
        aValue = a.subject_ar;
        bValue = b.subject_ar;
        break;
      case 'status':
        aValue = a.is_active ? 1 : 0;
        bValue = b.is_active ? 1 : 0;
        break;
      default:
        aValue = a.name_ar;
        bValue = b.name_ar;
    }
    
    if (templateSortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <ModernAdminContainer>
      <div className="space-y-6">
        {/* العنوان الرئيسي */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الإشعارات البريدية</h1>
            <p className="text-gray-600 mt-2">إدارة قوالب الإيميلات والإعدادات والسجلات</p>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={handleTestIntegratedSystem}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <TestTube className="w-4 h-4 ml-2" />
              اختبار النظام المدمج
            </button>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
              تحديث البيانات
            </button>
          </div>
        </div>

        {/* علامات التبويب */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 space-x-reverse">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { id: 'templates', label: 'قوالب الإيميلات', icon: FileText },
              { id: 'types', label: 'أنواع الإشعارات', icon: Users },
              { id: 'settings', label: 'إعدادات SMTP', icon: Settings },
              { id: 'logs', label: 'سجل الإيميلات', icon: Mail },
              { id: 'stats', label: 'الإحصائيات', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 ml-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* محتوى علامات التبويب */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="mr-3 text-gray-600">جاري التحميل...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* نظرة عامة */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="mr-3">
                      <p className="text-sm font-medium text-gray-600">قوالب الإيميلات</p>
                      <p className="text-2xl font-bold text-gray-900">{emailTemplates.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="mr-3">
                      <p className="text-sm font-medium text-gray-600">أنواع الإشعارات</p>
                      <p className="text-2xl font-bold text-gray-900">{notificationTypes.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="mr-3">
                      <p className="text-sm font-medium text-gray-600">إجمالي الإرسالات</p>
                      <p className="text-2xl font-bold text-gray-900">{emailStats.totalSent || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="mr-3">
                      <p className="text-sm font-medium text-gray-600">معدل النجاح</p>
                      <p className="text-2xl font-bold text-gray-900">{(emailStats.successRate || 0).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* قوالب الإيميلات */}
            {activeTab === 'templates' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">قوالب الإيميلات</h3>
                    <button
                      onClick={handleCreateTemplate}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة قالب جديد</span>
                    </button>
                  </div>
                  
                  {/* شريط البحث والفلترة */}
                  <div className="flex flex-wrap gap-4 items-center">
                    {/* البحث */}
                    <div className="relative flex-1 min-w-64">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="البحث في القوالب..."
                        value={templateSearchTerm}
                        onChange={(e) => setTemplateSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* فلتر الحالة */}
                    <select
                      value={templateStatusFilter}
                      onChange={(e) => setTemplateStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="active">نشط فقط</option>
                      <option value="inactive">غير نشط فقط</option>
                    </select>
                    
                    {/* ترتيب حسب */}
                    <select
                      value={templateSortBy}
                      onChange={(e) => setTemplateSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="name">الاسم</option>
                      <option value="subject">الموضوع</option>
                      <option value="status">الحالة</option>
                    </select>
                    
                    {/* اتجاه الترتيب */}
                    <button
                      onClick={() => setTemplateSortOrder(templateSortOrder === 'asc' ? 'desc' : 'asc')}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-1 space-x-reverse"
                      title={`ترتيب ${templateSortOrder === 'asc' ? 'تصاعدي' : 'تنازلي'}`}
                    >
                      {templateSortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    </button>
                    
                    {/* إحصائيات */}
                    <div className="text-sm text-gray-500">
                      عرض {sortedTemplates.length} من {emailTemplates.length} قالب
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموضوع</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedTemplates.map((template) => (
                        <tr key={template.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{template.name_ar}</div>
                              <div className="text-sm text-gray-500">{template.name_en}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 max-w-xs truncate" title={template.subject_ar}>
                              {template.subject_ar}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              template.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {template.is_active ? 'نشط' : 'غير نشط'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              {/* معاينة */}
                              <button
                                onClick={() => handleViewTemplate(template)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="معاينة القالب"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              {/* تعديل */}
                              <button
                                onClick={() => handleUpdateTemplate(template)}
                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                title="تعديل القالب"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              
                              {/* نسخ */}
                              <button
                                onClick={() => handleCopyTemplate(template)}
                                className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                                title="نسخ القالب"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              
                              {/* تفعيل/تعطيل */}
                              <button
                                onClick={() => handleToggleTemplateStatus(template)}
                                className={`p-1 rounded hover:bg-gray-50 ${
                                  template.is_active 
                                    ? 'text-orange-600 hover:text-orange-900' 
                                    : 'text-green-600 hover:text-green-900'
                                }`}
                                title={template.is_active ? 'تعطيل القالب' : 'تفعيل القالب'}
                              >
                                {template.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                              </button>
                              
                              {/* اختبار */}
                              <button
                                onClick={() => handleTestTemplate(template)}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                title="اختبار القالب"
                              >
                                <TestTube className="w-4 h-4" />
                              </button>
                              
                              {/* تصدير */}
                              <button
                                onClick={() => handleExportTemplate(template)}
                                className="text-cyan-600 hover:text-cyan-900 p-1 rounded hover:bg-cyan-50"
                                title="تصدير القالب"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              
                              {/* حذف */}
                              <button
                                onClick={() => handleDeleteTemplate(template)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                title="حذف القالب"
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
              </div>
            )}

            {/* أنواع الإشعارات */}
            {activeTab === 'types' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">أنواع الإشعارات</h3>
                  <button
                    onClick={handleCreateType}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة نوع جديد</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوصف</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {notificationTypes.map((type) => (
                        <tr key={type.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{type.name_ar}</div>
                              <div className="text-sm text-gray-500">{type.name_en}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{type.description_ar}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              type.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {type.is_active ? 'نشط' : 'غير نشط'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 space-x-reverse">
                              <button
                                onClick={() => handleUpdateType(type)}
                                className="text-blue-600 hover:text-blue-900"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteType(type.id)}
                                className="text-red-600 hover:text-red-900"
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
              </div>
            )}

            {/* إعدادات SMTP */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">إعدادات SMTP</h3>
                  <button
                    onClick={handleCreateSettings}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة إعدادات جديدة</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الخادم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المرسل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {emailSettings.map((settings) => (
                        <tr key={settings.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{settings.smtp_host}</div>
                              <div className="text-sm text-gray-500">المنفذ: {settings.smtp_port}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{settings.from_email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{settings.from_name_ar}</div>
                              <div className="text-sm text-gray-500">{settings.from_name_en}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              settings.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {settings.is_active ? 'نشط' : 'غير نشط'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 space-x-reverse">
                              <button
                                onClick={() => handleUpdateSettings(settings)}
                                className="text-blue-600 hover:text-blue-900"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSettings(settings.id)}
                                className="text-red-600 hover:text-red-900"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleTestSettings(settings)}
                                className="text-green-600 hover:text-green-900"
                                title="اختبار الاتصال"
                              >
                                <TestTube className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* سجل الإيميلات */}
            {activeTab === 'logs' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">سجل الإيميلات</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القالب</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المستقبل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموضوع</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {emailLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(log.created_at).toLocaleString('ar-SA')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.template_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.recipient_email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {log.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              log.status === 'sent' 
                                ? 'bg-green-100 text-green-800'
                                : log.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {log.status === 'sent' ? 'تم الإرسال' : 
                               log.status === 'failed' ? 'فشل' : 'في الانتظار'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* الإحصائيات */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="mr-3">
                      <p className="text-sm font-medium text-gray-600">إجمالي الإرسالات</p>
                      <p className="text-2xl font-bold text-gray-900">{emailStats.totalSent || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="mr-3">
                      <p className="text-sm font-medium text-gray-600">إجمالي الفاشلة</p>
                      <p className="text-2xl font-bold text-gray-900">{emailStats.totalFailed || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="mr-3">
                      <p className="text-sm font-medium text-gray-600">معدل النجاح</p>
                      <p className="text-2xl font-bold text-gray-900">{(emailStats.successRate || 0).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="mr-3">
                      <p className="text-sm font-medium text-gray-600">الإرسالات اليومية</p>
                      <p className="text-2xl font-bold text-gray-900">{emailStats.dailySends || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* النوافذ المنبثقة */}
      {showTypeModal && (
        <div className="fixed inset-0 modal-backdrop backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="modal-container rounded-lg max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* رأس النافذة */}
            <div className="modal-header flex items-center justify-between p-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold modal-text-primary">
                    {editingType ? 'تعديل نوع الإشعار' : 'إضافة نوع إشعار جديد'}
                  </h2>
                  <p className="text-sm modal-text-secondary">
                    {editingType ? 'تعديل بيانات نوع الإشعار' : 'إنشاء نوع إشعار جديد في النظام'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTypeModal(false)}
                className="modal-text-tertiary hover:modal-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* محتوى النافذة */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium modal-text-primary mb-2">الاسم</label>
                  <input
                    type="text"
                    defaultValue={editingType?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                    placeholder="اسم نوع الإشعار"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium modal-text-primary mb-2">الوصف</label>
                  <textarea
                    defaultValue={editingType?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                    rows={3}
                    placeholder="وصف نوع الإشعار"
                  />
                </div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="modal-footer flex justify-end space-x-2 space-x-reverse p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowTypeModal(false)}
                className="modal-button-secondary px-4 py-2 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={() => setShowTypeModal(false)}
                className="modal-button-primary px-4 py-2 rounded-lg"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="fixed inset-0 modal-backdrop backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="modal-container rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* رأس النافذة */}
            <div className="modal-header flex items-center justify-between p-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold modal-text-primary">
                    {editingTemplate ? 'تعديل القالب' : 'إضافة قالب جديد'}
                  </h2>
                  <p className="text-sm modal-text-secondary">
                    {editingTemplate ? 'تعديل بيانات قالب الإيميل' : 'إنشاء قالب إيميل جديد في النظام'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="modal-text-tertiary hover:modal-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* محتوى النافذة */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* المعلومات الأساسية */}
                <div>
                  <h3 className="text-lg font-semibold modal-text-primary mb-4">المعلومات الأساسية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">الاسم العام</label>
                      <input
                        type="text"
                        defaultValue={editingTemplate?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="اسم القالب"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">الحالة</label>
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          defaultChecked={editingTemplate?.is_active || false}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="mr-2 text-sm font-medium modal-text-primary">نشط</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* الأسماء */}
                <div>
                  <h3 className="text-lg font-semibold modal-text-primary mb-4">الأسماء</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">الاسم العربي</label>
                      <input
                        type="text"
                        defaultValue={editingTemplate?.name_ar || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="الاسم باللغة العربية"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">الاسم الإنجليزي</label>
                      <input
                        type="text"
                        defaultValue={editingTemplate?.name_en || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="English Name"
                      />
                    </div>
                  </div>
                </div>

                {/* المواضيع */}
                <div>
                  <h3 className="text-lg font-semibold modal-text-primary mb-4">مواضيع الإيميل</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">الموضوع العربي</label>
                      <input
                        type="text"
                        defaultValue={editingTemplate?.subject_ar || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="موضوع الإيميل باللغة العربية"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">الموضوع الإنجليزي</label>
                      <input
                        type="text"
                        defaultValue={editingTemplate?.subject_en || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="Email Subject in English"
                      />
                    </div>
                  </div>
                </div>

                {/* المحتوى النصي */}
                <div>
                  <h3 className="text-lg font-semibold modal-text-primary mb-4">المحتوى النصي</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">المحتوى العربي</label>
                      <textarea
                        defaultValue={editingTemplate?.content_ar || ''}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="محتوى الإيميل باللغة العربية"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">المحتوى الإنجليزي</label>
                      <textarea
                        defaultValue={editingTemplate?.content_en || ''}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="Email Content in English"
                      />
                    </div>
                  </div>
                </div>

                {/* قوالب HTML */}
                <div>
                  <h3 className="text-lg font-semibold modal-text-primary mb-4">قوالب HTML</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">HTML العربي</label>
                      <textarea
                        defaultValue={editingTemplate?.html_template_ar || ''}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm modal-input"
                        placeholder="HTML Template in Arabic"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">HTML الإنجليزي</label>
                      <textarea
                        defaultValue={editingTemplate?.html_template_en || ''}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm modal-input"
                        placeholder="HTML Template in English"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="modal-footer flex justify-end space-x-2 space-x-reverse p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="modal-button-secondary px-4 py-2 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="modal-button-primary px-4 py-2 rounded-lg"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 modal-backdrop backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="modal-container rounded-lg max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* رأس النافذة */}
            <div className="modal-header flex items-center justify-between p-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold modal-text-primary">
                    {editingSettings ? 'تعديل إعدادات SMTP' : 'إضافة إعدادات SMTP جديدة'}
                  </h2>
                  <p className="text-sm modal-text-secondary">
                    {editingSettings ? 'تعديل إعدادات خادم البريد الإلكتروني' : 'إعداد خادم البريد الإلكتروني الجديد'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="modal-text-tertiary hover:modal-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* محتوى النافذة */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* إعدادات الخادم */}
                <div>
                  <h3 className="text-lg font-semibold modal-text-primary mb-4">إعدادات الخادم</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">عنوان الخادم</label>
                      <input
                        type="text"
                        defaultValue={editingSettings?.host || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">المنفذ</label>
                      <input
                        type="number"
                        defaultValue={editingSettings?.port || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="587"
                      />
                    </div>
                  </div>
                </div>

                {/* بيانات المصادقة */}
                <div>
                  <h3 className="text-lg font-semibold modal-text-primary mb-4">بيانات المصادقة</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">اسم المستخدم</label>
                      <input
                        type="text"
                        defaultValue={editingSettings?.username || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="your-email@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">كلمة المرور</label>
                      <input
                        type="password"
                        defaultValue={editingSettings?.password || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="كلمة مرور التطبيق"
                      />
                    </div>
                  </div>
                </div>

                {/* إعدادات الأمان */}
                <div>
                  <h3 className="text-lg font-semibold modal-text-primary mb-4">إعدادات الأمان</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={editingSettings?.secure || false}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="mr-2 text-sm font-medium modal-text-primary">استخدام SSL/TLS</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={editingSettings?.require_tls || false}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="mr-2 text-sm font-medium modal-text-primary">طلب TLS</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="modal-footer flex justify-end space-x-2 space-x-reverse p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="modal-button-secondary px-4 py-2 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="modal-button-primary px-4 py-2 rounded-lg"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && previewData && (
        <div className="fixed inset-0 modal-backdrop backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="modal-container rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* رأس النافذة */}
            <div className="modal-header flex items-center justify-between p-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold modal-text-primary">{previewData.title}</h2>
                  <p className="text-sm modal-text-secondary">معاينة البيانات والتفاصيل</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="modal-text-tertiary hover:modal-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* محتوى النافذة */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(previewData.data, null, 2)}
                </pre>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="modal-footer flex justify-end space-x-2 space-x-reverse p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="modal-button-secondary px-4 py-2 rounded-lg"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تأكيد الحذف */}
      {showDeleteModal && templateToDelete && (
        <div className="fixed inset-0 modal-backdrop backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="modal-container rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* رأس النافذة */}
            <div className="modal-header flex items-center justify-between p-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold modal-text-primary">تأكيد الحذف</h2>
                  <p className="text-sm modal-text-secondary">عملية حذف القالب نهائية ولا يمكن التراجع عنها</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTemplateToDelete(null);
                }}
                className="modal-text-tertiary hover:modal-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* محتوى النافذة */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800 mb-2">تحذير مهم</h3>
                      <p className="text-sm text-red-700">
                        أنت على وشك حذف القالب <strong>"{templateToDelete.name_ar}"</strong> نهائياً من النظام.
                        هذه العملية لا يمكن التراجع عنها وقد تؤثر على الإشعارات البريدية المرتبطة بهذا القالب.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">تفاصيل القالب المراد حذفه:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>الاسم:</strong> {templateToDelete.name_ar}</p>
                    <p><strong>الاسم الإنجليزي:</strong> {templateToDelete.name_en}</p>
                    <p><strong>الحالة:</strong> {templateToDelete.is_active ? 'نشط' : 'معطل'}</p>
                    <p><strong>تاريخ الإنشاء:</strong> {new Date(templateToDelete.created_at).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 mb-1">تأثيرات الحذف:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• سيتم حذف القالب نهائياً من قاعدة البيانات</li>
                        <li>• قد تتأثر الإشعارات البريدية المرتبطة بهذا القالب</li>
                        <li>• لا يمكن استرداد القالب بعد الحذف</li>
                        <li>• قد تحتاج إلى إنشاء قالب جديد لاستبداله</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="modal-footer flex justify-end space-x-2 space-x-reverse p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTemplateToDelete(null);
                }}
                className="modal-button-secondary px-4 py-2 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDeleteTemplate}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                حذف نهائياً
              </button>
            </div>
          </div>
        </div>
      )}
    </ModernAdminContainer>
  );
};

export default EmailNotificationsManagement;
