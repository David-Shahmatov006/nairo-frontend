import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ChristmasMusic, ChristmasMusicButton } from "./ChristmasMusic";
import { useChristmasMusicStore } from "../../stores/christmasMusic";

jest.mock("../../constants/seasonalTheme", () => ({ SEASONAL_THEME: "christmas" }));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

let paused: WeakSet<HTMLMediaElement>;
let play: jest.SpyInstance;

beforeEach(() => {
  localStorage.clear();
  useChristmasMusicStore.setState({ enabled: false, playing: false, recording: false, failed: false });
  Object.defineProperty(document, "hidden", { configurable: true, value: false });
  paused = new WeakSet();
  jest.spyOn(HTMLMediaElement.prototype, "paused", "get").mockImplementation(function (this: HTMLMediaElement) {
    return !paused.has(this);
  });
  play = jest.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
    paused.add(this);
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  });
  jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (this: HTMLMediaElement) {
    if (!paused.has(this)) return;
    paused.delete(this);
    this.dispatchEvent(new Event("pause"));
  });
});

afterEach(() => { cleanup(); jest.restoreAllMocks(); });

const flush = async () => { await act(async () => { await Promise.resolve(); }); };

it("starts only after opt-in, loops quietly, and remembers the preference", async () => {
  const { container } = render(<><ChristmasMusic /><ChristmasMusicButton /></>);
  const audio = container.querySelector("audio")!;
  expect(play).not.toHaveBeenCalled();
  expect(audio.preload).toBe("none");
  expect(audio.loop).toBe(true);
  expect(audio.volume).toBe(.15);
  fireEvent.click(screen.getByRole("button"));
  await flush();
  expect(play).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem("nairo:christmas-music")).toBe("on");
  fireEvent.click(screen.getByRole("button"));
  expect(audio.paused).toBe(true);
  expect(localStorage.getItem("nairo:christmas-music")).toBe("off");
});

it("pauses while hidden and resumes only if still enabled", async () => {
  const { container } = render(<ChristmasMusic />);
  act(() => useChristmasMusicStore.getState().setEnabled(true));
  await flush();
  const audio = container.querySelector("audio")!;
  Object.defineProperty(document, "hidden", { configurable: true, value: true });
  fireEvent(document, new Event("visibilitychange"));
  expect(audio.paused).toBe(true);
  act(() => useChristmasMusicStore.getState().setEnabled(false));
  Object.defineProperty(document, "hidden", { configurable: true, value: false });
  fireEvent(document, new Event("visibilitychange"));
  expect(audio.paused).toBe(true);
});

it("pauses for voice recording and other media without losing the preference", async () => {
  const { container } = render(<ChristmasMusic />);
  act(() => useChristmasMusicStore.getState().setEnabled(true));
  await flush();
  const music = container.querySelector("audio")!;
  act(() => useChristmasMusicStore.setState({ recording: true }));
  expect(music.paused).toBe(true);
  act(() => useChristmasMusicStore.setState({ recording: false }));
  await flush();
  expect(music.paused).toBe(false);
  const voice = document.createElement("audio");
  document.body.appendChild(voice);
  fireEvent(voice, new Event("play"));
  expect(music.paused).toBe(true);
  fireEvent(voice, new Event("ended"));
  await flush();
  expect(music.paused).toBe(false);
  expect(useChristmasMusicStore.getState().enabled).toBe(true);
  voice.remove();
});

it("keeps a remembered preference when autoplay requires another gesture", async () => {
  play.mockRejectedValueOnce(new DOMException("Blocked", "NotAllowedError"));
  act(() => useChristmasMusicStore.getState().setEnabled(true));
  render(<ChristmasMusic />);
  await flush();
  expect(useChristmasMusicStore.getState().enabled).toBe(true);
  expect(useChristmasMusicStore.getState().failed).toBe(false);
  fireEvent.pointerDown(document);
  await flush();
  expect(play).toHaveBeenCalledTimes(2);
});
