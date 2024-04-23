import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { products } from '../utils/products';
import Card from './Card';

export default function Searchcard() {
  const navigate = useNavigate();
  const { searchParam } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Search for the product based on the searchParam
        const foundProduct = products.find(
          category => category.items.find(
            item => item.name.toLowerCase() === searchParam.toLowerCase()
          )
        );
        if (foundProduct) {
          // Set the found product
          setProduct(foundProduct.items.find(item => item.name.toLowerCase() === searchParam.toLowerCase()));
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
  
    fetchProduct();
  }, [searchParam, navigate]);

  if(!product){
    return navigate('/');
  }
  return (
    <div>
      <Card product={product} />
    </div>
  );
}
