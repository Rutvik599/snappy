import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";
import '@radix-ui/themes/styles.css';
import { toggleLoginStatus, setCust } from "./api/islogin";

function App() {
  const [name, setName] = useState("");
  const [custName,setcustName] = useState("");
  const [custAddress,setcustAddress] = useState("");
 /* useEffect(() => {
    const cookies = document.cookie.split(";");
    let userIdCookieValue = null;
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === "userid") {
        userIdCookieValue = cookieValue;
        break;
      }
    }
    if (!userIdCookieValue) {
      toggleLoginStatus();
    } else {
      setName(userIdCookieValue);
    }
  }, []);

  useEffect(() => {
    if (name) {
      getUservalue(name);
    }
  }, [name]);

  const getUservalue = (name) => {
    try {
      fetch("http://192.168.1.34:3939/getuserdetail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          custId: name,
        }),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.verficationStatus) {
    const extractedData = data.cust.map(({ custId, custName, custAddress, custPhoneNumber }) => ({
        custId,
        custName,
        custAddress,
        custPhoneNumber
      }));
         setCust(extractedData[0]);
          setcustName(extractedData[0].custName);
          setcustAddress(extractedData[0].custAddress);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  */
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage name={custName} address={custAddress}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
