import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  AlertTriangle,
  Save
} from 'lucide-react';
import ModernAdminContainer from './ModernAdminContainer';
import { EmailNotificationsAdminService } from '../../lib/emailNotificationsAdminService';
import { DatabaseEmailService } from '../../lib/databaseEmailService';
import TestIntegratedEmailSystem from '../../lib/testIntegratedEmailSystem';
import { useToast } from '../ToastContainer';

// دالة استخراج المحتوى من HTML
const extractContentFromHtml = (html: string, language: 'ar' | 'en'): string => {
  if (!html) return '';
  
  try {
    // البحث عن المحتوى في div success-box أولاً (هذا هو المحتوى الرئيسي)
    const successBoxMatch = html.match(/<div[^>]*class="success-box"[^>]*>[\s\S]*?<h3[^>]*>[^<]*<\/h3>\s*<p[^>]*>([^<]+)<\/p>/);
    if (successBoxMatch && successBoxMatch[1]) {
      return successBoxMatch[1].trim();
    }
    
    // البحث عن المحتوى في أي p tag داخل success-box بشكل أوسع
    const successBoxMatch2 = html.match(/<div[^>]*class="success-box"[^>]*>[\s\S]*?<p[^>]*>([^<]+)<\/p>/);
    if (successBoxMatch2 && successBoxMatch2[1]) {
      return successBoxMatch2[1].trim();
    }
    
    // البحث عن المحتوى في أول p tag داخل content
    const contentMatch = html.match(/<div[^>]*class="content"[^>]*>[\s\S]*?<p[^>]*>([^<]*{{[^}]*}}[^<]*)<\/p>/);
    if (contentMatch && contentMatch[1]) {
      // استخراج النص وإزالة المتغيرات
      return contentMatch[1].replace(/{{[^}]*}}/g, '').trim();
    }
    
    // البحث عن أي نص عادي في HTML
    const textOnlyMatch = html.replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
      
    // إذا وُجد نص، أخذ أول جملة مفيدة
    if (textOnlyMatch.length > 10) {
      const sentences = textOnlyMatch.split(/[.!?]/);
      for (const sentence of sentences) {
        const cleaned = sentence.trim();
        if (cleaned.length > 10 && !cleaned.includes('{{')) {
          return cleaned;
        }
      }
    }
    
    return '';
  } catch (error) {
    console.error('خطأ في استخراج المحتوى من HTML:', error);
    return '';
  }
};

