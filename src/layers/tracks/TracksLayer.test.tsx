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
        animatedTracksIds={[]}
        selectableTracksIds={[]}
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
        animatedTracksIds={[]}
        selectableTracksIds={[]}
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
        animatedTracksIds={[]}
        selectableTracksIds={[]}
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
        animatedTracksIds={[]}
        selectableTracksIds={[]}
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
        animatedTracksIds={[]}
        selectableTracksIds={[]}
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
        animatedTracksIds={[]}
        selectableTracksIds={[]}
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
        animatedTracksIds={[]}
        selectableTracksIds={[]}
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
        animatedTracksIds={[]}
        selectableTracksIds={[]}
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

  it("animated tracks layer visibility blinks", async () => {
    const aTrackId = "track_1";
    const tracks = {
      type: "FeatureCollection",
      features: [aTrackFeature({ id: aTrackId })],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={""}
        hoveredFeatureId={""}
        animatedTracksIds={[aTrackId]}
        selectableTracksIds={[]}
      />
    );
    let visibleAnimatedTracksLayer = await screen.findByText(
      /layer-id: animated-tracks.*visibility: visible/i
    );

    expect(visibleAnimatedTracksLayer).toBeInTheDocument();

    const hidenAnimatedTracksLayer = await screen.findByText(
      /layer-id: animated-tracks.*visibility: visible/i
    );

    expect(hidenAnimatedTracksLayer).toBeInTheDocument();

    visibleAnimatedTracksLayer = await screen.findByText(
      /layer-id: animated-tracks.*visibility: visible/i
    );

    expect(visibleAnimatedTracksLayer).toBeInTheDocument();
  });

  it("allows to show an animated blinking style on a given set of tracks", async () => {
    const aTrackId = "track_1";
    const otherTrackId = "track_2";
    const tracks = {
      type: "FeatureCollection",
      features: [
        aTrackFeature({ id: aTrackId }),
        aTrackFeature({ id: otherTrackId }),
      ],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={""}
        hoveredFeatureId={""}
        animatedTracksIds={[aTrackId, otherTrackId]}
        selectableTracksIds={[]}
      />
    );
    const animatedTracksLayer = await screen.findByText(
      /layer-id: animated-tracks/i
    );

    expect(animatedTracksLayer).toHaveTextContent(
      /filter: in,id,track_1,track_2/i
    );
  });

  it("allows to filter selectable tracks", async () => {
    const aTrackId = "track_1";
    const otherTrackId = "track_2";
    const tracks = {
      type: "FeatureCollection",
      features: [
        aTrackFeature({ id: aTrackId }),
        aTrackFeature({ id: otherTrackId }),
      ],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={""}
        hoveredFeatureId={""}
        animatedTracksIds={[]}
        selectableTracksIds={[aTrackId, otherTrackId]}
      />
    );
    const selectableTracksLayer = await screen.findByText(
      /layer-id: selectable-tracks/i
    );

    expect(selectableTracksLayer).toHaveTextContent(
      /filter: in,id,track_1,track_2/i
    );
  });

  it("does not filter selectable tracks if no selectable tracks are provided", async () => {
    const aTrackId = "track_1";
    const otherTrackId = "track_2";
    const tracks = {
      type: "FeatureCollection",
      features: [
        aTrackFeature({ id: aTrackId }),
        aTrackFeature({ id: otherTrackId }),
      ],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={""}
        hoveredFeatureId={""}
        animatedTracksIds={[]}
        selectableTracksIds={[]}
      />
    );
    const selectableTracksLayer = await screen.findByText(
      /layer-id: selectable-tracks/i
    );

    expect(selectableTracksLayer).toHaveTextContent(/filter: undefined/i);
  });
});
