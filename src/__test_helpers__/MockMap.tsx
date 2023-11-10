import { MapLayerMouseEvent } from "mapbox-gl";
import { mockSelectedFeature } from "./mock-selected-feature";
import { mockHoveredFeature } from "./mock-hovered-feature";

export const MockMap = ({
  mapStyle,
  initialViewState,
  interactiveLayerIds,
  onClick,
  onMouseMove,
  children,
}: {
  mapStyle: string;
  initialViewState: { longitude: number; latitude: number; zoom: number };
  interactiveLayerIds: string[];
  onClick: (event: MapLayerMouseEvent) => void;
  onMouseMove: (event: MapLayerMouseEvent) => void;
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
        <button
          onMouseOver={() => {
            onMouseMove({
              features: [mockHoveredFeature()],
            } as MapLayerMouseEvent);
          }}
        >
          mapHover
        </button>
      </div>
      {children}
    </>
  );
};
