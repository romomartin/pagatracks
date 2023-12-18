import { Map, MapLayerMouseEvent } from "react-map-gl";
import { TracksLayer } from "../layers/tracks/TracksLayer";
import { FeatureCollection } from "geojson";
import { NodesLayer } from "../layers/nodes/NodesLayer";
import { Visibility } from "mapbox-gl";
import { LayerIds } from "../layers";

type MapProps = {
  tracks: FeatureCollection;
  nodes: FeatureCollection;
  nodesVisibility: Visibility;
  interactiveLayers: LayerIds[];
  onSelectedFeature: (selectedFeatureId: string) => void;
  onHoveredFeature: (hoveredFeatureId: string) => void;
  selectedFeatureId: string;
  hoveredFeatureId: string;
};

export const MapCanvas = ({
  tracks,
  nodes,
  nodesVisibility,
  interactiveLayers,
  onSelectedFeature,
  onHoveredFeature,
  selectedFeatureId,
  hoveredFeatureId,
}: MapProps) => {
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

    onHoveredFeature(hoveredFeature?.properties?.id);
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
      ></TracksLayer>
      <NodesLayer
        nodes={nodes}
        nodesVisibility={nodesVisibility}
        selectedFeatureId={selectedFeatureId}
        hoveredFeatureId={hoveredFeatureId}
      ></NodesLayer>
    </Map>
  );
};