// دوال مساعدة لتنسيق التواريخ بالميلادي
const formatGregorianDate = (dateString: string) => {
  if (!dateString) return 'غير محدد';
  
  try {
    const date = new Date(dateString);
    // التحقق من صحة التاريخ
    if (isNaN(date.getTime())) {
      return 'تاريخ غير صحيح';
    }
    
    // استخدام التقويم الميلادي دائماً
    return date.toLocaleDateString('en-GB', {
      calendar: 'gregory', // التقويم الميلادي صراحة
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('خطأ في تنسيق التاريخ:', error, dateString);
    return 'خطأ في التاريخ';
  }
};

const formatGregorianDateTime = (dateString: string) => {
  if (!dateString) return 'غير محدد';
  
  try {
    const date = new Date(dateString);
    // التحقق من صحة التاريخ
    if (isNaN(date.getTime())) {
      return 'تاريخ غير صحيح';
    }
    
    // استخدام التقويم الميلادي دائماً
    return date.toLocaleString('en-GB', {
      calendar: 'gregory', // التقويم الميلادي صراحة
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // تنسيق 24 ساعة
    });
  } catch (error) {
    console.error('خطأ في تنسيق التاريخ والوقت:', error, dateString);
    return 'خطأ في التاريخ';
  }
};

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
  smtp_settings_id?: string; // إعدادات SMTP للقوالب العادية
  contact_smtp_send_id?: string; // إعدادات SMTP لإرسال إيميلات التواصل
  contact_smtp_receive_id?: string; // إعدادات SMTP لاستقبال إيميلات التواصل
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
  is_default: boolean;
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

  // حالة التحديد الجماعي لأنواع الإشعارات
  const [selectedNotificationTypes, setSelectedNotificationTypes] = useState<string[]>([]);
  const [showBulkDeleteTypesModal, setShowBulkDeleteTypesModal] = useState(false);

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

  // حالة النافذة المنبثقة لحذف أنواع الإشعارات
  const [showDeleteTypeModal, setShowDeleteTypeModal] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<EmailNotificationType | null>(null);

  // حالة النافذة المنبثقة لحذف إعدادات SMTP
  const [showDeleteSettingsModal, setShowDeleteSettingsModal] = useState(false);
  const [settingsToDelete, setSettingsToDelete] = useState<EmailSettings | null>(null);

  // حالة بيانات النموذج لأنواع الإشعارات
  const [typeFormData, setTypeFormData] = useState({
    name: '',
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    is_active: true
  });
  
  // نافذة اختبار القالب
  const [showTestModal, setShowTestModal] = useState(false);
  const [templateToTest, setTemplateToTest] = useState<EmailTemplate | null>(null);
  const [testEmail, setTestEmail] = useState('kemooamegoo@gmail.com');
  const [testLanguage, setTestLanguage] = useState('ar');
  
  // العمليات الجماعية
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [showBulkTestModal, setShowBulkTestModal] = useState(false);

  // حالة بيانات القالب الجديد
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    name_ar: '',
    name_en: '',
    subject_ar: '',
    subject_en: '',
    content_ar: '',
    content_en: '',
    html_template_ar: '',
    html_template_en: '',
    is_active: true,
    isAdvancedMode: false,
    smtp_settings_id: '', // إعدادات SMTP للقوالب العادية
    contact_smtp_send_id: '', // إعدادات SMTP لإرسال إيميلات التواصل
    contact_smtp_receive_id: '' // إعدادات SMTP لاستقبال إيميلات التواصل
  });

  // حالة بيانات إعدادات SMTP
  const [settingsFormData, setSettingsFormData] = useState({
    host: '',
    port: 587,
    secure: false,
    require_tls: false,
    username: '',
    password: '',
    from_email: '',
    from_name: '',
    is_active: false,
    is_default: false
  });

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

  // فتح نافذة اختبار القالب
  const handleTestTemplate = (template: EmailTemplate) => {
    setTemplateToTest(template);
    setShowTestModal(true);
  };

  // تنفيذ اختبار القالب
  const executeTestTemplate = async () => {
    if (!templateToTest || !testEmail.trim()) {
      showError('خطأ في البيانات', 'يرجى إدخال عنوان الإيميل للاختبار');
      return;
    }

    try {
      setLoading(true);
      console.log(`🧪 اختبار القالب: ${templateToTest.name} إلى ${testEmail}`);
      
      const result = await DatabaseEmailService.testEmailTemplate(templateToTest.name, testEmail.trim(), testLanguage);
      
      if (result.success) {
        showSuccess(
          'تم اختبار القالب بنجاح',
          `تم إرسال إيميل اختبار للقالب "${templateToTest.name_ar}" بنجاح إلى ${testEmail}. تحقق من صندوق الوارد.`
        );
        await refreshData();
        setShowTestModal(false);
        setTemplateToTest(null);
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

  // العمليات الجماعية
  const handleSelectTemplate = useCallback((templateId: string) => {
    setSelectedTemplates(prev => {
      const isSelected = prev.includes(templateId);
      if (isSelected) {
        return prev.filter(id => id !== templateId);
      } else {
        return [...prev, templateId];
      }
    });
  }, []);

  const handleSelectAllTemplates = useCallback(() => {
    setSelectedTemplates(prev => {
      const allSelected = prev.length === emailTemplates.length && emailTemplates.length > 0;
      if (allSelected) {
        return [];
      } else {
        return emailTemplates.map(t => t.id);
      }
    });
  }, [emailTemplates]);

  const getSelectedTemplates = useCallback(() => {
    return emailTemplates.filter(t => selectedTemplates.includes(t.id));
  }, [emailTemplates, selectedTemplates]);

  // نسخ القوالب المحددة
  const handleBulkCopyTemplates = async () => {
    const templates = getSelectedTemplates();
    if (templates.length === 0) {
      showError('لا توجد قوالب محددة', 'يرجى تحديد قوالب للنسخ');
      return;
    }

    try {
      setLoading(true);
      let successCount = 0;
      let errorCount = 0;

      for (const template of templates) {
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
          
          const result = await EmailNotificationsAdminService.createEmailTemplate(newTemplate);
          if (result && result.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        showSuccess(
          'تم نسخ القوالب بنجاح',
          `تم نسخ ${successCount} قالب بنجاح${errorCount > 0 ? `، فشل في نسخ ${errorCount} قالب` : ''}`
        );
        await refreshData();
        setSelectedTemplates([]);
      } else {
        showError('فشل في نسخ القوالب', 'لم يتم نسخ أي قالب بنجاح');
      }
    } catch (error) {
      console.error('خطأ في النسخ الجماعي:', error);
      showError('خطأ في النسخ الجماعي', 'حدث خطأ غير متوقع في نسخ القوالب');
    } finally {
      setLoading(false);
    }
  };

  // اختبار القوالب المحددة
  const handleBulkTestTemplates = () => {
    const templates = getSelectedTemplates();
    if (templates.length === 0) {
      showError('لا توجد قوالب محددة', 'يرجى تحديد قوالب للاختبار');
      return;
    }
    setShowBulkTestModal(true);
  };

  // تنفيذ الاختبار الجماعي
  const executeBulkTestTemplates = async () => {
    const templates = getSelectedTemplates();
    if (templates.length === 0 || !testEmail.trim()) {
      showError('خطأ في البيانات', 'يرجى تحديد قوالب وإدخال عنوان الإيميل');
      return;
    }

    try {
      setLoading(true);
      let successCount = 0;
      let errorCount = 0;

      for (const template of templates) {
        try {
          const result = await DatabaseEmailService.testEmailTemplate(template.name, testEmail.trim(), testLanguage);
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        showSuccess(
          'تم اختبار القوالب بنجاح',
          `تم إرسال ${successCount} قالب للاختبار بنجاح${errorCount > 0 ? `، فشل في إرسال ${errorCount} قالب` : ''}`
        );
        setShowBulkTestModal(false);
        setSelectedTemplates([]);
      } else {
        showError('فشل في اختبار القوالب', 'لم يتم إرسال أي قالب للاختبار بنجاح');
      }
    } catch (error) {
      console.error('خطأ في الاختبار الجماعي:', error);
      showError('خطأ في الاختبار الجماعي', 'حدث خطأ غير متوقع في اختبار القوالب');
    } finally {
      setLoading(false);
    }
  };

  // تصدير القوالب المحددة
  const handleBulkExportTemplates = () => {
    const templates = getSelectedTemplates();
    if (templates.length === 0) {
      showError('لا توجد قوالب محددة', 'يرجى تحديد قوالب للتصدير');
      return;
    }

    try {
      const templatesData = templates.map(template => ({
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
      }));

      const blob = new Blob([JSON.stringify(templatesData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `templates_bulk_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showSuccess(
        'تم تصدير القوالب بنجاح',
        `تم تصدير ${templates.length} قالب بنجاح إلى ملف JSON`
      );
    } catch (error) {
      console.error('خطأ في التصدير الجماعي:', error);
      showError('خطأ في التصدير الجماعي', 'حدث خطأ في تصدير القوالب');
    }
  };

  // حذف القوالب المحددة
  const handleBulkDeleteTemplates = async () => {
    const templates = getSelectedTemplates();
    if (templates.length === 0) {
      showError('لا توجد قوالب محددة', 'يرجى تحديد قوالب للحذف');
      return;
    }

    try {
      setLoading(true);
      let successCount = 0;
      let errorCount = 0;

      for (const template of templates) {
        try {
          const result = await EmailNotificationsAdminService.deleteEmailTemplate(template.id);
          if (result && result.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        showSuccess(
          'تم حذف القوالب بنجاح',
          `تم حذف ${successCount} قالب بنجاح${errorCount > 0 ? `، فشل في حذف ${errorCount} قالب` : ''}`
        );
        await refreshData();
        setSelectedTemplates([]);
      } else {
        showError('فشل في حذف القوالب', 'لم يتم حذف أي قالب بنجاح');
      }
    } catch (error) {
      console.error('خطأ في الحذف الجماعي:', error);
      showError('خطأ في الحذف الجماعي', 'حدث خطأ غير متوقع في حذف القوالب');
    } finally {
      setLoading(false);
    }
  };

  // تفعيل/تعطيل القوالب المحددة
  const handleBulkToggleTemplates = async (activate: boolean) => {
    const templates = getSelectedTemplates();
    if (templates.length === 0) {
      showError('لا توجد قوالب محددة', 'يرجى تحديد قوالب للتفعيل/التعطيل');
      return;
    }

    try {
      setLoading(true);
      let successCount = 0;
      let errorCount = 0;

      for (const template of templates) {
        try {
          const updatedTemplate = {
            ...template,
            is_active: activate
          };
          
          const result = await EmailNotificationsAdminService.updateEmailTemplate(template.id, updatedTemplate);
          if (result && result.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      const action = activate ? 'تفعيل' : 'تعطيل';
      if (successCount > 0) {
        showSuccess(
          `تم ${action} القوالب بنجاح`,
          `تم ${action} ${successCount} قالب بنجاح${errorCount > 0 ? `، فشل في ${action} ${errorCount} قالب` : ''}`
        );
        await refreshData();
        setSelectedTemplates([]);
      } else {
        showError(`فشل في ${action} القوالب`, `لم يتم ${action} أي قالب بنجاح`);
      }
    } catch (error) {
      console.error(`خطأ في ${activate ? 'التفعيل' : 'التعطيل'} الجماعي:`, error);
      showError(`خطأ في ${activate ? 'التفعيل' : 'التعطيل'} الجماعي`, 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  // اختبار إعدادات SMTP
  const handleTestSettings = async (settings: EmailSettings) => {
    try {
      setLoading(true);
      console.log(`🧪 اختبار إعدادات SMTP: ${settings.smtp_host}`);
      
      // الحصول على أول قالب متاح للاختبار
      const testTemplate = emailTemplates.find(t => t.is_active);
      if (!testTemplate) {
        showError('لا يمكن الاختبار', 'لا يوجد قوالب نشطة للاختبار');
        return;
      }
      
      const result = await EmailNotificationsAdminService.testEmailSend(
        settings.from_email, // إرسال للبريد الخاص بالإعدادات
        testTemplate.id,     // استخدام أول قالب متاح
        'ar'                 // اللغة العربية
      );
      
      if (result.success) {
        showSuccess('تم الاختبار بنجاح', `تم اختبار إعدادات SMTP "${settings.smtp_host}" بنجاح!`);
        await refreshData();
      } else {
        showError('فشل في الاختبار', result.message || 'خطأ غير معروف');
      }
    } catch (error) {
      console.error('❌ خطأ في اختبار إعدادات SMTP:', error);
      showError('خطأ في الاختبار', 'حدث خطأ غير متوقع في اختبار إعدادات SMTP');
    } finally {
      setLoading(false);
    }
  };

  // إنشاء إعدادات SMTP جديدة
  const handleCreateSettings = () => {
    setEditingSettings(null);
    setSettingsFormData({
      host: '',
      port: 587,
      secure: false,
      require_tls: false,
      username: '',
      password: '',
      from_email: '',
      from_name: '',
      is_active: false,
      is_default: false
    });
    setShowSettingsModal(true);
  };

  // حفظ إعدادات SMTP
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      const settingsData = {
        smtp_host: settingsFormData.host,
        smtp_port: settingsFormData.port,
        smtp_username: settingsFormData.username,
        smtp_password: settingsFormData.password,
        from_name_ar: settingsFormData.from_name || 'منصة رزقي',
        from_name_en: settingsFormData.from_name || 'Rezge Platform',
        from_email: settingsFormData.from_email,
        reply_to: settingsFormData.from_email,
        is_active: settingsFormData.is_active,
        is_default: settingsFormData.is_default,
        updated_at: new Date().toISOString()
      };

      console.log('📝 بيانات الإعدادات المرسلة:', settingsData);

      let result;
      if (editingSettings) {
        // تحديث إعدادات موجودة
        console.log('🔄 تحديث إعدادات موجودة:', editingSettings.id);
        result = await EmailNotificationsAdminService.updateEmailSettings(editingSettings.id, settingsData);
      } else {
        // إنشاء إعدادات جديدة
        settingsData.created_at = new Date().toISOString();
        console.log('➕ إنشاء إعدادات جديدة');
        result = await EmailNotificationsAdminService.createEmailSettings(settingsData);
      }
      
      console.log('📊 نتيجة العملية:', result);
      
      // التحقق من النتيجة - قد تكون البيانات مباشرة أو في خاصية success
      if (result && (result.success === true || (result.id && !result.error))) {
        const action = editingSettings ? 'تحديث' : 'إنشاء';
        showSuccess(
          `تم ${action} الإعدادات بنجاح`,
          `تم ${action} إعدادات SMTP بنجاح في النظام`
        );
        setShowSettingsModal(false);
        setEditingSettings(null);
        await refreshData();
      } else {
        console.error('❌ فشل في العملية:', result);
        showError(
          'فشل في حفظ الإعدادات',
          result?.error || result?.message || 'خطأ غير معروف'
        );
      }
    } catch (error) {
      console.error('❌ خطأ في حفظ الإعدادات:', error);
      showError(
        'خطأ في حفظ الإعدادات',
        error instanceof Error ? error.message : 'حدث خطأ غير متوقع في حفظ الإعدادات. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setLoading(false);
    }
  };

  // إنشاء قالب جديد
  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateFormData({
      name: '',
      name_ar: '',
      name_en: '',
      subject_ar: '',
      subject_en: '',
      content_ar: '',
      content_en: '',
      html_template_ar: '',
      html_template_en: '',
      is_active: true,
      isAdvancedMode: false,
      smtp_settings_id: '',
      contact_smtp_send_id: '',
      contact_smtp_receive_id: ''
    });
    setShowTemplateModal(true);
  };

  // التحقق من صحة البيانات
  const isTemplateFormValid = useMemo(() => {
    return templateFormData.name.trim() !== '' &&
           templateFormData.name_ar.trim() !== '' &&
           templateFormData.name_en.trim() !== '' &&
           templateFormData.subject_ar.trim() !== '' &&
           templateFormData.subject_en.trim() !== '' &&
           templateFormData.content_ar.trim() !== '' &&
           templateFormData.content_en.trim() !== '';
  }, [templateFormData]);

  // حفظ القالب
  const handleSaveTemplate = async () => {
    if (!isTemplateFormValid) {
      showError('بيانات غير مكتملة', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      
      const templateData = {
        ...templateFormData,
        updated_at: new Date().toISOString()
      };
      
      // إزالة isAdvancedMode من البيانات المحفوظة (خاص بالواجهة فقط)
      delete templateData.isAdvancedMode;

      // تنظيف الحقول الفارغة - تحويل القيم الفارغة إلى null بدلاً من حذفها
      if (!templateData.smtp_settings_id) templateData.smtp_settings_id = null;
      if (!templateData.contact_smtp_send_id) templateData.contact_smtp_send_id = null;
      if (!templateData.contact_smtp_receive_id) templateData.contact_smtp_receive_id = null;

      console.log('📝 بيانات القالب المرسلة:', templateData);
      console.log('🔧 إعدادات SMTP:', {
        smtp_settings_id: templateData.smtp_settings_id,
        contact_smtp_send_id: templateData.contact_smtp_send_id,
        contact_smtp_receive_id: templateData.contact_smtp_receive_id
      });

      let result;
      if (editingTemplate) {
        // تحديث قالب موجود
        result = await EmailNotificationsAdminService.updateEmailTemplate(editingTemplate.id, templateData);
      } else {
        // إنشاء قالب جديد
        templateData.created_at = new Date().toISOString();
        result = await EmailNotificationsAdminService.createEmailTemplate(templateData);
      }
      
      if (result && result.success) {
        const action = editingTemplate ? 'تحديث' : 'إنشاء';
        showSuccess(
          `تم ${action} القالب بنجاح`,
          `تم ${action} القالب "${templateFormData.name_ar}" بنجاح في النظام`
        );
        setShowTemplateModal(false);
        setEditingTemplate(null);
        await refreshData();
      } else {
        showError(
          'فشل في حفظ القالب',
          `حدث خطأ في حفظ القالب: ${result?.error || 'خطأ غير معروف'}`
        );
      }
    } catch (error) {
      console.error('خطأ في حفظ القالب:', error);
      showError(
        'خطأ في حفظ القالب',
        'حدث خطأ غير متوقع في حفظ القالب. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setLoading(false);
    }
  };

  // تحديث إعدادات SMTP
  const handleUpdateSettings = (settings: any) => {
    setEditingSettings(settings);
    setSettingsFormData({
      host: settings.smtp_host || '',
      port: settings.smtp_port || 587,
      secure: settings.secure || false,
      require_tls: settings.require_tls || false,
      username: settings.smtp_username || '',
      password: settings.smtp_password || '',
      from_email: settings.from_email || '',
      from_name: settings.from_name_ar || '',
      is_active: settings.is_active || false,
      is_default: settings.is_default || false
    });
    setShowSettingsModal(true);
  };

  // تعيين إعدادات SMTP كافتراضي
  const handleSetAsDefault = async (settings: EmailSettings) => {
    try {
      setLoading(true);
      
      // إلغاء تعيين جميع الإعدادات الأخرى كافتراضي
      await EmailNotificationsAdminService.unsetAllDefaults();
      
      // تعيين الإعداد المحدد كافتراضي
      const result = await EmailNotificationsAdminService.setAsDefault(settings.id);
      
      if (result && result.success) {
        showSuccess('تم تعيين الإعداد كافتراضي', `تم تعيين إعدادات SMTP "${settings.smtp_host}" كافتراضي بنجاح`);
        await refreshData();
      } else {
        showError('فشل في التعيين', result?.error || 'خطأ غير معروف');
      }
    } catch (error) {
      console.error('❌ خطأ في تعيين الإعداد كافتراضي:', error);
      showError('خطأ في التعيين', 'حدث خطأ غير متوقع في تعيين الإعداد كافتراضي');
    } finally {
      setLoading(false);
    }
  };

  // حذف إعدادات SMTP - فتح نافذة التأكيد
  const handleDeleteSettings = (settings: EmailSettings) => {
    setSettingsToDelete(settings);
    setShowDeleteSettingsModal(true);
  };

  // تأكيد حذف إعدادات SMTP
  const handleConfirmDeleteSettings = async () => {
    if (!settingsToDelete) return;

    try {
      setLoading(true);
      const result = await EmailNotificationsAdminService.deleteEmailSettings(settingsToDelete.id);
      
      if (result && result.success) {
        showSuccess('تم حذف الإعدادات', 'تم حذف إعدادات SMTP بنجاح');
        await refreshData();
        setShowDeleteSettingsModal(false);
        setSettingsToDelete(null);
      } else {
        showError('فشل في الحذف', result?.error || 'خطأ غير معروف');
      }
    } catch (error) {
      console.error('خطأ في حذف الإعدادات:', error);
      showError('خطأ في الحذف', 'حدث خطأ غير متوقع في حذف الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  // التحقق من صحة بيانات النموذج لأنواع الإشعارات
  const isTypeFormValid = useMemo(() => {
    return typeFormData.name.trim() !== '' &&
           typeFormData.name_ar.trim() !== '' &&
           typeFormData.name_en.trim() !== '' &&
           typeFormData.description_ar.trim() !== '' &&
           typeFormData.description_en.trim() !== '';
  }, [typeFormData]);

  // إنشاء نوع إشعار جديد
  const handleCreateType = () => {
    setEditingType(null);
    setTypeFormData({
      name: '',
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      is_active: true
    });
    setShowTypeModal(true);
  };

  // تحديث نوع إشعار
  const handleUpdateType = (type: EmailNotificationType) => {
    setEditingType(type);
    setTypeFormData({
      name: type.name || '',
      name_ar: type.name_ar || '',
      name_en: type.name_en || '',
      description_ar: type.description_ar || '',
      description_en: type.description_en || '',
      is_active: type.is_active || false
    });
    setShowTypeModal(true);
  };

  // حفظ نوع الإشعار (إنشاء أو تحديث)
  const handleSaveType = async () => {
    if (!isTypeFormValid) {
      showError('بيانات غير مكتملة', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      
      const typeData = {
        ...typeFormData,
        updated_at: new Date().toISOString()
      };

      let result;
      if (editingType) {
        // تحديث نوع موجود
        result = await EmailNotificationsAdminService.updateNotificationType(editingType.id, typeData);
      } else {
        // إنشاء نوع جديد
        typeData.created_at = new Date().toISOString();
        result = await EmailNotificationsAdminService.createNotificationType(typeData);
      }
      
      if (result && result.success) {
        const action = editingType ? 'تحديث' : 'إنشاء';
        showSuccess(
          `تم ${action} نوع الإشعار بنجاح`,
          `تم ${action} نوع الإشعار "${typeFormData.name_ar}" بنجاح في النظام`
        );
        setShowTypeModal(false);
        setEditingType(null);
        await refreshData();
      } else {
        showError(
          'فشل في حفظ نوع الإشعار',
          `حدث خطأ في حفظ نوع الإشعار: ${result?.error || 'خطأ غير معروف'}`
        );
      }
    } catch (error) {
      console.error('خطأ في حفظ نوع الإشعار:', error);
      showError(
        'خطأ في حفظ نوع الإشعار',
        'حدث خطأ غير متوقع في حفظ نوع الإشعار. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setLoading(false);
    }
  };

  // حذف نوع إشعار
  const handleDeleteType = (type: EmailNotificationType) => {
    setTypeToDelete(type);
    setShowDeleteTypeModal(true);
  };

  // تأكيد حذف نوع الإشعار
  const confirmDeleteType = async () => {
    if (!typeToDelete) return;

    try {
      setLoading(true);
      const result = await EmailNotificationsAdminService.deleteNotificationType(typeToDelete.id);
      
      if (result && result.success) {
        showSuccess('تم الحذف بنجاح', `تم حذف نوع الإشعار "${typeToDelete.name_ar}" بنجاح`);
        setShowDeleteTypeModal(false);
        setTypeToDelete(null);
        await refreshData();
      } else {
        showError('فشل في الحذف', result?.error || 'خطأ غير معروف');
      }
    } catch (error) {
      console.error('خطأ في حذف نوع الإشعار:', error);
      showError('خطأ في الحذف', 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  // تحديد/إلغاء تحديد نوع إشعار
  const handleSelectNotificationType = useCallback((typeId: string) => {
    setSelectedNotificationTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  }, []);

  // تحديد/إلغاء تحديد جميع أنواع الإشعارات
  const handleSelectAllNotificationTypes = useCallback(() => {
    if (selectedNotificationTypes.length === notificationTypes.length) {
      setSelectedNotificationTypes([]);
    } else {
      setSelectedNotificationTypes(notificationTypes.map(type => type.id));
    }
  }, [selectedNotificationTypes.length, notificationTypes]);

  // الحصول على أنواع الإشعارات المحددة
  const getSelectedNotificationTypes = useCallback(() => {
    return notificationTypes.filter(type => selectedNotificationTypes.includes(type.id));
  }, [notificationTypes, selectedNotificationTypes]);

  // حذف أنواع الإشعارات المحددة
  const handleBulkDeleteNotificationTypes = async () => {
    const selectedTypes = getSelectedNotificationTypes();
    
    if (selectedTypes.length === 0) {
      showWarning('لا توجد عناصر محددة', 'يرجى تحديد أنواع الإشعارات المراد حذفها');
      return;
    }

    try {
      setLoading(true);
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const type of selectedTypes) {
        try {
          const result = await EmailNotificationsAdminService.deleteNotificationType(type.id);
          if (result && result.success) {
            successCount++;
          } else {
            errorCount++;
            errors.push(`${type.name_ar}: ${result?.error || 'خطأ غير معروف'}`);
          }
        } catch (error) {
          errorCount++;
          errors.push(`${type.name_ar}: خطأ غير متوقع`);
        }
      }

      if (successCount > 0) {
        showSuccess(
          `تم حذف ${successCount} نوع إشعار بنجاح`,
          `تم حذف ${successCount} من أصل ${selectedTypes.length} نوع إشعار`
        );
        setSelectedNotificationTypes([]);
        await refreshData();
      }

      if (errorCount > 0) {
        showError(
          `فشل في حذف ${errorCount} نوع إشعار`,
          errors.join('\n')
        );
      }

    } catch (error) {
      console.error('خطأ في الحذف الجماعي:', error);
      showError('خطأ في الحذف الجماعي', 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
      setShowBulkDeleteTypesModal(false);
    }
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
    console.log('📋 تحميل بيانات القالب للتعديل:', template);
    console.log('🔧 إعدادات SMTP المحملة:', {
      smtp_settings_id: template.smtp_settings_id,
      contact_smtp_send_id: template.contact_smtp_send_id,
      contact_smtp_receive_id: template.contact_smtp_receive_id
    });
    
    setEditingTemplate(template);
    setTemplateFormData({
      name: template.name || '',
      name_ar: template.name_ar || '',
      name_en: template.name_en || '',
      subject_ar: template.subject_ar || '',
      subject_en: template.subject_en || '',
      content_ar: template.content_ar || '',
      content_en: template.content_en || '',
      html_template_ar: template.html_template_ar || '',
      html_template_en: template.html_template_en || '',
      is_active: template.is_active || false,
      isAdvancedMode: false,
      smtp_settings_id: template.smtp_settings_id || '',
      contact_smtp_send_id: template.contact_smtp_send_id || '',
      contact_smtp_receive_id: template.contact_smtp_receive_id || ''
    });
    
    console.log('📝 بيانات النموذج المحملة:', {
      smtp_settings_id: template.smtp_settings_id || '',
      contact_smtp_send_id: template.contact_smtp_send_id || '',
      contact_smtp_receive_id: template.contact_smtp_receive_id || ''
    });
    
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
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {/* أزرار العمليات الجماعية */}
                      {selectedTemplates.length > 0 && (
                        <div className="flex items-center space-x-2 space-x-reverse bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                          <span className="text-sm text-blue-700 font-medium">
                            {selectedTemplates.length} قالب محدد
                          </span>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <button
                              onClick={handleBulkCopyTemplates}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                              title="نسخ القوالب المحددة"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleBulkTestTemplates}
                              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100"
                              title="اختبار القوالب المحددة"
                            >
                              <TestTube className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleBulkExportTemplates}
                              className="text-cyan-600 hover:text-cyan-800 p-1 rounded hover:bg-cyan-100"
                              title="تصدير القوالب المحددة"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleBulkToggleTemplates(true)}
                              className="text-emerald-600 hover:text-emerald-800 p-1 rounded hover:bg-emerald-100"
                              title="تفعيل القوالب المحددة"
                            >
                              <ToggleRight className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleBulkToggleTemplates(false)}
                              className="text-orange-600 hover:text-orange-800 p-1 rounded hover:bg-orange-100"
                              title="تعطيل القوالب المحددة"
                            >
                              <ToggleLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleBulkDeleteTemplates}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                              title="حذف القوالب المحددة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={handleCreateTemplate}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة قالب جديد</span>
                      </button>
                    </div>
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
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedTemplates.length === emailTemplates.length && emailTemplates.length > 0}
                            onChange={handleSelectAllTemplates}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموضوع</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إعدادات SMTP</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedTemplates.map((template) => (
                        <tr key={template.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedTemplates.includes(template.id)}
                              onChange={() => handleSelectTemplate(template.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
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
                            <div className="text-xs">
                              {/* فحص نوع القالب */}
                              {template.name?.toLowerCase().includes('contact') || template.name_ar?.includes('تواصل') ? (
                                /* قالب التواصل */
                                <div className="space-y-1">
                                  <div>
                                    <span className="text-gray-600">إرسال:</span>
                                    <span className="text-gray-900 mr-1">
                                      {template.contact_smtp_send_id 
                                        ? emailSettings.find(s => s.id === template.contact_smtp_send_id)?.smtp_host || 'غير موجود'
                                        : 'افتراضي'
                                      }
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">استقبال:</span>
                                    <span className="text-gray-900 mr-1">
                                      {template.contact_smtp_receive_id 
                                        ? emailSettings.find(s => s.id === template.contact_smtp_receive_id)?.smtp_host || 'غير موجود'
                                        : 'افتراضي'
                                      }
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                /* القوالب العادية */
                                <div>
                                  <span className="text-gray-900">
                                    {template.smtp_settings_id 
                                      ? emailSettings.find(s => s.id === template.smtp_settings_id)?.smtp_host || 'غير موجود'
                                      : 'افتراضي'
                                    }
                                  </span>
                                  {template.smtp_settings_id && (
                                    <div className="text-gray-500">
                                      {emailSettings.find(s => s.id === template.smtp_settings_id)?.from_email}
                                    </div>
                                  )}
                                </div>
                              )}
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
                  <div className="flex space-x-2 space-x-reverse">
                    {selectedNotificationTypes.length > 0 && (
                      <button
                        onClick={() => setShowBulkDeleteTypesModal(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 space-x-reverse"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>حذف المحدد ({selectedNotificationTypes.length})</span>
                      </button>
                    )}
                    <button
                      onClick={handleCreateType}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة نوع جديد</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedNotificationTypes.length === notificationTypes.length && notificationTypes.length > 0}
                            onChange={handleSelectAllNotificationTypes}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوصف</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {notificationTypes.map((type) => (
                        <tr key={type.id} className={selectedNotificationTypes.includes(type.id) ? 'bg-blue-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedNotificationTypes.includes(type.id)}
                              onChange={() => handleSelectNotificationType(type.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
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
                                onClick={() => handleDeleteType(type)}
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
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">افتراضي</th>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              settings.is_default 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {settings.is_default ? 'افتراضي' : 'عادي'}
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
                              {!settings.is_default && (
                                <button
                                  onClick={() => handleSetAsDefault(settings)}
                                  className="text-purple-600 hover:text-purple-900"
                                  title="تعيين كافتراضي"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteSettings(settings)}
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
                            {formatGregorianDateTime(log.created_at)}
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
                  <label className="block text-sm font-medium modal-text-primary mb-2">
                    اسم نوع الإشعار (عربي) *
                  </label>
                  <input
                    type="text"
                    value={typeFormData.name_ar}
                    onChange={(e) => setTypeFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                    placeholder="أدخل اسم نوع الإشعار بالعربية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium modal-text-primary mb-2">
                    اسم نوع الإشعار (إنجليزي) *
                  </label>
                  <input
                    type="text"
                    value={typeFormData.name_en}
                    onChange={(e) => setTypeFormData(prev => ({ ...prev, name_en: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                    placeholder="Enter notification type name in English"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium modal-text-primary mb-2">
                    الوصف (عربي) *
                  </label>
                  <textarea
                    value={typeFormData.description_ar}
                    onChange={(e) => setTypeFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                    placeholder="أدخل وصف نوع الإشعار بالعربية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium modal-text-primary mb-2">
                    الوصف (إنجليزي) *
                  </label>
                  <textarea
                    value={typeFormData.description_en}
                    onChange={(e) => setTypeFormData(prev => ({ ...prev, description_en: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                    placeholder="Enter notification type description in English"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium modal-text-primary mb-2">
                    الحالة
                  </label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      checked={typeFormData.is_active}
                      onChange={(e) => setTypeFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm modal-text-primary">نشط</span>
                  </div>
                </div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="modal-footer flex justify-end space-x-2 space-x-reverse p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => {
                  setShowTypeModal(false);
                  setEditingType(null);
                  setTypeFormData({
                    name: '',
                    name_ar: '',
                    name_en: '',
                    description_ar: '',
                    description_en: '',
                    is_active: true
                  });
                }}
                className="modal-button-secondary px-4 py-2 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveType}
                disabled={!isTypeFormValid || loading}
                className={`modal-button-primary px-4 py-2 rounded-lg ${
                  isTypeFormValid && !loading 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin inline-block ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 inline-block ml-2" />
                    حفظ
                  </>
                )}
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
                onClick={() => {
                  setShowTemplateModal(false);
                  setEditingTemplate(null);
                  setTemplateFormData({
                    name: '',
                    name_ar: '',
                    name_en: '',
                    subject_ar: '',
                    subject_en: '',
                    content_ar: '',
                    content_en: '',
                    html_template_ar: '',
                    html_template_en: '',
                    is_active: true,
                    isAdvancedMode: false,
                    smtp_settings_id: '',
                    contact_smtp_send_id: '',
                    contact_smtp_receive_id: ''
                  });
                }}
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
                      <label className="block text-sm font-medium modal-text-primary mb-2">الاسم العام *</label>
                      <input
                        type="text"
                        value={templateFormData.name}
                        onChange={(e) => setTemplateFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="اسم القالب"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">الحالة</label>
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={templateFormData.is_active}
                          onChange={(e) => setTemplateFormData(prev => ({ ...prev, is_active: e.target.checked }))}
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
                      <label className="block text-sm font-medium modal-text-primary mb-2">الاسم العربي *</label>
                      <input
                        type="text"
                        value={templateFormData.name_ar}
                        onChange={(e) => setTemplateFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="الاسم باللغة العربية"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">الاسم الإنجليزي *</label>
                      <input
                        type="text"
                        value={templateFormData.name_en}
                        onChange={(e) => setTemplateFormData(prev => ({ ...prev, name_en: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="English Name"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* المواضيع */}
                <div>
                  <h3 className="text-lg font-semibold modal-text-primary mb-4">مواضيع الإيميل</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">الموضوع العربي *</label>
                      <input
                        type="text"
                        value={templateFormData.subject_ar}
                        onChange={(e) => setTemplateFormData(prev => ({ ...prev, subject_ar: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="موضوع الإيميل باللغة العربية"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">الموضوع الإنجليزي *</label>
                      <input
                        type="text"
                        value={templateFormData.subject_en}
                        onChange={(e) => setTemplateFormData(prev => ({ ...prev, subject_en: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="Email Subject in English"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* المحتوى مع زر التبديل */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold modal-text-primary">المحتوى</h3>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${!templateFormData.isAdvancedMode ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                        عادي
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setTemplateFormData(prev => ({ 
                            ...prev, 
                            isAdvancedMode: !prev.isAdvancedMode 
                          }));
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          templateFormData.isAdvancedMode ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 mr-7 transform rounded-full bg-white transition-transform ${
                            templateFormData.isAdvancedMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`text-sm ${templateFormData.isAdvancedMode ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                        متقدم HTML
                      </span>
                    </div>
                  </div>

                  {!templateFormData.isAdvancedMode ? (
                    /* الوضع العادي - تعديل النص */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium modal-text-primary mb-2">
                          المحتوى العربي *
                        </label>
                      <textarea
                        value={templateFormData.content_ar}
                          onChange={(e) => {
                            const newContent = e.target.value;
                            setTemplateFormData(prev => ({ 
                              ...prev, 
                              content_ar: newContent,
                              // تطبيق المحتوى على HTML تلقائياً
                              html_template_ar: prev.html_template_ar ? 
                                prev.html_template_ar.replace(/<div class="content"[^>]*>[\s\S]*?<\/div>/g, 
                                  `<div class="content" style="padding: 40px 30px; direction: rtl; text-align: right;">
                                    <h2 style="color: #10b981; font-size: 24px; margin: 0 0 20px 0; text-align: center; font-family: 'Amiri', serif;">✅ تسجيل دخول ناجح</h2>
                                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; font-family: 'Amiri', serif;">مرحباً <strong>{{userName}}</strong>،</p>
                                    <div class="success-box" style="background: #dcfce7; border-radius: 10px; padding: 20px; margin: 20px 0; border-right: 4px solid #16a34a; direction: rtl; text-align: right;">
                                      <h3 style="color: #166534; font-size: 18px; margin: 0 0 15px 0; font-family: 'Amiri', serif;">🎉 تم تسجيل دخولك بنجاح!</h3>
                                      <p style="color: #166534; line-height: 1.8; font-size: 15px; margin: 8px 0; font-family: 'Amiri', serif;">${newContent}</p>
                                    </div>
                                    <div class="session-details" style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; direction: rtl; text-align: right;">
                                      <h3 style="color: #374151; font-size: 18px; margin: 0 0 15px 0; font-family: 'Amiri', serif;">📋 تفاصيل الجلسة:</h3>
                                      <ul style="color: #6b7280; line-height: 1.8; font-family: 'Amiri', serif;">
                                        <li style="margin-bottom: 8px;"><strong>📅 التاريخ والوقت:</strong> {{timestamp}}</li>
                                        <li style="margin-bottom: 8px;"><strong>🔐 طريقة تسجيل الدخول:</strong> {{loginMethod}}</li>
                                        <li style="margin-bottom: 8px;"><strong>🌐 عنوان IP:</strong> {{ipAddress}}</li>
                                        <li style="margin-bottom: 8px;"><strong>📍 الموقع الجغرافي:</strong> {{location}}</li>
                                        <li style="margin-bottom: 8px;"><strong>📱 نوع الجهاز:</strong> {{deviceType}}</li>
                                        <li style="margin-bottom: 8px;"><strong>🌐 المتصفح:</strong> {{browser}}</li>
                                      </ul>
                                    </div>
                                    <div class="security-note" style="background: #fef3c7; border-radius: 10px; padding: 20px; margin: 20px 0; border-right: 4px solid #f59e0b; direction: rtl; text-align: right;">
                                      <p style="color: #92400e; margin: 0; line-height: 1.6; font-size: 14px; font-family: 'Amiri', serif;">🔒 حسابك آمن ومحمي. إذا لم تكن أنت من سجل الدخول، يرجى التواصل معنا فوراً على {{contactEmail}}</p>
                                    </div>
                                  </div>`) : ''
                            }));
                          }}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="محتوى الإيميل باللغة العربية"
                        required
                      />
                    </div>

                    <div>
                        <label className="block text-sm font-medium modal-text-primary mb-2">
                          المحتوى الإنجليزي *
                        </label>
                      <textarea
                        value={templateFormData.content_en}
                          onChange={(e) => {
                            const newContent = e.target.value;
                            setTemplateFormData(prev => ({ 
                              ...prev, 
                              content_en: newContent,
                              // تطبيق المحتوى على HTML تلقائياً
                              html_template_en: prev.html_template_en ? 
                                prev.html_template_en.replace(/<div class="content"[^>]*>[\s\S]*?<\/div>/g, 
                                  `<div class="content" style="padding: 40px 30px; direction: ltr; text-align: left;">
                                    <h2 style="color: #10b981; font-size: 24px; margin: 0 0 20px 0; text-align: center; font-family: 'Inter', sans-serif;">✅ Successful Login</h2>
                                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; font-family: 'Inter', sans-serif;">Hello <strong>{{userName}}</strong>,</p>
                                    <div class="success-box" style="background: #dcfce7; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #16a34a; direction: ltr; text-align: left;">
                                      <h3 style="color: #166534; font-size: 18px; margin: 0 0 15px 0; font-family: 'Inter', sans-serif;">🎉 Login Successful!</h3>
                                      <p style="color: #166534; line-height: 1.8; font-size: 15px; margin: 8px 0; font-family: 'Inter', sans-serif;">${newContent}</p>
                                    </div>
                                    <div class="session-details" style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; direction: ltr; text-align: left;">
                                      <h3 style="color: #374151; font-size: 18px; margin: 0 0 15px 0; font-family: 'Inter', sans-serif;">📋 Session Details:</h3>
                                      <ul style="color: #6b7280; line-height: 1.8; font-family: 'Inter', sans-serif;">
                                        <li style="margin-bottom: 8px;"><strong>📅 Date & Time:</strong> {{timestamp}}</li>
                                        <li style="margin-bottom: 8px;"><strong>🔐 Login Method:</strong> {{loginMethod}}</li>
                                        <li style="margin-bottom: 8px;"><strong>🌐 IP Address:</strong> {{ipAddress}}</li>
                                        <li style="margin-bottom: 8px;"><strong>📍 Location:</strong> {{location}}</li>
                                        <li style="margin-bottom: 8px;"><strong>📱 Device Type:</strong> {{deviceType}}</li>
                                        <li style="margin-bottom: 8px;"><strong>🌐 Browser:</strong> {{browser}}</li>
                                      </ul>
                                    </div>
                                    <div class="security-note" style="background: #fef3c7; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b; direction: ltr; text-align: left;">
                                      <p style="color: #92400e; margin: 0; line-height: 1.6; font-size: 14px; font-family: 'Inter', sans-serif;">🔒 Your account is secure and protected. If you did not log in, please contact us immediately at {{contactEmail}}</p>
                                    </div>
                                  </div>`) : ''
                            }));
                          }}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="Email Content in English"
                        required
                      />
                    </div>
                  </div>
                  ) : (
                    /* الوضع المتقدم - تعديل HTML */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium modal-text-primary mb-2 flex items-center gap-2">
                          HTML العربي
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">HTML</span>
                        </label>
                      <textarea
                        value={templateFormData.html_template_ar}
                          onChange={(e) => {
                            const newHtml = e.target.value;
                            setTemplateFormData(prev => ({ 
                              ...prev, 
                              html_template_ar: newHtml,
                              // استخراج المحتوى من HTML وتطبيقه على النص العادي
                              content_ar: extractContentFromHtml(newHtml, 'ar')
                            }));
                          }}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm modal-input"
                        placeholder="HTML Template in Arabic"
                      />
                    </div>

                    <div>
                        <label className="block text-sm font-medium modal-text-primary mb-2 flex items-center gap-2">
                          HTML الإنجليزي
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">HTML</span>
                        </label>
                      <textarea
                        value={templateFormData.html_template_en}
                          onChange={(e) => {
                            const newHtml = e.target.value;
                            setTemplateFormData(prev => ({ 
                              ...prev, 
                              html_template_en: newHtml,
                              // استخراج المحتوى من HTML وتطبيقه على النص العادي
                              content_en: extractContentFromHtml(newHtml, 'en')
                            }));
                          }}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm modal-input"
                        placeholder="HTML Template in English"
                      />
                    </div>
                  </div>
                  )}
                </div>

                {/* إعدادات SMTP */}
                <div>
                  <h3 className="text-lg font-semibold modal-text-primary mb-4">إعدادات SMTP</h3>
                  
                  {/* فحص نوع القالب */}
                  {templateFormData.name.toLowerCase().includes('contact') || templateFormData.name_ar.includes('تواصل') ? (
                    /* قالب التواصل - حقلين منفصلين */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium modal-text-primary mb-2">
                          إعدادات الإرسال
                          <span className="text-xs text-gray-500 ml-2">(للإرسال للمستخدم)</span>
                        </label>
                        <select
                          value={templateFormData.contact_smtp_send_id}
                          onChange={(e) => setTemplateFormData(prev => ({ ...prev, contact_smtp_send_id: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        >
                          <option value="">اختر إعدادات SMTP للإرسال</option>
                          {emailSettings.map(setting => (
                            <option key={setting.id} value={setting.id}>
                              {setting.smtp_host} ({setting.from_email})
                              {setting.is_active ? ' - نشط' : ' - غير نشط'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium modal-text-primary mb-2">
                          إعدادات الاستقبال
                          <span className="text-xs text-gray-500 ml-2">(لاستقبال رسائل التواصل)</span>
                        </label>
                        <select
                          value={templateFormData.contact_smtp_receive_id}
                          onChange={(e) => setTemplateFormData(prev => ({ ...prev, contact_smtp_receive_id: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        >
                          <option value="">اختر إعدادات SMTP للاستقبال</option>
                          {emailSettings.map(setting => (
                            <option key={setting.id} value={setting.id}>
                              {setting.smtp_host} ({setting.from_email})
                              {setting.is_active ? ' - نشط' : ' - غير نشط'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    /* القوالب العادية - حقل واحد */
                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">
                        إعدادات SMTP
                        <span className="text-xs text-gray-500 ml-2">(لإرسال هذا القالب)</span>
                      </label>
                      <select
                        value={templateFormData.smtp_settings_id}
                        onChange={(e) => setTemplateFormData(prev => ({ ...prev, smtp_settings_id: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                      >
                        <option value="">اختر إعدادات SMTP (افتراضي إذا لم تحدد)</option>
                        {emailSettings.map(setting => (
                          <option key={setting.id} value={setting.id}>
                            {setting.smtp_host} ({setting.from_email})
                            {setting.is_active ? ' - نشط' : ' - غير نشط'}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        إذا لم تحدد إعدادات، سيتم استخدام الإعدادات النشطة الافتراضية
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="modal-footer flex justify-end space-x-2 space-x-reverse p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setEditingTemplate(null);
                  setTemplateFormData({
                    name: '',
                    name_ar: '',
                    name_en: '',
                    subject_ar: '',
                    subject_en: '',
                    content_ar: '',
                    content_en: '',
                    html_template_ar: '',
                    html_template_en: '',
                    is_active: true,
                    isAdvancedMode: false,
                    smtp_settings_id: '',
                    contact_smtp_send_id: '',
                    contact_smtp_receive_id: ''
                  });
                }}
                className="modal-button-secondary px-4 py-2 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!isTemplateFormValid || loading}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isTemplateFormValid && !loading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    حفظ القالب
                  </>
                )}
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
                        value={settingsFormData.host}
                        onChange={(e) => setSettingsFormData(prev => ({ ...prev, host: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">المنفذ</label>
                      <input
                        type="number"
                        value={settingsFormData.port}
                        onChange={(e) => setSettingsFormData(prev => ({ ...prev, port: parseInt(e.target.value) || 587 }))}
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
                        value={settingsFormData.username}
                        onChange={(e) => setSettingsFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="your-email@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">كلمة المرور</label>
                      <input
                        type="password"
                        value={settingsFormData.password}
                        onChange={(e) => setSettingsFormData(prev => ({ ...prev, password: e.target.value }))}
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
                        checked={settingsFormData.secure}
                        onChange={(e) => setSettingsFormData(prev => ({ ...prev, secure: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="mr-2 text-sm font-medium modal-text-primary">استخدام SSL/TLS</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settingsFormData.require_tls || false}
                        onChange={(e) => setSettingsFormData(prev => ({ ...prev, require_tls: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="mr-2 text-sm font-medium modal-text-primary">طلب TLS</label>
                    </div>
                  </div>
                </div>

                {/* إعدادات المرسل */}
                <div>
                  <h3 className="text-lg font-semibold modal-text-primary mb-4">إعدادات المرسل</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">اسم المرسل</label>
                      <input
                        type="text"
                        value={settingsFormData.from_name}
                        onChange={(e) => setSettingsFormData(prev => ({ ...prev, from_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="منصة رزقي"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium modal-text-primary mb-2">البريد الإلكتروني المرسل</label>
                      <input
                        type="email"
                        value={settingsFormData.from_email}
                        onChange={(e) => setSettingsFormData(prev => ({ ...prev, from_email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent modal-input"
                        placeholder="noreply@rezge.com"
                      />
                    </div>
                  </div>
                </div>

                {/* الحالة */}
                <div>
                  <h3 className="text-lg font-semibold modal-text-primary mb-4">الحالة</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settingsFormData.is_active}
                        onChange={(e) => setSettingsFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="mr-2 text-sm font-medium modal-text-primary">نشط</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settingsFormData.is_default}
                        onChange={(e) => setSettingsFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="mr-2 text-sm font-medium modal-text-primary">افتراضي</label>
                      <span className="text-xs text-gray-500">(سيتم استخدامه عند عدم تحديد إعدادات للقوالب)</span>
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
                onClick={handleSaveSettings}
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
                    <p><strong>تاريخ الإنشاء:</strong> {formatGregorianDate(templateToDelete.created_at)}</p>
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

      {/* نافذة اختبار القالب */}
      {showTestModal && templateToTest && (
        <div className="fixed inset-0 modal-backdrop backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="modal-container rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* رأس النافذة */}
            <div className="modal-header flex items-center justify-between p-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <TestTube className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold modal-text-primary">اختبار القالب</h2>
                  <p className="text-sm modal-text-secondary">إرسال قالب تجريبي للتحقق من عمله</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTestModal(false);
                  setTemplateToTest(null);
                }}
                className="modal-text-tertiary hover:modal-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* محتوى النافذة */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* معلومات القالب */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <TestTube className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-green-800 mb-2">قالب الاختبار</h3>
                      <p className="text-sm text-green-700">
                        <strong>الاسم:</strong> {templateToTest.name_ar}
                      </p>
                      <p className="text-sm text-green-700">
                        <strong>الحالة:</strong> {templateToTest.is_active ? 'نشط' : 'معطل'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* إدخال الإيميل */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium modal-text-primary">
                    عنوان الإيميل للاختبار *
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 modal-text-primary bg-white"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    سيتم إرسال قالب تجريبي إلى هذا العنوان
                  </p>
                </div>

                {/* اختيار اللغة */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium modal-text-primary">
                    لغة القالب
                  </label>
                  <select
                    value={testLanguage}
                    onChange={(e) => setTestLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 modal-text-primary bg-white"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                  <p className="text-xs text-gray-500">
                    اختر اللغة التي تريد اختبار القالب بها
                  </p>
                </div>

                {/* تحذير مهم */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 mb-1">ملاحظة مهمة:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• تأكد من صحة عنوان الإيميل</li>
                        <li>• قد يستغرق وصول الإيميل بضع دقائق</li>
                        <li>• تحقق من مجلد الرسائل غير المرغوب فيها</li>
                        <li>• هذا اختبار تجريبي ولن يؤثر على المستخدمين الحقيقيين</li>
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
                  setShowTestModal(false);
                  setTemplateToTest(null);
                }}
                className="modal-button-secondary px-4 py-2 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={executeTestTemplate}
                disabled={!testEmail.trim() || loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4" />
                    إرسال الاختبار
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة الاختبار الجماعي */}
      {showBulkTestModal && (
        <div className="fixed inset-0 modal-backdrop backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="modal-container rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* رأس النافذة */}
            <div className="modal-header flex items-center justify-between p-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <TestTube className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold modal-text-primary">اختبار القوالب الجماعي</h2>
                  <p className="text-sm modal-text-secondary">إرسال قوالب تجريبية للتحقق من عملها</p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkTestModal(false)}
                className="modal-text-tertiary hover:modal-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* محتوى النافذة */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* معلومات القوالب المحددة */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <TestTube className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-green-800 mb-2">القوالب المحددة للاختبار</h3>
                      <p className="text-sm text-green-700 mb-2">
                        <strong>عدد القوالب:</strong> {getSelectedTemplates().length}
                      </p>
                      <div className="text-sm text-green-700">
                        <strong>القوالب:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {getSelectedTemplates().slice(0, 3).map(template => (
                            <li key={template.id}>{template.name_ar}</li>
                          ))}
                          {getSelectedTemplates().length > 3 && (
                            <li>... و {getSelectedTemplates().length - 3} قالب آخر</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* إدخال الإيميل */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium modal-text-primary">
                    عنوان الإيميل للاختبار *
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 modal-text-primary bg-white"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    سيتم إرسال جميع القوالب المحددة إلى هذا العنوان
                  </p>
                </div>

                {/* اختيار اللغة */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium modal-text-primary">
                    لغة القوالب
                  </label>
                  <select
                    value={testLanguage}
                    onChange={(e) => setTestLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 modal-text-primary bg-white"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                  <p className="text-xs text-gray-500">
                    اختر اللغة التي تريد اختبار القوالب بها
                  </p>
                </div>

                {/* تحذير مهم */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 mb-1">ملاحظة مهمة:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• سيتم إرسال {getSelectedTemplates().length} إيميل منفصل</li>
                        <li>• قد يستغرق وصول الإيميلات بضع دقائق</li>
                        <li>• تحقق من مجلد الرسائل غير المرغوب فيها</li>
                        <li>• هذا اختبار تجريبي ولن يؤثر على المستخدمين الحقيقيين</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="modal-footer flex justify-end space-x-2 space-x-reverse p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowBulkTestModal(false)}
                className="modal-button-secondary px-4 py-2 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={executeBulkTestTemplates}
                disabled={!testEmail.trim() || loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4" />
                    إرسال الاختبار الجماعي
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة الحذف الجماعي لأنواع الإشعارات */}
      {showBulkDeleteTypesModal && (
        <div className="fixed inset-0 modal-backdrop backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="modal-container rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* رأس النافذة */}
            <div className="modal-header flex items-center justify-between p-6 flex-shrink-0">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">حذف أنواع الإشعارات</h3>
                  <p className="text-sm text-gray-500">تأكيد الحذف الجماعي</p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkDeleteTypesModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* محتوى النافذة */}
            <div className="modal-content flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">تحذير مهم</h4>
                      <p className="text-sm text-red-700 mt-1">
                        سيتم حذف {selectedNotificationTypes.length} نوع إشعار نهائياً. لا يمكن التراجع عن هذا الإجراء.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">أنواع الإشعارات المحددة:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getSelectedNotificationTypes().map((type) => (
                      <div key={type.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{type.name_ar}</div>
                          <div className="text-xs text-gray-500">{type.name_en}</div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          type.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {type.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">ملاحظة</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        تأكد من أن هذه الأنواع غير مستخدمة في القوالب أو الإعدادات قبل الحذف.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* تذييل النافذة */}
            <div className="modal-footer flex items-center justify-end space-x-3 space-x-reverse p-6 flex-shrink-0 border-t border-gray-200">
              <button
                onClick={() => setShowBulkDeleteTypesModal(false)}
                className="modal-button-secondary"
              >
                إلغاء
              </button>
              <button
                onClick={handleBulkDeleteNotificationTypes}
                disabled={loading}
                className={`modal-button-primary bg-red-600 hover:bg-red-700 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    حذف المحدد
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة حذف نوع إشعار واحد */}
      {showDeleteTypeModal && typeToDelete && (
        <div className="fixed inset-0 modal-backdrop backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="modal-container rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* رأس النافذة */}
            <div className="modal-header flex items-center justify-between p-6 flex-shrink-0">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">حذف نوع الإشعار</h3>
                  <p className="text-sm text-gray-500">تأكيد الحذف</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteTypeModal(false);
                  setTypeToDelete(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* محتوى النافذة */}
            <div className="modal-content flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">تحذير مهم</h4>
                      <p className="text-sm text-red-700 mt-1">
                        سيتم حذف نوع الإشعار "{typeToDelete.name_ar}" نهائياً. لا يمكن التراجع عن هذا الإجراء.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">تفاصيل نوع الإشعار:</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">الاسم العربي:</span>
                        <span className="text-sm text-gray-900 mr-2">{typeToDelete.name_ar}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">الاسم الإنجليزي:</span>
                        <span className="text-sm text-gray-900 mr-2">{typeToDelete.name_en}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">الوصف:</span>
                        <span className="text-sm text-gray-900 mr-2">{typeToDelete.description_ar}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">الحالة:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2 ${
                          typeToDelete.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {typeToDelete.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">ملاحظة</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        تأكد من أن هذا النوع غير مستخدم في القوالب أو الإعدادات قبل الحذف.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* تذييل النافذة */}
            <div className="modal-footer flex items-center justify-end space-x-3 space-x-reverse p-6 flex-shrink-0 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDeleteTypeModal(false);
                  setTypeToDelete(null);
                }}
                className="modal-button-secondary"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDeleteType}
                disabled={loading}
                className={`modal-button-primary bg-red-600 hover:bg-red-700 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تأكيد حذف إعدادات SMTP */}
      {showDeleteSettingsModal && settingsToDelete && (
        <div className="fixed inset-0 modal-backdrop backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="modal-container rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* رأس النافذة */}
            <div className="modal-header flex items-center justify-between p-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold modal-text-primary">تأكيد الحذف</h2>
                  <p className="text-sm modal-text-secondary">هل أنت متأكد من حذف هذه الإعدادات؟</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteSettingsModal(false);
                  setSettingsToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* محتوى النافذة */}
            <div className="modal-body flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">تفاصيل الإعدادات:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">الخادم:</span>
                      <span className="text-sm text-gray-900 mr-2">{settingsToDelete.smtp_host}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">المنفذ:</span>
                      <span className="text-sm text-gray-900 mr-2">{settingsToDelete.smtp_port}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">اسم المستخدم:</span>
                      <span className="text-sm text-gray-900 mr-2">{settingsToDelete.smtp_username}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">البريد المرسل منه:</span>
                      <span className="text-sm text-gray-900 mr-2">{settingsToDelete.from_email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">الحالة:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2 ${
                        settingsToDelete.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {settingsToDelete.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">تحذير</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      سيتم حذف إعدادات SMTP هذه نهائياً. تأكد من أن هذه الإعدادات غير مستخدمة في النظام.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* تذييل النافذة */}
            <div className="modal-footer flex items-center justify-end space-x-3 space-x-reverse p-6 flex-shrink-0 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDeleteSettingsModal(false);
                  setSettingsToDelete(null);
                }}
                className="modal-button-secondary"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmDeleteSettings}
                disabled={loading}
                className={`modal-button-primary bg-red-600 hover:bg-red-700 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModernAdminContainer>
  );
};

export default EmailNotificationsManagement;
