import style from "./styles.module.css";
import { FunctionComponent } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Track } from "../tracks/track";
import { MultiLineString, Position } from "geojson";
import { getDistance } from "geolib";
import { GeolibInputCoordinates } from "geolib/es/types";
import { texts } from "../texts";

type Props = {
  selectedTrack: Track | undefined;
};

export const ElevationChart: FunctionComponent<Props> = ({
  selectedTrack,
}: Props) => {
  const trackGeometry = selectedTrack?.geometry as MultiLineString;

  const chartOptions: Highcharts.Options = {
    title: { text: selectedTrack?.properties.name },
    series: [
      {
        type: "line",
        name: texts.elevation,
        data: elevationDataFrom(trackGeometry),
      },
    ],
    chart: {
      height: "180px",
    },
    legend: {
      enabled: false,
    },
  };

  return (
    <div className={style.container} aria-label="elevation-chart">
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      ></HighchartsReact>
    </div>
  );
};

const elevationDataFrom = (geometry: MultiLineString): number[][] => {
  const firstPosition = geometry.coordinates[0][0];
  let previousPosition = firstPosition;
  let distance = 0;
  const elevationData = geometry.coordinates[0].map((position) => {
    distance += getDistance(
      positionToGeolibInputCoordinates(previousPosition),
      positionToGeolibInputCoordinates(position)
    );
    previousPosition = position;
    return [metersToKm(distance), position[2]];
  });
  return elevationData;
};

const positionToGeolibInputCoordinates = (
  position: Position
): GeolibInputCoordinates => {
  return {
    longitude: position[0],
    latitude: position[1],
  } as GeolibInputCoordinates;
};

const metersToKm = (meters: number): number => {
  return meters / 1000;
};
