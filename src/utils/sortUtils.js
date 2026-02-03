
function getNumericPrice(car) {
  if (typeof car.price === "number") return car.price;
  if (typeof car.price === "string") {
    const num = parseFloat(car.price.replace(/[^\d.]/g, ""));
    return isNaN(num) ? 0 : num;
  }

  return 0;
}
export function sortCars(cars, sortBy) {
  if (!Array.isArray(cars)) return [];

  const sorted = [...cars];

  switch (sortBy) {
    case "priceAsc":
      return sorted.sort(
        (a, b) => getNumericPrice(a) - getNumericPrice(b)
      );

    case "priceDesc":
      return sorted.sort(
        (a, b) => getNumericPrice(b) - getNumericPrice(a)
      );

    case "yearDesc":
      return sorted.sort(
        (a, b) => (b.makeYear || 0) - (a.makeYear || 0)
      );

    default:
      return sorted; 
  }
}
