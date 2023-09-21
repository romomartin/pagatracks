import { Track } from "./track";
import { Feature, FeatureCollection } from "geojson";

export const getTracks = async (): Promise<Track[]> => {
  const mergedRawTracks = await fetch("/data/mergedRawTracks.json").then(
    (response) => response.json()
  );

  const tracks: Track[] = mergedRawTracks.map((rawTrack: Feature) =>
    trackFromGeoJSON(rawTrack)
  );

  return tracks;
};

export const trackFromGeoJSON = (geoJSON: Feature) => {
  const track: Track = {
    properties: { name: geoJSON.properties?.name || "no name" },
    geometry: geoJSON.geometry,
  };

  return track;
};

export const tracksToFeatureCollection = (
  tracks: Track[]
): FeatureCollection => {
  const features: Feature[] = tracks.map((track) => {
    return {
      type: "Feature",
      geometry: track.geometry,
      properties: track.properties,
    };
  });

  return { type: "FeatureCollection", features };
};
