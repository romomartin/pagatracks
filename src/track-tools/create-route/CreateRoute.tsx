import { useState } from "react";
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
  startPoint: string;
  tracks: string[];
  nextPossibleTracks: string[];
};

export const nullRoute: Route = {
  startPoint: "",
  tracks: [],
  nextPossibleTracks: [],
};

export const CreateRoute = ({
  currentRoute,
  updateCurrentRoute,
  changeLayersVisibility,
  changeInteractiveLayers,
  changeSelectedFeatureId,
  changeSelectableTracks,
  selectedNodeId,
  connectionIndex,
  animateTracks,
}: {
  currentRoute: Route;
  updateCurrentRoute: (route: Route) => void;
  changeLayersVisibility: (layersVisibility: LayersVisibility) => void;
  changeInteractiveLayers: (ids: LayerIds[]) => void;
  changeSelectedFeatureId: (selectedFeatureId: string | undefined) => void;
  changeSelectableTracks: (selectableTracksIds: string[]) => void;
  selectedNodeId: string | undefined;
  connectionIndex: ConnectionIndex;
  animateTracks: (tracksIds: string[]) => void;
}): TrackTool => {
  const [panelVisibility, setPanelVisibility] = useState<boolean>(false);
  const [isCreatingRoute, setIsCreatingRoute] = useState<boolean>(false);

  const togglePanelVisibility = (): void => {
    setPanelVisibility(!panelVisibility);
  };

  const createNewRoute = (): void => {
    changeLayersVisibility({
      [NodeLayerIds.HOVERED_NODE]: LayerVisibility.VISIBLE,
      [NodeLayerIds.NODES]: LayerVisibility.VISIBLE,
      [NodeLayerIds.SELECTED_NODE]: LayerVisibility.VISIBLE,
    });
    changeInteractiveLayers([NodeLayerIds.NODES]);
    changeSelectedFeatureId(undefined);
    animateTracks([]);
    setIsCreatingRoute(true);
  };

  const onStartNodeId = (startNodeId: string) => {
    changeLayersVisibility({
      [NodeLayerIds.HOVERED_NODE]: LayerVisibility.NONE,
      [NodeLayerIds.NODES]: LayerVisibility.NONE,
      [NodeLayerIds.SELECTED_NODE]: LayerVisibility.VISIBLE,
    });
    changeInteractiveLayers([TrackLayerIds.SELECTABLE_TRACKS]);

    const networkGraph = new NetworkGraph(connectionIndex);
    if (startNodeId) {
      const nextTrackIds = networkGraph.nodeEdges(startNodeId);
      animateTracks(nextTrackIds || []);
      changeSelectableTracks(nextTrackIds || []);
      updateCurrentRoute({
        startPoint: startNodeId,
        tracks: [],
        nextPossibleTracks: nextTrackIds || [],
      });
    }
  };

  if (
    isCreatingRoute &&
    selectedNodeId !== currentRoute.startPoint &&
    selectedNodeId
  ) {
    onStartNodeId(selectedNodeId);
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
