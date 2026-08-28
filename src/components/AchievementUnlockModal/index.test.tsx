import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppStore } from "../../stores/app";
import { AchievementUnlockModal } from ".";

// src/i18n.ts loads translations over HTTP (i18next-http-backend), which cannot
// resolve in jsdom, so t() echoes the key back and assertions stay on the keys
// instead of translated copy.
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const initialState = useAppStore.getState();

const queue = (...keys: Parameters<typeof initialState.enqueueAchievementUnlocks>[0]) => {
  useAppStore.getState().enqueueAchievementUnlocks(keys);
};

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe("AchievementUnlockModal", () => {
  it("renders nothing while the queue is empty", () => {
    render(<AchievementUnlockModal />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the queued achievement in a modal dialog", () => {
    queue("night_owl");
    render(<AchievementUnlockModal />);

    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "achievements.night_owl_name",
    );
  });

  it("shows the icon of the queued achievement", () => {
    queue("veteran");
    render(<AchievementUnlockModal />);

    expect(
      screen.getByAltText("achievements.veteran_name"),
    ).toHaveAttribute("src", "/assets/veteran.webp");
  });

  it("renders into document.body through a portal", () => {
    queue("polyglot");
    const { container } = render(<AchievementUnlockModal />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.getByRole("dialog").parentElement).toBe(document.body);
  });

  it("locks body scrolling while a dialog is open", () => {
    queue("halloween");
    render(<AchievementUnlockModal />);

    expect(document.body.style.overflow).toBe("hidden");
  });
});

describe("dismissing", () => {
  it("advances to the next achievement in the queue", async () => {
    const user = userEvent.setup();

    queue("night_owl", "veteran");
    render(<AchievementUnlockModal />);

    await user.click(screen.getByRole("button", { name: "achievements.got_it" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "achievements.veteran_name",
      );
    });
    expect(useAppStore.getState().achievementUnlockQueue).toEqual(["veteran"]);
  });

  it("closes after the last achievement", async () => {
    const user = userEvent.setup();

    queue("night_owl");
    render(<AchievementUnlockModal />);

    await user.click(screen.getByRole("button", { name: "achievements.got_it" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(useAppStore.getState().achievementUnlockQueue).toEqual([]);
  });

  it("releases the body scroll lock once the queue is drained", async () => {
    const user = userEvent.setup();

    queue("night_owl");
    render(<AchievementUnlockModal />);

    await user.click(screen.getByRole("button", { name: "achievements.got_it" }));

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
    });
  });

  it("dismisses on the backdrop click but not on a click inside the card", async () => {
    const user = userEvent.setup();

    queue("night_owl");
    render(<AchievementUnlockModal />);

    await user.click(screen.getByRole("heading", { level: 2 }));
    expect(useAppStore.getState().achievementUnlockQueue).toEqual(["night_owl"]);

    await user.click(screen.getByRole("dialog"));
    expect(useAppStore.getState().achievementUnlockQueue).toEqual([]);
  });

  it("dismisses on Escape", async () => {
    const user = userEvent.setup();

    queue("night_owl", "veteran");
    render(<AchievementUnlockModal />);

    await user.keyboard("{Escape}");

    expect(useAppStore.getState().achievementUnlockQueue).toEqual(["veteran"]);
  });
});
