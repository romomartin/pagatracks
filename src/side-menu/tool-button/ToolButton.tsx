import style from "./styles.module.css";

type ToolButtonProps = {
  icon: JSX.Element;
  name: string;
};

export const ToolButton = (toolButtonProps: ToolButtonProps) => {
  return (
    <button className={style.button} aria-label="toolButton">
      {toolButtonProps.icon}
      <span className={style.name}>{toolButtonProps.name}</span>
    </button>
  );
};
