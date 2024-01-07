import { LineLayer } from "mapbox-gl";
import { PathTypes } from "../../tracks/track";

const UNPAVED_COLOR = "#368E91";
const PAVED_COLOR = "#6D6784";
const SINGLETRACK_COLOR = "#B0597E";

const NULL_OPACITY = 0.00000000001;

export const tracksStyle: Omit<LineLayer, "id"> = {
  type: "line",
  paint: {
    "line-color": [
      "match",
      ["string", ["get", "path_type"]],
      PathTypes.UNPAVED,
      UNPAVED_COLOR,
      PathTypes.PAVED,
      PAVED_COLOR,
      PathTypes.SINGLETRACK,
      SINGLETRACK_COLOR,
      /* other */ "purple",
    ],
    "line-width": 3,
  },
};

export const selectableTracksStyle: Omit<LineLayer, "id"> = {
  type: "line",
  paint: {
    "line-color": "#959595",
    "line-width": 15,
    "line-opacity": NULL_OPACITY,
  },
};

export const highlightedTrackStyle: Omit<LineLayer, "id"> = {
  type: "line",
  paint: {
    "line-color": [
      "match",
      ["string", ["get", "path_type"]],
      PathTypes.UNPAVED,
      UNPAVED_COLOR,
      PathTypes.PAVED,
      PAVED_COLOR,
      PathTypes.SINGLETRACK,
      SINGLETRACK_COLOR,
      /* other */ "purple",
    ],
    "line-width": 13,
    "line-opacity": 0.3,
  },
  layout: {
    "line-cap": "round",
  },
};

export const routeTracksStyle: Omit<LineLayer, "id"> = {
  type: "line",
  paint: {
    "line-color": "yellow",
    "line-width": 13,
    "line-opacity": 1,
  },
  layout: {
    "line-cap": "round",
  },
};
