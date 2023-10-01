import { Children } from "react";

export const MockSource = (props: any): JSX.Element => {
  const sourceProps = {
    type: props.type,
    data: props.data,
  };
  const layersProps = Children.map(props.children, (child) => child.props);
  return (
    <>
      <ul>
        <li>"sourceProps"{JSON.stringify(sourceProps)}</li>
        <li>"layersProps"{JSON.stringify(layersProps)}</li>
      </ul>
    </>
  );
};
