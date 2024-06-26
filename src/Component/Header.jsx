import React, { useEffect, useRef, useState } from "react";
import "../style/Header.css";
import { v4 as uuidv4 } from 'uuid';
import {
  ChevronDown,
  LogOut,
  MapPin,
  MessageSquare,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import getCustomerDetail from "../api/getcustomer.js";
import { products } from "../utils/products.js";
import logo from "../Products-Images/snappy.png";
import { toggleLoginStatus,setCust, setCustId, getCustInfo} from "../api/islogin";
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
  const [userId,setuserId] = useState(''); 
  const [showProfile,setshowProfile] = useState(false);
  const [mobilenumber,setMobilenumber] = useState('');
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
    setuserId(extractedData[0]?.custId);
    setMobilenumber(extractedData[0]?.custPhoneNumber);
    if (data && data.verificationStatus) {
      const cust = data.cust[0]; 
      setName(cust.custName);
      setaddress(cust.custAddress);
      setuserId(cust.custId);
      setMobilenumber(cust.custPhoneNumber);
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

  const gotoChatCart = (url)=>{
    if(url === 1){
      const chatid = uuidv4();
      navigate(`feature/chatbot/${chatid}`);
    }
    if(url === 2 && userId){
      navigate(`feature/cart/${userId}`);
    }

    if(url === 3 && userId){
      navigate(`feature/myorders/${userId}`);
    }
  }
  const filteredProductNames =
    searchitem.trim() === ""
      ? []
      : products.flatMap((category) =>
          category.items
            .filter((item) =>
              item.name.toLowerCase().includes(searchitem.toLowerCase())
            )
            .map((item) => item.name)
        );
  const searchproduct = (str) =>{
    navigate(`searchResult/${str}`);
    setSearchitem("");
  }

  const logoutUser = () => {
    const cookies = document.cookie.split(";").map(cookie => cookie.trim());
    cookies.forEach(cookie => {
      const [cookieName] = cookie.split("=");
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  
   navigate('/login');
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
            onClick={() => navigate("/")}
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
          {searchitem.trim() !== "" && (
            <div className="searchsuggetion">
              {filteredProductNames &&
                filteredProductNames.map((productName, index) => (
                  <li key={index} className="searchsuggestionitem" onClick={()=>searchproduct(productName)}>
                    {productName}
                  </li>
                ))}
            </div>
          )}
        </div>
        <div className="sidebar">
          <button className="chatbot" onClick={()=>gotoChatCart(1)}>
            <MessageSquare size={20} />{" "}
            <span className="chatbottext">Chatbot</span>
          </button>

          <button className="cart" onClick={()=>gotoChatCart(2)}>
            <ShoppingCart size={20} />{" "}
            <span className="carttext">
              Cart
            </span>
          </button>

          <div className="separator"></div>
          <button className="userbutton" onClick={()=>setshowProfile(!showProfile)} title={name}>
            {name.charAt(0)}
          </button>
        </div>
      </div>
      {showProfile && <div className="profile-container">
      <button className="close-button" onClick={()=>setshowProfile(!showProfile)}>
        <X size={24} />
      </button>
      <div className="showProfile">
        <h1 className="name">{name}</h1>
        <h3 className="mobilenumber">{mobilenumber}</h3>
        <div className="divider1"></div>
        <h2 className="h2tag" onClick={()=>gotoChatCart(3)}>My Orders</h2>
        <h2 className="h2tag">Wishlist</h2>
        <h2 className="h2tag">Saved Address</h2>
        <h2 className="h2tag">Customer Support</h2>
        <h2 className="logout" onClick={()=>{logoutUser()}}>Log out <LogOut style={{marginLeft:'5px'}} size={15}/></h2>
      </div>
    </div>}
    </>
  );
}
