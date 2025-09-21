# تطبيق منع الوصول للملفات الشخصية من نفس الجنس

## 🎯 الهدف
منع المستخدمين من الوصول للملفات الشخصية العامة للمستخدمين من نفس الجنس، وفقاً للضوابط الشرعية.

## 📋 السيناريوهات المطبقة

### ✅ صفحة البحث (كان موجود مسبقاً):
- **الذكور**: يرون إناث فقط
- **الإناث**: يرين ذكور فقط

### ✅ الملف الشخصي العام (تم إضافته):
- **ذكر يدخل رابط ملف ذكر**: ❌ مرفوض
- **أنثى تدخل رابط ملف أنثى**: ❌ مرفوض
- **ذكر يدخل رابط ملف أنثى**: ✅ مسموح
- **أنثى تدخل رابط ملف ذكر**: ✅ مسموح

## 🔧 التغييرات المطبقة

### 1. تحديث getPublicUserProfile في supabase.ts

#### إضافة جلب جنس المستخدم الحالي:
```typescript
const { data: currentUserData, error: currentUserError } = await supabase
  .from('users')
  .select('verified, status, gender') // ← تم إضافة gender
  .eq('id', currentUserId)
  .single();
```

#### إضافة فحص الجنس:
```typescript
// التحقق من الجنس - منع الوصول للملفات الشخصية من نفس الجنس
if (currentUserData.gender && data.gender && currentUserData.gender === data.gender) {
  console.log('Same gender access denied - currentUser:', currentUserData.gender, 'targetUser:', data.gender);
  return { data: null, error: { message: 'Same gender access not allowed' } };
}
```

### 2. تحديث معالجة الأخطاء في PublicProfilePage.tsx

```typescript
} else if (errorMessage === 'Same gender access not allowed') {
  setError(t('publicProfile.error.sameGenderNotAllowed'));
```

### 3. إضافة النصوص في ملفات الترجمة

#### العربية (ar.json):
```json
"sameGenderNotAllowed": "لا يُسمح بالوصول للملفات الشخصية من نفس الجنس وفقاً للضوابط الشرعية"
```

#### الإنجليزية (en.json):
```json
"sameGenderNotAllowed": "Access to profiles of the same gender is not allowed for Islamic guidelines"
```

## 🔍 آلية العمل

### 1. عند طلب ملف شخصي عام:
```
المستخدم الحالي (ذكر) → يطلب ملف (ذكر آخر)
↓
getPublicUserProfile يجلب جنس المستخدم الحالي
↓
يجلب الملف الشخصي المطلوب
↓
يقارن الجنسين: male === male
↓
يرفض الطلب: "Same gender access not allowed"
↓
يظهر رسالة: "لا يُسمح بالوصول للملفات الشخصية من نفس الجنس"
```

### 2. الحالات المسموحة:
```
ذكر → أنثى: ✅ مسموح
أنثى → ذكر: ✅ مسموح
```

### 3. الحالات المرفوضة:
```
ذكر → ذكر: ❌ مرفوض
أنثى → أنثى: ❌ مرفوض
```

## 🧪 اختبار التطبيق

### اختبار الحالة المرفوضة:
1. **سجل دخول كمستخدم ذكر**
2. **ادخل على رابط ملف ذكر آخر**: `http://localhost:5173/profile/[male-user-id]`
3. **النتيجة المتوقعة**: رسالة خطأ "لا يُسمح بالوصول للملفات الشخصية من نفس الجنس"

### اختبار الحالة المسموحة:
1. **سجل دخول كمستخدم ذكر**
2. **ادخل على رابط ملف أنثى**: `http://localhost:5173/profile/[female-user-id]`
3. **النتيجة المتوقعة**: عرض الملف الشخصي بشكل طبيعي

## 📊 رسائل الكونسول

### عند الرفض:
```
Same gender access denied - currentUser: male targetUser: male
```

### عند القبول:
```
Privacy check passed, allowing access
```

## 🔒 الأمان والضوابط الشرعية

هذا التطبيق يضمن:
- **الالتزام بالضوابط الشرعية** في التعارف
- **منع الوصول غير المناسب** للملفات الشخصية
- **الحفاظ على الخصوصية** وفقاً للتعاليم الإسلامية
- **تطبيق موحد** عبر جميع أجزاء الموقع

## الملفات المحدثة
- `src/lib/supabase.ts`
- `src/components/PublicProfilePage.tsx`
- `src/locales/ar.json`
- `src/locales/en.json`
