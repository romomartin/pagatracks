import { Track } from "./track";
import { getTracks } from "./track-service";

describe("track service", () => {
  it("retrieves tracks from dummy data", () => {
    const tracks: Track[] = getTracks();

    expect(tracks).toHaveLength(9);
  });
});
