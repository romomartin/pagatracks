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
  SELECTED_NODE = "selected-node",
}

type NodesLayerProps = {
  nodes: FeatureCollection;
  layersVisibility: LayersVisibility;
  selectedFeatureId: string;
  hoveredFeatureId: string;
};

export const NodesLayer = ({
  nodes,
  layersVisibility,
  selectedFeatureId,
  hoveredFeatureId,
}: NodesLayerProps): JSX.Element => {
  return (
    <>
      <Source id={NodeLayerIds.NODES} type="geojson" data={nodes}>
        <Layer
          id={NodeLayerIds.SELECTED_NODE}
          {...selectedNodeStyle}
          layout={{
            visibility:
              layersVisibility[NodeLayerIds.SELECTED_NODE] ||
              LayerVisibility.NONE,
          }}
          filter={["in", "id", selectedFeatureId]}
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
