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
  selectedFeatureId: string;
  hoveredFeatureId: string;
};

export const TracksLayer = ({
  tracks,
  selectedFeatureId,
  hoveredFeatureId,
}: TracksLayerProps) => {
  return (
    <>
      <Source id="tracks" type="geojson" data={tracks}>
        <Layer
          id={TrackLayerIds.SELECTED_TRACK}
          {...highlightedTrackStyle}
          filter={["in", "id", selectedFeatureId]}
        />
        <Layer
          id={TrackLayerIds.HOVERED_TRACK}
          {...highlightedTrackStyle}
          filter={[
            "in",
            "id",
            hoveredFeatureId === selectedFeatureId ? "" : hoveredFeatureId,
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
