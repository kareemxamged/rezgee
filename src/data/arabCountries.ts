// قائمة الدول العربية مع رموز الهواتف
export interface ArabCountry {
  code: string;
  name: string;
  phoneCode: string;
  flag: string;
  phoneFormat?: string;
}

export const arabCountries: ArabCountry[] = [
  {
    code: 'SA',
    name: 'المملكة العربية السعودية',
    phoneCode: '+966',
    flag: '🇸🇦',
    phoneFormat: '5XXXXXXXX'
  },
  {
    code: 'AE',
    name: 'الإمارات العربية المتحدة',
    phoneCode: '+971',
    flag: '🇦🇪',
    phoneFormat: '5XXXXXXXX'
  },
  {
    code: 'EG',
    name: 'مصر',
    phoneCode: '+20',
    flag: '🇪🇬',
    phoneFormat: '1XXXXXXXXX'
  },
  {
    code: 'JO',
    name: 'الأردن',
    phoneCode: '+962',
    flag: '🇯🇴',
    phoneFormat: '7XXXXXXXX'
  },
  {
    code: 'LB',
    name: 'لبنان',
    phoneCode: '+961',
    flag: '🇱🇧',
    phoneFormat: 'XXXXXXXX'
  },
  {
    code: 'SY',
    name: 'سوريا',
    phoneCode: '+963',
    flag: '🇸🇾',
    phoneFormat: 'XXXXXXXXX'
  },
  {
    code: 'IQ',
    name: 'العراق',
    phoneCode: '+964',
    flag: '🇮🇶',
    phoneFormat: '7XXXXXXXXX'
  },
  {
    code: 'KW',
    name: 'الكويت',
    phoneCode: '+965',
    flag: '🇰🇼',
    phoneFormat: 'XXXXXXXX'
  },
  {
    code: 'QA',
    name: 'قطر',
    phoneCode: '+974',
    flag: '🇶🇦',
    phoneFormat: 'XXXXXXXX'
  },
  {
    code: 'BH',
    name: 'البحرين',
    phoneCode: '+973',
    flag: '🇧🇭',
    phoneFormat: 'XXXXXXXX'
  },
  {
    code: 'OM',
    name: 'عُمان',
    phoneCode: '+968',
    flag: '🇴🇲',
    phoneFormat: 'XXXXXXXX'
  },
  {
    code: 'YE',
    name: 'اليمن',
    phoneCode: '+967',
    flag: '🇾🇪',
    phoneFormat: 'XXXXXXXXX'
  },
  {
    code: 'PS',
    name: 'فلسطين',
    phoneCode: '+970',
    flag: '🇵🇸',
    phoneFormat: '59XXXXXXX'
  },
  {
    code: 'MA',
    name: 'المغرب',
    phoneCode: '+212',
    flag: '🇲🇦',
    phoneFormat: '6XXXXXXXX'
  },
  {
    code: 'DZ',
    name: 'الجزائر',
    phoneCode: '+213',
    flag: '🇩🇿',
    phoneFormat: '5XXXXXXXX'
  },
  {
    code: 'TN',
    name: 'تونس',
    phoneCode: '+216',
    flag: '🇹🇳',
    phoneFormat: 'XXXXXXXX'
  },
  {
    code: 'LY',
    name: 'ليبيا',
    phoneCode: '+218',
    flag: '🇱🇾',
    phoneFormat: '9XXXXXXXX'
  },
  {
    code: 'SD',
    name: 'السودان',
    phoneCode: '+249',
    flag: '🇸🇩',
    phoneFormat: '9XXXXXXXX'
  },
  {
    code: 'SO',
    name: 'الصومال',
    phoneCode: '+252',
    flag: '🇸🇴',
    phoneFormat: 'XXXXXXXXX'
  },
  {
    code: 'DJ',
    name: 'جيبوتي',
    phoneCode: '+253',
    flag: '🇩🇯',
    phoneFormat: 'XXXXXXXX'
  },
  {
    code: 'KM',
    name: 'جزر القمر',
    phoneCode: '+269',
    flag: '🇰🇲',
    phoneFormat: 'XXXXXXX'
  },
  {
    code: 'MR',
    name: 'موريتانيا',
    phoneCode: '+222',
    flag: '🇲🇷',
    phoneFormat: 'XXXXXXXX'
  }
];

// الحصول على الدولة الافتراضية (السعودية)
export const getDefaultCountry = (): ArabCountry => {
  return arabCountries.find(country => country.code === 'SA') || arabCountries[0];
};

// البحث عن دولة بالرمز
export const getCountryByCode = (code: string): ArabCountry | undefined => {
  return arabCountries.find(country => country.code === code);
};

// البحث عن دولة برمز الهاتف
export const getCountryByPhoneCode = (phoneCode: string): ArabCountry | undefined => {
  return arabCountries.find(country => country.phoneCode === phoneCode);
};

// التحقق من صحة رقم الهاتف حسب الدولة
export const validatePhoneNumber = (phone: string, countryCode: string): boolean => {
  const country = getCountryByCode(countryCode);
  if (!country) return false;

  // إزالة المسافات والرموز
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // التحقق الأساسي من الطول
  const minLength = 7;
  const maxLength = 15;
  
  if (cleanPhone.length < minLength || cleanPhone.length > maxLength) {
    return false;
  }

  // التحقق من أن الرقم يحتوي على أرقام فقط
  if (!/^\d+$/.test(cleanPhone)) {
    return false;
  }

  // تحققات خاصة لبعض الدول
  switch (countryCode) {
    case 'SA': // السعودية
      return /^5\d{8}$/.test(cleanPhone);
    case 'AE': // الإمارات
      return /^5\d{8}$/.test(cleanPhone);
    case 'EG': // مصر
      return /^1\d{9}$/.test(cleanPhone);
    case 'JO': // الأردن
      return /^7\d{8}$/.test(cleanPhone);
    default:
      return cleanPhone.length >= 7 && cleanPhone.length <= 12;
  }
};

// تنسيق رقم الهاتف للعرض
export const formatPhoneNumber = (phone: string, countryCode: string): string => {
  const country = getCountryByCode(countryCode);
  if (!country) return phone;

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // تنسيق خاص لبعض الدول
  switch (countryCode) {
    case 'SA': // السعودية: 5XX XXX XXX
      if (cleanPhone.length === 9) {
        return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
      }
      break;
    case 'AE': // الإمارات: 5X XXX XXXX
      if (cleanPhone.length === 9) {
        return `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5)}`;
      }
      break;
    case 'EG': // مصر: 1XX XXX XXXX
      if (cleanPhone.length === 10) {
        return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
      }
      break;
  }
  
  return phone;
};
