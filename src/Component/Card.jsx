import React, { useEffect, useRef, useState } from "react";
import "../style/Card.css";
import { ChevronDown, ChevronUp, IndianRupee, ShoppingCartIcon, Star } from "lucide-react";

export default function Card(props) {
  const name = props.product.name;
  const price = props.product.price;
  const unit = props.product.unit;
  const review = props.product.reviews;
  const image = props.product.img;
  const quantity = props.product.quantity;
  const [isOpen, setIsOpen] = useState(false);
  const [activeprice, setActivePrice] = useState(price);
  const [activeunit, setActiveUnit] = useState(`${quantity}${unit}`);
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
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeActive = (changePrice, changeUnit) => {
    setActivePrice(changePrice);
    setActiveUnit(changeUnit);
    setIsOpen(false); // Close dropdown when item is clicked
  };

  return (
    <>
      <div className="maincard" ref={cardRef}>
        <img src={image} alt="" className="productimage" />
        <div className="details">
          <div className="headerdetails">
            <h2 className="productname">{name}</h2>
            <h3 className="itemsavaiable">
              <span className="rating">{review} </span>
              <Star size={20} color="#91E506" fill="#91E506" />
            </h3>
          </div>
        </div>
        <div className="details">
          <div className="custom-dropdown">
            <button className="dropdown" onClick={toggleDropdown}>
              <div className="dropdown1">
                {activeprice}
                <IndianRupee size={15} /> / {activeunit}
              </div>
              {!isOpen ? <ChevronDown /> : <ChevronUp />}
            </button>
            {isOpen && (
              <div className="dropdown-menu">
                <ul>
                  <li onClick={() => changeActive(price, `${quantity}${unit}`)}>
                    {price}
                    <IndianRupee size={15} /> / {quantity}
                    {unit}
                  </li>
                  <li onClick={() => changeActive(Math.ceil(parseInt(price, 10) / 2), `${quantity / 2}${unit}`)}>
                    {Math.ceil(parseInt(price, 10) / 2)}
                    <IndianRupee size={15} /> / {quantity / 2} {unit}
                  </li>
                  <li onClick={() => changeActive(Math.ceil(parseInt(price, 10) / 4), `${quantity / 4}${unit}`)}>
                    {Math.ceil(parseInt(price, 10) / 4)}
                    <IndianRupee size={15} />/ {quantity / 4} {unit}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <button className="addtocart"><span>Add to Cart</span> <ShoppingCartIcon/></button>
      </div>
    </>
  );
}
