-- إدراج تصنيفات المقالات باللغة العربية
-- Insert Article Categories in Arabic

BEGIN;

-- التأكد من وجود حقل اللغة
ALTER TABLE article_categories 
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'ar' CHECK (language IN ('ar', 'en'));

-- إنشاء constraint فريد للاسم واللغة
ALTER TABLE article_categories 
ADD CONSTRAINT IF NOT EXISTS unique_category_name_language UNIQUE (name, language);

-- إدراج التصنيفات باللغة العربية
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

-- تحديث عدد المقالات في كل تصنيف
UPDATE article_categories 
SET article_count = (
    SELECT COUNT(*) 
    FROM articles 
    WHERE articles.category_id = article_categories.id 
    AND articles.status = 'published'
    AND articles.language = 'ar'
)
WHERE language = 'ar';

COMMIT;
