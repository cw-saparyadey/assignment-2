import { useEffect, useState } from "react";
import CarCard from "./components/CarCard/CarCard";
import Filters from "./components/Filters";
import SortBar from "./components/SortBar";
function App() {
  const [cars, setCars] = useState([]);
  const [selectedFuels, setSelectedFuels] = useState([]);
const [minBudget, setMinBudget] = useState("");
const [maxBudget, setMaxBudget] = useState("");
const [selectedMakes, setSelectedMakes] = useState([]);
const [sortBy, setSortBy] = useState("");

 useEffect(() => {
  let url = "/api/api/stocks";
  let params = [];

  if (selectedFuels.length > 0) {
    params.push(`fuel=${selectedFuels.join("+")}`);
  }

  if (minBudget || maxBudget) {
    params.push(`budget=${minBudget || 0}-${maxBudget || 100}`);
  }

  if (selectedMakes.length > 0) {
    params.push(`car=${selectedMakes.join("+")}`);
  }

  if (params.length > 0) {
    url += "?" + params.join("&");
  }

  console.log("FETCH URL:", url);

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setCars(data.stocks || []);
    })
    .catch((err) => console.error(err));
}, [selectedFuels, minBudget, maxBudget, selectedMakes]);

const sortedCars = [...cars];

if (sortBy === "priceAsc") {
  sortedCars.sort((a, b) => a.price - b.price);
}

if (sortBy === "priceDesc") {
  sortedCars.sort((a, b) => b.price - a.price);
}

if (sortBy === "yearAsc") {
  sortedCars.sort((a, b) => a.makeYear - b.makeYear);
}

if (sortBy === "yearDesc") {
  sortedCars.sort((a, b) => b.makeYear - a.makeYear);
}

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <aside className="filters-section">
          <Filters
  selectedFuels={selectedFuels}
  setSelectedFuels={setSelectedFuels}
  minBudget={minBudget}
  setMinBudget={setMinBudget}
  maxBudget={maxBudget}
  setMaxBudget={setMaxBudget}
  selectedMakes={selectedMakes}
  setSelectedMakes={setSelectedMakes}
/>

        </aside>

        <main className="cars-section">
          <SortBar sortBy={sortBy} setSortBy={setSortBy} />
          <div className="cars-grid">

  {sortedCars.map((car) => (
    <CarCard key={car.id} car={car} />
  ))}
</div>

        </main>
      </div>
    </div>
  );
}

export default App;
