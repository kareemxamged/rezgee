# أمثلة تقنية - منصة رزقي (Rezgee)

## 📋 أمثلة الكود والوظائف التقنية

### 1. نظام المصادقة المتقدم

#### A. مكون تسجيل الدخول
```typescript
// src/components/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { trackLogin } from '../utils/gtm';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      
      // تتبع تسجيل الدخول
      trackLogin('email', 'regular');
      
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          البريد الإلكتروني
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          كلمة المرور
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
      </button>
    </form>
  );
};

export default LoginPage;
```

#### B. نظام المصادقة
```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // الحصول على الجلسة الحالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // الاستماع لتغييرات المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. نظام البحث الذكي

#### A. مكون البحث
```typescript
// src/components/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { trackSearch } from '../utils/gtm';

interface SearchFilters {
  ageMin: number;
  ageMax: number;
  city: string;
  education: string;
  profession: string;
  maritalStatus: string;
}

interface SearchResult {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  city: string;
  education: string;
  profession: string;
  profile_photo: string;
}

const SearchPage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    ageMin: 18,
    ageMax: 65,
    city: '',
    education: '',
    profession: '',
    maritalStatus: ''
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          age,
          city,
          education,
          profession,
          profile_photo
        `)
        .eq('is_active', true)
        .gte('age', filters.ageMin)
        .lte('age', filters.ageMax);

      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters.education) {
        query = query.eq('education', filters.education);
      }
      if (filters.profession) {
        query = query.ilike('profession', `%${filters.profession}%`);
      }
      if (filters.maritalStatus) {
        query = query.eq('marital_status', filters.maritalStatus);
      }

      const { data, error } = await query.limit(20);
      
      if (error) throw error;
      
      setResults(data || []);
      
      // تتبع البحث
      trackSearch('user_search', filters, data?.length || 0);
      
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* فلاتر البحث */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">فلاتر البحث</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العمر
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={filters.ageMin}
                    onChange={(e) => setFilters({...filters, ageMin: parseInt(e.target.value)})}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="من"
                  />
                  <input
                    type="number"
                    value={filters.ageMax}
                    onChange={(e) => setFilters({...filters, ageMax: parseInt(e.target.value)})}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="إلى"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة
                </label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="أدخل اسم المدينة"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التعليم
                </label>
                <select
                  value={filters.education}
                  onChange={(e) => setFilters({...filters, education: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">جميع المستويات</option>
                  <option value="high_school">ثانوي</option>
                  <option value="bachelor">بكالوريوس</option>
                  <option value="master">ماجستير</option>
                  <option value="phd">دكتوراه</option>
                </select>
              </div>
              
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'جاري البحث...' : 'بحث'}
              </button>
            </div>
          </div>
        </div>
        
        {/* نتائج البحث */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              نتائج البحث ({results.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <img
                      src={result.profile_photo || '/default-avatar.png'}
                      alt={`${result.first_name} ${result.last_name}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{result.first_name} {result.last_name}</h4>
                      <p className="text-sm text-gray-600">العمر: {result.age}</p>
                      <p className="text-sm text-gray-600">المدينة: {result.city}</p>
                      <p className="text-sm text-gray-600">التعليم: {result.education}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
```

### 3. نظام الرسائل الآمن

#### A. مكون الرسائل
```typescript
// src/components/MessagesPage.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { trackMessageSent } from '../utils/gtm';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  user_id: string;
  user_name: string;
  user_photo: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          user_id,
          user_name,
          user_photo,
          last_message,
          last_message_time,
          unread_count
        `)
        .eq('current_user_id', user.id)
        .order('last_message_time', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: user.id,
          content: newMessage.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setMessages([...messages, data]);
      setNewMessage('');

      // تتبع إرسال الرسالة
      trackMessageSent('text', selectedConversation, selectedConversation);
      
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-96">
        {/* قائمة المحادثات */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">المحادثات</h3>
          </div>
          
          <div className="overflow-y-auto h-80">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={conversation.user_photo || '/default-avatar.png'}
                    alt={conversation.user_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{conversation.user_name}</h4>
                    <p className="text-sm text-gray-600 truncate">{conversation.last_message}</p>
                    <p className="text-xs text-gray-500">{conversation.last_message_time}</p>
                  </div>
                  {conversation.unread_count > 0 && (
                    <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* منطقة الرسائل */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md flex flex-col">
          {selectedConversation ? (
            <>
              {/* رأس المحادثة */}
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">المحادثة</h3>
              </div>
              
              {/* الرسائل */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === selectedConversation ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === selectedConversation
                          ? 'bg-gray-200 text-gray-800'
                          : 'bg-primary-600 text-white'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* إدخال الرسالة */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="اكتب رسالتك..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !newMessage.trim()}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    إرسال
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>اختر محادثة لعرض الرسائل</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
```

