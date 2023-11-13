import { FeatureCollection } from "geojson";
import { Layer, Source } from "react-map-gl";
import { nodesStyle } from "./nodes-layer-styles";
import { Visibility } from "mapbox-gl";

export enum NodeLayerIds {
  NODES = "nodes",
}

type NodesLayerProps = {
  nodes: FeatureCollection;
  nodesVisibility: Visibility;
};

export const NodesLayer = ({
  nodes,
  nodesVisibility,
}: NodesLayerProps): JSX.Element => {
  return (
    <>
      <Source id={NodeLayerIds.NODES} type="geojson" data={nodes}>
        <Layer
          id={NodeLayerIds.NODES}
          {...nodesStyle}
          layout={{ visibility: nodesVisibility }}
        />
      </Source>
    </>
  );
};
