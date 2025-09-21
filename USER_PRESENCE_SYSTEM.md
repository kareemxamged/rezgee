# 🟢 نظام حالة المستخدمين وحالة الكتابة - موقع رزقي

**تاريخ التطوير:** 25-08-2025
**المطور:** Augment Agent
**الحالة:** ✅ مكتمل ومختبر
**آخر تحديث:** 25-08-2025 - إضافة النقطة الخضراء للمستخدمين النشطين

---

## 🎯 نظرة عامة

تم تطوير نظام شامل لتتبع حالة المستخدمين وحالة الكتابة في المحادثات يوفر:

- **تتبع آخر نشاط للمستخدم** مع عرض "نشط الآن" أو "نشط منذ X دقائق/ساعات/أيام"
- **حالة الكتابة في الوقت الفعلي** مع عرض "يكتب الآن..." في رأس المحادثة
- **حالة الكتابة في قائمة المحادثات** مع استبدال آخر رسالة بـ "يكتب الآن..." عند الكتابة
- **تحديث تلقائي للحالات** مع تنظيف الحالات المنتهية الصلاحية
- **النقطة الخضراء للمستخدمين النشطين** مثل تطبيق المسنجر

---

## 🗄️ تحديثات قاعدة البيانات

### 📊 حقول جديدة في جدول `users`:

```sql
-- حقول تتبع حالة المستخدم
last_seen_at TIMESTAMPTZ DEFAULT NOW()           -- آخر نشاط للمستخدم
online_status VARCHAR(20) DEFAULT 'offline'      -- حالة الاتصال (online/offline/away)
is_typing_in_conversation UUID                   -- معرف المحادثة التي يكتب فيها المستخدم
```

### 📊 حقول جديدة في جدول `conversations`:

```sql
-- حقول تتبع حالة الكتابة
user1_typing BOOLEAN DEFAULT FALSE               -- هل المستخدم الأول يكتب
user2_typing BOOLEAN DEFAULT FALSE               -- هل المستخدم الثاني يكتب
user1_last_typing_at TIMESTAMPTZ                -- آخر وقت كتابة للمستخدم الأول
user2_last_typing_at TIMESTAMPTZ                -- آخر وقت كتابة للمستخدم الثاني
```

### 🔧 دوال قاعدة البيانات الجديدة:

#### 1. `update_user_last_seen(user_id UUID)`
- تحديث آخر نشاط للمستخدم
- تعيين حالة الاتصال إلى 'online'

#### 2. `update_user_online_status(user_id UUID, status VARCHAR)`
- تحديث حالة الاتصال للمستخدم
- تحديث آخر نشاط عند الانتقال إلى 'offline'

#### 3. `update_typing_status(conversation_id UUID, user_id UUID, is_typing BOOLEAN)`
- تحديث حالة الكتابة في المحادثة
- تحديث حالة المستخدم في جدول المستخدمين

#### 4. `get_user_activity_status(user_id UUID)`
- الحصول على حالة نشاط المستخدم
- إرجاع الحالة وعدد الدقائق منذ آخر نشاط

#### 5. `cleanup_expired_typing_status()`
- تنظيف حالات الكتابة المنتهية الصلاحية (أكثر من دقيقتين)
- تعمل تلقائياً كل دقيقة عبر pg_cron

---

## 🔧 المكونات التقنية

### 1. خدمة إدارة حالة المستخدمين

**الملف:** `src/lib/userPresenceService.ts`

```typescript
class UserPresenceService {
  // بدء تتبع حالة المستخدم
  async startPresenceTracking(userId: string): Promise<void>
  
  // إيقاف تتبع حالة المستخدم
  async stopPresenceTracking(): Promise<void>
  
  // تحديث آخر نشاط للمستخدم
  async updateUserLastSeen(userId: string): Promise<void>
  
  // تحديث حالة الاتصال للمستخدم
  async updateUserOnlineStatus(userId: string, status: string): Promise<void>
  
  // الحصول على حالة نشاط المستخدم
  async getUserPresenceStatus(userId: string): Promise<UserPresenceStatus | null>
  
  // تحديث حالة الكتابة في المحادثة
  async updateTypingStatus(conversationId: string, userId: string, isTyping: boolean): Promise<void>
  
  // تنسيق نص حالة المستخدم للعرض
  formatUserStatus(presence: UserPresenceStatus, t: Function): string
}
```

### 2. React Hooks المخصصة

**الملف:** `src/hooks/useUserPresence.ts`

#### `useUserPresence()`
- بدء وإيقاف تتبع حالة المستخدم الحالي
- تحديث تلقائي كل 30 ثانية
- معالجة أحداث النافذة (beforeunload, visibilitychange)

#### `useUserStatus(userId: string)`
- الحصول على حالة مستخدم معين
- تحديث تلقائي كل 30 ثانية
- إرجاع الحالة وحالة التحميل

