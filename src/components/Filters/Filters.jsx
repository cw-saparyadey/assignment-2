import React from "react";
import { useState, useEffect } from "react";
import { FUEL_TYPES } from "../../utils/constant";
import "./Filters.css";
import { validateBudget } from "../../utils/budgetUtils";
const SLIDER_MIN = 0;
const SLIDER_MAX = 21;

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

  const handleFuelChange = (value) => {
    setSelectedFuels((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  useEffect(() => {
  const fetchFiltersData = async () => {
    try {
      const [makesRes, citiesRes] = await Promise.all([
        fetch("/api/api/v2/makes/?type=new"),
        fetch("/api/api/cities"),
      ]);

      const makesData = await makesRes.json();
      const citiesData = await citiesRes.json();

      setMakes(makesData || []);
      setCities(citiesData || []);
    } catch (err) {
      console.error("Filters API error", err);
    }
  };

  fetchFiltersData();
}, []);

  const handleMakeChange = (makeId) => {
    setSelectedMakes((prev) =>
      prev.includes(makeId)
        ? prev.filter((id) => id !== makeId)
        : [...prev, makeId],
    );
  };
 
  const handleCityChange = (cityId) => {
    setSelectedCities((prev) =>
      prev.includes(cityId)
        ? prev.filter((id) => id !== cityId)
        : [...prev, cityId],
    );
  };
  const sliderMin =
    minBudget === "" ? SLIDER_MIN : Math.min(Number(minBudget), SLIDER_MAX);

  const sliderMax =
    maxBudget === "" ? SLIDER_MAX : Math.min(Number(maxBudget), SLIDER_MAX);

  const filteredCities = cities.filter((city) => {
    const matchesQuery = city.CityName.toLowerCase().includes(
      cityQuery.toLowerCase(),
    );

    // 🔹 No search → only popular cities
    if (!cityQuery) {
      return city.IsPopular;
    }

    // 🔹 Searching → all cities
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
            setSelectedFuels([]);
            setSelectedMakes([]);
            setSelectedCities([]);
            setMinBudget("");
            setMaxBudget("");
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
                      left: `${(sliderMin / SLIDER_MAX) * 100}%`,
                      width: `${((sliderMax - sliderMin) / SLIDER_MAX) * 100}%`,
                    }}
                  />

                  <input
                    type="range"
                    min={SLIDER_MIN}
                    max={SLIDER_MAX}
                    value={sliderMin}
                    onChange={(e) => {
                      const val = Number(e.target.value);

                      if (maxBudget !== "" && val > maxBudget) return;

                      setBudgetError("");
                      setMinBudget(val);
                    }}
                    className="range"
                  />

                  <input
                    type="range"
                    min={SLIDER_MIN}
                    max={SLIDER_MAX}
                    value={sliderMax}
                    onChange={(e) => {
                      const val = Number(e.target.value);

                      if (minBudget !== "" && val < minBudget) return;

                      setBudgetError("");
                      setMaxBudget(val);
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
                      checked={selectedMakes.includes(make.makeId)}
                      onChange={() => handleMakeChange(make.makeId)}
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
                filteredCities.map((city) => (
                  <button
                    key={city.CityId}
                    className={`pill ${
                      selectedCities.includes(city.CityId) ? "active" : ""
                    }`}
                    onClick={() => handleCityChange(city.CityId)}
                  >
                    {city.CityName}
                  </button>
                ))
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
                  checked={selectedFuels.includes(fuel.value)}
                  onChange={() => handleFuelChange(fuel.value)}
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
