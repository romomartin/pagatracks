import { render, screen } from "@testing-library/react";
import { Track } from "../tracks/track";
import { ElevationChart } from "./ElevationChart";

jest.mock("highcharts-react-official", () => ({
  ...jest.requireActual("highcharts-react-official"),
  default: jest.requireActual("../__test_helpers__/HighchartsReactMock")
    .default,
  __esModule: true,
}));

describe("Elevation chart", () => {
  it("shows elevation profile of track", () => {
    render(
      <ElevationChart selectedTrack={aTrack("selectedTrack")}></ElevationChart>
    );

    const elevationChart = screen.getByText(/title: "selectedTrack"/i);

    expect(elevationChart).toHaveTextContent('"type":"line"');
    expect(elevationChart).toHaveTextContent('"name":"elevation"');
    expect(elevationChart).toHaveTextContent(
      '"data":[[0,0],[15743,10],[31486,8],[47229,25]]'
    );
  });
});

const aTrack = (name: string): Track => {
  return {
    properties: {
      name,
      path_type: "paved",
    },
    geometry: {
      type: "MultiLineString",
      coordinates: [
        [
          [0, 0, 0],
          [0.1, 0.1, 10],
          [0.2, 0.2, 8],
          [0.3, 0.3, 25],
        ],
      ],
    },
  };
};
