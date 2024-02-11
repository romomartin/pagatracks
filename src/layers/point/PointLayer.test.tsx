import { render, screen } from "@testing-library/react";
import { PointLayer } from "./PointLayer";
import { PathTypes } from "../../tracks/track";

describe("Nodes layer", () => {
  it("sets given point as source data", async () => {
    const point = { x: 1, y: 1, pathType: PathTypes.UNPAVED };
    render(<PointLayer point={point} />);

    const source = await screen.findByText(/source-id: point/i);
    expect(source).toHaveTextContent(/type: geojson/i);
    expect(source).toHaveTextContent(/data-type: Feature/i);
    expect(source).toHaveTextContent(/data-features:.*"coordinates":\[1,1\]/i);
    expect(source).toHaveTextContent(
      /data-features:.*"properties":{"pathType":"unpaved"}/i
    );
  });
});
