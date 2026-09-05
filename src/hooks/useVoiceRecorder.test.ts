import { act, renderHook, waitFor } from "@testing-library/react";
import WaveSurfer from "wavesurfer.js";
import { useVoiceRecorder } from "./useVoiceRecorder";
import { installMediaMocks } from "../test/mediaRecorder";

// The renderer needs a canvas, which jsdom has none of. The record plugin
// itself runs for real on top of the media mocks.
jest.mock("wavesurfer.js", () => ({
  __esModule: true,
  default: { create: jest.fn() },
}));

type Listener = (...args: never[]) => void;

class FakeWaveSurfer {
  private listeners = new Map<string, Set<Listener>>();

  options = {};
  exportPeaks = jest.fn(() => [[0.2, 0.6, 1]]);
  load = jest.fn(() => Promise.resolve());
  setOptions = jest.fn();
  getWidth = jest.fn(() => 320);
  destroy = jest.fn();

  registerPlugin = <T>(plugin: T) => plugin;

  on = (event: string, listener: Listener) => {
    const listeners = this.listeners.get(event) ?? new Set<Listener>();

    listeners.add(listener);
    this.listeners.set(event, listeners);

    return () => {
      listeners.delete(listener);
    };
  };

  once = (event: string, listener: Listener) => {
    const unsubscribe = this.on(event, ((...args: never[]) => {
      unsubscribe();
      listener(...args);
    }) as Listener);

    return unsubscribe;
  };

  emit = (event: string) => {
    this.listeners.get(event)?.forEach((listener) => listener());
  };
}

describe("useVoiceRecorder", () => {
  let media: ReturnType<typeof installMediaMocks>;
  let wave: FakeWaveSurfer;

  beforeEach(() => {
    media = installMediaMocks();
    (WaveSurfer.create as jest.Mock).mockImplementation(() => {
      wave = new FakeWaveSurfer();
      return wave;
    });
  });

  afterEach(() => {
    media.restore();
  });

  it("records until stop and returns a blob with a waveform", async () => {
    const { result } = renderHook(() => useVoiceRecorder());

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.state).toBe("recording");
    expect(media.getUserMedia).toHaveBeenCalledWith({
      audio: { echoCancellation: true, noiseSuppression: true },
    });

    await act(async () => {
      const stopping = result.current.stop();
      // The plugin loads the finished recording back into wavesurfer; its
      // "ready" is what the exported waveform is read from.
      wave.emit("ready");
      await stopping;
    });

    expect(result.current.state).toBe("recorded");
    expect(result.current.result?.blob).toBeInstanceOf(Blob);
    expect(result.current.result?.waveform).toHaveLength(48);
    expect(wave.exportPeaks).toHaveBeenCalledWith({
      channels: 1,
      maxLength: 48,
    });
    expect(media.trackStop).toHaveBeenCalled();
  });

  it("still delivers the recording when the waveform cannot be decoded", async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useVoiceRecorder());

    await act(async () => {
      await result.current.start();
    });

    let recording: Awaited<ReturnType<typeof result.current.stop>> = null;

    await act(async () => {
      const stopping = result.current.stop().then((value) => {
        recording = value;
      });

      jest.advanceTimersByTime(2000);
      await stopping;
    });

    jest.useRealTimers();

    expect(result.current.state).toBe("recorded");
    expect(recording).not.toBeNull();
    expect(result.current.result?.waveform).toHaveLength(48);
  });

  it("goes to denied when the microphone is blocked", async () => {
    media.restore();
    media = installMediaMocks({
      getUserMedia: jest.fn(() =>
        Promise.reject(
          Object.assign(new Error("Permission denied"), {
            name: "NotAllowedError",
          }),
        ),
      ),
    });

    const { result } = renderHook(() => useVoiceRecorder());

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.state).toBe("denied");
  });

  it("stops tracks on cancel", async () => {
    const { result } = renderHook(() => useVoiceRecorder());

    await act(async () => {
      await result.current.start();
    });

    act(() => {
      result.current.cancel();
    });

    expect(result.current.state).toBe("idle");
    expect(result.current.result).toBeNull();
    expect(media.trackStop).toHaveBeenCalled();
  });

  it("marks the browser as unsupported without MediaRecorder", async () => {
    media.restore();
    Reflect.deleteProperty(window, "MediaRecorder");

    const { result } = renderHook(() => useVoiceRecorder());

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.state).toBe("unsupported");
  });

  it("stops tracks when the hook unmounts mid-recording", async () => {
    const { result, unmount } = renderHook(() => useVoiceRecorder());

    await act(async () => {
      await result.current.start();
    });

    unmount();

    await waitFor(() => {
      expect(media.trackStop).toHaveBeenCalled();
    });
  });
});
