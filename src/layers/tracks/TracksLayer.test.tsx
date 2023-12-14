import { render, screen } from "@testing-library/react";
import { TracksLayer } from "./TracksLayer";
import { FeatureCollection } from "geojson";
import {
  selectableTracksStyle,
  highlightedTrackStyle,
  tracksStyle,
} from "./tracks-layer-styles";
import { aTrackFeature } from "../../__test_helpers__/geoJSON";

describe("Tracks layer", () => {
  const featureName = "aFeatureName";

  it("sets given tracks as map source data", async () => {
    const otherFeatureName = "otherFeatureName";
    const tracks = {
      type: "FeatureCollection",
      features: [
        aTrackFeature({ name: featureName }),
        aTrackFeature({ name: otherFeatureName }),
      ],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={""}
        hoveredFeatureId={""}
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
      features: [aTrackFeature({ name: featureName })],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={""}
        hoveredFeatureId={""}
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
      features: [aTrackFeature({ name: featureName })],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={""}
        hoveredFeatureId={""}
      />
    );
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(/type: line/i);
    expect(selectedTrackLayer).toHaveTextContent(
      `paint: ${JSON.stringify(highlightedTrackStyle.paint)}`
    );
  });

  it("applies hovered track layer style", async () => {
    const tracks = {
      type: "FeatureCollection",
      features: [aTrackFeature({ name: featureName })],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={""}
        hoveredFeatureId={""}
      />
    );
    const hoveredTrackLayer = await screen.findByText(
      /layer-id: hovered-track/i
    );

    expect(hoveredTrackLayer).toHaveTextContent(/type: line/i);
    expect(hoveredTrackLayer).toHaveTextContent(
      `paint: ${JSON.stringify(highlightedTrackStyle.paint)}`
    );
  });

  it("applies selectable helper track layer style", async () => {
    const tracks = {
      type: "FeatureCollection",
      features: [aTrackFeature({ name: featureName })],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={""}
        hoveredFeatureId={""}
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
    const selectedTrackId = "track_134";
    const tracks = {
      type: "FeatureCollection",
      features: [aTrackFeature({ id: selectedTrackId })],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={"track_134"}
        hoveredFeatureId={""}
      />
    );
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(/filter: in,id,track_134/i);
  });

  it("applies hovered track filter to hovered track when provided", async () => {
    const hoveredTrackId = "track_134";
    const tracks = {
      type: "FeatureCollection",
      features: [aTrackFeature({ id: hoveredTrackId })],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={""}
        hoveredFeatureId={"track_134"}
      />
    );
    const hoveredTrackLayer = await screen.findByText(
      /layer-id: hovered-track/i
    );

    expect(hoveredTrackLayer).toHaveTextContent(/filter: in,id,track_134/i);
  });

  it("does not apply hovered track filter to hovered track when similar to selected track", async () => {
    const trackId = "track_21";
    const tracks = {
      type: "FeatureCollection",
      features: [aTrackFeature({ name: trackId, id: trackId })],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={trackId}
        hoveredFeatureId={trackId}
      />
    );
    const hoveredTrackLayer = await screen.findByText(
      /layer-id: hovered-track/i
    );
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(hoveredTrackLayer).not.toHaveTextContent(/filter: in,id,track_21/i);
    expect(selectedTrackLayer).toHaveTextContent(/filter: in,id,track_21/i);
  });
});
