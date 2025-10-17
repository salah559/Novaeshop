# إعداد Firebase للمشروع

## نظرة عامة

هذا المشروع يستخدم:
- **Firebase Authentication** لتسجيل الدخول (Email/Password + Google Sign-In)
- **Cloud Firestore** كقاعدة بيانات

## الخطوات المطلوبة

### 1. إنشاء مشروع Firebase

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. اضغط على "Add project" أو "إضافة مشروع"
3. أدخل اسم المشروع (مثلاً: DZ Digital Market)
4. اتبع الخطوات حتى إنشاء المشروع

### 2. إعداد Firebase Authentication

1. من لوحة تحكم Firebase، اذهب إلى **Build** > **Authentication**
2. اضغط على **Get Started**
3. فعّل طرق تسجيل الدخول:
   - **Email/Password**: اضغط على "Email/Password" وفعّله
   - **Google**: اضغط على "Google" وفعّله، ثم أدخل بريد الدعم الإلكتروني

### 3. إعداد Cloud Firestore

1. من لوحة تحكم Firebase، اذهب إلى **Build** > **Firestore Database**
2. اضغط على **Create database**
3. اختر موقع الخادم (يفضل أقرب موقع لك)
4. ابدأ في **Test mode** أو **Production mode**

**ملاحظة:** Collections التالية ستُنشأ تلقائياً عند أول استخدام:
- `users` - معلومات المستخدمين
- `products` - المنتجات
- `orders` - الطلبات
- `purchases` - المشتريات بعد التأكيد
- `messages` - رسائل التواصل

### 4. إضافة تطبيق ويب

1. من صفحة Project Overview، اضغط على أيقونة الويب `</>`
2. أدخل اسم التطبيق (مثلاً: DZ Digital Market Web)
3. **لا تفعّل** Firebase Hosting (ليس ضرورياً)
4. اضغط على **Register app**
5. ستظهر لك صفحة بها معلومات التكوين مثل:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 5. إضافة المتغيرات البيئية

#### للتطوير المحلي (Replit):

1. في Replit، افتح قسم **Secrets** (Tools > Secrets)
2. أضف المتغيرات التالية بقيمها من Firebase:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN_HERE
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_HERE
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET_HERE
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID_HERE
VITE_FIREBASE_APP_ID=YOUR_APP_ID_HERE
```

**للبيئة Production (Vercel):** راجع ملف `DEPLOYMENT_GUIDE.md`

### 6. إعداد OAuth لـ Google Sign-In

1. في Firebase Console، اذهب إلى **Authentication** > **Sign-in method**
2. انقر على **Google** واضغط على Edit
3. في Replit، أضف النطاق المسموح:
   - افتح **Settings** في مشروعك
   - في Firebase Console > **Authentication** > **Settings** > **Authorized domains**
   - أضف نطاق Replit الخاص بك (مثلاً: `your-project.replit.dev`)

### 7. Firestore Security Rules (اختياري)

للتحكم في الوصول للبيانات، يمكنك إضافة قواعد الأمان في **Firestore Database** > **Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    
    match /purchases/{purchaseId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
    
    match /messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

### 8. اختبار المصادقة

1. بعد إضافة جميع المتغيرات، أعد تشغيل التطبيق
2. اذهب إلى صفحة `/login`
3. جرّب:
   - إنشاء حساب جديد بالإيميل
   - تسجيل الدخول بالإيميل
   - تسجيل الدخول بواسطة Google

## ملاحظات مهمة

- **الأمان**: لا تشارك مفاتيح API الخاصة بك علناً
- **Domain Authorization**: تأكد من إضافة نطاق Replit في Firebase Authorized domains
- **Google OAuth**: قد تحتاج إلى تفعيل Google Cloud Platform APIs للمشروع

## الميزات المتاحة

✅ تسجيل دخول بالإيميل وكلمة المرور
✅ إنشاء حساب جديد بالإيميل
✅ تسجيل دخول بواسطة Google
✅ تسجيل خروج
✅ حماية الصفحات (إعادة توجيه لصفحة Login)
✅ قاعدة بيانات Cloud Firestore
✅ تخزين المنتجات والطلبات والمشتريات

## للنشر على Vercel

راجع ملف `DEPLOYMENT_GUIDE.md` للحصول على تعليمات مفصلة حول كيفية نشر المشروع على Vercel مع Firebase.
