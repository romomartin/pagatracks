import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app", () => {
  render(<App />);
  const headerText = screen.getByText(/pagatracks/i);
  expect(headerText).toBeInTheDocument();
});
