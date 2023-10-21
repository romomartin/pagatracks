import { MapLayerMouseEvent, MapboxGeoJSONFeature } from "mapbox-gl";
import { MapCanvas } from "./map/MapCanvas";
import { useEffect, useState } from "react";
import { ElevationChart } from "./elevation-chart/ElevationChart";
import {
  Track,
  getMergedRawTracks,
  trackFromGeoJSON,
  tracksToFeatureCollection,
} from "./tracks/track";
import { Feature } from "geojson";

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);

  const setTracksFromFetch = async () => {
    const mergedRawTracks = await getMergedRawTracks();
    const tracks: Track[] = mergedRawTracks.map((rawTrack: Feature) =>
      trackFromGeoJSON(rawTrack)
    );
    setTracks(tracks);
  };

  const trackFeatures = tracksToFeatureCollection(tracks);

  useEffect(() => {
    setTracksFromFetch();
  }, []);

  const [selectedTrack, setSelectedTrack] = useState<
    MapboxGeoJSONFeature | undefined
  >(undefined);

  const handleMapClick = (event: MapLayerMouseEvent) => {
    if (event.features && event.features[0]) {
      setSelectedTrack(event.features[0]);
    } else {
      setSelectedTrack(undefined);
    }
  };

  return (
    <>
      <MapCanvas
        tracks={trackFeatures}
        onClick={handleMapClick}
        selectedTrack={selectedTrack}
      ></MapCanvas>
      {selectedTrack && (
        <ElevationChart selectedTrack={selectedTrack}></ElevationChart>
      )}
    </>
  );
}

export default App;
