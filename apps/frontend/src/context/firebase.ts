// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4dwD7f6IUa6dqESAk8IqA8x2SDYflSBQ",
  authDomain: "sweepease.firebaseapp.com",
  projectId: "sweepease",
  storageBucket: "sweepease.appspot.com",
  messagingSenderId: "719852263495",
  appId: "1:719852263495:web:d62cac83cf6aea2e477962",
  measurementId: "G-GNBKZ5Y7PP",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
