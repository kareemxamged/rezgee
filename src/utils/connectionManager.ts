/**
 * مدير الاتصال مع Supabase
 * يتعامل مع أخطاء الشبكة وإعادة المحاولة التلقائية
 */

import React from 'react';
import { supabase, retrySupabaseRequest, handleSupabaseError } from '../lib/supabase';

export interface ConnectionStatus {
  isOnline: boolean;
  isSupabaseReachable: boolean;
  lastChecked: Date;
  errorCount: number;
}

class ConnectionManager {
  private status: ConnectionStatus = {
    isOnline: navigator.onLine,
    isSupabaseReachable: true,
    lastChecked: new Date(),
    errorCount: 0
  };

  private listeners: ((status: ConnectionStatus) => void)[] = [];
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.setupEventListeners();
    this.startPeriodicCheck();
  }

  /**
   * إعداد مستمعي الأحداث
   */
  private setupEventListeners() {
    // مراقبة حالة الإنترنت
    window.addEventListener('online', () => {
      this.updateStatus({ isOnline: true });
      this.checkSupabaseConnection();
    });

    window.addEventListener('offline', () => {
      this.updateStatus({ isOnline: false, isSupabaseReachable: false });
    });

    // مراقبة أخطاء Supabase
    window.addEventListener('supabase-connection-error', (event: any) => {
      this.handleConnectionError(event.detail);
    });
  }

  /**
   * بدء الفحص الدوري للاتصال
   */
  private startPeriodicCheck() {
    this.checkInterval = setInterval(() => {
      if (this.status.isOnline) {
        this.checkSupabaseConnection();
      }
    }, 30000); // فحص كل 30 ثانية
  }

  /**
   * فحص الاتصال مع Supabase
   */
  private async checkSupabaseConnection(): Promise<boolean> {
    try {
      // محاولة طلب بسيط للتحقق من الاتصال
      const { error } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      const isReachable = !error || !this.isConnectionError(error);
      
      this.updateStatus({ 
        isSupabaseReachable: isReachable,
        lastChecked: new Date(),
        errorCount: isReachable ? 0 : this.status.errorCount + 1
      });

      return isReachable;
    } catch (error) {
      this.updateStatus({ 
        isSupabaseReachable: false,
        lastChecked: new Date(),
        errorCount: this.status.errorCount + 1
      });
      
      return false;
    }
  }

  /**
   * معالجة أخطاء الاتصال
   */
  private handleConnectionError(detail: { error: any; context?: string }) {
    const { error, context } = detail;
    
    this.updateStatus({ 
      isSupabaseReachable: false,
      errorCount: this.status.errorCount + 1
    });

    // إذا تجاوز عدد الأخطاء الحد المسموح، اقترح حلول
    if (this.status.errorCount >= 3) {
      this.suggestSolutions();
    }

    handleSupabaseError(error, context);
  }

  /**
   * اقتراح حلول للمستخدم
   */
  private suggestSolutions() {
    const solutions = [
      'تحقق من اتصال الإنترنت',
      'أعد تحميل الصفحة',
      'امسح ذاكرة التخزين المؤقت',
      'جرب متصفح آخر'
    ];

    console.warn('🔧 اقتراحات لحل مشكلة الاتصال:', solutions);
    
    // إرسال إشعار للواجهة
    const event = new CustomEvent('connection-solutions', {
      detail: { solutions, errorCount: this.status.errorCount }
    });
    window.dispatchEvent(event);
  }

  /**
   * تحديث حالة الاتصال
   */
  private updateStatus(updates: Partial<ConnectionStatus>) {
    this.status = { ...this.status, ...updates };
    this.notifyListeners();
  }

  /**
   * إشعار المستمعين بتغيير الحالة
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.status));
  }

  /**
   * فحص ما إذا كان الخطأ متعلق بالاتصال
   */
  private isConnectionError(error: any): boolean {
    const errorMessage = error?.message || '';
    return errorMessage.includes('Failed to fetch') ||
           errorMessage.includes('ERR_CONNECTION_CLOSED') ||
           errorMessage.includes('NetworkError') ||
           error?.name === 'AbortError';
  }

  /**
   * إضافة مستمع لتغييرات حالة الاتصال
   */
  public addStatusListener(listener: (status: ConnectionStatus) => void) {
    this.listeners.push(listener);
    // إرسال الحالة الحالية فوراً
    listener(this.status);
  }

  /**
   * إزالة مستمع
   */
  public removeStatusListener(listener: (status: ConnectionStatus) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * الحصول على حالة الاتصال الحالية
   */
  public getStatus(): ConnectionStatus {
    return { ...this.status };
  }

  /**
   * فحص الاتصال يدوياً
   */
  public async checkConnection(): Promise<boolean> {
    return this.checkSupabaseConnection();
  }

  /**
   * إعادة تعيين عداد الأخطاء
   */
  public resetErrorCount() {
    this.updateStatus({ errorCount: 0 });
  }

  /**
   * تنظيف الموارد
   */
  public cleanup() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.listeners = [];
  }
}

// إنشاء مثيل واحد من مدير الاتصال
export const connectionManager = new ConnectionManager();

/**
 * Hook لاستخدام حالة الاتصال في React
 */
export const useConnectionStatus = () => {
  const [status, setStatus] = React.useState<ConnectionStatus>(
    connectionManager.getStatus()
  );

  React.useEffect(() => {
    connectionManager.addStatusListener(setStatus);
    
    return () => {
      connectionManager.removeStatusListener(setStatus);
    };
  }, []);

  return status;
};

/**
 * دالة مساعدة لتنفيذ طلبات Supabase مع معالجة الأخطاء
 */
export const executeSupabaseRequest = async <T>(
  requestFn: () => Promise<T>,
  context?: string,
  maxRetries = 3
): Promise<T> => {
  try {
    return await retrySupabaseRequest(requestFn, maxRetries);
  } catch (error) {
    handleSupabaseError(error, context);
    throw error;
  }
};

/**
 * دالة للتحقق من صحة الاتصال قبل تنفيذ طلب مهم
 */
export const ensureConnection = async (): Promise<boolean> => {
  const status = connectionManager.getStatus();
  
  if (!status.isOnline) {
    throw new Error('لا يوجد اتصال بالإنترنت');
  }
  
  if (!status.isSupabaseReachable) {
    const isReachable = await connectionManager.checkConnection();
    if (!isReachable) {
      throw new Error('لا يمكن الوصول إلى خادم البيانات');
    }
  }
  
  return true;
};

export default connectionManager;
