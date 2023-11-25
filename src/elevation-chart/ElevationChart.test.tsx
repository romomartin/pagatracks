import { render, screen } from "@testing-library/react";
import { ElevationChart } from "./ElevationChart";
import { aTrack } from "../__test_helpers__/aTrack";

jest.mock("highcharts-react-official", () => ({
  ...jest.requireActual("highcharts-react-official"),
  default: jest.requireActual("../__test_helpers__/HighchartsReactMock")
    .default,
  __esModule: true,
}));

describe("Elevation chart", () => {
  it("shows elevation profile of track", () => {
    render(
      <ElevationChart
        selectedTrack={aTrack({ name: "selectedTrack" })}
      ></ElevationChart>
    );

    const elevationChart = screen.getByText(/title: "selectedTrack"/i);

    expect(elevationChart).toHaveTextContent('"type":"line"');
    expect(elevationChart).toHaveTextContent('"name":"elevation"');
    expect(elevationChart).toHaveTextContent(
      '"data":[[0,0],[15.743,10],[31.486,8],[47.229,25]]'
    );
  });

  it("sets correct styles for series tooltip", () => {
    render(
      <ElevationChart
        selectedTrack={aTrack({ name: "selectedTrack" })}
      ></ElevationChart>
    );

    const elevationChart = screen.getByText(/title: "selectedTrack"/i);

    expect(elevationChart).toHaveTextContent(
      '"tooltip":{"valueSuffix":"m","headerFormat":""}}]'
    );
  });
});
