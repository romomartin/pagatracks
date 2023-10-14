import mapboxgl from "mapbox-gl";

export const MockLayer = ({
  id,
  type,
  paint,
  filter,
}: {
  id: string;
  type: string;
  paint: mapboxgl.LinePaint;
  filter: string;
}): JSX.Element => {
  return (
    <>
      <div id="MockLayer">
        {`layer-id: ${id}`}
        {`type: ${type}`}
        {`paint: ${JSON.stringify(paint)}`}
        {`filter: ${filter}`}
      </div>
    </>
  );
};
