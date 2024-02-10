import { useCallback, useEffect, useMemo, useState } from "react";
import { texts } from "../../texts";
import { CreateRouteIcon } from "./CreateRouteIcon";
import { CreateRouteButton } from "./button/CreateRouteButton";
import { CreateRoutePanel } from "./panel/CreateRoutePanel";
import { TrackTool } from "..";
import { LayerIds, LayerVisibility, LayersVisibility } from "../../layers";
import { NodeLayerIds } from "../../layers/nodes/NodesLayer";
import { TrackLayerIds } from "../../layers/tracks/TracksLayer";
import { ConnectionIndex } from "../../network/build-connections";
import { NetworkGraph } from "../../network/network-graph";
import { Track, TracksById } from "../../tracks/track";
import { MultiLineString, Position } from "geojson";
import { GeolibInputCoordinates } from "geolib/es/types";
import { getDistance } from "geolib";

export type Route = {
  startPointId: string;
  endPointId: string;
  segments: RouteSegment[];
  nextPossibleSegments: RouteSegment[];
  routeStats: RouteStats;
};

type RouteSegment = {
  track: Track;
  isReversed: boolean;
};

type RouteStats = {
  length: number;
  elevGain: number;
};

export const nullRoute: Route = {
  startPointId: "",
  endPointId: "",
  segments: [],
  nextPossibleSegments: [],
  routeStats: { length: 0, elevGain: 0 },
};

