-- Insert Enhanced Family Guidance Articles (التوجيه الأسري)
-- This file contains comprehensive articles about family guidance and parental involvement in marriage decisions
-- Created as part of the articles system enhancement

DO $$
DECLARE
    family_guidance_id UUID;
    sample_user_id UUID;
    dr_ibrahim_id UUID;
    dr_aisha_id UUID;
    counselor_nadia_id UUID;
    prof_hassan_id UUID;
BEGIN
    -- Get category ID
    SELECT id INTO family_guidance_id FROM article_categories WHERE name = 'التوجيه الأسري';
    
    -- Get a sample user ID
    SELECT id INTO sample_user_id FROM users LIMIT 1;
    
    -- Create specialized authors for family guidance articles
    IF sample_user_id IS NULL THEN
        -- Create Dr. Ibrahim Al-Mansouri - Family Counselor
        INSERT INTO users (email, full_name, title, bio) VALUES
        ('dr.ibrahim@rezge.com', 'د. إبراهيم المنصوري', 'مستشار أسري ومختص في التوجيه الأسري', 'دكتور في علم النفس الأسري، مختص في التوجيه الأسري والعلاقات بين الأجيال، له خبرة 22 عاماً في مجال الاستشارات الأسرية، مؤلف كتاب "دور الأهل في بناء الأسرة"')
        RETURNING id INTO dr_ibrahim_id;
        
        -- Create Dr. Aisha Al-Qasimi - Family Dynamics Expert
        INSERT INTO users (email, full_name, title, bio) VALUES
        ('dr.aisha@rezge.com', 'د. عائشة القاسمي', 'خبيرة في ديناميكيات الأسرة', 'دكتورة في علم الاجتماع الأسري، متخصصة في دراسة العلاقات الأسرية والتوازن بين الأجيال، لها أبحاث متعددة في مجال التوجيه الأسري')
        RETURNING id INTO dr_aisha_id;
        
        -- Create Nadia Al-Zahra - Certified Family Counselor
        INSERT INTO users (email, full_name, title, bio) VALUES
        ('nadia.zahra@rezge.com', 'أ. نادية الزهراء', 'مستشارة أسرية معتمدة', 'مستشارة أسرية معتمدة، متخصصة في التوسط الأسري وحل النزاعات، حاصلة على ماجستير في الإرشاد الأسري، لها خبرة 16 عاماً في مساعدة الأسر')
        RETURNING id INTO counselor_nadia_id;
        
        -- Create Prof. Hassan Al-Rashid - Family Studies Professor
        INSERT INTO users (email, full_name, title, bio) VALUES
        ('prof.hassan@rezge.com', 'أ.د. حسن الراشد', 'أستاذ الدراسات الأسرية', 'أستاذ الدراسات الأسرية في الجامعة، باحث في مجال الأسرة والمجتمع، له عدة مؤلفات في مجال التوجيه الأسري والعلاقات الأسرية')
        RETURNING id INTO prof_hassan_id;
        
        -- Set default author
        sample_user_id := dr_ibrahim_id;
    ELSE
        dr_ibrahim_id := sample_user_id;
        dr_aisha_id := sample_user_id;
        counselor_nadia_id := sample_user_id;
        prof_hassan_id := sample_user_id;
    END IF;
    
    -- Insert comprehensive Family Guidance Articles
    INSERT INTO articles (title, excerpt, content, author_id, category_id, tags, published_at, read_time, views, likes, comments_count, featured, status) VALUES
    
    -- Article 1: دور الأهل في اختيار شريك الحياة
    (
        'دور الأهل في اختيار شريك الحياة: التوازن بين الحكمة والحرية',
        'تعرف على الدور المهم والحكيم للأهل في مساعدة أبنائهم على اختيار شريك الحياة المناسب، مع الحفاظ على التوازن بين التوجيه الأسري واحترام اختيار الأبناء.',
        '<div class="article-content">
<h2>👨‍👩‍👧‍👦 أهمية دور الأهل في الزواج</h2>
<p>يلعب الأهل دوراً محورياً ومهماً في عملية اختيار شريك الحياة، فهم يمتلكون الخبرة والحكمة التي تساعد الأبناء في اتخاذ القرار الصحيح. هذا الدور يتطلب توازناً دقيقاً بين التوجيه والنصح من جهة، واحترام رغبة الأبناء وحريتهم في الاختيار من جهة أخرى.</p>

<h2>📚 الأساس الشرعي لدور الأهل</h2>
<p>الإسلام أعطى الأهل دوراً مهماً في عملية الزواج، وهذا الدور مؤسس على النصوص الشرعية والحكمة العملية.</p>

<h3>النصوص الشرعية:</h3>
<ul>
<li><strong>دور الولي:</strong> قال النبي صلى الله عليه وسلم: "لا نكاح إلا بولي"</li>
<li><strong>الاستشارة:</strong> قال تعالى: "وشاورهم في الأمر"</li>
<li><strong>بر الوالدين:</strong> "وبالوالدين إحساناً"</li>
<li><strong>طاعة الوالدين:</strong> في المعروف وما لا يخالف الشرع</li>
</ul>

<h3>الحكمة من إشراك الأهل:</h3>
<ul>
<li><strong>الخبرة والتجربة:</strong> الأهل لديهم خبرة أكبر في الحياة</li>
<li><strong>النظرة الشمولية:</strong> رؤية أوسع للأمور</li>
<li><strong>المعرفة بالأسر:</strong> معرفة أفضل بالعائلات والأنساب</li>
<li><strong>الحماية من الأخطاء:</strong> تجنب الوقوع في اختيارات خاطئة</li>
</ul>

<h2>⚖️ التوازن المطلوب</h2>
<p>الهدف هو تحقيق التوازن الصحيح بين دور الأهل في التوجيه والنصح، وحق الأبناء في الاختيار والقرار النهائي.</p>

<h3>حقوق الأهل:</h3>
<ul>
<li><strong>إبداء الرأي:</strong> حق التعبير عن وجهة نظرهم</li>
<li><strong>تقديم النصح:</strong> مشاركة خبرتهم وحكمتهم</li>
<li><strong>التحقق والاستفسار:</strong> السؤال عن الشريك المحتمل</li>
<li><strong>التوجيه الديني:</strong> التذكير بالمعايير الشرعية</li>
<li><strong>الحماية:</strong> حماية الأبناء من الاختيارات الخاطئة</li>
</ul>

<h3>حقوق الأبناء:</h3>
<ul>
<li><strong>حرية الاختيار:</strong> في إطار الضوابط الشرعية</li>
<li><strong>التعبير عن الرأي:</strong> إبداء وجهة نظرهم بوضوح</li>
<li><strong>رفض الاختيار:</strong> إذا لم يقتنعوا به</li>
<li><strong>طلب التوضيح:</strong> فهم أسباب موافقة أو رفض الأهل</li>
<li><strong>الاحترام:</strong> احترام شخصيتهم وقراراتهم</li>
</ul>

<h3>الواجبات المشتركة:</h3>
<ul>
<li><strong>الحوار البناء:</strong> النقاش الهادئ والمثمر</li>
<li><strong>الاحترام المتبادل:</strong> احترام وجهات النظر المختلفة</li>
<li><strong>البحث عن الحلول:</strong> إيجاد حلول وسط مقبولة</li>
<li><strong>الدعاء والاستخارة:</strong> طلب التوفيق من الله</li>
</ul>

<h2>🎯 أدوار الأهل الإيجابية</h2>

<h3>1. دور الناصح والموجه</h3>
<ul>
<li><strong>تقديم المشورة:</strong> بناء على الخبرة والحكمة</li>
<li><strong>التذكير بالمعايير:</strong> المعايير الشرعية والأخلاقية</li>
<li><strong>مشاركة التجارب:</strong> الاستفادة من تجارب الحياة</li>
<li><strong>التوجيه العملي:</strong> نصائح عملية للاختيار</li>
</ul>

<h3>2. دور الباحث والمحقق</h3>
<ul>
<li><strong>البحث عن المعلومات:</strong> جمع معلومات عن الشريك المحتمل</li>
<li><strong>التحقق من السمعة:</strong> السؤال عن الأخلاق والسلوك</li>
<li><strong>معرفة الأسرة:</strong> التعرف على أسرة الشريك</li>
<li><strong>التأكد من الظروف:</strong> الظروف المالية والاجتماعية</li>
</ul>

<h3>3. دور الوسيط والمفاوض</h3>
<ul>
<li><strong>التواصل مع الأسر:</strong> التفاوض حول تفاصيل الزواج</li>
<li><strong>ترتيب اللقاءات:</strong> تنظيم لقاءات التعارف</li>
<li><strong>حل الخلافات:</strong> التوسط في حل أي خلافات</li>
<li><strong>تسهيل الأمور:</strong> تذليل العقبات</li>
</ul>

<h3>4. دور الداعم والمشجع</h3>
<ul>
<li><strong>الدعم العاطفي:</strong> تقديم الدعم النفسي للأبناء</li>
<li><strong>التشجيع:</strong> تشجيع الاختيارات الصحيحة</li>
<li><strong>المساعدة العملية:</strong> المساعدة في ترتيبات الزواج</li>
<li><strong>الدعاء:</strong> الدعاء بالتوفيق والبركة</li>
</ul>

<h2>🚫 أخطاء شائعة يجب تجنبها</h2>

<h3>أخطاء الأهل:</h3>
<ul>
<li><strong>الإجبار:</strong> إجبار الأبناء على اختيار معين</li>
<li><strong>التحكم المفرط:</strong> عدم إعطاء الأبناء حرية الاختيار</li>
<li><strong>التركيز على المظاهر:</strong> إهمال الجوانب الأخلاقية والدينية</li>
<li><strong>المقارنات:</strong> مقارنة الأبناء بالآخرين</li>
<li><strong>التدخل المفرط:</strong> التدخل في كل التفاصيل</li>
</ul>

<h3>أخطاء الأبناء:</h3>
<ul>
<li><strong>تجاهل رأي الأهل:</strong> عدم الاستفادة من خبرتهم</li>
<li><strong>العناد:</strong> رفض النصائح دون تفكير</li>
<li><strong>إخفاء المعلومات:</strong> عدم الصراحة مع الأهل</li>
<li><strong>التسرع:</strong> اتخاذ قرارات متسرعة</li>
<li><strong>عدم الاحترام:</strong> عدم احترام وجهة نظر الأهل</li>
</ul>

<h2>💡 استراتيجيات التوازن الناجح</h2>

<h3>للأهل:</h3>
<ul>
<li><strong>الاستماع أولاً:</strong> فهم رغبات وآراء الأبناء</li>
<li><strong>التوجيه بحكمة:</strong> تقديم النصح دون إجبار</li>
<li><strong>احترام الاختيار:</strong> احترام القرار النهائي للأبناء</li>
<li><strong>التدرج في النصح:</strong> عدم فرض الآراء بقوة</li>
<li><strong>الدعم المستمر:</strong> دعم الأبناء في قراراتهم</li>
</ul>

<h3>للأبناء:</h3>
<ul>
<li><strong>الاستشارة:</strong> طلب المشورة من الأهل</li>
<li><strong>الصراحة:</strong> التعبير عن المشاعر والآراء بوضوح</li>
<li><strong>الاحترام:</strong> احترام خبرة وحكمة الأهل</li>
<li><strong>التفكير الهادئ:</strong> التأمل في نصائح الأهل</li>
<li><strong>البحث عن الحلول:</strong> إيجاد حلول وسط مقبولة</li>
</ul>

<h2>🤝 بناء الحوار البناء</h2>

<h3>مبادئ الحوار الناجح:</h3>
<ul>
<li><strong>الاحترام المتبادل:</strong> احترام وجهات النظر المختلفة</li>
<li><strong>الاستماع الفعال:</strong> الإنصات لبعضكم البعض</li>
<li><strong>التعبير الواضح:</strong> التعبير عن الآراء بوضوح</li>
<li><strong>تجنب الانفعال:</strong> الحفاظ على الهدوء</li>
<li><strong>البحث عن الحلول:</strong> التركيز على إيجاد حلول</li>
</ul>

<h3>خطوات الحوار:</h3>
<ol>
<li><strong>تحديد موعد مناسب:</strong> اختيار وقت هادئ للنقاش</li>
<li><strong>التعبير عن المشاعر:</strong> كل طرف يعبر عن مشاعره</li>
<li><strong>الاستماع للآراء:</strong> فهم وجهة نظر الطرف الآخر</li>
<li><strong>مناقشة الخيارات:</strong> بحث جميع الخيارات المتاحة</li>
<li><strong>الوصول لاتفاق:</strong> إيجاد حل مقبول للجميع</li>
</ol>

<h2>🎯 خاتمة</h2>
<p>دور الأهل في اختيار شريك الحياة دور مهم ومقدس، ولكنه يتطلب حكمة وتوازناً. الهدف هو مساعدة الأبناء على اتخاذ القرار الصحيح مع احترام حريتهم واختيارهم.</p>

<p><strong>نسأل الله أن يوفق جميع الأهل والأبناء لإيجاد التوازن الصحيح، وأن يبارك في اختياراتهم ويرزقهم السعادة والاستقرار.</strong></p>
</div>',
        dr_ibrahim_id,
        family_guidance_id,
        ARRAY['دور الأهل', 'التوجيه الأسري', 'اختيار الشريك', 'التوازن الأسري', 'الحوار الأسري', 'الاستشارة'],
        NOW() - INTERVAL '14 days',
        20,
        1750,
        134,
        31,
        true,
        'published'
    );

END $$;
