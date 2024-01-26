import { render, screen } from "@testing-library/react";
import { Route, nullRoute } from "../CreateRoute";
import { CreateRoutePanel } from "./CreateRoutePanel";
import userEvent from "@testing-library/user-event";

describe("create route panel", () => {
  it("shows hint when starting create new route", () => {
    const route: Route = nullRoute;
    render(
      <CreateRoutePanel isVisible={true} route={route} deleteRoute={() => {}} />
    );

    const renderedPanel = screen.getByLabelText("createRoutePanel");

    expect(renderedPanel).toHaveTextContent("Select starting point");
  });

  it("shows hint when start point is selected", () => {
    const route: Route = { ...nullRoute, startPointId: "aPointId" };
    render(
      <CreateRoutePanel isVisible={true} route={route} deleteRoute={() => {}} />
    );

    const renderedPanel = screen.getByLabelText("createRoutePanel");

    expect(renderedPanel).toHaveTextContent("Select next track");
  });

  it("shows hint when delete button is hovered", async () => {
    const route: Route = { ...nullRoute, startPointId: "aPointId" };
    render(
      <CreateRoutePanel isVisible={true} route={route} deleteRoute={() => {}} />
    );
    const deleteButton = screen.getByLabelText("deleteRoute");

    userEvent.hover(deleteButton);
    const deleteRouteHint = await screen.findByText("Delete route");

    expect(deleteRouteHint).toBeDefined();
  });

  it("shows hint when undo button is hovered", async () => {
    const route: Route = { ...nullRoute, startPointId: "aPointId" };
    render(
      <CreateRoutePanel isVisible={true} route={route} deleteRoute={() => {}} />
    );
    const deleteButton = screen.getByLabelText("undoRoute");

    userEvent.hover(deleteButton);
    const deleteRouteHint = await screen.findByText("Undo");

    expect(deleteRouteHint).toBeDefined();
  });

  it("shows hint when download button is hovered", async () => {
    const route: Route = { ...nullRoute, startPointId: "aPointId" };
    render(
      <CreateRoutePanel isVisible={true} route={route} deleteRoute={() => {}} />
    );
    const deleteButton = screen.getByLabelText("downloadRoute");

    userEvent.hover(deleteButton);
    const deleteRouteHint = await screen.findByText("Download route");

    expect(deleteRouteHint).toBeDefined();
  });
});
