const fs = require('fs');
const path = require('path')

const DATA_URL = '../dummy-data/TRACKS.geojson' 
const DESTINATION_URL = '../public/data/tracks.json'

const dataPath = path.resolve(__dirname, DATA_URL);
const destinationPath = path.resolve(__dirname, DESTINATION_URL);

const mergeRawTracks = () => {
  const rawTracks = JSON.parse(fs.readFileSync(`${dataPath}`, "utf8"));

  const mergedRawTracks = JSON.stringify(rawTracks);
  
  fs.writeFileSync(`${destinationPath}`,mergedRawTracks )
  console.log(`✅ tracks merged in ${DESTINATION_URL}`)
};

mergeRawTracks()