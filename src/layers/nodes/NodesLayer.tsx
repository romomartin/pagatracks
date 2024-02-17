import { FeatureCollection } from "geojson";
import { Layer, Source } from "react-map-gl";
import {
  endNodeStyle,
  nodesGradientStyle,
  nodesStyle,
  startNodeStyle,
} from "./nodes-layer-styles";
import { LayerVisibility, LayersVisibility } from "..";

export enum NodeLayerIds {
  NODES = "nodes-base",
  NODES_GRADIENT = "nodes-gradient",
  HOVERED_NODE = "hovered-node",
  ROUTE_START_NODE = "route-start-node",
  ROUTE_END_NODE = "route-end-node",
}

type NodesLayerProps = {
  nodes: FeatureCollection;
  layersVisibility: LayersVisibility;
  hoveredFeatureId: string;
  routeStartNode: string;
  routeEndNode: string;
};

export const NodesLayer = ({
  nodes,
  layersVisibility,
  hoveredFeatureId,
  routeStartNode,
  routeEndNode,
}: NodesLayerProps): JSX.Element => {
  return (
    <>
      <Source id={NodeLayerIds.NODES} type="geojson" data={nodes}>
        <Layer
          id={NodeLayerIds.ROUTE_START_NODE}
          {...startNodeStyle(
            routeStartNode === routeEndNode && routeStartNode !== ""
          )}
          layout={{
            visibility:
              layersVisibility[NodeLayerIds.ROUTE_START_NODE] ||
              LayerVisibility.NONE,
          }}
          filter={["in", "id", routeStartNode]}
        />
        <Layer
          id={NodeLayerIds.ROUTE_END_NODE}
          {...endNodeStyle(routeStartNode === routeEndNode)}
          layout={{
            visibility:
              layersVisibility[NodeLayerIds.ROUTE_END_NODE] ||
              LayerVisibility.NONE,
          }}
          filter={["in", "id", routeEndNode]}
        />
        <Layer
          id={NodeLayerIds.NODES_GRADIENT}
          {...nodesGradientStyle}
          layout={{
            visibility:
              layersVisibility[NodeLayerIds.NODES] || LayerVisibility.NONE,
          }}
        />
        <Layer
          id={NodeLayerIds.NODES}
          {...nodesStyle}
          layout={{
            visibility:
              layersVisibility[NodeLayerIds.NODES] || LayerVisibility.NONE,
          }}
        />
        <Layer
          id={NodeLayerIds.HOVERED_NODE}
          {...startNodeStyle(false)}
          layout={{
            visibility:
              layersVisibility[NodeLayerIds.HOVERED_NODE] ||
              LayerVisibility.NONE,
          }}
          filter={["in", "id", hoveredFeatureId]}
        />
      </Source>
    </>
  );
};
