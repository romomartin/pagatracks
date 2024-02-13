import { Tool } from "../tool/Tool";
import style from "./styles.module.css";
import unpavedIcon from "./icons/unpaved-icon.png";
import pavedIcon from "./icons/paved-icon.png";
import singletrackIcon from "./icons/singletrack-icon.png";
import { texts } from "../../texts";

export const MapLegend = () => {
  const panelContent = (
    <div className={style.container}>
      <div className={style["legend-item"]}>
        <img src={unpavedIcon} alt={"unpaved-icon"}></img>
        <span>{texts.unpaved}</span>
      </div>
      <div className={style["legend-item"]}>
        <img src={pavedIcon} alt={"paved-icon"}></img>
        <span>{texts.paved}</span>
      </div>
      <div className={style["legend-item"]}>
        <img src={singletrackIcon} alt={"singletrack-icon"}></img>
        <span>{texts.singleTrack}</span>
      </div>
    </div>
  );

  return Tool({
    toolKey: "mapLegend",
    name: "Legend",
    onToggleOff: () => {},
    onToggleOn: () => {},
    panelContent,
  });
};
