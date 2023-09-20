const fs = require('fs');

const DATA_URL = 'dummy-data' 
const DESTINATION_URL = 'src/data/mergedRawTracks.json'

const mergeRawTracks = () => {
    const rawTracks = [];
  
    fs.readdirSync(DATA_URL).forEach((fileName) => {
      if (!fileName.includes("geojson")) return;
  
      const rawTrack = JSON.parse(fs.readFileSync(`${DATA_URL}/${fileName}`, "utf8"));
      rawTracks.push(rawTrack);
    });

    const mergedRawTracks = JSON.stringify(rawTracks);
  
    fs.writeFileSync(`${DESTINATION_URL}`,mergedRawTracks )
};

mergeRawTracks()