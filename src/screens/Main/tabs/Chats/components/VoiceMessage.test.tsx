import { act, render, screen } from "@testing-library/react";
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
  private media = document.createElement("audio");

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

  beforeEach(() => {
    // Without navigator.audioSession the component falls back to priming a
    // throwaway <audio>, which jsdom refuses to play.
    jest.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);

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

  it("starts playback when play is pressed", async () => {
    const user = userEvent.setup();

    renderVoiceMessage();
    await user.click(screen.getByRole("button", { name: "Play" }));

    expect(wave.play).toHaveBeenCalled();
    expect(wave.setPlaybackRate).toHaveBeenCalledWith(1);
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  });

  it("pauses on the second press", async () => {
    const user = userEvent.setup();

    renderVoiceMessage();
    await user.click(screen.getByRole("button", { name: "Play" }));
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

    act(() => {
      wave.emit("timeupdate", 2.1 as never);
    });

    expect(screen.getByText("0:02")).toBeInTheDocument();
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

    expect(wave.play).not.toHaveBeenCalled();
  });
});
