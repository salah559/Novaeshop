
# DZ Digital Market - Starter (Next.js + Supabase)

هذا مشروع هيكلي (skeleton) لموقع بيع المنتجات الرقمية مبني بـ Next.js (TypeScript) ومربوط بـ Supabase.
المشروع يحتوي على صفحات: Home, Products, Product Detail, Cart, Checkout (رفع إثبات الدفع), MyPurchases, Contact, Admin panel (basic API hooks).

## تعليمات سريعة
1. انسخ `.env.example` إلى `.env.local` واملأ متغيرات Supabase.
2. تثبيت الحزم: `npm install`
3. تشغيل المشروع في وضع التطوير: `npm run dev`

## ملاحظات
- هذا قالب مبدئي. ستحتاج لتوصيل الواجهات مع Supabase، إعداد صلاحيات Storage، وتهيئة جداول SQL في Supabase.
- ملفات الـ backend الخاصة بالتأكيد على الطلبات يجب أن تستخدم `SUPABASE_SERVICE_ROLE_KEY` ويجب تشغيلها من Server-side (API routes).

