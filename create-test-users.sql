-- إنشاء حسابات وهمية ببيانات حقيقية وواقعية
-- تاريخ الإنشاء: 2025-01-08
-- الغرض: ملء قاعدة البيانات بحسابات تجريبية لاختبار صفحة البحث

-- حسابات الرجال
INSERT INTO public.users (
    id, email, first_name, last_name, age, gender, city, nationality, 
    marital_status, profession, bio, verified, status, created_at
) VALUES 
-- رجال سعوديون
(gen_random_uuid(), 'ahmed.alharbi@example.com', 'أحمد', 'الحربي', 28, 'male', 'الرياض', 'المملكة العربية السعودية', 'single', 'مهندس برمجيات', 'مهندس برمجيات أعمل في شركة تقنية كبرى، أحب القراءة والرياضة، أبحث عن شريكة حياة ملتزمة ومتفهمة.', true, 'active', NOW()),

(gen_random_uuid(), 'mohammed.alsaeed@example.com', 'محمد', 'السعيد', 32, 'male', 'جدة', 'المملكة العربية السعودية', 'single', 'طبيب', 'طبيب في تخصص الباطنية، أحب السفر والاستطلاع، أقدر الحياة الأسرية وأبحث عن زوجة صالحة لبناء أسرة مسلمة.', true, 'active', NOW()),

(gen_random_uuid(), 'omar.alqahtani@example.com', 'عمر', 'القحطاني', 29, 'male', 'الدمام', 'المملكة العربية السعودية', 'single', 'محاسب', 'محاسب قانوني أعمل في القطاع المصرفي، أحب الطبخ والأنشطة الخارجية، أبحث عن شريكة تشاركني اهتماماتي.', true, 'active', NOW()),

-- رجال إماراتيون
(gen_random_uuid(), 'khalid.almansouri@example.com', 'خالد', 'المنصوري', 30, 'male', 'دبي', 'الإمارات العربية المتحدة', 'single', 'مدير مشاريع', 'مدير مشاريع في شركة عقارية، أحب الرياضة والتصوير، أقدر التقاليد وأبحث عن زوجة محترمة ومتعلمة.', true, 'active', NOW()),

(gen_random_uuid(), 'saeed.alkaabi@example.com', 'سعيد', 'الكعبي', 27, 'male', 'أبوظبي', 'الإمارات العربية المتحدة', 'single', 'مهندس مدني', 'مهندس مدني أعمل في مشاريع البنية التحتية، أحب القراءة والسباحة، أبحث عن شريكة حياة متدينة وطموحة.', true, 'active', NOW()),

-- رجال مصريون
(gen_random_uuid(), 'hassan.mohamed@example.com', 'حسن', 'محمد', 31, 'male', 'القاهرة', 'مصر', 'single', 'مدرس', 'مدرس لغة عربية في المرحلة الثانوية، أحب الأدب والشعر، أبحث عن زوجة متعلمة تقدر العلم والثقافة.', true, 'active', NOW()),

(gen_random_uuid(), 'youssef.ahmed@example.com', 'يوسف', 'أحمد', 26, 'male', 'الإسكندرية', 'مصر', 'single', 'صيدلي', 'صيدلي أعمل في صيدلية خاصة، أحب الرياضة والموسيقى، أبحث عن شريكة حياة صالحة ومتفهمة.', true, 'active', NOW()),

-- رجال أردنيون
(gen_random_uuid(), 'fadi.khouri@example.com', 'فادي', 'خوري', 33, 'male', 'عمان', 'الأردن', 'single', 'مهندس كهرباء', 'مهندس كهرباء أعمل في شركة استشارية، أحب السفر والطبيعة، أبحث عن زوجة مؤمنة وحنونة.', true, 'active', NOW()),

-- رجال كويتيون
(gen_random_uuid(), 'abdullah.alrashid@example.com', 'عبدالله', 'الراشد', 29, 'male', 'الكويت', 'الكويت', 'single', 'محلل مالي', 'محلل مالي في بنك كويتي، أحب الاستثمار والتجارة، أبحث عن شريكة حياة ذكية ومتدينة.', true, 'active', NOW());

-- حسابات النساء
INSERT INTO public.users (
    id, email, first_name, last_name, age, gender, city, nationality, 
    marital_status, profession, bio, verified, status, created_at
) VALUES 
-- نساء سعوديات
(gen_random_uuid(), 'fatima.alharbi@example.com', 'فاطمة', 'الحربي', 25, 'female', 'الرياض', 'المملكة العربية السعودية', 'single', 'معلمة', 'معلمة رياضيات في المرحلة الابتدائية، أحب الأطفال والتعليم، أبحث عن زوج صالح يقدر التعليم والأسرة.', true, 'active', NOW()),

