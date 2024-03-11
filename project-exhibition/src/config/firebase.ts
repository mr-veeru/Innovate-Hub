// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCY6vT54BWArf6cT1YnsmaUqAjYg6DaO0M",
  authDomain: "project-exhibition-7e1df.firebaseapp.com",
  projectId: "project-exhibition-7e1df",
  storageBucket: "project-exhibition-7e1df.appspot.com",
  messagingSenderId: "524160853001",
  appId: "1:524160853001:web:3802d4197143c1b20244d8",
  measurementId: "G-PXZ7FNCLF9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth (app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore (app);