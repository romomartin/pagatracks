import { NodeLayerIds } from "./nodes/NodesLayer";
import { TrackLayerIds } from "./tracks/TracksLayer";

export type LayerIds = NodeLayerIds | TrackLayerIds;

export enum LayerVisibility {
  VISIBLE = "visible",
  NONE = "none",
}

export type LayersVisibility = {
  [layerId: string]: LayerVisibility;
};
