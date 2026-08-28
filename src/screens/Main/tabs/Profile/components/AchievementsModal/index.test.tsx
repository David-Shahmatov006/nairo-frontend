import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mapAchievements } from "../../../../../../constants/achievements";
import type { Achievement } from "../../../../../../types/achievements";
import { AchievementsModal } from ".";

// t() echoes the key back: src/i18n.ts fetches translations over HTTP, which
// cannot work in jsdom, and keys are stabler assertions than English copy.
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const achievements: Achievement[] = mapAchievements([
  { key: "veteran", unlocked: true },
  { key: "night_owl", unlocked: true },
]);

const renderModal = (overrides: Partial<Parameters<typeof AchievementsModal>[0]> = {}) => {
  const props = {
    open: true,
    onClose: jest.fn(),
    achievements,
    ...overrides,
  };

  return { ...render(<AchievementsModal {...props} />), props };
};

// An unlocked tile labels both its icon and its caption with the achievement
// name, so the tile is located through its caption rather than by accessible
// name, which would otherwise contain the name twice.
const getTile = (key: string) => {
  const caption = screen.getByText(`achievements.${key}_name`, {
    selector: "span",
  });
  const tile = caption.closest("button");

  if (!tile) {
    throw new Error(`no tile rendered for ${key}`);
  }

  return tile;
};

// The close button holds an icon only, so it is the one button without a label.
const getCloseButton = () => {
  const button = screen
    .getAllByRole("button")
    .find((candidate) => candidate.textContent === "");

  if (!button) {
    throw new Error("close button not found");
  }

  return button;
};

describe("AchievementsModal", () => {
  it("renders nothing while closed", () => {
    renderModal({ open: false });

    expect(screen.queryByText("achievements.title")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders a tile for every achievement", () => {
    renderModal();

    for (const achievement of achievements) {
      expect(getTile(achievement.key)).toBeInTheDocument();
    }
  });

  it("shows how many achievements are unlocked", () => {
    renderModal();

    expect(screen.getByText(`2/${achievements.length}`)).toBeInTheDocument();
  });

  it("renders the icon of an unlocked achievement", () => {
    renderModal();

    const icon = within(getTile("veteran")).getByRole("img");

    expect(icon).toHaveAttribute("src", "/assets/veteran.webp");
    expect(icon).toHaveAttribute("alt", "achievements.veteran_name");
  });

  it("renders a locked achievement without an icon", () => {
    renderModal();

    expect(within(getTile("polyglot")).queryByRole("img")).not.toBeInTheDocument();
  });

  it("keeps the label of a locked achievement visible", () => {
    renderModal();

    expect(getTile("polyglot")).toHaveTextContent("achievements.polyglot_name");
  });

  it("reveals the description of the hovered achievement", async () => {
    const user = userEvent.setup();

    renderModal();

    expect(
      screen.queryByText("achievements.veteran_description"),
    ).not.toBeInTheDocument();

    await user.hover(getTile("veteran"));

    expect(
      screen.getByText("achievements.veteran_description"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("achievements.night_owl_description"),
    ).not.toBeInTheDocument();
  });

  it("hides the description again on unhover", async () => {
    const user = userEvent.setup();

    renderModal();

    await user.hover(getTile("veteran"));
    await user.unhover(getTile("veteran"));

    await waitFor(() => {
      expect(
        screen.queryByText("achievements.veteran_description"),
      ).not.toBeInTheDocument();
    });
  });

  it("closes on the close button", async () => {
    const user = userEvent.setup();

    const { props } = renderModal();

    await user.click(getCloseButton());

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on a backdrop click", async () => {
    const user = userEvent.setup();

    const { props, container } = renderModal();
    const backdrop = container.firstElementChild as HTMLElement;

    await user.click(backdrop);

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when a tile is clicked", async () => {
    const user = userEvent.setup();

    const { props } = renderModal();

    await user.click(getTile("veteran"));

    expect(props.onClose).not.toHaveBeenCalled();
  });
});
