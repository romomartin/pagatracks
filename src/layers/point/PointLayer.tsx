import { Layer, Source } from "react-map-gl";
import { pointStyle } from "./point-layer-styles";
import { Feature } from "geojson";

export const POINT_LAYER_ID = "point";

type PointLayerProps = {
  point: { x: number; y: number } | undefined;
};

export const PointLayer = ({ point }: PointLayerProps): JSX.Element => {
  const pointGeoJSON = {
    type: "Feature",
    geometry: { type: "Point", coordinates: [point?.x, point?.y] },
  } as Feature;

  return (
    <>
      <Source id={POINT_LAYER_ID} type="geojson" data={pointGeoJSON}>
        <Layer id={POINT_LAYER_ID} {...pointStyle} />
      </Source>
    </>
  );
};
