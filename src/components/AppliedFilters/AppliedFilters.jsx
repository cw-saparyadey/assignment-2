import './AppliedFilters.css'
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
        <span key={fuel} className="chip">
          Fuel {fuel}
          <button onClick={() =>
            setSelectedFuels((prev) => prev.filter((f) => f !== fuel))
          }>
            ✕
          </button>
        </span>
      ))}

      {selectedMakes.map((make) => (
        <span key={make} className="chip">
          Make {make}
          <button onClick={() =>
            setSelectedMakes((prev) => prev.filter((m) => m !== make))
          }>
            ✕
          </button>
        </span>
      ))}

      {selectedCities.map((city) => (
        <span key={city} className="chip">
          City {city}
          <button onClick={() =>
            setSelectedCities((prev) => prev.filter((c) => c !== city))
          }>
            ✕
          </button>
        </span>
      ))}

      {(minBudget || maxBudget) && (
        <span className="chip">
          ₹{minBudget || 0}–₹{maxBudget || "Max"} L
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
