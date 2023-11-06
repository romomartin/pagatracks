import { render, screen } from "@testing-library/react";
import { SidePanel } from "./SidePanel";

describe("Side panel", () => {
  it("Has side panel button", () => {
    render(<SidePanel></SidePanel>);

    const sidePanelButtons = screen.getAllByLabelText("panelButton");

    expect(sidePanelButtons[0]).toBeInTheDocument();
  });
});
