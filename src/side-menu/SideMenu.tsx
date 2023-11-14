import style from "./styles.module.css";
import { CreateRoutePanel } from "../create-route/panel/CreateRoutePanel";
import { useState } from "react";
import { texts } from "../texts";
import { CreateRouteButton } from "../create-route/button/CreateRouteButton";
import { CreateRouteIcon } from "../create-route/CreateRouteIcon";

type SideMenuProps = {
  handleCreateNewRoute: () => void;
};

export const SideMenu = ({ handleCreateNewRoute }: SideMenuProps) => {
  const [panelVisibility, setPanelVisibility] = useState<boolean>(false);

  const togglePanelVisibility = (): void => {
    setPanelVisibility(!panelVisibility);
  };

  return (
    <div className={style.container} aria-label="sidePanel">
      <div className={style.buttonCol}>
        <CreateRouteButton
          icon={CreateRouteIcon()}
          name={texts.designRoute}
          togglePanelVisibility={togglePanelVisibility}
        ></CreateRouteButton>
      </div>
      <div className={style.panelCol}>
        <CreateRoutePanel
          isVisible={panelVisibility}
          handleCreateNewRoute={handleCreateNewRoute}
        ></CreateRoutePanel>
      </div>
    </div>
  );
};
