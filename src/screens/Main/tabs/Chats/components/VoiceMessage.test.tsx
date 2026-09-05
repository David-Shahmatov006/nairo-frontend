import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WaveSurfer from "wavesurfer.js";
import { VoiceMessage } from "./VoiceMessage";

// The renderer needs a canvas, which jsdom has none of.
jest.mock("wavesurfer.js", () => ({
  __esModule: true,
  default: { create: jest.fn() },
}));

const waveform = [10, 40, 80, 100, 60, 20];

type Listener = (...args: never[]) => void;

class FakeWaveSurfer {
  private listeners = new Map<string, Set<Listener>>();
  private playing = false;

  media = document.createElement("audio");

  setPlaybackRate = jest.fn();
  setOptions = jest.fn();
  setTime = jest.fn();
  destroy = jest.fn();
  getDuration = jest.fn(() => 4.2);
  getMediaElement = () => this.media;
  isPlaying = () => this.playing;

  play = jest.fn(async () => {
    this.playing = true;
    this.emit("play");
  });

  pause = jest.fn(() => {
    this.playing = false;
    this.emit("pause");
  });

  on = (event: string, listener: Listener) => {
    const listeners = this.listeners.get(event) ?? new Set<Listener>();

    listeners.add(listener);
    this.listeners.set(event, listeners);

    return () => {
      listeners.delete(listener);
    };
  };

  emit = (event: string, ...args: never[]) => {
    this.listeners.get(event)?.forEach((listener) => listener(...args));
  };
}

// enterPlaybackSession() also plays a throwaway <audio> when the Audio
// Session API is missing, and that shares the prototype spy — so count the
// calls that landed on the element under test.
const callsOn = (spy: jest.SpyInstance, target: EventTarget) =>
  spy.mock.contexts.filter((context) => context === target).length;

const renderVoiceMessage = (props: Partial<{ pending: boolean }> = {}) =>
  render(
    <VoiceMessage
      audioUrl="https://cdn.example.com/voice.webm"
      durationMs={4200}
      waveform={waveform}
      {...props}
    />,
  );

describe("VoiceMessage", () => {
  let wave: FakeWaveSurfer;
  let mediaPlay: jest.SpyInstance;
  let mediaPause: jest.SpyInstance;

  beforeEach(() => {
    // jsdom implements neither, and the warm-up below drives both.
    mediaPlay = jest
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
    mediaPause = jest
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => undefined);

    (WaveSurfer.create as jest.Mock).mockImplementation(() => {
      wave = new FakeWaveSurfer();
      return wave;
    });
  });

  it("renders the stored waveform without fetching the audio", () => {
    renderVoiceMessage();

    expect(WaveSurfer.create).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://cdn.example.com/voice.webm",
        peaks: [[0.1, 0.4, 0.8, 1, 0.6, 0.2]],
        duration: 4.2,
      }),
    );
  });

  it("warms the media element up before the first real playback", async () => {
    const user = userEvent.setup();

    renderVoiceMessage();
    await user.click(screen.getByRole("button", { name: "Play" }));

    // The throwaway play lands on the element itself, and only once it has
    // been rewound does wavesurfer get to start for real.
    expect(callsOn(mediaPlay, wave.media)).toBe(1);
    expect(wave.play).not.toHaveBeenCalled();

    await waitFor(() => expect(wave.play).toHaveBeenCalled());
    expect(mediaPause).toHaveBeenCalled();
    expect(wave.media.currentTime).toBe(0);
  });

  it("warms up only once per element", async () => {
    const user = userEvent.setup();

    renderVoiceMessage();
    await user.click(screen.getByRole("button", { name: "Play" }));
    await waitFor(() => expect(wave.play).toHaveBeenCalledTimes(1));

    await user.click(screen.getByRole("button", { name: "Pause" }));
    mediaPlay.mockClear();

    await user.click(screen.getByRole("button", { name: "Play" }));

    expect(wave.play).toHaveBeenCalledTimes(2);
    expect(callsOn(mediaPlay, wave.media)).toBe(0);
  });

  it("starts playback when play is pressed", async () => {
    const user = userEvent.setup();

    renderVoiceMessage();
    await user.click(screen.getByRole("button", { name: "Play" }));

    await waitFor(() => expect(wave.play).toHaveBeenCalled());
    expect(wave.setPlaybackRate).toHaveBeenCalledWith(1);
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  });

  it("pauses on the second press", async () => {
    const user = userEvent.setup();

    renderVoiceMessage();
    await user.click(screen.getByRole("button", { name: "Play" }));
    await screen.findByRole("button", { name: "Pause" });

    await user.click(screen.getByRole("button", { name: "Pause" }));

    expect(wave.pause).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("hands WebKit a playback audio session before playing", async () => {
    const user = userEvent.setup();
    const audioSession = { type: "auto" };

    Object.defineProperty(navigator, "audioSession", {
      configurable: true,
      value: audioSession,
    });

    renderVoiceMessage();
    await user.click(screen.getByRole("button", { name: "Play" }));

    expect(audioSession.type).toBe("playback");

    Reflect.deleteProperty(navigator, "audioSession");
  });

  it("counts down the remaining time while playing", async () => {
    const user = userEvent.setup();

    renderVoiceMessage();
    await user.click(screen.getByRole("button", { name: "Play" }));
    await waitFor(() => expect(wave.play).toHaveBeenCalled());

    act(() => {
      wave.emit("timeupdate", 2.1 as never);
    });

    expect(screen.getByText("0:02")).toBeInTheDocument();
  });

  it("ignores progress reported during the warm-up", async () => {
    const user = userEvent.setup();

    renderVoiceMessage();
    await user.click(screen.getByRole("button", { name: "Play" }));

    act(() => {
      wave.emit("timeupdate", 2.1 as never);
    });

    // Still the full duration: the warm-up must not move the progress.
    expect(screen.getByText("0:04")).toBeInTheDocument();

    await waitFor(() => expect(wave.play).toHaveBeenCalled());
  });

  it("cycles playback speed", async () => {
    const user = userEvent.setup();

    renderVoiceMessage();

    await user.click(screen.getByRole("button", { name: "1x" }));
    expect(wave.setPlaybackRate).toHaveBeenLastCalledWith(1.5);

    await user.click(screen.getByRole("button", { name: "1.5x" }));
    expect(wave.setPlaybackRate).toHaveBeenLastCalledWith(2);
  });

  it("does not play a pending message", async () => {
    const user = userEvent.setup();

    renderVoiceMessage({ pending: true });
    await user.click(screen.getByRole("button", { name: "Play" }));

    expect(callsOn(mediaPlay, wave.media)).toBe(0);
    expect(wave.play).not.toHaveBeenCalled();
  });
});
