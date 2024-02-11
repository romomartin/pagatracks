import { MapCanvas } from "./map/MapCanvas";
import { useCallback, useEffect, useMemo, useState } from "react";
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
    const setupInitialData = async () => {
      const rawTracks = await getTracks();

      const tracks = rawTracks.features.reduce((acc, rawTrack: Feature) => {
        const track = trackFromGeoJSON(rawTrack);
        acc[track.id] = track;
        return acc;
      }, {} as TracksById);

      setTracks(tracks);
      setConnections(buildConnectionsFromTracks(tracks));
    };

    setupInitialData();
  }, []);

  const trackFeatures = useMemo(
    () => tracksToFeatureCollection(Object.values(tracks)),
    [tracks]
  );
  const nodeFeatures = useMemo(
    () => nodesToFeatureCollection(connections.nodes),
    [connections]
  );

  const [selectedFeatureId, setSelectedFeatureId] = useState<
    string | undefined
  >(undefined);
  const changeSelectedFeatureId = (selectedFeatureId: string | undefined) => {
    setSelectedFeatureId(selectedFeatureId);
  };

  const [chartHoveredPoint, setChartHoveredPoint] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const changeChartHoveredPoint = useCallback(
    (point: { x: number; y: number } | undefined) => {
      setChartHoveredPoint(point);
    },
    []
  );

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

  const [currentRoute, setCurrentRoute] = useState<Route>(nullRoute);
  const updateCurrentRoute = (route: Route) => {
    setCurrentRoute({ ...currentRoute, ...route });
  };

  const createRoute = CreateRoute({
    tracks,
    currentRoute,
    updateCurrentRoute,
    changeLayersVisibility,
    changeInteractiveLayers,
    changeSelectedFeatureId,
    selectedFeatureId,
    connectionIndex: connections.connectionIndex,
  });

  return (
    <>
      <MapCanvas
        tracks={trackFeatures}
        nodes={nodeFeatures}
        layersVisibility={layersVisibility}
        interactiveLayers={interactiveLayers}
        onSelectedFeature={changeSelectedFeatureId}
        selectedFeatureId={selectedFeatureId || ""}
        currentRoute={currentRoute}
        chartHoveredPoint={chartHoveredPoint}
      ></MapCanvas>
      {(selectedFeatureId && tracks[selectedFeatureId]) ||
      currentRoute.segments.length > 0 ? (
        <ElevationChart
          selectedTrack={
            selectedFeatureId ? tracks[selectedFeatureId] : undefined
          }
          currentRoute={currentRoute}
          connectionIndex={connections.connectionIndex}
          changeChartHoveredPoint={changeChartHoveredPoint}
        />
      ) : null}
      <SideMenu trackTools={[createRoute]}></SideMenu>
    </>
  );
}

export default App;
