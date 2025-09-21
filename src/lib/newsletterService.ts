// خدمة النشرة الإخبارية الشاملة
// Comprehensive Newsletter Service

import { supabase } from './supabase';
import { UnifiedEmailService } from './unifiedEmailService';
import { createUnifiedEmailTemplate, EmailTemplates } from './unifiedEmailTemplate';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'pending';
  language: 'ar' | 'en' | 'bilingual';
  subscribed_at: string;
  unsubscribed_at?: string;
  last_email_sent?: string;
  source: 'footer' | 'admin' | 'import';
  created_at: string;
  updated_at: string;
}

export interface NewsletterCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  html_content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  scheduled_at?: string;
  sent_at?: string;
  total_subscribers: number;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  language: 'ar' | 'en' | 'bilingual';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterStats {
  total_subscribers: number;
  active_subscribers: number;
  unsubscribed_count: number;
  pending_count: number;
  total_campaigns: number;
  sent_campaigns: number;
  draft_campaigns: number;
  average_open_rate: number;
  average_click_rate: number;
}

export class NewsletterService {
  /**
   * الاشتراك في النشرة الإخبارية
   */
  static async subscribe(email: string, name?: string, language: 'ar' | 'en' = 'ar', source: 'footer' | 'admin' | 'import' = 'footer'): Promise<{ success: boolean; error?: string; subscriber?: NewsletterSubscriber }> {
    try {
      console.log('📧 بدء عملية الاشتراك في النشرة الإخبارية...');
      console.log(`📬 البريد الإلكتروني: ${email}`);
      console.log(`🌐 اللغة: ${language}`);
      console.log(`📍 المصدر: ${source}`);

      // التحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'البريد الإلكتروني غير صحيح' };
      }

      // التحقق من وجود الاشتراك مسبقاً
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ خطأ في التحقق من الاشتراك:', checkError);
        return { success: false, error: 'حدث خطأ في التحقق من الاشتراك' };
      }

      if (existingSubscriber) {
        if (existingSubscriber.status === 'active') {
          return { success: false, error: 'أنت مشترك بالفعل في النشرة الإخبارية' };
        } else if (existingSubscriber.status === 'unsubscribed') {
          // إعادة تفعيل الاشتراك
          const { data: updatedSubscriber, error: updateError } = await supabase
            .from('newsletter_subscribers')
            .update({
              status: 'active',
              name: name || existingSubscriber.name,
              language: language,
              source: source,
              subscribed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', existingSubscriber.id)
            .select()
            .single();

          if (updateError) {
            console.error('❌ خطأ في إعادة تفعيل الاشتراك:', updateError);
            return { success: false, error: 'حدث خطأ في إعادة تفعيل الاشتراك' };
          }

          console.log('✅ تم إعادة تفعيل الاشتراك بنجاح');
          return { success: true, subscriber: updatedSubscriber };
        }
      }

      // إنشاء اشتراك جديد
      const { data: newSubscriber, error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: email.toLowerCase(),
          name: name,
          status: 'active',
          language: language,
          source: source,
          subscribed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ خطأ في إنشاء الاشتراك:', insertError);
        return { success: false, error: 'حدث خطأ في إنشاء الاشتراك' };
      }

      console.log('✅ تم إنشاء الاشتراك بنجاح');

      // إرسال إيميل ترحيب
      await this.sendWelcomeEmail(newSubscriber);

      return { success: true, subscriber: newSubscriber };

    } catch (error) {
      console.error('❌ خطأ في خدمة الاشتراك:', error);
      return { success: false, error: 'حدث خطأ غير متوقع في الاشتراك' };
    }
  }

