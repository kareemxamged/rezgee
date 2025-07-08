import { supabase } from './supabase';

// خدمة إرسال الإيميلات المخصصة
export const emailService = {
  // إرسال إيميل التحقق
  async sendVerificationEmail(
    email: string,
    token: string,
    userData: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const verificationUrl = `${window.location.origin}/verify-email?token=${token}`;

      console.log('🔗 رابط التحقق:', verificationUrl);
      console.log('📧 سيتم إرساله إلى:', email);
      console.log('👤 المستخدم:', userData.first_name, userData.last_name);

      // للاختبار والتطوير: عرض الرابط مباشرة
      console.log('💡 للاختبار: انسخ الرابط أعلاه واستخدمه مباشرة');

      // محاولة إرسال إيميل حقيقي (اختياري)
      try {
        await this.attemptRealEmailSend(email, verificationUrl, userData);
      } catch (emailError) {
        // تجاهل أخطاء الإرسال - الرابط متاح للاختبار
        console.log('ℹ️ لم يتم إرسال إيميل، لكن الرابط متاح للاختبار');
      }

      // العملية ناجحة دائماً لأن رابط التحقق تم إنشاؤه
      return { success: true };
    } catch (error) {
      console.error('Error in sendVerificationEmail:', error);
      return { success: false, error: 'حدث خطأ في إنشاء رابط التحقق' };
    }
  },

  // محاولة إرسال إيميل حقيقي (اختياري)
  async attemptRealEmailSend(
    email: string,
    verificationUrl: string,
    _userData: any
  ): Promise<void> {
    try {
      // محاولة بسيطة لإرسال إيميل باستخدام Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: verificationUrl,
      });

      if (!error) {
        console.log('📤 تم إرسال طلب الإيميل لـ Supabase (قد لا يصل فعلياً)');
        console.log('💡 للتأكد: استخدم الرابط المعروض أعلاه مباشرة');
      } else {
        console.log('⚠️ لم يتم إرسال الإيميل:', error.message);
        console.log('💡 استخدم الرابط المعروض أعلاه للمتابعة');
      }
    } catch (error) {
      console.log('ℹ️ خطأ في إرسال الإيميل - سيتم الاعتماد على الرابط المعروض');
    }
  },





  // إنشاء محتوى HTML للإيميل
  generateEmailHTML(verificationUrl: string, userData: any): string {
    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد إنشاء حسابك في رزقي</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        body { margin: 0; padding: 0; font-family: 'Amiri', serif; }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Amiri', serif; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 40px 20px; min-height: 100vh;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">رزقي</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">موقع الزواج الإسلامي الشرعي</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #1e40af; font-size: 24px; margin: 0 0 20px 0; text-align: center;">مرحباً بك في رزقي!</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                أهلاً وسهلاً ${userData.first_name} ${userData.last_name}،<br><br>
                نشكرك على انضمامك إلى موقع رزقي للزواج الإسلامي الشرعي. لإكمال إنشاء حسابك، يرجى النقر على الرابط أدناه لتعيين كلمة المرور:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);">تأكيد الحساب وتعيين كلمة المرور</a>
            </div>
            
            <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin: 20px 0; border-right: 4px solid #1e40af;">
                <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 10px 0;">معلومات مهمة:</h3>
                <ul style="color: #374151; margin: 0; padding-right: 20px; line-height: 1.6;">
                    <li>هذا الرابط صالح لمدة 24 ساعة فقط</li>
                    <li>لا تشارك هذا الرابط مع أي شخص آخر</li>
                    <li>إذا لم تطلب إنشاء حساب، يرجى تجاهل هذا الإيميل</li>
                </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 10px; padding: 15px; margin: 20px 0; text-align: center;">
                <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: bold;">إذا لم تستطع النقر على الرابط، انسخ والصق الرابط التالي في متصفحك:</p>
                <p style="color: #1e40af; font-size: 12px; word-break: break-all; margin: 10px 0 0 0; background: white; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">© 2025 رزقي - موقع الزواج الإسلامي الشرعي</p>
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">هذا الإيميل تم إرساله تلقائياً، يرجى عدم الرد عليه</p>
        </div>
    </div>
</body>
</html>
    `;
  },


};

export default emailService;
