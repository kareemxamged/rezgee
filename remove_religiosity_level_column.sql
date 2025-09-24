-- إزالة عمود مستوى التدين من جدول user_profiles
-- هذا الملف يحتوي على الأوامر اللازمة لإزالة عمود religiosity_level من قاعدة البيانات

-- التحقق من وجود العمود قبل إزالته
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'religiosity_level';

-- إزالة العمود من جدول user_profiles
ALTER TABLE user_profiles 
DROP COLUMN IF EXISTS religiosity_level;

-- التحقق من إزالة العمود
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'religiosity_level';

-- ملاحظة: تأكد من عمل نسخة احتياطية من قاعدة البيانات قبل تنفيذ هذا الأمر
-- يمكنك استخدام الأمر التالي لإنشاء نسخة احتياطية:
-- pg_dump -h your_host -U your_username -d your_database > backup_before_remove_religiosity_level.sql