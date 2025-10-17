# DZ Digital Market 🛒

منصة جزائرية حديثة لبيع المنتجات الرقمية - مبنية بـ HTML, CSS, JavaScript

## ✨ المميزات

- 🎨 **تصميم عصري وجميل** - واجهة مستخدم احترافية بألوان جذابة
- ⚡ **سريع وخفيف** - موقع ثابت بدون React أو frameworks معقدة
- 🔥 **حركات سلسة** - animations جميلة في كل أنحاء الموقع
- 🔐 **Firebase Authentication** - تسجيل دخول آمن (Email + Google)
- 📦 **Firestore Database** - قاعدة بيانات سحابية سريعة
- 🌙 **Dark Mode** - تصميم داكن أنيق
- 📱 **Responsive** - متجاوب مع جميع الأجهزة
- 🇩🇿 **RTL Support** - دعم كامل للغة العربية

## 🚀 النشر على Vercel

### الخطوة 1: Fork المشروع

1. اضغط على Fork في GitHub
2. انتظر حتى ينتهي النسخ

### الخطوة 2: إعداد Firebase

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. أنشئ مشروع جديد
3. فعّل **Authentication** (Email/Password + Google)
4. فعّل **Firestore Database**
5. احصل على معلومات التكوين من Project Settings

### الخطوة 3: النشر على Vercel

1. افتح [Vercel](https://vercel.com/)
2. اضغط **New Project**
3. استورد repository من GitHub
4. أضف Environment Variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. اضغط **Deploy**

### الخطوة 4: تحديث Firebase Config

بعد النشر، حدّث ملف `public/_config.js` بمعلومات Firebase الخاصة بك:

```javascript
window.ENV = {
    VITE_FIREBASE_API_KEY: 'your_actual_api_key',
    VITE_FIREBASE_AUTH_DOMAIN: 'your-project.firebaseapp.com',
    // ... باقي المعلومات
};
```

ثم اعمل push للتغييرات، وVercel ستقوم بالنشر التلقائي.

## 🛠️ التطوير المحلي

```bash
# ببساطة افتح index.html في المتصفح
# أو استخدم Live Server
```

لا تحتاج npm أو node! الموقع يعمل مباشرة في المتصفح.

## 📁 البنية

```
public/
├── index.html          # الصفحة الرئيسية
├── css/
│   ├── style.css      # التصميم الرئيسي
│   └── pages.css      # تصميم الصفحات
├── js/
│   ├── app.js         # التطبيق الرئيسي
│   ├── router.js      # نظام التوجيه
│   ├── cart.js        # إدارة السلة
│   ├── auth.js        # المصادقة
│   ├── firebase-config.js  # إعداد Firebase
│   └── pages/         # صفحات الموقع
│       ├── home.js
│       ├── products.js
│       ├── cart.js
│       ├── login.js
│       ├── contact.js
│       ├── purchases.js
│       └── admin.js
└── _config.js         # بيانات Firebase
```

## 🎨 الفئات المتاحة

- 📚 كورسات تعليمية
- 🎥 فيديوهات 4K
- 📖 كتب إلكترونية
- 🎨 قوالب WordPress
- 🤖 أدوات ChatGPT
- 📦 Packs كاملة

## 🔐 الأمان

- جميع بيانات Firebase يتم تخزينها في Environment Variables
- لا توجد API keys في الكود
- Firestore Security Rules تحمي البيانات

## 📱 الصفحات

- **الرئيسية** - منتجات مميزة + الأكثر مبيعاً
- **المنتجات** - جميع المنتجات مع تصفية
- **السلة** - عربة المشتريات
- **تسجيل الدخول** - Email أو Google
- **تواصل معنا** - نموذج تواصل
- **مشترياتي** - المنتجات المشتراة
- **لوحة التحكم** - إدارة المنصة

## 🌟 التقنيات المستخدمة

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6 Modules)
- Firebase (Auth + Firestore)
- AOS (Animate On Scroll)
- Font Awesome Icons
- Google Fonts (Tajawal)

## 📝 الترخيص

MIT License - استخدمه بحرية!

## 💝 الدعم

إذا أعجبك المشروع، أعطه ⭐ على GitHub!

---

صُنع بـ ❤️ في الجزائر 🇩🇿
