import { Geometry } from "geojson";

export type Track = {
  properties: { name: string; path_type: string };
  geometry: Geometry;
};
