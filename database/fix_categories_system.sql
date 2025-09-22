-- إصلاح نظام التصنيفات
-- Fix Categories System

BEGIN;

-- التأكد من وجود حقل اللغة في جدول التصنيفات
ALTER TABLE article_categories 
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'ar' CHECK (language IN ('ar', 'en'));

-- تحديث التصنيفات الموجودة لتكون باللغة العربية
UPDATE article_categories 
SET language = 'ar' 
WHERE language IS NULL OR language = '';

-- إنشاء constraint فريد للاسم واللغة
ALTER TABLE article_categories 
ADD CONSTRAINT IF NOT EXISTS unique_category_name_language UNIQUE (name, language);

-- حذف التصنيفات المكررة (إذا وجدت)
DELETE FROM article_categories 
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY name, language ORDER BY created_at) as rn
        FROM article_categories
    ) t WHERE rn > 1
);

-- إدراج التصنيفات العربية (إذا لم تكن موجودة)
INSERT INTO article_categories (name, description, color, icon, language) VALUES
(
    'الإرشاد الإسلامي',
    'مقالات شاملة حول الآداب الإسلامية في الزواج والتعارف مع أدلة شرعية وتطبيقات عملية معاصرة',
    'from-emerald-500 to-emerald-600',
    'BookOpen',
    'ar'
),
(
    'نصائح الزواج',
    'نصائح عملية ومجربة للحياة الزوجية السعيدة وحل المشاكل الزوجية بحكمة وذكاء',
    'from-rose-500 to-rose-600',
    'Heart',
    'ar'
),
(
    'التوجيه الأسري',
    'دور الأهل في اختيار شريك الحياة والتوازن بين التوجيه الحكيم واحترام اختيار الأبناء',
    'from-blue-500 to-blue-600',
    'Users',
    'ar'
),
(
    'الأمان الرقمي',
    'نصائح وحماية للتعامل الآمن مع منصات التعارف الإلكتروني وحماية الخصوصية',
    'from-purple-500 to-purple-600',
    'Shield',
    'ar'
),
(
    'علم النفس العلاقاتي',
    'فهم ديناميكيات العلاقات والتواصل الفعال في بناء علاقات قوية ومستقرة',
    'from-indigo-500 to-indigo-600',
    'Brain',
    'ar'
),
(
    'الصحة والرفاهية',
    'نصائح للصحة الجسدية والنفسية للأفراد والأزواج لبناء حياة سعيدة',
    'from-green-500 to-green-600',
    'Heart',
    'ar'
),
(
    'قصص النجاح',
    'قصص حقيقية لزواج ناجح من خلال منصات التعارف الإلكتروني',
    'from-amber-500 to-amber-600',
    'Star',
    'ar'
),
(
    'الاستشارات',
    'إجابات على الأسئلة الشائعة والمشاكل المتكررة في العلاقات والزواج',
    'from-cyan-500 to-cyan-600',
    'MessageCircle',
    'ar'
)
ON CONFLICT (name, language) DO NOTHING;

-- إدراج التصنيفات الإنجليزية (إذا لم تكن موجودة)
INSERT INTO article_categories (name, description, color, icon, language) VALUES
(
    'Islamic Guidance',
    'Articles about Islamic principles for marriage, family life, and relationships according to Quran and Sunnah',
    'from-emerald-500 to-emerald-600',
    'Mosque',
    'en'
),
(
    'Marriage Tips',
    'Practical advice and tips for building a successful and happy marriage',
    'from-rose-500 to-rose-600',
    'Heart',
    'en'
),
(
    'Family Guidance',
    'Guidance on raising children, family relationships, and building a strong family foundation',
    'from-blue-500 to-blue-600',
    'Users',
    'en'
),
(
    'Digital Safety',
    'Tips and guidelines for safe online dating and protecting personal information',
    'from-purple-500 to-purple-600',
    'Shield',
    'en'
),
(
    'Relationship Psychology',
    'Understanding relationship dynamics, communication, and emotional intelligence',
    'from-indigo-500 to-indigo-600',
    'Brain',
    'en'
),
(
    'Health & Wellness',
    'Physical and mental health tips for individuals and couples',
    'from-green-500 to-green-600',
    'Heart',
    'en'
),
(
    'Success Stories',
    'Real stories of successful marriages through online dating platforms',
    'from-amber-500 to-amber-600',
    'Star',
    'en'
),
(
    'Consultations',
    'Answers to common questions and recurring problems in relationships and marriage',
    'from-cyan-500 to-cyan-600',
    'MessageCircle',
    'en'
)
ON CONFLICT (name, language) DO NOTHING;

-- تحديث عدد المقالات في كل تصنيف للغة العربية
UPDATE article_categories 
SET article_count = (
    SELECT COUNT(*) 
    FROM articles 
    WHERE articles.category_id = article_categories.id 
    AND articles.status = 'published'
    AND articles.language = 'ar'
)
WHERE language = 'ar';

-- تحديث عدد المقالات في كل تصنيف للغة الإنجليزية
UPDATE article_categories 
SET article_count = (
    SELECT COUNT(*) 
    FROM articles 
    WHERE articles.category_id = article_categories.id 
    AND articles.status = 'published'
    AND articles.language = 'en'
)
WHERE language = 'en';

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_article_categories_language ON article_categories(language);
CREATE INDEX IF NOT EXISTS idx_article_categories_name_language ON article_categories(name, language);

COMMIT;

-- عرض النتائج
SELECT 
    language,
    COUNT(*) as category_count,
    SUM(article_count) as total_articles
FROM article_categories 
GROUP BY language 
ORDER BY language;
