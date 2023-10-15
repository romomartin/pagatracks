import { Map, MapLayerMouseEvent, MapboxGeoJSONFeature } from "react-map-gl";
import { TracksLayer } from "../layers/TracksLayer";

type MapProps = {
  onClick: (e: MapLayerMouseEvent) => void;
  selectedTrack: MapboxGeoJSONFeature | undefined;
};

export const MapCanvas = ({ onClick, selectedTrack }: MapProps) => {
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
      mapStyle="mapbox://styles/piticli/clnr51es600fq01qwhfb207vn"
      initialViewState={{
        longitude: -2.94305,
        latitude: 43.21861,
        zoom: 13,
      }}
      interactiveLayerIds={["tracks"]}
      onClick={onClick}
    >
      <TracksLayer selectedTrack={selectedTrack}></TracksLayer>
    </Map>
  );
};
