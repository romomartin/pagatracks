import { FeatureCollection } from "geojson";
import { Layer, Source } from "react-map-gl";
import { nodesStyle } from "./nodes-layer-styles";

export enum NodeLayerIds {
  NODES = "nodes",
}

type NodesLayerProps = {
  nodes: FeatureCollection;
};

export const NodesLayer = ({ nodes }: NodesLayerProps): JSX.Element => {
  return (
    <>
      <Source id={NodeLayerIds.NODES} type="geojson" data={nodes}>
        <Layer {...nodesStyle} layout={{ visibility: "none" }} />
      </Source>
    </>
  );
};
