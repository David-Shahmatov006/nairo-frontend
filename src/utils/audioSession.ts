// WebKit (Safari and every iOS browser) keeps the page's audio session in a
// recording-oriented category after getUserMedia is used, even once every
// track has been stopped: the next <audio> playback is routed to the earpiece
// at near-zero volume, so a just-recorded voice message sounds silent until
// it is played a second time.
//
// The Audio Session API (Safari 16.4+ / iOS 17+) is Apple's supported way out
// of that: switching the session to "playback" puts it back on the
// loudspeaker — and, as a bonus, keeps voice messages audible while the
// ringer switch is on mute.
//
// https://developer.mozilla.org/docs/Web/API/Navigator/audioSession
type AudioSessionType = "auto" | "playback" | "play-and-record";

type AudioSessionNavigator = Navigator & {
  audioSession?: { type: AudioSessionType };
};

const getAudioSession = () => {
  if (typeof navigator === "undefined") {
    return null;
  }

  return (navigator as AudioSessionNavigator).audioSession ?? null;
};

const setSessionType = (type: AudioSessionType) => {
  const session = getAudioSession();

  if (!session) {
    return false;
  }

  try {
    session.type = type;
    return true;
  } catch {
    // Best-effort only — a rejected assignment changes nothing.
    return false;
  }
};

// 8-bit mono PCM WAV, ~100ms of actual silence (800 bytes of value 128, the
// unsigned-8-bit midpoint).
const SILENT_AUDIO_SRC =
  "data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YSADAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==";

/**
 * Pre-iOS-17 fallback: play a throwaway silent clip to nudge WebKit into
 * re-evaluating the session. Far less reliable than the Audio Session API,
 * but it is all those versions have.
 */
const primeLegacyPlayback = () => {
  if (typeof Audio === "undefined") {
    return;
  }

  try {
    const audio = new Audio(SILENT_AUDIO_SRC);
    void audio.play()?.catch(() => undefined);
  } catch {
    // Best-effort only.
  }
};

/**
 * Call synchronously from the tap that starts playback: it hands WebKit a
 * playback-only session before the media element is asked to play.
 */
export const enterPlaybackSession = () => {
  if (!setSessionType("playback")) {
    primeLegacyPlayback();
  }
};

/**
 * Call before opening the microphone. An explicit "playback" session left
 * over from the last message must not keep the recorder from capturing.
 */
export const enterRecordingSession = () => {
  setSessionType("play-and-record");
};
