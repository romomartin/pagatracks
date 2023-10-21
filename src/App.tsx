import { MapLayerMouseEvent } from "mapbox-gl";
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

  const [selectedTrackName, setSelectedTrackName] = useState<string>("");

  const handleMapClick = (event: MapLayerMouseEvent) => {
    console.log(event);
    if (event.features && event.features[0]) {
      setSelectedTrackName(event.features[0].properties?.name);
    } else {
      setSelectedTrackName("");
    }
  };

  return (
    <>
      <MapCanvas
        tracks={trackFeatures}
        onClick={handleMapClick}
        selectedTrackName={selectedTrackName}
      ></MapCanvas>
      {selectedTrackName && (
        <ElevationChart selectedTrackName={selectedTrackName}></ElevationChart>
      )}
    </>
  );
}

export default App;