#### `useTypingStatus(conversationId: string)`
- إدارة حالة الكتابة في المحادثة
- الاشتراك في تحديثات الوقت الفعلي
- إيقاف تلقائي بعد 3 ثوان من عدم النشاط

#### `useUserStatusText()`
- تنسيق نص حالة المستخدم للعرض
- دعم الترجمة والتعدد اللغوي

---

## 🎨 التحديثات في واجهة المستخدم

### 1. رأس المحادثة

**قبل التحديث:**
```
أحمد محمد ✓
عضو في الموقع
```

**بعد التحديث:**
```
أحمد محمد ✓
نشط الآن                    // أو "نشط منذ 5 دقائق" أو "يكتب الآن..."
```

### 2. قائمة المحادثات

**قبل التحديث:**
```
أحمد محمد
أنت: مرحباً كيف حالك؟
منذ 10 دقائق
```

**بعد التحديث (عند الكتابة):**
```
أحمد محمد
يكتب الآن...              // يحل محل آخر رسالة عند الكتابة
منذ 10 دقائق
```

### 3. معالجة أحداث الكتابة

- **بدء الكتابة:** عند كتابة أي نص في حقل الرسالة
- **إيقاف الكتابة:** عند مسح النص أو عدم الكتابة لمدة 3 ثوان
- **إيقاف فوري:** عند إرسال الرسالة

### 4. النقطة الخضراء للمستخدمين النشطين

**الوصف:** نقطة خضراء صغيرة تظهر أعلى الصورة الشخصية للمستخدمين النشطين حالياً، مثل تطبيق المسنجر.

**المواقع:**
- **قائمة المحادثات:** نقطة خضراء أعلى يمين الأفاتار لكل مستخدم نشط
- **رأس المحادثة:** نقطة خضراء أعلى يمين أفاتار المستخدم النشط

**المواصفات التقنية:**
- **الحجم:** 3 أحجام مختلفة (sm, md, lg)
- **التأثيرات:** نبض أخضر مع وهج خفيف
- **التحديث:** كل 30 ثانية مع باقي حالات المستخدمين
- **الشرط:** يظهر فقط عندما `isOnline = true` (نشط خلال آخر 5 دقائق)

**الملفات الجديدة:**
- `src/components/OnlineStatusIndicator.tsx` - مكون النقطة الخضراء
- `src/components/OnlineStatusIndicator.css` - تأثيرات CSS المخصصة
- `src/hooks/useUserPresence.ts` - إضافة `useMultipleUserStatus` hook

---

## 🌐 النصوص والترجمة

### النصوص العربية (`src/locales/ar.json`):

```json
"userStatus": {
  "online": "نشط الآن",
  "justNow": "نشط منذ لحظات",
  "minutesAgo": "نشط منذ {{count}} دقيقة",
  "minutesAgo_plural": "نشط منذ {{count}} دقائق",
  "hoursAgo": "نشط منذ {{count}} ساعة",
  "hoursAgo_plural": "نشط منذ {{count}} ساعات",
  "daysAgo": "نشط منذ {{count}} يوم",
  "daysAgo_plural": "نشط منذ {{count}} أيام",
  "typing": "يكتب الآن..."
}
```

### النصوص الإنجليزية (`src/locales/en.json`):

```json
"userStatus": {
  "online": "Active now",
  "justNow": "Active moments ago",
  "minutesAgo": "Active {{count}} minute ago",
  "minutesAgo_plural": "Active {{count}} minutes ago",
  "hoursAgo": "Active {{count}} hour ago",
  "hoursAgo_plural": "Active {{count}} hours ago",
  "daysAgo": "Active {{count}} day ago",
  "daysAgo_plural": "Active {{count}} days ago",
  "typing": "Typing now..."
}
```

---

## ⚡ الأداء والتحسينات

### 1. تحديث تلقائي ذكي
- **Heartbeat كل 30 ثانية** لتحديث آخر نشاط
- **تنظيف تلقائي كل دقيقة** للحالات المنتهية الصلاحية
- **Real-time subscriptions** لتحديثات فورية

### 2. إدارة الذاكرة
- **تنظيف Timeouts** عند إلغاء التحميل
- **إلغاء الاشتراكات** عند تغيير المحادثة
- **تحديث محلي للحالة** لتجنب الطلبات غير الضرورية

### 3. فهارس قاعدة البيانات
```sql
-- فهارس لتحسين الأداء
CREATE INDEX idx_users_last_seen_at ON users(last_seen_at);
CREATE INDEX idx_users_online_status ON users(online_status);
CREATE INDEX idx_users_typing_conversation ON users(is_typing_in_conversation);
CREATE INDEX idx_conversations_user1_typing ON conversations(user1_typing) WHERE user1_typing = TRUE;
CREATE INDEX idx_conversations_user2_typing ON conversations(user2_typing) WHERE user2_typing = TRUE;
```

