import HighchartsReact from "highcharts-react-official";

const HighchartsReactMock = ({
  options,
}: HighchartsReact.Props): JSX.Element => {
  return (
    <div id="MockHighcharts">
      {`title: ${JSON.stringify(options?.title?.text)}`}
      {`series: ${JSON.stringify(options?.series)}`}
    </div>
  );
};

HighchartsReactMock.displayName = "HighchartsReact";

export default HighchartsReactMock;
