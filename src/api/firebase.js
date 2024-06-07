import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDDkePY0ED_CE-icYTI4Sz_i9s1CRbkDWA",
    authDomain: "snappy-website-1f783.firebaseapp.com",
    projectId: "snappy-website-1f783",
    storageBucket: "snappy-website-1f783.appspot.com",
    messagingSenderId: "5961176894",
    appId: "1:5961176894:web:808639bc287cf2e34dfe6f",
    measurementId: "G-GQLJSHTNRC"
  };

  const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  
  export { app, auth, firestore };
