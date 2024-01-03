import {
  tracksStyle,
  highlightedTrackStyle,
  selectableTracksStyle,
} from "./tracks-layer-styles";
import { Layer, Source } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Visibility } from "mapbox-gl";
import { useState } from "react";
import { LayerVisibility } from "..";

export enum TrackLayerIds {
  SELECTED_TRACK = "selected-track",
  HOVERED_TRACK = "hovered-track",
  SELECTABLE_TRACKS = "selectable-tracks",
  TRACKS = "tracks",
  ANIMATED_TRACKS = "animated-tracks",
}

type TracksLayerProps = {
  tracks: FeatureCollection<Geometry, GeoJsonProperties>;
  selectedFeatureId: string;
  hoveredFeatureId: string;
  animatedTracksIds: string[];
  selectableTracksIds: string[] | undefined;
};

export const TracksLayer = ({
  tracks,
  selectedFeatureId,
  hoveredFeatureId,
  animatedTracksIds,
  selectableTracksIds,
}: TracksLayerProps) => {
  const [animatedVisibility, setAnimatedVisibility] = useState<Visibility>(
    LayerVisibility.NONE
  );

  const animateLayer = () => {
    animatedVisibility === LayerVisibility.VISIBLE
      ? setAnimatedVisibility(LayerVisibility.NONE)
      : setAnimatedVisibility(LayerVisibility.VISIBLE);
  };
  setTimeout(() => animateLayer(), 500);

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
          id={TrackLayerIds.ANIMATED_TRACKS}
          {...highlightedTrackStyle}
          layout={{ visibility: animatedVisibility }}
          filter={filterTracksById(animatedTracksIds)}
        />
        <Layer
          id={TrackLayerIds.SELECTABLE_TRACKS}
          {...selectableTracksStyle}
          {...(selectableTracksIds
            ? { filter: filterTracksById(selectableTracksIds) }
            : {})}
        />
        <Layer id={TrackLayerIds.TRACKS} {...tracksStyle} />
      </Source>
    </>
  );
};

const filterTracksById = (trackIds: string[]): string[] => {
  let filter = ["in", "id"];

  return filter.concat(trackIds);
};
