import React, { useEffect, useState } from "react";
import "../style/Headerbottom.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function Headerbottom() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const currentCategory = pathname.split('/').pop();
  const [activeButton, setActiveButton] = useState(`${currentCategory}`);

  useEffect(() => {
    // Update active button when location changes
    const updatedCategory = pathname.split('/').pop();
    setActiveButton(updatedCategory);
  }, [pathname]);

  const handleButtonClick = (category) => {
    setActiveButton(category);
    const searchparameter = category.toLowerCase().replace(/\s/g, "");
    navigate(`/category/${searchparameter}`);
  };

  return (
    <div className="menu">
      <div className="mainmenu">
        <button
          className={activeButton === "allcategories" ? "active" : ""}
          onClick={() => handleButtonClick("All Categories")}
        >
          All Categories
        </button>
        <button
          className={activeButton === "fruits" ? "active" : ""}
          onClick={() => handleButtonClick("Fruits")}
        >
          Fruits
        </button>
        <button
          className={activeButton === "vegetables" ? "active" : ""}
          onClick={() => handleButtonClick("Vegetables")}
        >
          Vegetables
        </button>
        <button
          className={activeButton === "grocery" ? "active" : ""}
          onClick={() => handleButtonClick("Grocery")}
        >
          Grocery
        </button>
        <button
          className={activeButton === "nuts" ? "active" : ""}
          onClick={() => handleButtonClick("Nuts")}
        >
          Nuts
        </button>
        <button
          className={activeButton === "dairyproducts" ? "active" : ""}
          onClick={() => handleButtonClick("Dairy Products")}
        >
          Dairy Products
        </button>
      </div>
    </div>
  );
}
