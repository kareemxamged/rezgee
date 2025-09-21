import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  text: string;
  type: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Edge Function: send-unified-email بدأت')
    
    // Parse request body
    const { to, subject, html, text, type }: EmailRequest = await req.json()
    
    console.log('📧 بيانات الطلب:', {
      to,
      subject,
      type,
      htmlLength: html?.length || 0,
      textLength: text?.length || 0
    })

    // Validate required fields
    if (!to || !subject || !html) {
      console.error('❌ بيانات مفقودة في الطلب')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'البريد الإلكتروني والموضوع والمحتوى مطلوبة' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get SMTP settings from Supabase
    console.log('🔍 جلب إعدادات SMTP من قاعدة البيانات...')
    const { data: smtpSettings, error: settingsError } = await supabase
      .from('smtp_settings')
      .select('*')
      .eq('is_active', true)
      .single()

    if (settingsError || !smtpSettings) {
      console.error('❌ فشل في جلب إعدادات SMTP:', settingsError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'فشل في جلب إعدادات SMTP' 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log('✅ تم جلب إعدادات SMTP بنجاح')

    // Prepare email data for SMTP
    const emailData = {
      from: `${smtpSettings.from_name} <${smtpSettings.from_email}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || subject
    }

    console.log('📤 إرسال الإيميل عبر SMTP...')
    console.log('📧 من:', emailData.from)
    console.log('📧 إلى:', emailData.to)
    console.log('📝 الموضوع:', emailData.subject)

    // Send email using SMTP
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${smtpSettings.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    const result = await response.json()
    console.log('📨 استجابة Resend API:', result)

    if (response.ok && result.id) {
      console.log('✅ تم إرسال الإيميل بنجاح')
      console.log('📧 معرف الرسالة:', result.id)

      // Log email in database
      try {
        const { error: logError } = await supabase
          .from('email_logs')
          .insert({
            recipient_email: to,
            subject: subject,
            email_type: type,
            status: 'sent',
            provider: 'resend',
            message_id: result.id,
            sent_at: new Date().toISOString()
          })

        if (logError) {
          console.warn('⚠️ فشل في تسجيل الإيميل في قاعدة البيانات:', logError)
        } else {
          console.log('✅ تم تسجيل الإيميل في قاعدة البيانات')
        }
      } catch (logError) {
        console.warn('⚠️ خطأ في تسجيل الإيميل:', logError)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          messageId: result.id,
          method: 'resend'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } else {
      console.error('❌ فشل في إرسال الإيميل:', result)
      
      // Log failed email
      try {
        await supabase
          .from('email_logs')
          .insert({
            recipient_email: to,
            subject: subject,
            email_type: type,
            status: 'failed',
            provider: 'resend',
            error_message: result.message || 'Unknown error',
            sent_at: new Date().toISOString()
          })
      } catch (logError) {
        console.warn('⚠️ فشل في تسجيل خطأ الإيميل:', logError)
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: result.message || 'فشل في إرسال الإيميل'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

  } catch (error) {
    console.error('❌ خطأ عام في Edge Function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'خطأ داخلي في الخادم'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
