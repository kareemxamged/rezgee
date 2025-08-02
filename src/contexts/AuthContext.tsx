import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, authService, handleSupabaseError } from '../lib/supabase';
import type { User as AppUser } from '../lib/supabase';
import { handleLoginError, handleSignupError, handlePasswordResetError } from '../utils/errorHandler';
import { executeSupabaseRequest } from '../utils/connectionManager';

import { twoFactorService } from '../lib/twoFactorService';
import { useTranslation } from 'react-i18next';

interface AuthContextType {
  // حالة المصادقة
  user: User | null;
  userProfile: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // وظائف المصادقة
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; requiresTwoFactor?: boolean; tempUserId?: string; tempUserEmail?: string; developmentCode?: string }>;
  signUp: (email: string, password: string, userData: Partial<AppUser>) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;

  // وظائف المصادقة الثنائية
  completeTwoFactorLogin: (tempUserId: string, tempUserEmail: string, tempPassword: string) => Promise<{ success: boolean; error?: string }>;

  // وظائف الملف الشخصي
  updateProfile: (updates: Partial<AppUser>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  fixMissingProfileData: () => Promise<{ success: boolean; message: string }>;

  // وظائف إضافية
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;

  // وظائف المصادقة الثنائية
  enableTwoFactor: () => Promise<{ success: boolean; error?: string; developmentCode?: string }>;
  disableTwoFactor: () => Promise<{ success: boolean; error?: string; developmentCode?: string }>;
  sendTwoFactorCode: (codeType?: 'login' | 'enable_2fa' | 'disable_2fa') => Promise<{ success: boolean; error?: string; developmentCode?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// دالة للحصول على IP address العميل
// const getClientIP = async (): Promise<string | undefined> => {
//   try {
//     // محاولة الحصول على IP من خدمة خارجية
//     const response = await fetch('https://api.ipify.org?format=json');
//     const data = await response.json();
//     return data.ip;
//   } catch (error) {
//     // في حالة الفشل، إرجاع undefined
//     console.warn('Could not get client IP:', error);
//     return undefined;
//   }
// };

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const { i18n } = useTranslation();

  // متغير لتتبع آخر تجديد للرمز لتجنب التجديد المفرط
  const [lastTokenRefresh, setLastTokenRefresh] = useState<number>(0);

  // متغيرات مؤقتة للمصادقة الثنائية
  const [tempLoginData, setTempLoginData] = useState<{
    email: string;
    password: string;
    rememberMe: boolean;
  } | null>(null);

  // تحديد ما إذا كان المستخدم مصادق عليه
  // المستخدم مصادق إذا كان لديه user من Supabase Auth، حتى لو لم يكن له profile
  const isAuthenticated = !!user;

  // تحميل بيانات المستخدم من الجلسة المحفوظة
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');

        // التحقق من الجلسة الحالية
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setUserProfile(null);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Session found, setting user:', session.user.id);

          // تحميل الملف الشخصي أولاً للحصول على البيانات المحدثة
          try {
            await loadUserProfile(session.user.id);

            // تحديث بيانات المستخدم بالبريد الإلكتروني من قاعدة البيانات إذا كان مختلفاً
            if (userProfile && userProfile.email && userProfile.email !== session.user.email) {
              console.log('📧 Email mismatch detected. Auth:', session.user.email, 'DB:', userProfile.email);
              console.log('Using email from database:', userProfile.email);

              // إنشاء كائن مستخدم محدث بالبريد الصحيح
              const updatedUser = {
                ...session.user,
                email: userProfile.email
              };
              setUser(updatedUser);
            } else {
              setUser(session.user);
            }
          } catch (profileError) {
            console.error('Failed to load profile during initialization:', profileError);
            // استخدام بيانات auth كـ fallback
            setUser(session.user);
          }
        } else {
          console.log('No session found');
          setUser(null);
          setUserProfile(null);
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setUser(null);
          setUserProfile(null);
          setIsLoading(false);
        }
      }
    };

    // إضافة مهلة زمنية أقصر للتأكد من انتهاء التحميل
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth initialization timeout, setting loading to false');
        setIsLoading(false);
      }
    }, 3000); // 3 ثوان

    initializeAuth().finally(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    // الاستماع لتغييرات حالة المصادقة مع تحسينات لتجنب التجديد المفرط
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:', event, session?.user?.id);

        // تجنب المعالجة المتكررة للجلسة نفسها
        if (event === 'INITIAL_SESSION' && user?.id === session?.user?.id) {
          console.log('⏭️ Skipping duplicate INITIAL_SESSION event');
          return;
        }

        // تجنب معالجة أحداث SIGNED_OUT إذا كان المستخدم بالفعل غير مسجل
        if (event === 'SIGNED_OUT' && !user) {
          console.log('⏭️ Skipping SIGNED_OUT event - user already signed out');
          return;
        }

        // معالجة محسنة لتجديد الرمز مع debouncing لتجنب التجديد المفرط
        if (event === 'TOKEN_REFRESHED') {
          const now = Date.now();
          const timeSinceLastRefresh = now - lastTokenRefresh;

          // تجنب التجديد المتكرر خلال فترة قصيرة (أقل من 30 ثانية)
          if (timeSinceLastRefresh < 30000) {
            console.log('⏭️ Skipping frequent token refresh (last refresh was', timeSinceLastRefresh, 'ms ago)');
            return;
          }

          console.log('🔄 Token refreshed - maintaining current state');
          setLastTokenRefresh(now);
          // لا نحتاج لإعادة تحميل البيانات عند تجديد الرمز فقط
          return;
        }

        // معالجة خاصة لحدث SIGNED_IN للتحديث الفوري
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('🔑 SIGNED_IN event - updating user state immediately');
          setUser(session.user);
          setIsLoading(false);
        }

        // معالجة خاصة لحدث تسجيل الخروج
        if (event === 'SIGNED_OUT') {
          console.log('👋 Processing SIGNED_OUT event');
          setUser(null);
          setUserProfile(null);
          // تنظيف البيانات المحلية
          try {
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('userId');
            sessionStorage.clear();
          } catch (error) {
            console.warn('تحذير: فشل في تنظيف البيانات المحلية:', error);
          }
          return;
        }

        try {
          if (session?.user) {
            console.log('Setting user and loading profile...');
            setUser(session.user);

            // تحميل الملف الشخصي فقط إذا لم يكن محملاً بالفعل أو إذا كان مستخدم مختلف
            if (!userProfile || userProfile.id !== session.user.id) {
              try {
                await loadUserProfile(session.user.id);
                console.log('Profile loaded successfully');
              } catch (profileError) {
                console.error('Failed to load profile:', profileError);
                // محاولة إنشاء ملف شخصي إذا لم يكن موجوداً
                if ((profileError as any)?.message?.includes('not found') || (profileError as any)?.code === 'PGRST116') {
                  await createMissingProfile(session.user);
                }
              }
            } else {
              console.log('Profile already loaded for this user');
            }
          } else {
            console.log('No session, clearing user data');
            setUser(null);
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
        } finally {
          // تأكد من إنهاء حالة التحميل بعد أي تغيير في حالة المصادقة
          // لكن فقط إذا لم نكن في حالة تحميل الملف الشخصي
          if (!isProfileLoading) {
            console.log('Setting isLoading to false');
            setIsLoading(false);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // إنشاء ملف شخصي مفقود
  const createMissingProfile = async (authUser: User) => {
    console.log('Creating missing profile for user:', authUser.id);
    try {
      // محاولة إنشاء ملف شخصي أساسي
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email || '',
          password_hash: 'handled_by_supabase_auth',
          first_name: authUser.user_metadata?.first_name || 'المستخدم',
          last_name: authUser.user_metadata?.last_name || '',
          phone: authUser.phone || '',
          verified: !!authUser.email_confirmed_at,
          status: 'active',
          profile_visibility: 'public',
          show_phone: false,
          show_email: false,
          allow_messages: true,
          family_can_view: false,
          two_factor_enabled: false,
          login_notifications: true,
          message_notifications: true,
          created_at: authUser.created_at,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating missing profile:', error);
        // إنشاء ملف مؤقت إذا فشل الإنشاء
        const tempProfile = {
          id: authUser.id,
          email: authUser.email || '',
          first_name: authUser.user_metadata?.first_name || 'المستخدم',
          last_name: authUser.user_metadata?.last_name || '',
          phone: authUser.phone || '',
          created_at: authUser.created_at,
          updated_at: new Date().toISOString(),
          verified: !!authUser.email_confirmed_at,
          age: 25,
          city: '',
          education: '',
          profession: '',
          marital_status: 'single' as const,
          religious_commitment: 'practicing' as const,
          bio: '',
          looking_for: ''
        };
        setUserProfile(tempProfile);
      } else {
        console.log('Missing profile created successfully:', data);
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error in createMissingProfile:', error);
      // إنشاء ملف مؤقت كحل أخير
      const tempProfile = {
        id: authUser.id,
        email: authUser.email || '',
        first_name: authUser.user_metadata?.first_name || 'المستخدم',
        last_name: authUser.user_metadata?.last_name || '',
        phone: authUser.phone || '',
        created_at: authUser.created_at,
        updated_at: new Date().toISOString(),
        verified: !!authUser.email_confirmed_at,
        age: 25,
        city: '',
        education: '',
        profession: '',
        marital_status: 'single' as const,
        religious_commitment: 'practicing' as const,
        bio: '',
        looking_for: ''
      };
      setUserProfile(tempProfile);
    }
  };

  // تحميل بيانات الملف الشخصي
  const loadUserProfile = async (userId: string, forceReload: boolean = false) => {
    console.log('Loading user profile for ID:', userId, 'forceReload:', forceReload);

    // تجنب التحميل المتكرر إلا إذا كان إجبارياً
    if (!forceReload && userProfile && userProfile.id === userId) {
      console.log('Profile already loaded for this user');
      return;
    }

    // تجنب التحميل المتزامن المتعدد
    if (isProfileLoading) {
      console.log('Profile loading already in progress, skipping...');
      return;
    }

    setIsProfileLoading(true);

    try {
      console.log('Querying users table...');

      // استعلام شامل لجميع البيانات مع timeout أقصر
      // إضافة timestamp لتجنب cache
      const timestamp = Date.now();
      console.log('🔍 Executing fresh query at:', timestamp);

      const queryPromise = supabase
        .from('users')
        .select(`
          *,
          membership_number,
          education,
          profession,
          religious_commitment,
          bio,
          looking_for,
          marriage_type,
          children_count,
          residence_location,
          nationality,
          weight,
          height,
          skin_color,
          body_type,
          religiosity_level,
          prayer_commitment,
          smoking,
          beard,
          hijab,
          education_level,
          financial_status,
          work_field,
          job_title,
          monthly_income,
          health_status
        `)
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), 3000)
      );

      const { data: profile, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      console.log('📊 Profile Query Result:', {
        hasProfile: !!profile,
        error: error?.message || null,
        profileData: profile ? {
          id: profile.id,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          membership_number: profile.membership_number,
          gender: profile.gender,
          age: profile.age,
          city: profile.city,
          phone: profile.phone,
          education: profile.education,
          profession: profile.profession,
          religious_commitment: profile.religious_commitment,
          bio: profile.bio,
          looking_for: profile.looking_for
        } : null
      });

      if (error) {
        console.log('Error loading profile:', error);
        // إذا كان المستخدم غير موجود في جدول users، نحاول البحث بالبريد الإلكتروني
        if (error.code === 'PGRST116') {
          console.log('User profile not found by ID, trying to find by email...');

          // الحصول على بريد المستخدم من auth
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            // البحث بالبريد الإلكتروني
            const { data: profileByEmail, error: emailError } = await supabase
              .from('users')
              .select('*')
              .eq('email', user.email)
              .single();

            if (profileByEmail && !emailError) {
              // تم العثور على الملف الشخصي بالبريد الإلكتروني، نحدث الـ ID
              console.log(`Found profile by email, updating ID from ${profileByEmail.id} to ${userId}`);

              const { error: updateError } = await supabase
                .from('users')
                .update({ id: userId })
                .eq('email', user.email);

              if (!updateError) {
                // تحديث الملف الشخصي مع الـ ID الجديد
                setUserProfile({ ...profileByEmail, id: userId });
                return;
              }
            }
          }

          console.log('No profile found, setting userProfile to null');
          setUserProfile(null);
          return;
        }
        console.error('Error loading user profile:', error);
        setUserProfile(null);
        return;
      }

      console.log('Profile loaded and set:', profile);

      // تعيين الملف الشخصي أولاً
      setUserProfile(profile);

      // مزامنة البريد الإلكتروني بين auth.users و public.users
      if (user && profile.email && profile.email !== user.email) {
        console.log('📧 Email sync needed. Auth:', user.email, 'DB:', profile.email);
        try {
          const { error: syncError } = await supabase.auth.admin.updateUserById(
            userId,
            { email: profile.email }
          );

          if (syncError) {
            console.error('❌ Failed to sync email to auth:', syncError);
          } else {
            console.log('✅ Email synced to auth successfully');
            // تحديث بيانات المستخدم في السياق
            const updatedUser = { ...user, email: profile.email };
            setUser(updatedUser);
          }
        } catch (syncErr) {
          console.error('❌ Error syncing email:', syncErr);
        }
      }

      // فحص إذا كانت هناك حاجة لإصلاح تلقائي
      const needsAutoFix = !profile.membership_number ||
                          !profile.first_name ||
                          profile.first_name.trim() === '' ||
                          profile.first_name === 'المستخدم';

      if (needsAutoFix) {
        console.log('🔧 Profile needs auto-fix, scheduling fix...');
        // تشغيل الإصلاح بعد تأخير قصير لضمان تحديث الـ state
        setTimeout(async () => {
          try {
            const result = await fixMissingProfileData();
            if (result.success) {
              console.log('✅ Auto-fix completed during profile load:', result.message);
            }
          } catch (error) {
            console.error('❌ Auto-fix failed during profile load:', error);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    } finally {
      setIsProfileLoading(false);
    }
  };

  // تسجيل الدخول مع نظام الأمان المتقدم والمصادقة الثنائية ودعم كلمات المرور المؤقتة
  const signIn = async (email: string, password: string, rememberMe = false): Promise<{ success: boolean; error?: string; requiresTwoFactor?: boolean; tempUserId?: string; tempUserEmail?: string; developmentCode?: string }> => {
    try {
      const language = i18n.language === 'en' ? 'en' : 'ar';

      // تعطيل فحص الأمان مؤقتاً لحل مشكلة تسجيل الدخول
      // TODO: إعادة تفعيل فحص الأمان بعد إصلاح مشاكل RLS وجداول الأمان
      /*
      // الحصول على IP address
      const ipAddress = await getClientIP();

      // فحص أمان الجهاز المتقدم
      const deviceSecurity = await deviceSecurityService.checkDeviceSecurity(email, ipAddress);

      if (!deviceSecurity.allowed) {
        return {
          success: false,
          error: deviceSecurity.reason || (language === 'ar'
            ? 'تم منع الوصول لأسباب أمنية'
            : 'Access denied for security reasons')
        };
      }

      // تحذير للمخاطر المتوسطة والعالية
      if (deviceSecurity.riskLevel === 'high' || deviceSecurity.riskLevel === 'medium') {
        console.warn('High risk device detected:', {
          riskLevel: deviceSecurity.riskLevel,
          suspiciousActivities: deviceSecurity.suspiciousActivities,
          deviceFingerprint: deviceSecurity.deviceFingerprint
        });
      }
      */

      // معلومات الطلب
      const userAgent = navigator.userAgent;
      // لا نرسل IP address إذا لم نتمكن من الحصول عليه بشكل صحيح
      const ipAddress = undefined; // سيتم تجاهله في twoFactorService

      // محاولة تسجيل الدخول العادية
      const { data, error } = await authService.signIn(email, password);

      if (error) {
        // تحديد سبب الفشل للتسجيل
        // let failureReason = 'invalid_credentials';
        let securityContext: any = {};

        // فحص نوع الخطأ
        const errorMessage = (error as any)?.message || '';
        if (errorMessage.includes('Email not confirmed')) {
          // failureReason = 'account_not_verified';
          securityContext.accountNotVerified = true;
        } else if (errorMessage.includes('User not found')) {
          // failureReason = 'invalid_credentials'; // نفس الرسالة لأغراض الأمان
        }

        // تعطيل تسجيل المحاولات مؤقتاً لحل مشكلة تسجيل الدخول
        /*
        // تسجيل المحاولة الفاشلة مع بصمة الجهاز
        try {
          await supabase.from('login_attempts').insert({
            email: email.toLowerCase(),
            ip_address: ipAddress,
            user_agent: userAgent,
            attempt_type: 'login',
            success: false,
            failure_reason: failureReason,
            device_fingerprint: 'unknown',
            security_flags: {
              riskLevel: 'low',
              suspiciousActivities: []
            }
          });
        } catch (logError) {
          console.error('Error logging attempt:', logError);
        }
        */

        const errorMessageText = handleLoginError(error, language, securityContext);
        console.error('Login error:', error);
        return { success: false, error: errorMessageText };
      }

      // فحص حالة التحقق من البريد الإلكتروني
      if (data?.user && !data.user.email_confirmed_at) {
        // تعطيل تسجيل المحاولات مؤقتاً
        /*
        // تسجيل المحاولة الفاشلة
        try {
          await supabase.from('login_attempts').insert({
            email: email.toLowerCase(),
            ip_address: ipAddress,
            user_agent: userAgent,
            attempt_type: 'login',
            success: false,
            failure_reason: 'account_not_verified',
            user_id: data.user.id,
            device_fingerprint: 'unknown',
            security_flags: {
              riskLevel: 'low',
              suspiciousActivities: []
            }
          });
        } catch (logError) {
          console.error('Error logging attempt:', logError);
        }
        */

        return {
          success: false,
          error: language === 'ar'
            ? 'يجب تأكيد البريد الإلكتروني قبل تسجيل الدخول. يرجى فحص بريدك الإلكتروني.'
            : 'Please verify your email before logging in. Check your email inbox.'
        };
      }

      // فحص حالة الحساب في جدول المستخدمين
      if (data?.user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('verified, status, two_factor_enabled')
          .eq('id', data.user.id)
          .single();

        if (userProfile && userProfile.status === 'suspended') {
          // تعطيل تسجيل المحاولات مؤقتاً
          /*
          // تسجيل المحاولة الفاشلة
          try {
            await supabase.from('login_attempts').insert({
              email: email.toLowerCase(),
              ip_address: ipAddress,
              user_agent: userAgent,
              attempt_type: 'login',
              success: false,
              failure_reason: 'account_suspended',
              user_id: data.user.id,
              device_fingerprint: 'unknown',
              security_flags: {
                riskLevel: 'low',
                suspiciousActivities: []
              }
            });
          } catch (logError) {
            console.error('Error logging attempt:', logError);
          }
          */

          return {
            success: false,
            error: language === 'ar'
              ? 'تم تعليق الحساب. يرجى التواصل مع الدعم الفني.'
              : 'Account has been suspended. Please contact support.'
          };
        }

        // فحص المصادقة الثنائية
        if (userProfile && userProfile.two_factor_enabled) {
          // حفظ معلومات الجلسة مؤقتاً قبل تسجيل الخروج
          const tempUserId = data?.user?.id;
          const tempUserEmail = data?.user?.email;

          // حفظ بيانات تسجيل الدخول مؤقتاً لإعادة الاستخدام بعد التحقق
          setTempLoginData({
            email,
            password,
            rememberMe
          });

          // تسجيل خروج مؤقت لمنع الوصول قبل التحقق
          await supabase.auth.signOut();

          // إرسال رمز التحقق
          const codeResult = await twoFactorService.sendVerificationCode(
            tempUserId,
            tempUserEmail || email,
            'login',
            ipAddress,
            userAgent
          );

          if (!codeResult.success) {
            // مسح البيانات المؤقتة في حالة الفشل
            setTempLoginData(null);
            return {
              success: false,
              error: codeResult.message
            };
          }

          return {
            success: true,
            requiresTwoFactor: true,
            tempUserId: tempUserId,
            tempUserEmail: tempUserEmail || email,
            developmentCode: codeResult.developmentCode
          };
        }
      }

      // تعطيل تسجيل المحاولات مؤقتاً
      /*
      // تسجيل المحاولة الناجحة
      try {
        await supabase.from('login_attempts').insert({
          email: email.toLowerCase(),
          ip_address: ipAddress,
          user_agent: userAgent,
          attempt_type: 'login',
          success: true,
          user_id: data.user?.id,
          session_id: data.session?.access_token,
          device_fingerprint: 'unknown',
          security_flags: {
            riskLevel: 'low',
            suspiciousActivities: []
          }
        });
      } catch (logError) {
        console.error('Error logging successful attempt:', logError);
      }
      */

      // حفظ تفضيل "تذكرني" في localStorage
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', email);
        // حفظ معرف المستخدم للتحقق من الجلسة لاحقاً
        if (data?.user?.id) {
          localStorage.setItem('userId', data.user.id);
        }
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
      }



      // تسجيل نجاح تسجيل الدخول
      console.log('Login successful, user authenticated:', data?.user?.id);

      // تحديث حالة المصادقة فوراً لتجنب مشاكل التزامن
      if (data?.user) {
        console.log('Setting user state immediately after login');
        setUser(data.user);
        setIsLoading(false);

        // تحميل الملف الشخصي في الخلفية
        loadUserProfile(data.user.id).catch(error => {
          console.error('Error loading profile after login:', error);
        });
      }

      return { success: true };
    } catch (error: any) {
      const language = i18n.language === 'en' ? 'en' : 'ar';

      // تعطيل تسجيل المحاولات مؤقتاً
      /*
      // تسجيل المحاولة الفاشلة في حالة الخطأ غير المتوقع
      try {
        const fallbackIpAddress = await getClientIP();
        const userAgent = navigator.userAgent;
        await supabase.from('login_attempts').insert({
          email: email.toLowerCase(),
          ip_address: fallbackIpAddress,
          user_agent: userAgent,
          attempt_type: 'login',
          success: false,
          failure_reason: 'system_error',
          device_fingerprint: 'error',
          security_flags: { error: true }
        });
      } catch (logError) {
        console.error('Error logging failed attempt:', logError);
      }
      */

      const errorMessage = handleLoginError(error, language);
      console.error('Unexpected login error:', error);
      return { success: false, error: errorMessage };
    }
  };

  // إنشاء حساب جديد
  const signUp = async (email: string, password: string, userData: Partial<AppUser>): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await authService.signUp(email, password, userData);

      if (error) {
        const language = i18n.language === 'en' ? 'en' : 'ar';
        const errorMessage = handleSignupError(error, language);
        console.error('Signup error:', error);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error: any) {
      const language = i18n.language === 'en' ? 'en' : 'ar';
      const errorMessage = handleSignupError(error, language);
      console.error('Unexpected signup error:', error);
      return { success: false, error: errorMessage };
    }
  };

  // تسجيل الخروج
  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);

      console.log('Signing out user...');

      await authService.signOut();

      // مسح جميع البيانات المحفوظة
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');

      // مسح حالة المستخدم
      setUser(null);
      setUserProfile(null);

      console.log('User signed out successfully');
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
      // التحقق من تحديث البريد الإلكتروني
      if (updates.email && updates.email.trim() !== '' && updates.email !== user.email) {
        console.log('Updating email in Supabase Auth first...');

        // التحقق من صحة البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updates.email)) {
          return { success: false, error: 'البريد الإلكتروني غير صحيح' };
        }

        // تحديث البريد الإلكتروني في Supabase Auth أولاً
        const { error: authError } = await supabase.auth.updateUser({
          email: updates.email
        });

        if (authError) {
          console.error('Auth email update error:', authError);

          // رسائل خطأ مخصصة حسب نوع الخطأ
          if (authError.message?.includes('email_address_invalid')) {
            return { success: false, error: 'البريد الإلكتروني غير صحيح' };
          } else if (authError.message?.includes('email_address_not_authorized')) {
            return { success: false, error: 'البريد الإلكتروني غير مسموح' };
          } else if (authError.message?.includes('signup_disabled')) {
            return { success: false, error: 'تحديث البريد الإلكتروني معطل حالياً' };
          } else {
            return { success: false, error: authError.message || 'فشل في تحديث البريد الإلكتروني' };
          }
        }

        console.log('Email updated in Supabase Auth successfully');

        // ملاحظة: Supabase Auth سيرسل رسالة تأكيد للبريد الجديد
        // البريد لن يتم تحديثه فعلياً حتى يتم التأكيد
        return {
          success: true,
          error: 'تم إرسال رسالة تأكيد للبريد الإلكتروني الجديد. يرجى التحقق من بريدك الإلكتروني وتأكيد التغيير.'
        };
      }

      // تحديث باقي البيانات (غير البريد الإلكتروني)
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // إزالة البريد الإلكتروني من التحديث إذا كان موجوداً (لأنه يتم تحديثه عبر Auth)
      if (updateData.email) {
        delete updateData.email;
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);

        // رسائل خطأ مخصصة
        if (error.code === '23505') {
          if (error.message?.includes('email')) {
            return { success: false, error: 'البريد الإلكتروني مستخدم من قبل مستخدم آخر' };
          } else if (error.message?.includes('phone')) {
            return { success: false, error: 'رقم الهاتف مستخدم من قبل مستخدم آخر' };
          } else {
            return { success: false, error: 'البيانات المدخلة مستخدمة من قبل مستخدم آخر' };
          }
        }

        return { success: false, error: error.message };
      }

      console.log('Profile updated successfully:', data);
      // تحديث الملف الشخصي فوراً في الواجهة
      setUserProfile(data);
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected profile update error:', error);
      return { success: false, error: error.message || 'حدث خطأ أثناء تحديث الملف الشخصي' };
    }
  };

  // تحديث بيانات الملف الشخصي
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (user) {
      console.log('🔄 RefreshProfile called for user:', user.id);

      try {
        // إجبار إعادة تحميل البيانات من قاعدة البيانات مع معالجة الأخطاء
        await executeSupabaseRequest(
          () => loadUserProfile(user.id, true),
          'refreshProfile'
        );
      } catch (error) {
        console.error('❌ خطأ في تحديث الملف الشخصي:', error);
        handleSupabaseError(error, 'refreshProfile');
        return;
      }

      // تحديث بيانات المستخدم إذا تغير البريد الإلكتروني
      if (userProfile && userProfile.email && userProfile.email !== user.email) {
        console.log('📧 Updating user email in context:', userProfile.email);
        const updatedUser = {
          ...user,
          email: userProfile.email
        };
        setUser(updatedUser);
      }

      console.log('✅ RefreshProfile completed');
    }
  }, [user, userProfile]);

  // إصلاح البيانات المفقودة للمستخدم الحالي (تلقائي وصامت)
  const fixMissingProfileData = async (): Promise<{ success: boolean; message: string }> => {
    if (!user || !userProfile) {
      return { success: false, message: 'لا يوجد مستخدم مسجل دخول' };
    }

    try {
      console.log('🔧 Auto-checking and fixing missing profile data...');

      let missingData: any = {};
      let hasUpdates = false;

      // 1. إضافة رقم عضوية إذا كان مفقوداً (أولوية عالية)
      if (!userProfile.membership_number) {
        try {
          // محاولة الحصول على آخر رقم عضوية لتوليد رقم جديد
          const { data: lastUser } = await supabase
            .from('users')
            .select('membership_number')
            .not('membership_number', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          let nextNumber = 1;
          if (lastUser && lastUser.membership_number) {
            const match = lastUser.membership_number.match(/RZ(\d+)/);
            if (match) {
              nextNumber = parseInt(match[1]) + 1;
            }
          }

          const membershipNumber = `RZ${nextNumber.toString().padStart(6, '0')}`;
          missingData.membership_number = membershipNumber;
          hasUpdates = true;
          console.log(`🎫 Generated membership number: ${membershipNumber}`);
        } catch (error) {
          // في حالة الخطأ، استخدم رقم عشوائي
          const randomNumber = Math.floor(Math.random() * 999999) + 1;
          const membershipNumber = `RZ${randomNumber.toString().padStart(6, '0')}`;
          missingData.membership_number = membershipNumber;
          hasUpdates = true;
          console.log(`🎫 Generated random membership number: ${membershipNumber}`);
        }
      }

      // 2. محاولة استرداد البيانات الأصلية من جدول email_verifications أولاً
      let originalData = null;

      // تفعيل استرداد البيانات من جدول email_verifications لحل مشكلة البيانات المفقودة
      const ENABLE_VERIFICATION_DATA_RECOVERY = true;

      if (ENABLE_VERIFICATION_DATA_RECOVERY) {
        try {
          const { data: verificationData, error: verificationError } = await supabase
            .from('email_verifications')
            .select('user_data')
            .eq('email', userProfile.email)
            .eq('status', 'verified')
            .order('created_at', { ascending: false })
            .limit(1);

          if (verificationError) {
            console.log('⚠️ Could not access email_verifications table:', verificationError.message);
          } else if (verificationData && verificationData.length > 0 && verificationData[0].user_data) {
            originalData = verificationData[0].user_data;
            console.log('📋 Found original registration data:', {
              first_name: originalData.first_name,
              last_name: originalData.last_name,
              education: originalData.education,
              profession: originalData.profession
            });
          } else {
            console.log('ℹ️ No verification data found for this email');
          }
        } catch (verificationError) {
          console.log('ℹ️ Could not retrieve verification data:', verificationError);
        }
      } else {
        console.log('ℹ️ Verification data recovery is temporarily disabled to prevent 406 errors');
      }

      // 3. إصلاح الاسم الأول والأخير
      if (originalData) {
        // استخدام الاسم الأصلي من التسجيل
        if (originalData.first_name && (!userProfile.first_name || userProfile.first_name.trim() === '' || userProfile.first_name === 'المستخدم')) {
          missingData.first_name = originalData.first_name;
          hasUpdates = true;
          console.log(`📝 Restored original first_name: ${originalData.first_name}`);
        }

        if (originalData.last_name && (!userProfile.last_name || userProfile.last_name.trim() === '')) {
          missingData.last_name = originalData.last_name;
          hasUpdates = true;
          console.log(`📝 Restored original last_name: ${originalData.last_name}`);
        }
      } else {
        // إذا لم نجد البيانات الأصلية، استخدم قيمة افتراضية فقط إذا كان الاسم فارغاً تماماً أو "المستخدم"
        if (!userProfile.first_name || userProfile.first_name.trim() === '' || userProfile.first_name === 'المستخدم') {
          missingData.first_name = 'عضو';
          hasUpdates = true;
          console.log('📝 Set improved fallback first_name: عضو');
        }

        // إضافة bio افتراضي إذا كان مفقود
        if (!userProfile.bio || userProfile.bio.trim() === '') {
          missingData.bio = 'أبحث عن شريك حياة متدين وملتزم';
          hasUpdates = true;
          console.log('📝 Set default bio');
        }
      }

      // 4. إصلاح الجنس المفقود بناءً على البيانات الموجودة (أولوية عالية)
      if (!userProfile.gender) {
        let inferredGender: 'male' | 'female' | null = null;

        // استنتاج الجنس من بيانات اللحية (للذكور)
        if (userProfile.beard && (userProfile.beard === 'yes' || userProfile.beard === 'no')) {
          inferredGender = 'male';
          console.log('🔍 Inferred gender as male from beard data');
        }
        // استنتاج الجنس من بيانات الحجاب (للإناث)
        else if (userProfile.hijab && ['no_hijab', 'hijab', 'niqab'].includes(userProfile.hijab)) {
          inferredGender = 'female';
          console.log('🔍 Inferred gender as female from hijab data');
        }

        if (inferredGender) {
          missingData.gender = inferredGender;
          hasUpdates = true;
          console.log(`📝 Auto-fixing missing gender: ${inferredGender}`);
        }
      }

      // 5. استرداد البيانات الأخرى المهمة
      if (originalData) {
        const criticalFields = [
          'education', 'profession', 'religious_commitment', 'bio', 'looking_for',
          'nationality', 'height', 'weight', 'education_level', 'financial_status',
          'religiosity_level', 'prayer_commitment', 'smoking', 'beard', 'hijab'
        ];

        for (const field of criticalFields) {
          const originalValue = (originalData as any)[field];
          const currentValue = (userProfile as any)[field];

          if (originalValue && (!currentValue || currentValue === '')) {
            (missingData as any)[field] = originalValue;
            hasUpdates = true;
            console.log(`📝 Restored ${field}: ${originalValue}`);
          }
        }

        // إصلاح خاص: نقل بيانات profession إلى job_title إذا كان job_title فارغاً
        if (originalData.profession && (!userProfile.job_title || userProfile.job_title === '')) {
          missingData.job_title = originalData.profession;
          hasUpdates = true;
          console.log(`📝 Mapped profession to job_title: ${originalData.profession}`);
        }

        // إصلاح خاص: نقل بيانات education إلى work_field إذا كان work_field فارغاً
        if (originalData.education && (!userProfile.work_field || userProfile.work_field === '')) {
          missingData.work_field = originalData.education;
          hasUpdates = true;
          console.log(`📝 Mapped education to work_field: ${originalData.education}`);
        }
      }

      // 4. تطبيق التحديثات بصمت إذا وجدت
      if (hasUpdates) {
        console.log('📝 Silently updating missing data:', Object.keys(missingData));

        const { error: updateError } = await supabase
          .from('users')
          .update({
            ...missingData,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('❌ Error updating profile:', updateError);
          return { success: false, message: 'فشل في تحديث البيانات' };
        }

        // إعادة تحميل الملف الشخصي بصمت
        await loadUserProfile(user.id, true);

        console.log('✅ Profile data auto-fixed successfully');
        return {
          success: true,
          message: `تم إصلاح ${Object.keys(missingData).length} حقل تلقائياً`
        };
      } else {
        console.log('✅ Profile data is complete, no fixes needed');
        return { success: true, message: 'البيانات مكتملة' };
      }
    } catch (error) {
      console.error('❌ Error in auto-fix:', error);
      return { success: false, message: 'حدث خطأ أثناء الفحص التلقائي' };
    }
  };

  // إعادة تعيين كلمة المرور
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        const errorMessage = handlePasswordResetError(error, 'ar');
        console.error('Password reset error:', error);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage = handlePasswordResetError(error, 'ar');
      console.error('Unexpected password reset error:', error);
      return { success: false, error: errorMessage };
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

  // تفعيل المصادقة الثنائية
  const enableTwoFactor = async (): Promise<{ success: boolean; error?: string; developmentCode?: string }> => {
    try {
      console.log('enableTwoFactor called, checking auth state:', {
        hasUser: !!user,
        hasUserProfile: !!userProfile,
        isAuthenticated,
        isLoading
      });

      // التحقق من حالة المصادقة مع انتظار قصير إذا كان التحميل جارياً
      if (isLoading) {
        console.log('Auth is still loading, waiting...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!isAuthenticated || !user) {
        console.log('User not authenticated');
        return { success: false, error: 'يجب تسجيل الدخول أولاً' };
      }

      // إذا لم يكن الملف الشخصي محملاً، نحاول تحميله
      if (!userProfile) {
        console.log('User profile not loaded, attempting to load...');
        try {
          await loadUserProfile(user.id);
        } catch (profileError) {
          console.error('Failed to load profile for 2FA:', profileError);
          return { success: false, error: 'فشل في تحميل بيانات المستخدم' };
        }
      }

      if (!userProfile) {
        return { success: false, error: 'لم يتم العثور على بيانات المستخدم' };
      }

      console.log('Sending 2FA verification code...');
      // إرسال رمز التحقق لتفعيل المصادقة الثنائية
      const result = await twoFactorService.sendVerificationCode(
        user.id,
        userProfile.email,
        'enable_2fa'
      );

      return {
        success: result.success,
        error: result.message,
        developmentCode: result.developmentCode
      };
    } catch (error: any) {
      console.error('Error in enableTwoFactor:', error);
      return { success: false, error: error.message || 'حدث خطأ أثناء تفعيل المصادقة الثنائية' };
    }
  };

  // إلغاء تفعيل المصادقة الثنائية
  const disableTwoFactor = async (): Promise<{ success: boolean; error?: string; developmentCode?: string }> => {
    try {
      console.log('disableTwoFactor called, checking auth state:', {
        hasUser: !!user,
        hasUserProfile: !!userProfile,
        isAuthenticated,
        isLoading
      });

      // التحقق من حالة المصادقة مع انتظار قصير إذا كان التحميل جارياً
      if (isLoading) {
        console.log('Auth is still loading, waiting...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!isAuthenticated || !user) {
        console.log('User not authenticated');
        return { success: false, error: 'يجب تسجيل الدخول أولاً' };
      }

      // إذا لم يكن الملف الشخصي محملاً، نحاول تحميله
      if (!userProfile) {
        console.log('User profile not loaded, attempting to load...');
        try {
          await loadUserProfile(user.id);
        } catch (profileError) {
          console.error('Failed to load profile for 2FA:', profileError);
          return { success: false, error: 'فشل في تحميل بيانات المستخدم' };
        }
      }

      if (!userProfile) {
        return { success: false, error: 'لم يتم العثور على بيانات المستخدم' };
      }

      console.log('Sending 2FA disable verification code...');
      // إرسال رمز التحقق لإلغاء تفعيل المصادقة الثنائية
      const result = await twoFactorService.sendVerificationCode(
        user.id,
        userProfile.email,
        'disable_2fa'
      );

      return {
        success: result.success,
        error: result.message,
        developmentCode: result.developmentCode
      };
    } catch (error: any) {
      console.error('Error in disableTwoFactor:', error);
      return { success: false, error: error.message || 'حدث خطأ أثناء إلغاء تفعيل المصادقة الثنائية' };
    }
  };

  // إرسال رمز المصادقة الثنائية
  const sendTwoFactorCode = async (codeType: 'login' | 'enable_2fa' | 'disable_2fa' = 'login'): Promise<{ success: boolean; error?: string; developmentCode?: string }> => {
    try {
      console.log('sendTwoFactorCode called, checking auth state:', {
        hasUser: !!user,
        hasUserProfile: !!userProfile,
        isAuthenticated,
        isLoading,
        codeType
      });

      // التحقق من حالة المصادقة مع انتظار قصير إذا كان التحميل جارياً
      if (isLoading) {
        console.log('Auth is still loading, waiting...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!isAuthenticated || !user) {
        console.log('User not authenticated');
        return { success: false, error: 'يجب تسجيل الدخول أولاً' };
      }

      // إذا لم يكن الملف الشخصي محملاً، نحاول تحميله
      if (!userProfile) {
        console.log('User profile not loaded, attempting to load...');
        try {
          await loadUserProfile(user.id);
        } catch (profileError) {
          console.error('Failed to load profile for 2FA:', profileError);
          return { success: false, error: 'فشل في تحميل بيانات المستخدم' };
        }
      }

      if (!userProfile) {
        return { success: false, error: 'لم يتم العثور على بيانات المستخدم' };
      }

      console.log('Sending 2FA verification code...');
      const result = await twoFactorService.sendVerificationCode(
        user.id,
        userProfile.email,
        codeType
      );

      return {
        success: result.success,
        error: result.message,
        developmentCode: result.developmentCode
      };
    } catch (error: any) {
      console.error('Error in sendTwoFactorCode:', error);
      return { success: false, error: error.message || 'حدث خطأ أثناء إرسال رمز التحقق' };
    }
  };

  // إكمال تسجيل الدخول بعد التحقق من المصادقة الثنائية
  const completeTwoFactorLogin = async (tempUserId: string, tempUserEmail: string, tempPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Completing 2FA login for user:', tempUserId);

      // استخدام البيانات المحفوظة مؤقتاً أو البيانات المرسلة
      const loginData = tempLoginData || {
        email: tempUserEmail,
        password: tempPassword,
        rememberMe: false
      };

      // تسجيل الدخول مرة أخرى بعد التحقق من المصادقة الثنائية
      console.log('Attempting to sign in again with:', loginData.email);
      const { data, error } = await authService.signIn(loginData.email, loginData.password);

      if (error) {
        console.error('Error completing 2FA login:', error);
        setTempLoginData(null);
        return {
          success: false,
          error: `فشل في إكمال تسجيل الدخول بعد التحقق: ${(error as any)?.message || error}`
        };
      }

      console.log('Sign in successful, user data:', data?.user?.id);

      if (data?.user) {
        console.log('2FA login completed successfully');

        // مسح البيانات المؤقتة
        setTempLoginData(null);

        // تحديث حالة المصادقة
        setUser(data.user);
        // setIsAuthenticated يتم تحديثه تلقائياً عند تحديث user

        // تحميل الملف الشخصي مع timeout
        console.log('Loading user profile after 2FA login...');
        try {
          // إضافة timeout لتجنب التعليق
          const profilePromise = loadUserProfile(data.user.id);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Profile loading timeout')), 10000)
          );

          await Promise.race([profilePromise, timeoutPromise]);
          console.log('User profile loaded successfully after 2FA');
        } catch (profileError) {
          console.error('Error loading profile after 2FA:', profileError);
          // نتابع حتى لو فشل تحميل الملف الشخصي
          // المستخدم سيكون مسجل الدخول ولكن بدون ملف شخصي مفصل
        }

        // حفظ الجلسة إذا كان المستخدم اختار "تذكرني"
        if (loginData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userId', data.user.id);
        }

        return { success: true };
      } else {
        setTempLoginData(null);
        return {
          success: false,
          error: 'فشل في إكمال تسجيل الدخول'
        };
      }
    } catch (error: any) {
      console.error('Error in completeTwoFactorLogin:', error);
      setTempLoginData(null);
      return {
        success: false,
        error: error.message || 'حدث خطأ غير متوقع'
      };
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
    fixMissingProfileData,
    resetPassword,
    changePassword,
    enableTwoFactor,
    disableTwoFactor,
    sendTwoFactorCode,
    completeTwoFactorLogin,
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
