import fs, { readFileSync } from "fs";
import { Track } from "./track";
import { Feature } from "geojson";

const DATA_URL = "./src/dummy_data";

export const trackFromGeoJSON = (geoJSON: Feature) => {
  const track: Track = {
    properties: { name: geoJSON.properties?.name || "no name" },
    geometry: geoJSON.geometry,
  };

  return track;
};

export const getTracks = (): Track[] => {
  const tracks: Track[] = [];

  fs.readdirSync(DATA_URL).forEach((file) => {
    if (!file.includes("geojson")) return;

    const rawTrack = JSON.parse(readFileSync(`${DATA_URL}/${file}`, "utf8"));
    const track = trackFromGeoJSON(rawTrack);
    tracks.push(track);
  });

  return tracks;
};
