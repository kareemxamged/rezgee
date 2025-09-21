// طرق إرسال إيميلات متقدمة - رزقي
// طرق إضافية لضمان وصول الإيميلات

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
  type?: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
  method?: string;
  messageId?: string;
}

export class AdvancedEmailDeliveryMethods {
  private static readonly fromEmail = 'manage@kareemamged.com';
  private static readonly fromName = 'رزقي - موقع الزواج الإسلامي';

  /**
   * إرسال عبر خدمة SendGrid (احتياطي متقدم)
   */
  static async sendViaSendGrid(emailData: EmailData): Promise<EmailResult> {
    try {
      console.log('📧 محاولة الإرسال عبر SendGrid...');

      // مفتاح API لـ SendGrid (يجب إضافته في متغيرات البيئة)
      const apiKey = import.meta.env.VITE_SENDGRID_API_KEY || 'SG.your-sendgrid-api-key';

      if (apiKey === 'SG.your-sendgrid-api-key') {
        throw new Error('SendGrid API key not configured');
      }

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: emailData.to }],
            subject: emailData.subject
          }],
          from: {
            email: this.fromEmail,
            name: this.fromName
          },
          content: [
            {
              type: 'text/html',
              value: emailData.html
            },
            {
              type: 'text/plain',
              value: emailData.text
            }
          ]
        })
      });

      if (response.ok) {
        return {
          success: true,
          method: 'SendGrid API',
          messageId: `sendgrid_${Date.now()}`
        };
      }

      return {
        success: false,
        error: `SendGrid error: ${response.status}`,
        method: 'SendGrid API'
      };
    } catch (error) {
      return {
        success: false,
        error: `SendGrid connection error: ${error}`,
        method: 'SendGrid API'
      };
    }
  }

  /**
   * إرسال عبر خدمة Mailgun (احتياطي متقدم)
   */
  static async sendViaMailgun(emailData: EmailData): Promise<EmailResult> {
    try {
      console.log('📧 محاولة الإرسال عبر Mailgun...');

      // مفتاح API لـ Mailgun (يجب إضافته في متغيرات البيئة)
      const apiKey = import.meta.env.VITE_MAILGUN_API_KEY || 'your-mailgun-api-key';
      const domain = import.meta.env.VITE_MAILGUN_DOMAIN || 'your-domain.mailgun.org';

      if (apiKey === 'your-mailgun-api-key') {
        throw new Error('Mailgun API key not configured');
      }

      const formData = new FormData();
      formData.append('from', `${this.fromName} <${this.fromEmail}>`);
      formData.append('to', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('html', emailData.html);
      formData.append('text', emailData.text);

      const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${apiKey}`)}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          method: 'Mailgun API',
          messageId: result.id
        };
      }

      return {
        success: false,
        error: `Mailgun error: ${response.status}`,
        method: 'Mailgun API'
      };
    } catch (error) {
      return {
        success: false,
        error: `Mailgun connection error: ${error}`,
        method: 'Mailgun API'
      };
    }
  }

  /**
   * إرسال عبر خدمة AWS SES (احتياطي متقدم)
   */
  static async sendViaAWSSES(emailData: EmailData): Promise<EmailResult> {
    try {
      console.log('📧 محاولة الإرسال عبر AWS SES...');

      // مفاتيح AWS (يجب إضافتها في متغيرات البيئة)
      const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID || 'your-access-key';
      const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || 'your-secret-key';
      const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';

      if (accessKeyId === 'your-access-key') {
        throw new Error('AWS credentials not configured');
      }

      // إنشاء توقيع AWS (مبسط)
      const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
      const date = timestamp.substr(0, 8);

      // هذا مثال مبسط - في الإنتاج يجب استخدام مكتبة AWS SDK
      const response = await fetch(`https://email.${region}.amazonaws.com/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-amz-json-1.0',
          'X-Amz-Target': 'AWSSimpleEmailService.SendEmail',
          'X-Amz-Date': timestamp,
          'Authorization': `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${date}/${region}/ses/aws4_request`
        },
        body: JSON.stringify({
          Source: `${this.fromName} <${this.fromEmail}>`,
          Destination: {
            ToAddresses: [emailData.to]
          },
          Message: {
            Subject: {
              Data: emailData.subject,
              Charset: 'UTF-8'
            },
            Body: {
              Html: {
                Data: emailData.html,
                Charset: 'UTF-8'
              },
              Text: {
                Data: emailData.text,
                Charset: 'UTF-8'
              }
            }
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          method: 'AWS SES',
          messageId: result.MessageId
        };
      }

      return {
        success: false,
        error: `AWS SES error: ${response.status}`,
        method: 'AWS SES'
      };
    } catch (error) {
      return {
        success: false,
        error: `AWS SES connection error: ${error}`,
        method: 'AWS SES'
      };
    }
  }

  /**
   * إرسال عبر خدمة Postmark (احتياطي متقدم)
   */
  static async sendViaPostmark(emailData: EmailData): Promise<EmailResult> {
    try {
      console.log('📧 محاولة الإرسال عبر Postmark...');

      // مفتاح API لـ Postmark (يجب إضافته في متغيرات البيئة)
      const apiKey = import.meta.env.VITE_POSTMARK_API_KEY || 'your-postmark-api-key';

      if (apiKey === 'your-postmark-api-key') {
        throw new Error('Postmark API key not configured');
      }

      const response = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': apiKey
        },
        body: JSON.stringify({
          From: `${this.fromName} <${this.fromEmail}>`,
          To: emailData.to,
          Subject: emailData.subject,
          HtmlBody: emailData.html,
          TextBody: emailData.text,
          MessageStream: 'outbound'
        })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          method: 'Postmark API',
          messageId: result.MessageID
        };
      }

      return {
        success: false,
        error: `Postmark error: ${response.status}`,
        method: 'Postmark API'
      };
    } catch (error) {
      return {
        success: false,
        error: `Postmark connection error: ${error}`,
        method: 'Postmark API'
      };
    }
  }

  /**
   * إرسال عبر خدمة Elastic Email (احتياطي متقدم)
   */
  static async sendViaElasticEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      console.log('📧 محاولة الإرسال عبر Elastic Email...');

      // مفتاح API لـ Elastic Email (يجب إضافته في متغيرات البيئة)
      const apiKey = import.meta.env.VITE_ELASTIC_EMAIL_API_KEY || 'your-elastic-email-api-key';

      if (apiKey === 'your-elastic-email-api-key') {
        throw new Error('Elastic Email API key not configured');
      }

      const formData = new FormData();
      formData.append('apikey', apiKey);
      formData.append('from', this.fromEmail);
      formData.append('fromName', this.fromName);
      formData.append('to', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('bodyHtml', emailData.html);
      formData.append('bodyText', emailData.text);
      formData.append('isTransactional', 'true');

      const response = await fetch('https://api.elasticemail.com/v2/email/send', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          method: 'Elastic Email API',
          messageId: result.data?.messageid || `elastic_${Date.now()}`
        };
      }

      return {
        success: false,
        error: `Elastic Email error: ${response.status}`,
        method: 'Elastic Email API'
      };
    } catch (error) {
      return {
        success: false,
        error: `Elastic Email connection error: ${error}`,
        method: 'Elastic Email API'
      };
    }
  }

  /**
   * إرسال عبر خدمة SMTP.js (احتياطي للمتصفح)
   */
  static async sendViaSMTPJS(emailData: EmailData): Promise<EmailResult> {
    try {
      console.log('📧 محاولة الإرسال عبر SMTP.js...');

      // تحميل مكتبة SMTP.js إذا لم تكن متوفرة
      if (typeof window !== 'undefined' && !(window as any).Email) {
        const script = document.createElement('script');
        script.src = 'https://smtpjs.com/v3/smtp.js';
        document.head.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      const Email = (window as any).Email;
      if (!Email) {
        throw new Error('SMTP.js library not available');
      }

      // إعدادات SMTP (يجب إضافتها في متغيرات البيئة)
      const smtpConfig = {
        Host: import.meta.env.VITE_SMTP_HOST || 'smtp.hostinger.com',
        Username: import.meta.env.VITE_SMTP_USERNAME || this.fromEmail,
        Password: import.meta.env.VITE_SMTP_PASSWORD || 'your-smtp-password',
        To: emailData.to,
        From: this.fromEmail,
        Subject: emailData.subject,
        Body: emailData.html,
        AltBody: emailData.text
      };

      if (smtpConfig.Password === 'your-smtp-password') {
        throw new Error('SMTP credentials not configured');
      }

      const result = await Email.send(smtpConfig);

      return {
        success: true,
        method: 'SMTP.js',
        messageId: `smtpjs_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        error: `SMTP.js error: ${error}`,
        method: 'SMTP.js'
      };
    }
  }

  /**
   * إرسال عبر خدمة EmailJS (احتياطي للمتصفح)
   */
  static async sendViaEmailJS(emailData: EmailData): Promise<EmailResult> {
    try {
      console.log('📧 محاولة الإرسال عبر EmailJS...');

      // تحميل مكتبة EmailJS إذا لم تكن متوفرة
      if (typeof window !== 'undefined' && !(window as any).emailjs) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        document.head.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      const emailjs = (window as any).emailjs;

      // إعدادات EmailJS (يجب إضافتها في متغيرات البيئة)
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your-service-id';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your-template-id';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your-public-key';

      if (serviceId === 'your-service-id') {
        throw new Error('EmailJS configuration not available');
      }

      const result = await emailjs.send(serviceId, templateId, {
        to_email: emailData.to,
        from_name: this.fromName,
        subject: emailData.subject,
        message: emailData.text,
        html_message: emailData.html
      }, publicKey);

      return {
        success: true,
        method: 'EmailJS',
        messageId: result.text || `emailjs_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        error: `EmailJS error: ${error}`,
        method: 'EmailJS'
      };
    }
  }

  /**
   * إرسال عبر خدمة Web3Forms (احتياطي مجاني)
   */
  static async sendViaWeb3Forms(emailData: EmailData): Promise<EmailResult> {
    try {
      console.log('📧 محاولة الإرسال عبر Web3Forms...');

      // مفتاح Web3Forms (يجب إضافته في متغيرات البيئة)
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'c5d5e1b8-8c5a-4b2a-9f3e-1d2c3b4a5f6e';

      const formData = new FormData();
      formData.append('access_key', accessKey);
      formData.append('name', this.fromName);
      formData.append('email', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('message', emailData.text);
      formData.append('from_name', this.fromName);
      formData.append('reply_to', this.fromEmail);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return {
            success: true,
            method: 'Web3Forms',
            messageId: `web3forms_${Date.now()}`
          };
        }
      }

      return {
        success: false,
        error: `Web3Forms error: ${response.status}`,
        method: 'Web3Forms'
      };
    } catch (error) {
      return {
        success: false,
        error: `Web3Forms connection error: ${error}`,
        method: 'Web3Forms'
      };
    }
  }

  /**
   * اختبار جميع طرق الإرسال المتقدمة
   */
  static async testAllAdvancedMethods(email: string = 'kemooamegoo@gmail.com'): Promise<EmailResult[]> {
    console.log('🧪 اختبار جميع طرق الإرسال المتقدمة...');

    const testEmailData: EmailData = {
      to: email,
      subject: '[اختبار] طرق الإرسال المتقدمة - رزقي',
      html: '<h1>اختبار طرق الإرسال المتقدمة</h1><p>هذا إيميل اختبار لطرق الإرسال المتقدمة.</p>',
      text: 'اختبار طرق الإرسال المتقدمة - هذا إيميل اختبار لطرق الإرسال المتقدمة.',
      type: 'test'
    };

    const results: EmailResult[] = [];

    // اختبار جميع الطرق المتقدمة
    results.push(await this.sendViaSendGrid(testEmailData));
    results.push(await this.sendViaMailgun(testEmailData));
    results.push(await this.sendViaAWSSES(testEmailData));
    results.push(await this.sendViaPostmark(testEmailData));
    results.push(await this.sendViaElasticEmail(testEmailData));
    results.push(await this.sendViaSMTPJS(testEmailData));
    results.push(await this.sendViaEmailJS(testEmailData));
    results.push(await this.sendViaWeb3Forms(testEmailData));

    console.log('✅ انتهى اختبار جميع طرق الإرسال المتقدمة');
    return results;
  }
}

export default AdvancedEmailDeliveryMethods;
