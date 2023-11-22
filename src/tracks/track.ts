import { Feature, FeatureCollection, Geometry } from "geojson";
import { texts } from "../texts";

export type Track = {
  id: string;
  properties: { name: string; path_type: string };
  geometry: Geometry;
};

export type TracksByName = { [trackName: string]: Track };

export const getMergedRawTracks = async (): Promise<Feature[]> => {
  try {
    const result = await fetch("/data/mergedRawTracks.json");
    const data = await result.json();
    return data;
  } catch (e) {
    console.error(`Unable to fetch tracks ${e}`);
    return [];
  }
};

export const trackFromGeoJSON = (geoJSON: Feature, id: string) => {
  const track: Track = {
    id,
    properties: {
      name: geoJSON.properties?.name || texts.defaultTrackName,
      path_type: geoJSON.properties?.path_type,
    },
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
