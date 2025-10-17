# دليل نشر المشروع على Vercel 🚀

## الخطوات المطلوبة:

### 1️⃣ تثبيت Vercel CLI (اختياري)
```bash
npm i -g vercel
```

### 2️⃣ رفع المشروع على GitHub
1. قم بإنشاء repository جديد على GitHub
2. ارفع المشروع:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```

### 3️⃣ إعداد المشروع على Vercel

#### أ. ربط المشروع بـ Vercel:
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل الدخول باستخدام حساب GitHub
3. اضغط "Import Project" أو "New Project"
4. اختر الـ repository الخاص بك

#### ب. إضافة متغيرات البيئة (Environment Variables):

**⚠️ هذه الخطوة مهمة جداً - بدونها لن يعمل المشروع!**

في صفحة إعدادات المشروع على Vercel، أضف المتغيرات التالية:

**متغيرات Firebase (Frontend - عامة):**
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyBsJZ9xg3PbnwaMNSDbqb7x_JAwwRex2zY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = helpful-lens-473819-i3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = helpful-lens-473819-i3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = helpful-lens-473819-i3.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 294081519157
NEXT_PUBLIC_FIREBASE_APP_ID = 1:294081519157:web:884aad41de077425005b7c
```

**متغير Firebase Admin (Backend - سري):**
```
FIREBASE_SERVICE_ACCOUNT = {محتوى ملف service account JSON بالكامل في سطر واحد}
```

### 4️⃣ كيف تحصل على Service Account من Firebase؟

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروعك: `helpful-lens-473819-i3`
3. اذهب إلى: **Project Settings** (الإعدادات) > **Service Accounts**
4. اضغط على **Generate New Private Key** (إنشاء مفتاح خاص جديد)
5. سيتم تحميل ملف JSON
6. افتح الملف وانسخ محتواه **بالكامل**
7. الصق المحتوى في متغير `FIREBASE_SERVICE_ACCOUNT` على Vercel

**مثال على شكل المحتوى:**
```json
{"type":"service_account","project_id":"helpful-lens-473819-i3","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

### 5️⃣ النشر (Deploy)

بعد إضافة جميع المتغيرات:
1. اضغط "Deploy" على Vercel
2. انتظر حتى ينتهي البناء (Build)
3. سيعطيك Vercel رابط موقعك!

### 6️⃣ تحديث Firebase Authentication Domains

⚠️ **خطوة مهمة لتسجيل الدخول:**

1. اذهب إلى Firebase Console > **Authentication** > **Settings**
2. في قسم **Authorized Domains**، أضف:
   - `your-app.vercel.app` (استبدله برابط موقعك الفعلي على Vercel)

---

## 🔄 للتحديثات المستقبلية:

بمجرد ربط المشروع، أي push إلى GitHub سيتم نشره تلقائياً على Vercel! 🎉

```bash
git add .
git commit -m "update message"
git push
```

---

## 🐛 حل المشاكل الشائعة:

### المشكلة: "Firebase: Error (auth/invalid-api-key)"
**الحل:** تأكد من إضافة جميع متغيرات البيئة على Vercel بشكل صحيح

### المشكلة: "FIREBASE_SERVICE_ACCOUNT is invalid"
**الحل:** تأكد من نسخ محتوى ملف JSON **بالكامل** في سطر واحد بدون أي مسافات إضافية

### المشكلة: الموقع يعمل لكن تسجيل الدخول لا يعمل
**الحل:** تأكد من إضافة نطاق Vercel إلى Authorized Domains في Firebase

---

## 📝 ملاحظات مهمة:

- ✅ المشروع جاهز للنشر على Vercel
- ✅ جميع المتغيرات محمية ولن يتم رفعها على GitHub
- ✅ `.gitignore` محدّث لحماية البيانات الحساسة
- ✅ استخدم `.env.local` للتطوير المحلي فقط
