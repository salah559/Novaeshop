// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: window.ENV?.VITE_FIREBASE_API_KEY || "",
    authDomain: window.ENV?.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: window.ENV?.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: window.ENV?.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: window.ENV?.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: window.ENV?.VITE_FIREBASE_APP_ID || ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
