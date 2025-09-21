# دليل إعداد نظام الدفع PayTabs - رزقي

## 🎯 نظرة عامة

تم تطبيق نظام دفع PayTabs المحسن خصيصاً للسعودية والدول العربية مع دعم:
- البطاقات الائتمانية (فيزا، ماستركارد)
- بطاقة مدى السعودية
- STC Pay (للسعودية)
- Apple Pay
- التحويل البنكي

## 🏆 لماذا PayTabs؟

### ✅ **مدعوم بالكامل في السعودية**
- شركة معتمدة من البنك المركزي السعودي
- دعم كامل لبطاقة مدى
- دعم STC Pay الرسمي

### ✅ **رسوم تنافسية**
- البطاقات الائتمانية: 2.75%
- مدى: 2.0%
- STC Pay: 1.5%
- بدون رسوم إعداد أو رسوم شهرية

### ✅ **دعم فني ممتاز**
- دعم باللغة العربية
- فريق دعم محلي
- وثائق شاملة

## 📋 المتطلبات

### 1. حساب PayTabs
- إنشاء حساب على [PayTabs](https://www.paytabs.com)
- تفعيل الحساب للسعودية
- الحصول على API Keys

### 2. المستندات المطلوبة
- السجل التجاري
- الهوية الوطنية/الإقامة
- عقد تأسيس الشركة
- كشف حساب بنكي

## 🔧 خطوات الإعداد

### الخطوة 1: إعداد متغيرات البيئة

انسخ ملف `.env.example` إلى `.env` وأضف القيم التالية:

```bash
# PayTabs Configuration
VITE_PAYTABS_PROFILE_ID=12345                    # من PayTabs Dashboard
VITE_PAYTABS_CLIENT_KEY=CJMJRM2N9N-JDKTZD2H9T   # Client Key
PAYTABS_SERVER_KEY=SJMJRM2N9N-JDKTZD2H9T        # Server Key (سري)

# Supabase (موجود مسبقاً)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Payment Settings
DEFAULT_CURRENCY=SAR
SUPPORTED_COUNTRIES=SA,AE,KW,QA,BH,OM
```

### الخطوة 2: إعداد قاعدة البيانات

أضف الأعمدة التالية لجدول `payments`:

```sql
-- إضافة أعمدة PayTabs
ALTER TABLE payments 
ADD COLUMN paytabs_tran_ref TEXT,
ADD COLUMN paytabs_cart_id TEXT;

-- إنشاء فهارس للبحث السريع
CREATE INDEX idx_payments_paytabs_tran ON payments(paytabs_tran_ref);
CREATE INDEX idx_payments_paytabs_cart ON payments(paytabs_cart_id);
```

### الخطوة 3: إعداد Callback URL في PayTabs

1. اذهب إلى [PayTabs Dashboard](https://secure.paytabs.sa)
2. اذهب إلى Settings > Integration
3. أضف Callback URL: `https://yourdomain.com/api/paytabs/callback`
4. فعل IPN (Instant Payment Notification)

### الخطوة 4: تشغيل النظام

```bash
# تشغيل Frontend
npm run dev

# تشغيل Backend API (في terminal منفصل)
cd api
npm install
npm run dev
```

## 🌍 إعدادات الدول المدعومة

### السعودية (SA) - الدعم الكامل
- ✅ البطاقات الائتمانية (فيزا، ماستركارد)
- ✅ بطاقة مدى
- ✅ STC Pay
- ✅ Apple Pay
- ✅ التحويل البنكي

### الإمارات (AE)
- ✅ البطاقات الائتمانية
- ✅ Apple Pay
- ✅ التحويل البنكي

### دول الخليج الأخرى (KW, QA, BH, OM)
- ✅ البطاقات الائتمانية
- ✅ Apple Pay
- ✅ التحويل البنكي

### مصر والأردن (EG, JO)
- ✅ البطاقات الائتمانية
- ✅ التحويل البنكي

## 💰 العملات والرسوم

| طريقة الدفع | الرسوم | العملات المدعومة |
|-------------|--------|------------------|
| البطاقات الائتمانية | 2.75% | SAR, USD, EUR, AED |
| مدى | 2.0% | SAR |
| STC Pay | 1.5% | SAR |
| Apple Pay | 2.75% | SAR, USD, AED |
| التحويل البنكي | 0% | جميع العملات |

## 🔒 الأمان

### إعدادات الأمان المطبقة:
- ✅ تشفير SSL/TLS
- ✅ 3D Secure للبطاقات
- ✅ التحقق من CVV
- ✅ مراقبة المعاملات المشبوهة
- ✅ Callback verification

### أفضل الممارسات:
- احتفظ بـ Server Key سرياً
- استخدم HTTPS في الإنتاج
- راقب المعاملات بانتظام
- احتفظ بنسخ احتياطية

## 📊 المراقبة والإحصائيات

### لوحة الإدارة تعرض:
- معدل نجاح الدفع
- عدد المعاملات
- الإيرادات الشهرية
- توزيع طرق الدفع

### PayTabs Dashboard يوفر:
- تفاصيل كل معاملة
- تقارير مالية شاملة
- إحصائيات الأداء
- تنبيهات الأمان

## 🧪 الاختبار

### بيانات اختبار PayTabs:

```
# بطاقة نجاح
رقم البطاقة: 4000000000000002
تاريخ الانتهاء: 12/25
CVV: 123

# بطاقة فشل
رقم البطاقة: 4000000000000010
تاريخ الانتهاء: 12/25
CVV: 123

# بطاقة مدى (للاختبار)
رقم البطاقة: 5000000000000004
تاريخ الانتهاء: 12/25
CVV: 123
```

### اختبار STC Pay:
- رقم جوال: `+966501234567`
- كود التحقق: `1234`

## 🚀 النشر في الإنتاج

### 1. تحديث المتغيرات:
```bash
VITE_PAYTABS_PROFILE_ID=your_live_profile_id
VITE_PAYTABS_CLIENT_KEY=your_live_client_key
PAYTABS_SERVER_KEY=your_live_server_key
```

### 2. تفعيل الحساب:
- أكمل عملية التحقق في PayTabs
- فعل المدفوعات المباشرة
- اختبر جميع طرق الدفع

### 3. مراقبة النظام:
- راقب logs الخادم
- تابع إحصائيات PayTabs
- اختبر Callbacks بانتظام

## ❓ استكشاف الأخطاء

### مشاكل شائعة:

#### 1. Callback لا يعمل
```bash
# تحقق من URL
curl -X POST https://yourdomain.com/api/paytabs/callback

# تحقق من logs
tail -f logs/paytabs.log
```

#### 2. فشل في الدفع
- تحقق من صحة API Keys
- تأكد من تفعيل طريقة الدفع
- راجع حدود المبالغ

#### 3. مشاكل العملة
- تأكد من دعم العملة في بلدك
- تحقق من إعدادات PayTabs

## 📞 الدعم

### موارد مفيدة:
- [PayTabs Documentation](https://support.paytabs.com)
- [PayTabs API Reference](https://dev.paytabs.com)
- [Supabase Integration](https://supabase.com/docs)

### في حالة المشاكل:
1. راجع logs الخادم
2. تحقق من PayTabs Dashboard
3. اختبر Callback manually
4. تواصل مع دعم PayTabs

### معلومات الاتصال:
- **الهاتف**: 920033633
- **البريد الإلكتروني**: support@paytabs.com
- **الدعم الفني**: 24/7

## 🎉 المزايا الإضافية

### 1. **تقارير مفصلة**
- تقارير يومية/شهرية/سنوية
- تحليل سلوك العملاء
- إحصائيات طرق الدفع

### 2. **أدوات إدارية**
- إدارة المبالغ المستردة
- تجميد/إلغاء تجميد المعاملات
- إعدادات الأمان المتقدمة

### 3. **التكامل المتقدم**
- APIs متقدمة
- Webhooks مخصصة
- تكامل مع أنظمة المحاسبة

---

**تم إعداد نظام PayTabs بنجاح! 🎉**

النظام جاهز الآن لمعالجة المدفوعات بأمان وكفاءة في السعودية والدول العربية مع دعم كامل لجميع طرق الدفع المحلية.
