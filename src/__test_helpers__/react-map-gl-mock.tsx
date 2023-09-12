const MockMap = ({
  mapStyle,
  initialViewState,
}: {
  mapStyle: string;
  initialViewState: { longitude: number; latitude: number; zoom: number };
}): JSX.Element => {
  return (
    <ul>
      <li>{mapStyle}</li>
      <li>{JSON.stringify(initialViewState, null, 2)}</li>
    </ul>
  );
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
