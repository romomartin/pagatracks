import { CircleLayer } from "mapbox-gl";

export const nodesStyle: Omit<CircleLayer, "id"> = {
  type: "circle",
  paint: {
    "circle-radius": 6.5,
    "circle-color": "rgba(55,148,179,1)",
  },
};

export const highlightedNodeStyle: Omit<CircleLayer, "id"> = {
  type: "circle",
  paint: {
    "circle-radius": 15,
    "circle-color": "rgba(55,148,179,1)",
    "circle-opacity": 0.3,
    "circle-blur": 0.3,
  },
};
