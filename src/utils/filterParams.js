
export function buildFilterParams({
  selectedFuels,
  minBudget,
  maxBudget,
  selectedMakes,
  selectedCities,
}) {
  const params = new URLSearchParams();

  if (selectedFuels?.length) {
    params.set("fuel", selectedFuels.join("+"));
  }

  if (Number.isFinite(minBudget) && Number.isFinite(maxBudget)) {
    params.set("budget", `${minBudget}-${maxBudget}`);
  }

  if (selectedMakes?.length) {
    params.set("car", selectedMakes.join("+"));
  }

  const validCities = selectedCities?.filter((id) => id > 0);
  if (validCities?.length) {
    params.set("city", validCities.join("+"));
  }

  return params.toString();
}
