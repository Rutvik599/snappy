import React, { useEffect, useState } from "react";
import "../style/Header.css";
import logo from "F:/Practical/snappy/src/Products-Images/snappy.png";
import { MapPin, Search } from "lucide-react";
import getCustomerDetail from "F:/Practical/snappy/src/api/getcustomer.js";
import { getValue } from "../api/islogin";
export default function Header(props) {
    const value = getValue();
  const [name, setName] = useState("");
  const [address, setaddress] = useState("");

  const fetchCustomerData = async (custId) => {
    const data = await getCustomerDetail(custId); // Replace "123" with the actual custId
    const extractedData = data.cust.map(({ custId, custName, custAddress, custPhoneNumber }) => ({
        custId,
        custName,
        custAddress,
        custPhoneNumber
      }));
      console.log(extractedData[0].custAddress);
      setName(extractedData[0].custName);
      setaddress(extractedData[0].custAddress);
    if (data && data.verificationStatus) {
      const cust = data.cust[0]; // Assuming the response contains an array of customers
      setName(cust.custName);
      setaddress(cust.custAddress);
      console.log(address);
    }
  };

  useEffect(() => {
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
      //toggleLoginStatus();
    } else {
      fetchCustomerData(userIdCookieValue);
      console.log(userIdCookieValue);
    }
  }, []);
 
  return (
    <>
      <div className="mainheader">
        <img src={logo} alt="" className="headerlogo" />
        <div className="location">
          <MapPin size={15}/>
          {address}
        </div>
        <button>
            <Search size={20}/> Search "Rice"
        </button>
      </div>
    </>
  );
}
