import { useEffect, useState, useRef } from "react";
import CarCard from "./components/CarCard/CarCard";
import Filters from "./components/Filters/Filters";
import SortBar from "./components/SortBar/SortBar";
import Header from "./components/Header/Header";
import AppliedFilters from "./components/AppliedFilters/AppliedFilters";
function App() {
  const [cars, setCars] = useState([]);
 const searchParams = new URLSearchParams(window.location.search);
const loaderRef = useRef(null);

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
const [nextPageUrl, setNextPageUrl] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const normalizeNextPageUrl = (url) => {
  if (!url) return null;

  
  if (url.startsWith("/api/")) {
    return `/api${url}`;
  }

  return `/api/api${url}`;
};

const fetchNextPage = () => {
  if (!nextPageUrl || isLoading) return;

  setIsLoading(true);

  const finalUrl = normalizeNextPageUrl(nextPageUrl);

  console.log("NEXT PAGE FETCH:", finalUrl);

  fetch(finalUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch next page");
      }
      return res.json();
    })
    .then((data) => {
      const newCars = data.stocks || [];
      if (newCars.length === 0) {
        setNextPageUrl(null);
        return;
      }
      setCars((prev) => [...prev, ...(data.stocks || [])]);
      setNextPageUrl(data.nextPageUrl || null);
    })
    .catch((err) => console.error("Next page error", err))
    .finally(() => setIsLoading(false));
};



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
  setCars([]);
setNextPageUrl(null);
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
      setNextPageUrl(data.nextPageUrl || null);
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


const getPrice = (car) => {
  if (!car.price) return 0;

  
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
useEffect(() => {
  if(!nextPageUrl )return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    },
    { threshold: 1 }
  );

  if (loaderRef.current) {
    observer.observe(loaderRef.current);
  }

  return () => observer.disconnect();
}, [nextPageUrl, isLoading]);


  return (
    <div className="page-container">
      <Header />

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
          <AppliedFilters
  selectedFuels={selectedFuels}
  setSelectedFuels={setSelectedFuels}
  selectedMakes={selectedMakes}
  setSelectedMakes={setSelectedMakes}
  selectedCities={selectedCities}
  setSelectedCities={setSelectedCities}
  minBudget={minBudget}
  maxBudget={maxBudget}
  setMinBudget={setMinBudget}
  setMaxBudget={setMaxBudget}
/>

          <div className="cars-grid">

  {sortedCars.map((car) => (
    <CarCard key={car.id} car={car} />
  ))}
</div>
{nextPageUrl && (
  <div ref={loaderRef} style={{ height: "40px", textAlign: "center" }}>
    {isLoading && <p>Loading more cars...</p>}
  </div>
)}

        </main>
      </div>
    </div>
  );
}

export default App;