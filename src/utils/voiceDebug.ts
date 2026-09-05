// Temporary instrumentation for the "first playback is silent on iOS" bug.
// Enable by opening the app with ?debug=1 (the flag sticks until ?debug=0),
// which mounts vconsole so the log is readable on the phone itself.
const FLAG_KEY = "voice-debug";

let enabled: boolean | null = null;

export const isVoiceDebugEnabled = (): boolean => {
  if (enabled !== null) {
    return enabled;
  }

  if (typeof window === "undefined") {
    enabled = false;
    return enabled;
  }

  try {
    const flag = new URLSearchParams(window.location.search).get("debug");

    if (flag === "1") {
      localStorage.setItem(FLAG_KEY, "1");
    }

    if (flag === "0") {
      localStorage.removeItem(FLAG_KEY);
    }

    enabled = localStorage.getItem(FLAG_KEY) === "1";
  } catch {
    enabled = false;
  }

  return enabled;
};

export const logVoice = (event: string, data?: Record<string, unknown>) => {
  if (!isVoiceDebugEnabled()) {
    return;
  }

  console.log(`[voice] ${event}`, data ?? "");
};

type AudioSessionNavigator = Navigator & {
  audioSession?: { type: string };
};

export const initVoiceDebug = async () => {
  if (!isVoiceDebugEnabled()) {
    return;
  }

  try {
    const { default: VConsole } = await import("vconsole");
    new VConsole();

    logVoice("environment", {
      ua: navigator.userAgent,
      audioSession:
        (navigator as AudioSessionNavigator).audioSession?.type ?? "absent",
      secureContext: window.isSecureContext,
      canPlayMp4: document.createElement("audio").canPlayType("audio/mp4"),
      canPlayWebm: document
        .createElement("audio")
        .canPlayType("audio/webm;codecs=opus"),
    });
  } catch (error) {
    console.error("[voice] failed to start the debug console", error);
  }
};

const MEDIA_EVENTS = [
  "loadstart",
  "loadedmetadata",
  "loadeddata",
  "canplay",
  "canplaythrough",
  "play",
  "playing",
  "waiting",
  "stalled",
  "suspend",
  "pause",
  "ended",
  "error",
  "volumechange",
  "ratechange",
] as const;

export const mediaSnapshot = (media: HTMLMediaElement) => ({
  readyState: media.readyState,
  networkState: media.networkState,
  paused: media.paused,
  muted: media.muted,
  volume: media.volume,
  rate: media.playbackRate,
  currentTime: Number(media.currentTime.toFixed(2)),
  duration: media.duration,
  buffered: media.buffered.length,
  error: media.error?.code ?? null,
  src: media.currentSrc.slice(-50),
});

export const attachMediaLogger = (media: HTMLMediaElement, label: string) => {
  if (!isVoiceDebugEnabled()) {
    return () => undefined;
  }

  const detachers = MEDIA_EVENTS.map((event) => {
    const handler = () => logVoice(`${label} ${event}`, mediaSnapshot(media));

    media.addEventListener(event, handler);

    return () => media.removeEventListener(event, handler);
  });

  return () => detachers.forEach((detach) => detach());
};

/**
 * Asks the audio host for the first two bytes: a server that answers 200
 * instead of 206, or with the wrong content type, breaks WebKit's media
 * pipeline in exactly the way this bug looks like.
 */
export const probeAudioUrl = async (url: string) => {
  if (!isVoiceDebugEnabled() || url.startsWith("blob:")) {
    return;
  }

  try {
    const response = await fetch(url, { headers: { Range: "bytes=0-1" } });

    logVoice("range probe", {
      status: response.status,
      contentType: response.headers.get("content-type"),
      acceptRanges: response.headers.get("accept-ranges"),
      contentRange: response.headers.get("content-range"),
      contentLength: response.headers.get("content-length"),
      cors: response.headers.get("access-control-allow-origin"),
    });
  } catch (error) {
    logVoice("range probe failed", { message: String(error) });
  }
};
