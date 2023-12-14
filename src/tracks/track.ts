import { Feature, FeatureCollection, Geometry } from "geojson";

export type Track = {
  id: string;
  properties: { name: string; path_type: string };
  geometry: Geometry;
};

export type TracksByName = { [trackName: string]: Track };

export const getTracks = async (): Promise<FeatureCollection> => {
  try {
    const result = await fetch("/data/tracks.json");
    const data = await result.json();
    return data;
  } catch (e) {
    console.error(`Unable to fetch tracks ${e}`);
    return {} as FeatureCollection;
  }
};

export const trackFromGeoJSON = (geoJSON: Feature) => {
  const track: Track = {
    id: geoJSON.properties?.id,
    properties: {
      name: geoJSON.properties?.name || "no name",
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
      properties: { id: track.id, ...track.properties },
    };
  });

  return { type: "FeatureCollection", features };
};
