import React, { useEffect } from 'react';
import { 
  setupEnhancedEcommerce, 
  setupConversionTracking, 
  setupPrivacySettings,
  setAdvancedUserProperties,
  checkGTMStatus 
} from '../utils/gtm';

const GTMInitializer: React.FC = () => {
  useEffect(() => {
    // تهيئة إعدادات GTM المتقدمة
    const initializeGTM = () => {
      try {
        // إعداد Enhanced Ecommerce
        setupEnhancedEcommerce();
        
        // إعداد Conversion Tracking
        setupConversionTracking();
        
        // إعداد Privacy Settings
        setupPrivacySettings();
        
        // إعداد خصائص المستخدم الافتراضية
        setAdvancedUserProperties({
          platform: 'web',
          app_version: '1.0.0',
          environment: import.meta.env.MODE,
          language: document.documentElement.lang || 'ar',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        
        // فحص حالة GTM
        const status = checkGTMStatus();
        console.log('🚀 GTM Initialized:', status);
        
      } catch (error) {
        console.error('❌ GTM Initialization Error:', error);
      }
    };
    
    // تأخير بسيط لضمان تحميل GTM
    const timer = setTimeout(initializeGTM, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return null; // هذا المكون لا يعرض أي شيء
};

export default GTMInitializer;