(gen_random_uuid(), 'aisha.alsaeed@example.com', 'عائشة', 'السعيد', 27, 'female', 'جدة', 'المملكة العربية السعودية', 'single', 'طبيبة أسنان', 'طبيبة أسنان أعمل في عيادة خاصة، أحب القراءة والرسم، أبحث عن شريك حياة متدين ومتفهم.', true, 'active', NOW()),

(gen_random_uuid(), 'maryam.alqahtani@example.com', 'مريم', 'القحطاني', 24, 'female', 'الدمام', 'المملكة العربية السعودية', 'single', 'مصممة جرافيك', 'مصممة جرافيك أعمل بشكل حر، أحب الفن والإبداع، أبحث عن زوج يقدر الفن ويدعم طموحاتي.', true, 'active', NOW()),

-- نساء إماراتيات
(gen_random_uuid(), 'noura.almansouri@example.com', 'نورا', 'المنصوري', 26, 'female', 'دبي', 'الإمارات العربية المتحدة', 'single', 'محاسبة', 'محاسبة في شركة استشارية، أحب السفر والثقافات المختلفة، أبحث عن شريك حياة طموح ومتفهم.', true, 'active', NOW()),

(gen_random_uuid(), 'sara.alkaabi@example.com', 'سارة', 'الكعبي', 28, 'female', 'أبوظبي', 'الإمارات العربية المتحدة', 'single', 'مهندسة معمارية', 'مهندسة معمارية أعمل في مكتب تصميم، أحب التصميم والديكور، أبحث عن زوج يشاركني حب الجمال والإبداع.', true, 'active', NOW()),

-- نساء مصريات
(gen_random_uuid(), 'zeinab.mohamed@example.com', 'زينب', 'محمد', 29, 'female', 'القاهرة', 'مصر', 'single', 'صحفية', 'صحفية أعمل في جريدة محلية، أحب الكتابة والتحقيقات، أبحث عن شريك حياة مثقف يقدر عملي.', true, 'active', NOW()),

(gen_random_uuid(), 'dina.ahmed@example.com', 'دينا', 'أحمد', 23, 'female', 'الإسكندرية', 'مصر', 'single', 'مترجمة', 'مترجمة فورية للغة الإنجليزية، أحب اللغات والثقافات، أبحث عن زوج متعلم ومتفتح الذهن.', true, 'active', NOW()),

-- نساء أردنيات
(gen_random_uuid(), 'rana.khouri@example.com', 'رنا', 'خوري', 30, 'female', 'عمان', 'الأردن', 'single', 'ممرضة', 'ممرضة في مستشفى حكومي، أحب مساعدة الناس والعمل الخيري، أبحث عن شريك حياة صالح ومتفهم.', true, 'active', NOW()),

-- نساء كويتيات
(gen_random_uuid(), 'layla.alrashid@example.com', 'ليلى', 'الراشد', 25, 'female', 'الكويت', 'الكويت', 'single', 'مهندسة بترول', 'مهندسة بترول أعمل في شركة نفط، أحب التحديات والعلوم، أبحث عن زوج يقدر طموحي المهني.', true, 'active', NOW()),

-- نساء قطريات
(gen_random_uuid(), 'amina.althani@example.com', 'أمينة', 'الثاني', 27, 'female', 'الدوحة', 'قطر', 'single', 'محامية', 'محامية أعمل في مكتب قانوني، أحب العدالة والدفاع عن الحقوق، أبحث عن شريك حياة عادل ومتفهم.', true, 'active', NOW()),

-- المزيد من الرجال
(gen_random_uuid(), 'tariq.albanna@example.com', 'طارق', 'البنا', 34, 'male', 'بيروت', 'لبنان', 'single', 'مهندس شبكات', 'مهندس شبكات أعمل في شركة اتصالات، أحب التكنولوجيا والابتكار، أبحث عن زوجة متعلمة ومتفهمة.', true, 'active', NOW()),

(gen_random_uuid(), 'waleed.alshami@example.com', 'وليد', 'الشامي', 28, 'male', 'دمشق', 'سوريا', 'single', 'مدرس فيزياء', 'مدرس فيزياء في الجامعة، أحب البحث العلمي والتجارب، أبحث عن شريكة حياة ذكية تقدر العلم.', true, 'active', NOW()),

