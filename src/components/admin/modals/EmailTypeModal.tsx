import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { EmailNotificationsAdminService } from '../../../lib/emailNotificationsAdminService';

// أنواع البيانات المحلية
interface EmailNotificationType {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  description: string;
  description_ar: string;
  description_en: string;
  is_active: boolean;
  template_id: string;
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

interface EmailTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmailNotificationType) => void;
  editingType?: EmailNotificationType | null;
}

const EmailTypeModal: React.FC<EmailTypeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingType
}) => {
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    name_en: '',
    description: '',
    description_ar: '',
    description_en: '',
    is_active: true,
    template_id: ''
  });

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // تحميل القوالب المتاحة
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  // تحديث البيانات عند التعديل
  useEffect(() => {
    if (editingType) {
      setFormData({
        name: editingType.name || '',
        name_ar: editingType.name_ar || '',
        name_en: editingType.name_en || '',
        description: editingType.description || '',
        description_ar: editingType.description_ar || '',
        description_en: editingType.description_en || '',
        is_active: editingType.is_active,
        template_id: editingType.template_id || ''
      });
    } else {
      setFormData({
        name: '',
        name_ar: '',
        name_en: '',
        description: '',
        description_ar: '',
        description_en: '',
        is_active: true,
        template_id: ''
      });
    }
  }, [editingType]);

  const loadTemplates = async () => {
    try {
      const data = await EmailNotificationsAdminService.getEmailTemplates();
      setTemplates(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = editingType
        ? await EmailNotificationsAdminService.updateNotificationType(editingType.id, formData)
        : await EmailNotificationsAdminService.createNotificationType(formData);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingType ? 'تعديل نوع الإشعار' : 'إضافة نوع إشعار جديد'}
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

          {/* الوصف العام */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف العام
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* الوصف بالعربية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف بالعربية
            </label>
            <textarea
              value={formData.description_ar}
              onChange={(e) => handleInputChange('description_ar', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* الوصف بالإنجليزية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف بالإنجليزية
            </label>
            <textarea
              value={formData.description_en}
              onChange={(e) => handleInputChange('description_en', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* القالب المرتبط */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              القالب المرتبط
            </label>
            <select
              value={formData.template_id}
              onChange={(e) => handleInputChange('template_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">اختر قالب</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name_ar} - {template.name_en}
                </option>
              ))}
            </select>
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

export default EmailTypeModal;