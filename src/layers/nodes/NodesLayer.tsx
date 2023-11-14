import { FeatureCollection } from "geojson";
import { Layer, Source } from "react-map-gl";
import { highlightedNodeStyle, nodesStyle } from "./nodes-layer-styles";
import { Visibility } from "mapbox-gl";

export enum NodeLayerIds {
  NODES = "nodes",
  HOVERED_NODE = "hovered-node",
}

type NodesLayerProps = {
  nodes: FeatureCollection;
  nodesVisibility: Visibility;
  hoveredNodeId: string;
};

export const NodesLayer = ({
  nodes,
  nodesVisibility,
  hoveredNodeId,
}: NodesLayerProps): JSX.Element => {
  return (
    <>
      <Source id={NodeLayerIds.NODES} type="geojson" data={nodes}>
        <Layer
          id={NodeLayerIds.NODES}
          {...nodesStyle}
          layout={{ visibility: nodesVisibility }}
        />
        <Layer
          id={NodeLayerIds.HOVERED_NODE}
          {...highlightedNodeStyle}
          layout={{ visibility: nodesVisibility }}
          filter={["in", "id", hoveredNodeId]}
        />
      </Source>
    </>
  );
};
