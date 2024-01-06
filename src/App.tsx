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
import { LayerIds, LayersVisibility } from "./layers";
import { TrackLayerIds } from "./layers/tracks/TracksLayer";
import { CreateRoute } from "./track-tools";
import { Route, nullRoute } from "./track-tools/create-route/CreateRoute";

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
  const changeSelectedFeatureId = (selectedFeatureId: string | undefined) => {
    setSelectedFeatureId(selectedFeatureId);
  };

  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | undefined>(
    undefined
  );
  const handleHoveredFeatureId = (hoveredFeatureId: string | undefined) => {
    setHoveredFeatureId(hoveredFeatureId);
  };

  const [layersVisibility, setLayersVisibility] = useState<LayersVisibility>(
    {}
  );
  const changeLayersVisibility = (layersVisibility: LayersVisibility) => {
    setLayersVisibility((prevVisibility) => ({
      ...prevVisibility,
      ...layersVisibility,
    }));
  };

  const [interactiveLayers, setInteractiveLayers] = useState<LayerIds[]>([
    TrackLayerIds.SELECTABLE_TRACKS,
  ]);
  const changeInteractiveLayers = (layerIds: LayerIds[]) => {
    setInteractiveLayers(layerIds);
  };

  const [selectableTracksIds, setSelectableTracksIds] = useState<string[]>([]);
  const changeSelectableTracks = (tracksIds: string[]) => {
    setSelectableTracksIds(tracksIds);
  };

  const [animatedTracksIds, setAnimatedTracksIds] = useState<string[]>([]);
  const animateTracks = (tracksIds: string[]) => {
    setAnimatedTracksIds(tracksIds);
  };

  const [currentRoute, setCurrentRoute] = useState<Route>(nullRoute);
  const updateCurrentRoute = (route: Route) => {
    setCurrentRoute({ ...currentRoute, ...route });
  };

  const createRoute = CreateRoute({
    currentRoute,
    updateCurrentRoute,
    changeLayersVisibility,
    changeInteractiveLayers,
    changeSelectedFeatureId,
    changeSelectableTracks,
    selectedFeatureId,
    connectionIndex: connections.connectionIndex,
    animateTracks,
  });

  return (
    <>
      <MapCanvas
        tracks={trackFeatures}
        nodes={nodeFeatures}
        layersVisibility={layersVisibility}
        interactiveLayers={interactiveLayers}
        onSelectedFeature={changeSelectedFeatureId}
        onHoveredFeature={handleHoveredFeatureId}
        selectedFeatureId={selectedFeatureId || ""}
        hoveredFeatureId={hoveredFeatureId || ""}
        animatedTracksIds={animatedTracksIds}
        selectableTracksIds={selectableTracksIds}
        currentRoute={currentRoute}
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
