import { Feature, FeatureCollection } from "geojson";
import {
  Track,
  getMergedRawTracks,
  trackFromGeoJSON,
  tracksToFeatureCollection,
} from "./track";
import { setFetchGlobalMock } from "../__test_helpers__/mock-fetch";

describe("tracks", () => {
  describe("getMergedRawTracks", () => {
    it("retrieves merged raw tracks from data", async () => {
      setFetchGlobalMock();

      const tracks: Feature[] = await getMergedRawTracks();

      expect(tracks).toHaveLength(1);
    });

    it("throws error if fetch fails", async () => {
      const expectedError =
        "Unable to fetch tracks TypeError: Cannot read properties of undefined (reading 'json')";
      const logErrorSpy = jest
        .spyOn(global.console, "error")
        .mockImplementation(() => {});

      await getMergedRawTracks();

      expect(console.error).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(expectedError);

      logErrorSpy.mockRestore();
    });
  });

  describe("trackFromGeoJSON", () => {
    it("builds a track object from a geojson file", () => {
      const feature: Feature = aFeature();

      const track = trackFromGeoJSON(feature);

      expect(track.properties.id).toBeDefined();
      expect(track.properties.name).toBeDefined();
      expect(track.geometry).toBeDefined();
    });

    it("sets track name from feature name", () => {
      const featureName = "aName";
      const feature: Feature = aFeature(featureName);

      const track = trackFromGeoJSON(feature);

      expect(track.properties.name).toEqual(featureName);
    });

    it("sets track id from feature id", () => {
      const feature: Feature = aFeature();

      const track = trackFromGeoJSON(feature);

      expect(track.properties.id).toEqual(feature.properties?.fid);
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

  describe("tracksToFeatureCollection", () => {
    it("builds feature collection from given track array", () => {
      const track1 = aTrack({});
      const track2 = aTrack({});
      const track3 = aTrack({});
      const tracks = [track1, track2, track3];

      const trackFeaturesCollection: FeatureCollection =
        tracksToFeatureCollection(tracks);

      expect(trackFeaturesCollection.type).toBe("FeatureCollection");
      expect(trackFeaturesCollection.features).toHaveLength(3);
      expect(trackFeaturesCollection.features[0].geometry).toEqual(
        track1.geometry
      );
      expect(trackFeaturesCollection.features[0].properties).toEqual(
        track1.properties
      );
    });
  });
});

const aTrack = ({ id, name }: { id?: string; name?: string }): Track => {
  return {
    properties: {
      id: id || "track143",
      name: name || "trackName",
      path_type: "unpaved",
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

const aFeature = (name?: string): Feature => {
  const featureName = name || "featureName";
  return {
    type: "Feature",
    properties: {
      fid: 13,
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
