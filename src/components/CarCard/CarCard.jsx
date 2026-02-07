import "./CarCard.css";
import Info from "./Info";

function CarCard({ car }) {
  const carlength = car.stockImages ? car.stockImages.length : 0;

  return (
    <div className="car-card">
      <Info car={car} carlength={carlength} />

      <div className="card-body">
        <h3 className="title">{car.carName}</h3>

        <p className="meta">
          {car.km} km | {car.fuel}
        </p>

        <div className="price-row">
          <span className="price">Rs. {car.price}</span>
          <span className="emi">{car.emiText}</span>
        </div>

        <a href="#" className="offer-link">
          Make Offer
        </a>

        <button className="car-btn">Get Seller Details</button>
      </div>
    </div>
  );
}

export default CarCard;
