import { render, screen } from "@testing-library/react";
import App from "./App";

describe("app", () => {
  it("renders the map", () => {
    render(<App />);
    const headerText = screen.getByText(
      /mapbox:\/\/styles\/mapbox\/outdoors-v12/i
    );

    expect(headerText).toBeInTheDocument();
  });
});
