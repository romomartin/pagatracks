import { ReactNode, useState } from "react";
import { ToolButton } from "./ToolButton";
import { TrackTool } from "..";
import { ToolPanel } from "./ToolPanel";

type ToolProps = {
  toolKey: string;
  name: string;
  onToggleOn: () => void;
  onToggleOff: () => void;
  panelContent: ReactNode;
};

export const Tool = ({
  toolKey,
  name,
  onToggleOn,
  onToggleOff,
  panelContent,
}: ToolProps): TrackTool => {
  const [panelVisibility, setPanelVisibility] = useState<boolean>(false);

  const togglePanelVisibility = (): void => {
    setPanelVisibility(!panelVisibility);
  };

  return {
    button: ToolButton({
      toolKey,
      name,
      togglePanelVisibility,
      onToggleOn,
      onToggleOff,
    }),
    panel: ToolPanel({ toolKey, panelContent, isVisible: panelVisibility }),
  };
};
