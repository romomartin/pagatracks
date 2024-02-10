import { render, screen } from "@testing-library/react";
import { TracksLayer } from "./TracksLayer";
import { FeatureCollection } from "geojson";
import { aTrackFeature } from "../../__test_helpers__/geoJSON";
import { aTrack } from "../../__test_helpers__/aTrack";
import { nullRoute } from "../../track-tools/create-route/CreateRoute";

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
        currentRoute={nullRoute}
      />
    );
    const source = await screen.findByText(/source-id: tracks/i);

    expect(source).toHaveTextContent(/type: geojson/i);
    expect(source).toHaveTextContent(/data-type: FeatureCollection/i);
    expect(source).toHaveTextContent(
      /data-features:.*aFeatureName.*otherFeatureName/i
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
        currentRoute={nullRoute}
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
        currentRoute={nullRoute}
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
        currentRoute={nullRoute}
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

  it("allows to filter selectable tracks", async () => {
    const theTrackId = "track_1";
    const theTrack = aTrack({ id: theTrackId });
    const otherTrackId = "track_2";
    const otherTrack = aTrack({ id: otherTrackId });
    const tracks = {
      type: "FeatureCollection",
      features: [
        aTrackFeature({ id: theTrackId }),
        aTrackFeature({ id: otherTrackId }),
      ],
    } as FeatureCollection;

    render(
      <TracksLayer
        tracks={tracks}
        selectedFeatureId={""}
        hoveredFeatureId={""}
        currentRoute={{
          startPointId: "node0",
          endPointId: "",
          segments: [],
          nextPossibleSegments: [
            { track: theTrack, isReversed: false },
            { track: otherTrack, isReversed: false },
          ],
          routeStats: { length: 0, elevGain: 0 },
        }}
      />
    );
    const selectableTracksLayer = await screen.findByText(
      /layer-id: selectable-tracks/i
    );

    expect(selectableTracksLayer).toHaveTextContent(
      /filter: in,id,track_1,track_2/i
    );
  });

  it("does not filter selectable tracks when there is no active route", async () => {
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
        currentRoute={nullRoute}
      />
    );
    const selectableTracksLayer = await screen.findByText(
      /layer-id: selectable-tracks/i
    );

    expect(selectableTracksLayer).toHaveTextContent(/filter: undefined/i);
  });
});
