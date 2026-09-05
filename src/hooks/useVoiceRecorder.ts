import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import { peaksToBars, WAVEFORM_BARS } from "../utils/audioPeaks";
import { enterRecordingSession } from "../utils/audioSession";

export const VOICE_MIN_DURATION_MS = 500;
export const VOICE_MAX_DURATION_MS = 120_000;

// The waveform sent to the API is exported from the decoded recording. If
// decoding stalls, the message still goes out — just with a flat waveform.
const PEAKS_TIMEOUT_MS = 1500;

const FLAT_WAVEFORM = Array.from({ length: WAVEFORM_BARS }, () => 0);

export type VoiceRecorderState =
  | "idle"
  | "requesting"
  | "recording"
  | "recorded"
  | "denied"
  | "unsupported";

export type VoiceRecording = {
  blob: Blob;
  durationMs: number;
  waveform: number[];
};

// The record plugin rethrows the getUserMedia failure as a plain Error, so
// the original DOMException name is gone by the time it reaches us.
const isPermissionError = (error: unknown) =>
  /not ?allowed|permission|denied/i.test(
    error instanceof Error ? error.message : "",
  );

const exportWaveform = (wave: WaveSurfer) =>
  new Promise<number[]>((resolve) => {
    const finish = (waveform: number[]) => {
      window.clearTimeout(timeout);
      unsubscribe();
      resolve(waveform);
    };

    // The plugin loads the finished recording into the same instance, so the
    // next "ready" is the decoded audio rather than a live waveform frame.
    const unsubscribe = wave.once("ready", () => {
      try {
        const [channel] = wave.exportPeaks({
          channels: 1,
          maxLength: WAVEFORM_BARS,
        });

        finish(channel ? peaksToBars(channel) : FLAT_WAVEFORM);
      } catch {
        finish(FLAT_WAVEFORM);
      }
    });

    const timeout = window.setTimeout(
      () => finish(FLAT_WAVEFORM),
      PEAKS_TIMEOUT_MS,
    );
  });

export const useVoiceRecorder = () => {
  const [state, setState] = useState<VoiceRecorderState>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result, setResult] = useState<VoiceRecording | null>(null);

  // The recording UI mounts only once recording has started, so the live
  // waveform is drawn into an element this hook owns and moves into the
  // ChatInput slot as soon as that slot exists.
  const hostRef = useRef<HTMLDivElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<WaveSurfer | null>(null);
  const recordRef = useRef<RecordPlugin | null>(null);
  const resultRef = useRef<VoiceRecording | null>(null);
  const cancelledRef = useRef(false);
  const stopPromiseRef = useRef<{
    resolve: (value: VoiceRecording | null) => void;
  } | null>(null);

  const waveContainerRef = useCallback((slot: HTMLDivElement | null) => {
    slotRef.current = slot;

    const host = hostRef.current;

    if (host && slot && host.parentElement !== slot) {
      slot.appendChild(host);
    }
  }, []);

  const tearDown = useCallback(() => {
    recordRef.current?.destroy();
    recordRef.current = null;

    waveRef.current?.destroy();
    waveRef.current = null;

    hostRef.current?.remove();
    hostRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;

    stopPromiseRef.current?.resolve(null);
    stopPromiseRef.current = null;

    tearDown();

    resultRef.current = null;
    setResult(null);
    setElapsedMs(0);
    setState("idle");
  }, [tearDown]);

  const stop = useCallback((): Promise<VoiceRecording | null> => {
    const record = recordRef.current;

    if (!record || !record.isRecording()) {
      return Promise.resolve(resultRef.current);
    }

    return new Promise((resolve) => {
      stopPromiseRef.current = { resolve };
      record.stopRecording();
    });
  }, []);

  const start = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setState("unsupported");
      return;
    }

    tearDown();
    cancelledRef.current = false;
    resultRef.current = null;
    setResult(null);
    setElapsedMs(0);
    setState("requesting");

    // An explicit playback session left over from the last message must not
    // keep the microphone from opening.
    enterRecordingSession();

    const host = document.createElement("div");
    hostRef.current = host;

    if (slotRef.current) {
      slotRef.current.appendChild(host);
    }

    const wave = WaveSurfer.create({
      container: host,
      height: 24,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      cursorWidth: 0,
      interact: false,
      waveColor: "rgba(139, 83, 255, .8)",
      progressColor: "rgba(139, 83, 255, .8)",
    });

    const record = wave.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: true,
        scrollingWaveformWindow: 3,
        // Loads the finished recording back into the instance, which is what
        // exportWaveform() below decodes the peaks from.
        renderRecordedAudio: true,
        mediaRecorderTimeslice: 250,
      }),
    );

    waveRef.current = wave;
    recordRef.current = record;

    record.on("record-progress", (duration) => {
      const reachedMax = duration >= VOICE_MAX_DURATION_MS;

      // The plugin reports progress on every animation frame, while the
      // timer next to it only ever shows whole seconds.
      setElapsedMs((previous) =>
        reachedMax || Math.abs(duration - previous) >= 100 ? duration : previous,
      );

      if (reachedMax && record.isRecording()) {
        record.stopRecording();
      }
    });

    record.on("record-end", (blob) => {
      if (cancelledRef.current) {
        return;
      }

      const durationMs = Math.round(record.getDuration());

      void exportWaveform(wave).then((waveform) => {
        if (cancelledRef.current) {
          return;
        }

        const recording: VoiceRecording = { blob, durationMs, waveform };

        resultRef.current = recording;
        tearDown();
        setResult(recording);
        setState("recorded");
        stopPromiseRef.current?.resolve(recording);
        stopPromiseRef.current = null;
      });
    });

    try {
      await record.startRecording({
        echoCancellation: true,
        noiseSuppression: true,
      });

      setState("recording");
    } catch (error) {
      tearDown();
      setState(isPermissionError(error) ? "denied" : "unsupported");
    }
  }, [tearDown]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      tearDown();
    };
  }, [tearDown]);

  return {
    state,
    elapsedMs,
    waveContainerRef,
    result,
    start,
    stop,
    cancel,
  };
};