export const CreateRoute = ({
  tracks,
  currentRoute,
  updateCurrentRoute,
  changeLayersVisibility,
  changeInteractiveLayers,
  changeSelectedFeatureId,
  selectedFeatureId,
  connectionIndex,
}: {
  tracks: TracksById;
  currentRoute: Route;
  updateCurrentRoute: (route: Route) => void;
  changeLayersVisibility: (layersVisibility: LayersVisibility) => void;
  changeInteractiveLayers: (ids: LayerIds[]) => void;
  changeSelectedFeatureId: (selectedFeatureId: string | undefined) => void;
  selectedFeatureId: string | undefined;
  connectionIndex: ConnectionIndex;
}): TrackTool => {
  const [panelVisibility, setPanelVisibility] = useState<boolean>(false);
  const [isCreatingRoute, setIsCreatingRoute] = useState<boolean>(false);

  const networkGraph = useMemo(
    () => new NetworkGraph(connectionIndex),
    [connectionIndex]
  );

  const togglePanelVisibility = (): void => {
    setPanelVisibility(!panelVisibility);
  };

  const createNewRoute = (): void => {
    changeLayersVisibility({
      [NodeLayerIds.HOVERED_NODE]: LayerVisibility.VISIBLE,
      [NodeLayerIds.NODES]: LayerVisibility.VISIBLE,
      [NodeLayerIds.ROUTE_START_NODE]: LayerVisibility.VISIBLE,
    });
    changeInteractiveLayers([NodeLayerIds.NODES]);
    changeSelectedFeatureId(undefined);
    setIsCreatingRoute(true);
  };

  const hideRoute = (): void => {
    changeLayersVisibility({
      [NodeLayerIds.HOVERED_NODE]: LayerVisibility.NONE,
      [NodeLayerIds.NODES]: LayerVisibility.NONE,
      [NodeLayerIds.ROUTE_START_NODE]: LayerVisibility.NONE,
    });
    changeInteractiveLayers([TrackLayerIds.SELECTABLE_TRACKS]);
    changeSelectedFeatureId(undefined);
    updateCurrentRoute(nullRoute);
    setIsCreatingRoute(false);
  };

  const deleteRoute = (): void => {
    changeSelectedFeatureId(undefined);
    updateCurrentRoute(nullRoute);
    createNewRoute();
  };

  const undoRoute = (): void => {
    changeSelectedFeatureId(undefined);
    if (currentRoute.segments.length === 0) {
      deleteRoute();
      return;
    }

    removeLastTrackFromRoute(
      currentRoute,
      tracks,
      connectionIndex,
      networkGraph
    );
    updateCurrentRoute(currentRoute);
  };

  const onStartNodeId = useCallback(
    (startNodeId: string) => {
      changeLayersVisibility({
        [NodeLayerIds.HOVERED_NODE]: LayerVisibility.NONE,
        [NodeLayerIds.NODES]: LayerVisibility.NONE,
        [NodeLayerIds.ROUTE_START_NODE]: LayerVisibility.VISIBLE,
        [NodeLayerIds.ROUTE_END_NODE]: LayerVisibility.VISIBLE,
      });
      changeInteractiveLayers([TrackLayerIds.SELECTABLE_TRACKS]);

      const nextSegmentsIds = networkGraph.nodeEdges(startNodeId);
      const nextSegments: RouteSegment[] = nextSegmentsIds
        ? nextSegmentsIds.map((edgeId) => ({
            track: tracks[edgeId],
            isReversed: isTrackReversed(edgeId, startNodeId, connectionIndex),
          }))
        : [];

      updateCurrentRoute({
        startPointId: startNodeId,
        endPointId: "",
        segments: [],
        nextPossibleSegments: nextSegments,
        routeStats: { length: 0, elevGain: 0 },
      });
    },
    [
      changeInteractiveLayers,
      changeLayersVisibility,
      networkGraph,
      updateCurrentRoute,
      connectionIndex,
      tracks,
    ]
  );

  const onNextTrack = useCallback(
    (nextTrackId: string) => {
      changeSelectedFeatureId(undefined);

      const track = tracks[nextTrackId];

      addTrackToRoute(
        track,
        currentRoute,
        tracks,
        connectionIndex,
        networkGraph
      );
      updateCurrentRoute(currentRoute);
    },
    [
      changeSelectedFeatureId,
      connectionIndex,
      currentRoute,
      networkGraph,
      tracks,
      updateCurrentRoute,
    ]
  );

  useEffect(() => {
    if (
      isCreatingRoute &&
      selectedFeatureId &&
      currentRoute.startPointId !== "" &&
      currentRoute.startPointId !== selectedFeatureId
    ) {
      onNextTrack(selectedFeatureId);
    }

    if (
      isCreatingRoute &&
      selectedFeatureId &&
      currentRoute.startPointId === ""
    ) {
      onStartNodeId(selectedFeatureId);
    }
  }, [
    currentRoute.startPointId,
    isCreatingRoute,
    onNextTrack,
    onStartNodeId,
    selectedFeatureId,
  ]);

  const button = CreateRouteButton({
    icon: CreateRouteIcon(),
    name: texts.designRoute,
    togglePanelVisibility,
    createNewRoute,
    hideRoute,
  });

  const panel = CreateRoutePanel({
    isVisible: panelVisibility,
    route: currentRoute,
    deleteRoute,
    undoRoute,
  });

  return { button, panel };
};

const removeLastTrackFromRoute = (
  route: Route,
  tracks: TracksById,
  connectionIndex: ConnectionIndex,
  networkGraph: NetworkGraph
): Route => {
  route.segments.splice(-1, 1);
  route.endPointId = getEndNodeId(route, connectionIndex);

  route.nextPossibleSegments = getNextPossibleSegments(
    route,
    tracks,
    connectionIndex,
    networkGraph
  );
  route.routeStats.length = getLength(route);
  route.routeStats.elevGain = getElevationGain(route);

  return route;
};

const addTrackToRoute = (
  track: Track,
  route: Route,
  tracks: TracksById,
  connectionIndex: ConnectionIndex,
  networkGraph: NetworkGraph
): Route => {
  const routeEndPoint =
    route.segments.length > 0 ? route.endPointId : route.startPointId;
  const isReversed = isTrackReversed(track.id, routeEndPoint, connectionIndex);

  route.segments.push({
    track,
    isReversed,
  });

  route.endPointId = getEndNodeId(route, connectionIndex);
  route.nextPossibleSegments = getNextPossibleSegments(
    route,
    tracks,
    connectionIndex,
    networkGraph
  );
  route.routeStats.length = getLength(route);
  route.routeStats.elevGain = getElevationGain(route);

  return route;
};

