import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { adminAuthService } from '../lib/adminAuthService';
import { separateAdminAuth } from '../lib/separateAdminAuth';
import type { AdminUser, AdminPermission } from '../lib/adminAuthService';

interface AdminContextType {
  // حالة المشرف
  adminUser: AdminUser | null;
  isAdminLoading: boolean;
  isAdmin: boolean;
  
  // الصلاحيات
  permissions: AdminPermission[];
  hasPermission: (permissionCode: string) => boolean;
  
  // الجلسة
  sessionValid: boolean;
  
  // الأخطاء
  error: string | null;
  
  // الدوال
  refreshAdminData: () => Promise<void>;
  logout: () => Promise<void>;
  logActivity: (action: string, resourceType: string, resourceId?: string, details?: any) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // تحديث بيانات المشرف
  const refreshAdminData = async () => {
    try {
      setIsAdminLoading(true);
      setError(null);

      // التحقق من صحة الجلسة الإدارية المنفصلة
      const isValid = await separateAdminAuth.validateSession();
      const account = separateAdminAuth.getCurrentAccount();
      
      if (!isValid || !account) {
        setAdminUser(null);
        setPermissions([]);
        setIsAdmin(false);
        setSessionValid(false);
        setIsAuthenticated(false);
        setIsAdminLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setIsAdmin(true);
      setSessionValid(true);

      // تحويل بيانات المشرف إلى تنسيق AdminUser
      const adminUserData: AdminUser = {
        id: account.id,
        username: account.username,
        email: account.email,
        firstName: account.first_name,
        lastName: account.last_name,
        isSuperAdmin: account.is_super_admin,
        roleId: account.role_id,
        isActive: account.is_active,
        createdAt: account.created_at,
        lastLoginAt: account.last_login_at
      };
      
      setAdminUser(adminUserData);

      // الحصول على الصلاحيات
      const userPermissions = await adminAuthService.getAdminPermissions(adminUserData.id);
      setPermissions(userPermissions);

    } catch (err) {
      console.error('Error refreshing admin data:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل بيانات المشرف');
      setAdminUser(null);
      setPermissions([]);
      setIsAdmin(false);
      setSessionValid(false);
    } finally {
      setIsAdminLoading(false);
    }
  };

  // التحقق من صلاحية معينة
  const hasPermission = (permissionCode: string): boolean => {
    // التحقق من النظام الجديد أولاً
    const currentAdminAccount = separateAdminAuth.getCurrentAccount();
    if (currentAdminAccount) {
      // إذا كان سوبر أدمن في النظام الجديد، أعطه جميع الصلاحيات
      if (currentAdminAccount.is_super_admin) {
        return true;
      }
      // يمكن إضافة منطق صلاحيات أكثر تفصيلاً هنا لاحقاً
      return true; // مؤقتاً، أعطي جميع الصلاحيات للمشرفين المسجلين
    }

    // النظام القديم كـ fallback
    if (!adminUser) return false;
    if (adminUser.is_super_admin) return true;
    return permissions.some(permission => permission.code === permissionCode);
  };

  // تسجيل الخروج
  const logout = async () => {
    try {
      await separateAdminAuth.logout();
      setAdminUser(null);
      setPermissions([]);
      setIsAdmin(false);
      setSessionValid(false);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      console.error('Error during admin logout:', err);
    }
  };

  // تسجيل نشاط
  const logActivity = async (
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: any
  ) => {
    try {
      await adminAuthService.logActivity(action, resourceType, resourceId, details);
    } catch (err) {
      console.error('Error logging admin activity:', err);
    }
  };

  // تحديث البيانات عند تحميل المكون
  useEffect(() => {
    refreshAdminData();
  }, []);

  // التحقق من صحة الجلسة دورياً
  useEffect(() => {
    if (!isAdmin || !adminUser) return;

    const checkSession = async () => {
      try {
        const isValid = await adminAuthService.validateAdminSession();
        setSessionValid(isValid);
        
        if (!isValid) {
          // إعادة إنشاء الجلسة
          await adminAuthService.createAdminSession(adminUser.id);
          setSessionValid(true);
        }
      } catch (err) {
        console.error('Error checking session validity:', err);
        setSessionValid(false);
      }
    };

    // فحص الجلسة كل 5 دقائق
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAdmin, adminUser]);

  const value: AdminContextType = {
    adminUser,
    isAdminLoading,
    isAdmin,
    permissions,
    hasPermission,
    sessionValid,
    error,
    refreshAdminData,
    logout,
    logActivity
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Hook لاستخدام AdminContext
export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Hook للتحقق من صلاحية معينة
export const useAdminPermission = (permissionCode: string): boolean => {
  const { hasPermission } = useAdmin();
  return hasPermission(permissionCode);
};

// Hook للتحقق من كون المستخدم super admin
export const useIsSuperAdmin = (): boolean => {
  const { adminUser } = useAdmin();
  return adminUser?.is_super_admin || false;
};

export default AdminContext;
