import { act, render, screen } from "@testing-library/react";
import { ElevationChart } from "./ElevationChart";
import { aTrack } from "../__test_helpers__/aTrack";
import userEvent from "@testing-library/user-event";
import { nullRoute } from "../track-tools/create-route/CreateRoute";
import { PathTypes } from "../tracks/track";

jest.mock("highcharts-react-official", () => ({
  ...jest.requireActual("highcharts-react-official"),
  default: jest.requireActual("../__test_helpers__/HighchartsReactMock")
    .default,
  __esModule: true,
}));

describe("Elevation chart", () => {
  it("sets correct styles for series tooltip", () => {
    render(
      <ElevationChart
        selectedTrack={aTrack({ name: "selectedTrack" })}
        currentRoute={nullRoute}
        connectionIndex={{}}
      ></ElevationChart>
    );

    const elevationChart = screen.getByText(/title: "selectedTrack"/i);

    expect(elevationChart).toHaveTextContent(
      '"tooltip":{"valueSuffix":"m","headerFormat":""}'
    );
  });

  describe("with no current route", () => {
    it("shows elevation profile of track", () => {
      render(
        <ElevationChart
          selectedTrack={aTrack({ name: "selectedTrack" })}
          currentRoute={nullRoute}
          connectionIndex={{}}
        ></ElevationChart>
      );

      const elevationChart = screen.getByText(/title: "selectedTrack"/i);

      expect(elevationChart).toHaveTextContent('"type":"area"');
      expect(elevationChart).toHaveTextContent('"name":"elevation"');
      expect(elevationChart).toHaveTextContent(
        '"data":[{"x":0,"y":0,"coordinates":[0,0]},' +
          '{"x":15.743,"y":10,"coordinates":[0.1,0.1]},' +
          '{"x":31.486,"y":8,"coordinates":[0.2,0.2]},' +
          '{"x":47.229,"y":25,"coordinates":[0.3,0.3]}]'
      );
    });

    it("shows elevation profile color matching track's path type", () => {
      render(
        <ElevationChart
          selectedTrack={aTrack({
            name: "selectedTrack",
            path_type: PathTypes.SINGLETRACK,
          })}
          currentRoute={nullRoute}
          connectionIndex={{}}
        ></ElevationChart>
      );

      const elevationChart = screen.getByText(/title: "selectedTrack"/i);

      expect(elevationChart).toHaveTextContent('"color":"#175920"');
    });

    it("shows total distance of track", () => {
      render(
        <ElevationChart
          selectedTrack={aTrack({ name: "selectedTrack" })}
          currentRoute={nullRoute}
          connectionIndex={{}}
        ></ElevationChart>
      );

      const additionalData = screen.getByLabelText("additionalData");

      expect(additionalData).toHaveTextContent("47.2km");
    });

    it("shows elevation gain of track", () => {
      render(
        <ElevationChart
          selectedTrack={aTrack({ name: "selectedTrack" })}
          currentRoute={nullRoute}
          connectionIndex={{}}
        ></ElevationChart>
      );

      const additionalData = screen.getByLabelText("additionalData");

      expect(additionalData).toHaveTextContent("+27m");
    });

    it("shows elevation gain of track when reversing series", () => {
      render(
        <ElevationChart
          selectedTrack={aTrack({ name: "selectedTrack" })}
          currentRoute={nullRoute}
          connectionIndex={{}}
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

    it("allows reversing elevation profile of track", () => {
      render(
        <ElevationChart
          selectedTrack={aTrack({ name: "selectedTrack" })}
          currentRoute={nullRoute}
          connectionIndex={{}}
        ></ElevationChart>
      );

      const elevationChart = screen.getByText(/title: "selectedTrack"/i);

      expect(elevationChart).toHaveTextContent(
        '"data":[{"x":0,"y":0,"coordinates":[0,0]},' +
          '{"x":15.743,"y":10,"coordinates":[0.1,0.1]},' +
          '{"x":31.486,"y":8,"coordinates":[0.2,0.2]},' +
          '{"x":47.229,"y":25,"coordinates":[0.3,0.3]}]'
      );

      const reverseButton = screen.getByLabelText("reverseChartButton");
      // eslint-disable-next-line testing-library/no-unnecessary-act
      act(() => {
        userEvent.click(reverseButton);
      });

      expect(elevationChart).toHaveTextContent(
        '"data":[{"x":0,"y":25,"coordinates":[0.3,0.3]},' +
          '{"x":15.743,"y":8,"coordinates":[0.2,0.2]},' +
          '{"x":31.486,"y":10,"coordinates":[0.1,0.1]},' +
          '{"x":47.229,"y":0,"coordinates":[0,0]}]'
      );
    });

    it("undoes reversing elevation profile of track from reverse button", () => {
      render(
        <ElevationChart
          selectedTrack={aTrack({ name: "selectedTrack" })}
          currentRoute={nullRoute}
          connectionIndex={{}}
        ></ElevationChart>
      );
      const elevationChart = screen.getByText(/title: "selectedTrack"/i);

      const reverseButton = screen.getByLabelText("reverseChartButton");
      // eslint-disable-next-line testing-library/no-unnecessary-act
      act(() => {
        userEvent.click(reverseButton);
      });
      // eslint-disable-next-line testing-library/no-unnecessary-act
      act(() => {
        userEvent.click(reverseButton);
      });

      expect(elevationChart).toHaveTextContent(
        '"data":[{"x":0,"y":0,"coordinates":[0,0]},' +
          '{"x":15.743,"y":10,"coordinates":[0.1,0.1]},' +
          '{"x":31.486,"y":8,"coordinates":[0.2,0.2]},' +
          '{"x":47.229,"y":25,"coordinates":[0.3,0.3]}]'
      );
    });
  });

  describe("with current route", () => {
    it("shows elevation profile of route", () => {
      render(
        <ElevationChart
          selectedTrack={undefined}
          currentRoute={aRoute}
          connectionIndex={{
            firstTrack: { startNodeId: "node0", endNodeId: "node1" },
            secondTrack: { startNodeId: "node1", endNodeId: "node2" },
          }}
        ></ElevationChart>
      );

      const elevationChart = screen.getByText(/title: "Your route"/i);

      expect(elevationChart).toHaveTextContent('"type":"area"');
      expect(elevationChart).toHaveTextContent('"name":"elevation"');
      expect(elevationChart).toHaveTextContent(
        '"data":[{"x":0,"y":0,"coordinates":[0,0]},{"x":157.426,"y":1,"coordinates":[1,1]}]'
      );
    });

    it("matches path type color for each route's track", () => {
      render(
        <ElevationChart
          selectedTrack={undefined}
          currentRoute={aRoute}
          connectionIndex={{
            firstTrack: { startNodeId: "node0", endNodeId: "node1" },
            secondTrack: { startNodeId: "node1", endNodeId: "node2" },
          }}
        ></ElevationChart>
      );

      const elevationChart = screen.getByText(/title: "Your route"/i);

      expect(elevationChart).toHaveTextContent(
        /"color":"#6930C3".*"color":"#C70039"/i
      );
    });

    it("shows elevation profile of route in correct order", () => {
      render(
        <ElevationChart
          selectedTrack={undefined}
          currentRoute={aReversedRoute}
          connectionIndex={{
            firstTrack: { startNodeId: "node0", endNodeId: "node1" },
            secondTrack: { startNodeId: "node1", endNodeId: "node2" },
          }}
        ></ElevationChart>
      );

      const elevationChart = screen.getByText(/title: "Your route"/i);

      expect(elevationChart).toHaveTextContent(
        '"data":[{"x":0,"y":2,"coordinates":[2,2]},{"x":157.402,"y":1,"coordinates":[1,1]}]'
      );
    });

    it("does not show reversing button", () => {
      render(
        <ElevationChart
          selectedTrack={undefined}
          currentRoute={aRoute}
          connectionIndex={{
            firstTrack: { startNodeId: "node0", endNodeId: "node1" },
            secondTrack: { startNodeId: "node1", endNodeId: "node2" },
          }}
        ></ElevationChart>
      );

      const reverseButton = screen.queryByLabelText("reverseChartButton");

      expect(reverseButton).not.toBeInTheDocument();
    });
  });
});

const firstTrack = aTrack({
  id: "firstTrack",
  name: "firstTrack",
  coordinates: [
    [
      [0, 0, 0],
      [1, 1, 1],
    ],
  ],
  path_type: PathTypes.PAVED,
});

const secondTrack = aTrack({
  id: "secondTrack",
  name: "secondTrack",
  coordinates: [
    [
      [1, 1, 1],
      [2, 2, 2],
    ],
  ],
  path_type: PathTypes.UNPAVED,
});

const aRoute = {
  startPointId: "node0",
  endPointId: "node2",
  segments: [
    { track: firstTrack, isReversed: false },
    { track: secondTrack, isReversed: false },
  ],
  nextPossibleSegments: [],
  routeStats: {
    length: 125,
    elevGain: 2,
  },
};

const aReversedRoute = {
  startPointId: "node2",
  endPointId: "node0",
  segments: [
    { track: secondTrack, isReversed: true },
    { track: firstTrack, isReversed: true },
  ],
  nextPossibleSegments: [],
  routeStats: {
    length: 125,
    elevGain: 2,
  },
};
