import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Eye, RefreshCw } from 'lucide-react';
import { EmailNotificationsAdminService } from '../../../lib/emailNotificationsAdminService';

// أنواع البيانات المحلية
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

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmailTemplate) => void;
  editingTemplate?: EmailTemplate | null;
}

const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTemplate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    name_en: '',
    subject_ar: '',
    subject_en: '',
    content_ar: '',
    content_en: '',
    html_template_ar: '',
    html_template_en: '',
    is_active: true
  });

  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // تحديث البيانات عند التعديل
  useEffect(() => {
    if (editingTemplate) {
      setFormData({
        name: editingTemplate.name || '',
        name_ar: editingTemplate.name_ar || '',
        name_en: editingTemplate.name_en || '',
        subject_ar: editingTemplate.subject_ar || '',
        subject_en: editingTemplate.subject_en || '',
        content_ar: editingTemplate.content_ar || '',
        content_en: editingTemplate.content_en || '',
        html_template_ar: editingTemplate.html_template_ar || '',
        html_template_en: editingTemplate.html_template_en || '',
        is_active: editingTemplate.is_active
      });
    } else {
      setFormData({
        name: '',
        name_ar: '',
        name_en: '',
        subject_ar: '',
        subject_en: '',
        content_ar: '',
        content_en: '',
        html_template_ar: '',
        html_template_en: '',
        is_active: true
      });
    }
  }, [editingTemplate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = editingTemplate
        ? await EmailNotificationsAdminService.updateEmailTemplate(editingTemplate.id, formData)
        : await EmailNotificationsAdminService.createEmailTemplate(formData);

      onSave(result);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateDefaultTemplate = () => {
    const defaultHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.subject_ar || 'إيميل من منصة رزقي'}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #4F46E5;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #4F46E5;
            margin-bottom: 10px;
        }
        .content {
            margin-bottom: 30px;
        }
        .footer {
            text-align: center;
            border-top: 1px solid #eee;
            padding-top: 20px;
            color: #666;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">منصة رزقي</div>
            <p>منصة التعارف المتوافق مع الشريعة الإسلامية</p>
        </div>
        
        <div class="content">
            <h2>مرحباً بك في منصة رزقي</h2>
            <p>نرحب بك في منصة رزقي، المنصة الرائدة في التعارف المتوافق مع الشريعة الإسلامية.</p>
            <p>نحن ملتزمون بتقديم تجربة آمنة ومحترمة لجميع المستخدمين.</p>
            
            <a href="#" class="button">ابدأ رحلتك الآن</a>
        </div>
        
        <div class="footer">
            <p>© 2024 منصة رزقي. جميع الحقوق محفوظة.</p>
            <p>إذا لم تطلب هذا الإيميل، يرجى تجاهله.</p>
        </div>
    </div>
</body>
</html>`;

    const defaultText = `
مرحباً بك في منصة رزقي

نرحب بك في منصة رزقي، المنصة الرائدة في التعارف المتوافق مع الشريعة الإسلامية.

نحن ملتزمون بتقديم تجربة آمنة ومحترمة لجميع المستخدمين.

ابدأ رحلتك الآن: [رابط المنصة]

© 2024 منصة رزقي. جميع الحقوق محفوظة.
إذا لم تطلب هذا الإيميل، يرجى تجاهله.
`;

    if (activeTab === 'ar') {
      handleInputChange('html_template_ar', defaultHtml);
      handleInputChange('content_ar', defaultText);
    } else {
      handleInputChange('html_template_en', defaultHtml);
      handleInputChange('content_en', defaultText);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingTemplate ? 'تعديل قالب الإيميل' : 'إنشاء قالب إيميل جديد'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">خطأ</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* الاسم العام */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم العام
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* الاسم بالعربية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم بالعربية
            </label>
            <input
              type="text"
              value={formData.name_ar}
              onChange={(e) => handleInputChange('name_ar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* الاسم بالإنجليزية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم بالإنجليزية
            </label>
            <input
              type="text"
              value={formData.name_en}
              onChange={(e) => handleInputChange('name_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* التبويبات للغة */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                type="button"
                onClick={() => setActiveTab('ar')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ar'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'en'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                English
              </button>
            </nav>
          </div>

          {/* الموضوع */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              موضوع الإيميل ({activeTab === 'ar' ? 'العربية' : 'الإنجليزية'})
            </label>
            <input
              type="text"
              value={activeTab === 'ar' ? formData.subject_ar : formData.subject_en}
              onChange={(e) => handleInputChange(
                activeTab === 'ar' ? 'subject_ar' : 'subject_en',
                e.target.value
              )}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* المحتوى النصي */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المحتوى النصي ({activeTab === 'ar' ? 'العربية' : 'الإنجليزية'})
            </label>
            <textarea
              value={activeTab === 'ar' ? formData.content_ar : formData.content_en}
              onChange={(e) => handleInputChange(
                activeTab === 'ar' ? 'content_ar' : 'content_en',
                e.target.value
              )}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* القالب HTML */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                القالب HTML ({activeTab === 'ar' ? 'العربية' : 'الإنجليزية'})
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={generateDefaultTemplate}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  قالب افتراضي
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  {showPreview ? 'إخفاء المعاينة' : 'معاينة'}
                </button>
              </div>
            </div>
            
            {showPreview ? (
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: activeTab === 'ar' ? formData.html_template_ar : formData.html_template_en 
                  }} 
                />
              </div>
            ) : (
              <textarea
                value={activeTab === 'ar' ? formData.html_template_ar : formData.html_template_en}
                onChange={(e) => handleInputChange(
                  activeTab === 'ar' ? 'html_template_ar' : 'html_template_en',
                  e.target.value
                )}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="أدخل كود HTML هنا..."
              />
            )}
          </div>

          {/* الحالة */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="mr-2 block text-sm text-gray-900">
              نشط
            </label>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailTemplateModal;