import { ConnectionNode, Connections } from "./build-connections";
import { NetworkGraph } from "./network-graph";

describe("network graph", () => {
  it("gets edges connnected to given node", () => {
    const nodeId = "nodeId";
    const connections: Connections = {
      connectionIndex: {
        Track1: { nodeAId: "node1", nodeBId: nodeId },
        Track2: { nodeAId: nodeId, nodeBId: "node3" },
      },
      nodes: [
        aConnectionNode("node1"),
        aConnectionNode(nodeId),
        aConnectionNode("node3"),
      ],
    };
    const networkGraph = new NetworkGraph(connections);

    const nodeEdges = networkGraph.nodeEdges(nodeId);

    expect(nodeEdges).toEqual(["Track1", "Track2"]);
  });
});

const aConnectionNode = (nodeId: string): ConnectionNode => {
  return {
    id: nodeId,
    geometry: {
      type: "Point",
      coordinates: [1, 0],
    },
  };
};
