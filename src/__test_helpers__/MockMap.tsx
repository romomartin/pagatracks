export const MockMap = ({
  mapStyle,
  initialViewState,
  interactiveLayerIds,
}: {
  mapStyle: string;
  initialViewState: { longitude: number; latitude: number; zoom: number };
  interactiveLayerIds: string[];
}): JSX.Element => {
  return (
    <>
      <div>
        <ul>
          <li>"mapstyle"{mapStyle}</li>
          <li>"initialViewState"{JSON.stringify(initialViewState, null, 2)}</li>
          <li>"interactiveLayerIds"{interactiveLayerIds}</li>
        </ul>
      </div>
    </>
  );
};
