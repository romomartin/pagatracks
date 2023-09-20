import { Track } from "./track";
import { Feature, FeatureCollection } from "geojson";
import mergedRawTracks from "../data/mergedRawTracks.json";

export const getTracks = (): Track[] => {
  const tracks: Track[] = mergedRawTracks.map((rawTrack) =>
    trackFromGeoJSON(rawTrack as Feature)
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
