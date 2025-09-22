import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Palette,
  MessageSquare,
  BarChart3,
  BookOpen,
  Tag,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import ModernAdminContainer from '../../components/admin/ModernAdminContainer';
import ArticlesManagement from '../../components/admin/articles/ArticlesManagement';
import CategoryManagement from '../../components/admin/articles/CategoryManagement';
import CommentsModeration from '../../components/admin/articles/CommentsModeration';
import ArticlesAnalytics from '../../components/admin/articles/ArticlesAnalytics';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
  permission?: string;
}

const ContentManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('articles');

  const tabs: Tab[] = [
    {
      id: 'articles',
      label: t('admin.articles.title'),
      icon: <BookOpen className="w-5 h-5" />,
      component: ArticlesManagement,
      permission: 'view_articles'
    },
    {
      id: 'categories',
      label: t('admin.categories.title'),
      icon: <Palette className="w-5 h-5" />,
      component: CategoryManagement,
      permission: 'manage_categories'
    },
    {
      id: 'comments',
      label: t('admin.comments.title'),
      icon: <MessageCircle className="w-5 h-5" />,
      component: CommentsModeration,
      permission: 'moderate_comments'
    },
    {
      id: 'analytics',
      label: t('admin.analytics.title'),
      icon: <TrendingUp className="w-5 h-5" />,
      component: ArticlesAnalytics,
      permission: 'view_analytics'
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <ModernAdminContainer maxWidth="full" padding="none">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {t('admin.content.title')}
                  </h1>
                  <p className="text-gray-600">
                    {t('admin.content.subtitle')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <nav className="flex space-x-8 rtl:space-x-reverse" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span className={`mr-2 rtl:ml-2 rtl:mr-0 ${
                    activeTab === tab.id ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </ModernAdminContainer>
  );
};

export default ContentManagementPage;
