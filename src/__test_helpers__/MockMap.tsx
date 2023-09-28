import React from "react";

export const MockMap = ({
  mapStyle,
  initialViewState,
}: {
  mapStyle: string;
  initialViewState: { longitude: number; latitude: number; zoom: number };
}): JSX.Element => {
  return (
    <ul>
      <li>"mapstyle"{mapStyle}</li>
      <li>"initialViewState"{JSON.stringify(initialViewState, null, 2)}</li>
    </ul>
  );
};
