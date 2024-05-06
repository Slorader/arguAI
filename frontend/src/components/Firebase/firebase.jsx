// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBCAoSgCVworw-Kf9KGj0HMLeGL4bNQurM",
    authDomain: "arguai-af646.firebaseapp.com",
    projectId: "arguai-af646",
    storageBucket: "arguai-af646.appspot.com",
    messagingSenderId: "947148877069",
    appId: "1:947148877069:web:9e244239eb5c0a38b3d444",
    measurementId: "G-WKNT9QEBXH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);
export default app