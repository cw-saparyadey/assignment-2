import React from "react";
import { useState, useEffect, useRef } from "react";
import { FUEL_TYPES } from "../../utils/constant";
import "./Filters.css";
import { validateBudget } from "../../utils/budgetUtils";
import { clearFiltersFromStorage } from "../../utils/storage";
import { SLIDER_MAX, SLIDER_MIN } from "../../utils/constant";

function Filters({
  selectedFuels,
  setSelectedFuels,
  minBudget,
  setMinBudget,
  maxBudget,
  setMaxBudget,
  selectedMakes,
  setSelectedMakes,
  selectedCities,
  setSelectedCities,
}) {
  const [openSections, setOpenSections] = useState({
    budget: true,
    make: true,
    city: true,
    fuel: true,
  });
  const [showCustomBudget, setShowCustomBudget] = useState(false);
  const [budgetError, setBudgetError] = useState("");

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [makeQuery, setMakeQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");

  const [makes, setMakes] = useState([]);
  const [cities, setCities] = useState([]);

  const handleFuelChange = (fuel) => {
  setSelectedFuels((prev) => {
    const exists = prev.some((f) => f.id === fuel.value);

    if (exists) {
      return prev.filter((f) => f.id !== fuel.value);
    }

    return [
      ...prev,
      { id: fuel.value, name: fuel.label },
    ];
  });
};


  useEffect(() => {
  const fetchFiltersData = async () => {
    try {
      const results = await Promise.allSettled([
        fetch("/api/api/v2/makes/?type=new"),
        fetch("/api/api/cities"),
      ]);

      // Makes
      if (results[0].status === "fulfilled") {
        const makesData = await results[0].value.json();
        setMakes(makesData || []);
      } else {
        setMakes([]);
        console.error("Makes API failed");
      }

      // Cities
      if (results[1].status === "fulfilled") {
        const citiesData = await results[1].value.json();
        setCities(citiesData || []);
      } else {
        setCities([]);
        console.error("Cities API failed");
      }
    } catch (err) {
      console.error("Unexpected error", err);
      setMakes([]);
      setCities([]);
    }
  };

  fetchFiltersData();
}, []);

  const handleMakeChange = (make) => {
  setSelectedMakes((prev) =>
    prev.some((m) => m.id === make.makeId)
      ? prev.filter((m) => m.id !== make.makeId)
      : [...prev, { id: make.makeId, name: make.makeName }],
  );
};

const handleCityChange = (city) => {
  setSelectedCities((prev) => {

    if (prev.length && prev[0].id === city.CityId) {
      return [];
    }

    
    return [{ id: city.CityId, name: city.CityName }];
  });
};




  const sliderMin =
    minBudget === "" ? SLIDER_MIN : Math.min(Number(minBudget), SLIDER_MAX);

  const sliderMax =
    maxBudget === "" ? SLIDER_MAX : Math.min(Number(maxBudget), SLIDER_MAX);



  const [tempMin, setTempMin] = useState(sliderMin);
  const [tempMax, setTempMax] = useState(sliderMax);

  const minDebounceRef = useRef(null);
  const maxDebounceRef = useRef(null);

  useEffect(() => {
  setTempMin(sliderMin);
  setTempMax(sliderMax);
}, [sliderMin, sliderMax]);


  const debouncedSetMin = (val) => {
    if (minDebounceRef.current) {
      clearTimeout(minDebounceRef.current);
    }

    minDebounceRef.current = setTimeout(() => {
      setMinBudget(val);
    }, 300);
  };

  const debouncedSetMax = (val) => {
    if (maxDebounceRef.current) {
      clearTimeout(maxDebounceRef.current);
    }

    maxDebounceRef.current = setTimeout(() => {
      setMaxBudget(val);
    }, 300);
  };

  const filteredCities = cities.filter((city) => {
    const matchesQuery = city.CityName.toLowerCase().includes(
      cityQuery.toLowerCase(),
    );

    if (!cityQuery) {
      return city.IsPopular;
    }

    return matchesQuery;
  });


  const filteredMakes = makes.filter((make) =>
    make.makeName.toLowerCase().includes(makeQuery.toLowerCase()),
  );

  const handleMinBudgetChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setMinBudget("");
      setBudgetError("Please enter valid input");
      return;
    }

    const num = Number(value);
    if (isNaN(num)) {
      setBudgetError("Please enter valid input");
      return;
    }

    const error = validateBudget(num, maxBudget);
    if (error) {
      setBudgetError(error);
      return;
    }

    setBudgetError("");
    setMinBudget(num);
  };

  const handleMaxBudgetChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setMaxBudget("");
      setBudgetError("Please enter valid input");
      return;
    }

    const num = Number(value);
    if (isNaN(num)) {
      setBudgetError("Please enter valid input");
      return;
    }

    const error = validateBudget(minBudget, num);
    if (error) {
      setBudgetError(error);
      return;
    }

    setBudgetError("");
    setMaxBudget(num);
  };

  useEffect(() => {
  if (!selectedFuels.length) return;
  if (typeof selectedFuels[0] === "object") return;

  const hydratedFuels = FUEL_TYPES
    .filter((f) => selectedFuels.includes(f.value))
    .map((f) => ({
      id: f.value,
      name: f.label,
    }));

  setSelectedFuels(hydratedFuels);
}, []);

