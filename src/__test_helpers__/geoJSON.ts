import { Feature, FeatureCollection } from "geojson";

export type TrackFeatureProps = {
  id?: string;
  name?: string;
  path_type?: string;
};

export const aFeatureCollectionWith = (
  features: Feature[]
): FeatureCollection => {
  return {
    type: "FeatureCollection",
    features,
  };
};

export const aTrackFeature = (properties?: TrackFeatureProps): Feature => {
  const trackProperties: TrackFeatureProps = {
    id: "aTrackId",
    name: "aTrackName",
    path_type: "paved",
    ...properties,
  };
  return {
    type: "Feature",
    geometry: {
      type: "MultiLineString",
      coordinates: [
        [
          [1, 2, 10],
          [3, 4, 12],
        ],
      ],
    },
    properties: trackProperties,
  };
};

export const aPointFeature = (featureName: string): Feature => {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [1, 2] },
    properties: { id: featureName },
  };
};
