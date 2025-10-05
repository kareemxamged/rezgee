// أدوات تحسين الأداء - منصة رزقي

// تحسين تحميل الصور
export const optimizeImageLoading = {
  // تحويل الصور إلى WebP إذا كان المتصفح يدعمها
  convertToWebP: (src: string): string => {
    if (typeof window !== 'undefined' && 'WebP' in window) {
      return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return src;
  },

  // تحسين حجم الصور
  getOptimizedImageSrc: (src: string, width?: number, height?: number): string => {
    if (src.includes('supabase')) {
      // تحسين صور Supabase
      let optimizedSrc = src;
      if (width) optimizedSrc += `?width=${width}`;
      if (height) optimizedSrc += `&height=${height}`;
      optimizedSrc += '&quality=80&format=webp';
      return optimizedSrc;
    }
    return src;
  },

  // تحسين الخطوط
  preloadFonts: (fontUrls: string[]) => {
    if (typeof window !== 'undefined') {
      fontUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.href = url;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    }
  }
};

// تحسين DOM
export const optimizeDOM = {
  // تأخير تحميل العناصر غير المرئية
  lazyLoadElements: (selector: string, options?: IntersectionObserverInit) => {
    if (typeof window === 'undefined') return;

    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.classList.add('loaded');
          observer.unobserve(element);
        }
      });
    }, options);

    elements.forEach(element => observer.observe(element));
  },

  // تحسين الروابط
  preloadLinks: (links: string[]) => {
    if (typeof window === 'undefined') return;

    links.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    });
  },

  // تحسين الأحداث
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// تحسين الشبكة
export const optimizeNetwork = {
  // تحسين استعلامات API
  batchRequests: async <T>(
    requests: (() => Promise<T>)[],
    batchSize: number = 5
  ): Promise<T[]> => {
    const results: T[] = [];
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(request => request()));
      results.push(...batchResults);
    }
    
    return results;
  },

  // تحسين التخزين المؤقت
  cache: {
    set: (key: string, data: any, ttl: number = 300000) => {
      if (typeof window === 'undefined') return;
      
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      };
      
      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify(item));
      } catch (error) {
        console.warn('Failed to cache data:', error);
      }
    },

    get: (key: string): any => {
      if (typeof window === 'undefined') return null;
      
      try {
        const item = localStorage.getItem(`cache_${key}`);
        if (!item) return null;
        
        const parsed = JSON.parse(item);
        const now = Date.now();
        
        if (now - parsed.timestamp > parsed.ttl) {
          localStorage.removeItem(`cache_${key}`);
          return null;
        }
        
        return parsed.data;
      } catch (error) {
        console.warn('Failed to retrieve cached data:', error);
        return null;
      }
    },

    delete: (key: string) => {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(`cache_${key}`);
    },

    clear: () => {
      if (typeof window === 'undefined') return;
      
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    }
  }
};

// تحسين الأداء العام
export const optimizePerformance = {
  // تحسين تحميل الصفحة
  optimizePageLoad: () => {
    if (typeof window === 'undefined') return;

    // تحسين الخطوط
    const fontUrls = [
      '/fonts/NotoSansArabic-Regular.woff2',
      '/fonts/NotoSansArabic-Bold.woff2'
    ];
    optimizeImageLoading.preloadFonts(fontUrls);

    // تحسين الروابط
    const importantLinks = [
      '/dashboard',
      '/search',
      '/messages'
    ];
    optimizeDOM.preloadLinks(importantLinks);

    // تحسين العناصر
    optimizeDOM.lazyLoadElements('.lazy-load');
  },

  // تحسين الذاكرة
  optimizeMemory: () => {
    if (typeof window === 'undefined') return;

    // تنظيف دوري للذاكرة
    setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        if (usage > 0.8) {
          // تنظيف التخزين المؤقت
          optimizeNetwork.cache.clear();
          
          // إجبار garbage collection إذا كان متاحاً
          if (window.gc) {
            window.gc();
          }
        }
      }
    }, 60000); // كل دقيقة
  },

  // تحسين الشبكة
  optimizeNetwork: () => {
    if (typeof window === 'undefined') return;

    // مراقبة سرعة الشبكة
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      connection.addEventListener('change', () => {
        const speed = connection.effectiveType;
        
        // تحسين حسب سرعة الشبكة
        switch (speed) {
          case 'slow-2g':
          case '2g':
            // تقليل جودة الصور
            document.documentElement.setAttribute('data-network', 'slow');
            break;
          case '3g':
            // جودة متوسطة
            document.documentElement.setAttribute('data-network', 'medium');
            break;
          case '4g':
            // جودة عالية
            document.documentElement.setAttribute('data-network', 'fast');
            break;
        }
      });
    }
  }
};

// تحسين React
export const optimizeReact = {
  // تحسين re-renders
  memoize: <T extends (...args: any[]) => any>(fn: T): T => {
    const cache = new Map();
    
    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = fn(...args);
      cache.set(key, result);
      
      return result;
    }) as T;
  },

  // تحسين useCallback
  createStableCallback: <T extends (...args: any[]) => any>(
    callback: T,
    deps: any[]
  ): T => {
    const cache = new Map();
    const key = JSON.stringify(deps);
    
    if (!cache.has(key)) {
      cache.set(key, callback);
    }
    
    return cache.get(key);
  }
};

// تحسين CSS
export const optimizeCSS = {
  // تحسين CSS الحرجة
  inlineCriticalCSS: (css: string) => {
    if (typeof document === 'undefined') return;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  },

  // تحسين CSS غير الحرجة
  loadNonCriticalCSS: (href: string) => {
    if (typeof document === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  }
};

// تصدير جميع الأدوات
export default {
  optimizeImageLoading,
  optimizeDOM,
  optimizeNetwork,
  optimizePerformance,
  optimizeReact,
  optimizeCSS
};