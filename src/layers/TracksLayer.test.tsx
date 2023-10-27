import { render, screen } from "@testing-library/react";
import { TracksLayer } from "./TracksLayer";
import { Feature, FeatureCollection } from "geojson";
import { selectedTrackStyle, tracksStyle } from "./layer-styles";

describe("Tracks layer", () => {
  const featureName = "aFeatureName";

  it("sets tracks as map source data", async () => {
    const otherFeatureName = "otherFeatureName";
    const tracks = {
      type: "FeatureCollection",
      features: [aFeature(featureName), aFeature(otherFeatureName)],
    } as FeatureCollection;

    render(<TracksLayer tracks={tracks} selectedTrackName={""} />);
    const source = await screen.findByText(/source-id: tracks/i);

    expect(source).toHaveTextContent(/type: geojson/i);
    expect(source).toHaveTextContent(/data-type: FeatureCollection/i);
    expect(source).toHaveTextContent(
      /data-features:.*aFeatureName.*otherFeatureName/i
    );
  });

  it("applies tracks layer style", async () => {
    const tracks = {
      type: "FeatureCollection",
      features: [aFeature(featureName)],
    } as FeatureCollection;

    render(<TracksLayer tracks={tracks} selectedTrackName={""} />);
    const tracksLayer = await screen.findByText(/layer-id: tracks/i);

    expect(tracksLayer).toHaveTextContent(/type: line/i);
    expect(tracksLayer).toHaveTextContent(
      `paint: ${JSON.stringify(tracksStyle.paint)}`
    );
  });

  it("applies selected track layer style", async () => {
    const tracks = {
      type: "FeatureCollection",
      features: [aFeature(featureName)],
    } as FeatureCollection;

    render(<TracksLayer tracks={tracks} selectedTrackName={""} />);
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(/type: line/i);
    expect(selectedTrackLayer).toHaveTextContent(
      `paint: ${JSON.stringify(selectedTrackStyle.paint)}`
    );
  });

  it("applies selected track filter to selected track when provided", async () => {
    const selectedTrackName = "selectedFeatureName";
    const tracks = {
      type: "FeatureCollection",
      features: [aFeature(featureName), aFeature(selectedTrackName)],
    } as FeatureCollection;

    render(
      <TracksLayer tracks={tracks} selectedTrackName={"selectedFeatureName"} />
    );
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(
      /filter: in,name,selectedFeatureName/i
    );
  });
});

const aFeature = (name?: string): Feature => {
  const featureName = name || "featureName";
  return {
    type: "Feature",
    geometry: {
      type: "MultiLineString",
      coordinates: [
        [
          [1, 2, 10],
          [3, 4, 12],
        ],
      ],
    },
    properties: {
      name: featureName,
      path_type: "paved",
    },
  };
};
