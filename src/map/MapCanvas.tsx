import { Map, MapLayerMouseEvent } from "react-map-gl";
import { TracksLayer } from "../layers/tracks/TracksLayer";
import { FeatureCollection } from "geojson";
import { NodesLayer } from "../layers/nodes/NodesLayer";
import { LayerIds, LayersVisibility } from "../layers";
import { Route } from "../track-tools/create-route/CreateRoute";
import { useState } from "react";
import { PointLayer } from "../layers/point/PointLayer";
import { PathTypes } from "../tracks/track";

type MapProps = {
  tracks: FeatureCollection;
  nodes: FeatureCollection;
  layersVisibility: LayersVisibility;
  interactiveLayers: LayerIds[];
  onSelectedFeature: (selectedFeatureId: string) => void;
  selectedFeatureId: string;
  currentRoute: Route;
  chartHoveredPoint: { x: number; y: number; pathType: PathTypes } | undefined;
};

export const MapCanvas = ({
  tracks,
  nodes,
  layersVisibility,
  interactiveLayers,
  onSelectedFeature,
  selectedFeatureId,
  currentRoute,
  chartHoveredPoint,
}: MapProps) => {
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string>("");

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const selectedFeature = event.features?.length
      ? event.features[0]
      : undefined;

    onSelectedFeature(selectedFeature?.properties?.id);
  };

  const handleMapMouseOver = (event: MapLayerMouseEvent) => {
    const hoveredFeature = event.features?.length
      ? event.features[0]
      : undefined;

    setHoveredFeatureId(hoveredFeature?.properties?.id || "");
  };

  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
      cursor="auto"
      mapStyle="mapbox://styles/piticli/clnra3qjx00g601o3622b5n40"
      initialViewState={{
        longitude: -2.94305,
        latitude: 43.21861,
        zoom: 13,
      }}
      interactiveLayerIds={interactiveLayers}
      onClick={handleMapClick}
      onMouseMove={handleMapMouseOver}
    >
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={selectedFeatureId}
        hoveredFeatureId={hoveredFeatureId}
        currentRoute={currentRoute}
      ></TracksLayer>
      <PointLayer point={chartHoveredPoint}></PointLayer>
      <NodesLayer
        nodes={nodes}
        layersVisibility={layersVisibility}
        hoveredFeatureId={hoveredFeatureId}
        routeStartNode={currentRoute.startPointId}
        routeEndNode={currentRoute.endPointId}
      ></NodesLayer>
    </Map>
  );
};
