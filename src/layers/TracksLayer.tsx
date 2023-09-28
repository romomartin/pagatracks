import { useEffect, useState } from "react";
import { Track } from "../tracks/track";
import { tracksStyle } from "./layer-styles";
import { Layer, Source } from "react-map-gl";
import { Feature, FeatureCollection } from "geojson";

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

const getTracks = async (): Promise<Track[]> => {
  const mergedRawTracks = await fetch("/data/mergedRawTracks.json").then(
    (response) => response.json()
  );

  const tracks: Track[] = mergedRawTracks.map((rawTrack: Feature) =>
    trackFromGeoJSON(rawTrack)
  );

  return tracks;
};

const trackFromGeoJSON = (geoJSON: Feature) => {
  const track: Track = {
    properties: { name: geoJSON.properties?.name || "no name" },
    geometry: geoJSON.geometry,
  };

  return track;
};

const tracksToFeatureCollection = (tracks: Track[]): FeatureCollection => {
  const features: Feature[] = tracks.map((track) => {
    return {
      type: "Feature",
      geometry: track.geometry,
      properties: track.properties,
    };
  });

  return { type: "FeatureCollection", features };
};
