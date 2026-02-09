import { render, screen, fireEvent } from "@testing-library/react";
import Filters from "./Filters";

test("renders fuel filters", () => {
  render(
    <Filters
      selectedFuels={[]}
      setSelectedFuels={jest.fn()}
      minBudget={null}
      setMinBudget={jest.fn()}
      maxBudget={null}
      setMaxBudget={jest.fn()}
      selectedMakes={[]}
      setSelectedMakes={jest.fn()}
      selectedCities={[]}
      setSelectedCities={jest.fn()}
    />
  );

  const fuelLabel = screen.getByText(/petrol/i);
  expect(fuelLabel).toBeInTheDocument();
});

