// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 Thêm dòng này

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP4Mq5gNU-6evOjcGg4Tf6ZgGcdRQn2B8",
  authDomain: "sentences-manages.firebaseapp.com",
  projectId: "sentences-manages",
  storageBucket: "sentences-manages.firebasestorage.app",
  messagingSenderId: "816415908900",
  appId: "1:816415908900:web:d8501bf23bb6da3c04a4b1",
  measurementId: "G-NH5SPZ39DV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // 👈 Khởi tạo Firestore

export { auth, db }; // 👈 Export cả auth và db
