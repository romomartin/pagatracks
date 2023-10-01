import { render, screen } from "@testing-library/react";
import { TracksLayer } from "./TracksLayer";
import { Feature } from "geojson";
import { selectedTracksStyle, tracksStyle } from "./layer-styles";
import { MapboxGeoJSONFeature } from "mapbox-gl";

describe("Tracks layer", () => {
  const featureName = "aFeatureName";

  it("returns fetched tracks as map source", async () => {
    const otherFeatureName = "otherFeatureName";
    const fetchedData = [aFeature(featureName), aFeature(otherFeatureName)];
    setFetchGlobalMock(fetchedData);

    render(<TracksLayer selectedTrack={undefined} />);
    const data = await screen.findByText(/aFeatureName/i);

    expect(data).toHaveTextContent('type":"geojson');
    expect(data).toHaveTextContent(
      `type":"FeatureCollection","features":${JSON.stringify(fetchedData)}`
    );
  });

  it("applies tracks layer style", async () => {
    setFetchGlobalMock([aFeature(featureName)]);

    render(<TracksLayer selectedTrack={undefined} />);
    await screen.findByText(/aFeatureName/i);
    const style = screen.queryByText(/layersProps/i);

    expect(style).toHaveTextContent(JSON.stringify(tracksStyle));
  });

  it("applies selectedTracks filter to selected track when provided", async () => {
    setFetchGlobalMock([aFeature(featureName)]);
    const selectedTrack = aFeature("selectedFeature") as MapboxGeoJSONFeature;
    const selectedTrackProps = {
      ...selectedTracksStyle,
      filter: ["in", "name", "selectedFeature"],
    };

    render(<TracksLayer selectedTrack={selectedTrack} />);
    await screen.findByText(/aFeatureName/i);
    const style = screen.queryByText(/layersProps/i);

    expect(style).toHaveTextContent(JSON.stringify(tracksStyle));
    expect(style).toHaveTextContent(JSON.stringify(selectedTrackProps));
  });
});

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
