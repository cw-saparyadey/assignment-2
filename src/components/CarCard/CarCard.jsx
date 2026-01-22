import placeholder from "../../assets/image.avif";
import "./CarCard.css";
import { useState } from "react";

function CarCard({ car }) {
  const images =
    car.stockImages && car.stockImages.length > 0
      ? car.stockImages
      : [placeholder];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="car-card">
      <div className="image-container">
        <button className="nav-btn left" onClick={goPrev}>
          ‹
        </button>

        <img
          src={images[currentIndex]}
          alt={car.carName}
          className="car-image"
          onError={(e) => {
            e.target.src = placeholder;
          }}
        />

        <button className="nav-btn right" onClick={goNext}>
          ›
        </button>
      </div>

      <h3>{car.carName}</h3>

      <p className="car-meta">
        {car.km} km | {car.fuelType}
      </p>

      <p className="car-price">₹ {car.price} Lakh</p>

      <button className="car-btn">Get Seller Details</button>
    </div>
  );
}

export default CarCard;
