import { render, screen } from "@testing-library/react";
import { FeatureCollection } from "geojson";
import { NodesLayer } from "./NodesLayer";
import { aPointFeature } from "../../__test_helpers__/geoJSON";
import { nodesStyle } from "./nodes-layer-styles";

describe("Nodes layer", () => {
  it("sets given nodes as source data", async () => {
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

  it("applies nodes layer styles", async () => {
    const nodeName = "nodeName";
    const otherNodeName = "otherNodeName";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(nodeName), aPointFeature(otherNodeName)],
    } as FeatureCollection;

    render(<NodesLayer nodes={nodes} />);
    const nodesLayer = await screen.findByText(/layer-id: nodes/i);

    expect(nodesLayer).toHaveTextContent(/type: circle/i);
    expect(nodesLayer).toHaveTextContent(
      `paint: ${JSON.stringify(nodesStyle.paint)}`
    );
  });

  it("sets default visibillity as non visible", async () => {
    const nodeName = "nodeName";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(nodeName)],
    } as FeatureCollection;

    render(<NodesLayer nodes={nodes} />);
    const nodesLayer = await screen.findByText(/layer-id: nodes/i);

    expect(nodesLayer).toHaveTextContent(/visibility: none/i);
  });
});
