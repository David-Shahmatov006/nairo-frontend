import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VoiceMessage } from "./VoiceMessage";

const waveform = [10, 40, 80, 100, 60, 20];

const setMediaProperty = (name: string, descriptor: PropertyDescriptor) => {
  Object.defineProperty(HTMLMediaElement.prototype, name, {
    configurable: true,
    ...descriptor,
  });
};

describe("VoiceMessage", () => {
  const play = jest.fn().mockResolvedValue(undefined);
  const pause = jest.fn();

  beforeEach(() => {
    play.mockClear();
    play.mockResolvedValue(undefined);
    pause.mockClear();
    setMediaProperty("play", { value: play });
    setMediaProperty("pause", { value: pause });
    setMediaProperty("duration", { get: () => 4.2 });
    setMediaProperty("currentTime", { get: () => 0, set: () => {} });
  });

  it("starts playback when play is pressed", async () => {
    const user = userEvent.setup();

    render(
      <VoiceMessage
        audioUrl="https://cdn.example.com/voice.webm"
        durationMs={4200}
        waveform={waveform}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Play" }));

    expect(play).toHaveBeenCalled();
  });

  it("retries playback when the first play() is dropped before the media is ready", async () => {
    const user = userEvent.setup();
    play.mockRejectedValueOnce(
      Object.assign(new Error("interrupted"), { name: "AbortError" }),
    );

    const { container } = render(
      <VoiceMessage
        audioUrl="https://cdn.example.com/voice.webm"
        durationMs={4200}
        waveform={waveform}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(play).toHaveBeenCalledTimes(1);

    const audio = container.querySelector("audio")!;
    fireEvent(audio, new Event("canplay"));

    await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  });

  it("tracks progress with the recorded duration when the file reports no duration", () => {
    setMediaProperty("duration", { get: () => Infinity });
    setMediaProperty("currentTime", { get: () => 2.1, set: () => {} });

    const { container } = render(
      <VoiceMessage
        audioUrl="https://cdn.example.com/voice.webm"
        durationMs={4200}
        waveform={waveform}
      />,
    );

    fireEvent(container.querySelector("audio")!, new Event("timeupdate"));

    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
  });

  it("seeks to a finite time when the file reports no duration", () => {
    const setCurrentTime = jest.fn();
    setMediaProperty("duration", { get: () => Infinity });
    setMediaProperty("currentTime", { get: () => 0, set: setCurrentTime });

    render(
      <VoiceMessage
        audioUrl="https://cdn.example.com/voice.webm"
        durationMs={4200}
        waveform={waveform}
      />,
    );

    const slider = screen.getByRole("slider");
    jest
      .spyOn(slider, "getBoundingClientRect")
      .mockReturnValue({ left: 0, width: 100 } as DOMRect);

    fireEvent.click(slider, { clientX: 50 });

    expect(setCurrentTime).toHaveBeenCalledWith(2.1);
  });

  it("cycles playback speed", async () => {
    const user = userEvent.setup();

    render(
      <VoiceMessage
        audioUrl="https://cdn.example.com/voice.webm"
        durationMs={4200}
        waveform={waveform}
      />,
    );

    const rate = screen.getByRole("button", { name: "1x" });
    await user.click(rate);
    expect(screen.getByRole("button", { name: "1.5x" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "1.5x" }));
    expect(screen.getByRole("button", { name: "2x" })).toBeInTheDocument();
  });

  it("does not play a pending message", async () => {
    const user = userEvent.setup();

    render(
      <VoiceMessage
        audioUrl="blob:pending"
        durationMs={4200}
        waveform={waveform}
        pending
      />,
    );

    await user.click(screen.getByRole("button", { name: "Play" }));

    expect(play).not.toHaveBeenCalled();
  });
});
