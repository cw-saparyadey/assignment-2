function SortBar({ sortBy, setSortBy }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <span>Sort by: </span>

      <button onClick={() => setSortBy("priceAsc")}>
        Price ↑
      </button>

      <button onClick={() => setSortBy("priceDesc")}>
        Price ↓
      </button>

      <button onClick={() => setSortBy("yearAsc")}>
        Year ↑
      </button>

      <button onClick={() => setSortBy("yearDesc")}>
        Year ↓
      </button>
    </div>
  );
}

export default SortBar;
