// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKssoB2i7abKzFBwipcBDpQnIRisx4vm4",
  authDomain: "retro-d1b09.firebaseapp.com",
  projectId: "retro-d1b09",
  storageBucket: "retro-d1b09.appspot.com",
  messagingSenderId: "40535315290",
  appId: "1:40535315290:web:2d5271a2e83056e05e5963",
  measurementId: "G-J9S60RDBBT",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getFirestore(app);
