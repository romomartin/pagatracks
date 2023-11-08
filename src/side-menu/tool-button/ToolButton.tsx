import { useState } from "react";
import style from "./styles.module.css";

type ToolButtonProps = {
  icon: JSX.Element;
  name: string;
  togglePanelVisibility: () => void;
};

export const ToolButton = ({
  icon,
  name,
  togglePanelVisibility,
}: ToolButtonProps) => {
  const [isToggled, setIstoggled] = useState<boolean>(false);

  const onClick = () => {
    togglePanelVisibility();
    setIstoggled(!isToggled);
  };
  return (
    <button
      className={isToggled ? style.toggled : style.unToggled}
      aria-label="toolButton"
      onClick={onClick}
    >
      {icon}
      <span className={style.name}>{name}</span>
    </button>
  );
};
