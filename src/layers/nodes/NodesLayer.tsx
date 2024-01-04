import { FeatureCollection } from "geojson";
import { Layer, Source } from "react-map-gl";
import {
  highlightedNodeStyle,
  nodesStyle,
  selectedNodeStyle,
} from "./nodes-layer-styles";
import { LayerVisibility, LayersVisibility } from "..";

export enum NodeLayerIds {
  NODES = "nodes",
  HOVERED_NODE = "hovered-node",
  ROUTE_START_NODE = "route-start-node",
}

type NodesLayerProps = {
  nodes: FeatureCollection;
  layersVisibility: LayersVisibility;
  hoveredFeatureId: string;
  routeStartNode: string;
};

export const NodesLayer = ({
  nodes,
  layersVisibility,
  hoveredFeatureId,
  routeStartNode,
}: NodesLayerProps): JSX.Element => {
  return (
    <>
      <Source id={NodeLayerIds.NODES} type="geojson" data={nodes}>
        <Layer
          id={NodeLayerIds.ROUTE_START_NODE}
          {...selectedNodeStyle}
          layout={{
            visibility:
              layersVisibility[NodeLayerIds.ROUTE_START_NODE] ||
              LayerVisibility.NONE,
          }}
          filter={["in", "id", routeStartNode]}
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
          {...highlightedNodeStyle}
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
