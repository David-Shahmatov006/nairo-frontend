import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AgentChat } from ".";
import { loadConversation } from "./storage";

jest.mock("../../services/agent.service", () => ({ agentService: { chat: jest.fn() }, AGENT_MESSAGE_MAX_LENGTH: 2000 }));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const open = () => fireEvent.click(screen.getByRole("button", { name: "agent.open" }));
const input = () => screen.getByRole("textbox", { name: "agent.message" });
beforeEach(() => localStorage.clear());

it("restores replies and drafts after remounting, separately for each account", async () => {
  const view = render(<AgentChat userId="alice" onSend={async () => "Your posts"} />);
  open();
  fireEvent.change(input(), { target: { value: "Show posts" } });
  fireEvent.click(screen.getByRole("button", { name: "agent.send" }));
  await screen.findByText("Your posts");
  fireEvent.change(input(), { target: { value: "My next question" } });
  view.unmount();

  const restored = render(<AgentChat userId="alice" />);
  open();
  expect(screen.getByText("Your posts")).toBeInTheDocument();
  expect(screen.getByText("Show posts")).toBeInTheDocument();
  expect(input()).toHaveValue("My next question");
  restored.unmount();

  render(<AgentChat userId="bob" />);
  open();
  expect(screen.queryByText("Your posts")).not.toBeInTheDocument();
  expect(input()).toHaveValue("");
});

it("recovers an interrupted request as a draft", async () => {
  const view = render(<AgentChat userId="alice" onSend={() => new Promise(() => {})} />);
  open();
  fireEvent.change(input(), { target: { value: "Interrupted question" } });
  fireEvent.click(screen.getByRole("button", { name: "agent.send" }));
  await waitFor(() => expect(loadConversation("alice").draft).toBe("Interrupted question"));
  view.unmount();
  render(<AgentChat userId="alice" />);
  open();
  expect(input()).toHaveValue("Interrupted question");
  expect(screen.getByRole("button", { name: "agent.send" })).toBeEnabled();
});

it("opens with an empty conversation if stored data is corrupt", () => {
  localStorage.setItem("nairo-agent-chat:alice", "invalid JSON");
  render(<AgentChat userId="alice" />);
  open();
  expect(input()).toHaveValue("");
});
