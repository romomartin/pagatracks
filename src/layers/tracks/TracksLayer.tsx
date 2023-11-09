import { tracksStyle, selectedTrackStyle } from "./tracks-layer-styles";
import { Layer, Source } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

type TracksLayerProps = {
  tracks: FeatureCollection<Geometry, GeoJsonProperties>;
  selectedTrackName: string;
};

export const TracksLayer = ({
  tracks,
  selectedTrackName,
}: TracksLayerProps) => {
  return (
    <>
      <Source id="tracks" type="geojson" data={tracks}>
        <Layer
          {...selectedTrackStyle}
          filter={["in", "name", selectedTrackName]}
        />
        <Layer {...tracksStyle} />
      </Source>
    </>
  );
};
