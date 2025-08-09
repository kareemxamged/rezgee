# 🔧 حل مشكلة اتصال Supabase

## 📋 وصف المشكلة

**الخطأ المبلغ عنه:**
```
POST https://sbtzngewizgeqzfbhfjy.supabase.co/auth/v1/token?grant_type=refresh_token net::ERR_CONNECTION_CLOSED
TypeError: Failed to fetch
at _refreshAccessToken (supabase-js.js:6489:20)
at _callRefreshToken (supabase-js.js:6584:42)
```

## 🔍 تشخيص المشكلة

### السبب الجذري:
- **خطأ اتصال شبكة** مع خادم Supabase أثناء تجديد رمز المصادقة
- **انقطاع مؤقت** في الاتصال بالإنترنت
- **مشاكل في DNS** أو جدار الحماية
- **انتهاء صلاحية refresh token** أو مشاكل في الجلسة

### الأسباب المحتملة:
1. **مشاكل الشبكة**: انقطاع الإنترنت، مشاكل DNS، حجب جدار الحماية
2. **مشاكل Supabase**: انتهاء صلاحية الرمز، مشاكل الخادم، تحديثات API
3. **مشاكل المتصفح**: CORS، ذاكرة التخزين المؤقت، إضافات المتصفح

## ✅ الحلول المطبقة

### 1. تحسين إعدادات Supabase Client

```typescript
// في lib/supabase.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    retryAttempts: 3, // إعادة المحاولة 3 مرات
  },
  global: {
    headers: {
      'X-Client-Info': 'rezge-app',
    },
    // timeout محسن للكشف السريع عن مشاكل الاتصال
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(15000), // 15 seconds timeout
      });
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

### 2. نظام إعادة المحاولة التلقائية

```typescript
// دالة إعادة المحاولة مع Exponential Backoff
export const retrySupabaseRequest = async <T>(
  requestFn: () => Promise<T>, 
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error: any) {
      const isNetworkError = error.message?.includes('Failed to fetch') || 
                            error.message?.includes('ERR_CONNECTION_CLOSED');
      
      if (i === maxRetries - 1 || !isNetworkError) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, i); // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

### 3. معالج أخطاء شامل

```typescript
// معالج أخطاء Supabase العام
export const handleSupabaseError = (error: any, context?: string) => {
  const errorMessage = error?.message || 'خطأ غير معروف';
  
  if (errorMessage.includes('Failed to fetch') || 
      errorMessage.includes('ERR_CONNECTION_CLOSED')) {
    console.warn(`🔄 مشكلة اتصال مؤقتة مع Supabase:`, errorMessage);
    
    // إشعار المستخدم بمشكلة الاتصال
    const event = new CustomEvent('supabase-connection-error', {
      detail: { error, context }
    });
    window.dispatchEvent(event);
    return;
  }
  
  if (errorMessage.includes('JWT expired')) {
    console.warn('🔑 انتهت صلاحية الجلسة، يتطلب تسجيل دخول جديد');
    supabase.auth.signOut();
    return;
  }
  
  console.error(`❌ خطأ Supabase:`, error);
};
```

### 4. مدير الاتصال المتقدم

```typescript
// src/utils/connectionManager.ts
class ConnectionManager {
  // مراقبة حالة الاتصال
  // فحص دوري للاتصال مع Supabase
  // اقتراح حلول للمستخدم
  // إشعارات تلقائية
}
```

**الميزات:**
- **مراقبة مستمرة** لحالة الاتصال
- **فحص دوري** كل 30 ثانية
- **اقتراح حلول** عند تكرار الأخطاء
- **إشعارات تلقائية** للواجهة

### 5. مكون عرض حالة الاتصال

```typescript
// src/components/ConnectionStatus.tsx
const ConnectionStatusComponent: React.FC = () => {
  // عرض حالة الاتصال الحالية
  // اقتراحات الحلول للمستخدم
  // زر إعادة المحاولة
  // تفاصيل تشخيصية
};
```