const getNextPossibleSegments = (
  route: Route,
  tracks: TracksById,
  connectionIndex: ConnectionIndex,
  networkGraph: NetworkGraph
): RouteSegment[] => {
  const endNodeId =
    route.endPointId && route.endPointId !== ""
      ? route.endPointId
      : route.startPointId;

  if (!endNodeId) return [];

  const nextSegmentsIds = networkGraph.nodeEdges(endNodeId);
  const nextSegments = nextSegmentsIds?.map((id) => {
    return {
      track: tracks[id],
      isReversed: isTrackReversed(id, endNodeId, connectionIndex),
    };
  });

  return nextSegments || [];
};

const getEndNodeId = (
  route: Route,
  connectionIndex: ConnectionIndex
): string => {
  const endTrack = route.segments[route.segments.length - 1];
  if (!endTrack) return "";

  const endTrackConnections = connectionIndex[endTrack.track.id];

  const endNodeId = endTrack.isReversed
    ? endTrackConnections.startNodeId
    : endTrackConnections.endNodeId;

  return endNodeId || "";
};

const getLength = (route: Route): number => {
  return route.segments.reduce((length, track) => {
    length += getTrackLength(track.track);
    return length;
  }, 0);
};

const getTrackLength = (track: Track): number => {
  const trackGeometry = track.geometry as MultiLineString;

  const length = getMultilineStringLength(trackGeometry);

  return metersToKm(length);
};

const getElevationGain = (route: Route): number => {
  return route.segments.reduce((elevationGain, track) => {
    elevationGain += getTrackElevationGain(track.track, track.isReversed);

    return elevationGain;
  }, 0);
};

const isTrackReversed = (
  trackId: string,
  startPointId: string,
  connectionIndex: ConnectionIndex
): boolean => {
  const trackConnections = connectionIndex[trackId];
  return trackConnections.startNodeId !== startPointId;
};

const getTrackElevationGain = (
  track: Track,
  isReversed: boolean = false
): number => {
  const copiedGeometry = copyGeometry(track.geometry as MultiLineString);
  if (isReversed) reverseTrackGeometry(copiedGeometry);

  const elevationGain = copiedGeometry.coordinates.reduce(
    (totalElevGain, lineString) => {
      lineString.reduce((lastPosition, position) => {
        const elevGain = position[2] - lastPosition[2];

        if (elevGain > 0) totalElevGain += elevGain;

        return position;
      }, lineString[0]);

      return totalElevGain;
    },
    0
  );

  return elevationGain;
};

const copyGeometry = (geometry: MultiLineString): MultiLineString => {
  const coordinates = geometry.coordinates.map((line) => {
    return line.map((position) => {
      return position.map((number) => number);
    });
  });

  return { type: "MultiLineString", coordinates };
};

const reverseTrackGeometry = (geometry: MultiLineString): MultiLineString => {
  const coordinates = geometry.coordinates.reverse().map((line) => {
    return line.reverse();
  });

  return { type: "MultiLineString", coordinates };
};

const getMultilineStringLength = (multilineString: MultiLineString): number => {
  const firstPosition = multilineString.coordinates[0][0];
  let previousPosition = firstPosition;

  const length = multilineString.coordinates[0].reduce(
    (totalLength, position) => {
      totalLength += getDistance(
        positionToGeolibInputCoordinates(previousPosition),
        positionToGeolibInputCoordinates(position)
      );
      previousPosition = position;

      return totalLength;
    },
    0
  );

  return length;
};

const positionToGeolibInputCoordinates = (
  position: Position
): GeolibInputCoordinates => {
  return {
    longitude: position[0],
    latitude: position[1],
  } as GeolibInputCoordinates;
};

const metersToKm = (meters: number): number => {
  return meters / 1000;
};
