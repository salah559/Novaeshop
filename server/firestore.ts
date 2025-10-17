import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin only if not already initialized
if (getApps().length === 0) {
  // For Vercel deployment, use service account from environment variable
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined;

  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    // For development, use default credentials or application default
    initializeApp();
  }
}

export const db = getFirestore();

// Set Firestore settings
db.settings({ ignoreUndefinedProperties: true });
