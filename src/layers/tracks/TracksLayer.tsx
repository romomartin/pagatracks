import {
  tracksStyle,
  selectedTrackStyle,
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
          id="selected-track"
          {...selectedTrackStyle}
          filter={["in", "name", selectedTrackName]}
        />
        <Layer
          id="hovered-track"
          {...selectedTrackStyle}
          filter={[
            "in",
            "name",
            hoveredTrackName === selectedTrackName ? "" : hoveredTrackName,
          ]}
        />
        <Layer id="selectable-tracks" {...selectableTracksStyle} />
        <Layer id="tracks" {...tracksStyle} />
      </Source>
    </>
  );
};
