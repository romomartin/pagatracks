import { Map, MapLayerMouseEvent } from "react-map-gl";
import { TracksLayer } from "../layers/tracks/TracksLayer";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

type MapProps = {
  tracks: FeatureCollection<Geometry, GeoJsonProperties>;
  onClick: (e: MapLayerMouseEvent) => void;
  selectedTrackName: string;
};

export const MapCanvas = ({ tracks, onClick, selectedTrackName }: MapProps) => {
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
      interactiveLayerIds={["tracks"]}
      onClick={onClick}
    >
      <TracksLayer
        tracks={tracks}
        selectedTrackName={selectedTrackName}
      ></TracksLayer>
    </Map>
  );
};
