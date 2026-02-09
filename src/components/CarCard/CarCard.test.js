import { render, screen } from "@testing-library/react";
import CarCard from "./CarCard";

const mockCar = {
  id: 1,
  carName: "Honda City",
  price: "10 Lakh",
  stockImages: ["test.jpg"],
};

test("renders car card with car name", () => {
  render(<CarCard car={mockCar} />);

  const carName = screen.getByText(/honda city/i);
  expect(carName).toBeInTheDocument();
});
