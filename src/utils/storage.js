const STORAGE_KEY = "carwaleFilters";

export const getFiltersFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveFiltersToStorage = (filters) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
};

export const clearFiltersFromStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
