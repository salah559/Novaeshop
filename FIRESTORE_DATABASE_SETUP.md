# 📚 دليل إنشاء قاعدة بيانات Firestore - خطوة بخطوة

## المتطلبات الأساسية
- ✅ حساب Google
- ✅ مشروع Firebase (موجود لديك بالفعل)

---

## 🚀 الخطوات التفصيلية

### **الخطوة 1: افتح Firebase Console**

1. اذهب إلى: **https://console.firebase.google.com**
2. سجّل الدخول بحساب Google الخاص بك
3. ستظهر لك قائمة بمشاريعك
4. **اختر مشروعك** (الذي أنشأته مسبقاً)

---

### **الخطوة 2: انتقل إلى Firestore Database**

1. بعد فتح مشروعك، انظر إلى **القائمة الجانبية اليسرى**
2. ابحث عن قسم **"Build"** (بناء)
3. اضغط على **"Firestore Database"**

---

### **الخطوة 3: إنشاء قاعدة البيانات**

1. ستجد صفحة فارغة مع زر كبير في المنتصف
2. اضغط على زر **"Create database"** (إنشاء قاعدة بيانات)
   
   ⚠️ **تنبيه مهم:** 
   - لا تضغط على الزر الأزرق "Create Database" تحت "Realtime Database"
   - اضغط على الزر الأبيض تحت "Cloud Firestore"
   - هذان منتجان مختلفان!

---

### **الخطوة 4: اختيار الموقع الجغرافي**

ستظهر لك نافذة منبثقة لاختيار موقع قاعدة البيانات:

1. **اختر موقعاً جغرافياً** حسب موقع مستخدميك:
   
   **للمستخدمين في الجزائر والدول العربية:**
   - `eur3 (Europe)` ← **الأفضل للجزائر**
   - `europe-west1 (Belgium)`
   - `europe-west6 (Switzerland)`
   
   **مواقع أخرى:**
   - `us-central1 (Iowa)` للمستخدمين في أمريكا
   - `asia-south1 (Mumbai)` للمستخدمين في آسيا

2. ⚠️ **مهم جداً:** 
   - **لا يمكنك تغيير هذا الموقع لاحقاً!**
   - اختر الموقع الأقرب لمستخدميك لسرعة أفضل

3. اضغط **"Next"** (التالي)

---

### **الخطوة 5: اختيار وضع الأمان (Security Rules)**

ستظهر لك خيارين للبدء:

#### **الخيار الأول: Test Mode (وضع الاختبار)** ← موصى به للمبتدئين
```
✅ المميزات:
- يسمح بالقراءة والكتابة لمدة 30 يوم
- مثالي للتطوير والتجربة
- يمكنك البدء مباشرة بدون قواعد معقدة

⚠️ التحذيرات:
- أي شخص يمكنه قراءة وكتابة بياناتك!
- غير آمن للاستخدام الفعلي
- يجب تحديث القواعد قبل النشر
```

#### **الخيار الثاني: Production Mode (الوضع الإنتاجي)**
```
✅ المميزات:
- آمن تماماً
- يمنع جميع القراءات والكتابات افتراضياً

⚠️ التحذيرات:
- يتطلب إعداد قواعد الأمان يدوياً
- قد لا يعمل التطبيق حتى تضبط القواعد
```

**توصيتي:**
- اختر **"Start in test mode"** (ابدأ في وضع الاختبار)
- سنعدّل القواعد لاحقاً

4. اضغط على **"Enable"** أو **"Create"** (تفعيل / إنشاء)

---

### **الخطوة 6: انتظر إنشاء القاعدة**

1. سيستغرق Firebase بضع ثوانٍ لإنشاء قاعدة البيانات
2. سترى رسالة "Creating your Cloud Firestore database..."
3. عند الانتهاء، ستظهر لك شاشة قاعدة البيانات الفارغة

**🎉 تهانينا! قاعدة البيانات أصبحت جاهزة!**

---

## 📝 ما بعد الإنشاء

### **1. تفعيل Authentication (مهم جداً)**

قبل إضافة البيانات، فعّل طرق تسجيل الدخول:

1. من القائمة الجانبية: **Authentication**
2. اضغط على **"Get Started"** (البدء)
3. اضغط على تبويب **"Sign-in method"**
4. فعّل:
   - ✅ **Google** (للتسجيل عبر Google)
   - ✅ **Email/Password** (للتسجيل بالإيميل)

---

### **2. إضافة البيانات يدوياً**

