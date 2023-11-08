import { texts } from "../../texts";
import style from "./styles.module.css";

export const ToolPanel = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <div
      className={isVisible ? style.panel : style.hidden}
      aria-label="toolPanel"
    >
      <button>{texts.createNewRoute}</button>
    </div>
  );
};
