# إعداد المصادقة مع Firebase
# Firebase Authentication Setup

## نظرة عامة | Overview

تم إنشاء واجهة تسجيل دخول احترافية متكاملة تدعم:
A professional authentication interface has been created that supports:

- ✅ تسجيل الدخول/التسجيل بالبريد الإلكتروني | Email Sign In/Sign Up
- ✅ تسجيل الدخول برقم الهاتف | Phone Authentication
- ✅ تسجيل الدخول عبر Google | Google Sign In
- ✅ واجهة احترافية متناسقة مع تصميم الموقع | Professional UI consistent with site design
- ✅ دعم كامل للغة العربية والإنجليزية والفرنسية | Full support for Arabic, English, and French

## المكونات المضافة | Components Added

### 1. AuthModal Component (`components/AuthModal.tsx`)
مكون واجهة المصادقة الرئيسي الذي يحتوي على:
Main authentication modal component containing:

- نظام تبويب بين تسجيل الدخول والتسجيل | Tab system between Sign In and Sign Up
- اختيار طريقة المصادقة (إيميل/هاتف) | Authentication method selection (Email/Phone)
- نماذج إدخال محسنة مع التحقق | Enhanced input forms with validation
- دعم اختيار رمز الدولة للهاتف | Country code selector for phone
- زر تسجيل دخول Google منفصل | Separate Google Sign In button

### 2. Translations (`lib/translations.ts`)
تمت إضافة جميع الترجمات المطلوبة:
All required translations have been added:

```typescript
signIn, signUp, welcomeBack, createAccount, email, phone,
emailAddress, password, confirmPassword, enterEmail, enterPassword,
phoneNumber, phoneHint, sendCode, verificationCode, verify,
codeSentTo, changeNumber, or, continueWithGoogle, passwordMismatch, authError
```

### 3. Header Integration (`components/Header.tsx`)
تم تحديث الهيدر ليستخدم الواجهة الجديدة بدلاً من Google Sign In المباشر
The header has been updated to use the new modal instead of direct Google Sign In

## كيفية ربط Firebase | How to Connect Firebase

### الخطوة 1: إعداد Firebase Console | Step 1: Firebase Console Setup

1. انتقل إلى [Firebase Console](https://console.firebase.google.com/)
   Go to Firebase Console
   
2. اختر مشروعك أو أنشئ مشروع جديد
   Select your project or create a new one
   
3. فعّل طرق المصادقة التالية في Authentication:
   Enable the following authentication methods in Authentication:
   - Email/Password
   - Phone
   - Google

### الخطوة 2: إضافة بيانات الاعتماد | Step 2: Add Credentials

أضف متغيرات البيئة التالية في Replit Secrets:
Add the following environment variables in Replit Secrets:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### الخطوة 3: ربط دوال المصادقة | Step 3: Connect Authentication Functions

في ملف `components/AuthModal.tsx`، قم بتفعيل الدوال التالية:
In `components/AuthModal.tsx`, activate the following functions:

#### Email Authentication:
```typescript
import { signInEmail, registerEmail } from '@/lib/firebaseClient';

// في handleEmailAuth
if (authMode === 'signin') {
  await signInEmail(email, password);
} else {
  await registerEmail(email, password);
}
```

#### Phone Authentication:
```typescript
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';

// إرسال كود التحقق
const appVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
const confirmationResult = await signInWithPhoneNumber(
  auth, 
  countryCode + phone, 
  appVerifier
);

// التحقق من الكود
await confirmationResult.confirm(verificationCode);
```

#### Google Sign In:
```typescript
import { signInWithGoogle } from '@/lib/firebaseClient';

await signInWithGoogle();
```

### الخطوة 4: إضافة reCAPTCHA (للهاتف) | Step 4: Add reCAPTCHA (for Phone)

أضف عنصر reCAPTCHA في المكون:
Add reCAPTCHA element in the component:

```tsx
<div id="recaptcha-container"></div>
```

### الخطوة 5: إضافة النطاق المصرح به | Step 5: Add Authorized Domain

في Firebase Console → Authentication → Settings → Authorized domains:
In Firebase Console → Authentication → Settings → Authorized domains:

أضف نطاق Replit الخاص بك:
Add your Replit domain:
```
your-project.repl.co
```

## الحالة الحالية | Current Status

✅ واجهة المستخدم جاهزة بالكامل | UI is fully ready
✅ جميع النماذج والتحققات موجودة | All forms and validations are in place
✅ الترجمات متوفرة لجميع اللغات | Translations available for all languages
✅ التصميم متناسق مع الموقع | Design is consistent with the site
🔄 بانتظار إضافة بيانات اعتماد Firebase | Waiting for Firebase credentials

## كيفية الاختبار | How to Test

1. انقر على زر "تسجيل الدخول" في الهيدر
   Click the "Sign In" button in the header

2. ستظهر واجهة المصادقة الاحترافية
   The professional authentication modal will appear

3. يمكنك التنقل بين:
   You can navigate between:
   - تسجيل الدخول / إنشاء حساب
   - البريد الإلكتروني / الهاتف
   - تسجيل الدخول عبر Google

4. جميع الحقول تحتوي على تحقق من الصحة
   All fields have validation

5. الواجهة متجاوبة تماماً مع جميع الأحجام
   The interface is fully responsive for all screen sizes

## الميزات الإضافية | Additional Features

- رسائل خطأ واضحة بالعربية
  Clear error messages in Arabic
  
- تأثيرات بصرية احترافية
  Professional visual effects
  
- حالة تحميل للأزرار
  Loading state for buttons
  
- إغلاق الواجهة بالنقر خارجها
  Close modal by clicking outside
  
- دعم كامل للوحة المفاتيح (Enter للإرسال)
  Full keyboard support (Enter to submit)

## الملاحظات | Notes

- تم تصميم الواجهة لتكون جاهزة للربط مع Firebase مباشرة
  The interface is designed to be ready for direct Firebase integration
  
- جميع دوال المصادقة موجودة في `lib/firebaseClient.ts`
  All authentication functions are in `lib/firebaseClient.ts`
  
- يمكن توسيع الواجهة لإضافة مزودي مصادقة إضافيين
  The interface can be extended to add more authentication providers
