# DZ Digital Market - منصة المنتجات الرقمية الجزائرية

## نظرة عامة

منصة بيع منتجات رقمية جزائرية احترافية مع دفع يدوي عبر بريدي موب، **مبنية بـ HTML/CSS/JavaScript فقط** ومربوطة بـ Firebase للمصادقة وقاعدة البيانات.

**آخر تحديث:** 17 أكتوبر 2025 - تم تحويل المشروع بالكامل إلى HTML/CSS/JavaScript النقي (بدون React/TypeScript/frameworks) لاستضافة ثابتة على Vercel.

## المميزات الرئيسية

### التقنية
- ✨ **HTML/CSS/JavaScript** - موقع ثابت خفيف وسريع
- 🎨 **تصميم عصري** - واجهة جميلة مع حركات CSS سلسة
- 🔥 **Firebase** - مصادقة وقاعدة بيانات سحابية
- ⚡ **SPA Routing** - نظام توجيه بدون إعادة تحميل الصفحة
- 🌙 **Dark Mode** - تصميم داكن احترافي
- 📱 **Responsive** - متجاوب مع جميع الأجهزة
- 🇩🇿 **RTL Support** - دعم كامل للغة العربية

### للمستخدمين
- ✅ تصفح المنتجات الرقمية حسب التصنيفات (كورسات، فيديوهات 4K، كتب، قوالب WordPress، أدوات ChatGPT، Packs)
- ✅ إضافة منتجات إلى السلة (LocalStorage)
- ✅ دفع يدوي عبر بريدي موب مع رفع صورة الإيصال
- ✅ صفحة "مشترياتي" لعرض المنتجات المفعلة مع روابط التحميل
- ✅ نموذج تواصل مع الدعم الفني
- ✅ تسجيل دخول بالإيميل أو Google

### للأدمن
- ✅ مراجعة الطلبات مع صور الدفع
- ✅ تأكيد أو رفض الطلبات
- ✅ إضافة وحذف المنتجات
- ✅ إدارة كاملة للمنصة

## البنية التقنية

### Frontend (Static Site)
- HTML5
- CSS3 (Custom Properties, Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6 Modules)
- خط Tajawal العربي مع دعم RTL كامل

### Backend/Database
- Firebase Client SDK (من المتصفح مباشرة)
- Firebase Authentication (Google + Email/Password)
- Cloud Firestore (قاعدة البيانات)
- LocalStorage (للسلة)

### قاعدة البيانات (Firestore)
- `users` - المستخدمين (مربوطة بـ Firebase Auth)
- `products` - المنتجات (اسم، وصف، سعر، تصنيف، صورة، رابط تحميل)
- `orders` - الطلبات (مع صور الدفع وحالة الطلب)
- `purchases` - المشتريات المفعلة
- `messages` - رسائل التواصل

## التصميم

### الألوان
- **Primary**: `#10b981` (أخضر)
- **Secondary**: `#6366f1` (أزرق)
- **Background**: تدرج من الأسود إلى الأخضر الداكن
- **Text**: أبيض/رمادي فاتح
- **Theme**: Dark mode بشكل افتراضي

### الخطوط
- Tajawal (رئيسي)
- دعم كامل للغة العربية مع RTL

## الصفحات

1. **الصفحة الرئيسية** (`/`) - بانر، فئات، منتجات مميزة، الأكثر مبيعاً
2. **المنتجات** (`/products`) - عرض جميع المنتجات مع تصفية حسب التصنيف
3. **تفاصيل المنتج** - وصف كامل مع سعر وزر إضافة للسلة
4. **السلة** (`/cart`) - عرض المنتجات المضافة مع الإجمالي
5. **الدفع** (`/payment`) - تعليمات الدفع عبر بريدي موب ورفع صورة الإيصال
6. **مشترياتي** (`/purchases`) - المنتجات المفعلة مع روابط التحميل
7. **لوحة الأدمن** (`/admin`) - إدارة الطلبات والمنتجات
8. **تواصل معنا** (`/contact`) - نموذج للتواصل مع الدعم
9. **تسجيل الدخول** (`/login`) - صفحة الدخول والتسجيل

## طريقة العمل

### للمشتري
1. يسجل دخول بالإيميل أو Google
2. يتصفح المنتجات ويضيفها للسلة
3. يذهب للسلة ويضغط "متابعة الدفع"
4. يدفع عبر بريدي موب على الرقم المعروض
5. يرفع صورة الإيصال مع بياناته
6. ينتظر تأكيد الأدمن
7. بعد التأكيد، تظهر المنتجات في "مشترياتي" مع روابط التحميل

