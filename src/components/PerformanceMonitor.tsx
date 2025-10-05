import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  memoryUsage: number | null;
  networkSpeed: string | null;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  reportToAnalytics?: boolean;
  logToConsole?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = true,
  reportToAnalytics = true,
  logToConsole = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    memoryUsage: null,
    networkSpeed: null
  });

  useEffect(() => {
    if (!enabled) return;

    // قياس Core Web Vitals
    const measureWebVitals = () => {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
        
        if (reportToAnalytics && window.gtag) {
          window.gtag('event', 'lcp_measurement', {
            lcp_value: Math.round(lastEntry.startTime),
            lcp_element: 'unknown'
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fidValue = entry.processingStart ? entry.processingStart - entry.startTime : 0;
          setMetrics(prev => ({ ...prev, fid: fidValue }));
          
          if (reportToAnalytics && window.gtag) {
            window.gtag('event', 'fid_measurement', {
              fid_value: Math.round(fidValue),
              fid_element: 'unknown'
            });
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput && entry.value) {
            clsValue += entry.value;
          }
        });
        setMetrics(prev => ({ ...prev, cls: clsValue }));
        
        if (reportToAnalytics && window.gtag) {
          window.gtag('event', 'cls_measurement', {
            cls_value: Math.round(clsValue * 1000) / 1000
          });
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint') as PerformanceEntry;
        if (fcpEntry) {
          setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
          
          if (reportToAnalytics && window.gtag) {
            window.gtag('event', 'fcp_measurement', {
              fcp_value: Math.round(fcpEntry.startTime)
            });
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Time to First Byte (TTFB)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        setMetrics(prev => ({ ...prev, ttfb }));
        
        if (reportToAnalytics && window.gtag) {
          window.gtag('event', 'ttfb_measurement', {
            ttfb_value: Math.round(ttfb)
          });
        }
      }

      // مراقبة استخدام الذاكرة
      const checkMemoryUsage = () => {
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
          setMetrics(prev => ({ ...prev, memoryUsage: memoryUsage * 100 }));
          
          if (reportToAnalytics && window.gtag) {
            window.gtag('event', 'memory_usage', {
              memory_usage: Math.round(memoryUsage * 100)
            });
          }
        }
      };

      // مراقبة سرعة الشبكة
      const checkNetworkSpeed = () => {
        if ('connection' in navigator) {
          const connection = (navigator as any).connection;
          const speed = connection.effectiveType || 'unknown';
          setMetrics(prev => ({ ...prev, networkSpeed: speed }));
          
          if (reportToAnalytics && window.gtag) {
            window.gtag('event', 'network_speed', {
              network_speed: speed
            });
          }
        }
      };

      // تشغيل مراقبة الذاكرة والشبكة
      checkMemoryUsage();
      checkNetworkSpeed();
      
      // مراقبة دورية للذاكرة
      const memoryInterval = setInterval(checkMemoryUsage, 30000); // كل 30 ثانية
      
      // تنظيف المراقبين
      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        fcpObserver.disconnect();
        clearInterval(memoryInterval);
      };
    };

    // تشغيل المراقبة بعد تحميل الصفحة
    const cleanup = measureWebVitals();

    // تسجيل المقاييس في الكونسول إذا كان مفعلاً
    if (logToConsole) {
      console.log('🔍 Performance Monitor initialized');
      console.log('📊 Core Web Vitals monitoring active');
    }

    return cleanup;
  }, [enabled, reportToAnalytics, logToConsole]);

  // مراقبة تغييرات المقاييس
  useEffect(() => {
    if (logToConsole && Object.values(metrics).some(value => value !== null)) {
      console.log('📈 Performance Metrics:', metrics);
    }
  }, [metrics, logToConsole]);

  // تقييم الأداء
  const evaluatePerformance = () => {
    const scores = {
      lcp: metrics.lcp ? (metrics.lcp < 2500 ? 'good' : metrics.lcp < 4000 ? 'needs-improvement' : 'poor') : 'unknown',
      fid: metrics.fid ? (metrics.fid < 100 ? 'good' : metrics.fid < 300 ? 'needs-improvement' : 'poor') : 'unknown',
      cls: metrics.cls ? (metrics.cls < 0.1 ? 'good' : metrics.cls < 0.25 ? 'needs-improvement' : 'poor') : 'unknown'
    };

    if (logToConsole) {
      console.log('🎯 Performance Scores:', scores);
    }

    return scores;
  };

  // تشغيل التقييم
  useEffect(() => {
    if (metrics.lcp && metrics.fid && metrics.cls) {
      evaluatePerformance();
    }
  }, [metrics.lcp, metrics.fid, metrics.cls]);

  // لا نعرض أي شيء في الواجهة - المراقبة تعمل في الخلفية
  return null;
};

export default PerformanceMonitor;