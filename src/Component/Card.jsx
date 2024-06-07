import React, { useEffect, useRef, useState } from "react";
import "../style/Card.css";
import { ChevronDown, ChevronUp, IndianRupee, Minus, Plus, ShoppingCartIcon, Star } from "lucide-react";

export default function Card(props) {
  const name = props.product.name;
  const price = props.product.price;
  const unit = props.product.unit;
  const review = props.product.reviews;
  const image = props.product.img;
  const quantity = props.product.quantity;
  const userId = props.userId;
  const productId = props.product.id ? props.product.id : 0;

  const [isOpen, setIsOpen] = useState(false);
  const [currentCart, setCurrentCart] = useState(null);
  const [activePrice, setActivePrice] = useState(price);
  const [activeUnit, setActiveUnit] = useState(`${quantity}${unit}`);
  const [quantityCount, setQuantityCount] = useState(0); 
  const [firstQuantitycount,setFirstQunatityCount] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (props.cartData && props.cartData.length > 0) {
      const cartItem = props.cartData.find((item) => parseInt(item.productId) === productId);
      if (cartItem) {
        setCurrentCart(cartItem);
        const parsedUnit = parseUnit(cartItem.weight);
        setQuantityCount(parsedUnit.quantity);
        if(firstQuantitycount === 0){
          setFirstQunatityCount(parsedUnit.quantity);
        }
        if (parsedUnit) {
          setActiveUnit(`${parsedUnit.quantity}${parsedUnit.unit}`);
        }
      }
    }
  }, [props.cartData, productId]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeActive = (changePrice, changeUnit) => {
    setActivePrice(changePrice * parseUnit(changeUnit).quantity);
    setActiveUnit(changeUnit);
    setIsOpen(false);
  };

  const parseUnit = (unit) => {
    const match = unit.match(/(\d*\.?\d+)([a-zA-Z]+)/);
    return match ? { quantity: parseFloat(match[1]), unit: match[2] } : null;
  };

  const addUnits = (unit1, unit2) => {
    const parsedUnit1 = parseUnit(unit1);
    const parsedUnit2 = parseUnit(unit2);

    if (parsedUnit1 && parsedUnit2 && parsedUnit1.unit === parsedUnit2.unit) {
      return `${parsedUnit1.quantity + parsedUnit2.quantity}${parsedUnit1.unit}`;
    }

    return unit1;
  };

  const getTotalQuantity = () => {
    if (currentCart) {
      const parsedUnit = parseUnit(currentCart.weight);
      if (parsedUnit) {
        return parsedUnit.quantity;
      }
    }
    return 0;
  };

  const getTotalPrice = () => {
    const parsedUnit = parseUnit(activeUnit);
    if (parsedUnit) {
      return price * parsedUnit.quantity;
    }
    return 0;
  };

  const updateQuantity = (amount) => {
    const newQuantity = quantityCount + (amount * firstQuantitycount);
    if (newQuantity <= 0) {
      deleteFromCart();
    } else {
      setQuantityCount(newQuantity);
      updateCart(newQuantity);
    }
  };

  const updateCart = (newQuantity) => {
    const cookies = document.cookie.split(";");

    let cartCookieValue = null;
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === "cart") {
        cartCookieValue = cookieValue;
        break;
      }
    }

    let cart = {};
    if (cartCookieValue) {
      cart = JSON.parse(decodeURIComponent(cartCookieValue));
    }

    if (!cart[userId]) {
      cart[userId] = {};
    }

    if (newQuantity === 0) {
      delete cart[userId][productId];
    } else {
      if (cart[userId][productId]) {
        const parsedUnit = parseUnit(cart[userId][productId]);
        const updatedWeight = `${newQuantity}${parsedUnit.unit}`;
        cart[userId][productId] = updatedWeight;
      } else {
        cart[userId][productId] = `${quantity}${unit}`;
      }
    }

    document.cookie = `cart=${encodeURIComponent(JSON.stringify(cart))}; path=/`;
    props.updateCartData(); 
  };

  const deleteFromCart = () => {
    const cookies = document.cookie.split(";");

    let cartCookieValue = null;
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === "cart") {
        cartCookieValue = cookieValue;
        break;
      }
    }

    let cart = {};
    if (cartCookieValue) {
      cart = JSON.parse(decodeURIComponent(cartCookieValue));
    }

    if (cart[userId] && cart[userId][productId]) {
      delete cart[userId][productId];
    }
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(cart))}; path=/`;

    props.updateCartData(); 
    window.location.reload();
  };

  const addToCart = () => {
    const cookies = document.cookie.split(";");

    let cartCookieValue = null;
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === "cart") {
        cartCookieValue = cookieValue;
        break;
      }
    }

    let cart = {};
    if (cartCookieValue) {
      cart = JSON.parse(decodeURIComponent(cartCookieValue));
    }

    if (!cart[userId]) {
      cart[userId] = {};
    }

    if (cart[userId][productId]) {
      cart[userId][productId] = addUnits(cart[userId][productId], activeUnit);
    } else {
      cart[userId][productId] = activeUnit;
    }

    document.cookie = `cart=${encodeURIComponent(JSON.stringify(cart))}; path=/`;
    props.updateCartData(); 
  };

  return (
    <div className="maincard" ref={cardRef}>
      <img src={image} alt="" className="productimage" />
      <div className="details">
        <div className="headerdetails">
          <h2 className="productname">{name}</h2>
          <h3 className="itemsavaiable">
            <span className="rating">{review}</span>
            <Star size={20} color="#91E506" fill="#91E506" />
          </h3>
        </div>
      </div>
      <div className="details">
        <div className="custom-dropdown">
          <button className="dropdown" onClick={toggleDropdown}>
            <div className="dropdown1">
              {getTotalPrice()} {/* Display total price here */}
              <IndianRupee size={15} /> / {activeUnit}
            </div>
            {!currentCart && !isOpen && <ChevronDown />}
            {!currentCart && isOpen && <ChevronUp />}
          </button>
          {isOpen && !currentCart && (
            <div className="dropdown-menu">
              <ul>
                <li onClick={() => changeActive(price, `${quantity}${unit}`)}>
                  {price}
                  <IndianRupee size={15} /> / {quantity}
                  {unit}
                </li>
                <li
                  onClick={() =>
                    changeActive(
                      Math.ceil(parseInt(price, 10) / 2),
                      `${quantity / 2}${unit}`
                    )
                  }
                >
                  {Math.ceil(parseInt(price, 10) / 2)}
                  <IndianRupee size={15} /> / {quantity / 2}
                  {unit}
                </li>
                <li
                  onClick={() =>
                    changeActive(
                      Math.ceil(parseInt(price, 10) / 4),
                      `${quantity / 4}${unit}`
                    )
                  }
                >
                  {Math.ceil(parseInt(price, 10) / 4)}
                  <IndianRupee size={15} /> / {quantity / 4}
                  {unit}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {!currentCart ? (
        <button className="addtocart" onClick={addToCart}>
          <span>Add to Cart</span> <ShoppingCartIcon />
        </button>
      ):(
        <div className="quantity-selector">
          <button className="quantity-button" onClick={() => updateQuantity(-1)}>
            <Minus/>
          </button>
          <span className="quantity-button">{firstQuantitycount}</span>
          <button className="quantity-button" onClick={() => updateQuantity(1)}>
            <Plus/>
          </button>
        </div>
      )}
    </div>
  );
}
