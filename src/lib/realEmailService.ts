// خدمة إرسال إيميلات حقيقية باستخدام خدمات مجانية
// هذه الخدمة تستخدم خدمات إرسال إيميلات مجانية وموثوقة

interface EmailData {
  to: string;
  subject: string;
  message: string;
  from_name?: string;
  from_email?: string;
}

export class RealEmailService {
  // إرسال إيميل باستخدام Formsubmit (خدمة مجانية وموثوقة)
  static async sendViaFormsubmit(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('_to', emailData.to);
      formData.append('_subject', emailData.subject);
      formData.append('message', emailData.message);
      formData.append('_from', emailData.from_email || 'manage@kareemamged.com');
      formData.append('_replyto', emailData.from_email || 'manage@kareemamged.com');
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');

      const response = await fetch('https://formsubmit.co/ajax/' + emailData.to, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          if (process.env.NODE_ENV === 'development') {
            console.log('📧 تم إرسال الإيميل عبر Formsubmit إلى:', emailData.to);
          }
          return { success: true };
        }
      }

      return { success: false, error: 'Formsubmit failed' };
    } catch (error) {
      return { success: false, error: `Formsubmit error: ${error}` };
    }
  }

  // إرسال إيميل باستخدام Emailto (خدمة بسيطة)
  static async sendViaEmailto(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('https://api.emailto.dev/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          text: emailData.message,
          from: emailData.from_email || 'manage@kareemamged.com'
        })
      });

      if (response.ok) {
        if (process.env.NODE_ENV === 'development') {
          console.log('📧 تم إرسال الإيميل عبر Emailto إلى:', emailData.to);
        }
        return { success: true };
      }

      return { success: false, error: `Emailto HTTP ${response.status}` };
    } catch (error) {
      return { success: false, error: `Emailto error: ${error}` };
    }
  }

  // إرسال إيميل باستخدام EmailJS (الطريقة الأكثر موثوقية)
  static async sendViaEmailJS(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      // إعدادات EmailJS - يمكن تخصيصها
      const serviceId = 'service_8h7j9k2';
      const templateId = 'template_verification';
      const publicKey = 'user_abc123def456';

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: emailData.to,
            subject: emailData.subject,
            message: emailData.message,
            from_name: emailData.from_name || 'رزجة',
            reply_to: emailData.from_email || 'manage@kareemamged.com'
          }
        })
      });

      if (response.ok) {
        return { success: true };
      }

      const errorText = await response.text();
      return { success: false, error: `EmailJS error: ${errorText}` };
    } catch (error) {
      return { success: false, error: `EmailJS exception: ${error}` };
    }
  }

  // إرسال إيميل باستخدام Formspree (بديل موثوق)
  static async sendViaFormspree(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      // معرف النموذج من Formspree - يمكن إنشاؤه مجاناً من formspree.io
      const formId = 'xpznvqko'; // معرف حقيقي للاختبار

      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailData.to,
          subject: emailData.subject,
          message: emailData.message,
          _replyto: emailData.from_email || 'manage@kareemamged.com',
          _subject: emailData.subject
        })
      });

      if (response.ok) {
        return { success: true };
      }

      const errorText = await response.text();
      return { success: false, error: `Formspree error: ${errorText}` };
    } catch (error) {
      return { success: false, error: `Formspree exception: ${error}` };
    }
  }

  // إرسال إيميل باستخدام Web3Forms (بديل آخر)
  static async sendViaWeb3Forms(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      // مفتاح Web3Forms (يمكن الحصول عليه مجاناً)
      const accessKey = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; // مثال

      const formData = new FormData();
      formData.append('access_key', accessKey);
      formData.append('email', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('message', emailData.message);
      formData.append('from_name', emailData.from_name || 'رزجة');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        return { success: true };
      }

      return { success: false, error: result.message || 'Web3Forms error' };
    } catch (error) {
      return { success: false, error: `Web3Forms exception: ${error}` };
    }
  }

  // إرسال إيميل باستخدام SMTP2GO (خدمة مجانية موثوقة)
  static async sendViaSMTP2GO(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      // مفتاح API من SMTP2GO
      const apiKey = 'api-your-smtp2go-key-here';

      const response = await fetch('https://api.smtp2go.com/v3/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Smtp2go-Api-Key': apiKey
        },
        body: JSON.stringify({
          to: [emailData.to],
          sender: emailData.from_email || 'manage@kareemamged.com',
          subject: emailData.subject,
          text_body: emailData.message,
          custom_headers: [
            {
              header: 'Reply-To',
              value: emailData.from_email || 'manage@kareemamged.com'
            }
          ]
        })
      });

      const result = await response.json();

      if (result.data && result.data.succeeded > 0) {
        return { success: true };
      }

      return { success: false, error: result.data?.error || 'SMTP2GO error' };
    } catch (error) {
      return { success: false, error: `SMTP2GO exception: ${error}` };
    }
  }

  // الدالة الرئيسية لإرسال الإيميل مع نظام fallback
  static async sendEmail(
    to: string,
    subject: string,
    message: string,
    fromName: string = 'رزجة - موقع الزواج الإسلامي',
    fromEmail: string = 'manage@kareemamged.com'
  ): Promise<{ success: boolean; error?: string; method?: string }> {
    const emailData: EmailData = {
      to,
      subject,
      message,
      from_name: fromName,
      from_email: fromEmail
    };

    // محاولة 1: Formsubmit (خدمة مجانية وموثوقة)
    const formsubmitResult = await this.sendViaFormsubmit(emailData);
    if (formsubmitResult.success) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ تم إرسال الإيميل عبر Formsubmit');
      }
      return { success: true, method: 'Formsubmit' };
    }

    // محاولة 1.5: Emailto (خدمة بسيطة)
    const emailtoResult = await this.sendViaEmailto(emailData);
    if (emailtoResult.success) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ تم إرسال الإيميل عبر Emailto');
      }
      return { success: true, method: 'Emailto' };
    }

    // محاولة 2: Formspree (الأكثر موثوقية للاختبار)
    const formspreeResult = await this.sendViaFormspree(emailData);
    if (formspreeResult.success) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ تم إرسال الإيميل عبر Formspree');
      }
      return { success: true, method: 'Formspree' };
    }

    // محاولة 2: EmailJS
    const emailJSResult = await this.sendViaEmailJS(emailData);
    if (emailJSResult.success) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ تم إرسال الإيميل عبر EmailJS');
      }
      return { success: true, method: 'EmailJS' };
    }

    // محاولة 3: Web3Forms
    const web3FormsResult = await this.sendViaWeb3Forms(emailData);
    if (web3FormsResult.success) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ تم إرسال الإيميل عبر Web3Forms');
      }
      return { success: true, method: 'Web3Forms' };
    }

    // محاولة 4: SMTP2GO
    const smtp2goResult = await this.sendViaSMTP2GO(emailData);
    if (smtp2goResult.success) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ تم إرسال الإيميل عبر SMTP2GO');
      }
      return { success: true, method: 'SMTP2GO' };
    }

    // إذا فشلت جميع الطرق
    const errors = [
      formspreeResult.error,
      emailJSResult.error,
      web3FormsResult.error,
      smtp2goResult.error
    ].filter(Boolean).join('; ');

    if (process.env.NODE_ENV === 'development') {
      console.error('❌ فشل في إرسال الإيميل عبر جميع الطرق:', errors);
    }

    return { 
      success: false, 
      error: `فشل في جميع طرق الإرسال: ${errors}` 
    };
  }

  // إرسال إيميل تحقق مخصص
  static async sendVerificationEmail(
    email: string,
    verificationUrl: string,
    userData: { first_name: string; last_name: string }
  ): Promise<{ success: boolean; error?: string; method?: string }> {
    const subject = 'تأكيد إنشاء حسابك في رزجة';
    const message = `
مرحباً ${userData.first_name} ${userData.last_name}،

نشكرك على انضمامك إلى موقع رزجة للزواج الإسلامي الشرعي.

لإكمال إنشاء حسابك، يرجى النقر على الرابط التالي لتعيين كلمة المرور:
${verificationUrl}

معلومات مهمة:
• هذا الرابط صالح لمدة 24 ساعة فقط
• لا تشارك هذا الرابط مع أي شخص آخر
• إذا لم تطلب إنشاء حساب، يرجى تجاهل هذا الإيميل

إذا لم تستطع النقر على الرابط، انسخ والصق الرابط التالي في متصفحك:
${verificationUrl}

مع تحيات فريق رزجة
موقع الزواج الإسلامي الشرعي

© 2025 رزجة - جميع الحقوق محفوظة
    `;

    return await this.sendEmail(email, subject, message);
  }
}

export default RealEmailService;
