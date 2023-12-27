import { ConnectionIndex } from "./build-connections";
import { NetworkGraph } from "./network-graph";

describe("network graph", () => {
  it("gets edges connnected to given node", () => {
    const nodeId = "nodeId";
    const connectionIndex: ConnectionIndex = {
      Track1: { nodeAId: "node1", nodeBId: nodeId },
      Track2: { nodeAId: nodeId, nodeBId: "node3" },
      Track3: { nodeAId: nodeId, nodeBId: "node4" },
    };
    const networkGraph = new NetworkGraph(connectionIndex);

    const nodeEdges = networkGraph.nodeEdges(nodeId);

    expect(nodeEdges).toEqual(["Track1", "Track2", "Track3"]);
  });
});
