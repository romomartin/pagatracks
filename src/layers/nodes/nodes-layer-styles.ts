import { CircleLayerSpecification, PropertyValueSpecification } from "mapbox-gl";

const START_COLOR = "#379237";
const END_COLOR = "#E02401";

export const nodesStyle: Omit<CircleLayerSpecification, "id"|"source"> = {
  type: "circle",
  paint: {
    "circle-radius": 5.5,
    "circle-color": "white",
  },
};

export const nodesGradientStyle: Omit<CircleLayerSpecification, "id"|"source"> = {
  type: "circle",
  paint: {
    "circle-radius": 15,
    "circle-color": "black",
    "circle-opacity": 0.6,
    "circle-blur": 1.3,
  },
};

export const startNodeStyle = (
  needsOffset: boolean
): Omit<CircleLayerSpecification, "id"|"source"> => {
  const offset:PropertyValueSpecification<[number, number]> = needsOffset ? [5, 0] : [0, 0];

  return {
    type: "circle",
    paint: {
      "circle-radius": 6,
      "circle-color": START_COLOR,
      "circle-translate": offset,
      "circle-stroke-width": 2,
      "circle-stroke-color": "white",
    },
  };
};

export const endNodeStyle = (needsOffset: boolean): Omit<CircleLayerSpecification, "id"|"source"> => {
  const offset:PropertyValueSpecification<[number, number]> = needsOffset ? [0, 5] : [0, 0];

  return {
    type: "circle",
    paint: {
      "circle-radius": 6,
      "circle-color": END_COLOR,
      "circle-translate": offset,
      "circle-stroke-width": 2,
      "circle-stroke-color": "white",
    },
  };
};
