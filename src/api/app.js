const express = require("express");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, setDoc, doc, query, where } = require("firebase/firestore/lite");
const cors = require("cors");
const bodyparser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3939;
app.use(cors());
app.use(bodyparser.json());
var OTP = "";
var mobileNumber = "";
var userOTP;
var userResult;
var alreadycustomer = false;
var uuid = "";
const accountSid = "ACca10709697dea185fa57ec0b59c2e148";
const authToken = "2ab1c2cef068f3e812de4e2e37168db5";
const client = require("twilio")(accountSid, authToken);

const firebaseConfig = {
  apiKey: "AIzaSyDDkePY0ED_CE-icYTI4Sz_i9s1CRbkDWA",
  authDomain: "snappy-website-1f783.firebaseapp.com",
  projectId: "snappy-website-1f783",
  storageBucket: "snappy-website-1f783.appspot.com",
  messagingSenderId: "5961176894",
  appId: "1:5961176894:web:808639bc287cf2e34dfe6f",
  measurementId: "G-GQLJSHTNRC"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Define finduser function
const finduser = (mobileNumber, callback) => {
  const usersRef = collection(db, "customer_profiles");
  const queryRef = query(usersRef, where("custPhoneNumber", "==", mobileNumber));

  getDocs(queryRef)
    .then((querySnapshot) => {
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      userResult = results.length > 0 ? results[0] : null;
      callback(null, results);
    })
    .catch((err) => {
      console.error("Error retrieving data: ", err);
      callback(err, null);
    });
};

// Define Express routes
app.use(express.json());
const generate_otp = () => {
  let temp = "";
  for (let index = 0; index < 4; index++) {
    temp += Math.floor(Math.random() * 10);
  }
  return temp;
};
app.post("/sendOtp", (req, res) => {
   mobileNumber = req.body.MobileNumber;
   OTP = generate_otp(); // Define generate_otp function

  try {
    console.log(
      `/sendOTP api and The OTP has been sent is ${OTP} on ${mobileNumber}`
    );
    client.messages
    .create({
      body: `\nWelcome to Snappy:A Complete Grocery Store\nYour Verification Code is ${OTP} `,
      from: "+19412567246",
      to: mobileNumber,
    })
    .then((message) => console.log(message.sid)); 
  
    finduser(mobileNumber, (err, userResult) => {
      if (err) {
        console.error("Error finding user: ", err);
        return res.status(500).json({ error: err.message, verificationStatus: false });
      }

      if (userResult && userResult.length > 0) {
        console.log("User is already a customer", userResult[0].custId);
        uuid = userResult[0].custId;
      } else {
        uuid = uuidv4(); // Define uuidv4 function
      }

      res.status(200).json({ verificationStatus: true });
    });
  } catch (error) {
    console.log("Error ! ",error);
    res.status(500).json({ error: error.message, verificationStatus: false });
  }
});

app.post("/verifyOTP", (req, res) => {
  userOTP = req.body.InputOTP;
  console.log("UserResult",userResult);
  try {
    if (userOTP == OTP) {
      if (userResult) {
        alreadycustomer = true;
      } else {
        alreadycustomer = false;
      }
      res.status(200).json({
        verficationStatus: true,
        alreadyCust: alreadycustomer,
        custId: uuid,
        user:userResult
      });
    } else {
      console.log(`Input OTP : ${userOTP} and sent OTP : ${OTP}`);
      res
        .status(500)
        .json({ verficationStatus: false, alreadyCust: false, custId: false });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/register/user", (req, res) => {
  const data = {
    custId: uuidv4(), // Define uuidv4 function
    custName: req.body.custName,
    custAddress: req.body.custAddress,
    custPhoneNumber: mobileNumber,
  };

  const usersRef = collection(db, "customer_profiles");
  const docRef = doc(usersRef); 
  setDoc(docRef, data)
    .then(() => {
      console.log("Data inserted successfully");
      res.status(200).json({ verificationStatus: true, custId: data.custId, cust: data });
    })
    .catch((err) => {
      console.error("Error inserting data: ", err);
      res.status(500).json({ error: err.message, verificationStatus: false });
    });
});
app.post('/getuserdetail', async (req, res) => {
  const customerId = req.body.custId;
  try {
    const usersRef = collection(db, "customer_profiles");
    const queryRef = query(usersRef, where("custId", "==", customerId));

    const querySnapshot = await getDocs(queryRef);
    if (querySnapshot.empty) {
      console.log("No matching documents.");
      res.status(404).json({ verficationStatus: false, cust: undefined });
      return;
    }

    const results = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });
    res.status(200).json({ verficationStatus: true, cust: results });
  } catch (error) {
    console.error("Error retrieving data: ", error);
    res.status(500).json({ verficationStatus: false, cust: undefined });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
