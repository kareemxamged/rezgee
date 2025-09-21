/**
 * مدير الروابط الديناميكية للإيميلات
 * Dynamic Link Manager for Emails
 * رزقي - منصة الزواج الإسلامي الشرعي
 */

export interface LinkConfig {
  baseUrl: string;
  isLocalhost: boolean;
  currentDomain: string;
}

export class DynamicLinkManager {
  private static instance: DynamicLinkManager;
  private linkConfig: LinkConfig;

  private constructor() {
    this.linkConfig = this.detectEnvironment();
  }

  public static getInstance(): DynamicLinkManager {
    if (!DynamicLinkManager.instance) {
      DynamicLinkManager.instance = new DynamicLinkManager();
    }
    return DynamicLinkManager.instance;
  }

  /**
   * كشف البيئة الحالية وتحديد الدومين
   */
  private detectEnvironment(): LinkConfig {
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname.includes('localhost'));

    const currentDomain = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://rezge.com';

    const baseUrl = isLocalhost 
      ? 'http://localhost:3000' 
      : currentDomain;

    return {
      baseUrl,
      isLocalhost,
      currentDomain
    };
  }

  /**
   * تحديث إعدادات الروابط
   */
  public updateConfig(): void {
    this.linkConfig = this.detectEnvironment();
  }

  /**
   * الحصول على الرابط الأساسي
   */
  public getBaseUrl(): string {
    return this.linkConfig.baseUrl;
  }

  /**
   * إنشاء رابط ديناميكي
   */
  public createLink(path: string): string {
    // إزالة الشرطة المائلة الأولى إذا كانت موجودة
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${this.linkConfig.baseUrl}/${cleanPath}`;
  }

  /**
   * الروابط الأساسية للمنصة
   */
  public getPlatformLinks() {
    return {
      // الصفحات الرئيسية
      home: this.createLink('/'),
      dashboard: this.createLink('/dashboard'),
      login: this.createLink('/login'),
      register: this.createLink('/register'),
      
      // صفحات الأمان والخصوصية
      security: this.createLink('/security'),
      privacy: this.createLink('/privacy'),
      terms: this.createLink('/terms'),
      
      // صفحات الحساب
      profile: this.createLink('/profile'),
      settings: this.createLink('/settings'),
      account: this.createLink('/account'),
      
      // صفحات التواصل والدعم
      contact: this.createLink('/contact'),
      support: this.createLink('/support'),
      help: this.createLink('/help'),
      
      // صفحات التحقق والتأكيد
      verify: this.createLink('/verify'),
      confirm: this.createLink('/confirm'),
      
      // صفحات كلمة المرور
      forgotPassword: this.createLink('/forgot-password'),
      resetPassword: this.createLink('/reset-password'),
      changePassword: this.createLink('/change-password'),
      
      // صفحات الرسائل والتواصل
      messages: this.createLink('/messages'),
      chat: this.createLink('/chat'),
      notifications: this.createLink('/notifications'),
      
      // صفحات البحث والاستكشاف
      search: this.createLink('/search'),
      browse: this.createLink('/browse'),
      discover: this.createLink('/discover'),
      
      // صفحات الإعدادات المتقدمة
      preferences: this.createLink('/preferences'),
      privacySettings: this.createLink('/privacy-settings'),
      
      // صفحات التحقق الثنائي
      twoFactor: this.createLink('/two-factor'),
      twoFactorSetup: this.createLink('/two-factor/setup'),
      twoFactorVerify: this.createLink('/two-factor/verify'),
      
      // صفحات إضافية
      about: this.createLink('/about'),
      faq: this.createLink('/faq'),
      blog: this.createLink('/blog'),
      success: this.createLink('/success'),
      error: this.createLink('/error')
    };
  }

  /**
   * إنشاء رابط التحقق مع رمز
   */
  public createVerificationLink(token: string): string {
    return this.createLink(`verify?token=${token}`);
  }

  /**
   * إنشاء رابط إعادة تعيين كلمة المرور
   */
  public createPasswordResetLink(token: string): string {
    return this.createLink(`reset-password?token=${token}`);
  }

  /**
   * إنشاء رابط تأكيد تغيير البريد الإلكتروني
   */
  public createEmailChangeLink(token: string): string {
    return this.createLink(`confirm-email-change?token=${token}`);
  }

  /**
   * إنشاء رابط تأكيد تغيير رقم الهاتف
   */
  public createPhoneChangeLink(token: string): string {
    return this.createLink(`confirm-phone-change?token=${token}`);
  }

  /**
   * إنشاء رابط تأكيد الحساب
   */
  public createAccountConfirmationLink(token: string): string {
    return this.createLink(`confirm-account?token=${token}`);
  }

  /**
   * التحقق من صحة الرابط
   */
  public isValidLink(link: string): boolean {
    try {
      const url = new URL(link);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * الحصول على معلومات البيئة
   */
  public getEnvironmentInfo() {
    return {
      ...this.linkConfig,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      timestamp: new Date().toISOString()
    };
  }
}

// تصدير مثيل واحد
export const dynamicLinkManager = DynamicLinkManager.getInstance();
export default dynamicLinkManager;
