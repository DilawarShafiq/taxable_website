import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyAgFun6a84b1ClSzeMh4dzku5aSgMmDACE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "taxable-ai-2026-25314.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "taxable-ai-2026-25314",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "taxable-ai-2026-25314.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "1030291954296",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:1030291954296:web:0ccded5263b6ab218ceb8d",
};

export function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

// Lazy singleton for client-side use
export const auth = typeof window !== "undefined" ? getFirebaseAuth() : ({} as ReturnType<typeof getAuth>);
