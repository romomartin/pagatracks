import {
  tracksStyle,
  highlightedTrackStyle,
  selectableTracksStyle,
  routeTracksStyle,
  nextPossibleTracksNormalStyle,
  nextPossibleTracksReversedStyle,
  routeTracksStyle2,
} from "./tracks-layer-styles";
import { Layer, Source } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Route } from "../../track-tools/create-route/CreateRoute";

export enum TrackLayerIds {
  SELECTED_TRACK = "selected-track",
  HOVERED_TRACK = "hovered-track",
  SELECTABLE_TRACKS = "selectable-tracks",
  TRACKS = "tracks",
  NEXT_POSSIBLE_TRACKS_NORMAL = "next-possible-tracks-normal",
  NEXT_POSSIBLE_TRACKS_REVERSED = "next-possible-tracks-reversed",
  ROUTE_TRACKS_DASHES = "route-tracks-dashes",
  ROUTE_TRACKS_OUTLINE = "route-tracks-outline",
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
  const nextPossibleTracksIds = currentRoute.nextPossibleSegments.map(
    (segment) => segment.track.id
  );

  return (
    <>
      <Source id="tracks" type="geojson" data={tracks} lineMetrics={true}>
        <Layer
          id={TrackLayerIds.SELECTABLE_TRACKS}
          {...selectableTracksStyle}
          {...(!isNullRoute(currentRoute)
            ? {
                filter: filterTracksById(nextPossibleTracksIds),
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
          id={TrackLayerIds.NEXT_POSSIBLE_TRACKS_NORMAL}
          {...nextPossibleTracksNormalStyle}
          filter={filterTracksById(
            currentRoute.nextPossibleSegments
              .filter((segment) => !segment.isReversed)
              .map((segment) => segment.track.id)
          )}
        />
        <Layer
          id={TrackLayerIds.NEXT_POSSIBLE_TRACKS_REVERSED}
          {...nextPossibleTracksReversedStyle}
          filter={filterTracksById(
            currentRoute.nextPossibleSegments
              .filter((segment) => segment.isReversed)
              .map((segment) => segment.track.id)
          )}
        />
        <Layer
          id={TrackLayerIds.ROUTE_TRACKS_OUTLINE}
          {...routeTracksStyle2}
          filter={filterTracksById(
            currentRoute.segments.map((track) => track.track.id)
          )}
        />
        <Layer id={TrackLayerIds.TRACKS} {...tracksStyle} />
        <Layer
          id={TrackLayerIds.ROUTE_TRACKS_DASHES}
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
