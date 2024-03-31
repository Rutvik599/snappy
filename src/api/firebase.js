const firebase = require("firebase/app");
require("firebase/database");

const firebaseConfig = {
    apiKey: "AIzaSyDDkePY0ED_CE-icYTI4Sz_i9s1CRbkDWA",
    authDomain: "snappy-website-1f783.firebaseapp.com",
    projectId: "snappy-website-1f783",
    storageBucket: "snappy-website-1f783.appspot.com",
    messagingSenderId: "5961176894",
    appId: "1:5961176894:web:808639bc287cf2e34dfe6f",
    measurementId: "G-GQLJSHTNRC"
  };

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Prepare the data
const userData = {
  name: "Rutvik PAtel",
  age: 21
};

// Insert data into the database
database.ref('users').push(userData);
