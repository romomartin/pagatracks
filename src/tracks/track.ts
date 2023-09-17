import { Geometry } from "geojson";

export type Track = {
  properties: { name: string };
  geometry: Geometry;
};
