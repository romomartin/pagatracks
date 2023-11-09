import { Graph } from "@dagrejs/graphlib";
import { Connections } from "./build-connections";

export class NetworkGraph {
  private graph: Graph;

  constructor(connections: Connections) {
    this.graph = new Graph({ directed: false });
    Object.entries(connections.connectionIndex).forEach(([track, nodes]) => {
      this.graph.setEdge(nodes.nodeAId, nodes.nodeBId, track);
    });
  }

  nodeEdges(nodeId: string) {
    const edges = this.graph.nodeEdges(nodeId);
    if (!edges) return;
    return edges.map((edge) => this.graph.edge(edge.v, edge.w));
  }
}
