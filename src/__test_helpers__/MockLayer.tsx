import { LineLayerSpecification } from "mapbox-gl";

export const MockLayer = ({
  id,
  type,
  paint,
  filter,
  layout,
}: {
  id: string;
  type: string;
  paint: LineLayerSpecification['paint'];
  filter: string;
  layout: LineLayerSpecification['layout'];
}): JSX.Element => {
  return (
    <>
      <div id="MockLayer">
        {`layer-id: ${id}`}
        {`type: ${type}`}
        {`paint: ${JSON.stringify(paint)}`}
        {`filter: ${filter}`}
        {`visibility: ${layout?.visibility ?? ""}`}
      </div>
    </>
  );
};
