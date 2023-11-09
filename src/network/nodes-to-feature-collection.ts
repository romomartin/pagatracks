import { Feature, FeatureCollection } from "geojson";
import { ConnectionNode } from "./build-connections";

export const nodesToFeatureCollection = (
  nodes: ConnectionNode[]
): FeatureCollection => {
  const features = nodes.map((node) => {
    return {
      type: "Feature",
      geometry: node.geometry,
      properties: { id: node.id },
    } as Feature;
  });
  return { type: "FeatureCollection", features };
};
