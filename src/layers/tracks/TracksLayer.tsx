import {
  tracksStyle,
  selectedTrackStyle,
  hoveredTrackStyle,
  selectableTracksStyle,
} from "./tracks-layer-styles";
import { Layer, Source } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

type TracksLayerProps = {
  tracks: FeatureCollection<Geometry, GeoJsonProperties>;
  selectedTrackName: string;
  hoveredTrackName: string;
};

export const TracksLayer = ({
  tracks,
  selectedTrackName,
  hoveredTrackName,
}: TracksLayerProps) => {
  return (
    <>
      <Source id="tracks" type="geojson" data={tracks}>
        <Layer
          {...selectedTrackStyle}
          filter={["in", "name", selectedTrackName]}
        />
        <Layer
          {...hoveredTrackStyle}
          filter={[
            "in",
            "name",
            hoveredTrackName === selectedTrackName ? "" : hoveredTrackName,
          ]}
        />
        <Layer {...selectableTracksStyle} />
        <Layer {...tracksStyle} />
      </Source>
    </>
  );
};
