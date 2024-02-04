import { act, render, screen } from "@testing-library/react";
import { ElevationChart } from "./ElevationChart";
import { aTrack } from "../__test_helpers__/aTrack";
import userEvent from "@testing-library/user-event";

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

  it("shows total distance of track", () => {
    render(
      <ElevationChart
        selectedTrack={aTrack({ name: "selectedTrack" })}
      ></ElevationChart>
    );

    const additionalData = screen.getByLabelText("additionalData");

    expect(additionalData).toHaveTextContent("47.2km");
  });

  it("shows elevation gain of track", () => {
    render(
      <ElevationChart
        selectedTrack={aTrack({ name: "selectedTrack" })}
      ></ElevationChart>
    );

    const additionalData = screen.getByLabelText("additionalData");

    expect(additionalData).toHaveTextContent("+27m");
  });

  it("shows elevation gain of track when reversing series", () => {
    render(
      <ElevationChart
        selectedTrack={aTrack({ name: "selectedTrack" })}
      ></ElevationChart>
    );
    const additionalData = screen.getByLabelText("additionalData");
    const reverseButton = screen.getByLabelText("reverseChartButton");

    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      userEvent.click(reverseButton);
    });

    expect(additionalData).toHaveTextContent("+2m");
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

  it("allows reversing elevation profile of track", () => {
    render(
      <ElevationChart
        selectedTrack={aTrack({ name: "selectedTrack" })}
      ></ElevationChart>
    );

    const elevationChart = screen.getByText(/title: "selectedTrack"/i);

    expect(elevationChart).toHaveTextContent(
      '"data":[[0,0],[15.743,10],[31.486,8],[47.229,25]]'
    );

    const reverseButton = screen.getByLabelText("reverseChartButton");
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      userEvent.click(reverseButton);
    });

    expect(elevationChart).toHaveTextContent(
      '"data":[[0,25],[15.743,8],[31.486,10],[47.229,0]]'
    );
  });

  it("undoes reversing elevation profile of track from reverse button", () => {
    render(
      <ElevationChart
        selectedTrack={aTrack({ name: "selectedTrack" })}
      ></ElevationChart>
    );

    const elevationChart = screen.getByText(/title: "selectedTrack"/i);

    expect(elevationChart).toHaveTextContent(
      '"data":[[0,0],[15.743,10],[31.486,8],[47.229,25]]'
    );

    const reverseButton = screen.getByLabelText("reverseChartButton");
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      userEvent.click(reverseButton);
    });

    expect(elevationChart).toHaveTextContent(
      '"data":[[0,25],[15.743,8],[31.486,10],[47.229,0]]'
    );

    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      userEvent.click(reverseButton);
    });

    expect(elevationChart).toHaveTextContent(
      '"data":[[0,0],[15.743,10],[31.486,8],[47.229,25]]'
    );
  });
});
