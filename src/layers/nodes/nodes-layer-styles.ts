import { CircleLayer } from "mapbox-gl";

export const nodesStyle: Omit<CircleLayer, "id"> = {
  type: "circle",
  paint: {
    "circle-radius": 8,
    "circle-color": "rgba(55,148,179,1)",
  },
};
