import React, { useEffect, useState } from "react";
import "../style/Cart.css";
import { useNavigate, useParams } from "react-router-dom";
import { products } from "../utils/products";
import { ArrowLeft } from "lucide-react";
import { Elements } from '@stripe/react-stripe-js';
import Checkoutform from "../Component/Checkoutform.jsx";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  "pk_test_51PP1h8RuEUCS1SjObg5wILA0zURiMR3NCTHf23Jcc8b7SRRfjJZWqHgqbfrsSIWocICTm6XrGWcd4mk42krwBUBH00Uh4omSvN"
);

function Cart() {
  const { cartid } = useParams();
  const [cartData, setCartData] = useState([]);
  const [cartProductsAllData, setCartProductData] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [isCart,setisCart] = useState(true);
  const [clientSecret,setClientSecret] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if(totalBill){
        fetch("http://localhost:3939/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ totalBill: totalBill})
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => setClientSecret(data.clientSecret))
        .catch(error => console.error("Error:", error));
      }
}, [totalBill]);

const appearance = {
  theme : "stripe",
  variables:{
      fontFamily:"Helvetica"
  },
  rules:{
      '.Input':{
          outline:'none'
      },
      '.Input:focus': {
          boxShadow: 'none',
        },
        '.Label':{
          fontSize:'medium',
        }
  }
}

const options = {
  clientSecret,
  appearance
}

  const getCartDetail = () => {
    const cookies = document.cookie.split(";");

    let userId = null;
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === "userid") {
        userId = cookieValue;
        break;
      }
    }

    if (userId) {
      const cartCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("cart=")
      );
      if (cartCookie) {
        const cartCookieValue = cartCookie.split("=")[1];
        const parsedCartData = JSON.parse(decodeURIComponent(cartCookieValue));
        const userCartData = parsedCartData[userId] || [];
        const formattedCartData = Object.entries(userCartData).map(
          ([productId, weight]) => ({
            productId,
            weight,
          })
        );
        return formattedCartData;
      }
    }
    return [];
  };

  useEffect(() => {
    const userCartDetails = getCartDetail();
    setCartData(userCartDetails);

    const filteredProducts = userCartDetails
      .map((cartItem) => {
        const productCategory = products.find((category) =>
          category.items.some((item) => item.id == cartItem.productId)
        );

        if (productCategory) {
          return productCategory.items.find(
            (item) => item.id == cartItem.productId
          );
        } else {
          console.error(
            "Category not found for productId:",
            cartItem.productId
          );
          return null;
        }
      })
      .filter((product) => product !== null);

    setCartProductData(filteredProducts);
  }, []);

  useEffect(() => {
    countTotal();
  }, [cartData, cartProductsAllData]);

  const countTotal = () => {
    if (cartData.length > 0 && cartProductsAllData.length > 0) {
      let total = 0;

      cartProductsAllData.forEach((item, index) => {
        const itemWeight = parseFloat(cartData[index].weight);
        const itemPrice = item.price;
        total += itemWeight * itemPrice;
      });

      setTotalBill(total);
    }
  }

  const toggleCart = ()=>{
    setisCart(!isCart);
  }

  if (cartData.length === 0 || cartProductsAllData.length === 0) {
    return (
      <div className="chatbotdiv">
        <h1 className="purchasenow">Your Cart is empty</h1>
        <button className="backbuttoncart" onClick={() => navigate(-1)}>Purchase Now </button>
      </div>
    );
  }

  return (
   <div className="chatbotdiv">
    {isCart ? (
        <>
          <h1 className="cartTag">Cart</h1>
          <div className="cartProductmain">
            {cartProductsAllData.map((item, index) => (
              <div key={index} className="cartProduct">
                <img src={item.img} alt="" />
                <div className="detail">
                  <h1 className="productName">{item.name}</h1>
                  <h2 className="totalWeight">Total weight : {cartData[index].weight}</h2>
                  <h2 className="totalWeight">Price : Rs.{parseFloat(cartData[index].weight) * item.price}.00</h2>
                </div>
              </div>
            ))}
          </div>
          <div className="buttoncart">
            <button className="backbuttoncart" onClick={() => navigate(-1)}>
              <ArrowLeft style={{ marginRight: '10px' }} /> Back
            </button>
            <h3 className="totalBill">Total Bill : Rs.{totalBill}.00</h3>
            <button className="buttonPay" onClick={() => toggleCart()}>Proceed to Pay</button>
          </div>
        </>
      ) : (
        clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <Checkoutform totalBill={totalBill} userId={cartid} toggleCart={toggleCart} cartData={cartData}/>
          </Elements>
        )
      )}
   </div>
  );
}

export default Cart;
