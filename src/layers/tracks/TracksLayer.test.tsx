import { render, screen } from "@testing-library/react";
import { TracksLayer } from "./TracksLayer";
import { FeatureCollection } from "geojson";
import {
  selectableTracksStyle,
  selectedTrackStyle,
  tracksStyle,
} from "./tracks-layer-styles";
import { aLineFeature } from "../../__test_helpers__/geoJSON";

describe("Tracks layer", () => {
  const featureName = "aFeatureName";

  it("sets given tracks as map source data", async () => {
    const otherFeatureName = "otherFeatureName";
    const tracks = {
      type: "FeatureCollection",
      features: [aLineFeature(featureName), aLineFeature(otherFeatureName)],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedTrackName={""}
        hoveredTrackName={""}
      />
    );
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
      features: [aLineFeature(featureName)],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedTrackName={""}
        hoveredTrackName={""}
      />
    );
    const tracksLayer = await screen.findByText(/layer-id: tracks/i);

    expect(tracksLayer).toHaveTextContent(/type: line/i);
    expect(tracksLayer).toHaveTextContent(
      `paint: ${JSON.stringify(tracksStyle.paint)}`
    );
  });

  it("applies selected track layer style", async () => {
    const tracks = {
      type: "FeatureCollection",
      features: [aLineFeature(featureName)],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedTrackName={""}
        hoveredTrackName={""}
      />
    );
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(/type: line/i);
    expect(selectedTrackLayer).toHaveTextContent(
      `paint: ${JSON.stringify(selectedTrackStyle.paint)}`
    );
  });

  it("applies hovered track layer style", async () => {
    const tracks = {
      type: "FeatureCollection",
      features: [aLineFeature(featureName)],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedTrackName={""}
        hoveredTrackName={""}
      />
    );
    const hoveredTrackLayer = await screen.findByText(
      /layer-id: hovered-track/i
    );

    expect(hoveredTrackLayer).toHaveTextContent(/type: line/i);
    expect(hoveredTrackLayer).toHaveTextContent(
      `paint: ${JSON.stringify(selectedTrackStyle.paint)}`
    );
  });

  it("applies selectable helper track layer style", async () => {
    const tracks = {
      type: "FeatureCollection",
      features: [aLineFeature(featureName)],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedTrackName={""}
        hoveredTrackName={""}
      />
    );
    const selectableTrackLayer = await screen.findByText(
      /layer-id: selectable-tracks/i
    );

    expect(selectableTrackLayer).toHaveTextContent(/type: line/i);
    expect(selectableTrackLayer).toHaveTextContent(
      `paint: ${JSON.stringify(selectableTracksStyle.paint)}`
    );
  });

  it("applies selected track filter to selected track when provided", async () => {
    const selectedTrackName = "selectedFeatureName";
    const tracks = {
      type: "FeatureCollection",
      features: [aLineFeature(featureName), aLineFeature(selectedTrackName)],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedTrackName={"selectedFeatureName"}
        hoveredTrackName={""}
      />
    );
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(
      /filter: in,name,selectedFeatureName/i
    );
  });

  it("applies hovered track filter to hovered track when provided", async () => {
    const hoveredTrackName = "hoveredFeatureName";
    const tracks = {
      type: "FeatureCollection",
      features: [aLineFeature(featureName), aLineFeature(hoveredTrackName)],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedTrackName={""}
        hoveredTrackName={"hoveredFeatureName"}
      />
    );
    const hoveredTrackLayer = await screen.findByText(
      /layer-id: hovered-track/i
    );

    expect(hoveredTrackLayer).toHaveTextContent(
      /filter: in,name,hoveredFeatureName/i
    );
  });

  it("does not apply hovered track filter to hovered track when similar to selected track", async () => {
    const trackName = "arrastaleku";
    const tracks = {
      type: "FeatureCollection",
      features: [aLineFeature(featureName), aLineFeature(trackName)],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedTrackName={trackName}
        hoveredTrackName={trackName}
      />
    );
    const hoveredTrackLayer = await screen.findByText(
      /layer-id: hovered-track/i
    );
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(hoveredTrackLayer).not.toHaveTextContent(
      /filter: in,name,arrastaleku/i
    );
    expect(selectedTrackLayer).toHaveTextContent(
      /filter: in,name,arrastaleku/i
    );
  });
});
