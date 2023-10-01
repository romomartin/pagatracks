import { render, screen } from "@testing-library/react";
import App from "./App";

describe("app", () => {
  it("renders the map on initial state", () => {
    render(<App />);
    const style = screen.getByText(/mapbox:\/\/styles\/mapbox\/outdoors-v12/i);
    const initialLatitude = screen.getByText(/"latitude": 43.21861/i);
    const initialLongitude = screen.getByText(/"longitude": -2.94305/i);
    const initialZoom = screen.getByText(/"zoom": 13/i);
    const interactiveLayers = screen.getByText(/"interactiveLayerIds"tracks/i);

    expect(style).toBeInTheDocument();
    expect(initialLatitude).toBeInTheDocument();
    expect(initialLongitude).toBeInTheDocument();
    expect(initialZoom).toBeInTheDocument();
    expect(interactiveLayers).toBeInTheDocument();
  });
});