useEffect(() => {
  if (!makes.length || !selectedMakes.length) return;

  // if already objects, skip
  if (typeof selectedMakes[0] === "object") return;

  const hydratedMakes = makes
    .filter((make) => selectedMakes.includes(make.makeId))
    .map((make) => ({
      id: make.makeId,
      name: make.makeName,
    }));

  setSelectedMakes(hydratedMakes);
}, [makes]);

useEffect(() => {
  if (!cities.length || !selectedCities.length) return;

  if (typeof selectedCities[0] === "object") return;

  const hydratedCities = cities
    .filter((city) => selectedCities.includes(city.CityId))
    .map((city) => ({
      id: city.CityId,
      name: city.CityName,
    }));

  setSelectedCities(hydratedCities);
}, [cities]);

  return (
    <div className="filters-root">
      <div className="filters-header">
        <div className="filters-title">
          <span className="filter-icon">⏳</span>
          <h3>Filters</h3>
        </div>
        <button
          className="clear-btn"
          onClick={() => {
            clearFiltersFromStorage();
            setSelectedFuels([]);
            setSelectedMakes([]);
            setSelectedCities([]);
            setMinBudget(null);
            setMaxBudget(null);
          }}
        >
          Clear All
        </button>
      </div>

      <div className="filter-block">
        <div
          className="filter-title clickable"
          onClick={() => toggleSection("budget")}
        >
          <span>Budget (Lakh)</span>
          <span className={`chevron ${openSections.budget ? "up" : "down"}`} />
        </div>

        {openSections.budget && (
          <>
            <div className="budget-pills">
              {[
                [0, 3, "Below ₹ 3 Lakh"],
                [3, 5, "₹ 3-5 Lakh"],
                [5, 8, "₹ 5-8 Lakh"],
                [8, 12, "₹ 8-12 Lakh"],
                [12, 20, "₹ 12-20 Lakh"],
                [20, 100000, "₹ 20 Lakh +"],
              ].map(([min, max, label]) => (
                <button
                  key={label}
                  className={`pill ${
                    minBudget === min && maxBudget === max ? "active" : ""
                  }`}
                  onClick={() => {
                    setMinBudget(min);
                    setMaxBudget(max);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div
              className="custom-budget clickable"
              onClick={() => setShowCustomBudget((prev) => !prev)}
            >
              Customize Your Budget
            </div>

            {showCustomBudget && (
              <div className="custom-budget-slider">
                <div className="slider-wrapper">
                  <div className="range-track" />

                  <div
                    className="range-active"
                    style={{
                      left: `${(tempMin / SLIDER_MAX) * 100}%`,
                      width: `${((tempMax - tempMin) / SLIDER_MAX) * 100}%`,
                    }}
                  />

                  <input
                    type="range"
                    min={SLIDER_MIN}
                    max={SLIDER_MAX}
                    value={tempMin}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (tempMax !== "" && val > tempMax) return;

                      setBudgetError("");
                      setTempMin(val);
                      debouncedSetMin(val);
                    }}
                    className="range"
                  />

                  <input
                    type="range"
                    min={SLIDER_MIN}
                    max={SLIDER_MAX}
                    value={tempMax}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (tempMin !== "" && val < tempMin) return;

                      setBudgetError("");
                      setTempMax(val);
                      debouncedSetMax(val);
                    }}
                    className="range"
                  />
                </div>

                <div className="budget-inputs">
                  <input
                    type="number"
                    value={minBudget}
                    placeholder="Any"
                    onChange={handleMinBudgetChange}
                  />
                  <span> - </span>
                  <input
                    type="number"
                    value={maxBudget}
                    placeholder="21+"
                    onChange={handleMaxBudgetChange}
                  />
                  {budgetError && (
                    <div className="budget-error">{budgetError}</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="filter-block">
        <div className="filter-title" onClick={() => toggleSection("make")}>
          <span>Make / Model</span>
          <span className={`chevron ${openSections.make ? "up" : "down"}`} />
        </div>

        {openSections.make && (
          <>
            <input
              className="search-input"
              placeholder="Search Make / Model"
              value={makeQuery}
              onChange={(e) => setMakeQuery(e.target.value)}
            />

            <div className="checkbox-list">
              {filteredMakes.length === 0 && makeQuery ? (
                <div className="not-found">No make found</div>
              ) : (
                filteredMakes.map((make) => (
                  <label key={make.makeId} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={selectedMakes.some((m) => m.id === make.makeId)}
  onChange={() => handleMakeChange(make)}
                    />
                    <span>{make.makeName}</span>
                  </label>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <div className="filter-block">
        <div className="filter-title" onClick={() => toggleSection("city")}>
          <span>City</span>
          <span className={`chevron ${openSections.city ? "up" : "down"}`} />
        </div>

        {openSections.city && (
          <>
            <input
              className="search-input"
              placeholder="Search City"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
            />

            <div className="city-pills">
  {filteredCities.length === 0 && cityQuery ? (
    <div className="not-found">No city found</div>
  ) : (
    <>
      {filteredCities.map((city) => (
        <button
          key={city.CityId}
          className={`pill ${
            selectedCities.some((c) => c.id === city.CityId)
              ? "active"
              : ""
          }`}
          onClick={() => handleCityChange(city)}
        >
          {city.CityName}
        </button>
      ))}

      {!cityQuery &&
        cities
          .filter(
            (city) =>
              !city.IsPopular &&
              selectedCities.some((c) => c.id === city.CityId)
          )
          .map((city) => (
            <button
              key={city.CityId}
              className="pill active"
              onClick={() => handleCityChange(city)}
            >
              {city.CityName}
            </button>
          ))}
    </>
  )}
</div>

          </>
        )}
      </div>

      <div className="filter-block">
        <div className="filter-title" onClick={() => toggleSection("fuel")}>
          <span>Fuel</span>
          <span className={`chevron ${openSections.fuel ? "up" : "down"}`} />
        </div>

        {openSections.fuel && (
          <div className="checkbox-list">
            {FUEL_TYPES.map((fuel) => (
              <label key={fuel.value} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={selectedFuels.some((f) => f.id === fuel.value)}
onChange={() => handleFuelChange(fuel)}

                />
                <span>{fuel.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Filters;