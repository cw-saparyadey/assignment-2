import React from 'react';
    import { useState,useEffect} from 'react';
import { FUEL_TYPES } from '../utils/constant';

function Filters({
  selectedFuels,
  setSelectedFuels,
  minBudget,
  setMinBudget,
  maxBudget,
  setMaxBudget,
  selectedMakes,
  setSelectedMakes
}) {
   
const [makes, setMakes] = useState([]);


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

  return (
    <div>
      <h3>Filters</h3>

     <div>
  <h4>Fuel Type</h4>

  {FUEL_TYPES.map((fuel) => (
    <label key={fuel.value}>
      <input
        type="checkbox"
        checked={selectedFuels.includes(fuel.value)}
        onChange={() => handleFuelChange(fuel.value)}
      />
      {fuel.label}
    </label>
  ))}
</div>

      <hr />

     <div>
  <h4>Budget (Lakh)</h4>

  <input
    type="number"
    placeholder="Min"
    value={minBudget}
    onChange={(e) => setMinBudget(e.target.value)}
    style={{ width: "60px" }}
  />

  <span> - </span>

  <input
    type="number"
    placeholder="Max"
    value={maxBudget}
    onChange={(e) => setMaxBudget(e.target.value)}
    style={{ width: "60px" }}
  />
  

</div>


      <hr />
<div>
  <h4>Make</h4>

  {makes.length === 0 && <p>Loading makes...</p>}

  {makes.map((make) => (
    <label key={make.makeId}>
      <input
        type="checkbox"
        checked={selectedMakes.includes(make.makeId)}
        onChange={() => handleMakeChange(make.makeId)}
      />
      {make.makeName}
    </label>
  ))}
  
</div>

      
    </div>
  );
}

export default Filters;
