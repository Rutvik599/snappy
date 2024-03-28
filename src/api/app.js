require("dotenv").config();
// API for pincode https://api.postalpincode.in/pincode/384002
// Source http://www.postalpincode.in/Api-Details
var express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
var app = express();
var bodyparser = require("body-parser");
app.use(cors());
app.use(bodyparser.json());

// MySQL connection configuration
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "snappy",
});

const accountSid = "ACca10709697dea185fa57ec0b59c2e148";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VAeba667e53bade27834e8976099bba92b";
const client = require("twilio")(accountSid, authToken);
var OTP = "";
var mobileNumber = "";
var userOTP = "";
var userResult = "";
var alreadycustomer = false;
var uuid = "";
const generate_otp = () => {
  let temp = "";
  for (let index = 0; index < 4; index++) {
    temp += Math.floor(Math.random() * 10);
  }
  return temp;
};

app.post("/verifyOTP", (req, res) => {
  userOTP = req.body.InputOTP;

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

const finduser = (mobileNumber, callback) => {
  // Select all data from the customer_profile table
  const selectQuery = `SELECT * FROM customer_profile where custPhoneNumber = '${mobileNumber}'`;
  
  connection.query(selectQuery, (err, results, fields) => {
    userResult = results
    if (err) {
      console.error("Error retrieving data: ", err);
      callback(err, null);
      return;
    }
    callback(null, results);
  });
};

app.post("/sendOtp", (req, res) => {
  mobileNumber = req.body.MobileNumber;
  OTP = generate_otp();

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

    // Here Also Check and return if user is alredy customer or not
    finduser(mobileNumber, (err, userResult) => {
      if (err) {
        console.error("Error finding user: ", err);
        return res
          .status(500)
          .json({ error: err.message, verficationStatus: false });
      }

      if (userResult && userResult.length > 0) {
        userResult = userResult
        console.log("User is alredy customer",userResult[0].custId);
        uuid = userResult[0].custId;
      } else {
        uuid = uuidv4();
      }

      res.status(200).json({ verficationStatus: true });
    });
  } catch (error) {
    console.log("Error ! ");
    res.status(500).json({ error: error.message, verficationStatus: false });
  }
});

app.post("/register/user", (req, res) => {
  // This API Store the User Name and Password

  // Data to be inserted
  const data = {
    custId: uuid,
    custName: req.body.custName,
    custAddress: req.body.custAddress,
    custPhoneNumber: mobileNumber,
  };

  const insertQuery = "INSERT INTO customer_profile SET ?";
  connection.query(insertQuery, data, (err, results) => {
    if (err) {
      console.error("Error inserting data: ", err);
      return res
        .status(500)
        .json({ error: err.message, verficationStatus: false });
    }
    console.log("Data inserted successfully");
    res.status(200).json({ verficationStatus: true, custId: uuid,cust:data});
  });
});

app.post('/getuserdetail',(req,res)=>{
  const customerId = req.body.custId;
  console.log("home page customer id",customerId);
  try {
    const selectQuery =  `SELECT * FROM customer_profile where custId = '${customerId}'`;
    connection.query(selectQuery, (err, results, fields) => {
      userResult = results
      if (err) {
        console.error("Error retrieving data: ", err);
        callback(err, null);
        return;
      }
      console.log("result is ",results);
      res.status(200).json({ verficationStatus: true,cust: results});
    });
  } catch (error) {
    console.log(`151 app.js Error Message ${error.message}`);
    res.status(200).json({ verficationStatus: true, cust:undefined});
  }


})
app.listen(3939, () => {
  console.log("Server is Listenning on port number 3939");
});
