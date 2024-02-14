type MockNavigationControlProps = {
  visualizePitch: boolean;
  position: string;
};

export const MockNavigationControl = ({
  visualizePitch,
  position,
}: MockNavigationControlProps): JSX.Element => {
  return (
    <div id="MockNavigationControl">
      {`visualizePitch: ${visualizePitch}`}
      {`position: ${position}`}
    </div>
  );
};
