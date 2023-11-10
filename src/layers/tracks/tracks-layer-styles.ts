import { LineLayer } from "mapbox-gl";

const UNPAVED_COLOR = "#368E91";
const PAVED_COLOR = "#6D6784";
const SINGLETRACK_COLOR = "#B0597E";

const NULL_OPACITY = 0.00000000001;

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

export const selectableTracksStyle: LineLayer = {
  id: "selectable-tracks",
  type: "line",
  paint: {
    "line-color": "#959595",
    "line-width": 15,
    "line-opacity": NULL_OPACITY,
  },
};

export const selectedTrackStyle: LineLayer = {
  id: "selected-track",
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
    "line-width": 13,
    "line-opacity": 0.3,
  },
  layout: {
    "line-cap": "round",
  },
};

export const hoveredTrackStyle: LineLayer = {
  id: "hovered-track",
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
    "line-width": 13,
    "line-opacity": 0.3,
  },
  layout: {
    "line-cap": "round",
  },
};
