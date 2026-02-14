import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQxiSlRuvZy2wDQhM8ze57GNMDJqMZ2bc",
    authDomain: "rede-conselho-mais.firebaseapp.com",
    projectId: "rede-conselho-mais",
    storageBucket: "rede-conselho-mais.firebasestorage.app",
    messagingSenderId: "252879226654",
    appId: "1:252879226654:web:8ec0f8276bff6764c6eb0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;
