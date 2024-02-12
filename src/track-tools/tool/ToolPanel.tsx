import { ReactNode } from "react";
import style from "./styles.module.css";

type ToolPanelProps = {
  toolKey: string;
  panelContent: ReactNode;
  isVisible: boolean;
};

export const ToolPanel = ({
  toolKey,
  panelContent,
  isVisible,
}: ToolPanelProps) => {
  return (
    <div
      key={toolKey}
      className={isVisible ? style.panel : style["panel-hidden"]}
      aria-label={`${toolKey}Panel`}
    >
      {panelContent}
    </div>
  );
};
