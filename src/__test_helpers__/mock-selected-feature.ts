import { LineString } from "geojson";
import { Layer, MapboxGeoJSONFeature } from "mapbox-gl";

export const mockSelectedFeature = (): MapboxGeoJSONFeature => {
  return {
    id: undefined,
    type: "Feature",
    geometry: {} as LineString,
    layer: {} as Layer,
    properties: { name: "" },
    source: "",
    sourceLayer: "",
    state: {},
  };
};
