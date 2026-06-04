import { initializeApp } from "firebase/app"

import { getAuth } from "firebase/auth"

import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"; 
const firebaseConfig = {
  apiKey: "AIzaSyAcr0IYVFosfAKFcPbN763dXQ4jv-MNYf4",
  authDomain: "madalali-cb482.firebaseapp.com",
  projectId: "madalali-cb482",
  storageBucket: "madalali-cb482.firebasestorage.app",
  messagingSenderId: "680228103020",
  appId: "1:680228103020:web:4dc1386bc1bee30a6d8949",
  measurementId: "G-NCL3TVJWM0"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app)

export const storage = getStorage(app);