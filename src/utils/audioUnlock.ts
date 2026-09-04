// 8-bit mono PCM WAV, ~100ms of actual silence (800 bytes of value 128, the
// unsigned-8-bit midpoint). A header with an empty `data` chunk decodes to
// nothing and never engages the browser's real audio-output pipeline, so it
// wound up being a no-op — verified byte-by-byte before swapping it in.
const SILENT_AUDIO_SRC =
  "data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YSADAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==";

/**
 * WebKit (Safari and every iOS browser, since iOS forces them all onto
 * WebKit) leaves the page's audio session in a recording-oriented mode
 * after getUserMedia is used, even once every track has been stopped: the
 * very next <audio> playback on the page comes out silent (or is routed to
 * the earpiece instead of the speaker), and only settles into normal
 * loudspeaker playback starting with the *second* attempt.
 *
 * Playing a throwaway silent clip here — called synchronously from the same
 * tap that stops/cancels the recording, so it still counts as user-gesture
 * triggered — gives WebKit a head start on that session switch well before
 * the user actually taps play on the voice message they just sent.
 */
export const primeAudioPlayback = () => {
  if (typeof Audio === "undefined") {
    return;
  }

  try {
    const audio = new Audio(SILENT_AUDIO_SRC);
    void audio.play()?.catch(() => undefined);
  } catch {
    // Best-effort only — a rejected/thrown priming attempt changes nothing.
  }
};
