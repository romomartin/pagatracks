import { useMemo, useState } from "react";
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

export type Route = {
  startPointId: string;
  trackIds: string[];
  nextPossibleTrackIds: string[];
};

export const nullRoute: Route = {
  startPointId: "",
  trackIds: [],
  nextPossibleTrackIds: [],
};

export const CreateRoute = ({
  currentRoute,
  updateCurrentRoute,
  changeLayersVisibility,
  changeInteractiveLayers,
  changeSelectedFeatureId,
  selectedFeatureId,
  connectionIndex,
}: {
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

  const onStartNodeId = (startNodeId: string) => {
    changeLayersVisibility({
      [NodeLayerIds.HOVERED_NODE]: LayerVisibility.NONE,
      [NodeLayerIds.NODES]: LayerVisibility.NONE,
      [NodeLayerIds.ROUTE_START_NODE]: LayerVisibility.VISIBLE,
    });
    changeInteractiveLayers([TrackLayerIds.SELECTABLE_TRACKS]);

    const nextTrackIds = networkGraph.nodeEdges(startNodeId);
    updateCurrentRoute({
      startPointId: startNodeId,
      trackIds: [],
      nextPossibleTrackIds: nextTrackIds || [],
    });
  };

  const onNextTrack = (nextTrackId: string) => {
    currentRoute.trackIds.push(nextTrackId);
    let endNodeId: string | undefined = undefined;

    const prevTrackId = currentRoute.trackIds[currentRoute.trackIds.length - 1];
    if (!prevTrackId) {
      endNodeId =
        currentRoute.startPointId === networkGraph.getEdge(nextTrackId)?.v
          ? networkGraph.getEdge(nextTrackId)?.w
          : networkGraph.getEdge(nextTrackId)?.v;
    } else {
      endNodeId = getEndNodeId(networkGraph, prevTrackId, nextTrackId);
    }

    if (!endNodeId) return;

    const nextTrackIds = networkGraph
      .nodeEdges(endNodeId)
      ?.filter((edge) => edge !== prevTrackId && edge !== nextTrackId);

    currentRoute.nextPossibleTrackIds = nextTrackIds || [];
    updateCurrentRoute(currentRoute);
  };

  if (
    isCreatingRoute &&
    selectedFeatureId &&
    currentRoute.startPointId !== "" &&
    !currentRoute.trackIds.includes(selectedFeatureId) &&
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

  const button = CreateRouteButton({
    icon: CreateRouteIcon(),
    name: texts.designRoute,
    togglePanelVisibility: togglePanelVisibility,
  });

  const panel = CreateRoutePanel({
    isVisible: panelVisibility,
    isCreatingRoute,
    createNewRoute,
    route: currentRoute,
  });

  return { button, panel };
};

const getEndNodeId = (
  networkGraph: NetworkGraph,
  prevTrackId: string,
  nextTrackId: string
): string | undefined => {
  const prevEdge = networkGraph.getEdge(prevTrackId);
  const nextEdge = networkGraph.getEdge(nextTrackId);

  const endNodeId =
    prevEdge?.v === nextEdge?.v
      ? nextEdge?.w
      : prevEdge?.v === nextEdge?.w
      ? nextEdge?.v
      : prevEdge?.w === nextEdge?.v
      ? nextEdge?.w
      : nextEdge?.v;

  return endNodeId;
};
