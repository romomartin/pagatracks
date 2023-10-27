import { LineString } from "geojson";
import { Layer, MapboxGeoJSONFeature } from "mapbox-gl";

export const mockSelectedFeature = (): MapboxGeoJSONFeature => {
  return {
    id: undefined,
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [1, 1],
        [2, 2],
      ],
    } as LineString,
    layer: {} as Layer,
    properties: { name: "" },
    source: "",
    sourceLayer: "",
    state: {},
  };
};
