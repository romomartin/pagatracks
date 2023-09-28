import { LineLayer } from "mapbox-gl";

export const tracksStyle: LineLayer = {
  id: "tracks",
  type: "line",
  paint: {
    "line-color": "red",
    "line-width": 3,
  },
};
