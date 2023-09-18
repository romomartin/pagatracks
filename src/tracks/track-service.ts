import fs, { readFileSync } from "fs";
import { trackFromGeoJSON } from "./trackFromGeojson";
import { Track } from "./track";

const DATA_URL = "./src/dummy_data";

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
