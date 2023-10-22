import { MapLayerMouseEvent } from "mapbox-gl";
import { MapCanvas } from "./map/MapCanvas";
import { useEffect, useState } from "react";
import { ElevationChart } from "./elevation-chart/ElevationChart";
import {
  Track,
  TrackByName,
  getMergedRawTracks,
  trackFromGeoJSON,
  tracksToFeatureCollection,
} from "./tracks/track";
import { Feature } from "geojson";

function App() {
  const [tracks, setTracks] = useState<TrackByName>({});

  const setTracksFromFetch = async () => {
    const mergedRawTracks = await getMergedRawTracks();
    const tracks: TrackByName = {};
    mergedRawTracks.forEach((rawTrack: Feature) => {
      const track = trackFromGeoJSON(rawTrack);
      tracks[track.properties.name] = track;
    });
    setTracks(tracks);
  };

  const trackFeatures = tracksToFeatureCollection(Object.values(tracks));

  useEffect(() => {
    setTracksFromFetch();
  }, []);

  const [selectedTrackName, setSelectedTrackName] = useState<string>("");

  const handleMapClick = (event: MapLayerMouseEvent) => {
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
