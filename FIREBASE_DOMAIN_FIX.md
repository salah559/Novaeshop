# Firebase Unauthorized Domain Fix

## المشكلة
```
FirebaseError: Firebase: Error (auth/unauthorized-domain)
```

هذا الخطأ يحدث لأن نطاق Replit غير مصرح به في إعدادات Firebase Authentication.

## النطاق الحالي لتطبيقك
```
78b5c4a4-4104-4363-9fe8-ed4c366114aa-00-2lslul1ksm5zk.spock.replit.dev
```

## الحل: إضافة النطاق في Firebase Console

### الخطوات بالتفصيل:

1. **افتح Firebase Console**
   - اذهب إلى: https://console.firebase.google.com
   - اختر مشروعك من القائمة

2. **انتقل إلى Authentication**
   - من القائمة الجانبية اليسرى، اضغط على **Authentication**
   - اضغط على تبويب **Settings** أو **الإعدادات**

3. **ابحث عن Authorized Domains**
   - ستجد قسم اسمه **Authorized domains** (النطاقات المصرح بها)
   - ستجد نطاقات افتراضية مثل `localhost` و `*.firebaseapp.com`

4. **أضف نطاق Replit**
   - اضغط على زر **Add domain** (إضافة نطاق)
   - الصق النطاق التالي:
   ```
   78b5c4a4-4104-4363-9fe8-ed4c366114aa-00-2lslul1ksm5zk.spock.replit.dev
   ```
   - اضغط **Add** أو **إضافة**

5. **احفظ التغييرات**
   - اضغط **Save** أو **حفظ**

6. **أعد تحميل التطبيق**
   - ارجع إلى تطبيقك على Replit
   - أعد تحميل الصفحة (Ctrl+Shift+R أو Cmd+Shift+R)

## نطاقات إضافية قد تحتاجها

إذا كنت ستنشر التطبيق لاحقاً أو تستخدم نطاق مخصص، أضف هذه النطاقات أيضاً:

### للنطاق المخصص (Custom Domain):
```
yourdomain.com
www.yourdomain.com
```

### لنطاقات Replit الأخرى:
```
*.repl.co
*.replit.dev
```

⚠️ **ملاحظة:** بعض إصدارات Firebase لا تقبل wildcards (`*`). في هذه الحالة، أضف النطاق الكامل بدون `*`.

## التحقق من النجاح

بعد إضافة النطاق:
1. أعد تحميل التطبيق
2. جرب تسجيل الدخول
3. يجب أن يعمل Authentication بدون أخطاء

## إذا استمرت المشكلة

تأكد من:
- ✅ تم حفظ النطاق بشكل صحيح
- ✅ النطاق مكتوب بالكامل بدون أخطاء إملائية
- ✅ تم تفعيل Google Sign-in في Authentication > Sign-in methods
- ✅ أعدت تحميل الصفحة بعد الإضافة

## نطاقات Replit الشائعة

Replit يستخدم نطاقات مختلفة:
- `*.replit.dev` (النطاقات الحديثة)
- `*.repl.co` (النطاقات القديمة)
- `*.id.repl.co` (للمستخدمين المعينين)

أضف النطاق الذي يظهر في شريط العنوان بالمتصفح.
