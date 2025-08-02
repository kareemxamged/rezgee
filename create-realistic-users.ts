import { createClient } from '@supabase/supabase-js';

// إعداد Supabase
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// قوائم البيانات الواقعية
const maleFirstNames = [
  'أحمد', 'محمد', 'عبدالله', 'عمر', 'علي', 'خالد', 'سعد', 'فهد', 'عبدالعزيز', 'سلطان',
  'ناصر', 'سعود', 'فيصل', 'عبدالرحمن', 'يوسف', 'إبراهيم', 'حسن', 'حسين', 'طارق', 'وليد',
  'مازن', 'عادل', 'نبيل', 'كريم', 'سامي', 'رامي', 'هاني', 'عماد', 'جمال', 'كمال'
];

const femaleFirstNames = [
  'فاطمة', 'عائشة', 'خديجة', 'زينب', 'مريم', 'سارة', 'نورا', 'هند', 'ريم', 'لينا',
  'دانا', 'رنا', 'سلمى', 'ياسمين', 'أمل', 'هالة', 'منى', 'سمر', 'رغد', 'شهد',
  'جود', 'لمى', 'روان', 'تالا', 'جنى', 'ملك', 'غلا', 'رهف', 'بيان', 'ديما'
];

const lastNames = [
  'الأحمد', 'المحمد', 'العبدالله', 'الخالد', 'السعد', 'الفهد', 'العتيبي', 'الحربي', 'القحطاني', 'الدوسري',
  'الشهري', 'الغامدي', 'الزهراني', 'العمري', 'الحارثي', 'المالكي', 'الشمري', 'العنزي', 'المطيري', 'الرشيد',
  'السليم', 'الصالح', 'الناصر', 'الكريم', 'الحكيم', 'الأمين', 'الصادق', 'البار', 'الطيب', 'الكامل'
];

const professions = [
  'مهندس برمجيات', 'طبيب', 'معلم', 'محاسب', 'مهندس مدني', 'صيدلي', 'محامي', 'مهندس كهرباء',
  'طبيب أسنان', 'مدير مشاريع', 'مصمم جرافيك', 'مترجم', 'صحفي', 'ممرض', 'مهندس معماري',
  'محلل مالي', 'مدرس جامعي', 'طبيب نفسي', 'مهندس شبكات', 'مدير تسويق', 'مستشار قانوني',
  'مهندس بترول', 'طبيب جراح', 'مدير مبيعات', 'مهندس صناعي', 'أخصائي تغذية', 'مدير موارد بشرية'
];

const cities = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'تبوك', 'بريدة', 'خميس مشيط', 'حائل',
  'الطائف', 'الجبيل', 'ينبع', 'الأحساء', 'القطيف', 'عرعر', 'سكاكا', 'جيزان', 'نجران', 'الباحة',
  'دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'أم القيوين', 'العين',
  'القاهرة', 'الإسكندرية', 'الجيزة', 'شبرا الخيمة', 'بورسعيد', 'السويس', 'الأقصر', 'أسوان',
  'عمان', 'إربد', 'الزرقاء', 'العقبة', 'السلط', 'مادبا', 'الكرك', 'معان'
];

const nationalities = [
  'المملكة العربية السعودية', 'الإمارات العربية المتحدة', 'مصر', 'الأردن', 'الكويت', 'قطر', 'البحرين', 'عُمان',
  'لبنان', 'سوريا', 'العراق', 'فلسطين', 'تونس', 'المغرب', 'الجزائر', 'ليبيا', 'السودان', 'اليمن'
];

