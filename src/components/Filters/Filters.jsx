import React from 'react';
    import { useState,useEffect} from 'react';
import { FUEL_TYPES } from '../../utils/constant';
import "./Filters.css";
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
  setSelectedCities
}) {
  const [openSections, setOpenSections] = useState({
  budget: true,
  make: true,
  city: true,
  fuel: true,
});
const [showCustomBudget, setShowCustomBudget] = useState(false);


const toggleSection = (key) => {
  setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
};
 const [makeQuery, setMakeQuery] = useState("");
const [cityQuery, setCityQuery] = useState("");

const [makes, setMakes] = useState([]);
const [cities, setCities] = useState([]);


    const handleFuelChange = (value) => {
  setSelectedFuels((prev) =>
    prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value]
  );
};
useEffect(() => {
  fetch("/api/api/v2/makes/?type=new")
    .then((res) => res.json())
    .then((data) => {
      setMakes(data || []);
    })
    .catch((err) => console.error("Makes API error", err));
}, []);
const handleMakeChange = (makeId) => {
  setSelectedMakes((prev) =>
    prev.includes(makeId)
      ? prev.filter((id) => id !== makeId)
      : [...prev, makeId]
  );
};
useEffect(() => {
  fetch("/api/api/cities")
    .then(res => res.json())
    .then(data => setCities(data || []))
    .catch(err => console.error("City API error", err));
}, []);
const handleCityChange = (cityId) => {
  setSelectedCities(prev =>
    prev.includes(cityId)
      ? prev.filter(id => id !== cityId)
      : [...prev, cityId]
  );
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
          ["0", "3", "Below ₹ 3 Lakh"],
          ["3", "5", "₹ 3-5 Lakh"],
          ["5", "8", "₹ 5-8 Lakh"],
          ["8", "12", "₹ 8-12 Lakh"],
          ["12", "20", "₹ 12-20 Lakh"],
          ["20", "", "₹ 20 Lakh +"]
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
  onClick={() => setShowCustomBudget(prev => !prev)}
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
          left: `${(minBudget / 20) * 100}%`,
          width: `${((maxBudget - minBudget) / 20) * 100}%`
        }}
      />

     
      <input
        type="range"
        min="0"
        max="20"
        step="1"
        value={minBudget}
        onChange={(e) =>
          setMinBudget(Math.min(+e.target.value, maxBudget - 1))
        }
        className="range"
      />

      
      <input
        type="range"
        min="0"
        max="20"
        step="1"
        value={maxBudget}
        onChange={(e) =>
          setMaxBudget(Math.max(+e.target.value, minBudget + 1))
        }
        className="range"
      />
    </div>

    

    <div className="budget-inputs">
      <input
        type="number"
        value={minBudget}
        onChange={(e) => setMinBudget(+e.target.value)}
      />
      <span>-</span>
      <input
        type="number"
        value={maxBudget}
        onChange={(e) => setMaxBudget(+e.target.value)}
      />
    </div>
  </div>
)}


    </>
  )}
</div>


    
<div className="filter-block">
 
  <div
    className="filter-title"
    onClick={() => toggleSection("make")}
  >
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
        {makes
          .filter(make =>
            make.makeName.toLowerCase().includes(makeQuery.toLowerCase())
          )
          .map(make => (
            <label key={make.makeId} className="checkbox-row">
              <input
                type="checkbox"
                checked={selectedMakes.includes(make.makeId)}
                onChange={() => handleMakeChange(make.makeId)}
              />
              <span>{make.makeName}</span>
            </label>
          ))}
      </div>
    </>
  )}
</div>

   
<div className="filter-block">
 
  <div
    className="filter-title"
    onClick={() => toggleSection("city")}
  >
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
        {cities
          .filter(city =>
            city.CityName.toLowerCase().includes(cityQuery.toLowerCase())
          )
          .map(city => (
            <button
              key={city.CityId}
              className={`pill ${
                selectedCities.includes(city.CityId) ? "active" : ""
              }`}
              onClick={() => handleCityChange(city.CityId)}
            >
              {city.CityName}
            </button>
          ))}
      </div>
    </>
  )}
</div>


   
   <div className="filter-block">
  
  <div
    className="filter-title"
    onClick={() => toggleSection("fuel")}
  >
    <span>Fuel</span>
    <span className={`chevron ${openSections.fuel ? "up" : "down"}`} />
  </div>

 
  {openSections.fuel && (
    <div className="checkbox-list">
      {FUEL_TYPES.map(fuel => (
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