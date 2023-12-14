import { Feature, FeatureCollection, Geometry } from "geojson";

export type Track = {
  id: string;
  properties: { name: string; path_type: PathTypes };
  geometry: Geometry;
};

export enum PathTypes {
  PAVED = "paved",
  UNPAVED = "unpaved",
  SINGLETRACK = "singletrack",
  UNKNOWN = "unknown",
}

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
  const rawPathType = geoJSON.properties?.path_type;

  const track: Track = {
    id: geoJSON.properties?.id,
    properties: {
      name: geoJSON.properties?.name || "no name",
      path_type: isValidType(rawPathType)
        ? (rawPathType as PathTypes)
        : PathTypes.UNKNOWN,
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

const isValidType = (rawPathType: string): boolean => {
  const pathTypeValues = Object.entries(PathTypes).map((type) => type[1]);

  return pathTypeValues.filter((type) => type === rawPathType).length > 0;
};
