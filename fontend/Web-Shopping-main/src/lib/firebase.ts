// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1️⃣ ตั้งค่า Firebase config ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyDN0tW3MWMRblUOJAxfS7FiNtkDVdCZy4M",
  authDomain: "portfolio-255fb.firebaseapp.com",
  projectId: "portfolio-255fb",
  storageBucket: "portfolio-255fb.firebasestorage.app",
  messagingSenderId: "47495235625",
  appId: "1:47495235625:web:77f428c174bfff3bbc3438",
  measurementId: "G-47RYW5LETW"
};

// 2️⃣ เช็คว่า app ถูก initialize แล้วหรือยัง
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3️⃣ สร้าง instance ของ Firestore
const db = getFirestore(app);

export { app, db };
///