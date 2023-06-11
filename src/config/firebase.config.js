// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

//check out https://firebase.google.com/docs/web/setup
//check out https://stackoverflow.com/questions/70709987/how-to-load-environment-variables-from-env-file-using-vite
const apiKey = import.meta.env.VITE_API_KEY;
const authDomain = import.meta.env.VITE_AUTH_DOMAIN;
const storageBucket = import.meta.env.VITE_STORAGE_BUCKET;
const projectId = import.meta.env.VITE_PROJECT_ID;
const messagingSenderId = import.meta.env
  .VITE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_APP_ID;

const measurementId = import.meta.env.VITE_MEASUREMENT_ID;
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getFirestore(app);
export const auth = getAuth(app);
