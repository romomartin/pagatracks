import { MultiLineString, Point, Position } from "geojson";
import { TracksById } from "../tracks/track";

export type Connections = {
  connectionIndex: ConnectionIndex;
  nodes: ConnectionNode[];
};

export type ConnectionIndex = {
  [trackName: string]: { startNodeId: string; endNodeId: string };
};

export type ConnectionNode = {
  id: string;
  geometry: Point;
};

export const nullConnections: Connections = { connectionIndex: {}, nodes: [] };

export const buildConnectionsFromTracks = (tracks: TracksById): Connections => {
  let nodes: ConnectionNode[] = [];
  let connectionIndex: ConnectionIndex = {};

  Object.entries(tracks).forEach(([trackId, track]) => {
    const nodesGeometry = getNodesGeometryFrom(
      track.geometry as MultiLineString
    );

    const nodeIds: string[] = nodesGeometry.map((nodeGeom) => {
      if (alreadyInNodes(nodes, nodeGeom)) return getNodeId(nodes, nodeGeom);

      const node = nodeFrom(nodes, nodeGeom);
      nodes.push(node);
      return node.id;
    });

    connectionIndex[trackId] = {
      startNodeId: nodeIds[0],
      endNodeId: nodeIds[1],
    };
  });

  return { connectionIndex, nodes };
};

const getNodesGeometryFrom = (lineGeometry: MultiLineString): Point[] => {
  const nodesCoordinates = [
    lineStartCoordinates(lineGeometry),
    lineEndCoordinates(lineGeometry),
  ];

  return nodesCoordinates.map(
    (coordinates) =>
      ({
        type: "Point",
        coordinates,
      } as Point)
  );
};

const lineStartCoordinates = (lineGeometry: MultiLineString): Position => {
  return lineGeometry.coordinates[0][0];
};

const lineEndCoordinates = (lineGeometry: MultiLineString): Position => {
  const endLineString =
    lineGeometry.coordinates[lineGeometry.coordinates.length - 1];

  return endLineString[endLineString.length - 1];
};

const alreadyInNodes = (nodes: ConnectionNode[], nodeGeom: Point): boolean => {
  return nodes.some((node) => {
    return JSON.stringify(node.geometry) === JSON.stringify(nodeGeom);
  });
};

const nodeFrom = (nodes: ConnectionNode[], nodeGeom: Point): ConnectionNode => {
  return {
    geometry: nodeGeom,
    id: `node${nodes.length}`,
  };
};

const getNodeId = (nodes: ConnectionNode[], nodeGeom: Point): string => {
  const node = nodes.find((node) => {
    return JSON.stringify(node.geometry) === JSON.stringify(nodeGeom);
  });

  return node ? node.id : "";
};
