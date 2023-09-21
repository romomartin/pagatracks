import { Layer, LineLayer, Source } from "react-map-gl";
import { getTracks, tracksToFeatureCollection } from "../tracks/tracks-service";
import { useEffect, useState } from "react";
import { Track } from "../tracks/track";

const tracksStyle: LineLayer = {
  id: "tracks",
  type: "line",
  paint: {
    "line-color": "red",
    "line-width": 3,
  },
};

export const TracksLayer = () => {
  const [tracks, setTracks] = useState<Track[]>([]);

  const fetchTracks = async () => {
    const tracks = await getTracks();
    setTracks(tracks);
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const tracksFeatureCollection = tracksToFeatureCollection(tracks);

  return (
    <>
      <Source type="geojson" data={tracksFeatureCollection}>
        <Layer {...tracksStyle} />
      </Source>
    </>
  );
};
