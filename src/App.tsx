import { MapLayerMouseEvent, Visibility } from "mapbox-gl";
import { MapCanvas } from "./map/MapCanvas";
import { useEffect, useState } from "react";
import { ElevationChart } from "./elevation-chart/ElevationChart";
import {
  TracksByName,
  getTracks,
  trackFromGeoJSON,
  tracksToFeatureCollection,
} from "./tracks/track";
import { Feature } from "geojson";
import { SideMenu } from "./side-menu/SideMenu";
import {
  Connections,
  buildConnectionsFromTracks,
  nullConnections,
} from "./network/build-connections";
import { nodesToFeatureCollection } from "./network/nodes-to-feature-collection";
import { LayerIds } from "./layers";
import { TrackLayerIds } from "./layers/tracks/TracksLayer";
import { NodeLayerIds } from "./layers/nodes/NodesLayer";
import { CreateRoute } from "./track-tools";

function App() {
  const [tracks, setTracks] = useState<TracksByName>({});
  const [connections, setConnections] = useState<Connections>(nullConnections);

  useEffect(() => {
    setTracksFromFetch();
  }, []);

  useEffect(() => {
    setConnections(buildConnectionsFromTracks(tracks));
  }, [tracks]);

  const setTracksFromFetch = async () => {
    const rawTracks = await getTracks();

    const tracks = rawTracks.features.reduce((acc, rawTrack: Feature) => {
      console.log(rawTrack);
      const track = trackFromGeoJSON(rawTrack);
      acc[track.properties.name] = track;
      return acc;
    }, {} as TracksByName);

    setTracks(tracks);
  };

  const trackFeatures = tracksToFeatureCollection(Object.values(tracks));
  const nodeFeatures = nodesToFeatureCollection(connections.nodes);

  const [selectedTrackName, setSelectedTrackName] = useState<string>("");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");

  const handleMapClick = (event: MapLayerMouseEvent) => {
    let selectedTrackName = "";
    let selectedNodeId = "";

    const selectedFeature = event.features?.length
      ? event.features[0]
      : undefined;

    if (!selectedFeature) {
      setSelectedTrackName(selectedTrackName);
      setSelectedNodeId(selectedNodeId);
      return;
    }

    if (selectedFeature.layer.id === TrackLayerIds.SELECTABLE_TRACKS)
      selectedTrackName = selectedFeature.properties?.name;
    if (selectedFeature.layer.id === NodeLayerIds.NODES)
      selectedNodeId = selectedFeature.properties?.id;

    setSelectedTrackName(selectedTrackName);
    setSelectedNodeId(selectedNodeId);
  };

  const [hoveredTrackName, setHoveredTrackName] = useState<string>("");
  const [hoveredNodeId, setHoveredNodeId] = useState<string>("");

  const handleMapMouseOver = (event: MapLayerMouseEvent) => {
    let hoveredTrackName = "";
    let hoveredNodeId = "";

    const hoveredFeature = event.features?.length
      ? event.features[0]
      : undefined;

    if (!hoveredFeature) {
      setHoveredTrackName(hoveredTrackName);
      setHoveredNodeId(hoveredNodeId);
      return;
    }

    if (hoveredFeature.layer.id === TrackLayerIds.SELECTABLE_TRACKS)
      hoveredTrackName = hoveredFeature.properties?.name;
    if (hoveredFeature.layer.id === NodeLayerIds.NODES)
      hoveredNodeId = hoveredFeature.properties?.id;

    setHoveredTrackName(hoveredTrackName);
    setHoveredNodeId(hoveredNodeId);
  };

  const [nodesVisibility, setNodesVisibility] = useState<Visibility>("none");
  const [interactiveLayers, setInteractiveLayers] = useState<LayerIds[]>([
    TrackLayerIds.SELECTABLE_TRACKS,
  ]);

  const createNewRoute = (): void => {
    nodesVisibility === "none"
      ? setNodesVisibility("visible")
      : setNodesVisibility("none");

    setInteractiveLayers([NodeLayerIds.NODES]);
    setSelectedTrackName("");
  };

  const createRoute = CreateRoute({
    handleCreateNewRoute: createNewRoute,
  });

  return (
    <>
      <MapCanvas
        tracks={trackFeatures}
        nodes={nodeFeatures}
        nodesVisibility={nodesVisibility}
        interactiveLayers={interactiveLayers}
        onClick={handleMapClick}
        onMouseMove={handleMapMouseOver}
        selectedTrackName={selectedTrackName}
        hoveredTrackName={hoveredTrackName}
        hoveredNodeId={hoveredNodeId}
        selectedNodeId={selectedNodeId}
      ></MapCanvas>
      {selectedTrackName && (
        <ElevationChart
          selectedTrack={tracks[selectedTrackName]}
        ></ElevationChart>
      )}
      <SideMenu trackTools={[createRoute]}></SideMenu>
    </>
  );
}

export default App;
