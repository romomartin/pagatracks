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

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    const nodesLayer = await screen.findByText(/layer-id: nodes/i);

    expect(nodesLayer).toHaveTextContent(/visibility: visible/i);
  });

  it("hides connection nodes when closing create new route", async () => {
    render(<App />);
    await forDataToBeFetched(screen);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    let nodesLayer = await screen.findByText(/layer-id: nodes/i);
    fireEvent.click(createNewRouteButton);
    nodesLayer = await screen.findByText(/layer-id: nodes/i);

    expect(nodesLayer).toHaveTextContent(/visibility: none/i);
  });

  it("shows hint when starting create new route", async () => {
    render(<App />);
    await forDataToBeFetched(screen);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    const createRoutePanel = screen.getByLabelText("createRoutePanel");

    expect(createRoutePanel).toHaveTextContent(/Select starting point/i);
  });

  it("disables track selection and hovering when starting new route", async () => {
    const tracksData = aFeatureCollectionWith([aTrackFeature()]);
    setFetchGlobalMock(tracksData);
    render(<App />);
    await forDataToBeFetched(screen, tracksData);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    const mockMap = screen.getByText(/mapstyle:mapbox/i);

    expect(mockMap).not.toHaveTextContent(/interactiveLayerIds:.*tracks/i);
  });

  it("enables track selection and hovering when closing create route tool", async () => {
    const tracksData = aFeatureCollectionWith([aTrackFeature()]);
    setFetchGlobalMock(tracksData);
    render(<App />);
    await forDataToBeFetched(screen, tracksData);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    fireEvent.click(createNewRouteButton);
    const mockMap = screen.getByText(/mapstyle:mapbox/i);

    expect(mockMap).toHaveTextContent(/interactiveLayerIds:selectable-tracks/i);
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

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectedTrackLayer = await screen.findByText(/layer-id: selected-track/i);

    expect(selectedTrackLayer).not.toHaveTextContent(
      /filter: in,id,track_234/i
    );
  });

  it("clears selected track when closing create route tool", async () => {
    const selectedTrackId = "track_234";
    const tracksLayerId = "selectable-tracks";
    const tracksData = aFeatureCollectionWith([
      aTrackFeature({ id: selectedTrackId }),
    ]);
    setFetchGlobalMock(tracksData);

    render(<App />);
    await forDataToBeFetched(screen, tracksData);
    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(selectedTrackId, tracksLayerId);
    let selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(/filter: in,id,track_234/i);

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

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    const mockMap = screen.getByText(/mapstyle:mapbox/i);

    expect(mockMap).toHaveTextContent(/interactiveLayerIds:.*nodes/i);
  });

  it("disables nodes selection and hovering when closing create route tool", async () => {
    const tracksData = aFeatureCollectionWith([aTrackFeature()]);
    setFetchGlobalMock(tracksData);
    render(<App />);
    await forDataToBeFetched(screen, tracksData);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    const mockMap = screen.getByText(/mapstyle:mapbox/i);

    expect(mockMap).toHaveTextContent(/interactiveLayerIds:.*nodes/i);

    fireEvent.click(createNewRouteButton);

    expect(mockMap).not.toHaveTextContent(/interactiveLayerIds:.*nodes/i);
  });

  it("allows nodes hovering when starting new route", async () => {
    const hoveredNodeId = "node0";
    const nodesLayerId = "nodes";
    const tracksData = aFeatureCollectionWith([aTrackFeature()]);
    setFetchGlobalMock(tracksData);
    render(<App />);
    await forDataToBeFetched(screen, tracksData);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
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

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(selectedNodeId, nodesLayerId);
    const routeStartNodeLayer = await screen.findByText(
      /layer-id: route-start-node/i
    );

    expect(routeStartNodeLayer).toHaveTextContent(/filter: in,id,node0/i);
  });

  it("hides other nodes on routes starting point selected", async () => {
    const selectedNodeId = "node0";
    const nodesLayerId = "nodes";
    render(<App />);
    await forDataToBeFetched(screen);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(selectedNodeId, nodesLayerId);
    const nodesLayer = await screen.findByText(/layer-id: nodes/i);

    expect(nodesLayer).toHaveTextContent(/visibility: none/i);
  });

  it("shows start node on routes starting point selected", async () => {
    const selectedNodeId = "node0";
    const nodesLayerId = "nodes";
    render(<App />);
    await forDataToBeFetched(screen);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(selectedNodeId, nodesLayerId);
    const routeStartNodeLayer = await screen.findByText(
      /layer-id: route-start-node/i
    );

    expect(routeStartNodeLayer).toHaveTextContent(/visibility: visible/i);
    expect(routeStartNodeLayer).toHaveTextContent(/filter: in,id,node0/i);
  });

  it("disables node selection on routes starting point selected", async () => {
    const selectedNodeId = "node0";
    const nodesLayerId = "nodes";
    render(<App />);
    await forDataToBeFetched(screen);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    let map = await screen.findByTestId("MockMap");

    expect(map).toHaveTextContent(/interactiveLayerIds:nodes/i);

    selectFeatureOnMap(selectedNodeId, nodesLayerId);
    map = await screen.findByTestId("MockMap");

    expect(map).not.toHaveTextContent(/interactiveLayerIds:nodes/i);
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

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(track1StartNodeId, nodesLayerId);
    const animatedTracksLayer = await screen.findByText(
      /layer-id: animated-tracks/i
    );

    expect(animatedTracksLayer).toHaveTextContent(/filter: in,id,1/i);
  });

  it("hides animated next track options when closing create route tool", async () => {
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

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(track1StartNodeId, nodesLayerId);
    fireEvent.click(createNewRouteButton);
    const animatedTracksLayer = await screen.findByText(
      /layer-id: animated-tracks/i
    );

    expect(animatedTracksLayer).not.toHaveTextContent(/filter: in,id,1/i);
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

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
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

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(selectedNodeId, nodesLayerId);
    const interactiveLayers = screen.getByText(/interactiveLayerIds/i);

    expect(interactiveLayers).toHaveTextContent(/selectable-tracks/i);
  });

  it("only next possible tracks are selectable when starting point has been selected", async () => {
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

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(track1StartNodeId, nodesLayerId);
    const selectableTracksLayer = await screen.findByText(
      /layer-id: selectable-tracks/i
    );

    expect(selectableTracksLayer).toHaveTextContent(/filter: in,id,1/i);
  });

  it("all tracks are selectable when closing create route tool", async () => {
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

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(track1StartNodeId, nodesLayerId);
    fireEvent.click(createNewRouteButton);
    const selectableTracksLayer = await screen.findByText(
      /layer-id: selectable-tracks/i
    );

    expect(selectableTracksLayer).not.toHaveTextContent(/filter: in,id,1/i);
  });

  it("updates next track options when next track is selected", async () => {
    const track1StartNodeId = "node0";
    const nodesLayerId = "nodes";
    const track1Id = "track1";
    const selectableTracksId = "selectable-tracks";
    const someConnectedTracks = aFeatureCollectionWith([
      aTrackFeature({ id: "track1" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
      aTrackFeature({ id: "track2" }, [
        [
          [2, 2],
          [3, 3],
        ],
      ]),
    ]);
    setFetchGlobalMock(someConnectedTracks);
    render(<App />);
    await forDataToBeFetched(screen, someConnectedTracks);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(track1StartNodeId, nodesLayerId);
    selectFeatureOnMap(track1Id, selectableTracksId);
    const selectableTracksLayer = await screen.findByText(
      /layer-id: selectable-tracks/i
    );

    expect(selectableTracksLayer).toHaveTextContent(/filter: in,id,track2/i);
  });

  it("displays route tracks on map", async () => {
    const track1StartNodeId = "node0";
    const nodesLayerId = "nodes";
    const track1Id = "track1";
    const selectableTracksId = "selectable-tracks";
    const someConnectedTracks = aFeatureCollectionWith([
      aTrackFeature({ id: "track1" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
      aTrackFeature({ id: "track2" }, [
        [
          [2, 2],
          [3, 3],
        ],
      ]),
    ]);
    setFetchGlobalMock(someConnectedTracks);
    render(<App />);
    await forDataToBeFetched(screen, someConnectedTracks);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(track1StartNodeId, nodesLayerId);
    selectFeatureOnMap(track1Id, selectableTracksId);
    const routeTracksLayer = await screen.findByText(/layer-id: route-tracks/i);

    expect(routeTracksLayer).toHaveTextContent(/filter: in,id,track1/i);
  });

  it("displays route end node on map", async () => {
    const track1StartNodeId = "node0";
    const nodesLayerId = "nodes";
    const track1Id = "track1";
    const selectableTracksId = "selectable-tracks";
    const someTracks = aFeatureCollectionWith([
      aTrackFeature({ id: "track1" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
    ]);
    setFetchGlobalMock(someTracks);
    render(<App />);
    await forDataToBeFetched(screen, someTracks);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(track1StartNodeId, nodesLayerId);
    selectFeatureOnMap(track1Id, selectableTracksId);
    const routeEndNodeLayer = await screen.findByText(
      /layer-id: route-end-node/i
    );

    expect(routeEndNodeLayer).toHaveTextContent(/visibility: visible/i);
    expect(routeEndNodeLayer).toHaveTextContent(/filter: in,id,node1/i);
  });

  it("displays route end node on map when prev track and last track share start and end points", async () => {
    const track1StartNodeId = "node0";
    const nodesLayerId = "nodes";
    const track1Id = "track1";
    const track2Id = "track2";
    const selectableTracksId = "selectable-tracks";
    const someConnectedTracks = aFeatureCollectionWith([
      aTrackFeature({ id: "track1", name: "track1" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
      aTrackFeature({ id: "track2", name: "track2" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
    ]);
    setFetchGlobalMock(someConnectedTracks);
    render(<App />);
    await forDataToBeFetched(screen, someConnectedTracks);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(track1StartNodeId, nodesLayerId);
    selectFeatureOnMap(track1Id, selectableTracksId);
    selectFeatureOnMap(track2Id, selectableTracksId);
    const routeEndNodeLayer = await screen.findByText(
      /layer-id: route-end-node/i
    );

    expect(routeEndNodeLayer).toHaveTextContent(/visibility: visible/i);
    expect(routeEndNodeLayer).toHaveTextContent(/filter: in,id,node0/i);
  });

  it("deletes current route's painted tracks on delete route button", async () => {
    const track1StartNodeId = "node0";
    const nodesLayerId = "nodes";
    const track1Id = "track1";
    const selectableTracksId = "selectable-tracks";
    const someConnectedTracks = aFeatureCollectionWith([
      aTrackFeature({ id: "track1" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
      aTrackFeature({ id: "track2" }, [
        [
          [2, 2],
          [3, 3],
        ],
      ]),
    ]);
    setFetchGlobalMock(someConnectedTracks);
    render(<App />);
    await forDataToBeFetched(screen, someConnectedTracks);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(track1StartNodeId, nodesLayerId);
    selectFeatureOnMap(track1Id, selectableTracksId);
    const deleteRouteButton = screen.getByLabelText("deleteRoute");
    fireEvent.click(deleteRouteButton);
    const routeTracksLayer = await screen.findByText(/layer-id: route-tracks/i);

    expect(routeTracksLayer).not.toHaveTextContent(/filter: in,id,track1/i);
  });

  it("deletes selected track on delete route button", async () => {
    const track1StartNodeId = "node0";
    const nodesLayerId = "nodes";
    const track1Id = "track1";
    const selectableTracksId = "selectable-tracks";
    const someConnectedTracks = aFeatureCollectionWith([
      aTrackFeature({ id: "track1" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
      aTrackFeature({ id: "track2" }, [
        [
          [2, 2],
          [3, 3],
        ],
      ]),
    ]);
    setFetchGlobalMock(someConnectedTracks);
    render(<App />);
    await forDataToBeFetched(screen, someConnectedTracks);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(track1StartNodeId, nodesLayerId);
    selectFeatureOnMap(track1Id, selectableTracksId);
    const deleteRouteButton = screen.getByLabelText("deleteRoute");
    fireEvent.click(deleteRouteButton);
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).not.toHaveTextContent(/filter: in,id,track1/i);
  });

  it("allows starting new route on delete route button", async () => {
    const routeStartNodeId = "node0";
    const nodesLayerId = "nodes";
    const track1Id = "track1";
    const selectableTracksId = "selectable-tracks";
    const someConnectedTracks = aFeatureCollectionWith([
      aTrackFeature({ id: "track1" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
      aTrackFeature({ id: "track2" }, [
        [
          [2, 2],
          [3, 3],
        ],
      ]),
    ]);
    setFetchGlobalMock(someConnectedTracks);
    render(<App />);
    await forDataToBeFetched(screen, someConnectedTracks);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(routeStartNodeId, nodesLayerId);
    selectFeatureOnMap(track1Id, selectableTracksId);
    const deleteRouteButton = screen.getByLabelText("deleteRoute");
    fireEvent.click(deleteRouteButton);
    const mockMap = screen.getByText(/mapstyle:mapbox/i);

    expect(mockMap).toHaveTextContent(/interactiveLayerIds:.*nodes/i);
  });

  it("updates route's length on adding new tracks", async () => {
    const routeStartNodeId = "node0";
    const nodesLayerId = "nodes";
    const track1Id = "track1";
    const track2Id = "track2";
    const selectableTracksId = "selectable-tracks";
    const someConnectedTracks = aFeatureCollectionWith([
      aTrackFeature({ id: "track1" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
      aTrackFeature({ id: "track2" }, [
        [
          [2, 2],
          [3, 3],
        ],
      ]),
    ]);
    setFetchGlobalMock(someConnectedTracks);
    render(<App />);
    await forDataToBeFetched(screen, someConnectedTracks);

    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(routeStartNodeId, nodesLayerId);
    selectFeatureOnMap(track1Id, selectableTracksId);
    const createRoutePanel = screen.getByLabelText("createRoutePanel");

    expect(createRoutePanel).toHaveTextContent(/157.4km/i);

    selectFeatureOnMap(track2Id, selectableTracksId);

    expect(createRoutePanel).toHaveTextContent(/314.8km/i);
  });

  it("removes last selected track from route on undo last selected track", async () => {
    const routeStartNodeId = "node0";
    const nodesLayerId = "nodes";
    const track1Id = "track1";
    const track2Id = "track2";
    const selectableTracksId = "selectable-tracks";
    const someConnectedTracks = aFeatureCollectionWith([
      aTrackFeature({ id: "track1" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
      aTrackFeature({ id: "track2" }, [
        [
          [2, 2],
          [3, 3],
        ],
      ]),
    ]);
    setFetchGlobalMock(someConnectedTracks);
    render(<App />);
    await forDataToBeFetched(screen, someConnectedTracks);
    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(routeStartNodeId, nodesLayerId);
    selectFeatureOnMap(track1Id, selectableTracksId);
    selectFeatureOnMap(track2Id, selectableTracksId);
    const routeTracksLayer = await screen.findByText(/layer-id: route-tracks/i);

    expect(routeTracksLayer).toHaveTextContent(/filter: in,id,track1,track2/i);

    const undoRouteButton = screen.getByLabelText("undoRoute");
    fireEvent.click(undoRouteButton);

    expect(routeTracksLayer).toHaveTextContent(/filter: in,id,track1/i);
  });

  it("updates next track options from route on undo last selected track", async () => {
    const routeStartNodeId = "node0";
    const nodesLayerId = "nodes";
    const track1Id = "track1";
    const track2Id = "track2";
    const selectableTracksId = "selectable-tracks";
    const someConnectedTracks = aFeatureCollectionWith([
      aTrackFeature({ id: "track1" }, [
        [
          [1, 1],
          [2, 2],
        ],
      ]),
      aTrackFeature({ id: "track2" }, [
        [
          [2, 2],
          [3, 3],
        ],
      ]),
    ]);
    setFetchGlobalMock(someConnectedTracks);
    render(<App />);
    await forDataToBeFetched(screen, someConnectedTracks);
    const createNewRouteButton = screen.getByLabelText("createRouteToolButton");
    fireEvent.click(createNewRouteButton);
    selectFeatureOnMap(routeStartNodeId, nodesLayerId);
    selectFeatureOnMap(track1Id, selectableTracksId);
    selectFeatureOnMap(track2Id, selectableTracksId);
    const selectableTracksLayer = await screen.findByText(
      /layer-id: selectable-tracks/i
    );
    const animatedTracksLayer = await screen.findByText(
      /layer-id: animated-tracks/i
    );

    expect(selectableTracksLayer).toHaveTextContent(/filter: in,idvisibility/i);
    expect(animatedTracksLayer).toHaveTextContent(/filter: in,idvisibility/i);

    const undoRouteButton = screen.getByLabelText("undoRoute");
    fireEvent.click(undoRouteButton);

    expect(selectableTracksLayer).toHaveTextContent(/filter: in,id,track2/i);
    expect(animatedTracksLayer).toHaveTextContent(/filter: in,id,track2/i);
  });
});
