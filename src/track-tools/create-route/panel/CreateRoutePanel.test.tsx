import { render, screen } from "@testing-library/react";
import { Route, nullRoute } from "../CreateRoute";
import { CreateRoutePanel } from "./CreateRoutePanel";

describe("create route panel", () => {
  it("displays route's start point when selected", () => {
    const route: Route = {
      ...nullRoute,
      startPoint: "startPointId",
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
});
