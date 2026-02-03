export const buildFilterParams = ({
  selectedFuels,
  minBudget,
  maxBudget,
  selectedMakes,
  selectedCities,
}) => {
  const params = [];

  if (selectedFuels.length > 0) {
    params.push(`fuel=${selectedFuels.join("+")}`);
  }

  if (minBudget || maxBudget) {
    params.push(`budget=${minBudget || 0}-${maxBudget || 500}`);
  }

  if (selectedMakes.length > 0) {
    params.push(`car=${selectedMakes.join("+")}`);
  }

  if (selectedCities.length > 0) {
    params.push(`city=${selectedCities.join(",")}`);
  }

  return params.join("&");
};
