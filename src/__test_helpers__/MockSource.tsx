import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

export const MockSource = ({
  id,
  type,
  data,
  children,
}: {
  id: string;
  type: string;
  data: FeatureCollection<Geometry, GeoJsonProperties>;
  children: JSX.Element[];
}): JSX.Element => {
  return (
    <>
      <div id="MockSource">
        {`Source-id: ${id}`}
        {`type: ${type}`}
        {`data-type: ${data.type}`}
        {`data-features: ${JSON.stringify(data.features)}`}
      </div>
      {children}
    </>
  );
};
