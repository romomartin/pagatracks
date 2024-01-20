import { useState } from "react";
import style from "./styles.module.css";

type CreateRouteButtonProps = {
  icon: JSX.Element;
  name: string;
  togglePanelVisibility: () => void;
  createNewRoute: () => void;
  hideRoute: () => void;
};

export const CreateRouteButton = ({
  icon,
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
      {icon}
      <span className={style.name}>{name}</span>
    </button>
  );
};
