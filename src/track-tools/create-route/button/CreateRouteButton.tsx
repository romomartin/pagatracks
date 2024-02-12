import { useState } from "react";
import style from "./styles.module.css";
import createRouteIcon from "../icons/create-route-icon.svg";

type CreateRouteButtonProps = {
  name: string;
  togglePanelVisibility: () => void;
  createNewRoute: () => void;
  hideRoute: () => void;
};

export const CreateRouteButton = ({
  name,
  togglePanelVisibility,
  createNewRoute,
  hideRoute,
}: CreateRouteButtonProps) => {
  const [isToggled, setIstoggled] = useState<boolean>(false);

  const onClick = () => {
    togglePanelVisibility();
    isToggled ? hideRoute() : createNewRoute();
    setIstoggled(!isToggled);
  };

  return (
    <button
      key="createRoute"
      className={isToggled ? style.toggled : style.unToggled}
      aria-label="createRouteToolButton"
      onClick={onClick}
    >
      <img src={createRouteIcon} alt="Create route icon" />
      <span className={style.name}>{name}</span>
    </button>
  );
};
