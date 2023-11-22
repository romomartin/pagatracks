import { Feature, FeatureCollection } from "geojson";
import {
  Track,
  getMergedRawTracks,
  trackFromGeoJSON,
  tracksToFeatureCollection,
} from "./track";
import { setFetchGlobalMock } from "../__test_helpers__/mock-fetch";

describe("tracks", () => {
  describe("get tracks", () => {
    it("retrieves merged raw tracks from data", async () => {
      setFetchGlobalMock();

      const tracks: Feature[] = await getMergedRawTracks();

      expect(tracks).toHaveLength(1);
    });

    it("throws error if fetch fails", async () => {
      const expectedError =
        "Unable to fetch tracks TypeError: Cannot read properties of undefined (reading 'json')";
      const logErrorSpy = jest.spyOn(global.console, "error");

      await getMergedRawTracks();

      expect(logErrorSpy).toHaveBeenCalled();
      expect(logErrorSpy).toHaveBeenCalledWith(expectedError);

      logErrorSpy.mockRestore();
    });
  });

  describe("track from geojson", () => {
    const aTrackId = "track135";

    it("builds a track object from a geojson file", () => {
      const feature: Feature = aFeature();

      const track = trackFromGeoJSON(feature, aTrackId);

      expect(track.properties.name).toBeDefined();
      expect(track.geometry).toBeDefined();
    });

    it("sets track id from given id", () => {
      const featureName = "aName";
      const trackId = "track145";
      const feature: Feature = aFeature(featureName);

      const track = trackFromGeoJSON(feature, trackId);

      expect(track.id).toEqual(trackId);
    });

    it("sets track name from feature name", () => {
      const featureName = "aName";
      const feature: Feature = aFeature(featureName);

      const track = trackFromGeoJSON(feature, aTrackId);

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

      const track = trackFromGeoJSON(featureWithoutName, aTrackId);

      expect(track.properties.name).toEqual("no name");
    });

    it("sets geometry from feature geometry", () => {
      const feature: Feature = aFeature();

      const track = trackFromGeoJSON(feature, aTrackId);

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
    id: "track1",
    properties: { name: name || "trackName", path_type: "unpaved" },
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
