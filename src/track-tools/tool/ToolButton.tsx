import { useState } from "react";
import style from "./styles.module.css";
import { icons } from "../tool-icons";

type ToolButtonProps = {
  toolKey: string;
  name: string;
  togglePanelVisibility: () => void;
  onToggleOn: () => void;
  onToggleOff: () => void;
};

export const ToolButton = ({
  toolKey,
  name,
  togglePanelVisibility,
  onToggleOn,
  onToggleOff,
}: ToolButtonProps) => {
  const [isToggled, setIstoggled] = useState<boolean>(false);

  const onClick = () => {
    togglePanelVisibility();
    isToggled ? onToggleOff() : onToggleOn();
    setIstoggled(!isToggled);
  };

  return (
    <button
      key={toolKey}
      className={isToggled ? style.toggled : style.untoggled}
      aria-label={`${toolKey}Button`}
      onClick={onClick}
    >
      <img src={icons[toolKey as keyof typeof icons]} alt={`${name} icon`} />
      <span className={style.name}>{name}</span>
    </button>
  );
};
