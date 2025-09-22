import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageCircle,
  User,
  Calendar,
  Heart,
  Reply,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronDown,
  MoreHorizontal,
  Flag,
  Shield,
  Ban
} from 'lucide-react';
import { articleService } from '../../../services/articleService';
import type { ArticleComment } from '../../../services/articleService';

interface CommentsModerationProps {
  className?: string;
}

type CommentFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'reported';
type SortBy = 'latest' | 'oldest' | 'most_liked' | 'most_reported';

const CommentsModeration: React.FC<CommentsModerationProps> = ({
  className
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language as 'ar' | 'en';

  // State
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<CommentFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Load comments
  const loadComments = async () => {
    try {
      setLoading(true);
      // TODO: Implement load all comments function
      // For now, we'll use a mock approach
      const mockComments: ArticleComment[] = [
        {
          id: '1',
          article_id: 'article-1',
          user_id: 'user-1',
          content: 'هذا تعليق رائع ومفيد جداً، شكراً لكم على هذا المحتوى المميز.',
          likes: 5,
          created_at: new Date().toISOString(),
          is_approved: true,
          is_deleted: false,
          user: {
            id: 'user-1',
            first_name: 'أحمد',
            last_name: 'محمد',
            profile_image_url: null,
            verified: true
          },
          replies: []
        },
        {
          id: '2',
          article_id: 'article-1',
          user_id: 'user-2',
          content: 'أعتقد أن هذا المقال يحتاج إلى مزيد من التفصيل في بعض النقاط.',
          likes: 2,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_approved: false,
          is_deleted: false,
          user: {
            id: 'user-2',
            first_name: 'فاطمة',
            last_name: 'علي',
            profile_image_url: null,
            verified: false
          },
          replies: []
        }
      ];
      setComments(mockComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadComments();
    setRefreshing(false);
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      // TODO: Implement approve comment function
      console.log('Approving comment:', commentId);
      await loadComments();
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const handleRejectComment = async (commentId: string) => {
    try {
      // TODO: Implement reject comment function
      console.log('Rejecting comment:', commentId);
      await loadComments();
    } catch (error) {
      console.error('Error rejecting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm(t('admin.comments.deleteConfirm'))) {
      return;
    }

    try {
      // TODO: Implement delete comment function
      console.log('Deleting comment:', commentId);
      await loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleSelectComment = (commentId: string) => {
    const newSelected = new Set(selectedComments);
    if (newSelected.has(commentId)) {
      newSelected.delete(commentId);
    } else {
      newSelected.add(commentId);
    }
    setSelectedComments(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedComments.size === filteredComments.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(filteredComments.map(c => c.id)));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedComments.size === 0) return;

    try {
      // TODO: Implement bulk actions
      console.log('Bulk action:', action, 'on comments:', Array.from(selectedComments));
      setSelectedComments(new Set());
      setShowBulkActions(false);
      await loadComments();
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

  const getStatusColor = (isApproved: boolean, isDeleted: boolean) => {
    if (isDeleted) return 'bg-red-100 text-red-800';
    if (isApproved) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusIcon = (isApproved: boolean, isDeleted: boolean) => {
    if (isDeleted) return <XCircle className="w-4 h-4" />;
    if (isApproved) return <CheckCircle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getStatusText = (isApproved: boolean, isDeleted: boolean) => {
    if (isDeleted) return t('admin.comments.deleted');
    if (isApproved) return t('admin.comments.approved');
    return t('admin.comments.pending');
  };

  // Filter comments
  const filteredComments = comments.filter(comment => {
    // Search filter
    if (searchQuery && !comment.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    switch (selectedFilter) {
      case 'pending':
        return !comment.is_approved && !comment.is_deleted;
      case 'approved':
        return comment.is_approved && !comment.is_deleted;
      case 'rejected':
        return !comment.is_approved && !comment.is_deleted;
      case 'reported':
        // TODO: Add reported status
        return false;
      case 'all':
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {t('admin.comments.title')}
          </h2>
          <p className="text-slate-600 mt-1">
            {t('admin.comments.subtitle')} ({filteredComments.length})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
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
                placeholder={t('admin.comments.searchPlaceholder')}
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
              {t('admin.comments.filters')}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedComments(new Set())}
              className="text-sm text-slate-600 hover:text-slate-800"
            >
              {t('admin.comments.clearSelection')}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('admin.comments.status')}
                </label>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value as CommentFilter)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">{t('admin.comments.allStatuses')}</option>
                      <option value="pending">{t('admin.comments.pending')}</option>
                      <option value="approved">{t('admin.comments.approved')}</option>
                      <option value="rejected">{t('admin.comments.rejected')}</option>
                      <option value="reported">{t('admin.comments.reported')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('admin.comments.sortBy')}
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="latest">{t('admin.comments.latest')}</option>
                      <option value="oldest">{t('admin.comments.oldest')}</option>
                      <option value="most_liked">{t('admin.comments.mostLiked')}</option>
                      <option value="most_reported">{t('admin.comments.mostReported')}</option>
                    </select>
                  </div>
                </div>
              </div>
          )}
        </div>

      {/* Bulk Actions */}
      {selectedComments.size > 0 && (
        <div className="bg-primary-50 border-b border-primary-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-primary-800">
                {selectedComments.size} {t('admin.comments.selected')}
              </span>
              <button
                onClick={() => setSelectedComments(new Set())}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                {t('admin.comments.clearSelection')}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                className="px-3 py-1 text-sm border border-primary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{t('admin.comments.bulkActions')}</option>
                <option value="approve">{t('admin.comments.approve')}</option>
                <option value="reject">{t('admin.comments.reject')}</option>
                <option value="delete">{t('admin.comments.delete')}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-600">{t('admin.comments.loading')}</p>
            </div>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                {t('admin.comments.noComments')}
              </h3>
              <p className="text-slate-500">
                {t('admin.comments.noCommentsDesc')}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {filteredComments.map((comment) => (
              <CommentModerationItem
                key={comment.id}
                comment={comment}
                isSelected={selectedComments.has(comment.id)}
                onSelect={() => handleSelectComment(comment.id)}
                onApprove={() => handleApproveComment(comment.id)}
                onReject={() => handleRejectComment(comment.id)}
                onDelete={() => handleDeleteComment(comment.id)}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                getStatusText={getStatusText}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Comment Moderation Item Component
interface CommentModerationItemProps {
  comment: ArticleComment;
  isSelected: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  formatDate: (date: string) => string;
  getStatusColor: (isApproved: boolean, isDeleted: boolean) => string;
  getStatusIcon: (isApproved: boolean, isDeleted: boolean) => React.ReactNode;
  getStatusText: (isApproved: boolean, isDeleted: boolean) => string;
}

const CommentModerationItem: React.FC<CommentModerationItemProps> = ({
  comment,
  isSelected,
  onSelect,
  onApprove,
  onReject,
  onDelete,
  formatDate,
  getStatusColor,
  getStatusIcon,
  getStatusText
}) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-white border-2 rounded-lg p-4 transition-all duration-200 ${
      isSelected ? 'border-primary-500 shadow-lg' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
    }`}>
      <div className="flex gap-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 mt-1"
        />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-emerald-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-800">
                    {comment.user?.first_name} {comment.user?.last_name}
                  </h4>
                  {comment.user?.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-500">
                  {formatDate(comment.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comment.is_approved || false, comment.is_deleted || false)}`}>
                {getStatusIcon(comment.is_approved || false, comment.is_deleted || false)}
                {getStatusText(comment.is_approved || false, comment.is_deleted || false)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="text-slate-700 leading-relaxed">
              {comment.content}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{comment.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Reply className="w-4 h-4" />
              <span>{comment.replies?.length || 0}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {!comment.is_approved && !comment.is_deleted && (
                <>
                  <button
                    onClick={onApprove}
                    className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t('admin.comments.approve')}
                  </button>
                  <button
                    onClick={onReject}
                    className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    {t('admin.comments.reject')}
                  </button>
                </>
              )}
              
              <button
                onClick={onDelete}
                className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                {t('admin.comments.delete')}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModeration;
