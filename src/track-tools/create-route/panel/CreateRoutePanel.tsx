import { texts } from "../../../texts";
import { Route } from "../CreateRoute";
import style from "./styles.module.css";

type CreateRoutePanelProps = {
  isVisible: boolean;
  isCreatingRoute: boolean;
  createNewRoute: () => void;
  route: Route;
};

export const CreateRoutePanel = ({
  isVisible,
  isCreatingRoute,
  createNewRoute,
  route,
}: CreateRoutePanelProps) => {
  const handleClick = () => {
    createNewRoute();
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
      {isCreatingRoute && !route.startPoint && texts.selectStartingPoint}
      {isCreatingRoute && route.startPoint && texts.selectNextTrack}
      {isCreatingRoute && route.startPoint && routeDetails(route)}
    </div>
  );
};

const routeDetails = (route: Route) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>{`start point: ${route.startPoint}`}</td>
        </tr>
        {route.tracks.map((track, index) => (
          <tr key={index}>
            <td>{track}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
