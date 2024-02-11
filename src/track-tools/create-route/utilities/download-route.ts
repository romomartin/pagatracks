import { Feature, FeatureCollection, MultiLineString } from "geojson";
import { Route } from "../CreateRoute";
import GeoJsonToGpx from "@dwayneparton/geojson-to-gpx";

export const downloadRoute = (route: Route) => {
  const routeGeoJson = routeToFeatureCollection(route);

  const options = {
    metadata: {
      name: "Pagasarri",
      author: {
        name: "Pagatracks",
        link: {
          href: "https://www.pagatracks.eus",
        },
      },
    },
  };

  const routeGPX = GeoJsonToGpx(routeGeoJson, options);

  const gpxString = new XMLSerializer().serializeToString(routeGPX);

  const link = document.createElement("a");
  link.download = "pagatracks.gpx";
  const blob = new Blob([gpxString], { type: "text/xml" });
  link.href = window.URL.createObjectURL(blob);
  link.click();
};

const routeToFeatureCollection = (route: Route): FeatureCollection => {
  const features = route.segments.map((segment) => {
    const geometry = copyGeometry(segment.track.geometry as MultiLineString);

    if (segment.isReversed) reverseTrackGeometry(geometry);

    return { type: "Feature", geometry } as Feature;
  });

  return {
    type: "FeatureCollection",
    features,
  };
};

const copyGeometry = (geometry: MultiLineString): MultiLineString => {
  const coordinates = geometry.coordinates.map((line) => {
    return line.map((position) => {
      return position.map((number) => number);
    });
  });

  return { type: "MultiLineString", coordinates };
};

const reverseTrackGeometry = (geometry: MultiLineString): MultiLineString => {
  const coordinates = geometry.coordinates.reverse().map((line) => {
    return line.reverse();
  });

  return { type: "MultiLineString", coordinates };
};