### 4. نظام Google Tag Manager

#### A. GTM Utilities
```typescript
// src/utils/gtm.ts
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

export const gtmPush = (event: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
    console.log('📊 GTM Event:', event);
  }
};

export const trackLogin = (method: string = 'email', userType: string = 'regular') => {
  gtmPush({
    event: 'login',
    method,
    user_type: userType,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

export const trackSignUp = (method: string = 'email', userType: string = 'regular') => {
  gtmPush({
    event: 'sign_up',
    method,
    user_type: userType,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

export const trackSearch = (searchTerm: string, filters?: Record<string, any>, resultsCount?: number) => {
  gtmPush({
    event: 'search',
    search_term: searchTerm,
    search_filters: filters ? JSON.stringify(filters) : null,
    results_count: resultsCount,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

export const trackMessageSent = (messageType: string = 'text', recipientId: string, conversationId?: string) => {
  gtmPush({
    event: 'message_sent',
    message_type: messageType,
    recipient_id: recipientId,
    conversation_id: conversationId,
    language: document.documentElement.lang || 'ar',
    timestamp: new Date().toISOString()
  });
};

export const setupEnhancedEcommerce = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-7QWP1R3BES', {
      enhanced_ecommerce: true,
      send_page_view: true,
      anonymize_ip: true
    });
  }
};

export const setupPrivacySettings = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-7QWP1R3BES', {
      anonymize_ip: true,
      allow_google_signals: true,
      allow_ad_personalization_signals: false,
      cookie_flags: 'SameSite=None;Secure'
    });
  }
};
```

### 5. نظام الترجمة المتعدد اللغات

#### A. إعداد i18n
```typescript
// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// الترجمة العربية
const arTranslation = {
  common: {
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    search: 'بحث',
    messages: 'الرسائل',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج'
  },
  auth: {
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    age: 'العمر',
    city: 'المدينة',
    phone: 'رقم الهاتف'
  },
  search: {
    filters: 'فلاتر البحث',
    ageRange: 'نطاق العمر',
    education: 'التعليم',
    profession: 'المهنة',
    maritalStatus: 'الحالة الاجتماعية',
    results: 'النتائج'
  },
  messages: {
    conversations: 'المحادثات',
    newMessage: 'رسالة جديدة',
    send: 'إرسال',
    typeMessage: 'اكتب رسالتك...',
    lastMessage: 'آخر رسالة'
  }
};

// الترجمة الإنجليزية
const enTranslation = {
  common: {
    login: 'Login',
    register: 'Register',
    search: 'Search',
    messages: 'Messages',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout'
  },
  auth: {
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    age: 'Age',
    city: 'City',
    phone: 'Phone Number'
  },
  search: {
    filters: 'Search Filters',
    ageRange: 'Age Range',
    education: 'Education',
    profession: 'Profession',
    maritalStatus: 'Marital Status',
    results: 'Results'
  },
  messages: {
    conversations: 'Conversations',
    newMessage: 'New Message',
    send: 'Send',
    typeMessage: 'Type your message...',
    lastMessage: 'Last Message'
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: arTranslation },
      en: { translation: enTranslation }
    },
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export const changeLanguage = (language: string) => {
  console.log('🔄 changeLanguage called:', language);

  i18n.changeLanguage(language);

  // حفظ تفضيل اللغة في localStorage
  try {
    localStorage.setItem('preferred-language', language);
  } catch (error) {
    console.warn('Could not save language preference:', error);
  }

  // تحديث اتجاه الصفحة
  const isRTL = language === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = language;

  // تحديث class في body
  document.body.classList.toggle('rtl', isRTL);
  document.body.classList.toggle('ltr', !isRTL);

  console.log('✅ Language changed to:', language, '| Direction:', isRTL ? 'rtl' : 'ltr');
};

export default i18n;
```

### 6. نظام الأداء والمراقبة

