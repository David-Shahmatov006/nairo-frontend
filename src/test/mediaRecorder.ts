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

  get frequencyBinCount() {
    return this.fftSize / 2;
  }

  getByteTimeDomainData(buffer: Uint8Array) {
    buffer.fill(128);
  }

  // What wavesurfer's record plugin samples the live waveform with.
  getFloatTimeDomainData(buffer: Float32Array) {
    buffer.fill(0);
  }
}

export class FakeAudioContext {
  state: AudioContextState = "running";
  createMediaStreamSource = jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
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
  onpause: (() => void) | null = null;
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

  pause() {
    this.state = "paused";
    this.onpause?.();
  }

  resume() {
    this.state = "recording";
  }

  requestData() {
    this.ondataavailable?.({
      data: new Blob(["voice"], { type: this.mimeType }),
    });
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
  // jsdom ships no object-URL implementation, and the record plugin hands the
  // finished recording back to wavesurfer as one.
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

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

  URL.createObjectURL = jest.fn(() => "blob:voice");
  URL.revokeObjectURL = jest.fn();

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

      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;

      window.requestAnimationFrame = originalRaf;
      window.cancelAnimationFrame = originalCaf;
    },
  };
};
