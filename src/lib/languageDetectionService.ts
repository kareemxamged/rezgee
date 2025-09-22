// خدمة كشف اللغة الحالية للموقع
// Language Detection Service for Current Site Language

import i18n from 'i18next';

export type SupportedLanguage = 'ar' | 'en';

export interface LanguageDetectionResult {
  language: SupportedLanguage;
  isRTL: boolean;
  direction: 'rtl' | 'ltr';
  confidence: 'high' | 'medium' | 'low';
  source: 'localStorage' | 'i18n' | 'document' | 'default';
}

export class LanguageDetectionService {
  /**
   * كشف اللغة الحالية للموقع من مصادر متعددة
   */
  static getCurrentLanguage(): LanguageDetectionResult {
    console.log('🔍 كشف اللغة الحالية للموقع...');

    // 1. محاولة الحصول من localStorage
    const localStorageLang = this.getLanguageFromLocalStorage();
    if (localStorageLang) {
      console.log('✅ تم الحصول على اللغة من localStorage:', localStorageLang);
      return {
        language: localStorageLang,
        isRTL: localStorageLang === 'ar',
        direction: localStorageLang === 'ar' ? 'rtl' : 'ltr',
        confidence: 'high',
        source: 'localStorage'
      };
    }

    // 2. محاولة الحصول من i18n
    const i18nLang = this.getLanguageFromI18n();
    if (i18nLang) {
      console.log('✅ تم الحصول على اللغة من i18n:', i18nLang);
      return {
        language: i18nLang,
        isRTL: i18nLang === 'ar',
        direction: i18nLang === 'ar' ? 'rtl' : 'ltr',
        confidence: 'high',
        source: 'i18n'
      };
    }

    // 3. محاولة الحصول من document
    const documentLang = this.getLanguageFromDocument();
    if (documentLang) {
      console.log('✅ تم الحصول على اللغة من document:', documentLang);
      return {
        language: documentLang,
        isRTL: documentLang === 'ar',
        direction: documentLang === 'ar' ? 'rtl' : 'ltr',
        confidence: 'medium',
        source: 'document'
      };
    }

    // 4. اللغة الافتراضية
    console.log('⚠️ استخدام اللغة الافتراضية: ar');
    return {
      language: 'ar',
      isRTL: true,
      direction: 'rtl',
      confidence: 'low',
      source: 'default'
    };
  }

  /**
   * الحصول على اللغة من localStorage
   */
  private static getLanguageFromLocalStorage(): SupportedLanguage | null {
    try {
      const savedLang = localStorage.getItem('preferred-language');
      if (savedLang && ['ar', 'en'].includes(savedLang)) {
        return savedLang as SupportedLanguage;
      }
    } catch (error) {
      console.warn('⚠️ لا يمكن الوصول إلى localStorage:', error);
    }
    return null;
  }

  /**
   * الحصول على اللغة من i18n
   */
  private static getLanguageFromI18n(): SupportedLanguage | null {
    try {
      const currentLang = i18n.language;
      if (currentLang && ['ar', 'en'].includes(currentLang)) {
        return currentLang as SupportedLanguage;
      }
    } catch (error) {
      console.warn('⚠️ لا يمكن الوصول إلى i18n:', error);
    }
    return null;
  }

  /**
   * الحصول على اللغة من document
   */
  private static getLanguageFromDocument(): SupportedLanguage | null {
    try {
      // فحص lang attribute
      const docLang = document.documentElement.lang;
      if (docLang && ['ar', 'en'].includes(docLang)) {
        return docLang as SupportedLanguage;
      }

      // فحص dir attribute
      const docDir = document.documentElement.dir;
      if (docDir === 'rtl') {
        return 'ar';
      } else if (docDir === 'ltr') {
        return 'en';
      }

      // فحص body classes
      const bodyClasses = document.body.className;
      if (bodyClasses.includes('rtl')) {
        return 'ar';
      } else if (bodyClasses.includes('ltr')) {
        return 'en';
      }
    } catch (error) {
      console.warn('⚠️ لا يمكن الوصول إلى document:', error);
    }
    return null;
  }

  /**
   * التحقق من صحة اللغة المدخلة
   */
  static isValidLanguage(language: string): language is SupportedLanguage {
    return ['ar', 'en'].includes(language);
  }

  /**
   * تحويل اللغة إلى اتجاه النص
   */
  static getTextDirection(language: SupportedLanguage): 'rtl' | 'ltr' {
    return language === 'ar' ? 'rtl' : 'ltr';
  }

  /**
   * تحويل اللغة إلى حالة RTL
   */
  static isRTL(language: SupportedLanguage): boolean {
    return language === 'ar';
  }

  /**
   * الحصول على اسم اللغة بالعربية
   */
  static getLanguageName(language: SupportedLanguage): string {
    return language === 'ar' ? 'العربية' : 'الإنجليزية';
  }

  /**
   * الحصول على اسم اللغة بالإنجليزية
   */
  static getLanguageNameEn(language: SupportedLanguage): string {
    return language === 'ar' ? 'Arabic' : 'English';
  }

  /**
   * تسجيل معلومات اللغة للتصحيح
   */
  static logLanguageInfo(): void {
    const result = this.getCurrentLanguage();
    console.log('📊 معلومات اللغة الحالية:');
    console.log(`   اللغة: ${result.language} (${this.getLanguageName(result.language)})`);
    console.log(`   الاتجاه: ${result.direction}`);
    console.log(`   RTL: ${result.isRTL}`);
    console.log(`   الثقة: ${result.confidence}`);
    console.log(`   المصدر: ${result.source}`);
  }

  /**
   * مراقبة تغيير اللغة
   */
  static watchLanguageChange(callback: (language: SupportedLanguage) => void): () => void {
    let currentLanguage = this.getCurrentLanguage().language;

    const checkLanguageChange = () => {
      const newLanguage = this.getCurrentLanguage().language;
      if (newLanguage !== currentLanguage) {
        console.log(`🔄 تغيير اللغة: ${currentLanguage} → ${newLanguage}`);
        currentLanguage = newLanguage;
        callback(newLanguage);
      }
    };

    // فحص كل ثانية
    const interval = setInterval(checkLanguageChange, 1000);

    // إرجاع دالة لإيقاف المراقبة
    return () => {
      clearInterval(interval);
      console.log('⏹️ توقف مراقبة تغيير اللغة');
    };
  }
}

// تصدير مثيل افتراضي
export const languageDetectionService = LanguageDetectionService;

// تصدير دالة مساعدة للحصول على اللغة الحالية
export const getCurrentLanguage = (): SupportedLanguage => {
  return LanguageDetectionService.getCurrentLanguage().language;
};

// تصدير دالة مساعدة للتحقق من RTL
export const isCurrentLanguageRTL = (): boolean => {
  return LanguageDetectionService.getCurrentLanguage().isRTL;
};

// تصدير دالة مساعدة للحصول على الاتجاه
export const getCurrentTextDirection = (): 'rtl' | 'ltr' => {
  return LanguageDetectionService.getCurrentLanguage().direction;
};