### للأدمن
1. يسجل دخول على `/login`
2. يدخل على `/admin`
3. يراجع الطلبات الجديدة مع صور الدفع
4. يؤكد الطلبات الصحيحة أو يرفض الخاطئة
5. عند التأكيد، تُضاف المنتجات تلقائياً لصفحة "مشتريات" العميل
6. يمكنه إضافة/حذف منتجات من لوحة التحكم

## الإعداد والتشغيل

### المتطلبات
- حساب Firebase مع:
  - Firebase Authentication (Email/Password + Google Sign-In)
  - Cloud Firestore Database

### التشغيل المحلي

1. حدّث ملف `public/_config.js` بمعلومات Firebase الخاصة بك:
```javascript
window.ENV = {
    VITE_FIREBASE_API_KEY: 'your_actual_api_key',
    VITE_FIREBASE_AUTH_DOMAIN: 'your-project.firebaseapp.com',
    VITE_FIREBASE_PROJECT_ID: 'your-project-id',
    VITE_FIREBASE_STORAGE_BUCKET: 'your-project.appspot.com',
    VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
    VITE_FIREBASE_APP_ID: '1:123456789:web:abc123'
};
```

2. شغّل السيرفر المحلي:
```bash
npx http-server public -p 5000 -c-1
```

أو ببساطة افتح `public/index.html` في المتصفح!

يعمل على: `http://localhost:5000`

### النشر على Vercel

#### الطريقة السريعة:

1. **Fork المشروع** على GitHub
2. **اربطه بـ Vercel** من [vercel.com/new](https://vercel.com/new)
3. **أضف Environment Variables** في Vercel:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. **اضغط Deploy** - وكل شيء سيعمل تلقائياً!

راجع ملف `README.md` للحصول على تعليمات تفصيلية.

## الملفات المهمة

### الهيكل الرئيسي
```
public/
├── index.html              # الصفحة الرئيسية
├── _config.js              # إعدادات Firebase
├── css/
│   ├── style.css          # التصميم الرئيسي
│   └── pages.css          # تصميم الصفحات
└── js/
    ├── firebase-config.js  # إعداد Firebase
    ├── router.js           # نظام التوجيه
    ├── cart.js             # إدارة السلة
    ├── auth.js             # المصادقة
    ├── app.js              # التطبيق الرئيسي
    └── pages/              # صفحات الموقع
        ├── home.js
        ├── products.js
        ├── cart.js
        ├── login.js
        ├── contact.js
        ├── purchases.js
        └── admin.js
```

### إعدادات النشر
- `vercel.json` - تكوين Vercel للـ SPA routing
- `README.md` - دليل شامل بالعربية
- `replit.md` - وثائق المشروع (هذا الملف)

## الميزات المطبقة

- [x] موقع HTML/CSS/JavaScript نقي
- [x] Firebase Authentication (Google + Email/Password)
- [x] Cloud Firestore Database
- [x] نظام السلة الكامل (LocalStorage)
- [x] SPA Router بدون framework
- [x] عرض المنتجات والتصفية
- [x] التصميم المتجاوب مع RTL
- [x] حركات CSS جميلة
- [x] إعداد النشر على Vercel

## التطوير المستقبلي

- [ ] رفع صور الدفع (يحتاج Firebase Storage)
- [ ] حماية Admin routes بناءً على دور المستخدم
- [ ] إدارة الطلبات في لوحة الأدمن
- [ ] صفحة المشتريات مع روابط التحميل
- [ ] نظام إشعارات بريدية
- [ ] تقييمات وتعليقات على المنتجات
- [ ] كوبونات الخصم
- [ ] إحصائيات المبيعات

## ملاحظات مهمة

### لماذا HTML/CSS/JS فقط؟
- ✅ **بساطة**: لا حاجة لـ build tools أو npm
- ✅ **سرعة**: تحميل فوري بدون bundling
- ✅ **استضافة مجانية**: Vercel, Netlify, GitHub Pages
- ✅ **صيانة سهلة**: كود بسيط وواضح
- ✅ **SEO-friendly**: HTML نقي بدون hydration

### Firebase vs Backend
- ✅ **بدون server**: لا حاجة لـ Express أو Node.js
- ✅ **مجاني**: Firebase free tier كافي للمشاريع الصغيرة
- ✅ **real-time**: تحديثات فورية من Firestore
- ✅ **آمن**: Security Rules تحمي البيانات
- ✅ **scalable**: يتحمل ملايين المستخدمين

## الدعم

للمساعدة أو الأسئلة، راجع:
- `README.md` - دليل كامل بالعربية
- Firebase Docs - [firebase.google.com/docs](https://firebase.google.com/docs)
- Vercel Docs - [vercel.com/docs](https://vercel.com/docs)

---

**صُنع بـ ❤️ في الجزائر 🇩🇿**
