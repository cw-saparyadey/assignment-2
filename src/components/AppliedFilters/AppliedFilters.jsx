import "./AppliedFilters.css";
import { FUEL_TYPES } from "../../utils/constant";
import handleRemove from "../../utils/applyfilters";

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
  setMaxBudget,
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
      
      {selectedFuels.map((fuel) => (
  <span key={fuel.id} className="chip">
    Fuel : {fuel.name}
    <button
      onClick={() =>
        handleRemove(fuel.id, setSelectedFuels, "id")
      }
    >
      ✕
    </button>
  </span>
))}


      
      {selectedMakes.map((make) => (
        <span key={make.id} className="chip">
          Make : {make.name}
          <button
            onClick={() =>
              handleRemove(make.id, setSelectedMakes, "id")
            }
          >
            ✕
          </button>
        </span>
      ))}

  
      {selectedCities.map((city) => (
        <span key={city.id} className="chip">
          City : {city.name}
          <button
            onClick={() =>
              handleRemove(city.id, setSelectedCities, "id")
            }
          >
            ✕
          </button>
        </span>
      ))}

    
      {(minBudget || maxBudget) && (
        <span className="chip">
          Budget : ₹{minBudget || 0} – ₹{maxBudget || "Max"} L
          <button
            onClick={() => {
              setMinBudget("");
              setMaxBudget("");
            }}
          >
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