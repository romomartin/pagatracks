import { MapLayerMouseEvent, MapboxGeoJSONFeature } from "mapbox-gl";
import { MapCanvas } from "./map/MapCanvas";
import { useState } from "react";

function App() {
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
    <MapCanvas
      onClick={handleMapClick}
      selectedTrack={selectedTrack}
    ></MapCanvas>
  );
}

export default App;
