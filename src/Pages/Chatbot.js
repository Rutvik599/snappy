import React, { useEffect, useRef, useState } from "react";
import "../style/Chatbot.css";
import { useNavigate, useParams } from "react-router-dom";
import { BookCheck, Clipboard, Croissant } from "lucide-react";
import getCustomerDetail from "../api/getcustomer.js";
function Chatbot() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const { chatid } = useParams();
  const [chatHistory, setChatHistory] = useState([]);
  const [custName, setName] = useState("");
  const [custId, setCustId] = useState("");
  const [isCopied, setIscopied] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const responseRef = useRef(null);

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
      return navigate("/login");
    } else {
      fetchCustomerData(userIdCookieValue);
    }
  }, []);
  useEffect(() => {
    if (custId && chatid) { 
      fetchChatHistory();
    }
  }, [custId, chatid]);

  useEffect(() => {
    if (responseRef.current) {
      const scrollHeight = responseRef.current.scrollHeight;
      const scrollTop = responseRef.current.scrollTop;
      const clientHeight = responseRef.current.clientHeight;
      const scrollDistance = scrollHeight - scrollTop - clientHeight;

      responseRef.current.style.transition = 'scroll 0.5s ease-in-out'; 

      if (scrollDistance > 50) {
        responseRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      } else { 
        responseRef.current.scrollTop = scrollHeight;
      }
      const removeTransition = () => {
        responseRef.current.style.transition = '';
        responseRef.current.removeEventListener('transitionend', removeTransition);
      };

      responseRef.current.addEventListener('transitionend', removeTransition);
    }
  }, [chatHistory]);

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
    setCustId(extractedData[0]?.custId);
    if (data && data.verificationStatus) {
      const cust = data.cust[0];
      setName(cust.custName);
      setCustId(cust.custId);
    }
  };

  const fetchChatHistory = async () => {
    if (!custId || !chatid) {
      console.error("userId or chatId is missing");
      return;
    }
    try {
      const response = await fetch("http://localhost:3939/getChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: custId,
          chatId: chatid,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const formattedChatHistory = data.chatHistory.map((item) => ({
        user: item.userPrompt,
        bot: item.result,
      }));
      setChatHistory(formattedChatHistory);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };


  const handlePrompt = () => {
    setisLoading(true);
    try {
      fetch("http://localhost:3939/getchatResult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrompt: prompt,
          uuid: chatid,
          userid: custId,
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
          data = Object.values(data);
          console.log(data[0]);
          if (data[0]) {
            const botResponse = data[1];
            const formattedResponse = botResponse.replace(
              /\*\*(.*?)\*\*/g,
              "<b>$1</b>"
            );
            const finalResponse = formattedResponse.replace(/\n/g, "<br>");
            setChatHistory((prevChatHistory) => [
              ...prevChatHistory,
              { user: prompt, bot: finalResponse },
            ]);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        }).finally(()=>{
          setisLoading(false);
        });
    } catch (error) {
      console.log(error.message);
    }
    
    setPrompt("");
  };

  const handleCopy = (htmlText) => {
    // Create a temporary element to hold the HTML-formatted text
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlText;

    // Convert the HTML-formatted text to plain text
    const plainText = tempElement.innerText;

    // Copy the plain text to the clipboard
    navigator.clipboard
      .writeText(plainText)
      .then(() => {
        console.log("Text copied to clipboard:", plainText);
        setIscopied(true); // Set isCopied to true
        setTimeout(() => {
          setIscopied(false); // Reset isCopied to false after 2 seconds
        }, 2000);
      })
      .catch((error) => {
        console.error("Error copying text to clipboard:", error);
      })
      .finally(() => {
        // Remove the temporary element from the DOM
        tempElement.remove();
      });
  };

  return (
    <div className="chatbotdiv">
      <div className="mainchat">
        {/*
        <div className="chathistory"></div> */}
        <div className="response" ref={responseRef}>
          {chatHistory.map((item, index) => (
            <div key={index}>
              <div className="user">
                <b>{custName}: </b> {item.user}
              </div>
              <div className="chatbot1">
                <b>Chatbot:</b>
                <br />
                <span dangerouslySetInnerHTML={{ __html: item.bot }} />
                <br />
                {!isCopied ? (
                  <Clipboard
                    size={20}
                    style={{ margin: "10px" }}
                    onClick={() => handleCopy(item.bot)}
                  />
                ) : (
                  <BookCheck size={20} style={{ margin: "10px" }} />
                )}
              </div>
              <div className="divider"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="chatinput">
        <input
          type="text"
          className="chatinputfield"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Find your Delicious Recipe.."
        />
        {!isLoading ? (
          <button className="chatinputbutton" onClick={handlePrompt}>
            {" "}
            <Croissant style={{ marginRight: "5px" }} /> Generate
          </button>
        ) : (
          <div className="loading"></div>
        )}
      </div>
    </div>
  );
}

export default Chatbot;
