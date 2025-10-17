# إعداد Firebase Authentication

## الخطوات المطلوبة لربط الموقع بـ Firebase

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

### 3. إضافة تطبيق ويب

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

### 4. إضافة المتغيرات البيئية في Replit

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

**مهم جداً**: استبدل القيم بالقيم الفعلية من Firebase Console

### 5. إعداد OAuth لـ Google Sign-In

1. في Firebase Console، اذهب إلى **Authentication** > **Sign-in method**
2. انقر على **Google** واضغط على Edit
3. انسخ الـ OAuth client ID المعطى
4. في Replit، أضف النطاق المسموح:
   - افتح **Settings** في مشروعك
   - في Firebase Console > **Authentication** > **Settings** > **Authorized domains**
   - أضف نطاق Replit الخاص بك (مثلاً: `your-project.replit.dev`)

### 6. اختبار المصادقة

1. بعد إضافة جميع المتغيرات، أعد تشغيل التطبيق
2. اذهب إلى صفحة `/login`
3. جرّب:
   - إنشاء حساب جديد بالإيميل
   - تسجيل الدخول بالإيميل
   - تسجيل الدخول بواسطة Google

### 7. ملاحظات مهمة

- **الأمان**: لا تشارك مفاتيح API الخاصة بك علناً
- **Domain Authorization**: تأكد من إضافة نطاق Replit في Firebase Authorized domains
- **Google OAuth**: قد تحتاج إلى تفعيل Google Cloud Platform APIs للمشروع

## الدعم

إذا واجهت أي مشاكل:

1. تأكد من أن جميع المتغيرات البيئية مضافة بشكل صحيح
2. تأكد من تفعيل Email/Password وGoogle في Firebase Console
3. تأكد من إضافة نطاق Replit في Authorized domains
4. تحقق من Console في المتصفح لأي أخطاء

## الميزات المتاحة الآن

✅ تسجيل دخول بالإيميل وكلمة المرور
✅ إنشاء حساب جديد بالإيميل
✅ تسجيل دخول بواسطة Google
✅ تسجيل خروج
✅ حماية الصفحات (إعادة توجيه لصفحة Login)
✅ عرض معلومات المستخدم في Header
✅ إعادة التوجيه التلقائية للصفحة المطلوبة بعد تسجيل الدخول
