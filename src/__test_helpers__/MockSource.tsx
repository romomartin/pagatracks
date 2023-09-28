export const MockSource = (props: any): JSX.Element => {
  const sourceProps = {
    type: props.type,
    data: props.data,
  };
  const layerProps = props.children.props;
  return (
    <>
      <ul>
        <li>"sourceProps"{JSON.stringify(sourceProps)}</li>
        <li>"layerProps"{JSON.stringify(layerProps)}</li>
      </ul>
    </>
  );
};
