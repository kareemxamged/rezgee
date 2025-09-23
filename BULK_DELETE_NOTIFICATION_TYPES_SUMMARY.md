# الحذف الجماعي لأنواع الإشعارات

## 🎯 الميزة الجديدة

تم إضافة إمكانية **الحذف الجماعي** لأنواع الإشعارات في لوحة الإدارة، مما يسمح للمشرفين بحذف عدة أنواع إشعارات في عملية واحدة.

## ✨ المميزات

### 1. التحديد الجماعي
- **تحديد فردي**: تحديد نوع إشعار واحد بالنقر على checkbox
- **تحديد متعدد**: تحديد عدة أنواع بالنقر على checkboxes متعددة
- **تحديد الكل**: تحديد جميع الأنواع بالنقر على checkbox الرأس
- **إلغاء التحديد**: إلغاء تحديد الكل أو فردي

### 2. واجهة المستخدم المحسنة
- **تلوين الصفوف**: الصفوف المحددة تظهر بخلفية زرقاء
- **زر الحذف الجماعي**: يظهر عند تحديد عناصر مع عداد
- **تحديث ديناميكي**: واجهة المستخدم تتحدث فوراً

### 3. نافذة تأكيد متقدمة
- **تحذير واضح**: تحذير حول عدم إمكانية التراجع
- **عرض العناصر**: قائمة بالأنواع المراد حذفها
- **ملاحظة مهمة**: تنبيه حول التأكد من عدم الاستخدام

## 🔧 التطبيق التقني

### 1. الحالة الجديدة
```typescript
// حالة التحديد الجماعي لأنواع الإشعارات
const [selectedNotificationTypes, setSelectedNotificationTypes] = useState<string[]>([]);
const [showBulkDeleteTypesModal, setShowBulkDeleteTypesModal] = useState(false);
```

### 2. دوال التحديد
```typescript
// تحديد/إلغاء تحديد نوع إشعار
const handleSelectNotificationType = useCallback((typeId: string) => {
  setSelectedNotificationTypes(prev => 
    prev.includes(typeId) 
      ? prev.filter(id => id !== typeId)
      : [...prev, typeId]
  );
}, []);

// تحديد/إلغاء تحديد جميع أنواع الإشعارات
const handleSelectAllNotificationTypes = useCallback(() => {
  if (selectedNotificationTypes.length === notificationTypes.length) {
    setSelectedNotificationTypes([]);
  } else {
    setSelectedNotificationTypes(notificationTypes.map(type => type.id));
  }
}, [selectedNotificationTypes.length, notificationTypes]);
```

### 3. دالة الحذف الجماعي
```typescript
const handleBulkDeleteNotificationTypes = async () => {
  const selectedTypes = getSelectedNotificationTypes();
  
  if (selectedTypes.length === 0) {
    showWarning('لا توجد عناصر محددة', 'يرجى تحديد أنواع الإشعارات المراد حذفها');
    return;
  }

  try {
    setLoading(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const type of selectedTypes) {
      try {
        const result = await EmailNotificationsAdminService.deleteNotificationType(type.id);
        if (result && result.success) {
          successCount++;
        } else {
          errorCount++;
          errors.push(`${type.name_ar}: ${result?.error || 'خطأ غير معروف'}`);
        }
      } catch (error) {
        errorCount++;
        errors.push(`${type.name_ar}: خطأ غير متوقع`);
      }
    }

    // عرض النتائج
    if (successCount > 0) {
      showSuccess(`تم حذف ${successCount} نوع إشعار بنجاح`);
      setSelectedNotificationTypes([]);
      await refreshData();
    }

    if (errorCount > 0) {
      showError(`فشل في حذف ${errorCount} نوع إشعار`, errors.join('\n'));
    }

  } catch (error) {
    console.error('خطأ في الحذف الجماعي:', error);
    showError('خطأ في الحذف الجماعي', 'حدث خطأ غير متوقع');
  } finally {
    setLoading(false);
    setShowBulkDeleteTypesModal(false);
  }
};
```

## 🎨 واجهة المستخدم

### 1. رأس الجدول
```jsx
<div className="flex space-x-2 space-x-reverse">
  {selectedNotificationTypes.length > 0 && (
    <button
      onClick={() => setShowBulkDeleteTypesModal(true)}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 space-x-reverse"
    >
      <Trash2 className="w-4 h-4" />
      <span>حذف المحدد ({selectedNotificationTypes.length})</span>
    </button>
  )}
  <button onClick={handleCreateType} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
    <Plus className="w-4 h-4" />
    <span>إضافة نوع جديد</span>
  </button>
</div>
```

