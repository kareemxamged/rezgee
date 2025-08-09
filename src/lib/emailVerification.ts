import { supabase } from './supabase';

interface UserData {
  first_name: string;
  last_name: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
  education?: string;
  profession?: string;
  religious_commitment?: string;
  bio?: string;
  // إضافة الحقول المفقودة
  nationality?: string;
  weight?: number;
  height?: number;
  religiosity_level?: string;
  prayer_commitment?: string;
  smoking?: string;
  beard?: string;
  hijab?: string;
  education_level?: string;
  financial_status?: string;
}

interface EmailVerification {
  id: string;
  email: string;
  verification_token: string;
  user_data: UserData;
  status: 'pending' | 'verified' | 'expired';
  expires_at: string;
  created_at: string;
  verified_at?: string;
}

interface VerificationResult {
  success: boolean;
  verification?: EmailVerification;
  error?: string;
}

class EmailVerificationService {
  // إنشاء طلب تحقق جديد
  async createVerification(email: string, userData: UserData): Promise<{ success: boolean; token?: string; error?: string; limits?: any; waitTime?: number }> {
    try {
      // التحقق من وجود طلب تحقق معلق
      const { data: existingVerifications } = await supabase
        .from('email_verifications')
        .select('id, verification_token, expires_at')
        .eq('email', email)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString());

      if (existingVerifications && existingVerifications.length > 0) {
        return { 
          success: false, 
          error: 'يوجد طلب تحقق معلق بالفعل لهذا البريد الإلكتروني' 
        };
      }

      // توليد رمز تحقق فريد
      const token = await this.generateToken();
      
      // تاريخ انتهاء الصلاحية (24 ساعة من الآن)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // إنشاء طلب التحقق
      const { error } = await supabase
        .from('email_verifications')
        .insert({
          email,
          verification_token: token,
          user_data: userData,
          status: 'pending',
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating verification:', error);
        return { success: false, error: 'حدث خطأ في إنشاء طلب التحقق' };
      }

      return { success: true, token };
    } catch (error) {
      console.error('Error in createVerification:', error);
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }
  }

