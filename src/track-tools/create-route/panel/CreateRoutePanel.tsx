import { useState } from "react";
import { texts } from "../../../texts";
import style from "./styles.module.css";

type CreateRoutePanelProps = {
  isVisible: boolean;
  createNewRoute: () => void;
  selectedNodeId: string | undefined;
};

export const CreateRoutePanel = ({
  isVisible,
  createNewRoute,
  selectedNodeId,
}: CreateRoutePanelProps) => {
  const [isCreatingRoute, setIsCreatingRoute] = useState<boolean>(false);

  const handleClick = () => {
    createNewRoute();
    setIsCreatingRoute(true);
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
      {isCreatingRoute && !selectedNodeId && texts.selectStartingPoint}
      {isCreatingRoute && selectedNodeId && texts.selectNextTrack}
    </div>
  );
};
