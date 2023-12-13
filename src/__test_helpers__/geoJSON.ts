import { Feature, FeatureCollection } from "geojson";

export const aFeatureCollectionWith = (
  features: Feature[]
): FeatureCollection => {
  return {
    type: "FeatureCollection",
    features,
  };
};

export const aLineFeature = (name?: string): Feature => {
  const featureName = name || "featureName";
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
    properties: {
      name: featureName,
      path_type: "paved",
    },
  };
};

export const aPointFeature = (featureName: string): Feature => {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [1, 2] },
    properties: { id: featureName },
  };
};
