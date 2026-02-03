import { useEffect, useState, useRef, useMemo } from "react";
import CarCard from "./components/CarCard/CarCard";
import Filters from "./components/Filters/Filters";
import SortBar from "./components/SortBar/SortBar";
import Header from "./components/Header/Header";
import AppliedFilters from "./components/AppliedFilters/AppliedFilters";

import { sortCars } from "./utils/sortUtils";
import { buildFilterParams } from "./utils/filterParams";
import { saveToStorage, getFromStorage } from "./utils/storage";
import { normalizeNextPageUrl } from "./utils/pagination";

function App() {
  const [cars, setCars] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loaderRef = useRef(null);
  const searchParams = new URLSearchParams(window.location.search);

  const [selectedFuels, setSelectedFuels] = useState(
    searchParams.get("fuel")
      ? searchParams.get("fuel").split("+").map(Number)
      : getFromStorage("selectedFuels", [])
  );

  const [minBudget, setMinBudget] = useState(null);
  const [maxBudget, setMaxBudget] = useState(null);

  const [selectedMakes, setSelectedMakes] = useState(
    getFromStorage("selectedMakes", [])
  );
  const [selectedCities, setSelectedCities] = useState(
    getFromStorage("selectedCities", [])
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || getFromStorage("sortBy", "")
  );


  const getValidCityIdsFromUrl = () => {
    const cityParam = searchParams.get("city");

    if (!cityParam) return [];

    return cityParam
      .split("+")
      .map(Number)
      .filter((id) => id > 0); 
  };

   useEffect(() => {
    setCars([]);
    setNextPageUrl(null);

    let url = "/api/api/stocks";
    const query = buildFilterParams({
      selectedFuels,
      minBudget,
      maxBudget,
      selectedMakes,
      selectedCities,
    });

    if (query) url += `?${query}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCars(data.stocks || []);
        setNextPageUrl(data.nextPageUrl || null);
      })
      .catch(console.error);
  }, [selectedFuels, minBudget, maxBudget, selectedMakes, selectedCities]);


const fetchNextPage = () => {
    if (!nextPageUrl || isLoading) return;

    setIsLoading(true);

    const finalUrl = normalizeNextPageUrl(nextPageUrl);

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

 useEffect(() => {
    if (!nextPageUrl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextPageUrl, isLoading]);
  
  const sortedCars = useMemo(
    () => sortCars(cars, sortBy),
    [cars, sortBy]
  );

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
            <div
              ref={loaderRef}
              style={{ height: "40px", textAlign: "center" }}
            >
              {isLoading && <p>Loading more cars...</p>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
export default App;
