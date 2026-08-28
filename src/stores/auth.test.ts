import { useAuthStore } from "./auth";
import type { User } from "../types/user";

const initialState = useAuthStore.getState();

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: "user-1",
  email: "a@b.com",
  username: "nairo",
  firstName: "Ada",
  lastName: "Lovelace",
  nairoBalance: 0,
  isPremium: false,
  preferredLanguage: "en",
  interests: [],
  followers: [],
  followings: [],
  referralCode: "CODE",
  inviteRewards: 0,
  ...overrides,
});

beforeEach(() => {
  useAuthStore.setState(initialState, true);
  localStorage.clear();
});

describe("useAuthStore", () => {
  it("starts logged out", () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("stores the user", () => {
    const user = makeUser();

    useAuthStore.getState().setUser(user);

    expect(useAuthStore.getState().user).toEqual(user);
  });

  it("stores the token", () => {
    useAuthStore.getState().setToken("jwt-123");

    expect(useAuthStore.getState().token).toBe("jwt-123");
  });
});

describe("updateUser", () => {
  it("does nothing when there is no user", () => {
    useAuthStore.getState().updateUser({ firstName: "Grace" });

    expect(useAuthStore.getState().user).toBeNull();
  });

  it("merges the partial into the current user", () => {
    useAuthStore.getState().setUser(makeUser());
    useAuthStore.getState().updateUser({ firstName: "Grace", isPremium: true });

    const user = useAuthStore.getState().user;

    expect(user).toMatchObject({
      firstName: "Grace",
      isPremium: true,
      lastName: "Lovelace",
      username: "nairo",
    });
  });

  it("replaces the user object instead of mutating it", () => {
    const user = makeUser();

    useAuthStore.getState().setUser(user);
    useAuthStore.getState().updateUser({ nairoBalance: 50 });

    expect(useAuthStore.getState().user).not.toBe(user);
    expect(user.nairoBalance).toBe(0);
  });

  it("can clear an optional field", () => {
    useAuthStore.getState().setUser(makeUser({ avatar: "old.png" }));
    useAuthStore.getState().updateUser({ avatar: undefined });

    expect(useAuthStore.getState().user?.avatar).toBeUndefined();
  });
});
