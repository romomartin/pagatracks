import { useState } from "react";
import style from "./styles.module.css";

type CreateRouteButtonProps = {
  icon: JSX.Element;
  name: string;
  togglePanelVisibility: () => void;
};

export const CreateRouteButton = ({
  icon,
  name,
  togglePanelVisibility,
}: CreateRouteButtonProps) => {
  const [isToggled, setIstoggled] = useState<boolean>(false);

  const onClick = () => {
    togglePanelVisibility();
    setIstoggled(!isToggled);
  };
  return (
    <button
      key="createRoute"
      className={isToggled ? style.toggled : style.unToggled}
      aria-label="toolButton"
      onClick={onClick}
    >
      {icon}
      <span className={style.name}>{name}</span>
    </button>
  );
};
