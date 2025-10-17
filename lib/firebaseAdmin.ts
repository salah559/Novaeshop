/**
 * Server-side Firebase Admin initialization for API routes.
 * Expects process.env.FIREBASE_SERVICE_ACCOUNT to contain either:
 * - JSON stringified service account
 * - path to service account JSON (if deployed and file accessible)
 */
import admin from 'firebase-admin';

function initAdmin() {
  if (admin.apps.length) return admin.app();
  let serviceAccount;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT || '';
  try {
    if (raw.trim().startsWith('{')) {
      serviceAccount = JSON.parse(raw);
    } else {
      // assume path
      serviceAccount = require(raw);
    }
  } catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT', e);
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT');
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  });
}

export const adminApp = initAdmin();
export const adminAuth = adminApp.auth();
export const adminDb = adminApp.firestore();
export const adminStorage = adminApp.storage();