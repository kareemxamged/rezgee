-- إصلاح القوالب المكررة في قاعدة البيانات
-- هذا الاستعلام يحذف القوالب المكررة ويبقي على أحدثها

BEGIN;

-- عرض القوالب المكررة قبل الحذف
SELECT 
    'القوالب المكررة قبل الحذف:' as status;

SELECT 
    name,
    COUNT(*) as count,
    MIN(created_at) as oldest,
    MAX(created_at) as newest
FROM email_templates 
GROUP BY name 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- حذف القوالب المكررة (يبقي على أحدثها)
WITH duplicate_templates AS (
    SELECT 
        id,
        name,
        ROW_NUMBER() OVER (
            PARTITION BY name 
            ORDER BY created_at DESC, id DESC
        ) as rn
    FROM email_templates
)
DELETE FROM email_templates 
WHERE id IN (
    SELECT id 
    FROM duplicate_templates 
    WHERE rn > 1
);

-- عرض النتائج بعد الحذف
SELECT 
    'القوالب بعد إصلاح المكررات:' as status;

SELECT 
    name,
    COUNT(*) as count
FROM email_templates 
GROUP BY name 
ORDER BY name;

-- عرض إجمالي القوالب
SELECT 
    'إجمالي القوالب:' as status,
    COUNT(*) as total_templates
FROM email_templates;

COMMIT;





