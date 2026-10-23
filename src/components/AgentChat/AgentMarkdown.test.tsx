import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AgentMarkdown } from "./AgentMarkdown";

const show = (content: string, onNavigate = jest.fn()) => render(
  <MemoryRouter><AgentMarkdown content={content} onNavigate={onNavigate} /></MemoryRouter>,
);

it("renders the actual temperature response as inline math", () => {
  const { container } = show(String.raw`**Температура:** ночью около $+10...+12,^\circ\text{C}$, днем $+15...+18,^\circ\text{C}$.`);
  expect(container.querySelectorAll(".katex")).toHaveLength(2);
  expect(container.querySelectorAll("math")).toHaveLength(2);
  expect(container.querySelector("strong")).toHaveTextContent("Температура:");
  expect(container.querySelectorAll(".katex-error")).toHaveLength(0);
});

it("renders display formulas without changing literal code", () => {
  const { container } = show("$$\n\\frac{a}{b} = c^2\n$$\n\n`$x^2$`\n\n```tex\n$y^2$\n```");
  expect(container.querySelector(".katex-display math")).not.toBeNull();
  expect(container.querySelectorAll(".katex")).toHaveLength(1);
  expect(container.querySelector("code")).toHaveTextContent("$x^2$");
  expect(container.querySelector("pre code")).toHaveTextContent("$y^2$");
});

it("preserves tables and navigation to posts", () => {
  const onNavigate = jest.fn();
  const { container } = show("| A | B |\n| - | - |\n| 1 | 2 |\n\n[Post](/post/123)", onNavigate);
  expect(container.querySelector("table")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", { name: "Post" }));
  expect(onNavigate).toHaveBeenCalledTimes(1);
});

it("does not crash on invalid formulas or allow trusted HTML commands", () => {
  const { container } = show(String.raw`$\frac{1}{$ and $\href{javascript:alert(1)}{click}$ <script>alert(1)</script>`);
  expect(container.querySelector("script")).toBeNull();
  expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
  expect(container.querySelector(".katex-error")).toBeInTheDocument();
});
