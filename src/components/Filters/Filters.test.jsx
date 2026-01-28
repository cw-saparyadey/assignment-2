import { render, screen, fireEvent } from "@testing-library/react";
import Filters from "./Filters";

test("allows selecting fuel type", () => {
  const setSelectedFuels = jest.fn();

  render(
    <Filters
      selectedFuels={[]}
      setSelectedFuels={setSelectedFuels}
      minBudget=""
      setMinBudget={jest.fn()}
      maxBudget=""
      setMaxBudget={jest.fn()}
      selectedMakes={[]}
      setSelectedMakes={jest.fn()}
      selectedCities={[]}
      setSelectedCities={jest.fn()}
    />
  );

  const petrolCheckbox = screen.getByLabelText(/petrol/i);

  fireEvent.click(petrolCheckbox);

  expect(setSelectedFuels).toHaveBeenCalled();
});
