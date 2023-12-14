import { render, screen } from "@testing-library/react";
import { FeatureCollection } from "geojson";
import { NodesLayer } from "./NodesLayer";
import { aPointFeature } from "../../__test_helpers__/geoJSON";
import {
  highlightedNodeStyle,
  nodesStyle,
  selectedNodeStyle,
} from "./nodes-layer-styles";

describe("Nodes layer", () => {
  it("sets given nodes as source data", async () => {
    const nodeId = "node3";
    const otherNodeId = "node5";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(nodeId), aPointFeature(otherNodeId)],
    } as FeatureCollection;

    render(
      <NodesLayer
        nodes={nodes}
        nodesVisibility="none"
        hoveredFeatureId=""
        selectedFeatureId=""
      />
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
      <NodesLayer
        nodes={nodes}
        nodesVisibility="none"
        hoveredFeatureId=""
        selectedFeatureId=""
      />
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
      <NodesLayer
        nodes={nodes}
        nodesVisibility="none"
        hoveredFeatureId=""
        selectedFeatureId=""
      />
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
      <NodesLayer
        nodes={nodes}
        nodesVisibility="none"
        hoveredFeatureId=""
        selectedFeatureId=""
      />
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
      <NodesLayer
        nodes={nodes}
        nodesVisibility="none"
        hoveredFeatureId={nodeId}
        selectedFeatureId=""
      />
    );
    const hoveredNodeLayer = await screen.findByText(/layer-id: hovered-node/i);

    expect(hoveredNodeLayer).toHaveTextContent(/filter: in,id,node3/i);
  });

  it("applies selected node layer style", async () => {
    const nodeId = "node3";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(nodeId)],
    } as FeatureCollection;

    render(
      <NodesLayer
        nodes={nodes}
        nodesVisibility="none"
        hoveredFeatureId=""
        selectedFeatureId=""
      />
    );
    const selectedNodeLayer = await screen.findByText(
      /layer-id: selected-node/i
    );

    expect(selectedNodeLayer).toHaveTextContent(/type: circle/i);
    expect(selectedNodeLayer).toHaveTextContent(
      `paint: ${JSON.stringify(selectedNodeStyle.paint)}`
    );
  });

  it("applies selected node filter to selected node layer when provided", async () => {
    const nodeId = "node3";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(nodeId)],
    } as FeatureCollection;

    render(
      <NodesLayer
        nodes={nodes}
        nodesVisibility="none"
        hoveredFeatureId=""
        selectedFeatureId={nodeId}
      />
    );
    const selectedNodeLayer = await screen.findByText(
      /layer-id: selected-node/i
    );

    expect(selectedNodeLayer).toHaveTextContent(/filter: in,id,node3/i);
  });
});
