import { texts } from "../../../texts";
import { Route } from "../CreateRoute";
import style from "./styles.module.css";
import { ReactComponent as TrashCanLogo } from "../trash-can-icon.svg";
import { ReactComponent as UndoLogo } from "../undo-icon.svg";
import { ReactComponent as DownloadLogo } from "../download-icon.svg";

type CreateRoutePanelProps = {
  isVisible: boolean;
  route: Route;
  deleteRoute: () => void;
};

export const CreateRoutePanel = ({
  isVisible,
  route,
  deleteRoute,
}: CreateRoutePanelProps) => {
  return (
    <div
      key="createRoute"
      className={isVisible ? style.panel : style.hidden}
      aria-label="createRoutePanel"
    >
      <h2>
        Your route <span className={style.text1}>100km +1000m</span>
      </h2>
      <div className={style.buttons}>
        <button aria-label="downloadRoute">
          <DownloadLogo />
        </button>
        <button aria-label="undoRoute">
          <UndoLogo />
        </button>
        <button aria-label="deleteRoute" onClick={deleteRoute}>
          <TrashCanLogo />
        </button>
      </div>
      <p className={style.hint}>{showHint(route)}</p>
    </div>
  );
};

const showHint = (route: Route) => {
  return route.startPointId === ""
    ? texts.selectStartingPoint
    : texts.selectNextTrack;
};
