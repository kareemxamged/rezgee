import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, authService } from '../lib/supabase';
import type { User as AppUser } from '../lib/supabase';

interface AuthContextType {
  // حالة المصادقة
  user: User | null;
  userProfile: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // وظائف المصادقة
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: Partial<AppUser>) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  
  // وظائف الملف الشخصي
  updateProfile: (updates: Partial<AppUser>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  
  // وظائف إضافية
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // تحديد ما إذا كان المستخدم مصادق عليه
  const isAuthenticated = !!user && !!userProfile;

  // تحميل بيانات المستخدم من الجلسة المحفوظة
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // التحقق من الجلسة الحالية
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // الاستماع لتغييرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // تحميل بيانات الملف الشخصي
  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // إذا كان المستخدم غير موجود في جدول users، لا نعرض خطأ
        if (error.code === 'PGRST116') {
          console.log('User profile not found in users table');
          setUserProfile(null);
          return;
        }
        console.error('Error loading user profile:', error);
        return;
      }

      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // تسجيل الدخول
  const signIn = async (email: string, password: string, rememberMe = false): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const { error } = await authService.signIn(email, password);

      if (error) {
        return { success: false, error: (error as any).message || 'حدث خطأ' };
      }

      // حفظ تفضيل "تذكرني" في localStorage
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'حدث خطأ أثناء تسجيل الدخول' };
    } finally {
      setIsLoading(false);
    }
  };

  // إنشاء حساب جديد
  const signUp = async (email: string, password: string, userData: Partial<AppUser>): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const { error } = await authService.signUp(email, password, userData);

      if (error) {
        return { success: false, error: (error as any).message || 'حدث خطأ' };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'حدث خطأ أثناء إنشاء الحساب' };
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الخروج
  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      await authService.signOut();
      
      // مسح البيانات المحفوظة
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('userEmail');
      
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث الملف الشخصي
  const updateProfile = async (updates: Partial<AppUser>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'المستخدم غير مسجل الدخول' };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setUserProfile(data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'حدث خطأ أثناء تحديث الملف الشخصي' };
    }
  };

  // تحديث بيانات الملف الشخصي
  const refreshProfile = async (): Promise<void> => {
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  // إعادة تعيين كلمة المرور
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'حدث خطأ أثناء إرسال رابط إعادة التعيين' };
    }
  };

  // تغيير كلمة المرور
  const changePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'حدث خطأ أثناء تغيير كلمة المرور' };
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
    resetPassword,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook لاستخدام AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook للتحقق من المصادقة مع إعادة توجيه
export const useRequireAuth = (redirectTo = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};

export default AuthContext;
