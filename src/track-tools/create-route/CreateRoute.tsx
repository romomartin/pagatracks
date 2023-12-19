import { useState } from "react";
import { texts } from "../../texts";
import { CreateRouteIcon } from "./CreateRouteIcon";
import { CreateRouteButton } from "./button/CreateRouteButton";
import { CreateRoutePanel } from "./panel/CreateRoutePanel";
import { TrackTool } from "..";
import { Visibility } from "mapbox-gl";
import { LayerIds } from "../../layers";
import { NodeLayerIds } from "../../layers/nodes/NodesLayer";

export const CreateRoute = ({
  changeNodesVisibility,
  changeInteractiveLayers,
  changeSelectedFeatureId,
  selectedNodeId,
}: {
  changeNodesVisibility: (visibility: Visibility) => void;
  changeInteractiveLayers: (ids: LayerIds[]) => void;
  changeSelectedFeatureId: (selectedFeatureId: string) => void;
  selectedNodeId: string | undefined;
}): TrackTool => {
  const [panelVisibility, setPanelVisibility] = useState<boolean>(false);

  const togglePanelVisibility = (): void => {
    setPanelVisibility(!panelVisibility);
  };

  const createNewRoute = (): void => {
    changeNodesVisibility("visible");
    changeInteractiveLayers([NodeLayerIds.NODES]);
    changeSelectedFeatureId("");
  };

  const button = CreateRouteButton({
    icon: CreateRouteIcon(),
    name: texts.designRoute,
    togglePanelVisibility: togglePanelVisibility,
  });

  const panel = CreateRoutePanel({
    isVisible: panelVisibility,
    createNewRoute,
    selectedNodeId,
  });

  return { button, panel };
};
