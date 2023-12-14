import {
  MapLayerMouseEvent,
  MapboxGeoJSONFeature,
  Visibility,
} from "mapbox-gl";
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
      const track = trackFromGeoJSON(rawTrack);
      acc[track.properties.name] = track;
      return acc;
    }, {} as TracksByName);

    setTracks(tracks);
  };

  const trackFeatures = tracksToFeatureCollection(Object.values(tracks));
  const nodeFeatures = nodesToFeatureCollection(connections.nodes);

  const [selectedFeature, setSelectedFeature] = useState<
    MapboxGeoJSONFeature | undefined
  >(undefined);
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string>("");

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const selectedFeature = event.features?.length
      ? event.features[0]
      : undefined;

    setSelectedFeature(selectedFeature);
  };

  const handleMapMouseOver = (event: MapLayerMouseEvent) => {
    const selectedFeature = event.features?.length
      ? event.features[0]
      : undefined;

    setHoveredFeatureId(selectedFeature ? selectedFeature.properties?.id : "");
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
    setSelectedFeature(undefined);
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
        selectedFeatureId={selectedFeature?.properties?.id || ""}
        hoveredFeatureId={hoveredFeatureId}
      ></MapCanvas>
      {selectedFeature?.properties?.name && (
        <ElevationChart
          selectedTrack={tracks[selectedFeature?.properties?.name]}
        ></ElevationChart>
      )}
      <SideMenu trackTools={[createRoute]}></SideMenu>
    </>
  );
}

export default App;
