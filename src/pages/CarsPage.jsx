import "../styles/layout.css";
import Filters from "../components/Filters.jsx";
import CarList from "../components/CarList.jsx";

function CarsPage() {
  return (
    <div className="page-wrapper">
      <div className="used-cars-layout">

        <div className="filters-section">
          <Filters />
        </div>

        <div className="cars-section">
          <CarList />
        </div>

      </div>
    </div>
  );
}

export default CarsPage;
