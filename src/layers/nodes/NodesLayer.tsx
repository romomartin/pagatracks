import { FeatureCollection } from "geojson";
import { Layer, Source } from "react-map-gl";
import { nodesStyle } from "./nodes-layer-styles";

type NodesLayerProps = {
  nodes: FeatureCollection;
};

export const NodesLayer = ({ nodes }: NodesLayerProps): JSX.Element => {
  return (
    <>
      <Source id="nodes" type="geojson" data={nodes}>
        <Layer {...nodesStyle} />
      </Source>
    </>
  );
};
