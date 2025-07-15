// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNKj-ArGetm8lopOvuFYQDXcJAMqtJil4",
  authDomain: "mockview-7f38b.firebaseapp.com",
  projectId: "mockview-7f38b",
  storageBucket: "mockview-7f38b.firebasestorage.app",
  messagingSenderId: "13361137151",
  appId: "1:13361137151:web:bc75d2a6b67a4f7bdb93ca",
  measurementId: "G-KGT3Y54P32"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app);