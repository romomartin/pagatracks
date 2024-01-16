import { render, screen } from "@testing-library/react";
import { Route, nullRoute } from "../CreateRoute";
import { CreateRoutePanel } from "./CreateRoutePanel";

describe("create route panel", () => {
  it("shows create route button if user is not creating a route", () => {
    const route: Route = nullRoute;
    const panel = CreateRoutePanel({
      isVisible: true,
      isCreatingRoute: false,
      createNewRoute: () => {},
      route,
    });

    render(panel);
    const renderedPanel = screen.getByLabelText("createRoutePanel");

    expect(renderedPanel).toHaveTextContent("Create new route");
  });

  it("shows hint when starting create new route", async () => {
    const route: Route = nullRoute;
    const panel = CreateRoutePanel({
      isVisible: true,
      isCreatingRoute: true,
      createNewRoute: () => {},
      route,
    });

    render(panel);
    const renderedPanel = screen.getByLabelText("createRoutePanel");

    expect(renderedPanel).toHaveTextContent(
      "Select your route's starting point"
    );
  });

  it("displays route's start point when selected", () => {
    const route: Route = {
      ...nullRoute,
      startPointId: "startPointId",
    };
    const panel = CreateRoutePanel({
      isVisible: true,
      isCreatingRoute: true,
      createNewRoute: () => {},
      route,
    });

    render(panel);
    const renderedPanel = screen.getByLabelText("createRoutePanel");

    expect(renderedPanel).toHaveTextContent("start point: startPointId");
  });

  it("shows hint when start point is selected", async () => {
    const route: Route = { ...nullRoute, startPointId: "aPointId" };
    const panel = CreateRoutePanel({
      isVisible: true,
      isCreatingRoute: true,
      createNewRoute: () => {},
      route,
    });

    render(panel);
    const renderedPanel = screen.getByLabelText("createRoutePanel");

    expect(renderedPanel).toHaveTextContent("Select route's next track");
  });
});