### 2. جدول البيانات
```jsx
<thead className="bg-gray-50">
  <tr>
    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
      <input
        type="checkbox"
        checked={selectedNotificationTypes.length === notificationTypes.length && notificationTypes.length > 0}
        onChange={handleSelectAllNotificationTypes}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
    </th>
    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوصف</th>
    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
  </tr>
</thead>
```

### 3. صفوف البيانات
```jsx
<tbody className="bg-white divide-y divide-gray-200">
  {notificationTypes.map((type) => (
    <tr key={type.id} className={selectedNotificationTypes.includes(type.id) ? 'bg-blue-50' : ''}>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selectedNotificationTypes.includes(type.id)}
          onChange={() => handleSelectNotificationType(type.id)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </td>
      {/* باقي البيانات */}
    </tr>
  ))}
</tbody>
```

## 🔒 الأمان والتحقق

### 1. التحقق من البيانات
- **التحقق من التحديد**: التأكد من وجود عناصر محددة
- **التحقق من الصلاحيات**: التأكد من صلاحيات الحذف
- **التحقق من الاستخدام**: تنبيه حول التأكد من عدم الاستخدام

### 2. نافذة التأكيد
- **تحذير واضح**: تحذير حول عدم إمكانية التراجع
- **عرض العناصر**: قائمة بالأنواع المراد حذفها
- **ملاحظة مهمة**: تنبيه حول التأكد من عدم الاستخدام

### 3. معالجة الأخطاء
- **معالجة فردية**: كل حذف يعالج على حدة
- **تجميع الأخطاء**: تجميع رسائل الخطأ لعرضها
- **عدم فشل العملية**: العملية لا تفشل كاملة عند خطأ واحد

## 📊 تجربة المستخدم

### 1. التحديد
- **سهولة التحديد**: النقر على checkbox لتحديد عنصر
- **تحديد الكل**: النقر على checkbox الرأس لتحديد الكل
- **تحديد متعدد**: تحديد عدة عناصر بسهولة

### 2. التغذية المرتدة البصرية
- **تلوين الصفوف**: الصفوف المحددة تظهر بخلفية زرقاء
- **عداد التحديد**: عرض عدد العناصر المحددة
- **زر الحذف**: يظهر عند التحديد مع العداد

### 3. التأكيد والحذف
- **نافذة تأكيد**: نافذة واضحة قبل الحذف
- **عرض العناصر**: قائمة بالعناصر المراد حذفها
- **حالة التحميل**: عرض حالة التحميل أثناء العملية

## 🚀 كيفية الاستخدام

### 1. الوصول للميزة
1. انتقل إلى **لوحة الإدارة**
2. اختر **الإشعارات البريدية**
3. اضغط على تبويب **أنواع الإشعارات**

### 2. التحديد
1. **تحديد فردي**: انقر على checkbox بجانب النوع المراد حذفه
2. **تحديد متعدد**: انقر على عدة checkboxes لتحديد عدة أنواع
3. **تحديد الكل**: انقر على checkbox في رأس الجدول لتحديد الكل

### 3. الحذف
1. اضغط على زر **"حذف المحدد"** الذي يظهر عند التحديد
2. راجع قائمة الأنواع المراد حذفها في النافذة المنبثقة
3. اضغط على **"حذف المحدد"** للتأكيد
4. راقب رسائل النجاح أو الخطأ

## 🔧 الصيانة والتطوير

### 1. إضافة ميزات جديدة
- **تصدير جماعي**: تصدير الأنواع المحددة
- **تفعيل/تعطيل جماعي**: تغيير حالة الأنواع المحددة
- **نسخ جماعي**: نسخ الأنواع المحددة

### 2. تحسينات الأداء
- **تحديث تدريجي**: تحديث واجهة المستخدم تدريجياً
- **تحميل ذكي**: تحميل البيانات عند الحاجة فقط
- **تخزين مؤقت**: تخزين مؤقت للبيانات المستخدمة

### 3. تحسينات الأمان
- **التحقق من الصلاحيات**: التحقق من صلاحيات المستخدم
- **تسجيل العمليات**: تسجيل جميع عمليات الحذف
- **نسخ احتياطية**: إنشاء نسخ احتياطية قبل الحذف

---

**تاريخ الإضافة:** ${new Date().toLocaleDateString('ar-EG')}  
**الحالة:** مكتمل وجاهز للاستخدام  
**المطور:** مساعد الذكاء الاصطناعي







