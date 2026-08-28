import { useAppStore } from "./app";
import type { Post } from "../types/post";

const initialState = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe("achievement unlock queue", () => {
  it("starts empty", () => {
    expect(useAppStore.getState().achievementUnlockQueue).toEqual([]);
  });

  it("appends new keys in order", () => {
    useAppStore.getState().enqueueAchievementUnlocks(["night_owl", "veteran"]);

    expect(useAppStore.getState().achievementUnlockQueue).toEqual([
      "night_owl",
      "veteran",
    ]);
  });

  it("ignores keys already queued", () => {
    const { enqueueAchievementUnlocks } = useAppStore.getState();

    enqueueAchievementUnlocks(["night_owl"]);
    enqueueAchievementUnlocks(["night_owl", "polyglot"]);

    expect(useAppStore.getState().achievementUnlockQueue).toEqual([
      "night_owl",
      "polyglot",
    ]);
  });

  it("dedupes within a single call", () => {
    useAppStore
      .getState()
      .enqueueAchievementUnlocks(["veteran", "veteran", "halloween"]);

    expect(useAppStore.getState().achievementUnlockQueue).toEqual([
      "veteran",
      "halloween",
    ]);
  });

  it("keeps the same queue reference when nothing new arrives", () => {
    const { enqueueAchievementUnlocks } = useAppStore.getState();

    enqueueAchievementUnlocks(["night_owl"]);
    const before = useAppStore.getState().achievementUnlockQueue;

    enqueueAchievementUnlocks(["night_owl"]);

    expect(useAppStore.getState().achievementUnlockQueue).toBe(before);
  });

  it("does nothing when given an empty list", () => {
    useAppStore.getState().enqueueAchievementUnlocks([]);

    expect(useAppStore.getState().achievementUnlockQueue).toEqual([]);
  });

  it("dismisses the oldest key first", () => {
    const { enqueueAchievementUnlocks, dismissAchievementUnlock } =
      useAppStore.getState();

    enqueueAchievementUnlocks(["night_owl", "veteran", "polyglot"]);
    dismissAchievementUnlock();

    expect(useAppStore.getState().achievementUnlockQueue).toEqual([
      "veteran",
      "polyglot",
    ]);
  });

  it("stays empty when dismissing an empty queue", () => {
    useAppStore.getState().dismissAchievementUnlock();

    expect(useAppStore.getState().achievementUnlockQueue).toEqual([]);
  });

  it("allows a key to be queued again after it was dismissed", () => {
    const { enqueueAchievementUnlocks, dismissAchievementUnlock } =
      useAppStore.getState();

    enqueueAchievementUnlocks(["night_owl"]);
    dismissAchievementUnlock();
    enqueueAchievementUnlocks(["night_owl"]);

    expect(useAppStore.getState().achievementUnlockQueue).toEqual(["night_owl"]);
  });
});

describe("post modal", () => {
  const post = { id: "post-1" } as Post;

  it("opens in create mode without a post", () => {
    useAppStore.getState().openCreatePostModal("saved");

    expect(useAppStore.getState().postModal).toEqual({
      isOpen: true,
      post: null,
      mode: "saved",
    });
  });

  it("opens in edit mode with the given post", () => {
    useAppStore.getState().openEditPostModal(post, "user");

    expect(useAppStore.getState().postModal).toEqual({
      isOpen: true,
      post,
      mode: "user",
    });
  });

  it("keeps the mode after closing so the list stays on the same tab", () => {
    const { openEditPostModal, closePostModal } = useAppStore.getState();

    openEditPostModal(post, "user");
    closePostModal();

    expect(useAppStore.getState().postModal).toEqual({
      isOpen: false,
      post: null,
      mode: "user",
    });
  });
});

describe("activeTab", () => {
  it("persists the tab to localStorage", () => {
    useAppStore.getState().setActiveTab(3);

    expect(useAppStore.getState().activeTab).toBe(3);
    expect(localStorage.getItem("activeTab")).toBe("3");
  });
});
