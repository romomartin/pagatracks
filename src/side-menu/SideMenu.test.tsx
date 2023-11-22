import { render, screen } from "@testing-library/react";
import { SideMenu } from "./SideMenu";
import { TrackTool } from "../track-tools";

describe("Side menu", () => {
  it("renders tool's button and panel", () => {
    render(<SideMenu trackTools={[aTrackTool()]}></SideMenu>);

    const toolButton = screen.getByLabelText("toolButton");
    const toolPanel = screen.getByText("The tool panel");

    expect(toolButton).toBeInTheDocument();
    expect(toolPanel).toBeInTheDocument();
  });
});

const aTrackTool = (): TrackTool => {
  return {
    button: <button key={"toolButton"} aria-label="toolButton"></button>,
    panel: <div key={"toolPanel"}>The tool panel</div>,
  };
};
