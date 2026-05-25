import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyBKim4vx1GC6jPk2ZOompEIMWCQUDO1vHo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "taxable-ai-2026.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "taxable-ai-2026",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "taxable-ai-2026.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "322958252133",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:322958252133:web:887cc056a1642104850e8c",
};

export function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

// Lazy singleton for client-side use
export const auth = typeof window !== "undefined" ? getFirebaseAuth() : ({} as ReturnType<typeof getAuth>);
