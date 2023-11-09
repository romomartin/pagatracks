import { ConnectionNode } from "./build-connections";
import { nodesToFeatureCollection } from "./nodes-to-feature-collection";

describe("nodes to feature collection", () => {
  it("returns a featureCollection from givenm nodes", () => {
    const nodes: ConnectionNode[] = [
      {
        id: "P1",
        geometry: {
          type: "Point",
          coordinates: [1, 2],
        },
      },
      {
        id: "P2",
        geometry: {
          type: "Point",
          coordinates: [3, 4],
        },
      },
    ];

    const nodesFeatureCollection = nodesToFeatureCollection(nodes);

    expect(nodesFeatureCollection).toEqual({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: nodes[0].geometry,
          properties: { id: nodes[0].id },
        },
        {
          type: "Feature",
          geometry: nodes[1].geometry,
          properties: { id: nodes[1].id },
        },
      ],
    });
  });
});
