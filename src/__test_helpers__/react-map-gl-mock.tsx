const MockMap = ({ mapStyle }: { mapStyle: string }): JSX.Element => {
  return <div>{mapStyle}</div>;
};

export const mockReactMapGl = () => {
  jest.mock("react-map-gl", () => {
    const lib = jest.requireActual("react-map-gl");

    return {
      ...lib,
      Map: MockMap,
    };
  });
};
