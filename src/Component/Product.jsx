import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../style/Products.css";
import {products} from '../utils/products'
import Card from "./Card";

export default function Product() {
  const { categoryname } = useParams();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      console.log(categoryname);
      try {
        if (categoryname && categoryname.toLowerCase() !== "allcategories") {
          // Filter products based on the category name from URL params
          const filteredProducts = products.find(
            category => category.category.toLowerCase() === categoryname.toLowerCase()
          );
          if (filteredProducts) {
            setCategoryProducts(filteredProducts.items);
          } else {
            // Handle case where category is not found
            console.error("Category not found");
          }
        } else {
          // If categoryname is "allcategory" or not provided, set all products
          const allProducts = products.flatMap(category => category.items);
          setCategoryProducts(allProducts);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching category products:", error);
      }
    };
  
    fetchCategoryProducts();
  }, [categoryname, products]);
  

  // Render your component using categoryProducts state
  return (
    <>
      <div className="card">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          categoryProducts.map((product, index) => (
            <Card key={index} product={product} />
          ))
        )}
      </div>
    </>
  );
}
