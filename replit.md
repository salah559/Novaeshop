# DZ Digital Market - منصة المنتجات الرقمية الجزائرية

## نظرة عامة

منصة بيع منتجات رقمية جزائرية احترافية مع دفع يدوي عبر بريدي موب، مربوطة بـ Firebase للمصادقة وقاعدة البيانات.

**آخر تحديث:** تم ترحيل المشروع من PostgreSQL إلى Firebase Firestore، مع إعداد كامل للنشر على Vercel.

## المميزات الرئيسية

### للمستخدمين
- ✅ تصفح المنتجات الرقمية حسب التصنيفات (كورسات، فيديوهات 4K، كتب، قوالب WordPress، أدوات ChatGPT، Packs)
- ✅ إضافة منتجات إلى السلة
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

### Frontend
- React + TypeScript
- Wouter (للتوجيه)
- Tailwind CSS + Shadcn UI
- Zustand (لإدارة السلة)
- TanStack Query (لجلب البيانات)
- Firebase Authentication (لتسجيل الدخول)
- خط Tajawal العربي مع دعم RTL كامل

### Backend
- Express.js
- Firebase Admin SDK
- Cloud Firestore (قاعدة البيانات)
- Firebase Authentication (Google + Email/Password)
- Multer (لرفع الصور)

### قاعدة البيانات (Firestore)
- `users` - المستخدمين (مربوطة بـ Firebase Auth)
- `products` - المنتجات (اسم، وصف، سعر، تصنيف، صورة، رابط تحميل)
- `orders` - الطلبات (مع صور الدفع وحالة الطلب)
- `purchases` - المشتريات المفعلة
- `messages` - رسائل التواصل

## التصميم

### الألوان
- **الخلفية**: أخضر فاتح متدرج نحو الأسود الشفاف
- **النصوص**: أبيض/رمادي فاتح
- **الأزرار**: أخضر زاهٍ مع تأثيرات hover
- **Theme**: Dark mode بشكل افتراضي

### الخطوط
- Tajawal (رئيسي)
- Cairo (احتياطي)
- دعم كامل للغة العربية مع RTL

## الصفحات

1. **الصفحة الرئيسية** (`/`) - بانر متحرك، منتجات مميزة، الأكثر مبيعاً
2. **المنتجات** (`/products`) - عرض جميع المنتجات مع تصفية حسب التصنيف
3. **تفاصيل المنتج** (`/product/:id`) - وصف كامل مع سعر وزر إضافة للسلة
4. **السلة** (`/cart`) - عرض المنتجات المضافة مع الإجمالي
5. **الدفع** (`/payment`) - تعليمات الدفع عبر بريدي موب ورفع صورة الإيصال
6. **مشترياتي** (`/purchases`) - المنتجات المفعلة مع روابط التحميل
7. **لوحة الأدمن** (`/admin`) - إدارة الطلبات والمنتجات
8. **تواصل معنا** (`/contact`) - نموذج للتواصل مع الدعم
9. **تسجيل الدخول** (`/login`) - صفحة الدخول والتسجيل

## API Endpoints

### Products
- `GET /api/products` - جميع المنتجات (مع filter حسب category)
- `GET /api/products/featured` - المنتجات المميزة
- `GET /api/products/bestsellers` - الأكثر مبيعاً
- `GET /api/products/:id` - منتج محدد

### Orders
- `POST /api/orders` - إنشاء طلب جديد (مع رفع صورة الدفع)

### Purchases
- `GET /api/purchases` - مشتريات المستخدم

### Messages
- `POST /api/messages` - إرسال رسالة

### Admin
- `GET /api/admin/orders` - جميع الطلبات
- `POST /api/admin/orders/:id/confirm` - تأكيد طلب
- `POST /api/admin/orders/:id/reject` - رفض طلب
- `GET /api/admin/products` - جميع المنتجات (للأدمن)
- `POST /api/admin/products` - إضافة منتج جديد
- `DELETE /api/admin/products/:id` - حذف منتج

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
- متغيرات البيئة المطلوبة (راجع FIREBASE_SETUP.md)

### التشغيل المحلي

1. أضف المتغيرات البيئية المطلوبة في Secrets:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

2. شغّل المشروع:
```bash
npm run dev
```

يعمل على: `http://localhost:5000`

### النشر على Vercel

راجع ملف `DEPLOYMENT_GUIDE.md` للحصول على تعليمات تفصيلية.

## الملفات المهمة

- `FIREBASE_SETUP.md` - تعليمات إعداد Firebase
- `DEPLOYMENT_GUIDE.md` - تعليمات النشر على Vercel
- `vercel.json` - تكوين Vercel
- `server/firestore.ts` - إعداد Firestore
- `server/storage.ts` - واجهة قاعدة البيانات
- `shared/schema.ts` - تعريفات أنواع البيانات

## الميزات المطبقة

- [x] Firebase Authentication (Google + Email/Password)
- [x] Cloud Firestore Database
- [x] نظام السلة الكامل
- [x] رفع صور الدفع
- [x] إدارة الطلبات
- [x] عرض المنتجات والتصفية
- [x] التصميم المتجاوب مع RTL
- [x] لوحة تحكم الأدمن
- [x] إعداد النشر على Vercel

## التطوير المستقبلي

- [ ] حماية Admin routes بناءً على دور المستخدم
- [ ] نظام إشعارات بريدية
- [ ] تقييمات وتعليقات على المنتجات
- [ ] كوبونات الخصم
- [ ] إحصائيات المبيعات في لوحة الأدمن
- [ ] ربط المستخدمين بحساباتهم في Firebase Auth
