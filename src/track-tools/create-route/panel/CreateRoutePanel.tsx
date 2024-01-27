import { texts } from "../../../texts";
import { Route } from "../CreateRoute";
import style from "./styles.module.css";
import { ReactComponent as TrashCanLogo } from "../trash-can-icon.svg";
import { ReactComponent as UndoLogo } from "../undo-icon.svg";
import { ReactComponent as DownloadLogo } from "../download-icon.svg";
import { useEffect, useState } from "react";

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
  const [hint, setHint] = useState<string>(getBasicHint(route));
  useEffect(() => {
    setHint(getBasicHint(route));
  }, [route]);

  return (
    <div
      key="createRoute"
      className={isVisible ? style.panel : style.hidden}
      aria-label="createRoutePanel"
    >
      <h2>
        Your route{" "}
        <span className={style.text1}>
          {roundToOneDecimal(route.routeStats.length)}km +1000m
        </span>
      </h2>
      <div className={style.buttons}>
        <button
          aria-label="downloadRoute"
          onMouseEnter={() => setHint(texts.downloadRouteHint)}
          onMouseLeave={() => setHint(getBasicHint(route))}
        >
          <DownloadLogo />
        </button>
        <button
          aria-label="undoRoute"
          onMouseEnter={() => setHint(texts.undoRouteHint)}
          onMouseLeave={() => setHint(getBasicHint(route))}
        >
          <UndoLogo />
        </button>
        <button
          aria-label="deleteRoute"
          onClick={deleteRoute}
          onMouseEnter={() => setHint(texts.deleteRouteHint)}
          onMouseLeave={() => setHint(getBasicHint(route))}
        >
          <TrashCanLogo />
        </button>
      </div>
      <p className={style.hint}>{hint}</p>
    </div>
  );
};

const getBasicHint = (route: Route) => {
  return route.startPointId === ""
    ? texts.selectStartingPoint
    : texts.selectNextTrack;
};

const roundToOneDecimal = (number: number): number => {
  return Math.round(number * 10) / 10;
};