  /**
   * إلغاء الاشتراك من النشرة الإخبارية
   */
  static async unsubscribe(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 بدء عملية إلغاء الاشتراك من النشرة الإخبارية...');
      console.log(`📬 البريد الإلكتروني: ${email}`);

      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', email.toLowerCase())
        .eq('status', 'active');

      if (error) {
        console.error('❌ خطأ في إلغاء الاشتراك:', error);
        return { success: false, error: 'حدث خطأ في إلغاء الاشتراك' };
      }

      console.log('✅ تم إلغاء الاشتراك بنجاح');
      return { success: true };

    } catch (error) {
      console.error('❌ خطأ في خدمة إلغاء الاشتراك:', error);
      return { success: false, error: 'حدث خطأ غير متوقع في إلغاء الاشتراك' };
    }
  }

  /**
   * إرسال إيميل ترحيب للمشترك الجديد
   */
  private static async sendWelcomeEmail(subscriber: NewsletterSubscriber): Promise<void> {
    try {
      console.log('📧 إرسال إيميل ترحيب للمشترك الجديد...');

      // إنشاء رابط إلغاء الاشتراك
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rezgee.vercel.app';
      const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.id}`;

      const templateData = EmailTemplates.newsletterWelcome(
        subscriber.email,
        subscriber.name || subscriber.email.split('@')[0],
        subscriber.language
      );

      const { html, text, subject } = createUnifiedEmailTemplate(templateData);

      // إضافة رابط إلغاء الاشتراك إلى المحتوى HTML
      const htmlWithUnsubscribe = html + `
        <div style="margin-top: 40px; padding: 20px; background: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center;">
          <div class="arabic-content" style="margin-bottom: 10px; direction: rtl; text-align: right; font-family: 'Tahoma', Arial, sans-serif;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              إذا كنت لا ترغب في تلقي النشرة الإخبارية بعد الآن، يمكنك 
              <a href="${unsubscribeUrl}" style="color: #1e40af; text-decoration: underline;">إلغاء الاشتراك هنا</a>
            </p>
          </div>
          <div class="english-content" style="direction: ltr; text-align: left; font-family: 'Arial', sans-serif;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              If you no longer wish to receive our newsletter, you can 
              <a href="${unsubscribeUrl}" style="color: #1e40af; text-decoration: underline;">unsubscribe here</a>
            </p>
          </div>
        </div>
      `;
      
      // إضافة رابط إلغاء الاشتراك إلى المحتوى النصي
      const textWithUnsubscribe = text + `
        
        ---
        إلغاء الاشتراك / Unsubscribe:
        ${unsubscribeUrl}
      `;

      const result = await UnifiedEmailService.sendEmail({
        to: subscriber.email,
        subject: subject,
        html: htmlWithUnsubscribe,
        text: textWithUnsubscribe,
        type: 'newsletter_welcome'
      });

      if (result.success) {
        console.log('✅ تم إرسال إيميل الترحيب بنجاح');
        
        // تحديث تاريخ آخر إيميل مرسل
        await supabase
          .from('newsletter_subscribers')
          .update({ last_email_sent: new Date().toISOString() })
          .eq('id', subscriber.id);
      } else {
        console.error('❌ فشل في إرسال إيميل الترحيب:', result.error);
      }

    } catch (error) {
      console.error('❌ خطأ في إرسال إيميل الترحيب:', error);
    }
  }

  /**
   * إرسال إيميل تأكيد إلغاء الاشتراك
   */
  static async sendUnsubscribeConfirmation(email: string, name?: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 إرسال إيميل تأكيد إلغاء الاشتراك...');

      const templateData = EmailTemplates.newsletterUnsubscribe(
        email,
        name || email.split('@')[0]
      );

      const { html, text, subject } = createUnifiedEmailTemplate(templateData);

      const result = await UnifiedEmailService.sendEmail({
        to: email,
        subject: subject,
        html: html,
        text: text,
        type: 'newsletter_unsubscribe'
      });

      if (result.success) {
        console.log('✅ تم إرسال إيميل تأكيد إلغاء الاشتراك بنجاح');
        return { success: true };
      } else {
        console.error('❌ فشل في إرسال إيميل تأكيد إلغاء الاشتراك:', result.error);
        return { success: false, error: result.error };
      }

    } catch (error) {
      console.error('❌ خطأ في إرسال إيميل تأكيد إلغاء الاشتراك:', error);
      return { success: false, error: 'حدث خطأ في إرسال إيميل التأكيد' };
    }
  }

  /**
   * الحصول على قائمة المشتركين
   */
  static async getSubscribers(page: number = 1, limit: number = 50, status?: 'active' | 'unsubscribed' | 'pending'): Promise<{ success: boolean; data?: NewsletterSubscriber[]; error?: string; total?: number }> {
    try {
      console.log('📋 جلب قائمة المشتركين...');

      let query = supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        console.error('❌ خطأ في جلب المشتركين:', error);
        return { success: false, error: 'حدث خطأ في جلب المشتركين' };
      }

      console.log(`✅ تم جلب ${data?.length || 0} مشترك`);
      return { success: true, data: data || [], total: count || 0 };

    } catch (error) {
      console.error('❌ خطأ في خدمة جلب المشتركين:', error);
      return { success: false, error: 'حدث خطأ غير متوقع في جلب المشتركين' };
    }
  }

  /**
   * إنشاء حملة إخبارية جديدة
   */
  static async createCampaign(campaignData: {
    title: string;
    subject: string;
    content: string;
    html_content: string;
    language: 'ar' | 'en' | 'bilingual';
    scheduled_at?: string;
    created_by: string;
  }): Promise<{ success: boolean; error?: string; campaign?: NewsletterCampaign }> {
    try {
      console.log('📝 إنشاء حملة إخبارية جديدة...');

      // الحصول على عدد المشتركين النشطين
      let countQuery = supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      // إذا كانت الحملة ثنائية اللغة، نحسب جميع المشتركين النشطين
      if (campaignData.language === 'bilingual') {
        // لا نضيف فلتر اللغة للحملات الثنائية
      } else {
        countQuery = countQuery.eq('language', campaignData.language);
      }
      
      const { count: subscriberCount } = await countQuery;

      // تنظيف البيانات قبل الإرسال
      const cleanCampaignData = {
        ...campaignData,
        scheduled_at: campaignData.scheduled_at && campaignData.scheduled_at.trim() !== '' 
          ? campaignData.scheduled_at 
          : null
      };

      const { data: newCampaign, error } = await supabase
        .from('newsletter_campaigns')
        .insert({
          ...cleanCampaignData,
          status: cleanCampaignData.scheduled_at ? 'scheduled' : 'draft',
          total_subscribers: subscriberCount || 0,
          sent_count: 0,
          opened_count: 0,
          clicked_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('❌ خطأ في إنشاء الحملة:', error);
        return { success: false, error: 'حدث خطأ في إنشاء الحملة' };
      }

      console.log('✅ تم إنشاء الحملة بنجاح');
      return { success: true, campaign: newCampaign };

    } catch (error) {
      console.error('❌ خطأ في خدمة إنشاء الحملة:', error);
      return { success: false, error: 'حدث خطأ غير متوقع في إنشاء الحملة' };
    }
  }

  /**
   * إرسال حملة إخبارية
   */
  static async sendCampaign(campaignId: string): Promise<{ success: boolean; error?: string; sentCount?: number }> {
    try {
      console.log('📧 بدء إرسال الحملة الإخبارية...');

      // الحصول على بيانات الحملة
      const { data: campaign, error: campaignError } = await supabase
        .from('newsletter_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (campaignError || !campaign) {
        console.error('❌ خطأ في جلب الحملة:', campaignError);
        return { success: false, error: 'لم يتم العثور على الحملة' };
      }

      if (campaign.status !== 'draft' && campaign.status !== 'scheduled' && campaign.status !== 'sent') {
        return { success: false, error: 'لا يمكن إرسال هذه الحملة' };
      }

      // تحديث حالة الحملة إلى "جاري الإرسال"
      await supabase
        .from('newsletter_campaigns')
        .update({ 
          status: 'sending',
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      // الحصول على قائمة المشتركين النشطين
      let query = supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('status', 'active');
      
      // إذا كانت الحملة ثنائية اللغة، أرسل لجميع المشتركين
      if (campaign.language === 'bilingual') {
        // لا نضيف فلتر اللغة للحملات الثنائية
      } else {
        query = query.eq('language', campaign.language);
      }
      
      const { data: subscribers, error: subscribersError } = await query;

      if (subscribersError || !subscribers) {
        console.error('❌ خطأ في جلب المشتركين:', subscribersError);
        return { success: false, error: 'حدث خطأ في جلب المشتركين' };
      }

      console.log(`📬 جاري إرسال الحملة إلى ${subscribers.length} مشترك`);

      let sentCount = 0;
      let errorCount = 0;

      // إرسال الحملة إلى كل مشترك
      for (const subscriber of subscribers) {
        try {
          // إنشاء رابط إلغاء الاشتراك
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rezgee.vercel.app';
          const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.id}`;
          
          // إضافة رابط إلغاء الاشتراك إلى المحتوى HTML
          const htmlWithUnsubscribe = campaign.html_content + `
            <div style="margin-top: 40px; padding: 20px; background: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center;">
              <div class="arabic-content" style="margin-bottom: 10px; direction: rtl; text-align: right; font-family: 'Tahoma', Arial, sans-serif;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                  إذا كنت لا ترغب في تلقي النشرة الإخبارية بعد الآن، يمكنك 
                  <a href="${unsubscribeUrl}" style="color: #1e40af; text-decoration: underline;">إلغاء الاشتراك هنا</a>
                </p>
              </div>
              <div class="english-content" style="direction: ltr; text-align: left; font-family: 'Arial', sans-serif;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                  If you no longer wish to receive our newsletter, you can 
                  <a href="${unsubscribeUrl}" style="color: #1e40af; text-decoration: underline;">unsubscribe here</a>
                </p>
              </div>
            </div>
          `;
          
          // إضافة رابط إلغاء الاشتراك إلى المحتوى النصي
          const textWithUnsubscribe = campaign.content + `
            
            ---
            إلغاء الاشتراك / Unsubscribe:
            ${unsubscribeUrl}
          `;

          const result = await UnifiedEmailService.sendEmail({
            to: subscriber.email,
            subject: campaign.subject,
            html: htmlWithUnsubscribe,
            text: textWithUnsubscribe,
            type: 'newsletter'
          });

          if (result.success) {
            sentCount++;
            
            // تحديث تاريخ آخر إيميل مرسل للمشترك
            await supabase
              .from('newsletter_subscribers')
              .update({ last_email_sent: new Date().toISOString() })
              .eq('id', subscriber.id);
          } else {
            errorCount++;
            console.error(`❌ فشل في إرسال الإيميل إلى ${subscriber.email}:`, result.error);
          }

          // تأخير قصير لتجنب تجاوز حدود الإرسال
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          errorCount++;
          console.error(`❌ خطأ في إرسال الإيميل إلى ${subscriber.email}:`, error);
        }
      }

      // تحديث حالة الحملة
      await supabase
        .from('newsletter_campaigns')
        .update({
          status: 'sent',
          sent_count: sentCount,
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      console.log(`✅ تم إرسال الحملة بنجاح: ${sentCount} إيميل مرسل، ${errorCount} خطأ`);
      return { success: true, sentCount };

    } catch (error) {
      console.error('❌ خطأ في خدمة إرسال الحملة:', error);
      return { success: false, error: 'حدث خطأ غير متوقع في إرسال الحملة' };
    }
  }

  /**
   * الحصول على إحصائيات النشرة الإخبارية
   */
  static async getStats(): Promise<{ success: boolean; data?: NewsletterStats; error?: string }> {
    try {
      console.log('📊 جلب إحصائيات النشرة الإخبارية...');

      // إحصائيات المشتركين
      const { count: totalSubscribers } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true });

      const { count: activeSubscribers } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: unsubscribedCount } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unsubscribed');

      const { count: pendingCount } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // إحصائيات الحملات
      const { count: totalCampaigns } = await supabase
        .from('newsletter_campaigns')
        .select('*', { count: 'exact', head: true });

      const { count: sentCampaigns } = await supabase
        .from('newsletter_campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'sent');

      const { count: draftCampaigns } = await supabase
        .from('newsletter_campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      // حساب معدلات الفتح والنقر
      const { data: campaigns } = await supabase
        .from('newsletter_campaigns')
        .select('opened_count, clicked_count, sent_count')
        .eq('status', 'sent')
        .gt('sent_count', 0);

      let totalOpened = 0;
      let totalClicked = 0;
      let totalSent = 0;

      campaigns?.forEach(campaign => {
        totalOpened += campaign.opened_count || 0;
        totalClicked += campaign.clicked_count || 0;
        totalSent += campaign.sent_count || 0;
      });

      const averageOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
      const averageClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;

      const stats: NewsletterStats = {
        total_subscribers: totalSubscribers || 0,
        active_subscribers: activeSubscribers || 0,
        unsubscribed_count: unsubscribedCount || 0,
        pending_count: pendingCount || 0,
        total_campaigns: totalCampaigns || 0,
        sent_campaigns: sentCampaigns || 0,
        draft_campaigns: draftCampaigns || 0,
        average_open_rate: Math.round(averageOpenRate * 100) / 100,
        average_click_rate: Math.round(averageClickRate * 100) / 100
      };

      console.log('✅ تم جلب الإحصائيات بنجاح');
      return { success: true, data: stats };

    } catch (error) {
      console.error('❌ خطأ في خدمة جلب الإحصائيات:', error);
      return { success: false, error: 'حدث خطأ غير متوقع في جلب الإحصائيات' };
    }
  }

  /**
   * الحصول على قائمة الحملات
   */
  static async getCampaigns(page: number = 1, limit: number = 20): Promise<{ success: boolean; data?: NewsletterCampaign[]; error?: string; total?: number }> {
    try {
      console.log('📋 جلب قائمة الحملات الإخبارية...');

      const { data, error, count } = await supabase
        .from('newsletter_campaigns')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        console.error('❌ خطأ في جلب الحملات:', error);
        return { success: false, error: 'حدث خطأ في جلب الحملات' };
      }

      console.log(`✅ تم جلب ${data?.length || 0} حملة`);
      return { success: true, data: data || [], total: count || 0 };

    } catch (error) {
      console.error('❌ خطأ في خدمة جلب الحملات:', error);
      return { success: false, error: 'حدث خطأ غير متوقع في جلب الحملات' };
    }
  }
}

// تصدير الـ interfaces بشكل منفصل
export type { NewsletterSubscriber, NewsletterCampaign, NewsletterStats };

export default NewsletterService;
