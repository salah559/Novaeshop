
# DZ Digital Market (Next.js + Firebase)

This is a starter template tailored to run on Vercel and use Firebase Authentication (Google + Email), Firestore for data, and Firebase Storage for receipts & product files.

## Quick start

1. Copy `.env.example` to `.env.local` and fill Firebase client vars and `FIREBASE_SERVICE_ACCOUNT`.
   - On Vercel, add env vars in the project settings. For `FIREBASE_SERVICE_ACCOUNT` use a stringified JSON or store service account JSON in Vercel secrets and reference it.
2. Install:
   ```
   npm install
   ```
3. Run dev:
   ```
   npm run dev
   ```
4. Deploy to Vercel (connect repo) — Vercel will build and use env vars.

## Notes
- Client-side Firebase config is in `lib/firebaseClient.ts`.
- Server-side admin operations (confirm order) use `lib/firebaseAdmin.ts` via API routes in `pages/api/admin`.
- This is a starter skeleton: you must create Firestore collections:
  - `products` (fields: name, description, price, category, imageUrl, filePath)
  - `orders` (userId, items: [{id,name,price}], total, paymentImageUrl, email, status)
  - `purchases` (userId, productId, downloadUrl)
- Storage: use bucket configured in Firebase console.

