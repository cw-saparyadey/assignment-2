import { useEffect, useState, useRef, useMemo } from "react";
import CarCard from "./components/CarCard/CarCard";
import Filters from "./components/Filters/Filters";
import SortBar from "./components/SortBar/SortBar";
import Header from "./components/Header/Header";
import AppliedFilters from "./components/AppliedFilters/AppliedFilters";
import { sortCars } from "./utils/sortUtils";
import { buildFilterParams } from "./utils/filterParams";
import { normalizeNextPageUrl } from "./utils/pagination";
import { getFiltersFromStorage, saveFiltersToStorage } from "./utils/storage";

function App() {
  const storedFilters = getFiltersFromStorage();
  const [cars, setCars] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loaderRef = useRef(null);

  const [selectedFuels, setSelectedFuels] = useState(
    storedFilters?.fuels || [],
  );
  const [minBudget, setMinBudget] = useState(
    storedFilters?.budget?.min ?? null,
  );
  const [maxBudget, setMaxBudget] = useState(
    storedFilters?.budget?.max ?? null,
  );
  const [selectedMakes, setSelectedMakes] = useState(
    storedFilters?.makes || [],
  );
  
  const [selectedCities, setSelectedCities] = useState(
    storedFilters?.cities || [],
  );

  const [sortBy, setSortBy] = useState(storedFilters?.sortBy || "");


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
      { threshold: 1 },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextPageUrl, isLoading]);

  const sortedCars = useMemo(() => sortCars(cars, sortBy), [cars, sortBy]);
  useEffect(() => {
    saveFiltersToStorage({
      fuels: selectedFuels,
      budget: {
        min: minBudget,
        max: maxBudget,
      },
      makes: selectedMakes,
      cities: selectedCities,
      sortBy,
    });
  }, [
    selectedFuels,
    minBudget,
    maxBudget,
    selectedMakes,
    selectedCities,
    sortBy,
  ]);
 useEffect(() => {
  const query = buildFilterParams({
    selectedFuels,
    minBudget,
    maxBudget,
    selectedMakes,
    selectedCities,
    sortBy,
  });

  const newUrl = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;

  window.history.replaceState(null, "", newUrl);
}, [
  selectedFuels,
  minBudget,
  maxBudget,
  selectedMakes,
  selectedCities,
  sortBy,
]);

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
