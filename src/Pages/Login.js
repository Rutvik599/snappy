import React, { useEffect, useState } from "react";
import "../style/Login.css"; // Import CSS file with corrected path
import { useNavigate } from "react-router-dom";
import { isLogin, toggleLoginStatus,setCust} from "../api/islogin";
import logo from "F:/Practical/snappy/src/Products-Images/logo.png"
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OtpInput from "react-otp-input";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

function Login() {
  const navigate = useNavigate();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showmobilenumber, setmobilenumber] = useState(true);
  const [phone, setphone] = useState();
  const [name, setName] = useState();
  const [pincode, setPincode] = useState();
  const [city, setCity] = useState("");
  const [isuserverified, setVerification] = useState(false);
  const [alertText, setalertText] = useState("");
const [custId,setCustId] = useState("");

  let debounceTimer;
  // OTP Part Start
  const [otp, setOtp] = useState("");
  useEffect(() => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "userid" && value) {
        toggleLoginStatus();
        return navigate("/");
      }
    }
  }, []);

  const handleGenerateOTP = async (e) => {
    e.preventDefault();

    try {
      fetch("http://localhost:3939/sendOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ MobileNumber: "+" + phone }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Handle the response data here
          console.log(data.verficationStatus);
          if (data.verficationStatus) {
            handleVerifyOTP();
          } else {
            setalertText("OTP has Not Sent !");
            showAlert(false);
          }
        })
        .catch((error) => {
          // Handle errors
          console.error("Error fetching data:", error);
        });

      setmobilenumber(false);
      setShowOtpForm(true);
    } catch (error) {
      console.log(error.message);
    }
  };
  const showmobilenumberform = (e) => {
    e.preventDefault();
    setShowOtpForm(false);
    setmobilenumber(true);
  };

  // handling OTP submit form
  const handleVerifyOTP = (e) => {
    e.preventDefault();

    try {
      fetch("http://localhost:3939/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ InputOTP:otp }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Handle the response data here
          console.log(data.verficationStatus);
          if (data.verficationStatus) {
            console.log(data);
            setCust(data.custId);
            if (data.alreadyCust) {
              setCustId(data.custId);
              setCookie("userid", data.custId, 7);
              return navigate("/");
            } else {
              setVerification(true);
              setShowOtpForm(false);
              setalertText("OTP Verified Successfull !");
              showAlert(true);
            }
          } else {
            setalertText("OTP is Not Valid !");
            showAlert(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Searching City by their Pincode API Call
  const searchCity = async (value) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${value}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const cityFromResponse = data[0]?.PostOffice?.[0]?.District;
      const Status = data[0]?.Status;
      if (Status === "Success") {
        setCity(cityFromResponse || "City not found");
      } else {
        setCity("");
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setPincode(value);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchCity(value);
    }, 100); // Adjust the debounce time (milliseconds) as needed
  };

  // Register the User with its name and address
  const gotohomepage = async (e) => {
    e.preventDefault();
    const address = `${city}, ${pincode}`;
    if (city && pincode) {
      
    
    try {
      fetch("http://localhost:3939/register/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          custName: name,
          custAddress: address,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Handle the response data here
          console.log(data.verficationStatus);
          if (data.verficationStatus && data.custId) {
            setCust(data.cust);
            const userId = data.custId;
            setCookie("userid", userId, 7);
            setVerification(true);
            setShowOtpForm(false);
            setalertText("Registration Successfull!");
            showAlert(true);
            toggleLoginStatus();
            navigate("/");
          } else {
            console.log("194.Login.js ",data.verficationStatus);
            setalertText("Error in login !");
            showAlert(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.log(error.message);
    }
  }
  };

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function showAlert(isPositive) {
    var alertBox = document.getElementById("customAlert");
    if (isPositive) {
      alertBox.classList.toggle("show"); // Add the 'show' class
    }
    alertBox.style.display = "block";
    setTimeout(function () {
      alertBox.style.display = "none";
    }, 2000);
  }

  function closeAlert() {
    var alertBox = document.getElementById("customAlert");
    alertBox.classList.toggle("show"); // Remove the 'show' class
    alertBox.style.display = "none";
  }

  if (isLogin) {
    return navigate("/");
  }

  return (
    <div className="login-container">
      <div id="customAlert" class="alert">
        <span class="closebtn" onClick={closeAlert}>
          &times;
        </span>
        <strong>{alertText}</strong>
      </div>
      {showmobilenumber && (
        <form className="login-form" onSubmit={handleGenerateOTP}>
          <div className="logo">
            <img src={logo} alt="Logo Can't Loaded" />
          </div>
          <div className="tag">
            <h2 className="tag-h2">Login / SignUp</h2>
          </div>
          <div className="inputfields">
            <h2 className="mobiletext">Mobile number</h2>
            <div className="mobileinput">
              <PhoneInput
                containerClass="custom-phone-input"
                country={"in"}
                value={phone}
                placeholder="Enter Your Mobile Number"
                onChange={(phone) => setphone(phone)}
              />
            </div>
          </div>
          <div className="submitbutton">
            <button type="submit" className="submit">
              Generate OTP
            </button>
          </div>
        </form>
      )}
      {showOtpForm && (
        <form className="login-form" onSubmit={handleVerifyOTP}>
          <div className="logo1">
            <button className="backbutton" onClick={showmobilenumberform}>
              <ArrowLeftIcon />
            </button>
            <img src={logo} alt="Logo Can't Loaded" className="logoimage" />
          </div>
          <div className="tag">
            <h2 className="tag-h2">OTP Verification</h2>
          </div>
          <div className="inputfields">
            <h2 className="mobiletext">OTP</h2>
            <div className="otpinput">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderInput={(props, index) => (
                  <input
                    {...props}
                    className="otp-input"
                    style={{ height: "50px", width: "50px" }}
                    key={index}
                  />
                )}
              />
            </div>
          </div>
          <div className="submitbutton">
            <button type="submit" className="submit">
              Verify OTP
            </button>
          </div>
        </form>
      )}

      {isuserverified && (
        <form className="login-form" onSubmit={gotohomepage}>
          <div className="logo">
            <img src={logo} alt="Logo Can't Loaded" />
          </div>
          <div className="inputfields" id="inputid">
            <h2 className="mobiletext">Name</h2>
            <input
              value={name}
              type="text"
              className="name-address"
              placeholder="Enter Your Name"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="inputfields" id="inputid">
            <h2 className="mobiletext">Address</h2>
            <input
              value={pincode}
              type="text"
              className="name-address"
              placeholder={"Enter Your Address (In Pincode)"}
              onChange={handleInputChange}
            />
            <h3 className="address">
              {pincode ? city : null} {city ? pincode : null}
            </h3>
          </div>
          <div className="submitbutton" id="submitbutton">
            <button type="submit" className="submit">
              Continue
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
