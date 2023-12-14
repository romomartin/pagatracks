import { Feature, FeatureCollection } from "geojson";
import {
  getTracks,
  trackFromGeoJSON,
  tracksToFeatureCollection,
} from "./track";
import { setFetchGlobalMock } from "../__test_helpers__/mock-fetch";
import { aTrack } from "../__test_helpers__/aTrack";
import { aTrackFeature } from "../__test_helpers__/geoJSON";

describe("tracks", () => {
  describe("getMergedRawTracks", () => {
    it("retrieves merged raw tracks from data", async () => {
      setFetchGlobalMock();

      const tracks: FeatureCollection = await getTracks();

      expect(tracks).toBeDefined();
      expect(tracks).toHaveProperty("type", "FeatureCollection");
      expect(tracks).toHaveProperty("features");
    });

    it("throws error if fetch fails", async () => {
      const expectedError =
        "Unable to fetch tracks TypeError: Cannot read properties of undefined (reading 'json')";
      const logErrorSpy = jest
        .spyOn(global.console, "error")
        .mockImplementation(() => {});

      await getTracks();

      expect(console.error).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(expectedError);

      logErrorSpy.mockRestore();
    });
  });

  describe("trackFromGeoJSON", () => {
    it("builds a track object from a geojson file", () => {
      const feature: Feature = aTrackFeature();

      const track = trackFromGeoJSON(feature);

      expect(track.id).toBeDefined();
      expect(track.properties.name).toBeDefined();
      expect(track.geometry).toBeDefined();
    });

    it("sets track name from feature name", () => {
      const featureName = "aName";
      const feature: Feature = aTrackFeature({ name: featureName });

      const track = trackFromGeoJSON(feature);

      expect(track.properties.name).toEqual("aName");
    });

    it("sets track id from feature id", () => {
      const feature: Feature = aTrackFeature({ id: "track_245" });

      const track = trackFromGeoJSON(feature);

      expect(track.id).toEqual("track_245");
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

    it("sets track path type from feature property", () => {
      const feature: Feature = aTrackFeature({ path_type: "paved" });

      const track = trackFromGeoJSON(feature);

      expect(track.properties.path_type).toEqual("paved");
    });

    it("sets unknown track path type when feature property is not known type", () => {
      const feature: Feature = aTrackFeature({ path_type: "adoquines" });

      const track = trackFromGeoJSON(feature);

      expect(track.properties.path_type).toEqual("unknown");
    });

    it("sets geometry from feature geometry", () => {
      const feature: Feature = aTrackFeature();

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
      expect(trackFeaturesCollection.features[0].properties).toEqual({
        id: track1.id,
        ...track1.properties,
      });
    });
  });
});
