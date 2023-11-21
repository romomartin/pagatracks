import style from "./styles.module.css";
import { TrackTool } from "../track-tools";

type SideMenuProps = {
  trackTools: TrackTool[];
};

export const SideMenu = ({ trackTools }: SideMenuProps) => {
  return (
    <div className={style.container} aria-label="sidePanel">
      <div className={style.buttonCol}>
        {trackTools.map((tool) => tool.button)}
      </div>
      <div className={style.panelCol}>
        {trackTools.map((tool) => tool.panel)}
      </div>
    </div>
  );
};
