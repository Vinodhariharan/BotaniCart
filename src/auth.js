import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,GoogleAuthProvider   } from "firebase/auth";
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH8lUe68WFGuPezFI19IzEbyqCZ-4lxXk",
  authDomain: "plant-palette.firebaseapp.com",
  projectId: "plant-palette",
  storageBucket: "plant-palette.firebasestorage.app",
  messagingSenderId: "987074721965",
  appId: "1:987074721965:web:e548c73af76dd107766e24"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };

// export const auth = getAuth(app);

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

const googleProvider = new GoogleAuthProvider();


export { onAuthStateChanged, googleProvider };