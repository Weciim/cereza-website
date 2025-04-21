import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXOAlyWOBtH12Ob0DIoi7oXbWmJy5VNYc",
  authDomain: "cereza-884fb.firebaseapp.com",
  projectId: "cereza-884fb",
  storageBucket: "cereza-884fb.firebasestorage.app",
  messagingSenderId: "987341335433",
  appId: "1:987341335433:web:07da6592186adc67c54f58",
  measurementId: "G-7EX48M4SF0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const auth = getAuth(app);
export { db, app as default };
