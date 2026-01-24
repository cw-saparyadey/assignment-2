import { useEffect, useState } from "react";
import CarCard from "./components/CarCard/CarCard";
import Filters from "./components/Filters";
import SortBar from "./components/SortBar";
function App() {
  const [cars, setCars] = useState([]);
 const searchParams = new URLSearchParams(window.location.search);

const [selectedFuels, setSelectedFuels] = useState(
  searchParams.get("fuel")
    ? searchParams.get("fuel").split("+").map(Number)
    : JSON.parse(localStorage.getItem("selectedFuels")) || []
);

const [minBudget, setMinBudget] = useState(
  searchParams.get("budget")
    ? searchParams.get("budget").split("-")[0]
    : localStorage.getItem("minBudget") || ""
);

const [maxBudget, setMaxBudget] = useState(
  searchParams.get("budget")
    ? searchParams.get("budget").split("-")[1]
    : localStorage.getItem("maxBudget") || ""
);

const [selectedMakes, setSelectedMakes] = useState(
  searchParams.get("car")
    ? searchParams.get("car").split("+").map(Number)
    : JSON.parse(localStorage.getItem("selectedMakes")) || []
);

const getValidCityIdsFromUrl = () => {
  const cityParam = searchParams.get("city");

  if (!cityParam) return [];

  return cityParam
    .split("+")
    .map(Number)
    .filter((id) => id > 0); // 🔑 removes 0 and NaN
};

const [selectedCities, setSelectedCities] = useState(
  getValidCityIdsFromUrl().length > 0
    ? getValidCityIdsFromUrl()
    : JSON.parse(localStorage.getItem("selectedCities")) || []
);


const [sortBy, setSortBy] = useState(
  searchParams.get("sort") || localStorage.getItem("sortBy") || ""
);



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

if (selectedCities.length > 0) {
  params.push(`city=${selectedCities.join("+")}`);
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
}, [selectedFuels, minBudget, maxBudget, selectedMakes, selectedCities]);
useEffect(() => {
  localStorage.setItem("selectedFuels", JSON.stringify(selectedFuels));
  localStorage.setItem("minBudget", minBudget);
  localStorage.setItem("maxBudget", maxBudget);
  localStorage.setItem("selectedMakes", JSON.stringify(selectedMakes));
  localStorage.setItem("selectedCities", JSON.stringify(selectedCities));
  localStorage.setItem("sortBy", sortBy);
}, [selectedFuels, minBudget, maxBudget, selectedMakes, selectedCities, sortBy]);
useEffect(() => {
  const params = new URLSearchParams();

  if (selectedFuels.length > 0) {
    params.set("fuel", selectedFuels.join("+"));
  }

  if (minBudget || maxBudget) {
    params.set("budget", `${minBudget || 0}-${maxBudget || 100}`);
  }

  if (selectedMakes.length > 0) {
    params.set("car", selectedMakes.join("+"));
  }
  const validCities = selectedCities.filter(id => id > 0);

if (validCities.length > 0) {
  params.set("city", validCities.join("+"));
}
  if (sortBy) {
    params.set("sort", sortBy);
  }

  const newUrl =
    params.toString().length > 0
      ? `?${params.toString()}`
      : window.location.pathname;

  window.history.replaceState(null, "", newUrl);
}, [selectedFuels, minBudget, maxBudget, selectedMakes, selectedCities,sortBy]);

// helper functions (VERY IMPORTANT)
const getPrice = (car) => {
  if (!car.price) return 0;

  // price comes like "33.33 Lakh"
  const value = parseFloat(car.price);
  return isNaN(value) ? 0 : value;
};

const getYear = (car) => {
  return Number(car.makeYear) || 0;
};

const sortedCars = [...cars];

if (sortBy === "priceAsc") {
  sortedCars.sort((a, b) => getPrice(a) - getPrice(b));
}

if (sortBy === "priceDesc") {
  sortedCars.sort((a, b) => getPrice(b) - getPrice(a));
}

if (sortBy === "yearAsc") {
  sortedCars.sort((a, b) => getYear(a) - getYear(b));
}

if (sortBy === "yearDesc") {
  sortedCars.sort((a, b) => getYear(b) - getYear(a));
}
console.log(sortedCars.map(car => getYear(car)));


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
  selectedCities={selectedCities}
  setSelectedCities={setSelectedCities}
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
