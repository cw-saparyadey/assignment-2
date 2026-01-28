import placeholder from "../../assets/image.avif";
import "./CarCard.css";
import { useState } from "react";

function CarCard({ car }) {
  const images =
    car.stockImages && car.stockImages.length > 0
      ? car.stockImages
      : [placeholder];

  const [currentIndex, setCurrentIndex] = useState(0);


 return (
    <div className="car-card">
      <div className="image-container">
        <button className="nav-btn left" onClick={() =>
          setCurrentIndex(i => i === 0 ? images.length - 1 : i - 1)
        }>
          ‹
        </button>

        <img
          src={images[currentIndex]}
          alt={car.carName}
          className="car-image"
          loading="lazy"
          onError={(e) => (e.target.src = placeholder)}
        />

        <button className="nav-btn right" onClick={() =>
          setCurrentIndex(i => i === images.length - 1 ? 0 : i + 1)
        }>
          ›
        </button>
      </div>

      <div className="card-body">
        <h3 className="title">{car.carName}</h3>

        <p className="meta">
          {car.km} km | {car.fuel}
        </p>

        <div className="price-row">
          <span className="price">Rs. {car.price}</span>
          <span className="emi">{car.emiText}</span>
        </div>

        <a href="#" className="offer-link">Make Offer</a>

        <button className="car-btn">Get Seller Details</button>
      </div>
    </div>
  );
}

export default CarCard;