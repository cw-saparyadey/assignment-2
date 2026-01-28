import { render, screen } from "@testing-library/react";
import CarCard from "./CarCard";

const mockCar = {
  carName: "Hyundai Creta",
  price: "12.5 Lakh",
  km: "20,000",
  fuel: "Petrol",
  stockImages: ["https://test-image.jpg"]
};

test("renders car details correctly", () => {
  render(<CarCard car={mockCar} />);

  expect(screen.getByText(/hyundai creta/i)).toBeInTheDocument();
  expect(screen.getByText(/12.5 lakh/i)).toBeInTheDocument();

  const image = screen.getByRole("img");
  expect(image).toBeInTheDocument();
});
