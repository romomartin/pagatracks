import { act, render, screen } from "@testing-library/react";
import { ToolButton } from "./ToolButton";
import userEvent from "@testing-library/user-event";

describe("ToolButton", () => {
  it("sets button's aria-label", () => {
    const toolKey: string = "myAwesomeTool";
    render(
      <ToolButton
        toolKey={toolKey}
        name={""}
        togglePanelVisibility={() => {}}
        onToggleOn={() => {}}
        onToggleOff={() => {}}
      ></ToolButton>
    );

    const button = screen.getByLabelText("myAwesomeToolButton");

    expect(button).toBeDefined();
  });

  it("defines button's image", () => {
    const toolKey: string = "myAwesomeTool";
    const name: string = "My awesome tool";
    render(
      <ToolButton
        toolKey={toolKey}
        name={name}
        togglePanelVisibility={() => {}}
        onToggleOn={() => {}}
        onToggleOff={() => {}}
      ></ToolButton>
    );

    const buttonImage = screen.getByAltText("My awesome tool icon");

    expect(buttonImage).toBeDefined();
    expect(buttonImage).toHaveAttribute("src", "../tool-icons/myAwesomeTool");
  });

  it("executes function when toggling on", () => {
    const toolKey: string = "myAwesomeTool";
    const name: string = "My awesome tool";
    const onToggleOn = jest.fn();
    render(
      <ToolButton
        toolKey={toolKey}
        name={name}
        togglePanelVisibility={() => {}}
        onToggleOn={onToggleOn}
        onToggleOff={() => {}}
      ></ToolButton>
    );
    const button = screen.getByLabelText("myAwesomeToolButton");

    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      userEvent.click(button);
    });

    expect(onToggleOn).toHaveBeenCalledTimes(1);
  });

  it("executes function when toggling off", () => {
    const toolKey: string = "myAwesomeTool";
    const name: string = "My awesome tool";
    const onToggleOn = jest.fn();
    const onToggleOff = jest.fn();
    render(
      <ToolButton
        toolKey={toolKey}
        name={name}
        togglePanelVisibility={() => {}}
        onToggleOn={onToggleOn}
        onToggleOff={onToggleOff}
      ></ToolButton>
    );
    const button = screen.getByLabelText("myAwesomeToolButton");

    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      userEvent.click(button);
    });

    expect(onToggleOn).toHaveBeenCalledTimes(1);

    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      userEvent.click(button);
    });

    expect(onToggleOff).toHaveBeenCalledTimes(1);
  });
});
