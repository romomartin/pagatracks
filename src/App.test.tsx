import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import * as mockSelectedFeature from "./__test_helpers__/mock-selected-feature";
import * as mockHoveredFeature from "./__test_helpers__/mock-hovered-feature";
import { Layer, GeoJSONFeature, LayerSpecification } from "mapbox-gl";
import { LineString } from "geojson";
import {
  forDataToBeFetched,
  setFetchGlobalMock,
} from "./__test_helpers__/mock-fetch";
import {
  aFeatureCollectionWith,
  aTrackFeature,
} from "./__test_helpers__/geoJSON";

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
    const cursor = screen.getByText(/cursor:*auto/i);
    const initialLatitude = screen.getByText(/lat: 43.21861/i);
    const initialLongitude = screen.getByText(/long: -2.94305/i);
    const initialZoom = screen.getByText(/zoom: 13/i);
    const interactiveLayers = screen.getByText(
      /interactiveLayerIds:*selectable-tracks/i
    );
    const navigationControl = screen.getByText(/visualizePitch: true/i);

    expect(style).toBeInTheDocument();
    expect(cursor).toBeInTheDocument();
    expect(initialLatitude).toBeInTheDocument();
    expect(initialLongitude).toBeInTheDocument();
    expect(initialZoom).toBeInTheDocument();
    expect(interactiveLayers).toBeInTheDocument();
    expect(navigationControl).toBeInTheDocument();
  });

  it("renders the map with fetched tracks", async () => {
    const trackId = "track1";
    const otherTrackId = "track2";
    const fetchedData = aFeatureCollectionWith([
      aTrackFeature({ id: trackId }),
      aTrackFeature({ id: otherTrackId }),
    ]);
    setFetchGlobalMock(fetchedData);

    render(<App />);
    await forDataToBeFetched(screen, fetchedData);
    const source = await screen.findByText(/source-id: tracks/i);

    expect(source).toHaveTextContent(/layer-id: tracks/i);
    expect(source).toHaveTextContent(/data-features:.*track1.*track2/i);
  });

  it("highlights a track when selected on the map", async () => {
    const selectedTrackId = "track_14";
    const tracksLayerId = "selectable-tracks";
    const tracksData = aFeatureCollectionWith([
      aTrackFeature({ id: selectedTrackId }),
    ]);
    setFetchGlobalMock(tracksData);

    render(<App />);
    await forDataToBeFetched(screen, tracksData);
    selectFeatureOnMap(selectedTrackId, tracksLayerId);
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(/filter: in,id,track_14/i);
  });

  it("highlights a track when hovered on the map", async () => {
    const hoveredTrackId = "track_35";
    const tracksLayerId = "selectable-tracks";
    const tracksData = aFeatureCollectionWith([
      aTrackFeature({ id: hoveredTrackId }),
    ]);
    setFetchGlobalMock(tracksData);

    render(<App />);
    await forDataToBeFetched(screen, tracksData);
    hoverFeatureOnMap(hoveredTrackId, tracksLayerId);
    const hoveredTrackLayer = await screen.findByText(
      /layer-id: hovered-track/i
    );

    expect(hoveredTrackLayer).toHaveTextContent(/filter: in,id,track_35/i);
  });

  it("renders the map with connection nodes as nodes layer", async () => {
    const fetchedData = aFeatureCollectionWith([aTrackFeature()]);
    setFetchGlobalMock(fetchedData);

    render(<App />);
    await forDataToBeFetched(screen, fetchedData);
    const source = await screen.findByText(/source-id: nodes/i);

    expect(source).toHaveTextContent(/layer-id: nodes-base/i);
    expect(source).toHaveTextContent(/data-features:.*[1, 2, 10].*[3, 4, 12]/i);
  });

  it("shows elevation chart of a track when selected on the map", async () => {
    const selectedTrackId = "track_123";
    const selectedTrackName = "selectedTrackName";
    const tracksLayerId = "selectable-tracks";
    const tracksData = aFeatureCollectionWith([
      aTrackFeature({ id: selectedTrackId, name: selectedTrackName }),
    ]);
    setFetchGlobalMock(tracksData);

    render(<App />);
    await forDataToBeFetched(screen, tracksData);
    selectFeatureOnMap(selectedTrackId, tracksLayerId, selectedTrackName);
    const elevationChart = screen.getByLabelText("elevation-chart");

    expect(elevationChart).toHaveTextContent(/selectedTrackName/i);
  });

  it("does not show elevation chart when no track is selected", async () => {
    setFetchGlobalMock();

    render(<App />);
    await forDataToBeFetched(screen);

    const elevationChart = screen.queryByLabelText("elevation-chart");

    expect(elevationChart).not.toBeInTheDocument();
  });

  it("shows side panel", async () => {
    render(<App />);
    await forDataToBeFetched(screen);

    const sidePanel = screen.getByLabelText("sidePanel");

    expect(sidePanel).toBeInTheDocument();
  });
});

export const selectFeatureOnMap = (
  id: string,
  layerId: string,
  name?: string
) => {
  jest
    .spyOn(mockSelectedFeature, "mockSelectedFeature")
    .mockReturnValue(aMapboxGeoJSONFeature({ id, name, layerId }));

  const mapClick = screen.getByRole("button", { name: /mapclick/i });
  fireEvent.click(mapClick);
};

export const hoverFeatureOnMap = (
  id: string,
  layerId: string,
  name?: string
) => {
  jest
    .spyOn(mockHoveredFeature, "mockHoveredFeature")
    .mockReturnValue(aMapboxGeoJSONFeature({ id, name, layerId }));

  const mapHover = screen.getByRole("button", { name: /maphover/i });
  fireEvent.mouseOver(mapHover);
};

const aMapboxGeoJSONFeature = ({
  id,
  name = "",
  layerId,
}: {
  id: string;
  name?: string;
  layerId: string;
}): GeoJSONFeature => {
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
    layer: { id: layerId } as LayerSpecification,
    properties: { id, name },
    source: "",
    sourceLayer: "",
    state: {},
  };
};
