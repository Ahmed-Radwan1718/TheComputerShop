import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  PhoneAuthProvider,
  RecaptchaVerifier,
  updatePhoneNumber,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQ75_dVpbAc_EEE_NrV0StR78KUxbL8p0",
  authDomain: "the-computer-shop-aad6b.firebaseapp.com",
  projectId: "the-computer-shop-aad6b",
  storageBucket: "the-computer-shop-aad6b.firebasestorage.app",
  messagingSenderId: "553614203519",
  appId: "1:553614203519:web:6a87b04ae75abe4437bd4a",
  measurementId: "G-XS15LLFV69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.tcsAuth = {
  app,
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  PhoneAuthProvider,
  RecaptchaVerifier,
  updatePhoneNumber,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
};