**الميزات:**
- **عرض بصري** لحالة الاتصال
- **اقتراحات تفاعلية** للحلول
- **زر إعادة المحاولة** للمستخدم
- **إخفاء تلقائي** عند عمل كل شيء بشكل طبيعي

### 6. تحسين AuthContext

```typescript
// تحسين refreshProfile مع معالجة الأخطاء
const refreshProfile = useCallback(async (): Promise<void> => {
  if (user) {
    try {
      await executeSupabaseRequest(
        () => loadUserProfile(user.id, true),
        'refreshProfile'
      );
    } catch (error) {
      handleSupabaseError(error, 'refreshProfile');
      return;
    }
    // ... باقي الكود
  }
}, [user]);
```

## 🛠️ الملفات المحدثة

### الملفات الأساسية:
- `src/lib/supabase.ts` - تحسين إعدادات العميل ومعالجة الأخطاء
- `src/contexts/AuthContext.tsx` - تحسين معالجة أخطاء المصادقة
- `src/utils/connectionManager.ts` (جديد) - مدير الاتصال المتقدم
- `src/components/ConnectionStatus.tsx` (جديد) - مكون عرض حالة الاتصال
- `src/App.tsx` - إضافة مكون حالة الاتصال

### ملفات التوثيق:
- `debug-supabase-connection.html` - أداة تشخيص تفاعلية
- `SUPABASE_CONNECTION_FIX.md` - هذا الملف

## 🎯 النتائج المتوقعة

### ✅ ما تم حله:
- **معالجة أخطاء الاتصال** تلقائياً
- **إعادة المحاولة الذكية** للطلبات الفاشلة
- **إشعارات المستخدم** بمشاكل الاتصال
- **حلول تفاعلية** للمستخدم
- **مراقبة مستمرة** لحالة الاتصال

### 🔄 السلوك الجديد:
1. **عند انقطاع الاتصال**: عرض إشعار للمستخدم مع اقتراحات
2. **عند عودة الاتصال**: إخفاء الإشعار تلقائياً
3. **عند فشل الطلبات**: إعادة المحاولة تلقائياً 3 مرات
4. **عند انتهاء الجلسة**: تسجيل خروج تلقائي وتنظيف البيانات

## 🧪 اختبار الحل

### للمطورين:
1. **قطع الإنترنت** مؤقتاً ولاحظ ظهور إشعار الاتصال
2. **أعد تشغيل الإنترنت** ولاحظ اختفاء الإشعار
3. **راقب وحدة التحكم** للتأكد من عمل إعادة المحاولة
4. **اختبر مع شبكة بطيئة** للتأكد من timeout

### للمستخدمين:
1. **استخدم الموقع بشكل طبيعي**
2. **لاحظ إشعارات الاتصال** عند وجود مشاكل
3. **استخدم زر إعادة المحاولة** عند الحاجة
4. **اتبع الاقتراحات** المعروضة لحل المشاكل

## 🚨 حلول سريعة للمستخدمين

### عند ظهور خطأ الاتصال:
1. **أعد تحميل الصفحة** (Ctrl+F5)
2. **تحقق من الإنترنت**
3. **امسح ذاكرة التخزين المؤقت**
4. **جرب متصفح آخر**
5. **سجل خروج ودخول مرة أخرى**

### للمطورين:
1. تحقق من [حالة Supabase](https://status.supabase.com)
2. راجع إعدادات CORS في مشروع Supabase
3. تحقق من صحة environment variables
4. راجع logs في Supabase Dashboard

## 📞 الدعم

إذا استمر ظهور الخطأ:
- راجع ملف `debug-supabase-connection.html` للتشخيص التفاعلي
- تحقق من حالة Supabase على الموقع الرسمي
- راجع إعدادات الشبكة والجدار الناري
- اتصل بدعم Supabase إذا كانت المشكلة من جانبهم
