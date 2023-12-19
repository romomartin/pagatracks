import { Visibility } from "mapbox-gl";
import { MapCanvas } from "./map/MapCanvas";
import { useEffect, useState } from "react";
import { ElevationChart } from "./elevation-chart/ElevationChart";
import {
  TracksById,
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
import { CreateRoute } from "./track-tools";

function App() {
  const [tracks, setTracks] = useState<TracksById>({});
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
      acc[track.id] = track;
      return acc;
    }, {} as TracksById);

    setTracks(tracks);
  };

  const trackFeatures = tracksToFeatureCollection(Object.values(tracks));
  const nodeFeatures = nodesToFeatureCollection(connections.nodes);

  const [selectedFeatureId, setSelectedFeatureId] = useState<
    string | undefined
  >(undefined);
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | undefined>(
    undefined
  );

  const changeSelectedFeatureId = (selectedFeatureId: string) => {
    setSelectedFeatureId(selectedFeatureId);
  };

  const handleHoveredFeatureId = (hoveredFeatureId: string) => {
    setHoveredFeatureId(hoveredFeatureId);
  };

  const [nodesVisibility, setNodesVisibility] = useState<Visibility>("none");
  const changeNodesVisibility = (visibility: Visibility) => {
    setNodesVisibility(visibility);
  };

  const [interactiveLayers, setInteractiveLayers] = useState<LayerIds[]>([
    TrackLayerIds.SELECTABLE_TRACKS,
  ]);
  const changeInteractiveLayers = (layerIds: LayerIds[]) => {
    setInteractiveLayers(layerIds);
  };

  const createRoute = CreateRoute({
    changeNodesVisibility,
    changeInteractiveLayers,
    changeSelectedFeatureId,
    selectedNodeId: selectedFeatureId,
  });

  return (
    <>
      <MapCanvas
        tracks={trackFeatures}
        nodes={nodeFeatures}
        nodesVisibility={nodesVisibility}
        interactiveLayers={interactiveLayers}
        onSelectedFeature={changeSelectedFeatureId}
        onHoveredFeature={handleHoveredFeatureId}
        selectedFeatureId={selectedFeatureId || ""}
        hoveredFeatureId={hoveredFeatureId || ""}
      ></MapCanvas>
      {selectedFeatureId && tracks[selectedFeatureId] && (
        <ElevationChart
          selectedTrack={tracks[selectedFeatureId]}
        ></ElevationChart>
      )}
      <SideMenu trackTools={[createRoute]}></SideMenu>
    </>
  );
}

export default App;
