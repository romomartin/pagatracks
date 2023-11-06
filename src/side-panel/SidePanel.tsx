import { PanelButton } from "./panel-button/PanelButton";
import style from "./styles.module.css";

export const SidePanel = () => {
  return (
    <div className={style.container} aria-label="sidePanel">
      <PanelButton></PanelButton>
      <PanelButton></PanelButton>
    </div>
  );
};
