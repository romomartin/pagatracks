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
  trackIds: string[];
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
  trackIds: [],
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
    if (currentRoute.trackIds.length === 0) {
      deleteRoute();
      return;
    }

    currentRoute.trackIds.splice(-1, 1);

    currentRoute.nextPossibleTrackIds =
      currentRoute.trackIds.length === 0
        ? networkGraph.nodeEdges(currentRoute.startPointId) || []
        : getNextPossibleTracksIds(currentRoute, networkGraph);
    currentRoute.routeStats.length = getLength(currentRoute, tracks);
    currentRoute.routeStats.elevGain = getElevationGain(
      currentRoute,
      tracks,
      connectionIndex
    );
    currentRoute.endPointId = getEndNodeId(currentRoute, networkGraph) || "";
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
        trackIds: [],
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
      currentRoute.trackIds.push(nextTrackId);

      currentRoute.endPointId = getEndNodeId(currentRoute, networkGraph) ?? "";
      currentRoute.nextPossibleTrackIds = getNextPossibleTracksIds(
        currentRoute,
        networkGraph
      );
      currentRoute.routeStats.length = getLength(currentRoute, tracks);
      currentRoute.routeStats.elevGain = getElevationGain(
        currentRoute,
        tracks,
        connectionIndex
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

const getNextPossibleTracksIds = (
  route: Route,
  networkGraph: NetworkGraph
): string[] => {
  const endNodeId = getEndNodeId(route, networkGraph);

  if (!endNodeId) return [];

  const nextTrackIds = networkGraph.nodeEdges(endNodeId);

  return nextTrackIds || [];
};

const getEndNodeId = (route: Route, networkGraph: NetworkGraph): string => {
  const endNodeId = route.trackIds.reduce((endNodeId, trackId) => {
    endNodeId =
      endNodeId === networkGraph.getEdge(trackId)?.v
        ? networkGraph.getEdge(trackId)?.w
        : networkGraph.getEdge(trackId)?.v;
    return endNodeId;
  }, route.startPointId as string | undefined);

  return endNodeId || "";
};

const getLength = (route: Route, tracks: TracksById): number => {
  return route.trackIds.reduce((length, trackId) => {
    length += getTrackLength(trackId, tracks);
    return length;
  }, 0);
};

const getTrackLength = (trackId: string, tracks: TracksById): number => {
  const track = tracks[trackId];
  const trackGeometry = track.geometry as MultiLineString;

  const length = getMultilineStringLength(trackGeometry);

  return metersToKm(length);
};

const getElevationGain = (
  route: Route,
  tracks: TracksById,
  connectionIndex: ConnectionIndex
): number => {
  let elevationGain = 0;

  route.trackIds.reduce((prevEndPointId, trackId) => {
    const trackConnections = connectionIndex[trackId];

    let isReversed = false;
    let nextEndPointId = trackConnections.endNodeId;
    if (trackConnections.endNodeId === prevEndPointId) {
      isReversed = true;
      nextEndPointId = trackConnections.startNodeId;
    }

    elevationGain += getTrackElevationGain(tracks[trackId], isReversed);

    return nextEndPointId;
  }, route.startPointId);

  return elevationGain;
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
