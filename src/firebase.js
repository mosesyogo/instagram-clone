import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAdocyau80DTcqfadh9kWMhTki5yM7s9A",
  authDomain: "instagram-clone-bfe8a.firebaseapp.com",
  projectId: "instagram-clone-bfe8a",
  storageBucket: "instagram-clone-bfe8a.firebasestorage.app",
  messagingSenderId: "1026503515591",
  appId: "1:1026503515591:web:10d613036305aeeb44cde2",
  measurementId: "G-7T8CDDCK2T",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage };