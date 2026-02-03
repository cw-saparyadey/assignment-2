// utils/sortUtils.js

export function sortCars(cars, sortBy) {
  if (!Array.isArray(cars)) return [];

  const sorted = [...cars];

  switch (sortBy) {
    case "priceAsc":
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));

    case "priceDesc":
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));

    case "yearDesc":
      return sorted.sort(
        (a, b) => (b.makeYear || 0) - (a.makeYear || 0)
      );

    default:
      return sorted; // Best match / no sort
  }
}
