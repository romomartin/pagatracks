import { LineString } from "geojson";
import { GeoJSONFeature, Layer } from "mapbox-gl";

export const mockHoveredFeature = (): GeoJSONFeature => {
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
    properties: { name: "" },
    source: "",
    sourceLayer: "",
    state: {},
  };
};
