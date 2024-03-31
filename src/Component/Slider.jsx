import React, { useState, useEffect } from 'react';
import "../style/Slider.css";
import thanksgivingbanner from "../Products-Images/thanksgivingbanner.png";
import ahemdabadsoonbanner from "../Products-Images/ahemdabadsoonbanner.png";
import fasterdeliverybanner from "../Products-Images/fasterdeliverybanner.png";

const images = [thanksgivingbanner, ahemdabadsoonbanner, fasterdeliverybanner];
const image = [ahemdabadsoonbanner, fasterdeliverybanner,thanksgivingbanner];
export default function Slider() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Move to the next slide
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 3 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='slider-container'>
      <img src={images[currentImageIndex]} alt={`Slide ${currentImageIndex + 1}`} className='slider-image' />
      <img src={image[currentImageIndex]} alt={`Slide ${currentImageIndex + 1}`} className='slider-image' />
    </div>
  );
}
