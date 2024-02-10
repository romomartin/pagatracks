import {
  tracksStyle,
  highlightedTrackStyle,
  selectableTracksStyle,
  routeTracksStyle,
} from "./tracks-layer-styles";
import { Layer, Source } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Visibility } from "mapbox-gl";
import { useState } from "react";
import { LayerVisibility } from "..";
import { Route } from "../../track-tools/create-route/CreateRoute";

export enum TrackLayerIds {
  SELECTED_TRACK = "selected-track",
  HOVERED_TRACK = "hovered-track",
  SELECTABLE_TRACKS = "selectable-tracks",
  TRACKS = "tracks",
  ANIMATED_TRACKS = "animated-tracks",
  ROUTE_TRACKS = "route-tracks",
}

type TracksLayerProps = {
  tracks: FeatureCollection<Geometry, GeoJsonProperties>;
  selectedFeatureId: string;
  hoveredFeatureId: string;
  currentRoute: Route;
};

export const TracksLayer = ({
  tracks,
  selectedFeatureId,
  hoveredFeatureId,
  currentRoute,
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
          id={TrackLayerIds.SELECTABLE_TRACKS}
          {...selectableTracksStyle}
          {...(!isNullRoute(currentRoute)
            ? {
                filter: filterTracksById(
                  currentRoute.nextPossibleSegments.map(
                    (segment) => segment.track.id
                  )
                ),
              }
            : {})}
        />
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
          filter={filterTracksById(
            currentRoute.nextPossibleSegments.map((segment) => segment.track.id)
          )}
        />
        <Layer id={TrackLayerIds.TRACKS} {...tracksStyle} />
        <Layer
          id={TrackLayerIds.ROUTE_TRACKS}
          {...routeTracksStyle}
          filter={filterTracksById(
            currentRoute.segments.map((track) => track.track.id)
          )}
        />
      </Source>
    </>
  );
};

const isNullRoute = (route: Route): boolean => {
  return (
    route.nextPossibleSegments.length === 0 &&
    route.startPointId === "" &&
    route.segments.length === 0
  );
};

const filterTracksById = (trackIds: string[]): string[] => {
  let filter = ["in", "id"];

  return filter.concat(trackIds);
};
