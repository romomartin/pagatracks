import { render, screen } from "@testing-library/react";
import { Feature, FeatureCollection } from "geojson";
import { NodesLayer } from "./NodesLayer";

describe("Nodes layer", () => {
  it("Sets given nodes as source data", async () => {
    const nodeName = "nodeName";
    const otherNodeName = "otherNodeName";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(nodeName), aPointFeature(otherNodeName)],
    } as FeatureCollection;

    render(<NodesLayer nodes={nodes} />);
    const source = await screen.findByText(/source-id: nodes/i);

    expect(source).toHaveTextContent(/type: geojson/i);
    expect(source).toHaveTextContent(/data-type: FeatureCollection/i);
    expect(source).toHaveTextContent(
      /data-features:.*nodeName.*otherNodeName/i
    );
  });
});

const aPointFeature = (featureName: string): Feature => {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [1, 2] },
    properties: { id: featureName },
  };
};
