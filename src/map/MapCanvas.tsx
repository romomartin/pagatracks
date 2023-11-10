import { Map, MapLayerMouseEvent } from "react-map-gl";
import { TracksLayer } from "../layers/tracks/TracksLayer";
import { FeatureCollection } from "geojson";
import { NodesLayer } from "../layers/nodes/NodesLayer";

type MapProps = {
  tracks: FeatureCollection;
  nodes: FeatureCollection;
  onClick: (e: MapLayerMouseEvent) => void;
  onMouseMove: (e: MapLayerMouseEvent) => void;
  selectedTrackName: string;
  hoveredTrackName: string;
};

export const MapCanvas = ({
  tracks,
  nodes,
  onClick,
  onMouseMove,
  selectedTrackName,
  hoveredTrackName,
}: MapProps) => {
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
      mapStyle="mapbox://styles/piticli/clnra3qjx00g601o3622b5n40"
      initialViewState={{
        longitude: -2.94305,
        latitude: 43.21861,
        zoom: 13,
      }}
      interactiveLayerIds={["selectable-tracks"]}
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      <TracksLayer
        tracks={tracks}
        selectedTrackName={selectedTrackName}
        hoveredTrackName={hoveredTrackName}
      ></TracksLayer>
      <NodesLayer nodes={nodes}></NodesLayer>
    </Map>
  );
};