const bios = [
  'شخص طموح أحب التعلم والتطوير المستمر، أبحث عن شريكة حياة تشاركني نفس القيم والأهداف.',
  'أعمل في مجال تخصصي بشغف، أحب القراءة والرياضة، أقدر الحياة الأسرية وأبحث عن زوجة صالحة.',
  'مؤمن بأهمية التوازن بين العمل والحياة الشخصية، أحب السفر واستكشاف الثقافات المختلفة.',
  'أقدر الصدق والوفاء في العلاقات، أحب الأنشطة الخارجية والطبيعة، أبحث عن شريك يفهمني.',
  'متدين وملتزم بتعاليم ديني، أحب العمل الخيري ومساعدة الآخرين، أبحث عن زوجة متدينة.',
  'أحب الفن والثقافة، أقضي وقت فراغي في القراءة والكتابة، أبحث عن شريكة مثقفة ومتفهمة.',
  'شخص اجتماعي أحب قضاء الوقت مع الأصدقاء والعائلة، أقدر التقاليد وأبحث عن زوجة محترمة.',
  'أعمل بجد لتحقيق أهدافي المهنية، أحب الطبخ والأكل الصحي، أبحث عن شريكة تحب الحياة الصحية.',
  'أقدر البساطة في الحياة، أحب الموسيقى والفنون، أبحث عن زوجة تقدر الجمال والإبداع.',
  'متفائل ومحب للحياة، أحب التحديات والمغامرات الآمنة، أبحث عن شريكة تحب المغامرة معي.'
];

// دالة لاختيار عنصر عشوائي من مصفوفة
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// دالة لتوليد عمر عشوائي
function getRandomAge(): number {
  return Math.floor(Math.random() * (45 - 22 + 1)) + 22; // من 22 إلى 45
}

// دالة لتوليد بريد إلكتروني فريد
function generateEmail(firstName: string, lastName: string, index: number): string {
  const cleanFirstName = firstName.replace(/\s+/g, '').toLowerCase();
  const cleanLastName = lastName.replace(/\s+/g, '').toLowerCase();
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
  const domain = getRandomItem(domains);
  
  // تحويل الأسماء العربية إلى أحرف إنجليزية
  const transliteration: { [key: string]: string } = {
    'أ': 'a', 'ا': 'a', 'إ': 'i', 'آ': 'aa', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'a',
    'ى': 'a', 'ء': 'a'
  };
  
  let englishFirstName = '';
  let englishLastName = '';
  
  for (const char of cleanFirstName) {
    englishFirstName += transliteration[char] || char;
  }
  
  for (const char of cleanLastName) {
    englishLastName += transliteration[char] || char;
  }
  
  return `${englishFirstName}.${englishLastName}${index}@${domain}`;
}

