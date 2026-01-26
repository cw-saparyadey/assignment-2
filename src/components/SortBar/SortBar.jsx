import "./SortBar.css";

function SortBar({ sortBy, setSortBy }) {
  return (
    <div className="sort-bar">
      <div className="applied-filters">
        
      </div>

      <div className="sort-control">
        <span>Sort By:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Best Match</option>
          <option value="priceAsc">Price - Low to High</option>
          <option value="priceDesc">Price - High to Low</option>
          <option value="yearDesc">Year - Newest to Oldest</option>
          <option value="yearAsc">Year - Oldest to Newest</option>
        </select>
      </div>
    </div>
  );
}

export default SortBar;