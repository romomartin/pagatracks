import { render, screen } from "@testing-library/react";
import App from "./App";

const MapMock = ({ mapStyle }: { mapStyle: string }): JSX.Element => {
  return <div>{mapStyle}</div>;
};

jest.mock("react-map-gl", () => {
  const lib = jest.requireActual("react-map-gl");

  return {
    ...lib,
    Map: MapMock,
  };
});

describe("app", () => {
  it("renders the map", () => {
    render(<App />);
    const headerText = screen.getByText(
      /mapbox:\/\/styles\/mapbox\/outdoors-v12/i
    );

    expect(headerText).toBeInTheDocument();
  });
});
