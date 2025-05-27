// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEiFgcxE9zk3numqbMt4fCcDoeXDQSBuM",
  authDomain: "mini-productivity-dashboard.firebaseapp.com",
  projectId: "mini-productivity-dashboard",
  storageBucket: "mini-productivity-dashboard.firebasestorage.app",
  messagingSenderId: "136367423716",
  appId: "1:136367423716:web:cb89aefeee8eae51f76cf1",
  measurementId: "G-ELPWMFZ287"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;