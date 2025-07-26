import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

/**
 * خدمة إدارة كلمات المرور المؤقتة
 * تتضمن توليد وإدارة كلمات المرور المؤقتة مع الأمان والتشفير
 */

export interface TemporaryPassword {
  id: string;
  user_id: string;
  email: string;
  temp_password_hash: string;
  temp_password_plain: string; // للاختبار فقط، سيتم حذفه في الإنتاج
  is_used: boolean;
  is_first_use: boolean;
  created_at: string;
  expires_at: string;
  used_at?: string;
  ip_address?: string;
  user_agent?: string;
  replaced_original: boolean;
}

export interface PasswordResetRequest {
  id: string;
  user_id: string;
  email: string;
  daily_requests_count: number;
  daily_reset_date: string;
  last_request_at?: string;
  monthly_requests_count: number;
  monthly_reset_date: string;
  unused_requests_count: number;
  is_blocked_until?: string;
  block_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface TemporaryPasswordResult {
  success: boolean;
  temporaryPassword?: string;
  expiresAt?: string;
  error?: string;
  waitTime?: number; // بالدقائق
  isBlocked?: boolean;
  blockReason?: string;
  recipientName?: string;
}

/**
 * توليد كلمة مرور مؤقتة قوية وعشوائية
 */
function generateSecureTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const specialChars = '!@#$%&*';
  let password = '';
  
  // إضافة 8 أحرف عشوائية
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // إضافة رمز خاص واحد
  password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
  // إضافة رقم واحد
  password += Math.floor(Math.random() * 10).toString();
  
