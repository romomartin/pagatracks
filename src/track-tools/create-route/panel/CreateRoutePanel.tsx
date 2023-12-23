import { texts } from "../../../texts";
import style from "./styles.module.css";

type CreateRoutePanelProps = {
  isVisible: boolean;
  isCreatingRoute: boolean;
  createNewRoute: () => void;
  startNodeId: string | undefined;
};

export const CreateRoutePanel = ({
  isVisible,
  isCreatingRoute,
  createNewRoute,
  startNodeId,
}: CreateRoutePanelProps) => {
  const handleClick = () => {
    createNewRoute();
  };

  return (
    <div
      key="createRoute"
      className={isVisible ? style.panel : style.hidden}
      aria-label="createRoutePanel"
    >
      {!isCreatingRoute && (
        <button onClick={handleClick}>{texts.createNewRoute}</button>
      )}
      {isCreatingRoute && !startNodeId && texts.selectStartingPoint}
      {isCreatingRoute && startNodeId && texts.selectNextTrack}
    </div>
  );
};
