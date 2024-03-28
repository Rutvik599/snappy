import React, { useEffect, useState } from "react";
import "../style/Header.css";
import logo from "F:/Practical/snappy/src/Products-Images/snappy.png";
import { MapPin } from "lucide-react";
import getCustomerDetail from "F:/Practical/snappy/src/api/getcustomer.js";
export default function Header(props) {
  const [name, setName] = useState(props.name);
  const [address, setaddress] = useState(props.address);

  const fetchCustomerData = async (custId) => {
    const data = await getCustomerDetail(custId); // Replace "123" with the actual custId
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
          <MapPin />
          {address}
        </div>
      </div>
    </>
  );
}
