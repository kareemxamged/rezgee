import React from 'react';
import { useTranslation } from 'react-i18next';
import ArticlesManagement from '../../components/admin/articles/ArticlesManagement';
import ModernAdminContainer from '../../components/admin/ModernAdminContainer';

const ArticlesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ModernAdminContainer
      title={t('admin.articles.title')}
      subtitle={t('admin.articles.subtitle')}
      breadcrumbs={[
        { label: t('admin.dashboard'), path: '/admin' },
        { label: t('admin.content'), path: '/admin/content' },
        { label: t('admin.articles.title'), path: '/admin/articles' }
      ]}
    >
      <ArticlesManagement />
    </ModernAdminContainer>
  );
};

export default ArticlesPage;




