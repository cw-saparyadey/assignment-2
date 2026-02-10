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
  selectedFuels.forEach((f) => {
    params.append("fuel", f.id);
  });
}

  if (Number.isFinite(minBudget) && Number.isFinite(maxBudget)) {
    params.set("budget", `${minBudget}-${maxBudget}`);
  }

  if (selectedMakes?.length) {
    selectedMakes.forEach((m) => {
      params.append(
        "car",
        typeof m === "number" ? m : m.id
      );
    });
  }

  if (selectedCities?.length) {
    params.set(
      "city",
      selectedCities
        .map((c) => (typeof c === "number" ? c : c.id))
        .join(",")
    );
  }

  if (sortBy) {
    params.set("sort", sortBy);
  }

  return params.toString();
}
