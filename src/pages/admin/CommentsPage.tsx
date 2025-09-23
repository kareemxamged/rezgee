import React from 'react';
import { useTranslation } from 'react-i18next';
import CommentsModeration from '../../components/admin/articles/CommentsModeration';
import ModernAdminContainer from '../../components/admin/ModernAdminContainer';

const CommentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [showCommentsModeration, setShowCommentsModeration] = React.useState(true);

  return (
    <ModernAdminContainer
      title={t('admin.comments.title')}
      subtitle={t('admin.comments.subtitle')}
      breadcrumbs={[
        { label: t('admin.dashboard'), path: '/admin' },
        { label: t('admin.content'), path: '/admin/content' },
        { label: t('admin.comments.title'), path: '/admin/comments' }
      ]}
    >
      <CommentsModeration
        isOpen={showCommentsModeration}
        onClose={() => setShowCommentsModeration(false)}
      />
    </ModernAdminContainer>
  );
};

export default CommentsPage;




