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
  tracks: { track: Track; isReversed: boolean }[];
  nextPossibleTrackIds: string[];
  routeStats: RouteStats;
};

type RouteStats = {
  length: number;
  elevGain: number;
};

export const nullRoute: Route = {
  startPointId: "",
  endPointId: "",
  tracks: [],
  nextPossibleTrackIds: [],
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
    if (currentRoute.tracks.length === 0) {
      deleteRoute();
      return;
    }

    currentRoute.tracks.splice(-1, 1);
    currentRoute.endPointId = getEndNodeId(currentRoute, connectionIndex);

    currentRoute.nextPossibleTrackIds =
      currentRoute.tracks.length === 0
        ? networkGraph.nodeEdges(currentRoute.startPointId) || []
        : getNextPossibleTracksIds(currentRoute, networkGraph);
    currentRoute.routeStats.length = getLength(currentRoute);
    currentRoute.routeStats.elevGain = getElevationGain(currentRoute);

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

      const nextTrackIds = networkGraph.nodeEdges(startNodeId);

      updateCurrentRoute({
        startPointId: startNodeId,
        endPointId: "",
        tracks: [],
        nextPossibleTrackIds: nextTrackIds || [],
        routeStats: { length: 0, elevGain: 0 },
      });
    },
    [
      changeInteractiveLayers,
      changeLayersVisibility,
      networkGraph,
      updateCurrentRoute,
    ]
  );

  const onNextTrack = useCallback(
    (nextTrackId: string) => {
      changeSelectedFeatureId(undefined);
      const routeEndPoint =
        currentRoute.tracks.length > 0
          ? currentRoute.endPointId
          : currentRoute.startPointId;
      const isReversed = isTrackReversed(
        nextTrackId,
        routeEndPoint,
        connectionIndex
      );

      currentRoute.tracks.push({
        track: tracks[nextTrackId],
        isReversed,
      });

      currentRoute.endPointId = getEndNodeId(currentRoute, connectionIndex);
      currentRoute.nextPossibleTrackIds = getNextPossibleTracksIds(
        currentRoute,
        networkGraph
      );
      currentRoute.routeStats.length = getLength(currentRoute);
      currentRoute.routeStats.elevGain = getElevationGain(currentRoute);
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

const getNextPossibleTracksIds = (
  route: Route,
  networkGraph: NetworkGraph
): string[] => {
  const endNodeId = route.endPointId;

  if (!endNodeId) return [];

  const nextTrackIds = networkGraph.nodeEdges(endNodeId);

  return nextTrackIds || [];
};

const getEndNodeId = (
  route: Route,
  connectionIndex: ConnectionIndex
): string => {
  const endTrack = route.tracks[route.tracks.length - 1];
  if (!endTrack) return "";

  const endTrackConnections = connectionIndex[endTrack.track.id];

  const endNodeId = endTrack.isReversed
    ? endTrackConnections.startNodeId
    : endTrackConnections.endNodeId;

  return endNodeId || "";
};

const getLength = (route: Route): number => {
  return route.tracks.reduce((length, track) => {
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
  return route.tracks.reduce((elevationGain, track) => {
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
