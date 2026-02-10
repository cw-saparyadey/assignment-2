import { STORAGE_KEY } from "./constant";

export const getFiltersFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedFilters = stored ? JSON.parse(stored) : {};

    const params = new URLSearchParams(window.location.search);

      const fuels = params.getAll("fuel").length
  ? params.getAll("fuel").map(Number)
  : storedFilters.fuels || [];

    const budgetParam = params.get("budget");
    const budget = budgetParam
      ? {
          min: Number(budgetParam.split("-")[0]),
          max: Number(budgetParam.split("-")[1]),
        }
      : storedFilters.budget || { min: null, max: null };

const makes = params.getAll("car").length
  ? params.getAll("car").map(Number)
  : storedFilters.makes || [];


    const cities = params.get("city")
      ? params.get("city").split(",").map(Number)
      : storedFilters.cities || [];

    const sortBy = params.get("sort") || storedFilters.sortBy || "";

    return {
      fuels,
      budget,
      makes,
      cities,
      sortBy,
    };
  } catch (err) {
    console.error("Failed to read filters", err);
    return null;
  }
};

export const saveFiltersToStorage = (filters) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
};

export const clearFiltersFromStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};