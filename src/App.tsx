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
import {
  Connections,
  buildConnectionsFromTracks,
  nullConnections,
} from "./network/build-connections";
import { nodesToFeatureCollection } from "./network/nodes-to-feature-collection";

function App() {
  const [tracks, setTracks] = useState<TracksByName>({});
  const [connections, setConnections] = useState<Connections>(nullConnections);

  useEffect(() => {
    setTracksFromFetch();
  }, []);

  useEffect(() => {
    setConnections(buildConnectionsFromTracks(tracks));
  }, [tracks]);

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
  const nodeFeatures = nodesToFeatureCollection(connections.nodes);

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
        nodes={nodeFeatures}
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
