import { tracksStyle, selectedTrackStyle } from "./layer-styles";
import { Layer, MapboxGeoJSONFeature, Source } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

type TracksLayerProps = {
  tracks: FeatureCollection<Geometry, GeoJsonProperties>;
  selectedTrack: MapboxGeoJSONFeature | undefined;
};

export const TracksLayer = ({ tracks, selectedTrack }: TracksLayerProps) => {
  const selectedTrackName: string = selectedTrack?.properties
    ? selectedTrack.properties.name
    : "";

  return (
    <>
      <Source id="tracks" type="geojson" data={tracks}>
        <Layer {...tracksStyle} />
        <Layer
          {...selectedTrackStyle}
          filter={["in", "name", selectedTrackName]}
        />
      </Source>
    </>
  );
};
