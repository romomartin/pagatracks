import style from "./styles.module.css";

type PanelButtonProps = {
  icon: JSX.Element;
  name: string;
};

export const PanelButton = (panelButtonProps: PanelButtonProps) => {
  return (
    <button className={style.button} aria-label="panelButton">
      {panelButtonProps.icon}
      <span className={style.name}>{panelButtonProps.name}</span>
    </button>
  );
};
