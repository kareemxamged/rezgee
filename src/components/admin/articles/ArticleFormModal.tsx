import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../ToastContainer';
import {
  X,
  Save,
  Eye,
  EyeOff,
  Upload,
  Image,
  Tag,
  Calendar,
  Clock,
  User,
  Hash,
  AlertCircle,
  CheckCircle,
  Loader,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { articleService } from '../../../services/articleService';
import type { ArticleWithDetails, ArticleCategory } from '../../../services/articleService';

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  article?: ArticleWithDetails | null;
  onSave: () => void;
}

type ArticleFormData = {
  title: string;
  excerpt: string;
  content: string;
  category_id: string;
  tags: string[];
  read_time: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  language: 'ar' | 'en';
  image_url?: string;
};

const ArticleFormModal: React.FC<ArticleFormModalProps> = ({
  isOpen,
  onClose,
  article,
  onSave
}) => {
  const { t, i18n } = useTranslation();
  const { showSuccess, showError } = useToast();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language as 'ar' | 'en';

  // State
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    excerpt: '',
    content: '',
    category_id: '',
    tags: [],
    read_time: 5,
    status: 'draft',
    featured: false,
    language: currentLanguage,
    image_url: ''
  });

  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
  const [tagInput, setTagInput] = useState('');


  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await articleService.getCategories(currentLanguage);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, currentLanguage]);


  // Initialize form data
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        category_id: article.category_id || '',
        tags: article.tags || [],
        read_time: article.read_time || 5,
        status: article.status || 'draft',
        featured: article.featured || false,
        language: article.language || currentLanguage,
        image_url: article.image_url || ''
      });
    } else {
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category_id: '',
        tags: [],
        read_time: 5,
        status: 'draft',
        featured: false,
        language: currentLanguage,
        image_url: ''
      });
    }
    setErrors({});
    setPreviewMode(false);
  }, [article, currentLanguage]);


  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('admin.articles.validation.titleRequired');
    } else if (formData.title.length < 10) {
      newErrors.title = t('admin.articles.validation.titleMinLength');
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = t('admin.articles.validation.excerptRequired');
    } else if (formData.excerpt.length < 50) {
      newErrors.excerpt = t('admin.articles.validation.excerptMinLength');
    }

    if (!formData.content.trim()) {
      newErrors.content = t('admin.articles.validation.contentRequired');
    } else if (formData.content.length < 100) {
      newErrors.content = t('admin.articles.validation.contentMinLength');
    }

    if (!formData.category_id) {
      newErrors.category_id = t('admin.articles.validation.categoryRequired');
    }

    if (formData.read_time < 1 || formData.read_time > 60) {
      newErrors.read_time = t('admin.articles.validation.readTimeRange');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
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

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Rich Text Editor Functions
  const executeCommand = (command: string, value?: string) => {
    const editor = document.getElementById('rich-editor');
    if (editor) {
      editor.focus();
      document.execCommand(command, false, value);
      // Trigger input event to update content
      const event = new Event('input', { bubbles: true });
      editor.dispatchEvent(event);
    }
  };

  const formatText = (command: string) => {
    executeCommand(command);
  };

  const insertHeading = (level: number) => {
    const editor = document.getElementById('rich-editor');
    if (editor) {
      editor.focus();
      document.execCommand('formatBlock', false, `h${level}`);
      // Trigger input event to update content
      const event = new Event('input', { bubbles: true });
      editor.dispatchEvent(event);
    }
  };

  const insertList = (ordered: boolean = false) => {
    const editor = document.getElementById('rich-editor');
    if (editor) {
      editor.focus();
      document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList', false);
      // Trigger input event to update content
      const event = new Event('input', { bubbles: true });
      editor.dispatchEvent(event);
    }
  };

  const insertQuote = () => {
    const editor = document.getElementById('rich-editor');
    if (editor) {
      editor.focus();
      document.execCommand('formatBlock', false, 'blockquote');
      // Trigger input event to update content
      const event = new Event('input', { bubbles: true });
      editor.dispatchEvent(event);
    }
  };

  const insertLink = () => {
    const url = prompt('أدخل الرابط:');
    if (url) {
      const editor = document.getElementById('rich-editor');
      if (editor) {
        editor.focus();
        document.execCommand('createLink', false, url);
        // Trigger input event to update content
        const event = new Event('input', { bubbles: true });
        editor.dispatchEvent(event);
      }
    }
  };

  const alignText = (alignment: string) => {
    const editor = document.getElementById('rich-editor');
    if (editor) {
      editor.focus();
      document.execCommand('justify' + alignment, false);
      // Trigger input event to update content
      const event = new Event('input', { bubbles: true });
      editor.dispatchEvent(event);
    }
  };

  // Handle editor mode change
  const handleEditorModeChange = (mode: 'visual' | 'html') => {
    if (mode === 'html' && editorMode === 'visual') {
      // Convert visual content to HTML
      const editor = document.getElementById('rich-editor');
      if (editor) {
        setFormData(prev => ({
          ...prev,
          content: editor.innerHTML
        }));
      }
    } else if (mode === 'visual' && editorMode === 'html') {
      // Convert HTML to visual format
      const editor = document.getElementById('rich-editor');
      if (editor) {
        const htmlContent = convertMarkdownToHtml(formData.content);
        editor.innerHTML = htmlContent;
      }
    }
    setEditorMode(mode);
  };

  // Convert Markdown to HTML
  const convertMarkdownToHtml = (markdown: string): string => {
    if (!markdown) return '<p></p>';
    
    let html = markdown;
    
    // Convert headings (must be done first)
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Convert bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic text
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert unordered lists
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // Convert ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    
    // Convert line breaks to paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // Wrap in paragraph if not already wrapped
    if (!html.startsWith('<')) {
      html = '<p>' + html + '</p>';
    }
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');
    
    // Clean up empty content
    if (html.trim() === '' || html.trim() === '<p></p>') {
      html = '<p></p>';
    }
    
    return html;
  };

  // Debug function to check content
  const debugContent = () => {
    console.log('Form Data Content:', formData.content);
    console.log('Editor Mode:', editorMode);
    const editor = document.getElementById('rich-editor');
    if (editor) {
      console.log('Editor InnerHTML:', editor.innerHTML);
    }
  };

  // Initialize editor content when switching to visual mode
  useEffect(() => {
    if (editorMode === 'visual') {
      const editor = document.getElementById('rich-editor');
      if (editor) {
        if (formData.content) {
          // Convert markdown to HTML if needed
          const htmlContent = convertMarkdownToHtml(formData.content);
          editor.innerHTML = htmlContent;
        } else {
          editor.innerHTML = '<p></p>';
        }
        // Focus the editor
        setTimeout(() => {
          editor.focus();
        }, 100);
      }
    }
  }, [editorMode]);

  // Update editor content when formData.content changes
  useEffect(() => {
    const editor = document.getElementById('rich-editor');
    if (editor) {
      if (editorMode === 'html') {
        // HTML mode - show raw content
        editor.innerHTML = formData.content || '<p></p>';
      } else if (editorMode === 'visual') {
        // Visual mode - convert markdown to HTML
        const htmlContent = convertMarkdownToHtml(formData.content);
        editor.innerHTML = htmlContent;
      }
    }
  }, [formData.content]);

  // Force update editor when modal opens
  useEffect(() => {
    if (isOpen && formData.content) {
      setTimeout(() => {
        const editor = document.getElementById('rich-editor');
        if (editor) {
          if (editorMode === 'visual') {
            const htmlContent = convertMarkdownToHtml(formData.content);
            editor.innerHTML = htmlContent;
          } else {
            editor.innerHTML = formData.content;
          }
        }
      }, 100);
    }
  }, [isOpen, formData.content, editorMode]);

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      read_time: calculateReadTime(content)
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      if (article) {
        // Update existing article
        console.log('Updating article:', formData);
        
        await articleService.updateArticle(article.id, formData);
        
        showSuccess(
          'تم التحديث بنجاح!',
          'تم تحديث المقال بنجاح وحفظ التغييرات في قاعدة البيانات.',
          4000
        );
      } else {
        // Create new article
        const newArticleData = {
          ...formData,
          author_id: '1', // TODO: Get from auth context
          published_at: formData.status === 'published' ? new Date().toISOString() : null
        };
        
        console.log('Creating article:', newArticleData);
        
        await articleService.createArticle(newArticleData);
        
        showSuccess(
          'تم الإنشاء بنجاح!',
          'تم إنشاء المقال الجديد بنجاح وحفظه في قاعدة البيانات.',
          4000
        );
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving article:', error);
      showError(
        'خطأ في الحفظ',
        'حدث خطأ أثناء حفظ المقال. يرجى المحاولة مرة أخرى أو التحقق من اتصال الإنترنت.',
        6000
      );
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement image upload
      console.log('Uploading image:', file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* خلفية */}
        <div
          className="fixed inset-0 transition-opacity modal-backdrop backdrop-blur-sm"
          onClick={onClose}
        />

        {/* المحتوى */}
        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-right align-middle transition-all transform modal-container rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {article ? t('admin.articles.editArticle') : t('admin.articles.createArticle')}
            </h2>
            <p className="text-slate-600 mt-1">
              {article ? t('admin.articles.editArticleDesc') : t('admin.articles.createArticleDesc')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                previewMode
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {previewMode ? t('admin.articles.editMode') : t('admin.articles.previewMode')}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {previewMode ? (
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                {/* Preview Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {categories.find(c => c.id === formData.category_id)?.name || t('admin.articles.noCategory')}
                    </span>
                    {formData.featured && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        {t('admin.articles.featured')}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                      {t(`admin.articles.${formData.status}`)}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-slate-800 mb-4">
                    {formData.title || t('admin.articles.noTitle')}
                  </h1>
                  <p className="text-xl text-slate-600 mb-6">
                    {formData.excerpt || t('admin.articles.noExcerpt')}
                  </p>
                  <div className="flex items-center gap-6 text-slate-500">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{t('admin.articles.author')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formData.read_time} {t('admin.articles.readTime')}</span>
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formData.content || t('admin.articles.noContent') }} />
                </div>

                {/* Preview Tags */}
                {formData.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Hash className="w-5 h-5 text-primary-600" />
                      {t('admin.articles.tags')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('admin.articles.title')} *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder={t('admin.articles.titlePlaceholder')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        errors.title ? 'border-red-300' : 'border-slate-300'
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('admin.articles.excerpt')} *
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      placeholder={t('admin.articles.excerptPlaceholder')}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none ${
                        errors.excerpt ? 'border-red-300' : 'border-slate-300'
                      }`}
                    />
                    {errors.excerpt && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700">
                        {t('admin.articles.content')} *
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditorModeChange('visual')}
                          className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            editorMode === 'visual'
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Type className="w-3 h-3 inline mr-1" />
                          مرئي
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditorModeChange('html')}
                          className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            editorMode === 'html'
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Hash className="w-3 h-3 inline mr-1" />
                          HTML
                        </button>
                      </div>
                    </div>

                    {editorMode === 'visual' ? (
                      <div className="border border-slate-300 rounded-lg overflow-hidden">
                        {/* Toolbar */}
                        <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1">
                          {/* Text Formatting */}
                          <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
                            <button
                              type="button"
                              onClick={() => formatText('bold')}
                              className="p-1 hover:bg-slate-200 rounded"
                              title="عريض"
                            >
                              <Bold className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => formatText('italic')}
                              className="p-1 hover:bg-slate-200 rounded"
                              title="مائل"
                            >
                              <Italic className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => formatText('underline')}
                              className="p-1 hover:bg-slate-200 rounded"
                              title="تحت خط"
                            >
                              <Underline className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Headings */}
                          <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
                            <button
                              type="button"
                              onClick={() => insertHeading(1)}
                              className="p-1 hover:bg-slate-200 rounded text-sm font-bold"
                              title="عنوان رئيسي"
                            >
                              H1
                            </button>
                            <button
                              type="button"
                              onClick={() => insertHeading(2)}
                              className="p-1 hover:bg-slate-200 rounded text-sm font-bold"
                              title="عنوان فرعي"
                            >
                              H2
                            </button>
                            <button
                              type="button"
                              onClick={() => insertHeading(3)}
                              className="p-1 hover:bg-slate-200 rounded text-sm font-bold"
                              title="عنوان صغير"
                            >
                              H3
                            </button>
                          </div>

                          {/* Lists */}
                          <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
                            <button
                              type="button"
                              onClick={() => insertList(false)}
                              className="p-1 hover:bg-slate-200 rounded"
                              title="قائمة نقطية"
                            >
                              <List className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertList(true)}
                              className="p-1 hover:bg-slate-200 rounded"
                              title="قائمة مرقمة"
                            >
                              <ListOrdered className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={insertQuote}
                              className="p-1 hover:bg-slate-200 rounded"
                              title="اقتباس"
                            >
                              <Quote className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Alignment */}
                          <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
                            <button
                              type="button"
                              onClick={() => alignText('Left')}
                              className="p-1 hover:bg-slate-200 rounded"
                              title="محاذاة لليسار"
                            >
                              <AlignLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => alignText('Center')}
                              className="p-1 hover:bg-slate-200 rounded"
                              title="محاذاة للوسط"
                            >
                              <AlignCenter className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => alignText('Right')}
                              className="p-1 hover:bg-slate-200 rounded"
                              title="محاذاة لليمين"
                            >
                              <AlignRight className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => alignText('Full')}
                              className="p-1 hover:bg-slate-200 rounded"
                              title="محاذاة كاملة"
                            >
                              <AlignJustify className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Links */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={insertLink}
                              className="p-1 hover:bg-slate-200 rounded"
                              title="إدراج رابط"
                            >
                              <Link className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Editor */}
                        <div
                          id="rich-editor"
                          contentEditable
                          onInput={(e) => {
                            const target = e.target as HTMLElement;
                            if (editorMode === 'visual') {
                              handleContentChange(target.innerHTML);
                            }
                          }}
                          onBlur={(e) => {
                            const target = e.target as HTMLElement;
                            if (editorMode === 'visual') {
                              handleContentChange(target.innerHTML);
                            }
                          }}
                          className="min-h-[300px] p-4 focus:outline-none rich-text-editor border border-slate-300 rounded-lg"
                          style={{ 
                            lineHeight: '1.6',
                            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                            minHeight: '300px'
                          }}
                          suppressContentEditableWarning={true}
                          data-placeholder="ابدأ كتابة محتوى المقال هنا..."
                        />
                        
                        {/* Debug Button - Remove in production */}
                        <button
                          type="button"
                          onClick={debugContent}
                          className="mt-2 px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                        >
                          Debug Content
                        </button>
                        
                        {/* Custom Styles for Rich Editor */}
                        <style dangerouslySetInnerHTML={{
                          __html: `
                            .rich-text-editor {
                              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                              line-height: 1.6 !important;
                              color: #374151 !important;
                            }
                            
                            .rich-text-editor h1 {
                              font-size: 2rem !important;
                              font-weight: bold !important;
                              margin: 1.5rem 0 1rem 0 !important;
                              color: #1f2937 !important;
                              border-bottom: 2px solid #e5e7eb !important;
                              padding-bottom: 0.5rem !important;
                              display: block !important;
                              line-height: 1.2 !important;
                              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                            }
                            
                            .rich-text-editor h2 {
                              font-size: 1.5rem !important;
                              font-weight: bold !important;
                              margin: 1.25rem 0 0.75rem 0 !important;
                              color: #374151 !important;
                              display: block !important;
                              line-height: 1.3 !important;
                              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                            }
                            
                            .rich-text-editor h3 {
                              font-size: 1.25rem !important;
                              font-weight: bold !important;
                              margin: 1rem 0 0.5rem 0 !important;
                              color: #4b5563 !important;
                              display: block !important;
                              line-height: 1.4 !important;
                              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                            }
                            
                            .rich-text-editor h4 {
                              font-size: 1.125rem !important;
                              font-weight: bold !important;
                              margin: 0.875rem 0 0.5rem 0 !important;
                              color: #6b7280 !important;
                              display: block !important;
                              line-height: 1.4 !important;
                              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                            }
                            
                            .rich-text-editor p {
                              margin: 0.75rem 0 !important;
                              color: #374151 !important;
                              line-height: 1.6 !important;
                              display: block !important;
                              font-size: 1rem !important;
                            }
                            
                            .rich-text-editor ul {
                              margin: 0.75rem 0 !important;
                              padding-right: 1.5rem !important;
                              color: #374151 !important;
                              display: block !important;
                              list-style-type: disc !important;
                              list-style-position: outside !important;
                            }
                            
                            .rich-text-editor ol {
                              margin: 0.75rem 0 !important;
                              padding-right: 1.5rem !important;
                              color: #374151 !important;
                              display: block !important;
                              list-style-type: decimal !important;
                              list-style-position: outside !important;
                            }
                            
                            .rich-text-editor li {
                              margin: 0.25rem 0 !important;
                              line-height: 1.6 !important;
                              display: list-item !important;
                              font-size: 1rem !important;
                              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                            }
                            
                            .rich-text-editor blockquote {
                              margin: 1rem 0 !important;
                              padding: 1rem !important;
                              background-color: #f9fafb !important;
                              border-right: 4px solid #3b82f6 !important;
                              font-style: italic !important;
                              color: #6b7280 !important;
                              display: block !important;
                              border-radius: 0.375rem !important;
                            }
                            
                            .rich-text-editor a {
                              color: #3b82f6 !important;
                              text-decoration: underline !important;
                            }
                            
                            .rich-text-editor a:hover {
                              color: #1d4ed8 !important;
                            }
                            
                            .rich-text-editor strong, .rich-text-editor b {
                              font-weight: bold !important;
                            }
                            
                            .rich-text-editor em, .rich-text-editor i {
                              font-style: italic !important;
                            }
                            
                            .rich-text-editor u {
                              text-decoration: underline !important;
                            }
                            
                            
                            .rich-text-editor * {
                              box-sizing: border-box !important;
                            }
                            
                            .rich-text-editor:focus {
                              outline: none !important;
                            }
                            
                            .rich-text-editor:empty:before {
                              content: attr(data-placeholder) !important;
                              color: #9ca3af !important;
                              font-style: italic !important;
                              pointer-events: none !important;
                            }
                            
                            .rich-text-editor:focus:empty:before {
                              content: attr(data-placeholder) !important;
                              color: #9ca3af !important;
                              font-style: italic !important;
                            }
                            
                          `
                        }} />
                      </div>
                    ) : (
                      <textarea
                        value={formData.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="ابدأ كتابة محتوى المقال هنا..."
                        rows={12}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none font-mono text-sm ${
                          errors.content ? 'border-red-300' : 'border-slate-300'
                        }`}
                      />
                    )}

                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.content}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      {t('admin.articles.contentHelp')}
                    </p>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Status and Featured */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      {t('admin.articles.publishSettings')}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          {t('admin.articles.status')}
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="draft">{t('admin.articles.draft')}</option>
                          <option value="published">{t('admin.articles.published')}</option>
                          <option value="archived">{t('admin.articles.archived')}</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) => handleInputChange('featured', e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                          {t('admin.articles.featured')}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      {t('admin.articles.category')}
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t('admin.articles.selectCategory')} *
                      </label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => handleInputChange('category_id', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.category_id ? 'border-red-300' : 'border-slate-300'
                        }`}
                      >
                        <option value="">{t('admin.articles.chooseCategory')}</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category_id && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.category_id}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      {t('admin.articles.tags')}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={t('admin.articles.addTag')}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          <Tag className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                            >
                              #{tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 text-primary-500 hover:text-primary-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Read Time */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      {t('admin.articles.readTime')}
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t('admin.articles.readTimeMinutes')}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={formData.read_time}
                        onChange={(e) => handleInputChange('read_time', parseInt(e.target.value) || 1)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.read_time ? 'border-red-300' : 'border-slate-300'
                        }`}
                      />
                      {errors.read_time && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.read_time}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-500">
                        {t('admin.articles.readTimeHelp')}
                      </p>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      {t('admin.articles.featuredImage')}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                        <Image className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600 mb-2">
                          {t('admin.articles.uploadImage')}
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          {t('admin.articles.chooseFile')}
                        </label>
                      </div>
                      
                      {formData.image_url && (
                        <div className="text-sm text-slate-600">
                          <p className="font-medium">{t('admin.articles.currentImage')}:</p>
                          <p className="truncate">{formData.image_url}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{t('admin.articles.autoSave')}</span>
            </div>
            <div className="text-sm text-slate-500">
              {formData.content.length} {t('admin.articles.characters')}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
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
                  {article ? t('common.update') : t('common.create')}
                </>
              )}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleFormModal;
