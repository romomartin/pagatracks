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

export const CreateRoute = ({
  changeLayersVisibility,
  changeInteractiveLayers,
  changeSelectedFeatureId,
  changeSelectableTracks,
  selectedNodeId,
  connectionIndex,
  animateTracks,
}: {
  changeLayersVisibility: (layersVisibility: LayersVisibility) => void;
  changeInteractiveLayers: (ids: LayerIds[]) => void;
  changeSelectedFeatureId: (selectedFeatureId: string | undefined) => void;
  changeSelectableTracks: (selectableTracksIds: string[] | undefined) => void;
  selectedNodeId: string | undefined;
  connectionIndex: ConnectionIndex;
  animateTracks: (tracksIds: string[]) => void;
}): TrackTool => {
  const [panelVisibility, setPanelVisibility] = useState<boolean>(false);
  const [isCreatingRoute, setIsCreatingRoute] = useState<boolean>(false);
  const [startNodeId, setStartNodeId] = useState<string | undefined>(undefined);

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
      changeSelectableTracks(nextTrackIds);
    }
  };

  if (isCreatingRoute && selectedNodeId !== startNodeId) {
    setStartNodeId(selectedNodeId);
    selectedNodeId ? onStartNodeId(selectedNodeId) : createNewRoute();
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
    startNodeId,
  });

  return { button, panel };
};
