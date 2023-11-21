import { useState } from "react";
import { texts } from "../../texts";
import { CreateRouteIcon } from "./CreateRouteIcon";
import { CreateRouteButton } from "./button/CreateRouteButton";
import { CreateRoutePanel } from "./panel/CreateRoutePanel";
import { TrackTool } from "..";

export const CreateRoute = ({
  handleCreateNewRoute,
}: {
  handleCreateNewRoute: () => void;
}): TrackTool => {
  const [panelVisibility, setPanelVisibility] = useState<boolean>(false);

  const togglePanelVisibility = (): void => {
    setPanelVisibility(!panelVisibility);
  };

  const button = CreateRouteButton({
    icon: CreateRouteIcon(),
    name: texts.designRoute,
    togglePanelVisibility: togglePanelVisibility,
  });

  const panel = CreateRoutePanel({
    isVisible: panelVisibility,
    handleCreateNewRoute,
  });

  return { button, panel };
};