#### A. مراقب الأداء
```typescript
// src/components/PerformanceMonitor.tsx
import React, { useEffect } from 'react';
import { trackPerformance } from '../utils/gtm';

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      console.warn('PerformanceObserver not supported in this environment.');
      return;
    }

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      trackPerformance('lcp_measurement', Math.round(lastEntry.startTime), 'ms');
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const firstInput = entries[0] as PerformanceEventTiming;
        trackPerformance('fid_measurement', Math.round(firstInput.duration), 'ms');
      }
    }).observe({ type: 'first-input', buffered: true });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      trackPerformance('cls_measurement', parseFloat(clsValue.toFixed(2)), 'score');
    }).observe({ type: 'layout-shift', buffered: true });

    // قياس مقاييس أخرى
    const measureOtherMetrics = () => {
      // استخدام الذاكرة (Chrome فقط)
      if ((navigator as any).deviceMemory) {
        trackPerformance('memory_usage', (navigator as any).deviceMemory, 'gb');
      }

      // معلومات الشبكة
      if (navigator.connection) {
        trackPerformance('network_info', 0, 'unknown');
      }
    };

    // قياس المقاييس الأخرى بعد التحميل الأولي
    window.addEventListener('load', measureOtherMetrics);

    return () => {
      window.removeEventListener('load', measureOtherMetrics);
    };
  }, []);

  return null; // هذا المكون لا يعرض أي شيء مرئي
};

export default PerformanceMonitor;
```

### 7. نظام الأمان المتقدم

#### A. حماية من SQL Injection
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// حماية من SQL Injection
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // إزالة علامات HTML
    .replace(/['"]/g, '') // إزالة علامات الاقتباس
    .replace(/[;]/g, '') // إزالة الفاصلة المنقوطة
    .replace(/[--]/g, '') // إزالة التعليقات
    .trim();
};

// استعلام آمن للمستخدمين
export const getUsersSafely = async (filters: Record<string, any>) => {
  try {
    let query = supabase
      .from('users')
      .select(`
        id,
        email,
        created_at,
        profiles!inner(
          first_name,
          last_name,
          age,
          city,
          country,
          profile_photo,
          is_verified
        )
      `)
      .eq('profiles.is_active', true);

    // تطبيق الفلاتر بأمان
    if (filters.ageMin) {
      query = query.gte('profiles.age', parseInt(filters.ageMin));
    }
    if (filters.ageMax) {
      query = query.lte('profiles.age', parseInt(filters.ageMax));
    }
    if (filters.city) {
      query = query.ilike('profiles.city', `%${sanitizeInput(filters.city)}%`);
    }
    if (filters.education) {
      query = query.eq('profiles.education', sanitizeInput(filters.education));
    }

    const { data, error } = await query.limit(20);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};
```

### 8. نظام التخزين المؤقت

#### A. إدارة التخزين المؤقت
```typescript
// src/utils/cache.ts
interface CacheItem {
  data: any;
  timestamp: number;
  expiry: number;
}

class CacheManager {
  private cache: Map<string, CacheItem> = new Map();
  private maxSize: number = 100;
  private defaultExpiry: number = 5 * 60 * 1000; // 5 دقائق

  set(key: string, data: any, expiry?: number): void {
    // تنظيف التخزين المؤقت إذا كان ممتلئاً
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const item: CacheItem = {
      data,
      timestamp: Date.now(),
      expiry: expiry || this.defaultExpiry
    };

    this.cache.set(key, item);
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // فحص انتهاء الصلاحية
    if (Date.now() - item.timestamp > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

export const cacheManager = new CacheManager();

// تنظيف التخزين المؤقت كل 5 دقائق
setInterval(() => {
  cacheManager.cleanup();
}, 5 * 60 * 1000);
```

## 🎯 الخلاصة

هذه الأمثلة التقنية توضح الابتكارات التقنية الفريدة في منصة رزقي:

### الميزات التقنية المتقدمة:
- ✅ نظام مصادقة آمن ومتقدم
- ✅ بحث ذكي مع فلاتر متعددة
- ✅ نظام رسائل آمن ومحمي
- ✅ تتبع متقدم مع Google Tag Manager
- ✅ ترجمة متعددة اللغات
- ✅ مراقبة الأداء في الوقت الفعلي
- ✅ حماية من الهجمات الإلكترونية
- ✅ نظام تخزين مؤقت ذكي

### التقنيات المستخدمة:
- ✅ React.js و TypeScript
- ✅ Supabase و PostgreSQL
- ✅ نظام أمان متقدم
- ✅ تحسين الأداء
- ✅ تحليلات متقدمة
- ✅ إدارة التخزين المؤقت

---

**تاريخ التطوير**: 2024-2025  
**المطور**: فريق تطوير رزقي  
**الإصدار**: 1.0.0  
**الموقع**: https://rezgee.com
