import { ToolButton } from "./tool-button/ToolButton";
import { DesignRouteIcon } from "./button-icons/DesignRouteIcon";
import style from "./styles.module.css";
import { ToolPanel } from "./tool-panel/ToolPanel";
import { useState } from "react";
import { texts } from "../texts";

export const SideMenu = () => {
  const [panelVisibility, setPanelVisibility] = useState<boolean>(false);

  const togglePanelVisibility = (): void => {
    setPanelVisibility(!panelVisibility);
  };

  return (
    <div className={style.container} aria-label="sidePanel">
      <div className={style.buttonCol}>
        <ToolButton
          icon={DesignRouteIcon()}
          name={texts.designRoute}
          togglePanelVisibility={togglePanelVisibility}
        ></ToolButton>
      </div>
      <div className={style.panelCol}>
        <ToolPanel isVisible={panelVisibility}></ToolPanel>
      </div>
    </div>
  );
};
