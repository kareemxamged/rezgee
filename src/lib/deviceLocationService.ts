/**
 * خدمة متقدمة لجمع معلومات الجهاز والموقع الجغرافي
 * تستخدم عدة مصادر لضمان دقة المعلومات
 */

export interface DeviceInfo {
  // معلومات الشبكة
  ipAddress: string;
  publicIP?: string;
  localIP?: string;
  
  // معلومات الموقع الجغرافي
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  
  // معلومات الجهاز
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  operatingSystem: string;
  browser: string;
  browserVersion: string;
  userAgent: string;
  
  // معلومات إضافية
  screenResolution?: string;
  language: string;
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  
  // معلومات الشبكة المتقدمة
  connectionType?: string;
  networkProvider?: string;
  
  // معلومات الأمان
  isVPN?: boolean;
  isProxy?: boolean;
  isTor?: boolean;
  
  // الطوابع الزمنية
  timestamp: string;
  timezoneOffset: number;
}

export interface GeolocationData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp?: string;
  org?: string;
  as?: string;
}

export class DeviceLocationService {
  private static readonly GEOLOCATION_APIS = [
    'https://ipapi.co/json/',
    'https://ip-api.com/json/',
    'https://api.ipgeolocation.io/ipgeo?apiKey=free',
    'https://ipinfo.io/json'
  ];

  /**
   * جمع معلومات الجهاز والموقع بشكل شامل
   */
  static async collectDeviceInfo(): Promise<DeviceInfo> {
    try {
      // جمع معلومات الجهاز الأساسية
      const deviceInfo = this.getBasicDeviceInfo();
      
      // جمع معلومات الشبكة والموقع
      const networkInfo = await this.getNetworkInfo();
      const geolocationInfo = await this.getGeolocationInfo();
      
      // دمج جميع المعلومات
      return {
        ...deviceInfo,
        ...networkInfo,
        ...geolocationInfo,
        timestamp: new Date().toISOString(),
        timezoneOffset: new Date().getTimezoneOffset()
      };
    } catch (error) {
      console.error('خطأ في جمع معلومات الجهاز:', error);
      return this.getFallbackDeviceInfo();
    }
  }

