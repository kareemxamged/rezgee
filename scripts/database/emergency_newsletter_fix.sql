-- إصلاح طارئ لقاعدة البيانات للنشرة الإخبارية
-- Emergency Newsletter Database Fix

-- حذف كل شيء وإنشاء جديد
DROP TABLE IF EXISTS newsletter_campaigns CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- إنشاء جدول المشتركين بسيط
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT DEFAULT 'active',
  language TEXT DEFAULT 'ar',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  last_email_sent TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'footer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الحملات بسيط
CREATE TABLE newsletter_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  html_content TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  total_subscribers INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  language TEXT DEFAULT 'ar',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدراج بيانات تجريبية
INSERT INTO newsletter_subscribers (email, name, status, language, source)
VALUES 
  ('kemooamegoo@gmail.com', 'كيمو', 'active', 'ar', 'footer'),
  ('kemoamego@gmail.com', 'كيمو', 'active', 'ar', 'footer'),
  ('kareemxamged@gmail.com', 'كريم', 'active', 'ar', 'footer'),
  ('ahmdxsdk@gmail.com', 'أحمد', 'active', 'ar', 'footer')
ON CONFLICT (email) DO UPDATE SET
  status = 'active',
  language = 'ar',
  source = 'footer',
  subscribed_at = NOW(),
  updated_at = NOW();

-- عرض النتيجة
SELECT '✅ تم إنشاء جداول النشرة الإخبارية بنجاح!' as result;
SELECT COUNT(*) as total_subscribers FROM newsletter_subscribers;
SELECT email, name, status FROM newsletter_subscribers;






