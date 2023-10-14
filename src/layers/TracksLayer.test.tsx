import { render, screen } from "@testing-library/react";
import { TracksLayer } from "./TracksLayer";
import { Feature } from "geojson";
import { selectedTrackStyle, tracksStyle } from "./layer-styles";
import { MapboxGeoJSONFeature } from "mapbox-gl";

describe("Tracks layer", () => {
  const featureName = "aFeatureName";

  it("returns fetched tracks as map source", async () => {
    const otherFeatureName = "otherFeatureName";
    const fetchedData = [aFeature(featureName), aFeature(otherFeatureName)];
    setFetchGlobalMock(fetchedData);

    render(<TracksLayer selectedTrack={undefined} />);
    await forDataToBeFetched(fetchedData);
    const source = await screen.findByText(/source-id: tracks/i);

    expect(source).toHaveTextContent(/type: geojson/i);
    expect(source).toHaveTextContent(
      /data-features:.*featureName.*otherFeatureName/i
    );
  });

  it("applies tracks layer style", async () => {
    setFetchGlobalMock([aFeature(featureName)]);

    render(<TracksLayer selectedTrack={undefined} />);
    await forDataToBeFetched([aFeature(featureName)]);
    const tracksLayer = await screen.findByText(/layer-id: tracks/i);

    expect(tracksLayer).toHaveTextContent(/type: line/i);
    expect(tracksLayer).toHaveTextContent(
      `paint: ${JSON.stringify(tracksStyle.paint)}`
    );
  });

  it("applies selected track layer style", async () => {
    setFetchGlobalMock([aFeature(featureName)]);

    render(<TracksLayer selectedTrack={undefined} />);
    await forDataToBeFetched([aFeature(featureName)]);
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(/type: line/i);
    expect(selectedTrackLayer).toHaveTextContent(
      `paint: ${JSON.stringify(selectedTrackStyle.paint)}`
    );
  });

  it("applies selected track filter to selected track when provided", async () => {
    setFetchGlobalMock([aFeature(featureName)]);
    const selectedTrack = aFeature(
      "selectedFeatureName"
    ) as MapboxGeoJSONFeature;

    render(<TracksLayer selectedTrack={selectedTrack} />);
    await forDataToBeFetched([aFeature(featureName)]);
    const selectedTrackLayer = await screen.findByText(
      /layer-id: selected-track/i
    );

    expect(selectedTrackLayer).toHaveTextContent(
      /filter: in,name,selectedFeatureName/i
    );
  });
});

const forDataToBeFetched = async (fetchedData: Feature[]) => {
  await screen.findByText(JSON.stringify(fetchedData), { exact: false });
};

const setFetchGlobalMock = (responseJson: Object) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(responseJson),
    })
  ) as jest.Mock;
};

const aFeature = (name?: string): Feature => {
  const featureName = name || "featureName";
  return {
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
    properties: {
      name: featureName,
    },
  };
};
