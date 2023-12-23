import { useState } from "react";
import { texts } from "../../texts";
import { CreateRouteIcon } from "./CreateRouteIcon";
import { CreateRouteButton } from "./button/CreateRouteButton";
import { CreateRoutePanel } from "./panel/CreateRoutePanel";
import { TrackTool } from "..";
import { Visibility } from "mapbox-gl";
import { LayerIds } from "../../layers";
import { NodeLayerIds } from "../../layers/nodes/NodesLayer";
import { TrackLayerIds } from "../../layers/tracks/TracksLayer";

export const CreateRoute = ({
  changeNodesVisibility,
  changeInteractiveLayers,
  changeSelectedFeatureId,
  selectedNodeId,
}: {
  changeNodesVisibility: (visibility: Visibility) => void;
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
    changeNodesVisibility("visible");
    changeInteractiveLayers([NodeLayerIds.NODES]);
    changeSelectedFeatureId(undefined);
    setIsCreatingRoute(true);
  };

  const onStartNodeId = () => {
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
