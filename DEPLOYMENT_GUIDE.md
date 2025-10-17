# دليل النشر على Vercel مع Firebase

## المتطلبات الأساسية

1. حساب Firebase مع تفعيل:
   - Firebase Authentication (Email/Password + Google Sign-In)
   - Cloud Firestore Database
2. حساب Vercel

## خطوات النشر

### 1. إعداد Firebase

#### A. إنشاء مشروع Firebase

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. اضغط على "Add project" وأدخل اسم المشروع
3. اتبع الخطوات حتى إنشاء المشروع

#### B. تفعيل Firebase Authentication

1. من لوحة تحكم Firebase، اذهب إلى **Build** > **Authentication**
2. اضغط على **Get Started**
3. فعّل طرق تسجيل الدخول:
   - **Email/Password**: فعّله
   - **Google**: فعّله وأدخل بريد الدعم

#### C. تفعيل Cloud Firestore

1. من لوحة تحكم Firebase، اذهب إلى **Build** > **Firestore Database**
2. اضغط على **Create database**
3. اختر موقع الخادم (يفضل أقرب موقع لك)
4. ابدأ في وضع Production mode أو Test mode حسب احتياجاتك
5. ستحتاج لإنشاء Collections التالية (سيتم إنشاؤها تلقائياً عند أول استخدام):
   - `users` - لتخزين معلومات المستخدمين
   - `products` - لتخزين المنتجات
   - `orders` - لتخزين الطلبات
   - `purchases` - لتخزين المشتريات بعد التأكيد
   - `messages` - لتخزين رسائل التواصل

#### D. إعداد Firestore Security Rules

في قسم **Firestore Database** > **Rules**، أضف القواعد التالية:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products collection (القراءة متاحة للجميع، الكتابة للإدارة فقط)
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // يمكن تقييد الكتابة حسب دور المستخدم
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    
    // Purchases collection
    match /purchases/{purchaseId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
\`\`\`

#### E. الحصول على Firebase Config

1. من صفحة Project Overview، اضغط على أيقونة الويب `</>`
2. أدخل اسم التطبيق واضغط على **Register app**
3. انسخ معلومات `firebaseConfig`

#### F. إنشاء Service Account (للـ Backend)

1. اذهب إلى **Project Settings** > **Service Accounts**
2. اضغط على **Generate new private key**
3. سيتم تنزيل ملف JSON - احتفظ به بشكل آمن
4. انسخ محتوى الملف JSON بالكامل (سنحتاجه في خطوة Vercel)

### 2. إعداد Vercel

#### A. ربط المشروع بـ Vercel

1. افتح [Vercel Dashboard](https://vercel.com/)
2. اضغط على **Add New** > **Project**
3. استورد المشروع من Git (GitHub, GitLab, أو Bitbucket)
4. اختر Repository الخاص بك

#### B. إعداد Environment Variables

في صفحة إعداد المشروع، أضف المتغيرات البيئية التالية:

**Frontend Variables (للمتصفح):**
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Backend Variables (للسيرفر):**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"..."}
NODE_ENV=production
```

**ملاحظة مهمة:** 
- `FIREBASE_SERVICE_ACCOUNT` يجب أن يحتوي على محتوى ملف Service Account JSON بالكامل في سطر واحد
- تأكد من نسخه كـ JSON صحيح بدون مسافات إضافية

#### C. Build Settings

Vercel سيكتشف الإعدادات تلقائياً، ولكن تأكد من:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`

#### D. Deploy

1. اضغط على **Deploy**
2. انتظر حتى ينتهي النشر
3. ستحصل على رابط Production URL

### 3. ما بعد النشر

#### A. تحديث Firebase Authorized Domains

1. اذهب إلى **Firebase Console** > **Authentication** > **Settings** > **Authorized domains**
2. أضف نطاق Vercel الخاص بك (مثل: `your-project.vercel.app`)

#### B. اختبار التطبيق

1. افتح رابط Production
2. جرّب تسجيل الدخول بالإيميل وGoogle
3. تأكد من عمل جميع الميزات

### 4. التحديثات المستقبلية

عند إضافة تغييرات جديدة:
1. Push الكود إلى Git
2. Vercel سينشر التحديثات تلقائياً

## استخدام Firebase في الكود

### Frontend (Firebase Auth)

```typescript
import { auth } from './lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// تسجيل الدخول
await signInWithEmailAndPassword(auth, email, password);
```

### Backend (Firestore)

```typescript
import { db } from './firestore';

// إضافة مستند
const docRef = await db.collection('products').add({
  name: 'Product Name',
  price: 100
});

// قراءة مستندات
const snapshot = await db.collection('products').get();
const products = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

## حل المشاكل الشائعة

### 1. خطأ "Missing Firebase environment variables"
- تأكد من إضافة جميع متغيرات البيئة في Vercel
- أعد نشر التطبيق بعد إضافة المتغيرات

### 2. خطأ في Firebase Authentication
- تأكد من إضافة نطاق Vercel في Authorized domains
- تحقق من صحة Firebase Config

### 3. خطأ في Firestore Permissions
- راجع Security Rules في Firestore
- تأكد من أن المستخدم مسجل دخول قبل القراءة/الكتابة

### 4. خطأ في Service Account
- تأكد من صحة JSON في FIREBASE_SERVICE_ACCOUNT
- تحقق من أن Service Account له الصلاحيات الكافية

## الأمان

- لا تشارك Service Account JSON علناً
- استخدم Environment Variables فقط
- راجع Firestore Security Rules بانتظام
- فعّل 2FA على حسابات Firebase وVercel

## الدعم

للمزيد من المساعدة:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
