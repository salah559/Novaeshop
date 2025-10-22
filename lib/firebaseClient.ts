// Firebase client initialization (for browser)
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getRedirectResult } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

if (!getApps().length) {
  initializeApp(clientConfig);
}

export const auth = getAuth();

// Configure persistence to use localStorage instead of sessionStorage
import { browserLocalPersistence, setPersistence } from 'firebase/auth';
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting persistence:', error);
});

export const provider = new GoogleAuthProvider();
export const db = getFirestore();
export const storage = getStorage();

export async function signInWithGoogle() {
  try {
    // Try popup first (works better in most environments)
    const { signInWithPopup } = await import('firebase/auth');
    return await signInWithPopup(auth, provider);
  } catch (popupError: any) {
    // If popup is blocked or fails, fallback to redirect
    console.log('Popup blocked, using redirect...', popupError);
    if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/cancelled-popup-request') {
      return signInWithRedirect(auth, provider);
    }
    throw popupError;
  }
}

export async function handleRedirectResult() {
  return getRedirectResult(auth);
}

export async function signInEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerEmail(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // إرسال بريد التحقق
  const { sendEmailVerification } = await import('firebase/auth');
  await sendEmailVerification(userCredential.user);
  return userCredential;
}

export async function logout() {
  return signOut(auth);
}