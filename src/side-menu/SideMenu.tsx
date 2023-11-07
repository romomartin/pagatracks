import { ToolButton } from "./tool-button/ToolButton";
import { DesignRouteIcon } from "./button-icons/DesignRouteIcon";
import style from "./styles.module.css";

export const SideMenu = () => {
  return (
    <div className={style.container} aria-label="sidePanel">
      <ToolButton icon={DesignRouteIcon()} name={"Design route"}></ToolButton>
    </div>
  );
};