// دالة لتوليد رقم هاتف واقعي
function generatePhoneNumber(nationality: string): string {
  const phonePatterns: { [key: string]: () => string } = {
    'المملكة العربية السعودية': () => `+966 5${Math.floor(Math.random() * 90000000 + 10000000)}`,
    'الإمارات العربية المتحدة': () => `+971 5${Math.floor(Math.random() * 9000000 + 1000000)}`,
    'مصر': () => `+20 1${Math.floor(Math.random() * 900000000 + 100000000)}`,
    'الأردن': () => `+962 7${Math.floor(Math.random() * 90000000 + 10000000)}`,
    'الكويت': () => `+965 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
    'قطر': () => `+974 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
    'البحرين': () => `+973 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
    'عُمان': () => `+968 9${Math.floor(Math.random() * 9000000 + 1000000)}`
  };

  const generator = phonePatterns[nationality];
  return generator ? generator() : `+966 5${Math.floor(Math.random() * 90000000 + 10000000)}`;
}

// قوائم الخيارات المحددة حسب قاعدة البيانات
const maritalStatusOptions = ['single', 'married', 'divorced', 'widowed', 'unmarried', 'divorced_female', 'widowed_female'];
const marriageTypeOptions = ['first_wife', 'second_wife', 'only_wife', 'no_objection_polygamy'];
const religiousCommitmentOptions = ['high', 'medium', 'practicing'];
const religiosityLevelOptions = ['not_religious', 'slightly_religious', 'religious', 'very_religious', 'prefer_not_say'];
const prayerCommitmentOptions = ['dont_pray', 'pray_all', 'pray_sometimes', 'prefer_not_say'];
const educationLevelOptions = ['primary', 'secondary', 'diploma', 'bachelor', 'master', 'phd'];
const financialStatusOptions = ['poor', 'below_average', 'average', 'above_average', 'wealthy'];
const monthlyIncomeOptions = ['less_3000', '3000_5000', '5000_8000', '8000_12000', '12000_20000', 'more_20000', 'prefer_not_say'];
const healthStatusOptions = ['excellent', 'very_good', 'good', 'fair', 'poor', 'prefer_not_say'];
const skinColorOptions = ['very_fair', 'fair', 'medium', 'olive', 'dark'];
const bodyTypeOptions = ['slim', 'average', 'athletic', 'heavy'];
const smokingOptions = ['yes', 'no'];
const beardOptions = ['yes', 'no']; // للذكور فقط
const hijabOptions = ['no_hijab', 'hijab', 'niqab', 'prefer_not_say']; // للإناث فقط

// دالة لتوليد الحالة الاجتماعية حسب الجنس
function getMaritalStatus(gender: string): string {
  if (gender === 'male') {
    return getRandomItem(['single', 'married', 'divorced', 'widowed']);
  } else {
    return getRandomItem(['single', 'married', 'divorced_female', 'widowed_female', 'unmarried']);
  }
}

// دالة لتوليد نوع الزواج حسب الجنس والحالة الاجتماعية
function getMarriageType(gender: string, maritalStatus: string): string | null {
  if (maritalStatus === 'single' || maritalStatus === 'unmarried') {
    if (gender === 'male') {
      return getRandomItem(['first_wife', 'no_objection_polygamy']);
    } else {
      return getRandomItem(['only_wife', 'no_objection_polygamy']);
    }
  }
  return null;
}

// دالة لتوليد عدد الأطفال حسب الحالة الاجتماعية والعمر
function getChildrenCount(maritalStatus: string, age: number): number {
  if (maritalStatus === 'single' || maritalStatus === 'unmarried') {
    return 0;
  } else if (maritalStatus === 'married') {
    if (age < 25) return Math.floor(Math.random() * 2); // 0-1
    else if (age < 35) return Math.floor(Math.random() * 4); // 0-3
    else return Math.floor(Math.random() * 6); // 0-5
  } else { // divorced or widowed
    if (age < 30) return Math.floor(Math.random() * 3); // 0-2
    else return Math.floor(Math.random() * 5) + 1; // 1-5
  }
}

// دالة لتوليد الطول والوزن الواقعيين
function getHeightWeight(gender: string): { height: number; weight: number } {
  if (gender === 'male') {
    const height = Math.floor(Math.random() * (185 - 165 + 1)) + 165; // 165-185 cm
    const weight = Math.floor(Math.random() * (95 - 65 + 1)) + 65; // 65-95 kg
    return { height, weight };
  } else {
    const height = Math.floor(Math.random() * (170 - 150 + 1)) + 150; // 150-170 cm
    const weight = Math.floor(Math.random() * (75 - 45 + 1)) + 45; // 45-75 kg
    return { height, weight };
  }
}

// دالة لتوليد مستوى التعليم حسب المهنة
function getEducationLevel(profession: string): string {
  const highEducationProfessions = ['طبيب', 'مهندس', 'محامي', 'صيدلي', 'مدرس جامعي', 'طبيب أسنان', 'طبيب نفسي', 'طبيب جراح'];
  const mediumEducationProfessions = ['معلم', 'محاسب', 'ممرض', 'مصمم جرافيك', 'مترجم', 'صحفي'];

  if (highEducationProfessions.some(prof => profession.includes(prof))) {
    return getRandomItem(['bachelor', 'master', 'phd']);
  } else if (mediumEducationProfessions.some(prof => profession.includes(prof))) {
    return getRandomItem(['diploma', 'bachelor', 'master']);
  } else {
    return getRandomItem(['secondary', 'diploma', 'bachelor']);
  }
}

// دالة لتوليد الوضع المالي حسب المهنة والعمر
function getFinancialStatus(profession: string, age: number): string {
  const highIncomeProfessions = ['طبيب', 'مهندس بترول', 'محامي', 'مدير', 'طبيب جراح'];
  const mediumIncomeProfessions = ['مهندس', 'صيدلي', 'محاسب', 'مدرس جامعي'];

  if (highIncomeProfessions.some(prof => profession.includes(prof))) {
    if (age > 35) return getRandomItem(['above_average', 'wealthy']);
    else return getRandomItem(['average', 'above_average']);
  } else if (mediumIncomeProfessions.some(prof => profession.includes(prof))) {
    return getRandomItem(['average', 'above_average']);
  } else {
    return getRandomItem(['below_average', 'average']);
  }
}

// دالة لتوليد الدخل الشهري حسب الوضع المالي
function getMonthlyIncome(financialStatus: string): string {
  const incomeMap: { [key: string]: string[] } = {
    'poor': ['less_3000'],
    'below_average': ['less_3000', '3000_5000'],
    'average': ['3000_5000', '5000_8000', '8000_12000'],
    'above_average': ['8000_12000', '12000_20000'],
    'wealthy': ['12000_20000', 'more_20000']
  };

  return getRandomItem(incomeMap[financialStatus] || ['prefer_not_say']);
}

// دالة لإنشاء مستخدم واحد
function generateUser(index: number): any {
  const gender = getRandomItem(['male', 'female']);
  const firstName = gender === 'male' ? getRandomItem(maleFirstNames) : getRandomItem(femaleFirstNames);
  const lastName = getRandomItem(lastNames);
  const age = getRandomAge();
  const nationality = getRandomItem(nationalities);
  const city = getRandomItem(cities);
  const profession = getRandomItem(professions);
  const maritalStatus = getMaritalStatus(gender);
  const marriageType = getMarriageType(gender, maritalStatus);
  const childrenCount = getChildrenCount(maritalStatus, age);
  const { height, weight } = getHeightWeight(gender);
  const educationLevel = getEducationLevel(profession);
  const financialStatus = getFinancialStatus(profession, age);
  const monthlyIncome = getMonthlyIncome(financialStatus);
  const email = generateEmail(firstName, lastName, index);
  const phone = generatePhoneNumber(nationality);
  const bio = getRandomItem(bios);

  return {
    id: `gen_random_uuid()`, // سيتم استبدالها في SQL
    email,
    first_name: firstName,
    last_name: lastName,
    phone,
    age,
    gender,
    city,
    nationality,
    marital_status: maritalStatus,
    marriage_type: marriageType,
    children_count: childrenCount,
    residence_location: city, // نفس المدينة
    weight,
    height,
    skin_color: getRandomItem(skinColorOptions),
    body_type: getRandomItem(bodyTypeOptions),
    religiosity_level: getRandomItem(religiosityLevelOptions),
    prayer_commitment: getRandomItem(prayerCommitmentOptions),
    smoking: getRandomItem(smokingOptions),
    beard: gender === 'male' ? getRandomItem(beardOptions) : null,
    hijab: gender === 'female' ? getRandomItem(hijabOptions) : null,
    education_level: educationLevel,
    financial_status: financialStatus,
    work_field: profession, // نفس المهنة
    job_title: profession,
    monthly_income: monthlyIncome,
    health_status: getRandomItem(healthStatusOptions),
    profession,
    religious_commitment: getRandomItem(religiousCommitmentOptions),
    bio,
    looking_for: gender === 'male' ? 'أبحث عن زوجة صالحة ومتدينة' : 'أبحث عن زوج صالح ومتدين',
    verified: true,
    status: 'active',
    profile_visibility: 'public',
    show_phone: Math.random() > 0.5,
    show_email: Math.random() > 0.7,
    allow_messages: true,
    family_can_view: Math.random() > 0.3,
    two_factor_enabled: false,
    login_notifications: true,
    message_notifications: true,
    created_at: 'NOW()',
    updated_at: 'NOW()'
  };
}

// دالة لإنشاء عدة مستخدمين
function generateUsers(count: number): any[] {
  const users: any[] = [];
  for (let i = 1; i <= count; i++) {
    users.push(generateUser(i));
  }
  return users;
}

// دالة لتحويل البيانات إلى SQL
function generateSQL(users: any[]): string {
  let sql = `-- إنشاء حسابات وهمية واقعية - تم إنشاؤها تلقائياً
-- تاريخ الإنشاء: ${new Date().toISOString()}
-- عدد الحسابات: ${users.length}

INSERT INTO public.users (
  id, email, first_name, last_name, phone, age, gender, city, nationality,
  marital_status, marriage_type, children_count, residence_location,
  weight, height, skin_color, body_type, religiosity_level, prayer_commitment,
  smoking, beard, hijab, education_level, financial_status, work_field,
  job_title, monthly_income, health_status, profession, religious_commitment,
  bio, looking_for, verified, status, profile_visibility, show_phone,
  show_email, allow_messages, family_can_view, two_factor_enabled,
  login_notifications, message_notifications, created_at, updated_at
) VALUES\n`;

  const values = users.map(user => {
    const formatValue = (value: any) => {
      if (value === null || value === undefined) return 'NULL';
      if (typeof value === 'string' && value !== 'NOW()' && value !== 'gen_random_uuid()') {
        return `'${value.replace(/'/g, "''")}'`; // escape single quotes
      }
      if (typeof value === 'boolean') return value.toString();
      return value;
    };

    return `(gen_random_uuid(), ${formatValue(user.email)}, ${formatValue(user.first_name)}, ${formatValue(user.last_name)}, ${formatValue(user.phone)}, ${user.age}, ${formatValue(user.gender)}, ${formatValue(user.city)}, ${formatValue(user.nationality)}, ${formatValue(user.marital_status)}, ${formatValue(user.marriage_type)}, ${user.children_count}, ${formatValue(user.residence_location)}, ${user.weight}, ${user.height}, ${formatValue(user.skin_color)}, ${formatValue(user.body_type)}, ${formatValue(user.religiosity_level)}, ${formatValue(user.prayer_commitment)}, ${formatValue(user.smoking)}, ${formatValue(user.beard)}, ${formatValue(user.hijab)}, ${formatValue(user.education_level)}, ${formatValue(user.financial_status)}, ${formatValue(user.work_field)}, ${formatValue(user.job_title)}, ${formatValue(user.monthly_income)}, ${formatValue(user.health_status)}, ${formatValue(user.profession)}, ${formatValue(user.religious_commitment)}, ${formatValue(user.bio)}, ${formatValue(user.looking_for)}, ${user.verified}, ${formatValue(user.status)}, ${formatValue(user.profile_visibility)}, ${user.show_phone}, ${user.show_email}, ${user.allow_messages}, ${user.family_can_view}, ${user.two_factor_enabled}, ${user.login_notifications}, ${user.message_notifications}, NOW(), NOW())`;
  });

  sql += values.join(',\n') + ';\n';
  return sql;
}

