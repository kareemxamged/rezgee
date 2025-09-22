import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../ToastContainer';
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  StarOff,
  Archive,
  Calendar,
  User,
  Tag,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  ChevronDown,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { articleService } from '../../../services/articleService';
import type { ArticleWithDetails, ArticleCategory } from '../../../services/articleService';
import DeleteConfirmModal from '../../DeleteConfirmModal';
import ArticleFormModal from './ArticleFormModal';

interface ArticlesManagementProps {
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'latest' | 'oldest' | 'title' | 'views' | 'likes' | 'comments';
type StatusFilter = 'all' | 'published' | 'draft' | 'archived';
type LanguageFilter = 'all' | 'ar' | 'en';
type ArticleVersion = 'ar' | 'en';

const ArticlesManagement: React.FC<ArticlesManagementProps> = ({ className = '' }) => {
  const { t, i18n } = useTranslation();
  const { showSuccess, showError, showWarning } = useToast();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language as 'ar' | 'en';

  // State
  const [articles, setArticles] = useState<ArticleWithDetails[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedVersion, setSelectedVersion] = useState<ArticleVersion>('ar');
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Modals
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<ArticleWithDetails | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  // Load data
  const loadArticles = async () => {
    try {
      setLoading(true);
      const result = await articleService.getArticles({
        page: 1,
        limit: 1000, // Load all articles for admin
        language: selectedVersion,
        status: selectedStatus === 'all' ? undefined : selectedStatus as any,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined
      });

      // Apply sorting
      let sortedArticles = [...result.articles];
      switch (sortBy) {
        case 'oldest':
          sortedArticles.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          break;
        case 'title':
          sortedArticles.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'views':
          sortedArticles.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        case 'likes':
          sortedArticles.sort((a, b) => (b.likes || 0) - (a.likes || 0));
          break;
        case 'comments':
          sortedArticles.sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0));
          break;
        case 'latest':
        default:
          sortedArticles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
      }

      setArticles(sortedArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    loadArticles();
    loadCategories();
  }, [currentLanguage, selectedCategory, selectedStatus, searchQuery, sortBy, selectedVersion]);

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadArticles();
    setRefreshing(false);
  };

  const handleCreateArticle = () => {
    setArticleToEdit(null);
    setShowArticleForm(true);
  };

  const handleEditArticle = (article: ArticleWithDetails) => {
    setArticleToEdit(article);
    setShowArticleForm(true);
  };

  const handleDeleteArticle = (articleId: string) => {
    setArticleToDelete(articleId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;

    try {
      // TODO: Implement delete article function
      console.log('Deleting article:', articleToDelete);
      await loadArticles();
      setShowDeleteModal(false);
      setArticleToDelete(null);
      
      showSuccess(
        'تم الحذف بنجاح!',
        'تم حذف المقال بنجاح من قاعدة البيانات.',
        4000
      );
    } catch (error) {
      console.error('Error deleting article:', error);
      showError(
        'خطأ في الحذف',
        'حدث خطأ أثناء حذف المقال. يرجى المحاولة مرة أخرى.',
        5000
      );
    }
  };

  const handleToggleFeatured = async (article: ArticleWithDetails) => {
    try {
      // TODO: Implement toggle featured function
      console.log('Toggling featured for article:', article.id);
      await loadArticles();
      
      showSuccess(
        'تم التحديث بنجاح!',
        `تم ${article.featured ? 'إلغاء تمييز' : 'تمييز'} المقال بنجاح.`,
        3000
      );
    } catch (error) {
      console.error('Error toggling featured:', error);
      showError(
        'خطأ في التحديث',
        'حدث خطأ أثناء تحديث حالة التمييز. يرجى المحاولة مرة أخرى.',
        5000
      );
    }
  };

  const handleToggleStatus = async (article: ArticleWithDetails, newStatus: 'published' | 'draft' | 'archived') => {
    try {
      // TODO: Implement toggle status function
      console.log('Changing status for article:', article.id, 'to', newStatus);
      await loadArticles();
      
      const statusText = {
        published: 'نشر',
        draft: 'مسودة',
        archived: 'أرشفة'
      }[newStatus];
      
      showSuccess(
        'تم التحديث بنجاح!',
        `تم تغيير حالة المقال إلى "${statusText}" بنجاح.`,
        3000
      );
    } catch (error) {
      console.error('Error changing status:', error);
      showError(
        'خطأ في التحديث',
        'حدث خطأ أثناء تغيير حالة المقال. يرجى المحاولة مرة أخرى.',
        5000
      );
    }
  };

  const handleSelectArticle = (articleId: string) => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(articleId)) {
      newSelected.delete(articleId);
    } else {
      newSelected.add(articleId);
    }
    setSelectedArticles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedArticles.size === articles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(articles.map(a => a.id)));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedArticles.size === 0) return;

    try {
      // TODO: Implement bulk actions
      console.log('Bulk action:', action, 'on articles:', Array.from(selectedArticles));
      setSelectedArticles(new Set());
      setShowBulkActions(false);
      await loadArticles();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'draft':
        return <AlertCircle className="w-4 h-4" />;
      case 'archived':
        return <Archive className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredArticles = articles.filter(article => {
    if (selectedLanguage !== 'all' && article.language !== selectedLanguage) {
      return false;
    }
    return true;
  });

  return (
    <div className={`articles-management ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {t('admin.articles.title')} - {selectedVersion === 'ar' ? 'العربية' : 'English'}
            </h1>
            <p className="text-slate-600 mt-1">
              {t('admin.articles.subtitle')} ({filteredArticles.length})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateArticle}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('admin.articles.create')}
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('admin.articles.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {t('admin.articles.filters')}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Language Version Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">
              {t('admin.articles.version')}:
            </span>
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedVersion('ar')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedVersion === 'ar' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setSelectedVersion('en')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedVersion === 'en' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('admin.articles.category')}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">{t('admin.articles.allCategories')}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('admin.articles.status')}
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as StatusFilter)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">{t('admin.articles.allStatuses')}</option>
                  <option value="published">{t('admin.articles.published')}</option>
                  <option value="draft">{t('admin.articles.draft')}</option>
                  <option value="archived">{t('admin.articles.archived')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('admin.articles.language')}
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as LanguageFilter)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">{t('admin.articles.allLanguages')}</option>
                  <option value="ar">{t('admin.articles.arabic')}</option>
                  <option value="en">{t('admin.articles.english')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('admin.articles.sortBy')}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="latest">{t('admin.articles.latest')}</option>
                  <option value="oldest">{t('admin.articles.oldest')}</option>
                  <option value="title">{t('admin.articles.title')}</option>
                  <option value="views">{t('admin.articles.views')}</option>
                  <option value="likes">{t('admin.articles.likes')}</option>
                  <option value="comments">{t('admin.articles.comments')}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedArticles.size > 0 && (
        <div className="bg-primary-50 border-b border-primary-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-primary-800">
                {selectedArticles.size} {t('admin.articles.selected')}
              </span>
              <button
                onClick={() => setSelectedArticles(new Set())}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                {t('admin.articles.clearSelection')}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                className="px-3 py-1 text-sm border border-primary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{t('admin.articles.bulkActions')}</option>
                <option value="publish">{t('admin.articles.publish')}</option>
                <option value="draft">{t('admin.articles.moveToDraft')}</option>
                <option value="archive">{t('admin.articles.archive')}</option>
                <option value="delete">{t('admin.articles.delete')}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-600">{t('admin.articles.loading')}</p>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              {t('admin.articles.noArticles')}
            </h3>
            <p className="text-slate-500 mb-6">
              {t('admin.articles.noArticlesDesc')}
            </p>
            <button
              onClick={handleCreateArticle}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              {t('admin.articles.createFirst')}
            </button>
          </div>
          </div>
        ) : (
          <div className="p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    isSelected={selectedArticles.has(article.id)}
                    onSelect={() => handleSelectArticle(article.id)}
                    onEdit={() => handleEditArticle(article)}
                    onDelete={() => handleDeleteArticle(article.id)}
                    onToggleFeatured={() => handleToggleFeatured(article)}
                    onToggleStatus={handleToggleStatus}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <ArticleListItem
                    key={article.id}
                    article={article}
                    isSelected={selectedArticles.has(article.id)}
                    onSelect={() => handleSelectArticle(article.id)}
                    onEdit={() => handleEditArticle(article)}
                    onDelete={() => handleDeleteArticle(article.id)}
                    onToggleFeatured={() => handleToggleFeatured(article)}
                    onToggleStatus={handleToggleStatus}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showArticleForm && (
        <ArticleFormModal
          isOpen={showArticleForm}
          onClose={() => setShowArticleForm(false)}
          article={articleToEdit}
          onSave={() => {
            setShowArticleForm(false);
            loadArticles();
          }}
        />
      )}


      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title={t('admin.articles.deleteArticle')}
          message={t('admin.articles.deleteArticleConfirm')}
          itemType="article"
        />
      )}
    </div>
  );
};

// Article Card Component
interface ArticleCardProps {
  article: ArticleWithDetails;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onToggleStatus: (article: ArticleWithDetails, status: 'published' | 'draft' | 'archived') => void;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleStatus,
  formatDate,
  getStatusColor,
  getStatusIcon
}) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-white rounded-lg border-2 transition-all duration-200 ${
      isSelected ? 'border-primary-500 shadow-lg' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
    }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
            />
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
              {getStatusIcon(article.status)}
              {t(`admin.articles.${article.status}`)}
            </div>
            {article.featured && (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                <Star className="w-3 h-3" />
                {t('admin.articles.featured')}
              </div>
            )}
          </div>
          <div className="relative">
            <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <User className="w-3 h-3" />
            <span>{article.author.name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(article.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Tag className="w-3 h-3" />
            <span>{article.category.name}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{article.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{article.comments_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{article.read_time}min</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
              title={t('admin.articles.edit')}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleFeatured}
              className={`p-1 transition-colors ${
                article.featured ? 'text-amber-500 hover:text-amber-600' : 'text-slate-400 hover:text-amber-500'
              }`}
              title={article.featured ? t('admin.articles.unfeature') : t('admin.articles.feature')}
            >
              {article.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
              title={t('admin.articles.delete')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            {article.status === 'published' ? (
              <button
                onClick={() => onToggleStatus(article, 'draft')}
                className="text-xs px-2 py-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
              >
                {t('admin.articles.draft')}
              </button>
            ) : (
              <button
                onClick={() => onToggleStatus(article, 'published')}
                className="text-xs px-2 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
              >
                {t('admin.articles.publish')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Article List Item Component
interface ArticleListItemProps {
  article: ArticleWithDetails;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onToggleStatus: (article: ArticleWithDetails, status: 'published' | 'draft' | 'archived') => void;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

const ArticleListItem: React.FC<ArticleListItemProps> = ({
  article,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleStatus,
  formatDate,
  getStatusColor,
  getStatusIcon
}) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-white rounded-lg border-2 transition-all duration-200 ${
      isSelected ? 'border-primary-500 shadow-lg' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
    }`}>
      <div className="p-4">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-slate-800 line-clamp-1">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 ml-4">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                  {getStatusIcon(article.status)}
                  {t(`admin.articles.${article.status}`)}
                </div>
                {article.featured && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3" />
                    {t('admin.articles.featured')}
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {article.excerpt}
            </p>
            
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{article.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(article.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>{article.category.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{article.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{article.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{article.comments_count}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
              title={t('admin.articles.edit')}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleFeatured}
              className={`p-2 transition-colors ${
                article.featured ? 'text-amber-500 hover:text-amber-600' : 'text-slate-400 hover:text-amber-500'
              }`}
              title={article.featured ? t('admin.articles.unfeature') : t('admin.articles.feature')}
            >
              {article.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              title={t('admin.articles.delete')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesManagement;
