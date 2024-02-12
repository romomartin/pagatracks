import { render, screen } from "@testing-library/react";
import { ToolPanel } from "./ToolPanel";
import { ReactNode } from "react";

describe("ToolPanel", () => {
  it("sets panel's aria-label", () => {
    const toolKey: string = "myAwesomeTool";
    const emptyContent: ReactNode = <></>;
    render(
      <ToolPanel
        toolKey={toolKey}
        panelContent={emptyContent}
        isVisible={true}
      ></ToolPanel>
    );

    const panel = screen.getByLabelText("myAwesomeToolPanel");

    expect(panel).toBeDefined();
  });

  it("sets panel's content", () => {
    const toolKey: string = "myAwesomeTool";
    const panelContent: ReactNode = <>My content</>;
    render(
      <ToolPanel
        toolKey={toolKey}
        panelContent={panelContent}
        isVisible={true}
      ></ToolPanel>
    );

    const panel = screen.getByLabelText("myAwesomeToolPanel");

    expect(panel).toHaveTextContent("My content");
  });
});
