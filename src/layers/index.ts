import { NodeLayerIds } from "./nodes/NodesLayer";
import { TrackLayerIds } from "./tracks/TracksLayer";

const LayerIds = { ...NodeLayerIds, ...TrackLayerIds };

export type LayerIds = NodeLayerIds | TrackLayerIds;
