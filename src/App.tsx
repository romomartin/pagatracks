import { MapLayerMouseEvent, Visibility } from "mapbox-gl";
import { MapCanvas } from "./map/MapCanvas";
import { useEffect, useState } from "react";
import { ElevationChart } from "./elevation-chart/ElevationChart";
import {
  TracksByName,
  getMergedRawTracks,
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
    const mergedRawTracks = await getMergedRawTracks();
    const tracks: TracksByName = {};
    mergedRawTracks.forEach((rawTrack: Feature) => {
      const track = trackFromGeoJSON(rawTrack);
      tracks[track.properties.name] = track;
    });
    setTracks(tracks);
  };

  const trackFeatures = tracksToFeatureCollection(Object.values(tracks));
  const nodeFeatures = nodesToFeatureCollection(connections.nodes);

  const [selectedTrackName, setSelectedTrackName] = useState<string>("");

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const selectedTrackName =
      event.features &&
      event.features[0] &&
      event.features[0]?.layer.id === TrackLayerIds.SELECTABLE_TRACKS
        ? event.features[0].properties?.name
        : "";
    setSelectedTrackName(selectedTrackName);
  };

  const [hoveredTrackName, setHoveredTrackName] = useState<string>("");

  const handleMapMouseOver = (event: MapLayerMouseEvent) => {
    const hoveredTrackName =
      event.features &&
      event.features[0] &&
      event.features[0].layer.id === TrackLayerIds.SELECTABLE_TRACKS
        ? event.features[0].properties?.name
        : "";
    setHoveredTrackName(hoveredTrackName);
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
      ></MapCanvas>
      {selectedTrackName && (
        <ElevationChart
          selectedTrack={tracks[selectedTrackName]}
        ></ElevationChart>
      )}
      <SideMenu handleCreateNewRoute={createNewRoute}></SideMenu>
    </>
  );
}

export default App;
