import { MapboxGeoJSONFeature } from "mapbox-gl";
import style from "./styles.module.css";
import { FunctionComponent } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

type Props = {
  selectedTrack: MapboxGeoJSONFeature | undefined;
};

export const ElevationChart: FunctionComponent<Props> = ({
  selectedTrack,
}: Props) => {
  const chartOptions: Highcharts.Options = {
    title: { text: selectedTrack?.properties?.name },
    series: [
      {
        type: "line",
        data: [
          [1, 1],
          [2, 1],
          [3, 2],
        ],
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
