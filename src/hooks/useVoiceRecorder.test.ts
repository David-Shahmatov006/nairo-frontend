import { act, renderHook, waitFor } from "@testing-library/react";
import { useVoiceRecorder } from "./useVoiceRecorder";
import { installMediaMocks } from "../test/mediaRecorder";

describe("useVoiceRecorder", () => {
  let media: ReturnType<typeof installMediaMocks>;

  beforeEach(() => {
    media = installMediaMocks();
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
      await result.current.stop();
    });

    expect(result.current.state).toBe("recorded");
    expect(result.current.result?.blob).toBeInstanceOf(Blob);
    expect(result.current.result?.waveform).toHaveLength(48);
    expect(media.trackStop).toHaveBeenCalled();
  });

  it("goes to denied when the microphone is blocked", async () => {
    media.restore();
    media = installMediaMocks({
      getUserMedia: jest.fn(() =>
        Promise.reject(Object.assign(new Error("denied"), { name: "NotAllowedError" })),
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
