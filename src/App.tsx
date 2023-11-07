import { MapLayerMouseEvent } from "mapbox-gl";
import { MapCanvas } from "./map/MapCanvas";
import { useEffect, useState } from "react";
import { ElevationChart } from "./elevation-chart/ElevationChart";
import {
  TracksByName,
  getMergedRawTracks,
  trackFromGeoJSON,
  tracksToFeatureCollection,
} from "./tracks/track";
import { Feature } from "geojson";
import { SideMenu } from "./side-menu/SideMenu";

function App() {
  const [tracks, setTracks] = useState<TracksByName>({});

  useEffect(() => {
    setTracksFromFetch();
  }, []);

  const setTracksFromFetch = async () => {
    const mergedRawTracks = await getMergedRawTracks();
    const tracks: TracksByName = {};
    mergedRawTracks.forEach((rawTrack: Feature) => {
      const track = trackFromGeoJSON(rawTrack);
      tracks[track.properties.name] = track;
    });
    setTracks(tracks);
  };

  const trackFeatures = tracksToFeatureCollection(Object.values(tracks));

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
        <ElevationChart
          selectedTrack={tracks[selectedTrackName]}
        ></ElevationChart>
      )}
      <SideMenu></SideMenu>
    </>
  );
}

export default App;
