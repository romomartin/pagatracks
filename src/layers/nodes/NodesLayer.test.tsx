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
        layersVisibility={{}}
        hoveredFeatureId=""
        routeStartNode=""
        routeEndNode=""
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
        layersVisibility={{}}
        hoveredFeatureId=""
        routeStartNode=""
        routeEndNode=""
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
        layersVisibility={{}}
        hoveredFeatureId=""
        routeStartNode=""
        routeEndNode=""
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
        layersVisibility={{}}
        hoveredFeatureId=""
        routeStartNode=""
        routeEndNode=""
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
        layersVisibility={{}}
        hoveredFeatureId={nodeId}
        routeStartNode=""
        routeEndNode=""
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
        layersVisibility={{}}
        hoveredFeatureId=""
        routeStartNode=""
        routeEndNode=""
      />
    );
    const routeStartNodeLayer = await screen.findByText(
      /layer-id: route-start-node/i
    );

    expect(routeStartNodeLayer).toHaveTextContent(/type: circle/i);
    expect(routeStartNodeLayer).toHaveTextContent(
      `paint: ${JSON.stringify(selectedNodeStyle.paint)}`
    );
  });

  it("applies node filter to route start node layer when provided", async () => {
    const nodeId = "node3";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(nodeId)],
    } as FeatureCollection;

    render(
      <NodesLayer
        nodes={nodes}
        layersVisibility={{}}
        hoveredFeatureId=""
        routeStartNode={nodeId}
        routeEndNode=""
      />
    );
    const routeStartNodeLayer = await screen.findByText(
      /layer-id: route-start-node/i
    );

    expect(routeStartNodeLayer).toHaveTextContent(/filter: in,id,node3/i);
  });

  it("applies node filter to route end node layer when provided", async () => {
    const startNodeId = "node3";
    const endNodeId = "node2";
    const nodes = {
      type: "FeatureCollection",
      features: [aPointFeature(startNodeId), aPointFeature(endNodeId)],
    } as FeatureCollection;

    render(
      <NodesLayer
        nodes={nodes}
        layersVisibility={{}}
        hoveredFeatureId=""
        routeStartNode={startNodeId}
        routeEndNode={endNodeId}
      />
    );
    const routeEndNodeLayer = await screen.findByText(
      /layer-id: route-end-node/i
    );

    expect(routeEndNodeLayer).toHaveTextContent(/filter: in,id,node2/i);
  });
});
