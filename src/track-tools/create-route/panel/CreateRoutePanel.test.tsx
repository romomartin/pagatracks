/* eslint-disable testing-library/no-unnecessary-act */
import { act, render, screen } from "@testing-library/react";
import { Route, nullRoute } from "../CreateRoute";
import { CreateRoutePanel } from "./CreateRoutePanel";
import userEvent from "@testing-library/user-event";

describe("create route panel", () => {
  it("shows hint when starting create new route", () => {
    const route: Route = nullRoute;
    render(
      <CreateRoutePanel
        isVisible={true}
        route={route}
        deleteRoute={() => {}}
        undoRoute={() => {}}
      />
    );

    const renderedPanel = screen.getByLabelText("createRoutePanel");

    expect(renderedPanel).toHaveTextContent("Select starting point");
  });

  it("shows hint when start point is selected", () => {
    const route: Route = { ...nullRoute, startPointId: "aPointId" };
    render(
      <CreateRoutePanel
        isVisible={true}
        route={route}
        deleteRoute={() => {}}
        undoRoute={() => {}}
      />
    );

    const renderedPanel = screen.getByLabelText("createRoutePanel");

    expect(renderedPanel).toHaveTextContent("Select next track");
  });

  it("shows hint when delete button is hovered", async () => {
    const route: Route = { ...nullRoute, startPointId: "aPointId" };
    render(
      <CreateRoutePanel
        isVisible={true}
        route={route}
        deleteRoute={() => {}}
        undoRoute={() => {}}
      />
    );
    const deleteButton = screen.getByLabelText("deleteRoute");

    act(() => {
      userEvent.hover(deleteButton);
    });
    const deleteRouteHint = await screen.findByText("Delete route");

    expect(deleteRouteHint).toBeDefined();
  });

  it("shows hint when undo button is hovered", async () => {
    const route: Route = { ...nullRoute, startPointId: "aPointId" };
    render(
      <CreateRoutePanel
        isVisible={true}
        route={route}
        deleteRoute={() => {}}
        undoRoute={() => {}}
      />
    );
    const deleteButton = screen.getByLabelText("undoRoute");

    act(() => {
      userEvent.hover(deleteButton);
    });
    const deleteRouteHint = await screen.findByText("Undo");

    expect(deleteRouteHint).toBeDefined();
  });

  it("shows hint when download button is hovered", async () => {
    const route: Route = { ...nullRoute, startPointId: "aPointId" };
    render(
      <CreateRoutePanel
        isVisible={true}
        route={route}
        deleteRoute={() => {}}
        undoRoute={() => {}}
      />
    );
    const deleteButton = screen.getByLabelText("downloadRoute");

    act(() => {
      userEvent.hover(deleteButton);
    });
    const deleteRouteHint = await screen.findByText("Download route");

    expect(deleteRouteHint).toBeDefined();
  });

  it("shows hint when trying to download route without any track", async () => {
    const route: Route = { ...nullRoute, startPointId: "aPointId" };
    render(
      <CreateRoutePanel
        isVisible={true}
        route={route}
        deleteRoute={() => {}}
        undoRoute={() => {}}
      />
    );
    const deleteButton = screen.getByLabelText("downloadRoute");

    act(() => {
      userEvent.click(deleteButton);
    });
    const deleteRouteHint = await screen.findByText("First add a track");

    expect(deleteRouteHint).toBeDefined();
  });

  it("shows route stats", async () => {
    const route: Route = {
      ...nullRoute,
      startPointId: "aPointId",
      routeStats: { length: 12.3, elevGain: 1234.8 },
    };
    render(
      <CreateRoutePanel
        isVisible={true}
        route={route}
        deleteRoute={() => {}}
        undoRoute={() => {}}
      />
    );

    const renderedPanel = screen.getByLabelText("createRoutePanel");

    expect(renderedPanel).toHaveTextContent("12.3km");
    expect(renderedPanel).toHaveTextContent("+1235m");
  });
});
