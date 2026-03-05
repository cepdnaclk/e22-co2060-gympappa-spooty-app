import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaeuMtn3HLc9wqkPkirULm3s60WFmG6ZM",
  authDomain: "gympappa-trial2.firebaseapp.com",
  projectId: "gympappa-trial2",
  storageBucket: "gympappa-trial2.firebasestorage.app",
  messagingSenderId: "431635194762",
  appId: "1:431635194762:web:4d6d066f20c9f1daa6de73",
  measurementId: "G-ZL92J7E5ZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
