import React, { useState } from "react";
import placeholder from "../../assets/image.png";
import "./CarCard.css";

const Info = ({ car, carlength }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  
  if (carlength === 0) {
    return (
      <div className="image-container">
        <img
          src={placeholder}
          alt={car.carName}
          className="car-image"
          loading="lazy"
        />
      </div>
    );
  }

  
  const images = car.stockImages;

  return (
    <div className="image-container">
      <button
        className="nav-btn left"
        onClick={() =>
          setCurrentIndex((i) =>
            i === 0 ? images.length - 1 : i - 1
          )
        }
      >
        ‹
      </button>


      <img
        src={images[currentIndex]}
        alt={car.carName}
        className="car-image"
        loading="lazy"
        onError={(e) => (e.target.src = placeholder)}
      />

      <button
        className="nav-btn right"
        onClick={() =>
          setCurrentIndex((i) =>
            i === images.length - 1 ? 0 : i + 1
          )
        }
      >
        ›
      </button>
    </div>
  );
};

export default Info;
