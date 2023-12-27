import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import {
  forDataToBeFetched,
  setFetchGlobalMock,
} from "./__test_helpers__/mock-fetch";
import {
  aFeatureCollectionWith,
  aTrackFeature,
} from "./__test_helpers__/geoJSON";
import { hoverFeatureOnMap, selectFeatureOnMap } from "./App.test";

describe("create new route", () => {
  beforeEach(() => {
    setFetchGlobalMock();
  });

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
    const tracksData = aFeatureCollectionWith([aTrackFeature()]);
    setFetchGlobalMock(tracksData);
    render(<App />);
    await forDataToBeFetched(screen, tracksData);

    const createNewRouteButton = screen.getByText("Create new route");
    fireEvent.click(createNewRouteButton);
    const mockMap = screen.getByText(/mapstyle:mapbox/i);

    expect(mockMap).not.toHaveTextContent(/interactiveLayerIds:.*tracks/i);
  });

  it("clears selected track when starting new route", async () => {
    const selectedTrackId = "track_234";
    const tracksLayerId = "selectable-tracks";
    const tracksData = aFeatureCollectionWith([
      aTrackFeature({ id: selectedTrackId }),
    ]);
    setFetchGlobalMock(tracksData);

    render(<App />);
    await forDataToBeFetched(screen, tracksData);
    selectFeatureOnMap(selectedTrackId, tracksLayerId);
    let selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(/filter: in,id,track_234/i);

    const createNewRouteButton = screen.getByText("Create new route");
    fireEvent.click(createNewRouteButton);
    selectedTrackLayer = await screen.findByText(/layer-id: selected-track/i);

    expect(selectedTrackLayer).not.toHaveTextContent(
      /filter: in,id,track_234/i
    );
  });

  it("enables nodes selection and hovering when starting new route", async () => {
    const tracksData = aFeatureCollectionWith([aTrackFeature()]);
    setFetchGlobalMock(tracksData);
    render(<App />);
    await forDataToBeFetched(screen, tracksData);

    const createNewRouteButton = screen.getByText("Create new route");
    fireEvent.click(createNewRouteButton);
    const mockMap = screen.getByText(/mapstyle:mapbox/i);

    expect(mockMap).toHaveTextContent(/interactiveLayerIds:.*nodes/i);
  });

  it("allows nodes hovering when starting new route", async () => {
    const hoveredNodeId = "node0";
    const nodesLayerId = "nodes";
    const tracksData = aFeatureCollectionWith([aTrackFeature()]);
    setFetchGlobalMock(tracksData);
    render(<App />);
    await forDataToBeFetched(screen, tracksData);

    const createNewRouteButton = screen.getByText("Create new route");
    fireEvent.click(createNewRouteButton);
    hoverFeatureOnMap(hoveredNodeId, nodesLayerId);
    const hoveredNodeLayer = await screen.findByText(/layer-id: hovered-node/i);

    expect(hoveredNodeLayer).toHaveTextContent(/filter: in,id,node0/i);
  });

  it("allows nodes selection when starting new route", async () => {
    const selectedNodeId = "node0";
    const nodesLayerId = "nodes";
    const tracksData = aFeatureCollectionWith([aTrackFeature()]);
    setFetchGlobalMock(tracksData);
    render(<App />);
    await forDataToBeFetched(screen, tracksData);

    const createNewRouteButton = screen.getByText("Create new route");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(selectedNodeId, nodesLayerId);
    const selectedNodeLayer = await screen.findByText(
      /layer-id: selected-node/i
    );

    expect(selectedNodeLayer).toHaveTextContent(/filter: in,id,node0/i);
  });

  it("sets selected node as starting point", async () => {
    const selectedNodeId = "node0";
    const nodesLayerId = "nodes";
    render(<App />);
    await forDataToBeFetched(screen);

    const createNewRouteButton = screen.getByText("Create new route");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(selectedNodeId, nodesLayerId);
    const createRoutePanel = screen.getByLabelText("createRoutePanel");

    expect(createRoutePanel).not.toHaveTextContent(
      /Select your route's starting point/i
    );
    expect(createRoutePanel).toHaveTextContent(/Select route's next track/i);
  });

  it("hides other nodes on routes starting point selected", async () => {
    const selectedNodeId = "node0";
    const nodesLayerId = "nodes";
    render(<App />);
    await forDataToBeFetched(screen);

    const createNewRouteButton = screen.getByText("Create new route");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(selectedNodeId, nodesLayerId);
    const nodesLayer = await screen.findByText(/layer-id: nodes/i);
    const selectedNodeLayer = await screen.findByText(
      /layer-id: selected-node/i
    );

    expect(nodesLayer).toHaveTextContent(/visibility: none/i);
    expect(selectedNodeLayer).toHaveTextContent(/visibility: visible/i);
  });

  it("animates next track options from selected start point", async () => {
    const track1StartNodeId = "node0";
    const nodesLayerId = "nodes";
    const someConnectedTracks = aFeatureCollectionWith([
      aTrackFeature({ id: "1", name: "track1" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
      aTrackFeature({ id: "2", name: "track2" }, [
        [
          [2, 2],
          [3, 3],
        ],
      ]),
    ]);
    setFetchGlobalMock(someConnectedTracks);
    render(<App />);
    await forDataToBeFetched(screen, someConnectedTracks);

    const createNewRouteButton = screen.getByText("Create new route");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(track1StartNodeId, nodesLayerId);
    const animatedTracksLayer = await screen.findByText(
      /layer-id: animated-tracks/i
    );

    expect(animatedTracksLayer).toHaveTextContent(/filter: in,id,1/i);
  });

  it("animates next track options from selected start point when two tracks share start and end node", async () => {
    const track1StartNodeId = "node0";
    const nodesLayerId = "nodes";
    const someConnectedTracks = aFeatureCollectionWith([
      aTrackFeature({ id: "1", name: "track1" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
      aTrackFeature({ id: "2", name: "track2" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
    ]);
    setFetchGlobalMock(someConnectedTracks);
    render(<App />);
    await forDataToBeFetched(screen, someConnectedTracks);

    const createNewRouteButton = screen.getByText("Create new route");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(track1StartNodeId, nodesLayerId);
    const animatedTracksLayer = await screen.findByText(
      /layer-id: animated-tracks/i
    );

    expect(animatedTracksLayer).toHaveTextContent(/filter: in,id,1,2/i);
  });

  it("allows selecting next track when starting point has been selected", async () => {
    const selectedNodeId = "node0";
    const nodesLayerId = "nodes";
    render(<App />);
    await forDataToBeFetched(screen);

    const createNewRouteButton = screen.getByText("Create new route");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(selectedNodeId, nodesLayerId);
    const interactiveLayers = screen.getByText(/interactiveLayerIds/i);

    expect(interactiveLayers).toHaveTextContent(/selectable-tracks/i);
  });
});
