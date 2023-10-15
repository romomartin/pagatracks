import { useEffect, useState } from "react";
import { Track } from "../tracks/track";
import { tracksStyle, selectedTrackStyle } from "./layer-styles";
import { Layer, MapboxGeoJSONFeature, Source } from "react-map-gl";
import { Feature, FeatureCollection } from "geojson";

type TracksLayerProps = {
  selectedTrack: MapboxGeoJSONFeature | undefined;
};

export const TracksLayer = ({ selectedTrack }: TracksLayerProps) => {
  const selectedTrackName: string = selectedTrack?.properties
    ? selectedTrack.properties.name
    : "";

  const [tracks, setTracks] = useState<Track[]>([]);

  const setTracksFromFetch = async () => {
    const mergedRawTracks = await getMergedRawTracks();
    const tracks: Track[] = mergedRawTracks.map((rawTrack: Feature) =>
      trackFromGeoJSON(rawTrack)
    );
    setTracks(tracks);
  };

  useEffect(() => {
    setTracksFromFetch();
  }, []);

  const tracksFeatureCollection = tracksToFeatureCollection(tracks);

  return (
    <>
      <Source id="tracks" type="geojson" data={tracksFeatureCollection}>
        <Layer {...tracksStyle} />
        <Layer
          {...selectedTrackStyle}
          filter={["in", "name", selectedTrackName]}
        />
      </Source>
    </>
  );
};

const getMergedRawTracks = async (): Promise<any> => {
  return await fetch("/data/mergedRawTracks.json").then((response) =>
    response.json()
  );
};

const trackFromGeoJSON = (geoJSON: Feature) => {
  const track: Track = {
    properties: {
      name: geoJSON.properties?.name || "no name",
      path_type: geoJSON.properties?.path_type,
    },
    geometry: geoJSON.geometry,
  };

  return track;
};

const tracksToFeatureCollection = (tracks: Track[]): FeatureCollection => {
  const features: Feature[] = tracks.map((track) => {
    return {
      type: "Feature",
      geometry: track.geometry,
      properties: track.properties,
    };
  });

  return { type: "FeatureCollection", features };
};
