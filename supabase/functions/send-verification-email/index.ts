import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  email: string;
  verificationUrl: string;
  userData: {
    first_name: string;
    last_name: string;
  };
  language?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, verificationUrl, userData, language = 'ar' }: EmailRequest = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get SMTP configuration from auth settings
    const { data: authConfig, error: configError } = await supabase
      .from('auth.config')
      .select('*')
      .in('parameter', ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_sender_name'])

    if (configError) {
      console.error('Error fetching SMTP config:', configError)
      return new Response(
        JSON.stringify({ error: 'Failed to get SMTP configuration' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse SMTP config
    const smtpConfig: Record<string, string> = {}
    authConfig?.forEach((config: any) => {
      smtpConfig[config.parameter] = config.value
    })

    // Generate email HTML content
    const emailHTML = generateEmailHTML(verificationUrl, userData, language)

    // Send email using SMTP
    const emailSent = await sendSMTPEmail({
      to: email,
      subject: language === 'ar' ? 'تأكيد إنشاء حسابك في رزجة' : 'Confirm Your Account - Rezge',
      html: emailHTML,
      smtpConfig
    })

    if (emailSent) {
      return new Response(
        JSON.stringify({ success: true, message: 'Email sent successfully' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Error in send-verification-email function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Function to send email via SMTP
async function sendSMTPEmail({
  to,
  subject,
  html,
  smtpConfig
}: {
  to: string;
  subject: string;
  html: string;
  smtpConfig: Record<string, string>;
}): Promise<boolean> {
  try {
    // Use a third-party email service like Resend or SendGrid
    // For now, we'll use a simple HTTP request to a mail service
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${smtpConfig.smtp_sender_name} <${smtpConfig.smtp_user}>`,
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('SMTP send error:', error);
    return false;
  }
}

// Generate email HTML content
function generateEmailHTML(verificationUrl: string, userData: any, language: string): string {
  if (language === 'ar') {
    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد إنشاء حسابك في رزجة</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        body { margin: 0; padding: 0; font-family: 'Amiri', serif; }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Amiri', serif; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 40px 20px; min-height: 100vh;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">رزجة</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">موقع الزواج الإسلامي الشرعي</p>
        </div>
        
        <div style="padding: 40px 30px;">
            <h2 style="color: #1e40af; font-size: 24px; margin: 0 0 20px 0; text-align: center;">مرحباً بك في رزجة!</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                أهلاً وسهلاً ${userData.first_name} ${userData.last_name}،<br><br>
                نشكرك على انضمامك إلى موقع رزجة للزواج الإسلامي الشرعي. لإكمال إنشاء حسابك، يرجى النقر على الرابط أدناه لتعيين كلمة المرور:
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
        
        <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">© 2025 رزجة - موقع الزواج الإسلامي الشرعي</p>
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">هذا الإيميل تم إرساله تلقائياً، يرجى عدم الرد عليه</p>
        </div>
    </div>
</body>
</html>
    `;
  } else {
    // English version
    return `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Account - Rezge</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 40px 20px; min-height: 100vh;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">Rezge</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Islamic Marriage Platform</p>
        </div>
        
        <div style="padding: 40px 30px;">
            <h2 style="color: #1e40af; font-size: 24px; margin: 0 0 20px 0; text-align: center;">Welcome to Rezge!</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hello ${userData.first_name} ${userData.last_name},<br><br>
                Thank you for joining Rezge Islamic Marriage Platform. To complete your account creation, please click the link below to set your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);">Confirm Account & Set Password</a>
            </div>
        </div>
        
        <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">© 2025 Rezge - Islamic Marriage Platform</p>
        </div>
    </div>
</body>
</html>
    `;
  }
}
