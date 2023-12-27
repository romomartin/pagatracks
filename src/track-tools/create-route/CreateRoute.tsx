import { useEffect, useState } from "react";
import { texts } from "../../texts";
import { CreateRouteIcon } from "./CreateRouteIcon";
import { CreateRouteButton } from "./button/CreateRouteButton";
import { CreateRoutePanel } from "./panel/CreateRoutePanel";
import { TrackTool } from "..";
import { LayerIds, LayerVisibility } from "../../layers";
import { NodeLayerIds } from "../../layers/nodes/NodesLayer";
import { TrackLayerIds } from "../../layers/tracks/TracksLayer";
import { ConnectionIndex } from "../../network/build-connections";
import { NetworkGraph } from "../../network/network-graph";

export const CreateRoute = ({
  changeLayersVisibility,
  changeInteractiveLayers,
  changeSelectedFeatureId,
  selectedNodeId,
  connectionIndex,
  animateTracks,
}: {
  changeLayersVisibility: (
    layerIds: LayerIds[],
    visibility: LayerVisibility
  ) => void;
  changeInteractiveLayers: (ids: LayerIds[]) => void;
  changeSelectedFeatureId: (selectedFeatureId: string | undefined) => void;
  selectedNodeId: string | undefined;
  connectionIndex: ConnectionIndex;
  animateTracks: (tracksIds: string[]) => void;
}): TrackTool => {
  const [panelVisibility, setPanelVisibility] = useState<boolean>(false);
  const [isCreatingRoute, setIsCreatingRoute] = useState<boolean>(false);
  const [startNodeId, setStartNodeId] = useState<string | undefined>(undefined);

  const togglePanelVisibility = (): void => {
    setPanelVisibility(!panelVisibility);
  };

  const createNewRoute = (): void => {
    changeLayersVisibility(
      [
        NodeLayerIds.HOVERED_NODE,
        NodeLayerIds.NODES,
        NodeLayerIds.SELECTED_NODE,
      ],
      LayerVisibility.VISIBLE
    );
    changeInteractiveLayers([NodeLayerIds.NODES]);
    changeSelectedFeatureId(undefined);
    setIsCreatingRoute(true);
  };

  const onStartNodeId = () => {
    changeLayersVisibility(
      [NodeLayerIds.HOVERED_NODE, NodeLayerIds.NODES],
      LayerVisibility.NONE
    );
    changeLayersVisibility(
      [NodeLayerIds.SELECTED_NODE],
      LayerVisibility.VISIBLE
    );
    changeInteractiveLayers([TrackLayerIds.SELECTABLE_TRACKS]);

    const networkGraph = new NetworkGraph(connectionIndex);
    if (startNodeId) {
      const nextTrackIds = networkGraph.nodeEdges(startNodeId);
      animateTracks(nextTrackIds || []);
    }
  };

  if (isCreatingRoute && selectedNodeId !== startNodeId) {
    setStartNodeId(selectedNodeId);
  }

  useEffect(() => {
    if (isCreatingRoute) startNodeId ? onStartNodeId() : createNewRoute();
  }, [startNodeId]);

  const button = CreateRouteButton({
    icon: CreateRouteIcon(),
    name: texts.designRoute,
    togglePanelVisibility: togglePanelVisibility,
  });

  const panel = CreateRoutePanel({
    isVisible: panelVisibility,
    isCreatingRoute,
    createNewRoute,
    startNodeId,
  });

  return { button, panel };
};
