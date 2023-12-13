const fs = require('fs');
const path = require('path')

const DATA_URL = '../dummy-data' 
const DESTINATION_URL = '../public/data/mergedRawTracks.json'

const dataPath = path.resolve(__dirname, DATA_URL);
const destinationPath = path.resolve(__dirname, DESTINATION_URL);

const mergeRawTracks = () => {
    const rawTracks = [];
  
    fs.readdirSync(dataPath).forEach((fileName) => {
      if (!fileName.includes("geojson")) return;
  
      const rawTrack = JSON.parse(fs.readFileSync(`${dataPath}/${fileName}`, "utf8"));
      rawTracks.push(rawTrack);
    });

    const mergedRawTracks = JSON.stringify(rawTracks);
  
    fs.writeFileSync(`${destinationPath}`,mergedRawTracks )
    console.log(`✅ ${rawTracks.length} tracks merged in ${DESTINATION_URL}`)
};

mergeRawTracks()