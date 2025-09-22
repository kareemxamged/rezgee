import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  User,
  Tag,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Download,
  Filter,
  ChevronDown
} from 'lucide-react';
import { articleService } from '../../../services/articleService';
import type { ArticleWithDetails, ArticleCategory } from '../../../services/articleService';

interface ArticlesAnalyticsProps {
  className?: string;
}

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
type ChartType = 'line' | 'bar' | 'pie';

interface AnalyticsData {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  archivedArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageReadTime: number;
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  topArticles: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    article: string;
    user: string;
    timestamp: string;
  }>;
  viewsOverTime: Array<{
    date: string;
    views: number;
    articles: number;
  }>;
  engagementRate: number;
  averageEngagement: number;
}

const ArticlesAnalytics: React.FC<ArticlesAnalyticsProps> = ({
  className
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language as 'ar' | 'en';

  // State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<ArticleCategory[]>([]);

  // Load analytics data
  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load articles and categories
      const [articlesResult, categoriesData] = await Promise.all([
        articleService.getArticles({
          page: 1,
          limit: 1000,
          language: currentLanguage
        }),
        articleService.getCategories(currentLanguage)
      ]);

      setCategories(categoriesData);

      // Calculate analytics data
      const articles = articlesResult.articles;
      const totalArticles = articles.length;
      const publishedArticles = articles.filter(a => a.status === 'published').length;
      const draftArticles = articles.filter(a => a.status === 'draft').length;
      const archivedArticles = articles.filter(a => a.status === 'archived').length;
      
      const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
      const totalLikes = articles.reduce((sum, a) => sum + (a.likes || 0), 0);
      const totalComments = articles.reduce((sum, a) => sum + (a.comments_count || 0), 0);
      const averageReadTime = articles.reduce((sum, a) => sum + (a.read_time || 0), 0) / totalArticles || 0;

      // Top categories
      const categoryCounts = new Map<string, number>();
      articles.forEach(article => {
        const categoryName = article.category.name;
        categoryCounts.set(categoryName, (categoryCounts.get(categoryName) || 0) + 1);
      });

      const topCategories = Array.from(categoryCounts.entries())
        .map(([category, count]) => ({
          category,
          count,
          percentage: (count / totalArticles) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Top articles
      const topArticles = articles
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 10)
        .map(article => ({
          id: article.id,
          title: article.title,
          views: article.views || 0,
          likes: article.likes || 0,
          comments: article.comments_count || 0
        }));

      // Mock recent activity
      const recentActivity = [
        {
          id: '1',
          action: 'created',
          article: 'نصائح للزواج السعيد',
          user: 'أحمد محمد',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          action: 'published',
          article: 'الإرشاد الإسلامي في الزواج',
          user: 'فاطمة علي',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      // Mock views over time (last 30 days)
      const viewsOverTime = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toISOString().split('T')[0],
          views: Math.floor(Math.random() * 100) + 50,
          articles: Math.floor(Math.random() * 5) + 1
        };
      });

      const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;
      const averageEngagement = totalArticles > 0 ? (totalLikes + totalComments) / totalArticles : 0;

      setAnalyticsData({
        totalArticles,
        publishedArticles,
        draftArticles,
        archivedArticles,
        totalViews,
        totalLikes,
        totalComments,
        averageReadTime,
        topCategories,
        topArticles,
        recentActivity,
        viewsOverTime,
        engagementRate,
        averageEngagement
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [currentLanguage, timeRange, selectedCategory]);

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    console.log('Exporting analytics data...');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    return num.toFixed(1) + '%';
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {t('admin.analytics.title')}
            </h2>
            <p className="text-slate-600 mt-1">
              {t('admin.analytics.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              {t('admin.analytics.export')}
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('admin.analytics.timeRange')}
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="7d">{t('admin.analytics.last7Days')}</option>
                  <option value="30d">{t('admin.analytics.last30Days')}</option>
                  <option value="90d">{t('admin.analytics.last90Days')}</option>
                  <option value="1y">{t('admin.analytics.lastYear')}</option>
                  <option value="all">{t('admin.analytics.allTime')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('admin.analytics.category')}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">{t('admin.analytics.allCategories')}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('admin.analytics.chartType')}
                </label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as ChartType)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="line">{t('admin.analytics.lineChart')}</option>
                  <option value="bar">{t('admin.analytics.barChart')}</option>
                  <option value="pie">{t('admin.analytics.pieChart')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
                <p className="text-slate-600">{t('admin.analytics.loading')}</p>
              </div>
            </div>
          ) : analyticsData ? (
            <div className="p-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{t('admin.analytics.totalArticles')}</p>
                      <p className="text-3xl font-bold text-slate-900">{analyticsData.totalArticles}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium">
                      {analyticsData.publishedArticles} {t('admin.analytics.published')}
                    </span>
                    <span className="text-slate-500 mx-2">•</span>
                    <span className="text-slate-500">
                      {analyticsData.draftArticles} {t('admin.analytics.draft')}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{t('admin.analytics.totalViews')}</p>
                      <p className="text-3xl font-bold text-slate-900">{formatNumber(analyticsData.totalViews)}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+12%</span>
                    <span className="text-slate-500 ml-2">{t('admin.analytics.fromLastMonth')}</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{t('admin.analytics.totalLikes')}</p>
                      <p className="text-3xl font-bold text-slate-900">{formatNumber(analyticsData.totalLikes)}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-rose-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+8%</span>
                    <span className="text-slate-500 ml-2">{t('admin.analytics.fromLastMonth')}</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{t('admin.analytics.engagementRate')}</p>
                      <p className="text-3xl font-bold text-slate-900">{formatPercentage(analyticsData.engagementRate)}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-slate-500">
                      {formatNumber(analyticsData.averageEngagement)} {t('admin.analytics.avgPerArticle')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Charts and Detailed Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top Categories */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary-600" />
                    {t('admin.analytics.topCategories')}
                  </h3>
                  <div className="space-y-3">
                    {analyticsData.topCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <span className="font-medium text-slate-800">{category.category}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-600 w-12 text-right">
                            {category.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Articles */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary-600" />
                    {t('admin.analytics.topArticles')}
                  </h3>
                  <div className="space-y-3">
                    {analyticsData.topArticles.slice(0, 5).map((article, index) => (
                      <div key={article.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-800 truncate">{article.title}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {formatNumber(article.views)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {formatNumber(article.likes)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {formatNumber(article.comments)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-600" />
                  {t('admin.analytics.recentActivity')}
                </h3>
                <div className="space-y-3">
                  {analyticsData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          {activity.user} {t(`admin.analytics.${activity.action}`)} "{activity.article}"
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">
                  {t('admin.analytics.noData')}
                </h3>
                <p className="text-slate-500">
                  {t('admin.analytics.noDataDesc')}
                </p>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default ArticlesAnalytics;
