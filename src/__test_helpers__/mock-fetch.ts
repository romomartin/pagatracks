import { Screen } from "@testing-library/react";
import { Feature } from "geojson";

export const setFetchGlobalMock = (
  responseJson: Object = defaultFetchedData
) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(responseJson),
    })
  ) as jest.Mock;
};

export const forDataToBeFetched = async (
  screen: Screen,
  fetchedData: Feature[] = defaultFetchedData
) => {
  await screen.findByText(JSON.stringify(fetchedData), { exact: false });
};

const defaultFetchedData = [
  {
    type: "Feature",
    geometry: {
      type: "MultiLineString",
      coordinates: [
        [
          [1, 2, 10],
          [3, 4, 12],
        ],
      ],
    },
    properties: {
      name: "featureName",
      path_type: "paved",
    },
  } as Feature,
];
