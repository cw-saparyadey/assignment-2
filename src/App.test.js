import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Filters and SortBar", () => {
  render(<App />);

  
  expect(screen.getByText(/filters/i)).toBeInTheDocument();

 
  expect(screen.getByText(/sort by/i)).toBeInTheDocument();
});
