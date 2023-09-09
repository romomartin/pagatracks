import { Map } from "react-map-gl";

export const MapCanvas = () => {
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
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
    ></Map>
  );
};
