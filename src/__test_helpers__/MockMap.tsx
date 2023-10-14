import { MapLayerMouseEvent } from "mapbox-gl";
import { mockSelectedFeature } from "./mock-selected-feature";

export const MockMap = ({
  mapStyle,
  initialViewState,
  interactiveLayerIds,
  onClick,
  children,
}: {
  mapStyle: string;
  initialViewState: { longitude: number; latitude: number; zoom: number };
  interactiveLayerIds: string[];
  onClick: (event: MapLayerMouseEvent) => void;
  children: JSX.Element[];
}): JSX.Element => {
  return (
    <>
      <div id="MockMap">
        mapstyle:{mapStyle}
        initialViewState:
        {`lat: ${initialViewState.latitude}`}
        {`long: ${initialViewState.longitude}`}
        {`zoom: ${initialViewState.zoom}`}
        interactiveLayerIds:{interactiveLayerIds}
        <button
          onClick={() => {
            onClick({
              features: [mockSelectedFeature()],
            } as MapLayerMouseEvent);
          }}
        >
          mapClick
        </button>
      </div>
      {children}
    </>
  );
};