---

## 🧪 كيفية الاختبار

### 1. اختبار حالة المستخدم:
1. **سجل دخول بحسابين مختلفين** في متصفحين منفصلين
2. **ابدأ محادثة** بين الحسابين
3. **لاحظ عرض "نشط الآن"** في رأس المحادثة
4. **أغلق أحد المتصفحين** ولاحظ تغيير الحالة إلى "نشط منذ X دقائق"

### 2. اختبار حالة الكتابة:
1. **ابدأ الكتابة** في حقل الرسالة
2. **لاحظ ظهور "يكتب الآن..."** في رأس المحادثة للمستخدم الآخر
3. **لاحظ ظهور "يكتب الآن..."** في قائمة المحادثات
4. **توقف عن الكتابة** ولاحظ اختفاء الحالة بعد 3 ثوان

### 3. اختبار التنظيف التلقائي:
1. **ابدأ الكتابة ثم أغلق المتصفح فجأة**
2. **انتظر دقيقتين**
3. **تحقق من قاعدة البيانات** - يجب أن تكون حالة الكتابة FALSE

---

## 📊 الإحصائيات

- ✅ **5 دوال جديدة** في قاعدة البيانات
- ✅ **7 حقول جديدة** في الجداول
- ✅ **1 خدمة شاملة** لإدارة الحالات
- ✅ **5 hooks مخصصة** للتكامل مع React (إضافة useMultipleUserStatus)
- ✅ **1 مكون جديد** للنقطة الخضراء (OnlineStatusIndicator)
- ✅ **16 نص جديد** للترجمة (عربي + إنجليزي)
- ✅ **تحديث تلقائي كل 30 ثانية** لآخر نشاط
- ✅ **تنظيف تلقائي كل دقيقة** للحالات المنتهية الصلاحية
- ✅ **نقطة خضراء تفاعلية** مع تأثيرات CSS متقدمة

---

## 🔧 المشاكل التي تم حلها

### ❌ مشكلة معاملات الدوال (تم الحل)

**المشكلة:**
```
Error: Could not find the function public.update_user_online_status(status, user_id) in the schema cache
```

**السبب:** كان هناك تضارب في أسماء معاملات الدالة بين التعريف في قاعدة البيانات والاستدعاء في الكود.

**الحل:**
- تم تحديث استدعاء الدالة لاستخدام `new_status` بدلاً من `status`
- تم التأكد من تطابق أسماء المعاملات في جميع الدوال

**الكود المحدث:**
```typescript
const { error } = await supabase.rpc('update_user_online_status', {
  user_id: userId,
  new_status: status  // تم تغيير من 'status' إلى 'new_status'
});
```

### ❌ مشكلة نظام الحظر - أخطاء 406 (تم الحل)

**المشكلة:**
```
GET https://...supabase.co/rest/v1/user_blocks?... 406 (Not Acceptable)
```

**السبب:** سياسات Row Level Security (RLS) تمنع المستخدم من رؤية سجلات الحظر عبر الاستعلامات المباشرة.

**الحل:**
- إنشاء دوال آمنة في قاعدة البيانات مع `SECURITY DEFINER`
- استبدال الاستعلامات المباشرة بالدوال الآمنة
- إصلاح تضارب أسماء المعاملات في الدوال

**الدوال الجديدة:**
```sql
-- التحقق من وجود حظر نشط
check_active_block(p_blocker_user_id, p_blocked_user_id)

-- حظر مستخدم بشكل آمن
safe_block_user(p_blocker_user_id, p_blocked_user_id, p_conversation_id, p_block_type)

-- إلغاء حظر مستخدم بشكل آمن
safe_unblock_user(p_blocker_user_id, p_blocked_user_id)
```

### ❌ مشكلة ترتيب تعريف الدوال (تم الحل)

**المشكلة:**
```
ReferenceError: Cannot access 'getOtherUser' before initialization
```

**السبب:** كان يتم استخدام دالة `getOtherUser` في hooks قبل تعريفها في الكود.

**الحل:**
- تم نقل تعريف الدالة إلى أعلى باستخدام `useCallback`
- تم حذف التعريف المكرر للدالة
- تم إضافة `useCallback` إلى الواردات

**الكود المحدث:**
```typescript
// Get the other user in the conversation (moved up to avoid hoisting issues)
const getOtherUser = useCallback((conversation: Conversation | null) => {
  if (!userProfile?.id || !conversation) return null;
  return conversation.user1_id === userProfile.id ? conversation.user2 : conversation.user1;
}, [userProfile?.id]);
```

---

🎉 **نظام حالة المستخدمين وحالة الكتابة جاهز ويعمل بكفاءة عالية مع تجربة مستخدم محسنة!**
