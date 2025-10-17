# Firebase & Firestore Setup Guide

## ✅ Current Status
Firebase و Firestore متصلان بالكامل ويعملان بشكل صحيح!

## Environment Variables (Already Configured)

جميع المتغيرات البيئية التالية تم إعدادها بنجاح في Replit Secrets:

### Client Configuration (Browser)
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_APP_ID`

### Server Configuration (API Routes)
- ✅ `FIREBASE_SERVICE_ACCOUNT` (JSON service account)

## Database Collections Structure

### 1. Products Collection (`products`)
```javascript
{
  name: string,           // اسم المنتج
  description: string,    // وصف المنتج
  price: number,          // السعر
  category: string,       // التصنيف
  imageUrl: string,       // رابط صورة المنتج
  filePath: string,       // مسار الملف في Storage (أو fileUrl للرابط المباشر)
}
```

### 2. Orders Collection (`orders`)
```javascript
{
  userId: string | null,      // معرف المستخدم
  items: array,               // قائمة المنتجات المطلوبة
  total: number,              // المبلغ الإجمالي
  paymentImageUrl: string,    // رابط صورة إيصال الدفع
  email: string,              // البريد الإلكتروني
  status: 'pending' | 'confirmed',  // حالة الطلب
  createdAt: Date,            // تاريخ الإنشاء
  confirmedAt: Date,          // تاريخ التأكيد (optional)
}
```

### 3. Purchases Collection (`purchases`)
```javascript
{
  userId: string,         // معرف المستخدم
  productId: string,      // معرف المنتج
  name: string,           // اسم المنتج
  downloadUrl: string,    // رابط التحميل (signed URL)
  createdAt: Date,        // تاريخ الشراء
}
```

### 4. Messages Collection (`messages`)
```javascript
{
  name: string,       // اسم المرسل
  email: string,      // البريد الإلكتروني
  message: string,    // الرسالة
  fileUrl: string,    // رابط المرفق (optional)
  createdAt: Date,    // تاريخ الإرسال
}
```

## Security Rules

### Firestore Rules (`firestore.rules`)
تم إنشاء ملف قواعد الأمان الخاص بـ Firestore. لتطبيقها:

1. افتح Firebase Console
2. انتقل إلى Firestore Database > Rules
3. انسخ محتويات ملف `firestore.rules` والصقها
4. انقر على Publish

### Storage Rules (`storage.rules`)
تم إنشاء ملف قواعد الأمان الخاص بـ Storage. لتطبيقها:

1. افتح Firebase Console
2. انتقل إلى Storage > Rules
3. انسخ محتويات ملف `storage.rules` والصقها
4. انقر على Publish

## Storage Folders Structure

```
/payment-receipts/      → إيصالات الدفع المرفوعة من العملاء
/products/              → ملفات المنتجات الرقمية
/messages/              → مرفقات نماذج الاتصال
```

## How Data Flows

### Purchase Flow (تدفق عملية الشراء)
1. العميل يضيف منتجات للسلة → يتم الحفظ في `localStorage`
2. العميل يرفع صورة إيصال الدفع → تُحفظ في `/payment-receipts/`
3. يتم إنشاء طلب جديد في `orders` collection بحالة `pending`
4. الأدمن يراجع الطلب في صفحة Admin
5. الأدمن يؤكد الدفع → يتم:
   - تحديث حالة الطلب إلى `confirmed`
   - إنشاء سجلات في `purchases` collection مع روابط التحميل
6. العميل يصل إلى المشتريات من صفحة "مشترياتي"

### Contact Flow (تدفق نموذج الاتصال)
1. المستخدم يملأ النموذج ويمكن إرفاق ملف
2. الملف يُرفع إلى `/messages/` في Storage
3. يتم حفظ الرسالة في `messages` collection

## Firebase Services Used

### 1. Authentication
- Google OAuth
- Email/Password

### 2. Firestore Database
- Real-time NoSQL database
- Automatic sync مع الواجهة

### 3. Storage
- File uploads (receipts, product files)
- Signed URLs for secure downloads

### 4. Firebase Admin SDK
- Privileged operations في API routes
- Order confirmation
- Download URL generation

## Next Steps

لبدء استخدام التطبيق:

1. ✅ قم بإضافة منتجات في Firestore Console:
   - Collection: `products`
   - أضف منتجات مع جميع الحقول المطلوبة

2. ✅ قم برفع ملفات المنتجات إلى Storage:
   - Folder: `/products/`
   - احفظ مسار الملف في `filePath` field

3. ✅ تأكد من تطبيق Security Rules في Firebase Console

4. ✅ جرّب عملية شراء كاملة للتأكد من سير العمل

## Troubleshooting

### إذا ظهرت أخطاء Authentication:
- تأكد من تفعيل Google و Email/Password في Firebase Console > Authentication > Sign-in methods

### إذا ظهرت أخطاء Permission Denied:
- تأكد من تطبيق Security Rules من الملفات `firestore.rules` و `storage.rules`

### إذا لم تظهر المنتجات:
- تأكد من وجود منتجات في `products` collection في Firestore
