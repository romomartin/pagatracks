import { fireEvent, render, screen } from "@testing-library/react";
import { SideMenu } from "./SideMenu";

describe("Side menu", () => {
  it("has tool button", () => {
    render(<SideMenu></SideMenu>);

    const toolButtons = screen.getAllByLabelText("toolButton");

    expect(toolButtons[0]).toBeInTheDocument();
  });

  it("shows tool panel when tool button is clicked", () => {
    render(<SideMenu></SideMenu>);
    const toolButtons = screen.getAllByLabelText("toolButton");
    fireEvent.click(toolButtons[0]);

    const panel = screen.queryByText("Create new route");

    expect(panel).toBeVisible();
  });
});
