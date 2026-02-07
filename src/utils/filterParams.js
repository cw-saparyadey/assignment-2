export function buildFilterParams({
  selectedFuels,
  minBudget,
  maxBudget,
  selectedMakes,
  selectedCities,
  sortBy,
}) {
  const params = new URLSearchParams();

  if (selectedFuels?.length) {
    params.set("fuel", selectedFuels.join(","));
  }

  if (Number.isFinite(minBudget) && Number.isFinite(maxBudget)) {
    params.set("budget", `${minBudget}-${maxBudget}`);
  }
if (selectedMakes?.length) {
  params.set(
    "car",
    selectedMakes.map((m) => m.id).join(","),
  );
}

if (selectedCities?.length) {
  params.set(
    "city",
    selectedCities.map((c) => c.id).join(","),
  );
}

  
  if (sortBy) {
    params.set("sort", sortBy);
  }
  return params.toString();
}
