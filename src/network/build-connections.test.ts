import { Position } from "geojson";
import { Track } from "../tracks/track";
import { buildConnectionsFromTracks } from "./build-connections";

describe("Build connections from tracks", () => {
  it("returns connections from a single track", () => {
    const trackName = "myTrackName";
    const track: Track = aTrack(trackName);

    const { connectionIndex, nodes } = buildConnectionsFromTracks({
      trackName: track,
    });

    expect(connectionIndex).toEqual({
      trackName: { nodeAId: "node0", nodeBId: "node1" },
    });
    expect(nodes).toEqual([
      {
        geometry: { coordinates: [0, 0, 0], type: "Point" },
        id: "node0",
      },
      {
        geometry: { coordinates: [0.3, 0.3, 25], type: "Point" },
        id: "node1",
      },
    ]);
  });

  it("does not duplicate nodes for contiguous tracks", () => {
    const trackName = "myTrackName";
    const otherTrackName = "otherTrackName";
    const track: Track = aTrack(trackName);
    const contiguousTrack: Track = aTrack(otherTrackName, [
      [
        [0.3, 0.3, 25],
        [3, 3, 10],
      ],
    ]);

    const { connectionIndex, nodes } = buildConnectionsFromTracks({
      trackName: track,
      otherTrackName: contiguousTrack,
    });

    expect(connectionIndex).toEqual({
      trackName: { nodeAId: "node0", nodeBId: "node1" },
      otherTrackName: { nodeAId: "node1", nodeBId: "node2" },
    });
    expect(nodes).toHaveLength(3);
    expect(nodes).toEqual([
      {
        geometry: { coordinates: [0, 0, 0], type: "Point" },
        id: "node0",
      },
      {
        geometry: { coordinates: [0.3, 0.3, 25], type: "Point" },
        id: "node1",
      },
      {
        geometry: { coordinates: [3, 3, 10], type: "Point" },
        id: "node2",
      },
    ]);
  });
});

const aTrack = (name: string, coordinates?: Position[][]): Track => {
  return {
    properties: {
      name,
      path_type: "paved",
    },
    geometry: {
      type: "MultiLineString",
      coordinates: coordinates || [
        [
          [0, 0, 0],
          [0.1, 0.1, 10],
          [0.2, 0.2, 8],
          [0.3, 0.3, 25],
        ],
      ],
    },
  };
};
