import style from "./styles.module.css";
import { FunctionComponent, useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Track } from "../tracks/track";
import { MultiLineString, Position } from "geojson";
import { getDistance } from "geolib";
import { GeolibInputCoordinates } from "geolib/es/types";
import { texts } from "../texts";
import { ReactComponent as ReverseLogo } from "./reverse-icon.svg";

type Props = {
  selectedTrack: Track | undefined;
};

type AdditionalData = {
  length: number;
  elevationGain: number;
};

const nullAdditionalData = {
  length: 0,
  elevationGain: 0,
};

export const ElevationChart: FunctionComponent<Props> = ({
  selectedTrack,
}: Props) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});
  const [additionalData, setAdditionalData] =
    useState<AdditionalData>(nullAdditionalData);
  const [isReversed, setIsReversed] = useState<boolean>(false);

  useEffect(() => {
    const copiedGeometry = copyGeometry(
      selectedTrack?.geometry as MultiLineString
    );

    const chartGeometry = isReversed
      ? reverseTrackGeometry(copiedGeometry)
      : copiedGeometry;

    setAdditionalData({
      length: metersToKm(getMultilineStringLength(chartGeometry)),
      elevationGain: selectedTrack
        ? getTrackElevationGain(selectedTrack, isReversed)
        : 0,
    });

    setChartOptions(
      buildChartOptions(
        elevationDataFrom(chartGeometry),
        selectedTrack?.properties.name
      )
    );
  }, [selectedTrack, isReversed]);

  const reverseChart = () => {
    setIsReversed(!isReversed);
  };

  return (
    <div className={style.container} aria-label="elevation-chart">
      <div className={style.specs} aria-label="additionalData">
        {roundToOneDecimal(additionalData.length)}km +
        {Math.round(additionalData.elevationGain)}m
        <button
          id={style.reverseButton}
          aria-label="reverseChartButton"
          onClick={() => reverseChart()}
        >
          <ReverseLogo></ReverseLogo>
        </button>
      </div>
      <HighchartsReact
        updateArgs={[true, true, true]}
        allowChartUpdate={true}
        highcharts={Highcharts}
        options={chartOptions}
      ></HighchartsReact>
    </div>
  );
};

const buildChartOptions = (
  elevationData: number[][],
  title: string = ""
): Highcharts.Options => {
  return {
    title: { text: title },
    series: [
      {
        type: "line",
        name: texts.elevation,
        data: elevationData,
        tooltip: {
          valueSuffix: "m",
          headerFormat: "",
        },
      },
    ],
    chart: {
      height: "180px",
      backgroundColor: "transparent",
    },
    legend: {
      enabled: false,
    },
  };
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

const getMultilineStringLength = (multilineString: MultiLineString): number => {
  const firstPosition = multilineString.coordinates[0][0];
  let previousPosition = firstPosition;

  const length = multilineString.coordinates[0].reduce(
    (totalLength, position) => {
      totalLength += getDistance(
        positionToGeolibInputCoordinates(previousPosition),
        positionToGeolibInputCoordinates(position)
      );
      previousPosition = position;

      return totalLength;
    },
    0
  );

  return length;
};

const getTrackElevationGain = (
  track: Track,
  isReversed: boolean = false
): number => {
  const copiedGeometry = copyGeometry(track.geometry as MultiLineString);
  if (isReversed) reverseTrackGeometry(copiedGeometry);

  const elevationGain = copiedGeometry.coordinates.reduce(
    (totalElevGain, lineString) => {
      lineString.reduce((lastPosition, position) => {
        const elevGain = position[2] - lastPosition[2];

        if (elevGain > 0) totalElevGain += elevGain;

        return position;
      }, lineString[0]);

      return totalElevGain;
    },
    0
  );

  return elevationGain;
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

const copyGeometry = (geometry: MultiLineString): MultiLineString => {
  const coordinates = geometry.coordinates.map((line) => {
    return line.map((position) => {
      return position.map((number) => number);
    });
  });

  return { type: "MultiLineString", coordinates };
};

const reverseTrackGeometry = (geometry: MultiLineString): MultiLineString => {
  const coordinates = geometry.coordinates.reverse().map((line) => {
    return line.reverse();
  });

  return { type: "MultiLineString", coordinates };
};

const roundToOneDecimal = (number: number): number => {
  return Math.round(number * 10) / 10;
};