  /**
   * جمع معلومات الجهاز الأساسية من المتصفح
   */
  private static getBasicDeviceInfo(): Partial<DeviceInfo> {
    const userAgent = navigator.userAgent;
    
    return {
      userAgent,
      browser: this.getBrowserInfo(userAgent),
      browserVersion: this.getBrowserVersion(userAgent),
      operatingSystem: this.getOperatingSystem(userAgent),
      deviceType: this.getDeviceType(userAgent),
      language: navigator.language || 'ar',
      platform: navigator.platform || 'unknown',
      screenResolution: `${screen.width}x${screen.height}`,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
      isTablet: /iPad|Android(?=.*\bMobile\b)/i.test(userAgent),
      isDesktop: !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent))
    };
  }

  /**
   * جمع معلومات الشبكة
   */
  private static async getNetworkInfo(): Promise<Partial<DeviceInfo>> {
    try {
      // محاولة الحصول على IP العام
      const publicIP = await this.getPublicIP();
      
      return {
        ipAddress: publicIP || 'غير محدد',
        publicIP: publicIP,
        connectionType: this.getConnectionType()
      };
    } catch (error) {
      console.error('خطأ في جمع معلومات الشبكة:', error);
      return {
        ipAddress: 'غير محدد',
        connectionType: 'غير محدد'
      };
    }
  }

  /**
   * جمع معلومات الموقع الجغرافي
   */
  private static async getGeolocationInfo(): Promise<Partial<DeviceInfo>> {
    try {
      // محاولة استخدام عدة خدمات لتحديد الموقع
      for (const api of this.GEOLOCATION_APIS) {
        try {
          const response = await fetch(api, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (compatible; Rezge-Security-Scanner/1.0)'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            return this.parseGeolocationData(data, api);
          }
        } catch (error) {
          console.warn(`فشل في استخدام خدمة ${api}:`, error);
          continue;
        }
      }
      
      // إذا فشلت جميع الخدمات، استخدم معلومات افتراضية
      return {
        country: 'غير محدد',
        region: 'غير محدد',
        city: 'غير محدد',
        timezone: 'غير محدد'
      };
    } catch (error) {
      console.error('خطأ في جمع معلومات الموقع:', error);
      return {
        country: 'غير محدد',
        region: 'غير محدد',
        city: 'غير محدد',
        timezone: 'غير محدد'
      };
    }
  }

  /**
   * تحليل بيانات الموقع الجغرافي من مختلف الخدمات
   */
  private static parseGeolocationData(data: any, api: string): Partial<DeviceInfo> {
    try {
      if (api.includes('ipapi.co')) {
        return {
          country: data.country_name,
          countryCode: data.country_code,
          region: data.region,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          isp: data.org
        };
      } else if (api.includes('ip-api.com')) {
        return {
          country: data.country,
          countryCode: data.countryCode,
          region: data.regionName,
          city: data.city,
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.timezone,
          isp: data.isp,
          org: data.org
        };
      } else if (api.includes('ipgeolocation.io')) {
        return {
          country: data.country_name,
          countryCode: data.country_code2,
          region: data.state_prov,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.time_zone?.name,
          isp: data.isp
        };
      } else if (api.includes('ipinfo.io')) {
        return {
          country: data.country,
          region: data.region,
          city: data.city,
          latitude: data.loc ? parseFloat(data.loc.split(',')[0]) : undefined,
          longitude: data.loc ? parseFloat(data.loc.split(',')[1]) : undefined,
          timezone: data.timezone,
          isp: data.org
        };
      }
      
      return {};
    } catch (error) {
      console.error('خطأ في تحليل بيانات الموقع:', error);
      return {};
    }
  }

  /**
   * الحصول على IP العام
   */
  private static async getPublicIP(): Promise<string | null> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      if (response.ok) {
        const data = await response.json();
        return data.ip;
      }
    } catch (error) {
      console.warn('فشل في الحصول على IP العام:', error);
    }
    
    try {
      const response = await fetch('https://ipapi.co/ip/');
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.warn('فشل في الحصول على IP العام (الطريقة الثانية):', error);
    }
    
    return null;
  }

  /**
   * تحديد نوع المتصفح
   */
  private static getBrowserInfo(userAgent: string): string {
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
    if (userAgent.includes('Trident')) return 'Internet Explorer';
    return 'Unknown Browser';
  }

  /**
   * تحديد إصدار المتصفح
   */
  private static getBrowserVersion(userAgent: string): string {
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edg|Opera|OPR)\/(\d+\.\d+)/);
    return match ? match[2] : 'غير محدد';
  }

  /**
   * تحديد نظام التشغيل
   */
  private static getOperatingSystem(userAgent: string): string {
    if (userAgent.includes('Windows NT 10.0')) return 'Windows 10';
    if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
    if (userAgent.includes('Windows NT 6.2')) return 'Windows 8';
    if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
    if (userAgent.includes('Windows NT 6.0')) return 'Windows Vista';
    if (userAgent.includes('Windows NT 5.1')) return 'Windows XP';
    if (userAgent.includes('Windows NT 5.0')) return 'Windows 2000';
    if (userAgent.includes('Mac OS X')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown OS';
  }

  /**
   * تحديد نوع الجهاز
   */
  private static getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' | 'unknown' {
    if (/iPad|Android(?=.*\bMobile\b)/i.test(userAgent)) return 'tablet';
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  /**
   * تحديد نوع الاتصال
   */
  private static getConnectionType(): string {
    try {
      // @ts-ignore
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        return connection.effectiveType || connection.type || 'غير محدد';
      }
    } catch (error) {
      console.warn('لا يمكن تحديد نوع الاتصال:', error);
    }
    return 'غير محدد';
  }

  /**
   * معلومات افتراضية في حالة الفشل
   */
  private static getFallbackDeviceInfo(): DeviceInfo {
    return {
      ipAddress: 'غير محدد',
      country: 'غير محدد',
      region: 'غير محدد',
      city: 'غير محدد',
      deviceType: 'unknown',
      operatingSystem: 'غير محدد',
      browser: 'غير محدد',
      browserVersion: 'غير محدد',
      userAgent: navigator.userAgent || 'غير محدد',
      language: navigator.language || 'ar',
      platform: navigator.platform || 'غير محدد',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      timestamp: new Date().toISOString(),
      timezoneOffset: new Date().getTimezoneOffset()
    };
  }

  /**
   * تنسيق معلومات الجهاز للعرض في الإيميل
   */
  static formatDeviceInfoForEmail(deviceInfo: DeviceInfo, language: 'ar' | 'en' = 'ar'): {
    deviceType: string;
    ipAddress: string;
    location: string;
    browser: string;
    operatingSystem: string;
    additionalInfo: string;
  } {
    const isRTL = language === 'ar';
    
    // تنسيق نوع الجهاز
    const deviceTypeText = language === 'ar' 
      ? (deviceInfo.deviceType === 'desktop' ? 'كمبيوتر مكتبي' :
         deviceInfo.deviceType === 'mobile' ? 'هاتف محمول' :
         deviceInfo.deviceType === 'tablet' ? 'جهاز لوحي' : 'جهاز غير محدد')
      : (deviceInfo.deviceType === 'desktop' ? 'Desktop' :
         deviceInfo.deviceType === 'mobile' ? 'Mobile' :
         deviceInfo.deviceType === 'tablet' ? 'Tablet' : 'Unknown Device');

    // تنسيق الموقع
    const locationParts = [];
    if (deviceInfo.city && deviceInfo.city !== 'غير محدد') locationParts.push(deviceInfo.city);
    if (deviceInfo.region && deviceInfo.region !== 'غير محدد') locationParts.push(deviceInfo.region);
    if (deviceInfo.country && deviceInfo.country !== 'غير محدد') locationParts.push(deviceInfo.country);
    
    const location = locationParts.length > 0 
      ? locationParts.join(isRTL ? '، ' : ', ')
      : (language === 'ar' ? 'غير محدد' : 'Not specified');

    // تنسيق المتصفح
    const browser = deviceInfo.browser && deviceInfo.browserVersion 
      ? `${deviceInfo.browser} ${deviceInfo.browserVersion}`
      : deviceInfo.browser || (language === 'ar' ? 'غير محدد' : 'Not specified');

    // تنسيق نظام التشغيل
    const operatingSystem = deviceInfo.operatingSystem || (language === 'ar' ? 'غير محدد' : 'Not specified');

    // معلومات إضافية
    const additionalInfo = [];
    if (deviceInfo.screenResolution) {
      additionalInfo.push(`${language === 'ar' ? 'دقة الشاشة' : 'Screen Resolution'}: ${deviceInfo.screenResolution}`);
    }
    if (deviceInfo.timezone && deviceInfo.timezone !== 'غير محدد') {
      additionalInfo.push(`${language === 'ar' ? 'المنطقة الزمنية' : 'Timezone'}: ${deviceInfo.timezone}`);
    }
    if (deviceInfo.connectionType && deviceInfo.connectionType !== 'غير محدد') {
      additionalInfo.push(`${language === 'ar' ? 'نوع الاتصال' : 'Connection Type'}: ${deviceInfo.connectionType}`);
    }
    if (deviceInfo.isp && deviceInfo.isp !== 'غير محدد') {
      additionalInfo.push(`${language === 'ar' ? 'مزود الخدمة' : 'ISP'}: ${deviceInfo.isp}`);
    }

    return {
      deviceType: deviceTypeText,
      ipAddress: deviceInfo.ipAddress,
      location,
      browser,
      operatingSystem,
      additionalInfo: additionalInfo.join(' | ')
    };
  }
}

export default DeviceLocationService;













