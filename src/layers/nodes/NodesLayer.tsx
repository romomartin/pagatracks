import { FeatureCollection } from "geojson";
import { Layer, Source } from "react-map-gl";
import {
  highlightedNodeStyle,
  nodesStyle,
  selectedNodeStyle,
} from "./nodes-layer-styles";
import { Visibility } from "mapbox-gl";

export enum NodeLayerIds {
  NODES = "nodes",
  HOVERED_NODE = "hovered-node",
  SELECTED = "selected-node",
}

type NodesLayerProps = {
  nodes: FeatureCollection;
  nodesVisibility: Visibility;
  selectedFeatureId: string;
  hoveredFeatureId: string;
};

export const NodesLayer = ({
  nodes,
  nodesVisibility,
  selectedFeatureId,
  hoveredFeatureId,
}: NodesLayerProps): JSX.Element => {
  return (
    <>
      <Source id={NodeLayerIds.NODES} type="geojson" data={nodes}>
        <Layer
          id={NodeLayerIds.SELECTED}
          {...selectedNodeStyle}
          layout={{ visibility: nodesVisibility }}
          filter={["in", "id", selectedFeatureId]}
        />
        <Layer
          id={NodeLayerIds.NODES}
          {...nodesStyle}
          layout={{ visibility: nodesVisibility }}
        />
        <Layer
          id={NodeLayerIds.HOVERED_NODE}
          {...highlightedNodeStyle}
          layout={{ visibility: nodesVisibility }}
          filter={["in", "id", hoveredFeatureId]}
        />
      </Source>
    </>
  );
};
