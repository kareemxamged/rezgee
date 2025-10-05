import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import CaptchaComponent from './CaptchaComponent';
import CaptchaService, { type CaptchaAction, type CaptchaVerificationResult } from '../lib/captchaService';

// إعلان النوع لـ Google reCAPTCHA
declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

/**
 * خصائص مكون reCAPTCHA
 */
interface RecaptchaComponentProps {
  action: CaptchaAction;
  onVerify: (result: CaptchaVerificationResult) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  size?: 'compact' | 'normal' | 'invisible';
  theme?: 'light' | 'dark';
  showScore?: boolean;
  autoExecute?: boolean;
  userId?: string;
  sessionId?: string;
}

/**
 * مكون Google reCAPTCHA مع منطق الاحتياطي للمكون التقليدي
 */
const RecaptchaComponent: React.FC<RecaptchaComponentProps> = ({
  action,
  onVerify,
  onError,
  disabled = false,
  className = '',
  size = 'normal',
  theme = 'light',
  showScore = false,
  autoExecute = false,
  userId,
  sessionId
}) => {
  const { t, i18n } = useTranslation();
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  // مفاتيح reCAPTCHA مع نظام متدرج
  const PRIMARY_SITE_KEY = '6LewINIrAAAAACzqj4aHviy5SlRiV5Q2HaAC0XKP'; // المفتاح الحقيقي الجديد المقدم من المستخدم
  const FALLBACK_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // المفتاح التجريبي البديل
  
  const [currentSiteKey, setCurrentSiteKey] = useState(PRIMARY_SITE_KEY);
  const [keyErrors, setKeyErrors] = useState(0); // عداد أخطاء المفاتيح

  // تحميل Google reCAPTCHA
  useEffect(() => {
    const loadRecaptcha = () => {
      // التحقق من وجود reCAPTCHA بالفعل
      if (window.grecaptcha) {
        setRecaptchaLoaded(true);
        return;
      }

      // تنظيف شامل قبل التحميل
      if (recaptchaRef.current) {
        recaptchaRef.current.innerHTML = '';
        const attributes = Array.from(recaptchaRef.current.attributes);
        attributes.forEach(attr => {
          recaptchaRef.current?.removeAttribute(attr.name);
        });
        recaptchaRef.current.className = 'flex justify-center';
      }

      // إنشاء callback للتحقق من التحميل
      window.onRecaptchaLoad = () => {
        setRecaptchaLoaded(true);
        setRecaptchaError(null);
      };

      // إنشاء script tag لتحميل reCAPTCHA
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit&hl=${i18n.language}`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        console.error('❌ فشل في تحميل Google reCAPTCHA');
        
        // زيادة عداد الأخطاء
        const newErrorCount = keyErrors + 1;
        setKeyErrors(newErrorCount);
        
        // إذا كان هناك خطأ في المفتاح الحقيقي، جرب المفتاح التجريبي
        if (currentSiteKey === PRIMARY_SITE_KEY && newErrorCount === 1) {
          console.log('🔄 محاولة استخدام المفتاح التجريبي البديل...');
          setCurrentSiteKey(FALLBACK_SITE_KEY);
          setKeyErrors(0);
          setRecaptchaError(null);
          setIsInitialized(false); // إعادة تهيئة لضمان التبديل
          return;
        }
        
        // إذا كان هناك خطأ في المفتاح البديل أيضاً، استخدم المكون التقليدي
        if (currentSiteKey === FALLBACK_SITE_KEY && newErrorCount >= 1) {
          console.log('🔄 استخدام المكون التقليدي كاحتياطي...');
          
          // تنظيف شامل قبل التبديل للمكون التقليدي
          if (recaptchaRef.current) {
            const newElement = document.createElement('div');
            newElement.className = 'flex justify-center';
            newElement.id = `recaptcha-${Date.now()}`;
            
            recaptchaRef.current.parentNode?.replaceChild(newElement, recaptchaRef.current);
            recaptchaRef.current = newElement;
          }
          
          // إعادة تعيين جميع الحالات
          setIsInitialized(false);
          setRecaptchaVerified(false);
          setRecaptchaToken(null);
          setRecaptchaError(null);
          widgetIdRef.current = null;
          
          // التبديل للمكون التقليدي
          setRecaptchaError('فشل في تحميل reCAPTCHA');
          setUseFallback(true);
          setKeyErrors(0); // إعادة تعيين عداد الأخطاء
          return;
        }
        
        setRecaptchaError('فشل في تحميل reCAPTCHA');
        setUseFallback(true);
      };

      script.onload = () => {
        console.log('✅ تم تحميل Google reCAPTCHA بنجاح');
      };

      document.head.appendChild(script);

      // timeout للتحقق من التحميل
      const timeout = setTimeout(() => {
        if (!window.grecaptcha) {
          console.warn('⚠️ انتهت مهلة تحميل reCAPTCHA');
          
          // زيادة عداد الأخطاء
          const newErrorCount = keyErrors + 1;
          setKeyErrors(newErrorCount);
          
          // إذا كان هناك خطأ في المفتاح الحقيقي، جرب المفتاح التجريبي
          if (currentSiteKey === PRIMARY_SITE_KEY && newErrorCount === 1) {
            console.log('🔄 محاولة استخدام المفتاح التجريبي البديل...');
            setCurrentSiteKey(FALLBACK_SITE_KEY);
            setKeyErrors(0);
            setRecaptchaError(null);
            setIsInitialized(false); // إعادة تهيئة لضمان التبديل
            return;
          }
          
          // إذا كان هناك خطأ في المفتاح البديل أيضاً، استخدم المكون التقليدي
          if (currentSiteKey === FALLBACK_SITE_KEY && newErrorCount >= 1) {
            console.log('🔄 استخدام المكون التقليدي كاحتياطي...');
            
          // تنظيف شامل قبل التبديل للمكون التقليدي
          if (recaptchaRef.current) {
            const newElement = document.createElement('div');
            newElement.className = 'flex justify-center';
            newElement.id = `recaptcha-${Date.now()}`;
            
            recaptchaRef.current.parentNode?.replaceChild(newElement, recaptchaRef.current);
            recaptchaRef.current = newElement;
          }
            
            // إعادة تعيين جميع الحالات
            setIsInitialized(false);
            setRecaptchaVerified(false);
            setRecaptchaToken(null);
            setRecaptchaError(null);
            widgetIdRef.current = null;
            
            // التبديل للمكون التقليدي
            setRecaptchaError('انتهت مهلة تحميل reCAPTCHA');
            setUseFallback(true);
            setKeyErrors(0); // إعادة تعيين عداد الأخطاء
            return;
          }
          
          setRecaptchaError('انتهت مهلة تحميل reCAPTCHA');
          setUseFallback(true);
        }
      }, 10000); // 10 ثوان

      return () => {
        clearTimeout(timeout);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    loadRecaptcha();
  }, [i18n.language]);

  // تهيئة reCAPTCHA عند التحميل
  useEffect(() => {
    if (recaptchaLoaded && !disabled && !useFallback && recaptchaRef.current && !isInitialized) {
      try {
        // تنظيف شامل وتجديد العنصر بالكامل
        if (recaptchaRef.current) {
          // إنشاء عنصر جديد بدلاً من تنظيف القديم
          const newElement = document.createElement('div');
          newElement.className = 'flex justify-center';
          newElement.id = `recaptcha-${Date.now()}`;
          
          // استبدال العنصر القديم بالجديد
          recaptchaRef.current.parentNode?.replaceChild(newElement, recaptchaRef.current);
          recaptchaRef.current = newElement;
        }

        // تنظيف أي widget موجود مسبقاً
        if (widgetIdRef.current !== null && window.grecaptcha) {
          try {
            window.grecaptcha.reset(widgetIdRef.current);
          } catch (e) {
            console.log('تم تنظيف widget سابق');
          }
          widgetIdRef.current = null;
        }

        // تنظيف شامل لجميع widgets في الصفحة
        if (window.grecaptcha && window.grecaptcha.getResponse) {
          try {
            // الحصول على جميع widget IDs
            const allWidgets = document.querySelectorAll('[data-sitekey]');
            allWidgets.forEach(widget => {
              const widgetElement = widget as HTMLElement;
              if (widgetElement.id && window.grecaptcha.getResponse(widgetElement.id)) {
                try {
                  window.grecaptcha.reset(widgetElement.id);
                } catch (e) {
                  // تجاهل الأخطاء
                }
              }
            });
          } catch (e) {
            console.log('تم تنظيف widgets إضافية');
          }
        }

        const widgetId = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: currentSiteKey,
          size: size,
          theme: theme,
          callback: (token: string) => {
            console.log('✅ تم التحقق من reCAPTCHA:', token);
            setRecaptchaVerified(true);
            setRecaptchaToken(token);
            
            // إشعار المكون الأب بالتحقق الناجح
            onVerify({
              success: true,
              score: 1.0,
              action,
              message: 'تم التحقق من reCAPTCHA بنجاح',
              timestamp: new Date().toISOString(),
              token: token
            });
          },
          'expired-callback': () => {
            console.log('⏰ انتهت صلاحية reCAPTCHA');
            setRecaptchaVerified(false);
            setRecaptchaToken(null);
            
            if (onError) {
              onError('انتهت صلاحية التحقق، يرجى المحاولة مرة أخرى');
            }
          },
          'error-callback': () => {
            console.error('❌ خطأ في reCAPTCHA');
            setRecaptchaVerified(false);
            setRecaptchaToken(null);
            
            // زيادة عداد الأخطاء
            const newErrorCount = keyErrors + 1;
            setKeyErrors(newErrorCount);
            
            // إذا كان هناك خطأ في المفتاح الحقيقي، جرب المفتاح التجريبي
            if (currentSiteKey === PRIMARY_SITE_KEY && newErrorCount === 1) {
              console.log('🔄 محاولة استخدام المفتاح التجريبي البديل...');
              
              // إنشاء عنصر جديد قبل التبديل
              if (recaptchaRef.current && recaptchaRef.current.parentNode) {
                const newElement = document.createElement('div');
                newElement.className = 'flex justify-center';
                newElement.id = `recaptcha-${Date.now()}`;

                recaptchaRef.current.parentNode.replaceChild(newElement, recaptchaRef.current);
                recaptchaRef.current = newElement;
              }
              
              // إعادة تعيين جميع الحالات
              setIsInitialized(false);
              setRecaptchaVerified(false);
              setRecaptchaToken(null);
              setRecaptchaError(null);
              widgetIdRef.current = null;
              
              // التبديل للمفتاح التجريبي
              setCurrentSiteKey(FALLBACK_SITE_KEY);
              setKeyErrors(0);
              return;
            }
            
            // إذا كان هناك خطأ في المفتاح البديل أيضاً، استخدم المكون التقليدي
            if (currentSiteKey === FALLBACK_SITE_KEY && newErrorCount >= 1) {
              console.log('🔄 استخدام المكون التقليدي كاحتياطي...');
              
          // تنظيف شامل قبل التبديل للمكون التقليدي
          if (recaptchaRef.current) {
            const newElement = document.createElement('div');
            newElement.className = 'flex justify-center';
            newElement.id = `recaptcha-${Date.now()}`;
            
            recaptchaRef.current.parentNode?.replaceChild(newElement, recaptchaRef.current);
            recaptchaRef.current = newElement;
          }
              
              // إعادة تعيين جميع الحالات
              setIsInitialized(false);
              setRecaptchaVerified(false);
              setRecaptchaToken(null);
              setRecaptchaError(null);
              widgetIdRef.current = null;
              
              // التبديل للمكون التقليدي
              setUseFallback(true);
              setKeyErrors(0); // إعادة تعيين عداد الأخطاء
              return;
            }
            
            if (onError) {
              onError('حدث خطأ في التحقق، يرجى المحاولة مرة أخرى');
            }
          }
        });

        widgetIdRef.current = widgetId;
        setIsInitialized(true);
        console.log('✅ تم تهيئة reCAPTCHA بنجاح، Widget ID:', widgetId);
      } catch (error) {
        console.error('❌ خطأ في تهيئة reCAPTCHA:', error);
        
        // زيادة عداد الأخطاء
        const newErrorCount = keyErrors + 1;
        setKeyErrors(newErrorCount);
        
        // إذا كان هناك خطأ في المفتاح الحقيقي، جرب المفتاح التجريبي
        if (currentSiteKey === PRIMARY_SITE_KEY && newErrorCount === 1) {
          console.log('🔄 محاولة استخدام المفتاح التجريبي البديل...');
          
          // إنشاء عنصر جديد قبل التبديل
          if (recaptchaRef.current && recaptchaRef.current.parentNode) {
            const newElement = document.createElement('div');
            newElement.className = 'flex justify-center';
            newElement.id = `recaptcha-${Date.now()}`;

            recaptchaRef.current.parentNode.replaceChild(newElement, recaptchaRef.current);
            recaptchaRef.current = newElement;
          }
          
          // إعادة تعيين جميع الحالات
          setIsInitialized(false);
          setRecaptchaVerified(false);
          setRecaptchaToken(null);
          setRecaptchaError(null);
          widgetIdRef.current = null;
          
          // التبديل للمفتاح التجريبي
          setCurrentSiteKey(FALLBACK_SITE_KEY);
          setKeyErrors(0);
          return;
        }
        
        // إذا كان هناك خطأ في المفتاح البديل أيضاً، استخدم المكون التقليدي
        if (currentSiteKey === FALLBACK_SITE_KEY && newErrorCount >= 1) {
          console.log('🔄 استخدام المكون التقليدي كاحتياطي...');
          
          // تنظيف شامل قبل التبديل للمكون التقليدي
          if (recaptchaRef.current) {
            const newElement = document.createElement('div');
            newElement.className = 'flex justify-center';
            newElement.id = `recaptcha-${Date.now()}`;
            
            recaptchaRef.current.parentNode?.replaceChild(newElement, recaptchaRef.current);
            recaptchaRef.current = newElement;
          }
          
          // إعادة تعيين جميع الحالات
          setIsInitialized(false);
          setRecaptchaVerified(false);
          setRecaptchaToken(null);
          setRecaptchaError(null);
          widgetIdRef.current = null;
          
          // التبديل للمكون التقليدي
          setRecaptchaError('خطأ في تهيئة reCAPTCHA');
          setUseFallback(true);
          setKeyErrors(0); // إعادة تعيين عداد الأخطاء
          return;
        }
        
        setRecaptchaError('خطأ في تهيئة reCAPTCHA');
        setUseFallback(true);
      }
    }
  }, [recaptchaLoaded, disabled, useFallback, size, theme, action, onVerify, onError, isInitialized, currentSiteKey, keyErrors]);

  // تنظيف reCAPTCHA عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      // تنظيف شامل عند إلغاء تحميل المكون
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
          widgetIdRef.current = null;
          setIsInitialized(false);
        } catch (error) {
          console.error('❌ خطأ في تنظيف reCAPTCHA:', error);
        }
      }

      // تنظيف العنصر
      if (recaptchaRef.current) {
        recaptchaRef.current.innerHTML = '';
        const attributes = Array.from(recaptchaRef.current.attributes);
        attributes.forEach(attr => {
          recaptchaRef.current?.removeAttribute(attr.name);
        });
        recaptchaRef.current.className = 'flex justify-center';
      }

      // إعادة تعيين الحالات
      setIsInitialized(false);
      setRecaptchaVerified(false);
      setRecaptchaToken(null);
      setRecaptchaError(null);
    };
  }, []);

  // إعادة تحميل reCAPTCHA
  const resetRecaptcha = () => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
        setRecaptchaVerified(false);
        setRecaptchaToken(null);
        console.log('✅ تم إعادة تعيين reCAPTCHA');
      } catch (error) {
        console.error('❌ خطأ في إعادة تعيين reCAPTCHA:', error);
        // في حالة الخطأ، استخدم المكون التقليدي
        setUseFallback(true);
      }
    } else {
      // إذا لم يكن هناك widget، قم بإعادة تهيئة كاملة
      setIsInitialized(false);
      setRecaptchaVerified(false);
      setRecaptchaToken(null);
      setRecaptchaError(null);
      
      // تنظيف العنصر
      if (recaptchaRef.current) {
        recaptchaRef.current.innerHTML = '';
        const attributes = Array.from(recaptchaRef.current.attributes);
        attributes.forEach(attr => {
          recaptchaRef.current?.removeAttribute(attr.name);
        });
        recaptchaRef.current.className = 'flex justify-center';
      }
    }
  };

  // التحقق من صحة reCAPTCHA على الخادم
  const verifyRecaptcha = async (token: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // إرسال الطلب للخادم للتحقق من صحة token
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          action: action
        })
      });

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('❌ خطأ في التحقق من reCAPTCHA:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // إذا كان CAPTCHA غير مفعل، لا نعرض شيئاً
  if (!CaptchaService.isEnabled()) {
    return null;
  }

  // إذا كان هناك خطأ في تحميل reCAPTCHA أو تم تفعيل الاحتياطي، استخدم المكون التقليدي
  if (useFallback || recaptchaError) {
    console.log('🔄 استخدام المكون التقليدي كاحتياطي');
    return (
      <div className="space-y-2">
        <CaptchaComponent
          action={action}
          onVerify={onVerify}
          onError={onError}
          disabled={disabled}
          className={className}
          size="normal"
          theme="auto"
          showScore={showScore}
          autoExecute={autoExecute}
          userId={userId}
          sessionId={sessionId}
          hideLabels={true} // إخفاء النصوص عند استخدام المكون التقليدي
        />
      </div>
    );
  }

  // إذا لم يتم تحميل reCAPTCHA بعد، اعرض مؤشر تحميل
  if (!recaptchaLoaded) {
    return (
      <div className="flex items-center justify-center p-4 border border-gray-200 rounded-md bg-gray-50">
        <div className="flex items-center gap-2 text-gray-600">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">{t('contact.form.loadcaptcha', 'جاري تحميل التحقق الأمني...')}</span>
        </div>
      </div>
    );
  }

  // عرض reCAPTCHA
  return (
    <div className={`space-y-2 ${className}`}>
      {/* حاوية reCAPTCHA */}
      <div 
        ref={recaptchaRef}
        className="flex justify-center"
      />

      {/* رسالة النجاح - مخفية لتجنب إرباك المستخدم */}
      {false && recaptchaVerified && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-md p-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">
            {t('captcha.success', 'تم التحقق بنجاح')}
          </span>
        </div>
      )}

      {/* رسالة الخطأ - مخفية لتجنب إرباك المستخدم */}
      {recaptchaError && (
        <div className="hidden">
          {/* رسالة الخطأ مخفية لتجنب إرباك المستخدم */}
        </div>
      )}

      {/* معلومات إضافية - تظهر فقط عند استخدام المكون التقليدي */}
      {useFallback && (
        <div className="text-xs text-gray-500 text-center">
          {t('captcha.description', 'انقر على المربع للتحقق من أنك لست روبوت')}
        </div>
      )}

      {/* زر إعادة تعيين */}
      {recaptchaVerified && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={resetRecaptcha}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            {t('captcha.reset', 'إعادة تعيين')}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecaptchaComponent;




