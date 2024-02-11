import { CircleLayer } from "mapbox-gl";

export const pointStyle: Omit<CircleLayer, "id"> = {
  type: "circle",
  paint: {
    "circle-radius": 3,
    "circle-color": "black",
    "circle-stroke-color": "white",
    "circle-stroke-width": 3.5,
  },
};