// الدالة الرئيسية
async function main() {
  try {
    console.log('🚀 بدء إنشاء حسابات وهمية واقعية...');

    // إنشاء 50 حساب (25 رجل + 25 امرأة)
    const users = generateUsers(50);

    console.log(`✅ تم إنشاء ${users.length} حساب بنجاح`);

    // تحويل إلى SQL
    const sqlScript = generateSQL(users);

    // حفظ في ملف
    const fs = require('fs');
    const filename = `realistic-users-${Date.now()}.sql`;
    fs.writeFileSync(filename, sqlScript);

    console.log(`📄 تم حفظ السكريبت في الملف: ${filename}`);
    console.log('📋 يمكنك الآن تشغيل هذا الملف في Supabase Dashboard > SQL Editor');

    // طباعة إحصائيات
    const maleCount = users.filter(u => u.gender === 'male').length;
    const femaleCount = users.filter(u => u.gender === 'female').length;
    const nationalityStats = users.reduce((acc: any, user) => {
      acc[user.nationality] = (acc[user.nationality] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 إحصائيات الحسابات المُنشأة:');
    console.log(`👨 رجال: ${maleCount}`);
    console.log(`👩 نساء: ${femaleCount}`);
    console.log('\n🌍 توزيع الجنسيات:');
    Object.entries(nationalityStats).forEach(([nationality, count]) => {
      console.log(`   ${nationality}: ${count}`);
    });

    console.log('\n✨ تم الانتهاء بنجاح!');

  } catch (error) {
    console.error('❌ حدث خطأ:', error);
  }
}

// تشغيل الدالة الرئيسية
if (require.main === module) {
  main();
}
