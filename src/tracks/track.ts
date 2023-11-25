import { Feature, FeatureCollection, Geometry } from "geojson";

export type Track = {
  properties: { id: string; name: string; path_type: string };
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

export const trackFromGeoJSON = (geoJSON: Feature) => {
  const track: Track = {
    properties: {
      id: geoJSON.properties?.fid,
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
      properties: track.properties,
    };
  });

  return { type: "FeatureCollection", features };
};