  // خلط الأحرف
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * فحص قيود الطلبات للمستخدم
 */
async function checkRequestLimits(email: string): Promise<{
  canRequest: boolean;
  waitTime?: number;
  isBlocked?: boolean;
  blockReason?: string;
}> {
  try {
    // البحث عن المستخدم في جدول users بدلاً من auth.users
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (userError) {
      if (userError.code === 'PGRST116') {
        // المستخدم غير موجود
        return { canRequest: false };
      }
      throw userError;
    }

    if (!user) {
      return { canRequest: false };
    }

    // فحص سجل الطلبات
    const { data: resetRequest, error } = await supabase
      .from('password_reset_requests')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error;
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentMonth = now.toISOString().substring(0, 7); // YYYY-MM

    // إذا لم يكن هناك سجل، يمكن الطلب
    if (!resetRequest) {
      return { canRequest: true };
    }

    // فحص الحظر
    if (resetRequest.is_blocked_until) {
      const blockUntil = new Date(resetRequest.is_blocked_until);
      if (now < blockUntil) {
        return {
          canRequest: false,
          isBlocked: true,
          blockReason: resetRequest.block_reason || 'تم حظر الحساب مؤقتاً'
        };
      }
    }

    // إعادة تعيين العدادات اليومية والشهرية إذا لزم الأمر
    let dailyCount = resetRequest.daily_requests_count;
    // let monthlyCount = resetRequest.monthly_requests_count; // غير مستخدم حالياً
    let unusedCount = resetRequest.unused_requests_count;

    if (resetRequest.daily_reset_date !== today) {
      dailyCount = 0;
    }

    if (resetRequest.monthly_reset_date.substring(0, 7) !== currentMonth) {
      // monthlyCount = 0; // تم تعطيل هذا المتغير
      unusedCount = 0; // إعادة تعيين العداد الشهري للطلبات غير المستخدمة
    }

    // فحص الحد اليومي (3 طلبات)
    if (dailyCount >= 3) {
      return { canRequest: false };
    }

    // فحص الحد الشهري للطلبات غير المستخدمة (12 طلب)
    if (unusedCount >= 12) {
      return {
        canRequest: false,
        isBlocked: true,
        blockReason: 'تم تجاوز الحد الأقصى للطلبات غير المستخدمة'
      };
    }

    // فحص فترة الانتظار 5 دقائق
    if (resetRequest.last_request_at) {
      const lastRequest = new Date(resetRequest.last_request_at);
      const timeDiff = (now.getTime() - lastRequest.getTime()) / (1000 * 60); // بالدقائق
      
      if (timeDiff < 5) {
        return {
          canRequest: false,
          waitTime: Math.ceil(5 - timeDiff)
        };
      }
    }

    return { canRequest: true };
  } catch (error) {
    console.error('Error checking request limits:', error);
    return { canRequest: false };
  }
}

/**
 * تحديث سجل طلبات إعادة التعيين
 */
async function updateResetRequestRecord(userId: string, email: string): Promise<void> {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentMonth = now.toISOString().substring(0, 7);

  try {
    // محاولة الحصول على السجل الحالي
    const { data: existingRecord, error: fetchError } = await supabase
      .from('password_reset_requests')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingRecord) {
      // تحديث السجل الموجود
      let dailyCount = existingRecord.daily_requests_count;
      let monthlyCount = existingRecord.monthly_requests_count;
      let unusedCount = existingRecord.unused_requests_count;

      // إعادة تعيين العدادات إذا لزم الأمر
      if (existingRecord.daily_reset_date !== today) {
        dailyCount = 0;
      }

      if (existingRecord.monthly_reset_date.substring(0, 7) !== currentMonth) {
        monthlyCount = 0;
        unusedCount = 0;
      }

      // فحص إضافي: إذا وصل العداد الشهري لـ 12، تطبيق حظر شهري
      if (unusedCount >= 12) {
        const blockUntil = new Date();
        blockUntil.setMonth(blockUntil.getMonth() + 1); // حظر لمدة شهر

        await supabase
          .from('password_reset_requests')
          .update({
            is_blocked_until: blockUntil.toISOString(),
            block_reason: 'تم تجاوز الحد الأقصى للطلبات غير المستخدمة (12 طلب)',
            updated_at: now.toISOString()
          })
          .eq('user_id', userId);

        throw new Error('تم حظر الحساب لمدة شهر بسبب تجاوز الحد الأقصى للطلبات غير المستخدمة');
      }

      const { error: updateError } = await supabase
        .from('password_reset_requests')
        .update({
          daily_requests_count: dailyCount + 1,
          daily_reset_date: today,
          last_request_at: now.toISOString(),
          monthly_requests_count: monthlyCount + 1,
          monthly_reset_date: today,
          unused_requests_count: unusedCount + 1,
          updated_at: now.toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    } else {
      // إنشاء سجل جديد
      const { error: insertError } = await supabase
        .from('password_reset_requests')
        .insert({
          user_id: userId,
          email,
          daily_requests_count: 1,
          daily_reset_date: today,
          last_request_at: now.toISOString(),
          monthly_requests_count: 1,
          monthly_reset_date: today,
          unused_requests_count: 1
        });

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error updating reset request record:', error);
    throw error;
  }
}

/**
 * تنظيف الحسابات المحظورة منتهية الصلاحية
 */
export async function cleanupExpiredBlocks(): Promise<{ success: boolean; clearedCount: number }> {
  try {
    const now = new Date();

    const { data: clearedRecords, error } = await supabase
      .from('password_reset_requests')
      .update({
        is_blocked_until: null,
        block_reason: null,
        updated_at: now.toISOString()
      })
      .lt('is_blocked_until', now.toISOString())
      .select('id');

    if (error) throw error;

    return {
      success: true,
      clearedCount: clearedRecords?.length || 0
    };
  } catch (error) {
    console.error('Error cleaning up expired blocks:', error);
    return { success: false, clearedCount: 0 };
  }
}

/**
 * إنشاء كلمة مرور مؤقتة جديدة
 */
export async function createTemporaryPassword(email: string): Promise<TemporaryPasswordResult> {
  try {
    // تنظيف كلمات المرور المنتهية الصلاحية أولاً
    await supabase.rpc('cleanup_expired_temporary_passwords');

    // فحص قيود الطلبات
    const limitCheck = await checkRequestLimits(email);
    if (!limitCheck.canRequest) {
      return {
        success: false,
        error: limitCheck.isBlocked
          ? limitCheck.blockReason || 'تم حظر الحساب مؤقتاً'
          : limitCheck.waitTime
            ? `يجب الانتظار ${limitCheck.waitTime} دقيقة قبل الطلب مرة أخرى`
            : 'تم تجاوز الحد الأقصى للطلبات اليومية',
        waitTime: limitCheck.waitTime,
        isBlocked: limitCheck.isBlocked,
        blockReason: limitCheck.blockReason
      };
    }

    // البحث عن المستخدم في جدول users
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, first_name')
      .eq('email', email.toLowerCase())
      .single();

    if (userError) {
      if (userError.code === 'PGRST116') {
        return {
          success: false,
          error: 'البريد الإلكتروني غير مسجل في النظام'
        };
      }
      throw userError;
    }

    if (!user) {
      return {
        success: false,
        error: 'البريد الإلكتروني غير مسجل في النظام'
      };
    }

    // توليد كلمة مرور مؤقتة
    const temporaryPassword = generateSecureTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    // تحديد وقت انتهاء الصلاحية (60 دقيقة)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 60);

    // حفظ كلمة المرور المؤقتة في قاعدة البيانات
    const { error: insertError } = await supabase
      .from('temporary_passwords')
      .insert({
        user_id: user.id,
        email,
        temp_password_hash: hashedPassword,
        temp_password_plain: temporaryPassword, // للاختبار فقط
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // تحديث سجل طلبات إعادة التعيين
    await updateResetRequestRecord(user.id, email);

    return {
      success: true,
      temporaryPassword,
      expiresAt: expiresAt.toISOString(),
      recipientName: user.first_name
    };

  } catch (error: any) {
    console.error('Error creating temporary password:', error);
    return {
      success: false,
      error: 'حدث خطأ أثناء إنشاء كلمة المرور المؤقتة'
    };
  }
}

/**
 * التحقق من صحة كلمة المرور المؤقتة
 */
export async function verifyTemporaryPassword(
  email: string, 
  password: string
): Promise<{
  isValid: boolean;
  isTemporary?: boolean;
  tempPasswordId?: string;
  isFirstUse?: boolean;
}> {
  try {
    // البحث عن كلمات المرور المؤقتة الصالحة للمستخدم
    const { data: tempPasswords, error } = await supabase
      .from('temporary_passwords')
      .select('*')
      .eq('email', email)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // فحص كل كلمة مرور مؤقتة
    for (const tempPassword of tempPasswords || []) {
      const isMatch = await bcrypt.compare(password, tempPassword.temp_password_hash);
      if (isMatch) {
        return {
          isValid: true,
          isTemporary: true,
          tempPasswordId: tempPassword.id,
          isFirstUse: tempPassword.is_first_use
        };
      }
    }

    return { isValid: false };
  } catch (error) {
    console.error('Error verifying temporary password:', error);
    return { isValid: false };
  }
}

/**
 * تسجيل استخدام كلمة المرور المؤقتة
 */
export async function markTemporaryPasswordAsUsed(
  tempPasswordId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('temporary_passwords')
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .eq('id', tempPasswordId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error marking temporary password as used:', error);
    return { success: false, error: error.message };
  }
}

/**
 * تحديث كلمة المرور باستخدام كلمة المرور المؤقتة
 */
export async function updatePasswordWithTempPassword(
  email: string,
  tempPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('update_password_with_temp', {
      user_email: email.toLowerCase(),
      temp_password: tempPassword,
      new_password: newPassword
    });

    if (error) {
      console.error('Error calling update_password_with_temp:', error);
      return { success: false, error: 'فشل في تحديث كلمة المرور' };
    }

    if (data && data.success) {
      return { success: true };
    } else {
      return { success: false, error: data?.error || 'فشل في تحديث كلمة المرور' };
    }
  } catch (error: any) {
    console.error('Error updating password with temp password:', error);
    return { success: false, error: error.message };
  }
}

/**
 * فحص ما إذا كانت كلمة المرور مؤقتة وصالحة
 */
export async function checkIfTemporaryPassword(
  email: string,
  password: string
): Promise<{ isTemporary: boolean; isValid: boolean; tempPasswordId?: string }> {
  try {
    const tempPasswordCheck = await verifyTemporaryPassword(email, password);

    if (tempPasswordCheck.isValid && tempPasswordCheck.isTemporary) {
      return {
        isTemporary: true,
        isValid: true,
        tempPasswordId: tempPasswordCheck.tempPasswordId
      };
    }

    return { isTemporary: false, isValid: false };
  } catch (error) {
    console.error('Error checking temporary password:', error);
    return { isTemporary: false, isValid: false };
  }
}
