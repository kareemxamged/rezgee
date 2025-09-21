-- Insert Enhanced Digital Safety Articles (الأمان الرقمي)
-- This file contains comprehensive articles about digital safety and security in online marriage platforms
-- Created as part of the articles system enhancement

DO $$
DECLARE
    digital_safety_id UUID;
    sample_user_id UUID;
    dr_omar_tech_id UUID;
    expert_layla_id UUID;
    specialist_ahmed_id UUID;
    consultant_fatima_id UUID;
BEGIN
    -- Get category ID
    SELECT id INTO digital_safety_id FROM article_categories WHERE name = 'الأمان الرقمي';
    
    -- Get a sample user ID
    SELECT id INTO sample_user_id FROM users LIMIT 1;
    
    -- Create specialized authors for digital safety articles
    IF sample_user_id IS NULL THEN
        -- Create Dr. Omar Al-Techni - Cybersecurity Expert
        INSERT INTO users (email, full_name, title, bio) VALUES
        ('dr.omar.tech@rezge.com', 'د. عمر التقني', 'خبير أمن المعلومات والأمان الرقمي', 'دكتور في أمن المعلومات، خبير في الأمان الرقمي والحماية من الجرائم الإلكترونية، له خبرة 15 عاماً في مجال أمن المعلومات، مؤلف عدة كتب في الأمان الرقمي')
        RETURNING id INTO dr_omar_tech_id;
        
        -- Create Layla Al-Amani - Digital Safety Expert
        INSERT INTO users (email, full_name, title, bio) VALUES
        ('layla.amani@rezge.com', 'أ. ليلى الأماني', 'خبيرة الأمان الرقمي والحماية الإلكترونية', 'خبيرة في الأمان الرقمي والحماية من الاحتيال الإلكتروني، متخصصة في أمان مواقع التواصل والزواج، لها خبرة 12 عاماً في مجال الأمان الرقمي')
        RETURNING id INTO expert_layla_id;
        
        -- Create Ahmed Al-Himaya - Security Specialist
        INSERT INTO users (email, full_name, title, bio) VALUES
        ('ahmed.himaya@rezge.com', 'أ. أحمد الحماية', 'مختص في أمان المواقع الإلكترونية', 'مختص في أمان المواقع الإلكترونية والحماية من الاختراق، مستشار أمني معتمد، له خبرة واسعة في حماية البيانات الشخصية')
        RETURNING id INTO specialist_ahmed_id;
        
        -- Create Fatima Al-Waayi - Awareness Consultant
        INSERT INTO users (email, full_name, title, bio) VALUES
        ('fatima.waayi@rezge.com', 'أ. فاطمة الواعي', 'مستشارة التوعية الرقمية', 'مستشارة في التوعية الرقمية والحماية من الاحتيال الإلكتروني، متخصصة في تثقيف المستخدمين حول الأمان الرقمي، لها برامج توعوية متعددة')
        RETURNING id INTO consultant_fatima_id;
        
        -- Set default author
        sample_user_id := dr_omar_tech_id;
    ELSE
        dr_omar_tech_id := sample_user_id;
        expert_layla_id := sample_user_id;
        specialist_ahmed_id := sample_user_id;
        consultant_fatima_id := sample_user_id;
    END IF;
    
    -- Insert comprehensive Digital Safety Articles
    INSERT INTO articles (title, excerpt, content, author_id, category_id, tags, published_at, read_time, views, likes, comments_count, featured, status) VALUES
    
    -- Article 1: الحماية من المحتالين في مواقع الزواج
    (
        'الحماية من المحتالين في مواقع الزواج: دليل شامل للأمان الرقمي',
        'تعلم كيفية حماية نفسك من المحتالين والنصابين في مواقع الزواج الإلكترونية، مع نصائح عملية لتجنب الوقوع في فخ الاحتيال والحفاظ على أمانك وخصوصيتك.',
        '<div class="article-content">
<h2>🚨 مقدمة: أهمية الأمان في مواقع الزواج</h2>
<p>مع انتشار مواقع الزواج الإلكترونية، ازدادت أيضاً محاولات الاحتيال والنصب التي تستهدف الباحثين عن شريك الحياة. لذلك من المهم جداً معرفة كيفية حماية النفس من هذه المخاطر والتعامل بحذر وذكاء مع المنصات الرقمية.</p>

<h2>🎭 أنواع المحتالين في مواقع الزواج</h2>

<h3>1. المحتال العاطفي (Romance Scammer)</h3>
<ul>
<li><strong>الأسلوب:</strong> يستخدم المشاعر والعواطف للخداع</li>
<li><strong>الهدف:</strong> الحصول على المال أو المعلومات الشخصية</li>
<li><strong>العلامات:</strong> إظهار حب مفرط بسرعة، طلب المال، تجنب المكالمات المرئية</li>
<li><strong>الضحايا المستهدفة:</strong> الأشخاص العاطفيون والوحيدون</li>
</ul>

<h3>2. محتال الهوية المزيفة</h3>
<ul>
<li><strong>الأسلوب:</strong> استخدام صور وهوية شخص آخر</li>
<li><strong>الهدف:</strong> خداع الضحية حول شخصيته الحقيقية</li>
<li><strong>العلامات:</strong> صور مثالية جداً، تجنب اللقاءات، قصص غير متسقة</li>
<li><strong>المخاطر:</strong> الوقوع في علاقة مع شخص مجهول</li>
</ul>

<h3>3. محتال المعلومات الشخصية</h3>
<ul>
<li><strong>الأسلوب:</strong> طلب معلومات شخصية حساسة</li>
<li><strong>الهدف:</strong> سرقة الهوية أو استخدام المعلومات لأغراض إجرامية</li>
<li><strong>العلامات:</strong> أسئلة مفصلة عن المال، العمل، العنوان</li>
<li><strong>المخاطر:</strong> سرقة الهوية، الاحتيال المالي</li>
</ul>

<h3>4. المحتال المالي</h3>
<ul>
<li><strong>الأسلوب:</strong> اختلاق قصص حزينة لطلب المال</li>
<li><strong>الهدف:</strong> الحصول على أموال من الضحية</li>
<li><strong>العلامات:</strong> قصص الطوارئ، طلب المساعدة المالية، الإلحاح</li>
<li><strong>المخاطر:</strong> خسارة مالية، استغلال عاطفي</li>
</ul>

<h2>🚩 علامات التحذير من المحتالين</h2>

<h3>علامات في الملف الشخصي:</h3>
<ul>
<li><strong>صور مثالية جداً:</strong> صور تبدو مثل صور المشاهير أو النماذج</li>
<li><strong>معلومات قليلة:</strong> ملف شخصي فارغ أو معلومات غامضة</li>
<li><strong>تناقضات:</strong> معلومات متضاربة في الملف الشخصي</li>
<li><strong>ملف جديد:</strong> حساب تم إنشاؤه حديثاً بدون تاريخ</li>
<li><strong>عدم وجود أصدقاء:</strong> عدم وجود تفاعل اجتماعي</li>
</ul>

<h3>علامات في التواصل:</h3>
<ul>
<li><strong>الحب السريع:</strong> إظهار مشاعر قوية بسرعة غير طبيعية</li>
<li><strong>تجنب المكالمات:</strong> رفض المكالمات الصوتية أو المرئية</li>
<li><strong>قصص غريبة:</strong> قصص معقدة عن العمل أو السفر</li>
<li><strong>طلب المال:</strong> طلب مساعدة مالية لأي سبب</li>
<li><strong>الإلحاح:</strong> الضغط لاتخاذ قرارات سريعة</li>
</ul>

<h3>علامات في السلوك:</h3>
<ul>
<li><strong>تجنب اللقاءات:</strong> اختلاق أعذار لعدم اللقاء</li>
<li><strong>أسئلة شخصية:</strong> طرح أسئلة حساسة عن المال والعمل</li>
<li><strong>عدم الاتساق:</strong> تناقض في المعلومات المقدمة</li>
<li><strong>التلاعب العاطفي:</strong> استخدام العواطف للتأثير</li>
</ul>

<h2>🛡️ استراتيجيات الحماية</h2>

<h3>1. التحقق من الهوية</h3>
<ul>
<li><strong>البحث العكسي للصور:</strong> استخدام Google Images للتحقق من الصور</li>
<li><strong>التحقق من المعلومات:</strong> البحث عن المعلومات المقدمة</li>
<li><strong>طلب صور إضافية:</strong> طلب صور حديثة ومحددة</li>
<li><strong>المكالمات المرئية:</strong> الإصرار على مكالمة فيديو</li>
</ul>

<h3>2. حماية المعلومات الشخصية</h3>
<ul>
<li><strong>عدم مشاركة معلومات حساسة:</strong> رقم الهوية، الحساب البنكي، العنوان</li>
<li><strong>استخدام اسم مستعار:</strong> في البداية حتى التأكد</li>
<li><strong>تجنب تفاصيل العمل:</strong> عدم ذكر مكان العمل بالتفصيل</li>
<li><strong>حماية الصور:</strong> عدم إرسال صور شخصية حساسة</li>
</ul>

<h3>3. التواصل الآمن</h3>
<ul>
<li><strong>استخدام منصة الموقع:</strong> عدم الانتقال لتطبيقات أخرى بسرعة</li>
<li><strong>التدرج في التواصل:</strong> عدم التسرع في مشاركة المعلومات</li>
<li><strong>حفظ المحادثات:</strong> الاحتفاظ بسجل للمحادثات</li>
<li><strong>الثقة التدريجية:</strong> بناء الثقة بشكل تدريجي</li>
</ul>

<h3>4. اللقاءات الآمنة</h3>
<ul>
<li><strong>اللقاء في مكان عام:</strong> اختيار أماكن عامة ومزدحمة</li>
<li><strong>إخبار الأهل:</strong> إعلام شخص موثوق عن اللقاء</li>
<li><strong>وسائل النقل الخاصة:</strong> عدم الاعتماد على الطرف الآخر</li>
<li><strong>تحديد وقت محدد:</strong> وضع حد زمني للقاء</li>
</ul>

<h2>💰 الحماية من الاحتيال المالي</h2>

<h3>قواعد ذهبية:</h3>
<ul>
<li><strong>لا تُرسل أموالاً أبداً:</strong> مهما كانت القصة مقنعة</li>
<li><strong>لا تُشارك معلومات مصرفية:</strong> أرقام الحسابات أو البطاقات</li>
<li><strong>لا تُقرض أموالاً:</strong> لشخص لم تلتقِ به شخصياً</li>
<li><strong>لا تُستثمر معاً:</strong> في مشاريع أو استثمارات</li>
</ul>

<h3>حيل شائعة للاحتيال المالي:</h3>
<ul>
<li><strong>الطوارئ الطبية:</strong> ادعاء المرض أو الحاجة لعلاج</li>
<li><strong>مشاكل السفر:</strong> ادعاء فقدان الجواز أو المال</li>
<li><strong>الاستثمارات المربحة:</strong> عروض استثمار مغرية</li>
<li><strong>الهدايا المكلفة:</strong> طلب المال لشراء هدايا</li>
</ul>

<h2>🔍 كيفية التحقق من صحة الشخص</h2>

<h3>خطوات التحقق:</h3>
<ol>
<li><strong>البحث في محركات البحث:</strong> البحث عن اسم الشخص</li>
<li><strong>فحص الصور:</strong> استخدام البحث العكسي للصور</li>
<li><strong>التحقق من وسائل التواصل:</strong> البحث عن حسابات أخرى</li>
<li><strong>طلب إثباتات:</strong> طلب صور مع ورقة مكتوب عليها اسمك</li>
<li><strong>المكالمات المرئية:</strong> الإصرار على مكالمة فيديو</li>
<li><strong>اللقاء الشخصي:</strong> ترتيب لقاء في مكان عام</li>
</ol>

<h3>أدوات التحقق:</h3>
<ul>
<li><strong>Google Images:</strong> للبحث العكسي عن الصور</li>
<li><strong>TinEye:</strong> أداة أخرى للبحث عن الصور</li>
<li><strong>Social Catfish:</strong> للتحقق من الهويات الرقمية</li>
<li><strong>محركات البحث:</strong> Google, Bing للبحث عن المعلومات</li>
</ul>

<h2>📱 أمان التطبيقات والمواقع</h2>

<h3>اختيار المواقع الآمنة:</h3>
<ul>
<li><strong>المواقع المعروفة:</strong> اختيار مواقع لها سمعة جيدة</li>
<li><strong>التحقق من الأمان:</strong> وجود شهادة SSL (https://)</li>
<li><strong>سياسة الخصوصية:</strong> قراءة سياسة حماية البيانات</li>
<li><strong>نظام التحقق:</strong> وجود نظام للتحقق من الهويات</li>
</ul>

<h3>إعدادات الأمان:</h3>
<ul>
<li><strong>كلمات مرور قوية:</strong> استخدام كلمات مرور معقدة</li>
<li><strong>المصادقة الثنائية:</strong> تفعيل 2FA عند توفرها</li>
<li><strong>إعدادات الخصوصية:</strong> ضبط من يمكنه رؤية ملفك</li>
<li><strong>التحديث المستمر:</strong> تحديث التطبيقات والمتصفحات</li>
</ul>

<h2>🚨 ماذا تفعل عند الاشتباه في الاحتيال</h2>

<h3>خطوات فورية:</h3>
<ol>
<li><strong>قطع التواصل:</strong> إيقاف جميع أشكال التواصل</li>
<li><strong>حفظ الأدلة:</strong> أخذ لقطات شاشة للمحادثات</li>
<li><strong>الإبلاغ للموقع:</strong> إبلاغ إدارة الموقع عن الحساب</li>
<li><strong>تغيير كلمات المرور:</strong> إذا تم مشاركة أي معلومات</li>
<li><strong>مراقبة الحسابات:</strong> مراقبة الحسابات المصرفية</li>
</ol>

<h3>الإبلاغ للجهات المختصة:</h3>
<ul>
<li><strong>الشرطة المحلية:</strong> في حالة خسارة مالية</li>
<li><strong>البنك:</strong> إذا تم مشاركة معلومات مصرفية</li>
<li><strong>مكافحة الجرائم الإلكترونية:</strong> للإبلاغ عن الاحتيال</li>
<li><strong>إدارة الموقع:</strong> لحماية المستخدمين الآخرين</li>
</ul>

<h2>🎯 خاتمة</h2>
<p>الأمان في مواقع الزواج مسؤولية مشتركة بين المستخدم والموقع. باتباع هذه النصائح والإرشادات، يمكنك حماية نفسك من المحتالين والاستمتاع بتجربة آمنة في البحث عن شريك الحياة.</p>

<p><strong>تذكر: الحذر والذكاء في التعامل هما أفضل وسائل الحماية من الاحتيال الرقمي.</strong></p>
</div>',
        dr_omar_tech_id,
        digital_safety_id,
        ARRAY['الأمان الرقمي', 'الحماية من الاحتيال', 'مواقع الزواج', 'الأمان الإلكتروني', 'المحتالين', 'الحماية الشخصية'],
        NOW() - INTERVAL '7 days',
        22,
        2890,
        201,
        56,
        true,
        'published'
    );

END $$;
