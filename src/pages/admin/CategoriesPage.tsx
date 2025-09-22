import React from 'react';
import { useTranslation } from 'react-i18next';
import CategoryManagement from '../../components/admin/articles/CategoryManagement';
import ModernAdminContainer from '../../components/admin/ModernAdminContainer';

const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const [showCategoryManagement, setShowCategoryManagement] = React.useState(true);

  return (
    <ModernAdminContainer
      title={t('admin.categories.title')}
      subtitle={t('admin.categories.subtitle')}
      breadcrumbs={[
        { label: t('admin.dashboard'), path: '/admin' },
        { label: t('admin.content'), path: '/admin/content' },
        { label: t('admin.categories.title'), path: '/admin/categories' }
      ]}
    >
      <CategoryManagement
        isOpen={showCategoryManagement}
        onClose={() => setShowCategoryManagement(false)}
        onSave={() => {
          // يمكن إضافة منطق الحفظ هنا
          console.log('Categories saved');
        }}
      />
    </ModernAdminContainer>
  );
};

export default CategoriesPage;


