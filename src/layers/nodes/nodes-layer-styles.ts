import { CircleLayer } from "mapbox-gl";

const START_COLOR = "#379237";
const END_COLOR = "#E02401";

export const nodesStyle: Omit<CircleLayer, "id"> = {
  type: "circle",
  paint: {
    "circle-radius": 6.5,
    "circle-color": START_COLOR,
  },
};

export const highlightedNodeStyle: Omit<CircleLayer, "id"> = {
  type: "circle",
  paint: {
    "circle-radius": 15,
    "circle-color": START_COLOR,
    "circle-opacity": 0.6,
    "circle-blur": 0.3,
  },
};

export const startNodeStyle = (
  needsOffset: boolean
): Omit<CircleLayer, "id"> => {
  const offset = needsOffset ? [5, 0] : [0, 0];

  return {
    type: "circle",
    paint: {
      "circle-radius": 7,
      "circle-color": START_COLOR,
      "circle-translate": offset,
    },
  };
};

export const endNodeStyle = (needsOffset: boolean): Omit<CircleLayer, "id"> => {
  const offset = needsOffset ? [0, 5] : [0, 0];

  return {
    type: "circle",
    paint: {
      "circle-radius": 7,
      "circle-color": END_COLOR,
      "circle-translate": offset,
    },
  };
};
