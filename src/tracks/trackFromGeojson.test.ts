import { Feature } from "geojson";
import { trackFromGeoJSON } from "./trackFromGeojson";

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
