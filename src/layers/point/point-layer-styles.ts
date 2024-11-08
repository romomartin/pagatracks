import { CircleLayerSpecification } from "mapbox-gl";
import { PathTypes } from "../../tracks/track";
import {
  PAVED_COLOR,
  SINGLETRACK_COLOR,
  UNPAVED_COLOR,
} from "../tracks/tracks-layer-styles";

export const pointStyle: Omit<CircleLayerSpecification, "id"|"source"> = {
  type: "circle",
  paint: {
    "circle-radius": 4.5,
    "circle-color": [
      "match",
      ["string", ["get", "pathType"]],
      PathTypes.UNPAVED,
      UNPAVED_COLOR,
      PathTypes.PAVED,
      PAVED_COLOR,
      PathTypes.SINGLETRACK,
      SINGLETRACK_COLOR,
      /* other */ "purple",
    ],
    "circle-stroke-color": "white",
    "circle-stroke-width": 2.5,
  },
};
