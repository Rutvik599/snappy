import React, { useEffect, useRef, useState } from "react";
import "../style/Header.css";
import {
  ChevronDown,
  MapPin,
  MessageSquare,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import getCustomerDetail from "F:/Practical/snappy/src/api/getcustomer.js";
import logo from "../Products-Images/snappy.png";
import { toggleLoginStatus } from "../api/islogin";
import { useNavigate } from "react-router-dom";
import AlertBox from "./Alertbox";

export default function Header() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setaddress] = useState("");
  const [searchText, setSearchText] = useState("Search 'Rice'");
  const wordsArray = ["Bread", "Vegetables", "Fruits", "Spices", "Rice"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [searchitem, setSearchitem] = useState("");
  const fetchCustomerData = async (custId) => {
    const data = await getCustomerDetail(custId);
    const extractedData = data.cust.map(
      ({ custId, custName, custAddress, custPhoneNumber }) => ({
        custId,
        custName,
        custAddress,
        custPhoneNumber,
      })
    );
    setName(extractedData[0]?.custName);
    setaddress(extractedData[0]?.custAddress);
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
        fetchCustomerData(cookieValue);
        break;
      }
    }
    if (!userIdCookieValue) {
      toggleLoginStatus();
      return navigate("/login");
    } else {
      fetchCustomerData(userIdCookieValue);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update the search text with the next word
      setSearchText(`Search '${wordsArray[currentIndex]}'`);

      // Update the current index to the next index in the array
      setCurrentIndex((prevIndex) => (prevIndex + 1) % wordsArray.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, wordsArray]);

  const searchcategory = () => {
    // Convert input to lowercase
    const lowercaseInput = searchitem.toLowerCase();
    setSearchitem("");
    // Define regular expressions for different categories
    const combinedRegex =
      /\b(fruit|fruits|apple|banana|grapes|orange|apples|bananas|oranges|vegetable|vegetables|tomatos|tomatoes|tomato|carrot|carrots|carrat|spinach|spinachs|palak|broccoli|tamatar|gajar|dairy|milk|cheese|yogurt|curd|butter|dudh|dahi|ghee|makhhan|grocery|groc|nuts|nut|almonds|almond|badam|cashew|kaju|hazelnuts|hazelnut|makhana|pecan|peacans)\b/i;

    if (combinedRegex.test(lowercaseInput)) {
      return navigate(`searchResult/${lowercaseInput}`);
    } else {
      return navigate("category/allcategories"); // No category matched
    }
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const showalert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  return (
    <>
      {showAlert && (
        <AlertBox
          message="Sorry, we're out of service"
          onClose={handleCloseAlert}
          warning={true}
        />
      )}
      <div className="mainheader">
        <div className="fontpart">
          <img
            src={logo}
            alt=""
            className="headerlogo"
            onClick={() => navigate('/')}
          />
          <div className="location">
            <MapPin size={15} /> <span className="locationtext">{address}</span>
            <ChevronDown size={15} />
          </div>
          <button className="searchbutton">
            <Search size={20} />
            <span className="searchtext">
              <input
                type="text"
                placeholder={searchText}
                value={searchitem}
                onChange={(e) => setSearchitem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") searchcategory();
                }}
              />
            </span>
          </button>
        </div>
        <div className="sidebar">
          <button className="chatbot" onClick={showalert}>
            <MessageSquare size={20} />{" "}
            <span className="chatbottext">Chatbot</span>
          </button>

          <button className="cart">
            <ShoppingCart size={20} />{" "}
            <span className="carttext" onClick={showalert}>
              Cart
            </span>
          </button>

          <div className="separator"></div>
          <button className="userbutton" onClick={showalert}>
            {name.charAt(0)}
          </button>
        </div>
      </div>
    </>
  );
}