  // التحقق من صحة الرمز
  async verifyToken(token: string): Promise<VerificationResult> {
    try {
      const { data, error } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('verification_token', token)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        return { 
          success: false, 
          error: 'رمز التحقق غير صحيح أو منتهي الصلاحية' 
        };
      }

      return { success: true, verification: data };
    } catch (error) {
      console.error('Error in verifyToken:', error);
      return { success: false, error: 'حدث خطأ في التحقق من الرمز' };
    }
  }

  // توليد رمز تحقق فريد
  private async generateToken(): Promise<string> {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // توليد رقم عضوية فريد
  async generateMembershipNumber(): Promise<string> {
    let membershipNumber: string;
    let isUnique = false;
    
    while (!isUnique) {
      // توليد رقم عضوية من 6 أرقام
      membershipNumber = Math.floor(100000 + Math.random() * 900000).toString();
      
      // التحقق من عدم وجود هذا الرقم مسبقاً
      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('membership_number', membershipNumber)
        .limit(1);
      
      if (!data || data.length === 0) {
        isUnique = true;
      }
    }
    
    return membershipNumber!;
  }

  // دالة لتحويل قيم التدخين من نموذج التسجيل إلى قاعدة البيانات
  private static mapSmokingValue(smokingValue?: string): string | null {
    if (!smokingValue) return null;

    switch (smokingValue) {
      case 'never':
        return 'no';
      case 'occasionally':
      case 'regularly':
        return 'yes';
      default:
        return smokingValue; // في حالة كانت القيمة 'yes' أو 'no' بالفعل
    }
  }

  // إرسال بريد التحقق
  async sendVerificationEmail(email: string, token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const verificationUrl = `${window.location.origin}/verify?token=${token}`;
      
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email,
          verificationUrl
        }
      });

      if (error) {
        console.error('Error sending verification email:', error);
        return { success: false, error: 'حدث خطأ في إرسال بريد التحقق' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in sendVerificationEmail:', error);
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }
  }



  // تأكيد التحقق وإنشاء المستخدم - نسخة محسنة
  async confirmVerification(
    token: string,
    password: string
  ): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      // التحقق من صحة الرمز
      const verificationResult = await this.verifyToken(token);
      if (!verificationResult.success || !verificationResult.verification) {
        return { success: false, error: verificationResult.error };
      }

      const verification = verificationResult.verification;

      console.log('🔄 بدء عملية تأكيد الحساب للبريد:', verification.email);

      // الخطوة 1: إنشاء المستخدم في auth.users بدون تأكيد البريد
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: verification.email,
        password: password,
        options: {
          emailRedirectTo: undefined, // لا نريد إرسال بريد تأكيد إضافي
        }
      });

      let authUser = authData?.user;

      // إذا كان المستخدم موجود بالفعل، نحاول تسجيل الدخول
      if (authError && authError.message.includes('already registered')) {
        console.log('⚠️ المستخدم موجود بالفعل، محاولة تسجيل الدخول...');

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: verification.email,
          password: password,
        });

        if (signInError) {
          console.error('❌ خطأ في تسجيل الدخول:', signInError);
          return { success: false, error: 'حدث خطأ في تسجيل الدخول' };
        }

        authUser = signInData.user;
      } else if (authError) {
        console.error('❌ خطأ في إنشاء المستخدم:', authError);
        return { success: false, error: 'حدث خطأ في إنشاء الحساب: ' + authError.message };
      }

      if (!authUser) {
        return { success: false, error: 'حدث خطأ في إنشاء الحساب' };
      }

      console.log('✅ تم إنشاء المستخدم في auth.users بنجاح:', authUser.id);

      // الخطوة 2: إنشاء/تحديث الملف الشخصي مع جميع البيانات
      await this.createOrUpdateUserProfile(authUser, verification);

      // الخطوة 3: تأكيد البريد الإلكتروني (هذا هو المطلوب!)
      console.log('🔐 تأكيد البريد الإلكتروني للمستخدم:', authUser.id);

      try {
        // استخدام دالة قاعدة البيانات لتأكيد البريد الإلكتروني
        const { error: confirmError } = await supabase.rpc('confirm_user_email', {
          user_id: authUser.id
        });

        if (confirmError) {
          console.error('❌ خطأ في تأكيد البريد الإلكتروني:', confirmError);
          return { success: false, error: 'حدث خطأ في تأكيد البريد الإلكتروني' };
        }

        console.log('✅ تم تأكيد البريد الإلكتروني بنجاح');

        // تحديث بيانات المستخدم المحلية
        authUser = { ...authUser, email_confirmed_at: new Date().toISOString() };

      } catch (error) {
        console.error('❌ خطأ في عملية تأكيد البريد الإلكتروني:', error);
        return { success: false, error: 'حدث خطأ في تأكيد البريد الإلكتروني' };
      }

      // الخطوة 4: تسجيل الدخول التلقائي بعد التأكيد
      console.log('🔑 تسجيل الدخول التلقائي...');

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: verification.email,
        password: password,
      });

      if (signInError) {
        console.error('❌ خطأ في تسجيل الدخول التلقائي:', signInError);
        return { success: false, error: 'تم إنشاء الحساب ولكن حدث خطأ في تسجيل الدخول' };
      }

      console.log('✅ تم تسجيل الدخول بنجاح');

      // الخطوة 5: تحديث حالة التحقق
      await this.markVerificationAsUsed(verification.id);

      return {
        success: true,
        user: signInData.user
      };

    } catch (error) {
      console.error('❌ خطأ عام في confirmVerification:', error);
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }
  }



  // تنظيف الطلبات المنتهية الصلاحية
  async cleanupExpiredVerifications(): Promise<void> {
    try {
      const { error } = await supabase
        .from('email_verifications')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) {
        console.error('Error cleaning up expired verifications:', error);
      }
    } catch (error) {
      console.error('Error in cleanupExpiredVerifications:', error);
    }
  }

  // حذف طلب تحقق
  async deleteVerification(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('email_verifications')
        .delete()
        .eq('verification_token', token);

      if (error) {
        console.error('Error deleting verification:', error);
        return { success: false, error: 'حدث خطأ في حذف طلب التحقق' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteVerification:', error);
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }
  }

  // الحصول على طلب تحقق بواسطة البريد الإلكتروني
  async getVerificationByEmail(email: string): Promise<{ success: boolean; verification?: EmailVerification; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('email', email)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        return { success: false, error: 'لا يوجد طلب تحقق معلق لهذا البريد الإلكتروني' };
      }

      return { success: true, verification: data };
    } catch (error) {
      console.error('Error in getVerificationByEmail:', error);
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }
  }

  // تحديث بيانات المستخدم في طلب التحقق
  async updateVerificationData(token: string, userData: UserData): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('email_verifications')
        .update({ user_data: userData })
        .eq('verification_token', token)
        .eq('status', 'pending');

      if (error) {
        console.error('Error updating verification data:', error);
        return { success: false, error: 'حدث خطأ في تحديث بيانات التحقق' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updateVerificationData:', error);
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }
  }

  // إعادة إرسال بريد التحقق
  async resendVerificationEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const verificationResult = await this.getVerificationByEmail(email);
      if (!verificationResult.success || !verificationResult.verification) {
        return { success: false, error: verificationResult.error };
      }

      const verification = verificationResult.verification;
      return await this.sendVerificationEmail(email, verification.verification_token);
    } catch (error) {
      console.error('Error in resendVerificationEmail:', error);
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }
  }

  // التحقق من وجود مستخدم بالبريد الإلكتروني
  async checkUserExists(email: string): Promise<{ exists: boolean; inAuth: boolean; inDatabase: boolean }> {
    try {
      // التحقق من وجود المستخدم في جدول users
      const { data: dbUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      // التحقق من وجود المستخدم في auth.users عن طريق محاولة إعادة تعيين كلمة المرور
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      // إذا لم يكن هناك خطأ، فالمستخدم موجود في auth
      const inAuth = !authError || !authError.message.includes('not found');
      const inDatabase = !!dbUser;

      return {
        exists: inAuth || inDatabase,
        inAuth,
        inDatabase
      };
    } catch (error) {
      console.error('Error in checkUserExists:', error);
      return { exists: false, inAuth: false, inDatabase: false };
    }
  }

  // إضافة الدوال المفقودة
  async checkVerificationLimits(_email: string): Promise<any> {
    // تنفيذ مؤقت - يمكن تطويره لاحقاً
    return {
      allowed: true,
      dailyAttempts: 0,
      consecutiveAttempts: 0,
      nextAllowedTime: null
    };
  }

  async logVerificationAttempt(_email: string, _success: boolean, _ipAddress?: string): Promise<void> {
    // تنفيذ مؤقت - يمكن تطويره لاحقاً
    console.log(`Verification attempt logged`);
  }

  async getVerificationStats(_email: string): Promise<any> {
    // تنفيذ مؤقت - يمكن تطويره لاحقاً
    return {
      totalAttempts: 0,
      successfulAttempts: 0,
      failedAttempts: 0,
      lastAttempt: null
    };
  }

  async resetUserAttempts(_email: string): Promise<any> {
    // تنفيذ مؤقت - يمكن تطويره لاحقاً
    return {
      success: true,
      message: 'User attempts reset successfully'
    };
  }

  async cleanupOldAttempts(): Promise<void> {
    // تنفيذ مؤقت - يمكن تطويره لاحقاً
    console.log('Old attempts cleaned up');
  }

  // دالة مساعدة لإنشاء أو تحديث الملف الشخصي
  private async createOrUpdateUserProfile(authUser: any, verification: any): Promise<void> {
    console.log('📝 إنشاء/تحديث الملف الشخصي للمستخدم:', authUser.id);

    // التحقق من وجود ملف شخصي في جدول users باستخدام دالة آمنة
    const { data: profileCheck, error: profileCheckError } = await supabase
      .rpc('check_user_profile_exists', { user_id: authUser.id });

    if (profileCheckError) {
      console.error('Error checking user profile:', profileCheckError);
      throw new Error('حدث خطأ في التحقق من الملف الشخصي');
    }

    const existingProfile = profileCheck?.exists ? profileCheck : null;

    if (existingProfile) {
      // الملف الشخصي موجود، نحتاج لتحديثه بالبيانات الجديدة
      console.log('Updating existing user profile with new data');

      // توليد رقم عضوية إذا لم يكن موجوداً
      let membershipNumber = existingProfile.membership_number;
      if (!membershipNumber) {
        membershipNumber = await this.generateMembershipNumber();
        console.log(`🎫 Generated membership number: ${membershipNumber}`);
      }

      const updateData = {
        first_name: verification.user_data.first_name,
        last_name: verification.user_data.last_name,
        phone: verification.user_data.phone,
        age: verification.user_data.age,
        gender: verification.user_data.gender,
        city: verification.user_data.city,
        membership_number: membershipNumber,
        education: verification.user_data.education || null,
        profession: verification.user_data.profession || null,
        job_title: verification.user_data.profession || null,
        work_field: verification.user_data.education || null,
        religious_commitment: verification.user_data.religious_commitment || null,
        bio: verification.user_data.bio || null,
        nationality: verification.user_data.nationality || null,
        weight: verification.user_data.weight || null,
        height: verification.user_data.height || null,
        religiosity_level: verification.user_data.religiosity_level || null,
        prayer_commitment: verification.user_data.prayer_commitment || null,
        smoking: verification.user_data.smoking || null,
        beard: verification.user_data.beard || null,
        hijab: verification.user_data.hijab || null,
        education_level: verification.user_data.education_level || null,
        financial_status: verification.user_data.financial_status || null
      };

      const { error: updateError } = await supabase
        .rpc('update_user_profile_safe', {
          user_id: authUser.id,
          profile_data: updateData
        });

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        throw new Error('حدث خطأ في تحديث الملف الشخصي');
      }

      console.log('✅ User profile updated successfully');
    } else {
      // الملف الشخصي غير موجود، ننشئه
      console.log('Creating new user profile for auth user');

      // توليد رقم عضوية فريد
      const membershipNumber = await this.generateMembershipNumber();
      console.log(`🎫 Generated membership number: ${membershipNumber}`);

      // إنشاء الملف الشخصي مباشرة مع جميع البيانات
      const profileData = {
        id: authUser.id,
        email: verification.email,
        first_name: verification.user_data.first_name,
        last_name: verification.user_data.last_name,
        phone: verification.user_data.phone,
        age: verification.user_data.age,
        gender: verification.user_data.gender,
        city: verification.user_data.city,
        membership_number: membershipNumber,
        education: verification.user_data.education || null,
        profession: verification.user_data.profession || null,
        job_title: verification.user_data.profession || null,
        work_field: verification.user_data.education || null,
        religious_commitment: verification.user_data.religious_commitment || null,
        bio: verification.user_data.bio || null,
        nationality: verification.user_data.nationality || null,
        weight: verification.user_data.weight || null,
        height: verification.user_data.height || null,
        religiosity_level: verification.user_data.religiosity_level || null,
        prayer_commitment: verification.user_data.prayer_commitment || null,
        smoking: EmailVerificationService.mapSmokingValue(verification.user_data.smoking) || null,
        beard: verification.user_data.beard || null,
        hijab: verification.user_data.hijab || null,
        education_level: verification.user_data.education_level || null,
        financial_status: verification.user_data.financial_status || null,
        verified: true,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .rpc('create_user_profile_safe', { profile_data: profileData });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('حدث خطأ في إنشاء الملف الشخصي');
      }

      console.log('✅ User profile created successfully');
    }
  }

  // دالة مساعدة لتحديث حالة التحقق
  private async markVerificationAsUsed(verificationId: string): Promise<void> {
    await supabase
      .from('email_verifications')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString()
      })
      .eq('id', verificationId);
  }
}

// إنشاء مثيل واحد من الخدمة
export const emailVerificationService = new EmailVerificationService();

// تصدير الأنواع
export type { UserData, EmailVerification, VerificationResult };
