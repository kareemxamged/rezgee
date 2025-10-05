import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageTestComponent: React.FC = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="font-bold text-sm mb-2">Language Test Info</h3>
      <div className="text-xs space-y-1">
        <div><strong>Current URL:</strong> {location.pathname}</div>
        <div><strong>Current Language:</strong> {i18n.language}</div>
        <div><strong>Document Lang:</strong> {document.documentElement.lang}</div>
        <div><strong>Document Dir:</strong> {document.documentElement.dir}</div>
        <div><strong>Page Title:</strong> {document.title}</div>
      </div>
    </div>
  );
};

export default LanguageTestComponent;
