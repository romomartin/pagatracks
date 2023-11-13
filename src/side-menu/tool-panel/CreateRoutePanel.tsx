import { texts } from "../../texts";
import style from "./styles.module.css";

type CreateRoutePanelProps = {
  isVisible: boolean;
  handleCreateNewRoute: () => void;
};

export const CreateRoutePanel = ({
  isVisible,
  handleCreateNewRoute,
}: CreateRoutePanelProps) => {
  return (
    <div
      className={isVisible ? style.panel : style.hidden}
      aria-label="toolPanel"
    >
      <button onClick={handleCreateNewRoute}>{texts.createNewRoute}</button>
    </div>
  );
};
