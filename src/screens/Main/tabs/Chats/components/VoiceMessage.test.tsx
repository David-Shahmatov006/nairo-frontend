import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VoiceMessage } from "./VoiceMessage";

const waveform = [10, 40, 80, 100, 60, 20];

describe("VoiceMessage", () => {
  const play = jest.fn().mockResolvedValue(undefined);
  const pause = jest.fn();

  beforeEach(() => {
    play.mockClear();
    pause.mockClear();
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: play,
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", {
      configurable: true,
      value: pause,
    });
    Object.defineProperty(HTMLMediaElement.prototype, "duration", {
      configurable: true,
      get: () => 4.2,
    });
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
