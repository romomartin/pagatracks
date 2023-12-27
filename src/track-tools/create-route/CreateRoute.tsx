import { useState } from "react";
import { texts } from "../../texts";
import { CreateRouteIcon } from "./CreateRouteIcon";
import { CreateRouteButton } from "./button/CreateRouteButton";
import { CreateRoutePanel } from "./panel/CreateRoutePanel";
import { TrackTool } from "..";
import { LayerIds, LayerVisibility } from "../../layers";
import { NodeLayerIds } from "../../layers/nodes/NodesLayer";
import { TrackLayerIds } from "../../layers/tracks/TracksLayer";

export const CreateRoute = ({
  changeLayersVisibility,
  changeInteractiveLayers,
  changeSelectedFeatureId,
  selectedNodeId,
}: {
  changeLayersVisibility: (
    layerIds: LayerIds[],
    visibility: LayerVisibility
  ) => void;
  changeInteractiveLayers: (ids: LayerIds[]) => void;
  changeSelectedFeatureId: (selectedFeatureId: string | undefined) => void;
  selectedNodeId: string | undefined;
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
    changeLayersVisibility([NodeLayerIds.NODES], LayerVisibility.NONE);
    changeLayersVisibility(
      [NodeLayerIds.SELECTED_NODE],
      LayerVisibility.VISIBLE
    );
    changeInteractiveLayers([TrackLayerIds.SELECTABLE_TRACKS]);
  };

  if (isCreatingRoute && startNodeId !== selectedNodeId) {
    setStartNodeId(selectedNodeId);
    selectedNodeId ? onStartNodeId() : createNewRoute();
  }

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
