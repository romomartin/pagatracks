import { render, screen } from "@testing-library/react";
import { SideMenu } from "./SideMenu";

describe("Side menu", () => {
  it("has tool button", () => {
    render(<SideMenu></SideMenu>);

    const toolButtons = screen.getAllByLabelText("toolButton");

    expect(toolButtons[0]).toBeInTheDocument();
  });
});
