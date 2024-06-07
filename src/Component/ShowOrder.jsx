import React, { useState, useEffect } from "react";
import "../style/ShowOrder.css";
import { useParams } from "react-router-dom";
export default function ShowOrder() {
  const { userId } = useParams();
  const [myorders, setMyOrders] = useState(null);

  const getCart = async () => {
    try {
      const data = {
        userId: userId,
      };
      const response = await fetch("http://localhost:3939/getCartData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log(responseData.cartData);
      setMyOrders(responseData.cartData);
    } catch (error) {
      console.error("Error storing cart data:", error);
      alert("Failed to store cart data. Please try again.");
    }
  };
  useEffect(() => {
    getCart();
  }, []);

  if (!myorders) {
    return <div className="chatbotdiv">"You haven't ordered yet</div>;
  }

  return (
    <div className="chatbotdiv">
      <h1 className="cardTag">My Orders</h1>
      {Object.keys(myorders).map((key, index) => (
        <div key={index} className="mainOrderDiv">
          <h1>
            Order Id : <kbd>{myorders[key].cartId}</kbd>
          </h1>
          <h2>OrderDate : <kbd>{myorders[key].date}</kbd></h2>
          {myorders[key].cartDetail?.map((item, itemIndex) => (
            <div key={itemIndex} className="inOrder">
              <h2>Product ID: <kbd>{item.productId}</kbd></h2>
              <h2>Weight : <kbd>{item.weight}</kbd></h2>
            </div>
          ))}
          <div className="divider"></div>
          <h2>
            Total bill : <kbd>Rs.{myorders[key].totalBill}.00</kbd>
          </h2>
        </div>
      ))}
    </div>
  );
}
