import { CircleLayer } from "mapbox-gl";

export const nodesStyle: CircleLayer = {
  id: "nodes",
  type: "circle",
  paint: {
    "circle-radius": 8,
    "circle-color": "rgba(55,148,179,1)",
  },
};
