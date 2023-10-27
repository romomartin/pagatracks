import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import * as mockSelectedFeature from "./__test_helpers__/mock-selected-feature";
import { Layer, MapboxGeoJSONFeature } from "mapbox-gl";
import { Feature, LineString } from "geojson";
import {
  forDataToBeFetched,
  setFetchGlobalMock,
} from "./__test_helpers__/mock-fetch";

describe("app", () => {
  beforeEach(() => {
    setFetchGlobalMock();
  });

  it("renders the map on initial state", async () => {
    render(<App />);
    await forDataToBeFetched(screen);
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

  it("renders the map with fetched tracks", async () => {
    const featureName = "aFeatureName";
    const otherFeatureName = "otherFeatureName";
    const fetchedData = [aFeature(featureName), aFeature(otherFeatureName)];
    setFetchGlobalMock(fetchedData);

    render(<App />);
    await forDataToBeFetched(screen, fetchedData);
    const source = await screen.findByText(/source-id: tracks/i);

    expect(source).toHaveTextContent(/layer-id: tracks/i);
    expect(source).toHaveTextContent(
      /data-features:.*aFeatureName.*otherFeatureName/i
    );
  });

  it("highlights a track when selected on the map", async () => {
    const selectedTrackName = "selectedTrackName";
    const tracksData = [aFeature("aTrackName"), aFeature(selectedTrackName)];
    setFetchGlobalMock(tracksData);

    render(<App />);
    await forDataToBeFetched(screen, tracksData);
    selectFeatureOnMap(selectedTrackName);
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(
      /filter: in,name,selectedTrackName/i
    );
  });

  it("shows elevation chart of a track when selected on the map", async () => {
    const selectedTrackName = "selectedTrackName";
    const tracksData = [aFeature("aTrackName"), aFeature(selectedTrackName)];
    setFetchGlobalMock(tracksData);

    render(<App />);
    await forDataToBeFetched(screen, tracksData);
    selectFeatureOnMap(selectedTrackName);
    const elevationChart = screen.getByLabelText("elevation-chart");

    expect(elevationChart).toHaveTextContent(/selectedTrackName/i);
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
    geometry: {
      type: "LineString",
      coordinates: [
        [1, 1],
        [2, 2],
      ],
    } as LineString,
    layer: {} as Layer,
    properties: { name },
    source: "",
    sourceLayer: "",
    state: {},
  };
};

export const aFeature = (name?: string): Feature => {
  const featureName = name || "featureName";
  return {
    type: "Feature",
    geometry: {
      type: "MultiLineString",
      coordinates: [
        [
          [1, 2, 10],
          [3, 4, 12],
        ],
      ],
    },
    properties: {
      name: featureName,
      path_type: "paved",
    },
  };
};
