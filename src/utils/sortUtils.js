export const sortCars = (cars, sortBy) => {
  const carsCopy = [...cars];

  const getPrice = (car) => {
    if (!car.price) return 0;
    const value = parseFloat(car.price);
    return isNaN(value) ? 0 : value;
  };

  const getYear = (car) => Number(car.makeYear) || 0;

  switch (sortBy) {
    case "priceAsc":
      return carsCopy.sort((a, b) => getPrice(a) - getPrice(b));

    case "priceDesc":
      return carsCopy.sort((a, b) => getPrice(b) - getPrice(a));

    case "yearAsc":
      return carsCopy.sort((a, b) => getYear(a) - getYear(b));

    case "yearDesc":
      return carsCopy.sort((a, b) => getYear(b) - getYear(a));

    default:
      return carsCopy;
  }
};
