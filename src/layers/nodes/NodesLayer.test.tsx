import { render, screen } from "@testing-library/react";
import { FeatureCollection } from "geojson";
import { NodesLayer } from "./NodesLayer";
import { aPointFeature } from "../../__test_helpers__/geoJSON";
import { highlightedNodeStyle, nodesStyle } from "./nodes-layer-styles";

describe("Nodes layer", () => {
  it("sets given nodes as source data", async () => {
    const nodeId = "node3";
    const otherNodeId = "node5";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(nodeId), aPointFeature(otherNodeId)],
    } as FeatureCollection;

    render(
      <NodesLayer nodes={nodes} nodesVisibility="none" hoveredNodeId="" />
    );
    const source = await screen.findByText(/source-id: nodes/i);

    expect(source).toHaveTextContent(/type: geojson/i);
    expect(source).toHaveTextContent(/data-type: FeatureCollection/i);
    expect(source).toHaveTextContent(/data-features:.*node3.*node5/i);
  });

  it("applies nodes layer styles", async () => {
    const nodeId = "node3";
    const otherNodeId = "node5";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(nodeId), aPointFeature(otherNodeId)],
    } as FeatureCollection;

    render(
      <NodesLayer nodes={nodes} nodesVisibility="none" hoveredNodeId="" />
    );
    const nodesLayer = await screen.findByText(/layer-id: nodes/i);

    expect(nodesLayer).toHaveTextContent(/type: circle/i);
    expect(nodesLayer).toHaveTextContent(
      `paint: ${JSON.stringify(nodesStyle.paint)}`
    );
  });

  it("sets nodes visibillity from prop value", async () => {
    const nodeId = "node3";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(nodeId)],
    } as FeatureCollection;

    render(
      <NodesLayer nodes={nodes} nodesVisibility="none" hoveredNodeId="" />
    );
    const nodesLayer = await screen.findByText(/layer-id: nodes/i);

    expect(nodesLayer).toHaveTextContent(/visibility: none/i);
  });

  it("applies hovered node layer style", async () => {
    const nodeId = "node3";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(nodeId)],
    } as FeatureCollection;

    render(
      <NodesLayer nodes={nodes} nodesVisibility="none" hoveredNodeId="" />
    );
    const hoveredNodeLayer = await screen.findByText(/layer-id: hovered-node/i);

    expect(hoveredNodeLayer).toHaveTextContent(/type: circle/i);
    expect(hoveredNodeLayer).toHaveTextContent(
      `paint: ${JSON.stringify(highlightedNodeStyle.paint)}`
    );
  });

  it("applies hovered node filter to hovered node layer when provided", async () => {
    const nodeId = "node3";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(nodeId)],
    } as FeatureCollection;

    render(
      <NodesLayer nodes={nodes} nodesVisibility="none" hoveredNodeId={nodeId} />
    );
    const hoveredNodeLayer = await screen.findByText(/layer-id: hovered-node/i);

    expect(hoveredNodeLayer).toHaveTextContent(/filter: in,id,node3/i);
  });
});