الآن يمكنك إضافة بيانات المنتجات:

#### **لإضافة Collection (مجموعة):**

1. في صفحة Firestore Database، اضغط **"Start collection"**
2. اكتب اسم Collection: `products`
3. اضغط **"Next"**

#### **لإضافة Document (مستند):**

1. اكتب **Document ID** أو اتركه فارغاً (سيُنشأ تلقائياً)
2. أضف الحقول (Fields) للمنتج الأول:

```
Field name          | Type      | Value
--------------------|-----------|------------------
name                | string    | منتج تجريبي
description         | string    | وصف المنتج
price               | number    | 1500
category            | string    | كتب رقمية
imageUrl            | string    | https://example.com/image.jpg
fileUrl             | string    | https://example.com/file.pdf
```

3. اضغط **"Save"** (حفظ)

#### **لإضافة منتج آخر:**

1. اضغط على **"Add document"** في collection المنتجات
2. كرر نفس الخطوات

---

### **3. إضافة قواعد الأمان (مهم للإنتاج)**

بعد 30 يوم، يجب تحديث قواعد الأمان:

1. في Firestore Database، اضغط على تبويب **"Rules"**
2. **امسح** القواعد الموجودة
3. **الصق** القواعد التالية من ملف `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - read only for all, write only for authenticated users
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders - users can create, read their own
    match /orders/{orderId} {
      allow create: if true;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow update: if request.auth != null;
    }
    
    // Purchases - users can read their own
    match /purchases/{purchaseId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null;
    }
    
    // Messages - anyone can create
    match /messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

4. اضغط **"Publish"** (نشر)

---

### **4. إعداد Firebase Storage (للملفات)**

لتخزين الملفات (صور الإيصالات، ملفات المنتجات):

1. من القائمة الجانبية: **Storage**
2. اضغط **"Get started"**
3. اختر **"Start in test mode"** للبدء
4. اختر نفس الموقع الذي اخترته لـ Firestore
5. اضغط **"Done"**

#### **تحديث قواعد Storage:**

1. في Storage، اضغط على تبويب **"Rules"**
2. **امسح** القواعد الموجودة
3. **الصق** القواعد من ملف `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Payment receipts
    match /payment-receipts/{allPaths=**} {
      allow read, write: if true;
    }
    
    // Product files - read only for authenticated users
    match /products/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Message attachments
    match /messages/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if true;
    }
  }
}
```

4. اضغط **"Publish"**

---

### **5. إضافة نطاق Replit (حل مشكلة unauthorized-domain)**

1. في Authentication، اضغط **"Settings"**
2. ابحث عن **"Authorized domains"**
3. اضغط **"Add domain"**
4. أضف:
```
78b5c4a4-4104-4363-9fe8-ed4c366114aa-00-2lslul1ksm5zk.spock.replit.dev
```
5. احفظ

---

## ✅ قائمة التحقق النهائية

تأكد من إتمام جميع الخطوات:

- [ ] ✅ إنشاء Firestore Database
- [ ] ✅ تفعيل Google Authentication
- [ ] ✅ تفعيل Email/Password Authentication
- [ ] ✅ إضافة collection اسمها `products`
- [ ] ✅ إضافة منتج واحد على الأقل
- [ ] ✅ إعداد Firebase Storage
- [ ] ✅ تحديث Firestore Rules
- [ ] ✅ تحديث Storage Rules
- [ ] ✅ إضافة نطاق Replit في Authorized domains

---

## 🎯 النتيجة النهائية

بعد إتمام جميع الخطوات:
1. التطبيق سيعمل بدون أخطاء
2. يمكن للمستخدمين التسجيل والدخول
3. يمكن عرض المنتجات من قاعدة البيانات
4. يمكن رفع الملفات والإيصالات

---

## 🆘 إذا واجهت مشاكل

### مشكلة: "Permission denied"
**الحل:** تأكد من تطبيق Security Rules

### مشكلة: "Unauthorized domain"
**الحل:** أضف نطاق Replit في Authorized domains

### مشكلة: "لا تظهر البيانات"
**الحل:** تأكد من:
1. وجود collection اسمها `products` بالضبط
2. وجود منتجات في الـ collection
3. الحقول مكتوبة بنفس الأسماء

---

## 📚 موارد إضافية

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Security Rules](https://firebase.google.com/docs/rules)

---

**🎉 بالتوفيق! إذا احتجت مساعدة في أي خطوة، أخبرني!**
