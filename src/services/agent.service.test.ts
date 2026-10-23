import * as seasonalTheme from "../constants/seasonalTheme";
import { agentService } from "./agent.service";
import { $api } from "./interceptor";
import { useAppStore } from "../stores/app";
import { useAuthStore } from "../stores/auth";
import { userService } from "./user.service";
import i18n from "../i18n";

jest.mock("./interceptor", () => ({ $api: { post: jest.fn() } }));
jest.mock("../stores/app", () => ({ useAppStore: { getState: jest.fn() } }));
jest.mock("../stores/auth", () => ({ useAuthStore: { getState: jest.fn() } }));
jest.mock("./user.service", () => ({ userService: { changeLanguage: jest.fn() } }));
jest.mock("../i18n", () => ({ __esModule: true, default: { changeLanguage: jest.fn().mockResolvedValue(undefined) } }));
jest.mock("swr", () => ({ mutate: jest.fn() }));

jest.mock("../constants/seasonalTheme", () => ({ __esModule: true, SEASONAL_THEME: "christmas" }));
jest.mock("../stores/christmasMusic", () => ({ useChristmasMusicStore: { getState: () => ({ enabled: false, setEnabled: mockSetMusicEnabled }) } }));

const mockSetMusicEnabled = jest.fn();
const setTheme = jest.fn();
const openCreatePostModal = jest.fn();
const setSelectedLanguage = jest.fn();
const updateUser = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  jest.mocked(useAppStore.getState).mockReturnValue({ setTheme, openCreatePostModal, setSelectedLanguage, enqueueAchievementUnlocks: jest.fn() } as unknown as ReturnType<typeof useAppStore.getState>);
  jest.mocked(useAuthStore.getState).mockReturnValue({ user: { id: "alice" }, updateUser } as unknown as ReturnType<typeof useAuthStore.getState>);
});

it("applies and persists a language action across the UI and user profile", async () => {
  jest.mocked($api.post).mockResolvedValueOnce({ data: { message: "Done", actions: [{ type: "setLanguage", value: "uk" }] } });
  jest.mocked(userService.changeLanguage).mockResolvedValueOnce({});
  await agentService.chat("Switch to Ukrainian");
  expect(userService.changeLanguage).toHaveBeenCalledWith("uk");
  expect(updateUser).toHaveBeenCalledWith({ preferredLanguage: "uk" });
  expect(setSelectedLanguage).toHaveBeenCalledWith(expect.objectContaining({ code: "uk" }));
  expect(i18n.changeLanguage).toHaveBeenCalledWith("uk");
  expect(localStorage.getItem("language")).toBe("uk");
});

it("ignores unsupported language actions", async () => {
  jest.mocked($api.post).mockResolvedValueOnce({ data: { message: "Hello", actions: [{ type: "setLanguage", value: "unsupported" }] } });
  await agentService.chat("Hello");
  expect(userService.changeLanguage).not.toHaveBeenCalled();
  expect(i18n.changeLanguage).not.toHaveBeenCalled();
});

it("executes backend actions and returns the reply", async () => {
  jest.mocked($api.post).mockResolvedValueOnce({ data: {
    message: "Done", actions: [{ type: "setTheme", value: "dark" }, { type: "openCreatePost" }],
  } });
  expect(await agentService.chat("Open editor and change theme")).toBe("Done");
  expect(setTheme).toHaveBeenCalledWith("dark");
  expect(openCreatePostModal).toHaveBeenCalledWith("all");
  expect(setTheme).toHaveBeenCalledTimes(1);
  expect(openCreatePostModal).toHaveBeenCalledTimes(1);
});

it.each([undefined, null, {}, [null, 1, {}, { type: "setTheme", value: "invalid" }, { type: "unknown" }]])(
  "ignores unsupported action data: %j", async (actions) => {
    jest.mocked($api.post).mockResolvedValueOnce({ data: { message: "Hello", actions } });
    expect(await agentService.chat("Hello")).toBe("Hello");
    expect(setTheme).not.toHaveBeenCalled();
    expect(openCreatePostModal).not.toHaveBeenCalled();
  },
);

it("does not execute actions on an invalid reply", async () => {
  jest.mocked($api.post).mockResolvedValueOnce({ data: { message: "", actions: [{ type: "openCreatePost" }] } });
  await expect(agentService.chat("Open editor")).rejects.toThrow();
  expect(openCreatePostModal).not.toHaveBeenCalled();
});

it.each(["on", "off"])("executes setMusic %s using the shared music preference", async (value) => {
  jest.mocked($api.post).mockResolvedValueOnce({ data: {
    message: "Done", actions: [{ type: "setMusic", value }],
  } });
  await agentService.chat(value === "on" ? "Turn on music" : "Turn off music");
  expect(mockSetMusicEnabled).toHaveBeenCalledWith(value === "on");
  expect($api.post).toHaveBeenCalledWith("/ai/agent/chat", expect.objectContaining({
    musicAvailable: true,
    musicEnabled: false,
  }));
});

it("ignores invalid music values", async () => {
  jest.mocked($api.post).mockResolvedValueOnce({ data: {
    message: "Done", actions: [{ type: "setMusic", value: "loud" }],
  } });
  await agentService.chat("Music");
  expect(mockSetMusicEnabled).not.toHaveBeenCalled();
});

it("rejects enabling music outside Christmas but still allows disabling it", async () => {
  jest.replaceProperty(seasonalTheme, "SEASONAL_THEME", "halloween");
  jest.mocked($api.post).mockResolvedValueOnce({ data: {
    message: "Unavailable", actions: [{ type: "setMusic", value: "on" }],
  } });
  await agentService.chat("Turn on music");
  expect(mockSetMusicEnabled).not.toHaveBeenCalled();
  expect($api.post).toHaveBeenCalledWith("/ai/agent/chat", expect.objectContaining({ musicAvailable: false }));
  jest.mocked($api.post).mockResolvedValueOnce({ data: {
    message: "Done", actions: [{ type: "setMusic", value: "off" }],
  } });
  await agentService.chat("Turn off music");
  expect(mockSetMusicEnabled).toHaveBeenCalledWith(false);
});
