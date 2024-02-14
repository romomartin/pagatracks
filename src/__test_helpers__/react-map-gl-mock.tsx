import { MockMap } from "./MockMap";
import { MockSource } from "./MockSource";
import { MockLayer } from "./MockLayer";
import { MockNavigationControl } from "./MockNavigationControl";

export const mockReactMapGl = () => {
  jest.mock("react-map-gl", () => {
    const lib = jest.requireActual("react-map-gl");

    return {
      ...lib,
      Map: MockMap,
      NavigationControl: MockNavigationControl,
      Source: MockSource,
      Layer: MockLayer,
    };
  });
};
