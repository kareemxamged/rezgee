// صفحة إدارة النشرة الإخبارية في لوحة الإدارة
// Newsletter Management Page for Admin Dashboard

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Users, 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3,
  Calendar,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import NewsletterService from '../../lib/newsletterService';
import type { NewsletterSubscriber, NewsletterCampaign, NewsletterStats } from '../../lib/newsletterService';
import { useSeparateAdmin } from './SeparateAdminProvider';
import ModernAdminContainer from './ModernAdminContainer';

const NewsletterManagement: React.FC = () => {
  const { adminAccount } = useSeparateAdmin();
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'campaigns' | 'create'>('overview');
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // نموذج إنشاء حملة جديدة (ثنائي اللغة)
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    subject: '',
    content_ar: '',
    content_en: '',
    language: 'bilingual' as 'ar' | 'en' | 'bilingual',
    scheduled_at: ''
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sendingCampaign, setSendingCampaign] = useState<string | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<NewsletterCampaign | null>(null);

  // دالة لتحويل التاريخ إلى ميلادي
  const formatDateToGregorian = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // تحميل البيانات
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsResult, subscribersResult, campaignsResult] = await Promise.all([
        NewsletterService.getStats(),
        NewsletterService.getSubscribers(1, 100),
        NewsletterService.getCampaigns(1, 20)
      ]);

      if (statsResult.success) setStats(statsResult.data || null);
      if (subscribersResult.success) setSubscribers(subscribersResult.data || []);
      if (campaignsResult.success) setCampaigns(campaignsResult.data || []);

    } catch (err) {
      setError('حدث خطأ في تحميل البيانات');
      console.error('Error loading newsletter data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminAccount?.id) {
      setError('لم يتم العثور على معلومات المشرف');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // تحويل المحتوى العربي والإنجليزي إلى HTML تلقائياً مع ضبط الاتجاهات
      const html_content = `
        <div class="arabic-content" style="margin-bottom: 30px; direction: rtl; text-align: right; font-family: 'Tahoma', Arial, sans-serif;">
          <h3 style="color: #1e40af; margin-bottom: 15px; font-size: 18px; direction: rtl; text-align: right;">🇸🇦 العربية</h3>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-right: 4px solid #1e40af; direction: rtl; text-align: right;">
            ${newCampaign.content_ar.split('\n').map(line => 
              line.trim() ? `<p style="margin-bottom: 15px; direction: rtl; text-align: right; font-family: 'Tahoma', Arial, sans-serif;">${line}</p>` : ''
            ).join('')}
          </div>
        </div>
        
        <div class="english-content" style="border-top: 2px solid #e5e7eb; padding-top: 30px; direction: ltr; text-align: left; font-family: 'Arial', sans-serif;">
          <h3 style="color: #1e40af; margin-bottom: 15px; font-size: 18px; direction: ltr; text-align: left;">🇺🇸 English</h3>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #1e40af; direction: ltr; text-align: left;">
            ${newCampaign.content_en.split('\n').map(line => 
              line.trim() ? `<p style="margin-bottom: 15px; direction: ltr; text-align: left; font-family: 'Arial', sans-serif;">${line}</p>` : ''
            ).join('')}
          </div>
        </div>
      `;

      // دمج المحتوى العربي والإنجليزي للنص العادي
      const content = `${newCampaign.content_ar}\n\n---\n\n${newCampaign.content_en}`;

      const result = await NewsletterService.createCampaign({
        title: newCampaign.title,
        subject: newCampaign.subject,
        content: content,
        html_content: html_content,
        language: newCampaign.language,
        scheduled_at: newCampaign.scheduled_at,
        created_by: adminAccount.id
      });

      if (result.success) {
        setShowCreateForm(false);
        setNewCampaign({
          title: '',
          subject: '',
          content_ar: '',
          content_en: '',
          language: 'bilingual',
          scheduled_at: ''
        });
        await loadData();
        setActiveTab('campaigns');
      } else {
        setError(result.error || 'فشل في إنشاء الحملة');
      }
    } catch (err) {
      setError('حدث خطأ في إنشاء الحملة');
      console.error('Error creating campaign:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    try {
      setSendingCampaign(campaignId);
      setError('');

      const result = await NewsletterService.sendCampaign(campaignId);

      if (result.success) {
        await loadData();
      } else {
        setError(result.error || 'فشل في إرسال الحملة');
      }
    } catch (err) {
      setError('حدث خطأ في إرسال الحملة');
      console.error('Error sending campaign:', err);
    } finally {
      setSendingCampaign(null);
    }
  };

  const handleResendCampaign = async (campaignId: string) => {
    try {
      setSendingCampaign(campaignId);
      setError('');

      const result = await NewsletterService.sendCampaign(campaignId);

      if (result.success) {
        await loadData();
      } else {
        setError(result.error || 'فشل في إعادة إرسال الحملة');
      }
    } catch (err) {
      setError('حدث خطأ في إعادة إرسال الحملة');
      console.error('Error resending campaign:', err);
    } finally {
      setSendingCampaign(null);
    }
  };

  const handleViewCampaign = (campaign: NewsletterCampaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'unsubscribed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'sending': return 'text-purple-600 bg-purple-100';
      case 'sent': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'unsubscribed': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      case 'sending': return <Send className="w-4 h-4" />;
      case 'sent': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'subscribers', label: 'المشتركين', icon: Users },
    { id: 'campaigns', label: 'الحملات', icon: Mail },
    { id: 'create', label: 'إنشاء حملة', icon: Plus }
  ];

  if (loading && !stats) {
    return (
      <ModernAdminContainer>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </ModernAdminContainer>
    );
  }

  return (
    <ModernAdminContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة النشرة الإخبارية</h1>
            <p className="text-gray-600">إدارة المشتركين والحملات الإخبارية</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-12">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي المشتركين</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_subscribers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">المشتركين النشطين</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.active_subscribers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">الحملات المرسلة</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.sent_campaigns}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">معدل الفتح</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.average_open_rate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab('create')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  إنشاء حملة جديدة
                </button>
                <button
                  onClick={() => setActiveTab('subscribers')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  عرض المشتركين
                </button>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  عرض الحملات
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">المشتركين في النشرة الإخبارية</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الاشتراك</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subscriber.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subscriber.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscriber.status)}`}>
                          {getStatusIcon(subscriber.status)}
                          {subscriber.status === 'active' ? 'نشط' : 
                           subscriber.status === 'unsubscribed' ? 'ملغي' : 'معلق'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateToGregorian(subscriber.subscribed_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        {campaign.status === 'draft' ? 'مسودة' :
                         campaign.status === 'scheduled' ? 'مجدولة' :
                         campaign.status === 'sending' ? 'جاري الإرسال' :
                         campaign.status === 'sent' ? 'مرسلة' : 'ملغية'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{campaign.subject}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {campaign.total_subscribers} مشترك
                      </span>
                      <span className="flex items-center gap-1">
                        <Send className="w-4 h-4" />
                        {campaign.sent_count} مرسل
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {campaign.language === 'ar' ? 'العربية' : 
                         campaign.language === 'en' ? 'الإنجليزية' : 'ثنائي اللغة'}
                      </span>
                      {campaign.sent_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDateToGregorian(campaign.sent_at)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewCampaign(campaign)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="عرض تفاصيل الحملة"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {campaign.status === 'draft' && (
                      <button
                        onClick={() => handleSendCampaign(campaign.id)}
                        disabled={sendingCampaign === campaign.id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {sendingCampaign === campaign.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        إرسال
                      </button>
                    )}
                    {campaign.status === 'sent' && (
                      <button
                        onClick={() => handleResendCampaign(campaign.id)}
                        disabled={sendingCampaign === campaign.id}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        title="إعادة إرسال الحملة"
                      >
                        {sendingCampaign === campaign.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <RotateCcw className="w-4 h-4" />
                        )}
                        إعادة إرسال
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Campaign Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">إنشاء حملة إخبارية جديدة (ثنائية اللغة)</h3>
            
            <form onSubmit={handleCreateCampaign} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الحملة</label>
                  <input
                    type="text"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="مثال: أخبار رزقي الأسبوعية"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">موضوع الإيميل</label>
                  <input
                    type="text"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="مثال: أخبار رزقي الأسبوعية - العدد ١"
                    required
                  />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <Globe className="w-5 h-5" />
                  <span className="font-medium">محتوى ثنائي اللغة - مبسط</span>
                </div>
                <p className="text-green-700 text-sm">
                  اكتب المحتوى العربي والإنجليزي في الخانتين أدناه. سيتم تحويلهما تلقائياً إلى HTML مع ضبط الاتجاهات والتصميم.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🇸🇦 المحتوى العربي
                  </label>
                  <textarea
                    value={newCampaign.content_ar}
                    onChange={(e) => setNewCampaign({...newCampaign, content_ar: e.target.value})}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="اكتب المحتوى العربي هنا...

مثال:
مرحباً بك في النشرة الإخبارية لرزقي!

في هذا العدد:
- نصائح الزواج الإسلامي الشرعي
- قصص نجاح من أعضاء المنصة
- آخر التحديثات والمميزات الجديدة

نتمنى لك رحلة سعيدة نحو الزواج الشرعي!"
                    required
                    style={{ direction: 'rtl', textAlign: 'right' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🇺🇸 المحتوى الإنجليزي
                  </label>
                  <textarea
                    value={newCampaign.content_en}
                    onChange={(e) => setNewCampaign({...newCampaign, content_en: e.target.value})}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Write English content here...

Example:
Welcome to the Rezge newsletter!

In this issue:
- Islamic marriage guidance and tips
- Success stories from platform members
- Latest updates and new features

We wish you a happy journey towards Islamic marriage!"
                    required
                    style={{ direction: 'ltr', textAlign: 'left' }}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 نصائح:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• اكتب كل فقرة في سطر منفصل</li>
                  <li>• استخدم الأسطر الفارغة لفصل الفقرات</li>
                  <li>• سيتم تحويل المحتوى تلقائياً إلى HTML</li>
                  <li>• سيتم ضبط الاتجاهات تلقائياً (RTL للعربي، LTR للإنجليزي)</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 جدولة الإرسال (اختياري)
                </label>
                <input
                  type="datetime-local"
                  value={newCampaign.scheduled_at}
                  onChange={(e) => setNewCampaign({...newCampaign, scheduled_at: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="اختر تاريخ ووقت الإرسال (اختياري)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  اتركه فارغاً للإرسال الفوري، أو اختر تاريخاً مستقبلياً للجدولة
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('campaigns')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  إنشاء الحملة ثنائية اللغة
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Campaign Details Modal */}
        {showCampaignModal && selectedCampaign && (
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* خلفية */}
              <div
                className="fixed inset-0 transition-opacity modal-backdrop backdrop-blur-sm"
                onClick={() => setShowCampaignModal(false)}
              />
              {/* المحتوى */}
              <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-right align-middle transition-all transform modal-container rounded-2xl"
                   onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="modal-header flex items-center justify-between p-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold modal-text-primary">تفاصيل الحملة</h2>
                    <p className="text-sm modal-text-secondary">{selectedCampaign.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="modal-text-tertiary hover:modal-text-primary transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Campaign Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">الحالة</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {selectedCampaign.status === 'draft' ? 'مسودة' : 
                         selectedCampaign.status === 'sent' ? 'تم الإرسال' : 
                         selectedCampaign.status === 'scheduled' ? 'مجدولة' : 'غير معروف'}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">اللغة</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {selectedCampaign.language === 'ar' ? 'العربية' : 
                         selectedCampaign.language === 'en' ? 'الإنجليزية' : 'ثنائي اللغة'}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">تاريخ الإنشاء</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatDateToGregorian(selectedCampaign.created_at)}
                      </div>
                    </div>
                    {selectedCampaign.sent_at && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">تاريخ الإرسال</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatDateToGregorian(selectedCampaign.sent_at)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Campaign Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedCampaign.total_subscribers}</div>
                      <div className="text-sm text-blue-800">إجمالي المشتركين</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedCampaign.sent_count}</div>
                      <div className="text-sm text-green-800">تم الإرسال</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600">{selectedCampaign.opened_count}</div>
                      <div className="text-sm text-yellow-800">تم الفتح</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedCampaign.clicked_count}</div>
                      <div className="text-sm text-purple-800">تم النقر</div>
                    </div>
                  </div>

                  {/* Campaign Content */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">محتوى الحملة</h4>
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedCampaign.html_content }}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إغلاق
                </button>
              </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModernAdminContainer>
  );
};

export default NewsletterManagement;














