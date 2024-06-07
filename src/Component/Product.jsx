import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../style/Products.css";
import { products } from '../utils/products';
import Card from "./Card";

export default function Product() {
  const { categoryname } = useParams();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartData, setCartData] = useState([]); 
  const [userId, setUserId] = useState(null);

  // Function to fetch and parse cart details from cookies
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
    setUserId(userId);

    if (userId) {
      const cartCookie = cookies.find(cookie => cookie.trim().startsWith('cart='));
      if (cartCookie) {
        const cartCookieValue = cartCookie.split('=')[1];
        const parsedCartData = JSON.parse(decodeURIComponent(cartCookieValue));
        const userCartData = parsedCartData[userId] || [];
        const formattedCartData = Object.entries(userCartData).map(([productId, weight]) => ({
          productId,
          weight
        }));
        return formattedCartData;
      }
    }
    return [];
  };

  // Effect to fetch cart details when component mounts
  useEffect(() => {
    const userCartDetails = getCartDetail();
    setCartData(userCartDetails); // Set cart data state
  }, []);

  
  const updateCartData = (updatedCart) => {
    const data = getCartDetail();
    setCartData(data);
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        if (categoryname && categoryname.toLowerCase() !== "allcategories") {
          const filteredProducts = products.find(
            category => category.category.toLowerCase() === categoryname.toLowerCase()
          );
          if (filteredProducts) {
            setCategoryProducts(filteredProducts.items);
          } else {
            console.error("Category not found");
          }
        } else {
          const allProducts = products.flatMap(category => category.items);
          setCategoryProducts(allProducts);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching category products:", error);
      }
    };

    fetchCategoryProducts();
  }, [categoryname]);

  return (
    <>
      <div className="card">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          categoryProducts.map((product, index) => (
            <Card
              key={index}
              product={product}
              cartData={cartData}
              updateCartData={updateCartData} // Pass update function as prop
              userId={userId}
            />
          ))
        )}
      </div>
    </>
  );
}
