import { Position } from "geojson";
import { PathTypes, Track } from "../tracks/track";

export const aTrack = ({
  id,
  name,
  coordinates,
}: {
  id?: string;
  name?: string;
  coordinates?: Position[][];
}): Track => {
  return {
    id: id || "track143",
    properties: {
      name: name || "trackName",
      path_type: PathTypes.UNPAVED,
    },
    geometry: {
      type: "MultiLineString",
      coordinates: coordinates || [
        [
          [0, 0, 0],
          [0.1, 0.1, 10],
          [0.2, 0.2, 8],
          [0.3, 0.3, 25],
        ],
      ],
    },
  };
};
