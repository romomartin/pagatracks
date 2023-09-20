import { Layer, LineLayer, Source } from "react-map-gl";
import { getTracks, tracksToFeatureCollection } from "../tracks/tracks-service";

const tracksStyle: LineLayer = {
  id: "tracks",
  type: "line",
  paint: {
    "line-color": "red",
    "line-width": 3,
  },
};

export const TracksLayer = () => {
  const tracks = getTracks();

  const tracksFeatureCollection = tracksToFeatureCollection(tracks);

  return (
    <>
      <Source type="geojson" data={tracksFeatureCollection}>
        <Layer {...tracksStyle} />
      </Source>
    </>
  );
};
