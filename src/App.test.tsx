import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import * as mockSelectedFeature from "./__test_helpers__/mock-selected-feature";
import * as mockHoveredFeature from "./__test_helpers__/mock-hovered-feature";
import { Layer, MapboxGeoJSONFeature } from "mapbox-gl";
import { LineString } from "geojson";
import {
  forDataToBeFetched,
  setFetchGlobalMock,
} from "./__test_helpers__/mock-fetch";
import { aLineFeature } from "./__test_helpers__/geoJSON";

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
    const interactiveLayers = screen.getByText(
      /interactiveLayerIds:*selectable-tracks/i
    );

    expect(style).toBeInTheDocument();
    expect(initialLatitude).toBeInTheDocument();
    expect(initialLongitude).toBeInTheDocument();
    expect(initialZoom).toBeInTheDocument();
    expect(interactiveLayers).toBeInTheDocument();
  });

  it("renders the map with fetched tracks", async () => {
    const lineFeatureName = "aTrackName";
    const otherLineFeatureName = "otherTrackName";
    const fetchedData = [
      aLineFeature(lineFeatureName),
      aLineFeature(otherLineFeatureName),
    ];
    setFetchGlobalMock(fetchedData);

    render(<App />);
    await forDataToBeFetched(screen, fetchedData);
    const source = await screen.findByText(/source-id: tracks/i);

    expect(source).toHaveTextContent(/layer-id: tracks/i);
    expect(source).toHaveTextContent(
      /data-features:.*aTrackName.*otherTrackName/i
    );
  });

  it("highlights a track when selected on the map", async () => {
    const selectedTrackName = "selectedTrackName";
    const tracksLayerId = "selectable-tracks";
    const tracksData = [
      aLineFeature("aTrackName"),
      aLineFeature(selectedTrackName),
    ];
    setFetchGlobalMock(tracksData);

    render(<App />);
    await forDataToBeFetched(screen, tracksData);
    selectFeatureOnMap(selectedTrackName, tracksLayerId);
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(
      /filter: in,name,selectedTrackName/i
    );
  });

  it("highlights a track when hovered on the map", async () => {
    const hoveredTrackName = "hoveredTrackName";
    const tracksLayerId = "selectable-tracks";
    const tracksData = [
      aLineFeature("aTrackName"),
      aLineFeature(hoveredTrackName),
    ];
    setFetchGlobalMock(tracksData);

    render(<App />);
    await forDataToBeFetched(screen, tracksData);
    hoverFeatureOnMap(hoveredTrackName, tracksLayerId);
    const hoveredTrackLayer = await screen.findByText(
      /layer-id: hovered-track/i
    );

    expect(hoveredTrackLayer).toHaveTextContent(
      /filter: in,name,hoveredTrackName/i
    );
  });

  it("renders the map with connection nodes as nodes layer", async () => {
    const lineFeatureName = "aTrackName";
    const fetchedData = [aLineFeature(lineFeatureName)];
    setFetchGlobalMock(fetchedData);

    render(<App />);
    await forDataToBeFetched(screen, fetchedData);
    const source = await screen.findByText(/source-id: nodes/i);

    expect(source).toHaveTextContent(/layer-id: nodes/i);
    expect(source).toHaveTextContent(/data-features:.*[1, 2, 10].*[3, 4, 12]/i);
  });

  it("shows elevation chart of a track when selected on the map", async () => {
    const selectedTrackName = "selectedTrackName";
    const tracksLayerId = "selectable-tracks";
    const tracksData = [
      aLineFeature("aTrackName"),
      aLineFeature(selectedTrackName),
    ];
    setFetchGlobalMock(tracksData);

    render(<App />);
    await forDataToBeFetched(screen, tracksData);
    selectFeatureOnMap(selectedTrackName, tracksLayerId);
    const elevationChart = screen.getByLabelText("elevation-chart");

    expect(elevationChart).toHaveTextContent(/selectedTrackName/i);
  });

  it("shows side panel", async () => {
    render(<App />);
    await forDataToBeFetched(screen);

    const sidePanel = screen.getByLabelText("sidePanel");

    expect(sidePanel).toBeInTheDocument();
  });

  describe("create new route", () => {
    it("shows connection nodes when starting create new route", async () => {
      render(<App />);
      await forDataToBeFetched(screen);

      const createNewRouteButton = screen.getByText("Create new route");
      fireEvent.click(createNewRouteButton);
      const nodesLayer = await screen.findByText(/layer-id: nodes/i);

      expect(nodesLayer).toHaveTextContent(/visibility: visible/i);
    });

    it("shows hint when starting create new route", async () => {
      render(<App />);
      await forDataToBeFetched(screen);

      const createNewRouteButton = screen.getByText("Create new route");
      fireEvent.click(createNewRouteButton);
      const createRoutePanel = screen.getByLabelText("createRoutePanel");

      expect(createRoutePanel).toHaveTextContent(
        /Select your route's starting point/i
      );
    });

    it("disables track selection and hovering when starting new route", async () => {
      const selectedTrackName = "selectedTrackName";
      const tracksData = [
        aLineFeature("aTrackName"),
        aLineFeature(selectedTrackName),
      ];
      setFetchGlobalMock(tracksData);
      render(<App />);
      await forDataToBeFetched(screen, tracksData);

      const createNewRouteButton = screen.getByText("Create new route");
      fireEvent.click(createNewRouteButton);
      const mockMap = screen.getByText(/mapstyle:mapbox/i);

      expect(mockMap).not.toHaveTextContent(/interactiveLayerIds:.*tracks/i);
    });

    it("enables nodes selection when starting new route", async () => {
      const selectedTrackName = "selectedTrackName";
      const tracksData = [
        aLineFeature("aTrackName"),
        aLineFeature(selectedTrackName),
      ];
      setFetchGlobalMock(tracksData);
      render(<App />);
      await forDataToBeFetched(screen, tracksData);

      const createNewRouteButton = screen.getByText("Create new route");
      fireEvent.click(createNewRouteButton);
      const mockMap = screen.getByText(/mapstyle:mapbox/i);

      expect(mockMap).toHaveTextContent(/interactiveLayerIds:.*nodes/i);
    });
  });
});

const selectFeatureOnMap = (selectedFeatureName: string, layerId: string) => {
  jest
    .spyOn(mockSelectedFeature, "mockSelectedFeature")
    .mockReturnValue(aMapboxGeoJSONFeature(selectedFeatureName, layerId));

  const mapClick = screen.getByRole("button", { name: /mapclick/i });
  fireEvent.click(mapClick);
};

const hoverFeatureOnMap = (hoveredFeatureName: string, layerId: string) => {
  jest
    .spyOn(mockHoveredFeature, "mockHoveredFeature")
    .mockReturnValue(aMapboxGeoJSONFeature(hoveredFeatureName, layerId));

  const mapHover = screen.getByRole("button", { name: /maphover/i });
  fireEvent.mouseOver(mapHover);
};

const aMapboxGeoJSONFeature = (
  name: string,
  layerId: string
): MapboxGeoJSONFeature => {
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
    layer: { id: layerId } as Layer,
    properties: { name },
    source: "",
    sourceLayer: "",
    state: {},
  };
};
