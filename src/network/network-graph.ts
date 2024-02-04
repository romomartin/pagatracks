import { Edge, Graph } from "@dagrejs/graphlib";
import { ConnectionIndex } from "./build-connections";

export class NetworkGraph {
  private graph: Graph;

  constructor(connectionIndex: ConnectionIndex) {
    this.graph = new Graph({ directed: false, multigraph: true });
    Object.entries(connectionIndex).forEach(([track, nodes]) => {
      this.graph.setEdge(nodes.startNodeId, nodes.endNodeId, track, track);
    });
  }

  nodeEdges(nodeId: string) {
    const edges = this.graph.nodeEdges(nodeId);
    if (!edges) return;
    return edges.map((edge) => this.graph.edge(edge.v, edge.w, edge.name));
  }

  getEdge(edgeName: string): Edge | undefined {
    const edges = this.graph.edges();
    return edges.find((edge) => edge.name === edgeName);
  }
}
