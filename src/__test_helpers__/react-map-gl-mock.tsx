import { MockMap } from "./MockMap";
import { MockSource } from "./MockSource";

export const mockReactMapGl = () => {
  jest.mock("react-map-gl", () => {
    const lib = jest.requireActual("react-map-gl");

    return {
      ...lib,
      Map: MockMap,
      Source: MockSource,
    };
  });
};
