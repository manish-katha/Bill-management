// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9bqYclD92H2S7hAYRBY3iTem5N_SNW8Q",
  authDomain: "bh-project-9052f.firebaseapp.com",
  projectId: "bh-project-9052f",
  storageBucket: "bh-project-9052f.appspot.com",
  messagingSenderId: "975468417880",
  appId: "1:975468417880:web:a398ae395379ca8d3e0b2d",
  measurementId: "G-RJDFZQ5KJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth=getAuth(app);
export const provider= new GoogleAuthProvider();  

export const myauth=getAuth(app);
export const db = getFirestore(app);