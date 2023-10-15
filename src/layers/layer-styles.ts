import { LineLayer } from "mapbox-gl";

const UNPAVED_COLOR = "#368E91";
const PAVED_COLOR = "#6D6784";
const SINGLETRACK_COLOR = "#B0597E";
const SELECTED_COLOR = "#F9C80E";

export const tracksStyle: LineLayer = {
  id: "tracks",
  type: "line",
  paint: {
    "line-color": [
      "match",
      ["string", ["get", "path_type"]],
      "unpaved",
      UNPAVED_COLOR,
      "paved",
      PAVED_COLOR,
      "singletrack",
      SINGLETRACK_COLOR,
      /* other */ "purple",
    ],
    "line-width": 3,
  },
};

export const selectedTrackStyle: LineLayer = {
  id: "selected-track",
  type: "line",
  paint: {
    "line-color": SELECTED_COLOR,
    "line-width": 5,
  },
};
