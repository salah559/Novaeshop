# DZ Digital Market 🛒

منصة جزائرية حديثة لبيع المنتجات الرقمية - مبنية بـ HTML, CSS, JavaScript

## ✨ المميزات

- 🎨 **تصميم عصري وجميل** - واجهة مستخدم احترافية بألوان جذابة
- ⚡ **سريع وخفيف** - موقع ثابت بدون frameworks معقدة
- 🔥 **حركات سلسة** - animations جميلة في كل أنحاء الموقع
- 🔐 **Firebase Authentication** - تسجيل دخول آمن (Email + Google)
- 📦 **Firestore Database** - قاعدة بيانات سحابية سريعة
- 📱 **Responsive** - متجاوب مع جميع الأجهزة
- 🇩🇿 **RTL Support** - دعم كامل للغة العربية

## 🚀 التشغيل

### محلياً:
```bash
npm start
```

يعمل على: `http://localhost:5000`

### إعداد Firebase:

1. أنشئ مشروع في [Firebase Console](https://console.firebase.google.com/)
2. فعّل Authentication و Firestore
3. حدّث ملف `public/_config.js` بمعلومات مشروعك

## 📁 الهيكل

```
public/
├── index.html
├── _config.js
├── css/
│   ├── style.css
│   └── pages.css
└── js/
    ├── app.js
    ├── router.js
    ├── auth.js
    ├── cart.js
    ├── firebase-config.js
    └── pages/
        ├── home.js
        ├── products.js
        ├── cart.js
        ├── login.js
        ├── contact.js
        ├── purchases.js
        └── admin.js
```

## 📝 الترخيص

MIT License - يمكنك استخدام المشروع بحرية