import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, TestTube, Eye, EyeOff } from 'lucide-react';
import { EmailNotificationsAdminService } from '../../../lib/emailNotificationsAdminService';

// أنواع البيانات المحلية
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

interface EmailSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmailSettings) => void;
  editingSettings?: EmailSettings | null;
}

const EmailSettingsModal: React.FC<EmailSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSettings
}) => {
  const [formData, setFormData] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    from_name_ar: '',
    from_name_en: '',
    from_email: '',
    reply_to: '',
    is_active: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // تحديث البيانات عند التعديل
  useEffect(() => {
    if (editingSettings) {
      setFormData({
        smtp_host: editingSettings.smtp_host || '',
        smtp_port: editingSettings.smtp_port || 587,
        smtp_username: editingSettings.smtp_username || '',
        smtp_password: editingSettings.smtp_password || '',
        from_name_ar: editingSettings.from_name_ar || '',
        from_name_en: editingSettings.from_name_en || '',
        from_email: editingSettings.from_email || '',
        reply_to: editingSettings.reply_to || '',
        is_active: editingSettings.is_active
      });
    } else {
      setFormData({
        smtp_host: '',
        smtp_port: 587,
        smtp_username: '',
        smtp_password: '',
        from_name_ar: '',
        from_name_en: '',
        from_email: '',
        reply_to: '',
        is_active: true
      });
    }
  }, [editingSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = editingSettings
        ? await EmailNotificationsAdminService.updateEmailSettings(editingSettings.id, formData)
        : await EmailNotificationsAdminService.createEmailSettings(formData);

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

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    setError(null);

    try {
      const result = await EmailNotificationsAdminService.testSMTPConnection(formData);
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'فشل في اختبار الاتصال'
      });
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingSettings ? 'تعديل إعدادات SMTP' : 'إضافة إعدادات SMTP جديدة'}
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

        {testResult && (
          <div className={`border rounded-lg p-4 mb-6 ${
            testResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className={`flex items-center gap-2 ${
              testResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">
                {testResult.success ? 'نجح الاختبار' : 'فشل الاختبار'}
              </span>
            </div>
            <p className={`mt-1 ${
              testResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {testResult.message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* إعدادات SMTP */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات SMTP</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  خادم SMTP
                </label>
                <input
                  type="text"
                  value={formData.smtp_host}
                  onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المنفذ
                </label>
                <input
                  type="number"
                  value={formData.smtp_port}
                  onChange={(e) => handleInputChange('smtp_port', parseInt(e.target.value))}
                  placeholder="587"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  value={formData.smtp_username}
                  onChange={(e) => handleInputChange('smtp_username', e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.smtp_password}
                    onChange={(e) => handleInputChange('smtp_password', e.target.value)}
                    placeholder="كلمة مرور التطبيق"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={testConnection}
                disabled={testing || !formData.smtp_host || !formData.smtp_username}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <TestTube className="w-4 h-4" />
                {testing ? 'جاري الاختبار...' : 'اختبار الاتصال'}
              </button>
            </div>
          </div>

          {/* إعدادات المرسل */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات المرسل</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المرسل (العربية)
                </label>
                <input
                  type="text"
                  value={formData.from_name_ar}
                  onChange={(e) => handleInputChange('from_name_ar', e.target.value)}
                  placeholder="منصة رزقي"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المرسل (الإنجليزية)
                </label>
                <input
                  type="text"
                  value={formData.from_name_en}
                  onChange={(e) => handleInputChange('from_name_en', e.target.value)}
                  placeholder="Rezge Platform"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني المرسل
                </label>
                <input
                  type="email"
                  value={formData.from_email}
                  onChange={(e) => handleInputChange('from_email', e.target.value)}
                  placeholder="noreply@rezge.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني للرد
                </label>
                <input
                  type="email"
                  value={formData.reply_to}
                  onChange={(e) => handleInputChange('reply_to', e.target.value)}
                  placeholder="support@rezge.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
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

export default EmailSettingsModal;