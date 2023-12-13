import { Screen } from "@testing-library/react";
import { FeatureCollection } from "geojson";

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
  fetchedData: FeatureCollection = defaultFetchedData
) => {
  await screen.findByText(JSON.stringify(fetchedData.features), {
    exact: false,
  });
};

const defaultFetchedData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
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
    },
  ],
};
