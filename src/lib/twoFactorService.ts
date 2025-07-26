/**
 * خدمة المصادقة الثنائية
 * تدير إنشاء وإرسال والتحقق من رموز المصادقة الثنائية عبر البريد الإلكتروني
 */

import { supabase } from './supabase';
import { FinalEmailService } from './finalEmailService';

// أنواع البيانات
export interface TwoFactorCode {
  id: string;
  user_id: string;
  email: string;
  code: string;
  code_type: 'login' | 'enable_2fa' | 'disable_2fa';
  is_used: boolean;
  attempts_count: number;
  max_attempts: number;
  expires_at: string;
  created_at: string;
  used_at?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface TwoFactorResult {
  success: boolean;
  message: string;
  code_id?: string;
  expires_at?: string;
  attempts_remaining?: number;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  code_id?: string;
}

class TwoFactorService {
  /**
   * توليد رمز تحقق مكون من 6 أرقام
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * إنشاء وإرسال رمز تحقق جديد
   */
  async sendVerificationCode(
    userId: string,
    email: string,
    codeType: 'login' | 'enable_2fa' | 'disable_2fa' = 'login',
    ipAddress?: string,
    userAgent?: string
  ): Promise<TwoFactorResult> {
    try {
      // التحقق من وجود رمز نشط حديث (أقل من دقيقة)
      let recentCodes: any[] = [];
      try {
        const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
        console.log('Checking for recent codes since:', oneMinuteAgo);

        const { data, error } = await supabase
          .from('two_factor_codes')
          .select('id, created_at, expires_at, is_used')
          .eq('user_id', userId)
          .eq('code_type', codeType)
          .eq('is_used', false)
          .gte('created_at', oneMinuteAgo)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error checking recent codes:', error);
          // نتابع العملية حتى لو فشل فحص الرموز الحديثة
          recentCodes = [];
        } else {
          recentCodes = data || [];
          console.log('Found recent codes:', recentCodes.length);
        }
      } catch (error) {
        console.error('Exception checking recent codes:', error);
        recentCodes = [];
      }

      const recentCode = recentCodes && recentCodes.length > 0 ? recentCodes[0] : null;

      if (recentCode) {
        console.log('Recent code found, blocking new request');
        return {
          success: false,
          message: 'يرجى الانتظار دقيقة واحدة قبل طلب رمز جديد',
          expires_at: recentCode.expires_at
        };
      }

      // إلغاء الرموز السابقة غير المستخدمة
      try {
        console.log('Invalidating previous unused codes...');
        const { error: updateError } = await supabase
          .from('two_factor_codes')
          .update({ is_used: true, used_at: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('code_type', codeType)
          .eq('is_used', false);

        if (updateError) {
          console.error('Error invalidating previous codes:', updateError);
          // نتابع العملية حتى لو فشل إلغاء الرموز السابقة
        } else {
          console.log('Previous codes invalidated successfully');
        }
      } catch (error) {
        console.error('Exception invalidating previous codes:', error);
      }

      // توليد رمز جديد
      const code = this.generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق

      console.log('Generating new 2FA code:', {
        userId,
        email,
        codeType,
        expiresAt: expiresAt.toISOString()
      });

      // تنظيف وتحضير البيانات للحفظ
      const insertData: any = {
        user_id: userId,
        email: email,
        code: code,
        code_type: codeType,
        expires_at: expiresAt.toISOString()
      };

      // إضافة IP address فقط إذا كان صحيحاً
      if (ipAddress &&
          typeof ipAddress === 'string' &&
          ipAddress !== 'unknown' &&
          ipAddress !== 'undefined' &&
          ipAddress !== 'null' &&
          ipAddress.trim() !== '' &&
          ipAddress.toLowerCase() !== 'unknown' &&
          ipAddress.toLowerCase() !== 'undefined') {

        // التحقق من صحة عنوان IP (IPv4 أو IPv6 محسن)
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;

        const trimmedIP = ipAddress.trim();

        if (ipv4Regex.test(trimmedIP) || ipv6Regex.test(trimmedIP)) {
          insertData.ip_address = trimmedIP;
          console.log('Valid IP address added:', trimmedIP);
        } else {
          console.log('Invalid IP address ignored:', ipAddress);
        }
      } else {
        console.log('IP address not provided or invalid:', ipAddress);
      }

      // إضافة User Agent فقط إذا كان متوفراً وصحيحاً
      if (userAgent &&
          typeof userAgent === 'string' &&
          userAgent !== 'unknown' &&
          userAgent !== 'undefined' &&
          userAgent !== 'null' &&
          userAgent.trim() !== '' &&
          userAgent.toLowerCase() !== 'unknown' &&
          userAgent.toLowerCase() !== 'undefined') {

        const trimmedUserAgent = userAgent.trim();
        if (trimmedUserAgent.length > 0 && trimmedUserAgent.length <= 1000) { // حد أقصى معقول
          insertData.user_agent = trimmedUserAgent;
          console.log('User agent added successfully');
        } else {
          console.log('User agent too long or empty, ignored');
        }
      } else {
        console.log('User agent not provided or invalid:', userAgent);
      }

      // حفظ الرمز في قاعدة البيانات
      console.log('Inserting 2FA code into database...');
      const { data: newCode, error: insertError } = await supabase
        .from('two_factor_codes')
        .insert(insertData)
        .select('id, created_at, expires_at')
        .single();

      if (!insertError && newCode) {
        console.log('2FA code created successfully:', newCode.id);
      }

      if (insertError) {
        console.error('Error saving 2FA code:', insertError);
        console.error('Insert data was:', JSON.stringify(insertData, null, 2));

        // معالجة أخطاء محددة
        if (insertError.message && insertError.message.includes('invalid input syntax for type inet')) {
          console.error('IP address validation failed. IP was:', ipAddress);
          return {
            success: false,
            message: 'خطأ في معالجة عنوان IP. يرجى المحاولة مرة أخرى.'
          };
        }

        return {
          success: false,
          message: 'حدث خطأ في إنشاء رمز التحقق'
        };
      }

      // إرسال الرمز عبر البريد الإلكتروني
      const emailSent = await this.sendCodeByEmail(email, code, codeType);
      
      if (!emailSent) {
        // حذف الرمز إذا فشل الإرسال
        await supabase
          .from('two_factor_codes')
          .delete()
          .eq('id', newCode.id);

        return {
          success: false,
          message: 'فشل في إرسال رمز التحقق عبر البريد الإلكتروني'
        };
      }

      return {
        success: true,
        message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
        code_id: newCode.id,
        expires_at: expiresAt.toISOString()
      };

    } catch (error) {
      console.error('Error in sendVerificationCode:', error);
      return {
        success: false,
        message: 'حدث خطأ غير متوقع'
      };
    }
  }

  /**
   * التحقق من صحة رمز التحقق
   */
  async verifyCode(
    userId: string,
    code: string,
    codeType: 'login' | 'enable_2fa' | 'disable_2fa' = 'login'
  ): Promise<VerificationResult> {
    try {
      // استخدام الدالة المخزنة للتحقق
      const { data, error } = await supabase
        .rpc('verify_two_factor_code', {
          p_user_id: userId,
          p_code: code,
          p_code_type: codeType
        });

      if (error) {
        console.error('Error verifying 2FA code:', error);
        return {
          success: false,
          message: 'حدث خطأ في التحقق من الرمز'
        };
      }

      const result = data[0];
      
      if (!result.success) {
        // تسجيل المحاولة الفاشلة
        await supabase.rpc('record_failed_two_factor_attempt', {
          p_user_id: userId,
          p_code: code,
          p_code_type: codeType
        });
      }

      return {
        success: result.success,
        message: result.message,
        code_id: result.code_id
      };

    } catch (error) {
      console.error('Error in verifyCode:', error);
      return {
        success: false,
        message: 'حدث خطأ غير متوقع'
      };
    }
  }

  /**
   * إرسال رمز التحقق عبر البريد الإلكتروني
   */
  private async sendCodeByEmail(
    email: string,
    code: string,
    codeType: 'login' | 'enable_2fa' | 'disable_2fa'
  ): Promise<boolean> {
    try {
      // تحديد نوع الرسالة حسب نوع الرمز
      let subject = '';
      let purpose = '';

      switch (codeType) {
        case 'login':
          subject = 'رمز تسجيل الدخول - رزجة';
          purpose = 'تسجيل الدخول إلى حسابك';
          break;
        case 'enable_2fa':
          subject = 'تفعيل المصادقة الثنائية - رزجة';
          purpose = 'تفعيل المصادقة الثنائية';
          break;
        case 'disable_2fa':
          subject = 'إلغاء المصادقة الثنائية - رزجة';
          purpose = 'إلغاء تفعيل المصادقة الثنائية';
          break;
      }

      // محتوى الرسالة
      const message = `
مرحباً،

تم طلب رمز تحقق لـ ${purpose} في موقع رزجة للزواج الإسلامي الشرعي.

رمز التحقق الخاص بك هو: ${code}

معلومات مهمة:
• هذا الرمز صالح لمدة 10 دقائق فقط
• لا يمكن استخدام الرمز أكثر من مرة واحدة
• لا تشارك هذا الرمز مع أي شخص آخر

إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.

مع تحيات فريق رزجة
موقع الزواج الإسلامي الشرعي

© 2025 رزجة - جميع الحقوق محفوظة

---
هذا إيميل تلقائي، يرجى عدم الرد عليه.
للاستفسارات: manage@kareemamged.com
      `;

      // في بيئة التطوير، نعرض الرمز في الكونسول أيضاً
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 رمز التحقق لـ ${email}: ${code}`);
        console.log(`📧 نوع الرمز: ${codeType}`);
        console.log(`⏰ صالح لمدة 10 دقائق`);
      }

      // إرسال البريد الإلكتروني باستخدام خدمة البريد الإلكتروني
      const emailResult = await FinalEmailService.sendEmail(email, subject, message);

      if (emailResult.success) {
        console.log(`✅ تم إرسال رمز المصادقة الثنائية بنجاح إلى ${email}`);
        if (emailResult.method) {
          console.log(`📧 طريقة الإرسال: ${emailResult.method}`);
        }
        return true;
      } else {
        console.error(`❌ فشل في إرسال رمز المصادقة الثنائية إلى ${email}:`, emailResult.error);
        return false;
      }

    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * الحصول على معلومات الرمز النشط
   */
  async getActiveCode(
    userId: string,
    codeType: 'login' | 'enable_2fa' | 'disable_2fa' = 'login'
  ): Promise<TwoFactorCode | null> {
    try {
      const { data, error } = await supabase
        .from('two_factor_codes')
        .select('*')
        .eq('user_id', userId)
        .eq('code_type', codeType)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting active code:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getActiveCode:', error);
      return null;
    }
  }

  /**
   * تنظيف الرموز المنتهية الصلاحية
   */
  async cleanupExpiredCodes(): Promise<void> {
    try {
      await supabase.rpc('cleanup_expired_two_factor_codes');
    } catch (error) {
      console.error('Error cleaning up expired codes:', error);
    }
  }
}

export const twoFactorService = new TwoFactorService();
