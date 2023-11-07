import { PanelButton } from "./panel-button/PanelButton";
import { DesignRouteIcon } from "./button-icons/DesignRouteIcon";
import style from "./styles.module.css";

export const SidePanel = () => {
  return (
    <div className={style.container} aria-label="sidePanel">
      <PanelButton icon={DesignRouteIcon()} name={"Design route"}></PanelButton>
    </div>
  );
};
