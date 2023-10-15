import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import * as mockSelectedFeature from "./__test_helpers__/mock-selected-feature";
import { Layer, MapboxGeoJSONFeature } from "mapbox-gl";
import { LineString } from "geojson";

describe("app", () => {
  it("renders the map on initial state", () => {
    render(<App />);
    const style = screen.getByText(
      /mapbox:\/\/styles\/piticli\/clnra3qjx00g601o3622b5n40/i
    );
    const initialLatitude = screen.getByText(/lat: 43.21861/i);
    const initialLongitude = screen.getByText(/long: -2.94305/i);
    const initialZoom = screen.getByText(/zoom: 13/i);
    const interactiveLayers = screen.getByText(/interactiveLayerIds:.*tracks/i);

    expect(style).toBeInTheDocument();
    expect(initialLatitude).toBeInTheDocument();
    expect(initialLongitude).toBeInTheDocument();
    expect(initialZoom).toBeInTheDocument();
    expect(interactiveLayers).toBeInTheDocument();
  });

  it("highlights a track when selected on the map", async () => {
    const selectedFeatureName = "selectedTrack";

    render(<App />);
    selectFeatureOnMap(selectedFeatureName);
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(
      /filter: in,name,selectedTrack/i
    );
  });
});

const selectFeatureOnMap = (selectedFeatureName: string) => {
  jest
    .spyOn(mockSelectedFeature, "mockSelectedFeature")
    .mockReturnValue(aMapboxGeoJSONFeature(selectedFeatureName));

  const mapClick = screen.getByRole("button", { name: /mapclick/i });
  fireEvent.click(mapClick);
};

const aMapboxGeoJSONFeature = (name: string): MapboxGeoJSONFeature => {
  return {
    id: undefined,
    type: "Feature",
    geometry: {} as LineString,
    layer: {} as Layer,
    properties: { name },
    source: "",
    sourceLayer: "",
    state: {},
  };
};
