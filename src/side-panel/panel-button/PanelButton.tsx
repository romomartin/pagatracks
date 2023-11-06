import { DesignRouteIcon } from "../button-icons/DesignRouteIcon";
import style from "./styles.module.css";

export const PanelButton = () => {
  return (
    <div className={style.button} aria-label="panelButton">
      <DesignRouteIcon></DesignRouteIcon>
      <span className={style.name}>Design route</span>
    </div>
  );
};
