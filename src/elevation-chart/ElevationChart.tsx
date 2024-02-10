import style from "./styles.module.css";
import { FunctionComponent, useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { SeriesOptionsType } from "highcharts";
import { PathTypes, Track } from "../tracks/track";
import { MultiLineString, Position } from "geojson";
import { getDistance } from "geolib";
import { GeolibInputCoordinates } from "geolib/es/types";
import { texts } from "../texts";
import { ReactComponent as ReverseLogo } from "./reverse-icon.svg";
import { Route } from "../track-tools/create-route/CreateRoute";
import { ConnectionIndex } from "../network/build-connections";
import {
  PAVED_COLOR,
  SINGLETRACK_COLOR,
  UNPAVED_COLOR,
} from "../layers/tracks/tracks-layer-styles";

type Props = {
  selectedTrack: Track | undefined;
  currentRoute: Route;
  connectionIndex: ConnectionIndex;
};

type AdditionalData = {
  length: number;
  elevationGain: number;
};

type ElevationData = number[][];

type TrackSeries = {
  elevationData: ElevationData;
  pathType: PathTypes;
};

const nullAdditionalData = {
  length: 0,
  elevationGain: 0,
};

export const ElevationChart: FunctionComponent<Props> = ({
  selectedTrack,
  currentRoute,
  connectionIndex,
}: Props) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});
  const [additionalData, setAdditionalData] =
    useState<AdditionalData>(nullAdditionalData);
  const [isChartReversed, setIsChartReversed] = useState<boolean>(false);

  useEffect(() => {
    const { additionalData, chartOptions } =
      currentRoute.segments.length === 0
        ? getDataForTrack(selectedTrack, isChartReversed)
        : getDataForRoute(currentRoute, connectionIndex);

    setAdditionalData(additionalData);
    setChartOptions(chartOptions);
  }, [selectedTrack, currentRoute, isChartReversed, connectionIndex]);

  const reverseChart = () => {
    setIsChartReversed(!isChartReversed);
  };

  return (
    <div className={style.container} aria-label="elevation-chart">
      <div className={style.specs} aria-label="additionalData">
        {roundToOneDecimal(additionalData.length)}km +
        {Math.round(additionalData.elevationGain)}m
        {currentRoute.segments.length === 0 && (
          <button
            id={style.reverseButton}
            aria-label="reverseChartButton"
            onClick={() => reverseChart()}
          >
            <ReverseLogo></ReverseLogo>
          </button>
        )}
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

const getDataForRoute = (
  route: Route,
  connectionIndex: ConnectionIndex
): { additionalData: AdditionalData; chartOptions: Highcharts.Options } => {
  const additionalData = {
    length: route.routeStats.length,
    elevationGain: route.routeStats.elevGain,
  };

  let trackSeries: TrackSeries[] = [];

  route.segments.reduce(
    (acc, track) => {
      const trackConnections = connectionIndex[track.track.properties.name];
      const geometryCopy = copyGeometry(
        track.track.geometry as MultiLineString
      );

      let isReversed = false;

      if (trackConnections.startNodeId !== acc.lastNodeId) {
        isReversed = true;
        acc.lastNodeId = trackConnections.startNodeId;
      } else {
        acc.lastNodeId = trackConnections.endNodeId;
      }

      const chartGeometry = isReversed
        ? reverseTrackGeometry(geometryCopy)
        : geometryCopy;

      trackSeries.push({
        elevationData: elevationDataFrom(chartGeometry, acc.distanceFromStart),
        pathType: track.track.properties.path_type,
      });
      acc.distanceFromStart += getTrackLengthMeters(track.track);

      return acc;
    },
    { lastNodeId: route.startPointId, distanceFromStart: 0 }
  );

  const chartOptions = buildChartOptions(trackSeries, texts.yourRoute);

  return {
    additionalData,
    chartOptions,
  };
};

const getDataForTrack = (
  track: Track | undefined,
  isReversed: boolean
): { additionalData: AdditionalData; chartOptions: Highcharts.Options } => {
  if (!track) return { additionalData: nullAdditionalData, chartOptions: {} };

  const geometryCopy = copyGeometry(track.geometry as MultiLineString);

  const chartGeometry = isReversed
    ? reverseTrackGeometry(geometryCopy)
    : geometryCopy;

  const additionalData = {
    length: metersToKm(getMultilineStringLength(chartGeometry)),
    elevationGain: track ? getTrackElevationGain(track, isReversed) : 0,
  };

  const trackSeries = {
    elevationData: elevationDataFrom(chartGeometry),
    pathType: track.properties.path_type,
  };

  const chartOptions = buildChartOptions([trackSeries], track.properties.name);

  return {
    additionalData,
    chartOptions,
  };
};

const buildChartOptions = (
  trackSeries: TrackSeries[],
  title: string = ""
): Highcharts.Options => {
  const series: SeriesOptionsType[] = trackSeries.map((trackSeries) => {
    return {
      type: "area",
      name: texts.elevation,
      data: trackSeries.elevationData,
      color: getPathColor(trackSeries.pathType),
      fillOpacity: 0.5,
      marker: { symbol: "circle" },
      tooltip: {
        valueSuffix: "m",
        headerFormat: "",
      },
      states: {
        inactive: {
          opacity: 0.8,
        },
      },
    };
  });
  return {
    title: { text: title },
    series,
    chart: {
      height: "180px",
      backgroundColor: "transparent",
    },
    legend: {
      enabled: false,
    },
  };
};

const getPathColor = (pathType: PathTypes): string => {
  switch (pathType) {
    case (pathType = PathTypes.PAVED): {
      return PAVED_COLOR;
    }
    case (pathType = PathTypes.UNPAVED): {
      return UNPAVED_COLOR;
    }
    case (pathType = PathTypes.SINGLETRACK): {
      return SINGLETRACK_COLOR;
    }
    default: {
      return "purple";
    }
  }
};

const elevationDataFrom = (
  geometry: MultiLineString,
  distanceOffset: number = 0
): number[][] => {
  const firstPosition = geometry.coordinates[0][0];
  let previousPosition = firstPosition;

  const elevationData = geometry.coordinates[0].map((position) => {
    distanceOffset += getDistance(
      positionToGeolibInputCoordinates(previousPosition),
      positionToGeolibInputCoordinates(position)
    );
    previousPosition = position;
    return [metersToKm(distanceOffset), position[2]];
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

const getTrackLengthMeters = (track: Track): number => {
  const trackGeometry = track.geometry as MultiLineString;

  const length = getMultilineStringLength(trackGeometry);

  return length;
};

const roundToOneDecimal = (number: number): number => {
  return Math.round(number * 10) / 10;
};
