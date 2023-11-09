import { MultiLineString, Point, Position } from "geojson";
import { TracksByName } from "../tracks/track";

type Connections = { connectionIndex: ConnectionIndex; nodes: Node[] };

type ConnectionIndex = {
  [edgeId: string]: { nodeAId: string; nodeBId: string };
};

type Node = {
  id: string;
  geometry: Point;
};

export const buildConnectionsFromTracks = (
  tracks: TracksByName
): Connections => {
  let nodes: Node[] = [];
  let connectionIndex: ConnectionIndex = {};

  Object.entries(tracks).forEach(([trackName, track]) => {
    const nodesGeometry = getNodesGeometryFrom(
      track.geometry as MultiLineString
    );

    const nodeIds: string[] = nodesGeometry.map((nodeGeom) => {
      if (alreadyInNodes(nodes, nodeGeom)) return getNodeId(nodes, nodeGeom);

      const node = nodeFrom(nodes, nodeGeom);
      nodes.push(node);
      return node.id;
    });

    connectionIndex[trackName] = { nodeAId: nodeIds[0], nodeBId: nodeIds[1] };
  });

  return { connectionIndex, nodes };
};

const getNodesGeometryFrom = (lineGeometry: MultiLineString): Point[] => {
  const nodesCoordinates = [
    lineStartPoint(lineGeometry),
    lineEndPoint(lineGeometry),
  ];

  return nodesCoordinates.map(
    (coordinates) =>
      ({
        type: "Point",
        coordinates,
      } as Point)
  );
};

const lineStartPoint = (lineGeometry: MultiLineString): Position => {
  return lineGeometry.coordinates[0][0];
};

const lineEndPoint = (lineGeometry: MultiLineString): Position => {
  const endLineString =
    lineGeometry.coordinates[lineGeometry.coordinates.length - 1];

  return endLineString[endLineString.length - 1];
};

const alreadyInNodes = (nodes: Node[], nodeGeom: Point): boolean => {
  return nodes.some((node) => {
    return JSON.stringify(node.geometry) === JSON.stringify(nodeGeom);
  });
};

const nodeFrom = (nodes: Node[], nodeGeom: Point): Node => {
  return {
    geometry: nodeGeom,
    id: `node${nodes.length}`,
  };
};

const getNodeId = (nodes: Node[], nodeGeom: Point): string => {
  const node = nodes.find((node) => {
    return JSON.stringify(node.geometry) === JSON.stringify(nodeGeom);
  });

  return node ? node.id : "";
};