(gen_random_uuid(), 'nasser.aliraqi@example.com', 'ناصر', 'العراقي', 31, 'male', 'بغداد', 'العراق', 'single', 'طبيب جراح', 'طبيب جراح أعمل في مستشفى حكومي، أحب مساعدة الناس والعمل الإنساني، أبحث عن زوجة صبورة ومتفهمة.', true, 'active', NOW()),

(gen_random_uuid(), 'ali.altunisi@example.com', 'علي', 'التونسي', 29, 'male', 'تونس', 'تونس', 'single', 'مهندس زراعي', 'مهندس زراعي أعمل في مشاريع التنمية الريفية، أحب الطبيعة والزراعة، أبحث عن شريكة تحب الحياة البسيطة.', true, 'active', NOW()),

(gen_random_uuid(), 'karim.almaghribi@example.com', 'كريم', 'المغربي', 30, 'male', 'الرباط', 'المغرب', 'single', 'مصمم ويب', 'مصمم ويب أعمل بشكل حر، أحب الإبداع والتصميم، أبحث عن زوجة تقدر الفن والإبداع.', true, 'active', NOW()),

-- المزيد من النساء
(gen_random_uuid(), 'hala.albanna@example.com', 'هالة', 'البنا', 26, 'female', 'بيروت', 'لبنان', 'single', 'مهندسة كيميائية', 'مهندسة كيميائية أعمل في مصنع أدوية، أحب البحث والتطوير، أبحث عن شريك حياة طموح ومتفهم.', true, 'active', NOW()),

(gen_random_uuid(), 'reem.alshami@example.com', 'ريم', 'الشامي', 24, 'female', 'دمشق', 'سوريا', 'single', 'طبيبة نفسية', 'طبيبة نفسية أعمل في عيادة خاصة، أحب مساعدة الناس وحل مشاكلهم، أبحث عن زوج متفهم وصبور.', true, 'active', NOW()),

(gen_random_uuid(), 'nour.aliraqi@example.com', 'نور', 'العراقي', 28, 'female', 'بغداد', 'العراق', 'single', 'مهندسة معلوماتية', 'مهندسة معلوماتية أعمل في شركة تطوير برمجيات، أحب التكنولوجيا والبرمجة، أبحث عن شريك يشاركني اهتماماتي التقنية.', true, 'active', NOW()),

(gen_random_uuid(), 'salma.altunisi@example.com', 'سلمى', 'التونسي', 25, 'female', 'تونس', 'تونس', 'single', 'مدرسة لغة فرنسية', 'مدرسة لغة فرنسية في المرحلة الثانوية، أحب اللغات والأدب، أبحث عن زوج مثقف يقدر التعليم.', true, 'active', NOW()),

(gen_random_uuid(), 'yasmin.almaghribi@example.com', 'ياسمين', 'المغربي', 27, 'female', 'الرباط', 'المغرب', 'single', 'صيدلانية', 'صيدلانية أعمل في مستشفى، أحب مساعدة المرضى والعمل الطبي، أبحث عن شريك حياة صالح ومتدين.', true, 'active', NOW()),

-- حسابات إضافية متنوعة
(gen_random_uuid(), 'ibrahim.bahraini@example.com', 'إبراهيم', 'البحريني', 32, 'male', 'المنامة', 'البحرين', 'single', 'مدير بنك', 'مدير فرع في بنك تجاري، أحب الاستثمار والأعمال، أبحث عن زوجة ذكية تفهم عالم الأعمال.', true, 'active', NOW()),

(gen_random_uuid(), 'marwa.bahraini@example.com', 'مروة', 'البحريني', 26, 'female', 'المنامة', 'البحرين', 'single', 'مهندسة بيئية', 'مهندسة بيئية أعمل في مشاريع الاستدامة، أحب البيئة والطبيعة، أبحث عن شريك يهتم بالبيئة مثلي.', true, 'active', NOW()),

(gen_random_uuid(), 'salem.omani@example.com', 'سالم', 'العماني', 29, 'male', 'مسقط', 'عُمان', 'single', 'مهندس بحري', 'مهندس بحري أعمل في شركة شحن، أحب البحر والسفر، أبحث عن شريكة حياة تحب المغامرة والسفر.', true, 'active', NOW()),

(gen_random_uuid(), 'amal.omani@example.com', 'أمل', 'العماني', 24, 'female', 'مسقط', 'عُمان', 'single', 'معلمة تربية فنية', 'معلمة تربية فنية أحب الرسم والفنون، أعمل على تطوير مواهب الأطفال، أبحث عن زوج يقدر الفن والإبداع.', true, 'active', NOW());
