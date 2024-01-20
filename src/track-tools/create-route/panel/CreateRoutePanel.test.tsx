import { render, screen } from "@testing-library/react";
import { Route, nullRoute } from "../CreateRoute";
import { CreateRoutePanel } from "./CreateRoutePanel";

describe("create route panel", () => {
  it("shows hint when starting create new route", async () => {
    const route: Route = nullRoute;
    const panel = CreateRoutePanel({
      isVisible: true,
      route,
    });
    render(panel);
    const renderedPanel = screen.getByLabelText("createRoutePanel");
    expect(renderedPanel).toHaveTextContent("Select starting point");
  });

  it("shows hint when start point is selected", async () => {
    const route: Route = { ...nullRoute, startPointId: "aPointId" };
    const panel = CreateRoutePanel({
      isVisible: true,
      route,
    });
    render(panel);
    const renderedPanel = screen.getByLabelText("createRoutePanel");
    expect(renderedPanel).toHaveTextContent("Select next track");
  });
});
