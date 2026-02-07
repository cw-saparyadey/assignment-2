import './AppliedFilters.css'
import { FUEL_TYPES } from "../../utils/constant";
function AppliedFilters({
  selectedFuels,
  setSelectedFuels,
  selectedMakes,
  setSelectedMakes,
  selectedCities,
  setSelectedCities,
  minBudget,
  maxBudget,
  setMinBudget,
  setMaxBudget

}) {
  const hasFilters =
    selectedFuels.length ||
    selectedMakes.length ||
    selectedCities.length ||
    minBudget ||
    maxBudget;

  if (!hasFilters) return null;
 

  return (
    <div className="applied-filters">
      
     {selectedFuels.map((fuelId) => {
  const fuelObj = FUEL_TYPES.find(
    (fuel) => fuel.value === fuelId
  );

  return (
    <span key={fuelId} className="chip">
      Fuel {fuelObj?.label}
      <button
        onClick={() =>
          setSelectedFuels((prev) =>
            prev.filter((f) => f !== fuelId)
          )
        }
      >
        ✕
      </button>
    </span>
  );
})}

 
     {selectedMakes.map((make) => (
  <span key={make.id} className="chip">
    Make {make.name}
    <button
      onClick={() =>
        setSelectedMakes((prev) =>
          prev.filter((m) => m.id !== make.id)
        )
      }
    >
      ✕
    </button>
  </span>
))}



{selectedCities.map((city) => (
  <span key={city.id} className="chip">
    City {city.name}
    <button
      onClick={() =>
        setSelectedCities((prev) =>
          prev.filter((c) => c.id !== city.id)
        )
      }
    >
      ✕
    </button>
  </span>
))}




      {(minBudget || maxBudget) && (
        <span className="chip">
          Budget :₹{minBudget || 0}–₹{maxBudget || "Max"} L
          <button onClick={() => {
            setMinBudget("");
            setMaxBudget("");
          }}>
            ✕
          </button>
        </span>
      )}

      <button
        className="clear-all"
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
  );
}

export default AppliedFilters;