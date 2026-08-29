export type FakeMediaTrack = {
  stop: jest.Mock;
};

export type InstalledMediaMocks = {
  getUserMedia: jest.Mock;
  trackStop: jest.Mock;
  mediaRecorderInstances: FakeMediaRecorder[];
  restore: () => void;
};

export class FakeAnalyser {
  fftSize = 2048;

  getByteTimeDomainData(buffer: Uint8Array) {
    buffer.fill(128);
  }
}

export class FakeAudioContext {
  state: AudioContextState = "running";
  createMediaStreamSource = jest.fn(() => ({
    connect: jest.fn(),
  }));
  createAnalyser = jest.fn(() => new FakeAnalyser());
  resume = jest.fn(() => Promise.resolve());
  close = jest.fn(() => Promise.resolve());
}

export class FakeMediaRecorder {
  static isTypeSupported = jest.fn(() => true);

  state: RecordingState = "inactive";
  mimeType: string;
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  stream: MediaStream;

  constructor(stream: MediaStream, options?: MediaRecorderOptions) {
    this.stream = stream;
    this.mimeType = options?.mimeType ?? "audio/webm";
  }

  start() {
    this.state = "recording";
  }

  stop() {
    this.state = "inactive";
    this.ondataavailable?.({
      data: new Blob(["voice"], { type: this.mimeType }),
    });
    this.onstop?.();
  }
}

export const installMediaMocks = (
  options: {
    getUserMedia?: () => Promise<MediaStream>;
  } = {},
): InstalledMediaMocks => {
  const trackStop = jest.fn();
  const defaultStream = {
    getTracks: () => [{ stop: trackStop }],
  } as unknown as MediaStream;

  const getUserMedia =
    options.getUserMedia ??
    jest.fn(() => Promise.resolve(defaultStream));

  const mediaRecorderInstances: FakeMediaRecorder[] = [];
  const OriginalMediaRecorder = window.MediaRecorder;
  const OriginalAudioContext = window.AudioContext;
  const originalMediaDevices = navigator.mediaDevices;
  const originalRaf = window.requestAnimationFrame;
  const originalCaf = window.cancelAnimationFrame;

  class TrackingMediaRecorder extends FakeMediaRecorder {
    constructor(stream: MediaStream, recorderOptions?: MediaRecorderOptions) {
      super(stream, recorderOptions);
      mediaRecorderInstances.push(this);
    }
  }

  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  });

  Object.defineProperty(window, "MediaRecorder", {
    configurable: true,
    writable: true,
    value: TrackingMediaRecorder,
  });

  Object.defineProperty(window, "AudioContext", {
    configurable: true,
    writable: true,
    value: FakeAudioContext,
  });

  window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
    return window.setTimeout(() => cb(0), 0) as unknown as number;
  }) as typeof window.requestAnimationFrame;

  window.cancelAnimationFrame = ((id: number) => {
    window.clearTimeout(id);
  }) as typeof window.cancelAnimationFrame;

  return {
    getUserMedia: getUserMedia as jest.Mock,
    trackStop,
    mediaRecorderInstances,
    restore: () => {
      if (OriginalMediaRecorder) {
        Object.defineProperty(window, "MediaRecorder", {
          configurable: true,
          writable: true,
          value: OriginalMediaRecorder,
        });
      } else {
        Reflect.deleteProperty(window, "MediaRecorder");
      }

      if (OriginalAudioContext) {
        Object.defineProperty(window, "AudioContext", {
          configurable: true,
          writable: true,
          value: OriginalAudioContext,
        });
      } else {
        Reflect.deleteProperty(window, "AudioContext");
      }

      Object.defineProperty(navigator, "mediaDevices", {
        configurable: true,
        value: originalMediaDevices,
      });

      window.requestAnimationFrame = originalRaf;
      window.cancelAnimationFrame = originalCaf;
    },
  };
};
