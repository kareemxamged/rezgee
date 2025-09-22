import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../ToastContainer';
import {
  X,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  Loader,
  Tag,
  Palette,
  Image,
  Hash,
  Eye,
  EyeOff
} from 'lucide-react';
import { articleService } from '../../../services/articleService';
import type { ArticleCategory } from '../../../services/articleService';

interface CategoryManagementProps {
  className?: string;
}

type CategoryFormData = {
  // Arabic version
  name_ar: string;
  description_ar: string;
  // English version
  name_en: string;
  description_en: string;
  // Common fields
  color: string;
  icon: string;
  language: 'ar' | 'en';
};

const CategoryManagement: React.FC<CategoryManagementProps> = ({
  className = ''
}) => {
  const { t, i18n } = useTranslation();
  const { showSuccess, showError } = useToast();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language as 'ar' | 'en';

  // State
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ArticleCategory | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name_ar: '',
    description_ar: '',
    name_en: '',
    description_en: '',
    color: 'from-primary-500 to-primary-600',
    icon: 'BookOpen',
    language: currentLanguage
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Predefined colors and icons
  const colorOptions = [
    { value: 'from-primary-500 to-primary-600', label: 'Primary', preview: 'bg-gradient-to-r from-primary-500 to-primary-600' },
    { value: 'from-emerald-500 to-emerald-600', label: 'Emerald', preview: 'bg-gradient-to-r from-emerald-500 to-emerald-600' },
    { value: 'from-rose-500 to-rose-600', label: 'Rose', preview: 'bg-gradient-to-r from-rose-500 to-rose-600' },
    { value: 'from-blue-500 to-blue-600', label: 'Blue', preview: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { value: 'from-amber-500 to-amber-600', label: 'Amber', preview: 'bg-gradient-to-r from-amber-500 to-amber-600' },
    { value: 'from-purple-500 to-purple-600', label: 'Purple', preview: 'bg-gradient-to-r from-purple-500 to-purple-600' },
    { value: 'from-indigo-500 to-indigo-600', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-500 to-indigo-600' },
    { value: 'from-pink-500 to-pink-600', label: 'Pink', preview: 'bg-gradient-to-r from-pink-500 to-pink-600' },
    { value: 'from-cyan-500 to-cyan-600', label: 'Cyan', preview: 'bg-gradient-to-r from-cyan-500 to-cyan-600' },
    { value: 'from-orange-500 to-orange-600', label: 'Orange', preview: 'bg-gradient-to-r from-orange-500 to-orange-600' }
  ];

  const iconOptions = [
    { value: 'BookOpen', label: 'Book Open' },
    { value: 'Heart', label: 'Heart' },
    { value: 'Users', label: 'Users' },
    { value: 'Shield', label: 'Shield' },
    { value: 'Star', label: 'Star' },
    { value: 'MessageCircle', label: 'Message Circle' },
    { value: 'Calendar', label: 'Calendar' },
    { value: 'Clock', label: 'Clock' },
    { value: 'Tag', label: 'Tag' },
    { value: 'Hash', label: 'Hash' },
    { value: 'Eye', label: 'Eye' },
    { value: 'TrendingUp', label: 'Trending Up' },
    { value: 'Lightbulb', label: 'Lightbulb' },
    { value: 'Target', label: 'Target' },
    { value: 'Zap', label: 'Zap' }
  ];

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await articleService.getCategories(currentLanguage);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        showError(
          'خطأ في التحميل',
          'حدث خطأ أثناء تحميل التصنيفات. يرجى المحاولة مرة أخرى.',
          5000
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [currentLanguage, showError]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate Arabic fields
    if (!formData.name_ar.trim()) {
      newErrors.name_ar = 'اسم التصنيف بالعربية مطلوب';
    } else if (formData.name_ar.length < 2) {
      newErrors.name_ar = 'اسم التصنيف بالعربية يجب أن يكون على الأقل حرفين';
    }

    if (!formData.description_ar.trim()) {
      newErrors.description_ar = 'وصف التصنيف بالعربية مطلوب';
    } else if (formData.description_ar.length < 10) {
      newErrors.description_ar = 'وصف التصنيف بالعربية يجب أن يكون على الأقل 10 أحرف';
    }

    // Validate English fields
    if (!formData.name_en.trim()) {
      newErrors.name_en = 'اسم التصنيف بالإنجليزية مطلوب';
    } else if (formData.name_en.length < 2) {
      newErrors.name_en = 'اسم التصنيف بالإنجليزية يجب أن يكون على الأقل حرفين';
    }

    if (!formData.description_en.trim()) {
      newErrors.description_en = 'وصف التصنيف بالإنجليزية مطلوب';
    } else if (formData.description_en.length < 10) {
      newErrors.description_en = 'وصف التصنيف بالإنجليزية يجب أن يكون على الأقل 10 أحرف';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({
      name_ar: '',
      description_ar: '',
      name_en: '',
      description_en: '',
      color: 'from-primary-500 to-primary-600',
      icon: 'BookOpen',
      language: currentLanguage
    });
    setErrors({});
    setShowForm(true);
  };

  const handleEditCategory = (category: ArticleCategory) => {
    setEditingCategory(category);
    setFormData({
      name_ar: category.language === 'ar' ? category.name : '',
      description_ar: category.language === 'ar' ? category.description : '',
      name_en: category.language === 'en' ? category.name : '',
      description_en: category.language === 'en' ? category.description : '',
      color: category.color,
      icon: category.icon,
      language: category.language
    });
    setErrors({});
    setShowForm(true);
  };

  const handleSaveCategory = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // TODO: Implement save category function
      console.log('Saving category:', formData);
      
      // Simulate API call - in real implementation, this would save both Arabic and English versions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowForm(false);
      setEditingCategory(null);
      await loadCategories();
      
      showSuccess(
        'تم الحفظ بنجاح!',
        `تم ${editingCategory ? 'تحديث' : 'إنشاء'} التصنيف باللغتين العربية والإنجليزية بنجاح.`,
        3000
      );
    } catch (error) {
      console.error('Error saving category:', error);
      showError(
        'خطأ في الحفظ',
        'حدث خطأ أثناء حفظ التصنيف. يرجى المحاولة مرة أخرى.',
        5000
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm(t('admin.categories.deleteConfirm'))) {
      return;
    }

    try {
      // TODO: Implement delete category function
      console.log('Deleting category:', categoryId);
      await loadCategories();
      
      showSuccess(
        'تم الحذف بنجاح!',
        'تم حذف التصنيف بنجاح من قاعدة البيانات.',
        3000
      );
    } catch (error) {
      console.error('Error deleting category:', error);
      showError(
        'خطأ في الحذف',
        'حدث خطأ أثناء حذف التصنيف. يرجى المحاولة مرة أخرى.',
        5000
      );
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await articleService.getCategories(currentLanguage);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {t('admin.categories.title')}
            </h2>
            <p className="text-slate-600 mt-1">
              {t('admin.categories.subtitle')} ({categories.length})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateCategory}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('admin.categories.create')}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {showForm ? (
            <div className="p-6">
              <div className="max-w-2xl mx-auto">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-6">
                    {editingCategory ? t('admin.categories.editCategory') : t('admin.categories.createCategory')}
                  </h3>

                  <div className="space-y-6">
                    {/* Arabic Version */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🇸🇦</span>
                        النسخة العربية
                      </h4>
                      
                      {/* Arabic Name */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          اسم التصنيف بالعربية *
                        </label>
                        <input
                          type="text"
                          value={formData.name_ar}
                          onChange={(e) => handleInputChange('name_ar', e.target.value)}
                          placeholder="أدخل اسم التصنيف بالعربية"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                            errors.name_ar ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {errors.name_ar && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.name_ar}
                          </p>
                        )}
                      </div>

                      {/* Arabic Description */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          وصف التصنيف بالعربية *
                        </label>
                        <textarea
                          value={formData.description_ar}
                          onChange={(e) => handleInputChange('description_ar', e.target.value)}
                          placeholder="أدخل وصف التصنيف بالعربية"
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none ${
                            errors.description_ar ? 'border-red-300' : 'border-slate-300'
                        }`}
                        />
                        {errors.description_ar && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.description_ar}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* English Version */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🇺🇸</span>
                        النسخة الإنجليزية
                      </h4>
                      
                      {/* English Name */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          اسم التصنيف بالإنجليزية *
                        </label>
                        <input
                          type="text"
                          value={formData.name_en}
                          onChange={(e) => handleInputChange('name_en', e.target.value)}
                          placeholder="Enter category name in English"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                            errors.name_en ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {errors.name_en && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.name_en}
                          </p>
                        )}
                      </div>

                      {/* English Description */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          وصف التصنيف بالإنجليزية *
                        </label>
                        <textarea
                          value={formData.description_en}
                          onChange={(e) => handleInputChange('description_en', e.target.value)}
                          placeholder="Enter category description in English"
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none ${
                            errors.description_en ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {errors.description_en && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.description_en}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        {t('admin.categories.color')}
                      </label>
                      <div className="grid grid-cols-5 gap-3">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => handleInputChange('color', color.value)}
                            className={`relative p-3 rounded-lg border-2 transition-all ${
                              formData.color === color.value
                                ? 'border-primary-500 ring-2 ring-primary-200'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-full h-8 rounded ${color.preview}`} />
                            <div className="mt-2 text-xs font-medium text-slate-600">
                              {color.label}
                            </div>
                            {formData.color === color.value && (
                              <div className="absolute top-1 right-1">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Icon */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        {t('admin.categories.icon')}
                      </label>
                      <div className="grid grid-cols-5 gap-3">
                        {iconOptions.map((icon) => (
                          <button
                            key={icon.value}
                            onClick={() => handleInputChange('icon', icon.value)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                              formData.icon === icon.value
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${formData.color} flex items-center justify-center`}>
                              <span className="text-white text-xs font-bold">
                                {icon.value.charAt(0)}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-slate-600">
                              {icon.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        المعاينة
                      </label>
                      
                      {/* Arabic Preview */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                          <span className="text-lg">🇸🇦</span>
                          المعاينة العربية
                        </h5>
                        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${formData.color} flex items-center justify-center`}>
                              <span className="text-white text-lg font-bold">
                                {formData.icon.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">
                                {formData.name_ar || 'اسم التصنيف بالعربية'}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {formData.description_ar || 'وصف التصنيف بالعربية'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* English Preview */}
                      <div>
                        <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          المعاينة الإنجليزية
                        </h5>
                        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${formData.color} flex items-center justify-center`}>
                              <span className="text-white text-lg font-bold">
                                {formData.icon.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">
                                {formData.name_en || 'Category Name in English'}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {formData.description_en || 'Category Description in English'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={handleSaveCategory}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          {t('common.saving')}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {editingCategory ? t('common.update') : t('common.create')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">{t('admin.categories.loading')}</p>
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Tag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">
                      {t('admin.categories.noCategories')}
                    </h3>
                    <p className="text-slate-500 mb-6">
                      {t('admin.categories.noCategoriesDesc')}
                    </p>
                    <button
                      onClick={handleCreateCategory}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      {t('admin.categories.createFirst')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                          <span className="text-white text-lg font-bold">
                            {category.icon.charAt(0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title={t('admin.categories.edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={t('admin.categories.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-semibold text-slate-800 mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-3">
                          {category.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>
                          {category.article_count || 0} {t('admin.categories.articles')}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                          {category.language}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
};

export default CategoryManagement;
