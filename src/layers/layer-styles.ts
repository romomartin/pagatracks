import { LineLayer } from "mapbox-gl";

export const tracksStyle: LineLayer = {
  id: "tracks",
  type: "line",
  paint: {
    "line-color": "red",
    "line-width": 3,
  },
};

export const selectedTrackStyle: LineLayer = {
  id: "selected-track",
  type: "line",
  paint: {
    "line-color": "blue",
    "line-width": 3,
  },
};
