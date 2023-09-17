import { Feature } from "geojson";
import { Track } from "./track";

export const trackFromGeoJSON = (geoJSON: Feature) => {
  const track = {
    properties: { name: geoJSON.properties?.name || "no name" },
    geometry: geoJSON.geometry,
  };

  return track as Track;
};
