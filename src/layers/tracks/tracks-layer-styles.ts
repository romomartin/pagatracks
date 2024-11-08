import { LineLayerSpecification } from "mapbox-gl";
import { PathTypes } from "../../tracks/track";

export const UNPAVED_COLOR = "#C70039";
export const PAVED_COLOR = "#6930C3";
export const SINGLETRACK_COLOR = "#175920";

const NULL_OPACITY = 0.00000000001;

export const tracksStyle: Omit<LineLayerSpecification, "id" | "source"> = {
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
    "line-width": 2,
  },
};

export const selectableTracksStyle: Omit<LineLayerSpecification, "id" | "source"> = {
  type: "line",
  paint: {
    "line-color": "#959595",
    "line-width": 15,
    "line-opacity": NULL_OPACITY,
  },
};

export const highlightedTrackStyle: Omit<LineLayerSpecification, "id" | "source"> = {
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

export const nextPossibleTracksNormalStyle: Omit<LineLayerSpecification, "id" | "source"> = {
  type: "line",
  paint: {
    "line-width": 13,
    "line-gradient": [
      "interpolate",
      ["linear"],
      ["line-progress"],
      0,
      "white", // Start color
      0.5,
      "rgba(0, 0, 255, 0)", // End color
    ],
  },
  layout: {
    "line-cap": "round",
  },
};

export const nextPossibleTracksReversedStyle: Omit<LineLayerSpecification, "id" | "source"> = {
  type: "line",
  paint: {
    "line-width": 13,
    "line-gradient": [
      "interpolate",
      ["linear"],
      ["line-progress"],
      0.5,
      "rgba(0, 0, 255, 0)", // Start color
      1,
      "white", // End color
    ],
  },
  layout: {
    "line-cap": "round",
  },
};

export const routeTracksStyle: Omit<LineLayerSpecification, "id" | "source"> = {
  type: "line",
  paint: {
    "line-color": "white",
    "line-opacity": 0.9,
    "line-width": 4,
    "line-dasharray": [0.1, 3, 0.1],
  },
  layout: {
    "line-cap": "round",
  },
};
export const routeTracksStyle2: Omit<LineLayerSpecification, "id" | "source"> = {
  type: "line",
  paint: {
    "line-color": "white",
    "line-opacity": 1,
    "line-width": 5,
  },
  layout: {
    "line-cap": "round",
  },
};
