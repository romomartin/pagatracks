import { Feature, FeatureCollection } from "geojson";
import { Track } from "./track";
import {
  getTracks,
  trackFromGeoJSON,
  tracksToFeatureCollection,
} from "./tracks-service";

describe("tracks service", () => {
  describe("get tracks", () => {
    it("retrieves tracks from dummy data", () => {
      const tracks: Track[] = getTracks();

      expect(tracks).toHaveLength(9);
      expect(tracks[0].properties.name).toBeDefined();
      expect(tracks[0].geometry).toBeDefined();
    });
  });

  describe("track from geojson", () => {
    it("builds a track object from a geojson file", () => {
      const feature: Feature = aFeature();

      const track = trackFromGeoJSON(feature);

      expect(track.properties.name).toBeDefined();
      expect(track.geometry).toBeDefined();
    });

    it("sets track name from feature name", () => {
      const featureName = "aName";
      const feature: Feature = aFeature(featureName);

      const track = trackFromGeoJSON(feature);

      expect(track.properties.name).toEqual(featureName);
    });

    it("sets 'no name' as name if feature has no name property", () => {
      const featureWithoutName = {
        type: "Feature",
        geometry: {
          type: "MultiLineString",
          coordinates: [
            [
              [1, 2],
              [3, 4],
            ],
          ],
        },
      } as Feature;

      const track = trackFromGeoJSON(featureWithoutName);

      expect(track.properties.name).toEqual("no name");
    });

    it("sets geometry from feature geometry", () => {
      const feature: Feature = aFeature();

      const track = trackFromGeoJSON(feature);

      expect(track.geometry).toEqual(feature.geometry);
    });
  });

  describe("tracks to feature collection", () => {
    it("builds feature collection from given track array", () => {
      const track1 = aTrack("track1");
      const track2 = aTrack("track2");
      const track3 = aTrack("track3");
      const tracks = [track1, track2, track3];

      const trackFeaturesCollection: FeatureCollection =
        tracksToFeatureCollection(tracks);

      expect(trackFeaturesCollection.type).toBe("FeatureCollection");
      expect(trackFeaturesCollection.features).toHaveLength(3);
      expect(trackFeaturesCollection.features[0].geometry).toEqual(
        track1.geometry
      );
    });
  });
});

const aTrack = (name?: string): Track => {
  return {
    properties: { name: name || "trackName" },
    geometry: {
      type: "MultiLineString",
      coordinates: [
        [
          [1, 2],
          [3, 4],
        ],
      ],
    },
  };
};

const aFeature = (name?: string): Feature => {
  const featureName = name || "featureName";
  return {
    type: "Feature",
    properties: {
      name: featureName,
    },
    geometry: {
      type: "MultiLineString",
      coordinates: [
        [
          [1, 2],
          [3, 4],
        ],
      ],
    },
  };
};
