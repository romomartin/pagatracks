import {
  tracksStyle,
  highlightedTrackStyle,
  selectableTracksStyle,
} from "./tracks-layer-styles";
import { Layer, Source } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

export enum TrackLayerIds {
  SELECTED_TRACK = "selected-track",
  HOVERED_TRACK = "hovered-track",
  SELECTABLE_TRACKS = "selectable-tracks",
  TRACKS = "tracks",
}

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
          id={TrackLayerIds.SELECTED_TRACK}
          {...highlightedTrackStyle}
          filter={["in", "name", selectedTrackName]}
        />
        <Layer
          id={TrackLayerIds.HOVERED_TRACK}
          {...highlightedTrackStyle}
          filter={[
            "in",
            "name",
            hoveredTrackName === selectedTrackName ? "" : hoveredTrackName,
          ]}
        />
        <Layer
          id={TrackLayerIds.SELECTABLE_TRACKS}
          {...selectableTracksStyle}
        />
        <Layer id={TrackLayerIds.TRACKS} {...tracksStyle} />
      </Source>
    </>
  );
};
