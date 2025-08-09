import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminProvider } from '../../contexts/AdminContext';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminRoute from '../AdminRoute';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setIsMobile] = useState(false);

  // تحديد حجم الشاشة
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <AdminProvider>
      <AdminRoute>
        <div className="min-h-screen bg-slate-50 flex" dir="rtl">
          {/* الشريط الجانبي */}
          <AdminSidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar}
          />

          {/* المحتوى الرئيسي */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* الهيدر */}
            <AdminHeader 
              onMenuToggle={toggleSidebar}
              isSidebarOpen={sidebarOpen}
            />

            {/* المحتوى */}
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </AdminRoute>
    </AdminProvider>
  );
};

export default AdminLayout;
