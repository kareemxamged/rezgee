import React from 'react';
import { useTranslation } from 'react-i18next';
import ArticlesAnalytics from '../../components/admin/articles/ArticlesAnalytics';
import ModernAdminContainer from '../../components/admin/ModernAdminContainer';

const ContentAnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [showAnalytics, setShowAnalytics] = React.useState(true);

  return (
    <ModernAdminContainer
      title={t('admin.analytics.title')}
      subtitle={t('admin.analytics.subtitle')}
      breadcrumbs={[
        { label: t('admin.dashboard'), path: '/admin' },
        { label: t('admin.content'), path: '/admin/content' },
        { label: t('admin.analytics.title'), path: '/admin/content-analytics' }
      ]}
    >
      <ArticlesAnalytics
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />
    </ModernAdminContainer>
  );
};

export default ContentAnalyticsPage;


