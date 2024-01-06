import { ConnectionIndex } from "./build-connections";
import { NetworkGraph } from "./network-graph";

describe("network graph", () => {
  describe("nodeEdges", () => {
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

    it("gets edges connnected to given node when they share start and end node", () => {
      const nodeId = "nodeId";
      const connectionIndex: ConnectionIndex = {
        Track1: { nodeAId: "node1", nodeBId: nodeId },
        Track2: { nodeAId: "node1", nodeBId: nodeId },
      };
      const networkGraph = new NetworkGraph(connectionIndex);

      const nodeEdges = networkGraph.nodeEdges(nodeId);

      expect(nodeEdges).toEqual(["Track1", "Track2"]);
    });
  });

  describe("getEdge", () => {
    it("gets edge from edge name", () => {
      const connectionIndex: ConnectionIndex = {
        Track1: { nodeAId: "node1", nodeBId: "node2" },
        Track2: { nodeAId: "node2", nodeBId: "node3" },
      };
      const networkGraph = new NetworkGraph(connectionIndex);

      const edge = networkGraph.getEdge("Track1");

      expect(edge).toEqual({ v: "node1", w: "node2", name: "Track1" });
    });
  });
});
